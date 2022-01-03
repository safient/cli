import delay from 'delay'
import fs from 'fs'

import { Safe, Network, WorkerOptions, SafeStage, SafeMeta } from '../../types'
import { accountService, safeService } from '../../services'
import { info, success } from '../message'

const DEFAULT_CONFIG = {
  name: '',
  email: '',
  config: '',
  ipfsApi: 'ipfs.safient.io',
  port: 7000,
  hostname: '0.0.0.0',
  debug: false,
  verbose: false,
}

/**
 * Safient worker implementation
 */
export class Worker {
  public hostname?: string
  public port?: number
  public network!: Network

  constructor(network: Network) {
    // Initialize the Safient worker here
    this.network = network
  }

  /**
   * Create a Worker
   * @param opts - Worker Options
   */
  async create(opts: WorkerOptions): Promise<void> {
    const options = this._loadConfig(opts)

    this.port = options.port

    // Connecting the user or creating a new one if doesn't already exist
    if (!opts.registed) {
      await accountService.create(options.name, options.email)
      await accountService.login()
    }

    await this.watchSafes()
  }

  _loadConfig(options: WorkerOptions): WorkerOptions {
    const conf = options

    if (!options.config) {
      conf.config = DEFAULT_CONFIG.config
    }

    if (!options.debug) {
      conf.debug = DEFAULT_CONFIG.debug
    }

    if (!options.hostname) {
      conf.hostname = DEFAULT_CONFIG.hostname
    }

    if (!options.ipfsApi) {
      conf.ipfsApi = DEFAULT_CONFIG.ipfsApi
    }

    if (!options.port) {
      conf.port = DEFAULT_CONFIG.port
    }

    if (!options.verbose) {
      conf.verbose = DEFAULT_CONFIG.verbose
    }

    return conf
  }

  async watchSafes() {
    if (!fs.existsSync('safe.json')) {
      fs.writeFileSync('safe.json', JSON.stringify({}))
    }

    console.log(info('Guardian is watching for any safe updates 👀 ...'))

    for (;;) {
      // Poll safe details for every 5 seconds
      await delay(5000)
      const watchedSafes = JSON.parse(fs.readFileSync('safe.json').toString())
      const user = await accountService.get(accountService.user.did)
      const safes = user.hasData() ? user.data!.safes : accountService.user.safes
      const guardableSafes: SafeMeta[] = safes.filter(
        (safe: SafeMeta) => safe.type == 'guardian',
      )

      if (guardableSafes.length > Object.keys(watchedSafes).length) {
        console.log(
          info(
            `${
              guardableSafes.length - Object.keys(watchedSafes).length
            } new safes detected for the guardian`,
          ),
        )
      }

      const safe: Promise<(Safe | undefined)[]> = Promise.all(
        guardableSafes.map(safe =>
          safeService.get(safe.safeId).then(safe => {
            if (safe.hasData()) return safe.data
          }),
        ),
      )
      const safeData = await safe

      //   // Fetch the recoverable safes by the guardian by comparing local and remote data base
      const recoverableSafes = safeData
        .filter(safe => safe?.stage == SafeStage.RECOVERING && !watchedSafes[safe._id])
        .map(safe => safe?._id)
      if (recoverableSafes.length) {
        console.log(info(`🔐 ${recoverableSafes.length} new recoverable safe found `))
      }

      //   // Reconstruct the recoverableSafes
      //   // Update the local safe info once done
      const updatedSafeStates = {}
      for (let i = 0; i < recoverableSafes.length; i++) {
        const safe = recoverableSafes[i]
        if (safe) {
          console.log(info(`🧑‍🔧 Recovering the safe: ${safe} ...`))
          const status = await safeService.reconstruct(safe)
          if (status.hasData()) {
            console.log(success(`Safe ${safe} recovered`))
          }
          updatedSafeStates[safe] = status
        }
      }

      fs.writeFileSync(
        'safe.json',
        JSON.stringify({ ...updatedSafeStates, ...watchedSafes }),
      )
    }
  }
}
