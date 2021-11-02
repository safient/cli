import delay from 'delay'
import fs from 'fs'
import { Request, Response } from 'express'

import { Safient } from '../lib/safient'
import { Safe, SafeData, safeStages } from '../types'
import { info } from '../utils/message'

export const getSafe = async (
  req: Request,
  res: Response,
  safient: Safient,
): Promise<void> => {
  const safeId: string = req.query.id ? req.query.id.toString() : ''

  const safe = await safient.showSafe(safeId)
  res.json({ safe })
}

export const watchSafes = async (safient: Safient) => {
  for (;;) {
    // Poll safe details for every 5 seconds
    await delay(5000)
    const guardableSafes: Safe[] = await safient
      .mySafes()
      .then(safes => safes.filter((safe: Safe) => safe.type == 'guardian'))
    console.log(info('Total guardable safes: '), guardableSafes.length)

    const watchedSafes = JSON.parse(fs.readFileSync('safe.json').toString())
    const safe: Promise<(SafeData | undefined)[]> = Promise.all(
      guardableSafes.map(safe => safient.showSafe(safe.safeId)),
    )
    const safeData = await safe

    // Fetch the recoverable safes by the guardian by comparing local and remote data base
    const recoverableSafes = safeData
      .filter(safe => safe?.stage == safeStages.RECOVERING && !watchedSafes[safe._id])
      .map(safe => safe?._id)
    console.log(info('Total recoverable safes: '), recoverableSafes.length)

    // Reconstruct the recoverableSafes
    // Update the local safe info once done
    const updatedSafeStates = {}
    for (let i = 0; i < recoverableSafes.length; i++) {
      const safe = recoverableSafes[i]
      if (safe) {
        const status = await safient.reconstructSafe(safe, await safient.myInfo().did)
        updatedSafeStates[safe] = status
      }
    }
    fs.writeFileSync(
      'safe.json',
      JSON.stringify({ ...updatedSafeStates, ...watchedSafes }),
    )
  }
}
