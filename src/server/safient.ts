
import{ Request, Response } from 'express'

import { Safient } from '../lib/safient'


export const getSafe = async(req: Request, res: Response, safient: Safient): Promise<void> => {

    const safeId: string = req.query.id ? req.query.id.toString() : ''
    
    const safe = await safient.showSafe(safeId)
    res.json({safe})
  }