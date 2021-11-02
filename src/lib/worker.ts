import type { Server } from 'http'
import { Safient } from './safient'
import { watchSafes } from '../service/safient'

import { Safe, Network, WorkerOptions } from '../types'

const DEFAULT_CONFIG = {
  name: '',
  email: '',
  config: '',
  ipfsApi: 'ipfs.safient.io',
  port: 7000,
  hostname: '0.0.0.0',
  debug: false,
  verbose: false,
  network: Network.testnet,
}

/**
 * Safient worker implementation
 */
export class Worker {
  private server?: Server
  public hostname?: string
  public port?: number
  public safient: Safient

  constructor(safient: Safient) {
    // Initialize the Safient worker here
    this.safient = safient
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
      await this.safient.createUser(options.name, options.email)
      await this.safient.connectUser()
    }

    await watchSafes(this.safient)
  }

  _loadConfig(options: WorkerOptions): WorkerOptions {
    const conf = options
    conf.network = parseInt(Network[options.network])

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

    if (!options.network) {
      conf.network = DEFAULT_CONFIG.network
    }

    if (!options.port) {
      conf.port = DEFAULT_CONFIG.port
    }

    if (!options.verbose) {
      conf.verbose = DEFAULT_CONFIG.verbose
    }

    return conf
  }
}
