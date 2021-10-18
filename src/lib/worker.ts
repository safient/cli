import type { Server } from 'http'
import { Safient } from './safient'

import { createServer } from '../server'
import { Network, WorkerOptions } from '../types'

const DEFAULT_CONFIG = {
  name: '',
  email: '',
  config: '',
  ipfsApi: 'ipfs.safient.io',
  ethereumRpc: 'https://localhost:8545',
  port: 7000,
  hostname: '0.0.0.0',
  debug: false,
  verbose: false,
  network: Network.testnet,
}

/**
 * Safient worker implementation
 */
export class SafienWorker {
  private server?: Server
  public hostname?: string
  public port?: number
  public safient?: Safient

  constructor() {
    // Initialize the Safient worker here
  }

  /**
   * Create a Worker
   * @param opts - Worker Options
   */
  async create(opts: WorkerOptions): Promise<Server> {
    const options = this._loadConfig(opts)

    this.port = options.port

     // Initialize Safient core.
    this.safient = new Safient(options.network)

    // Connecting the user or creating a new one if doesn't already exist
    await this.safient.createUser(options.name, options.email)

    // Initializing a server
    this.server = await createServer(options.port, options.hostname, this.safient)
    return this.server
  }

  _loadConfig(options: WorkerOptions): WorkerOptions {
    const conf = DEFAULT_CONFIG
    conf.email = options.email
    conf.name = options.name

    if (options.config) {
      conf.config = options.config
    }

    if (options.debug) {
      conf.debug = options.debug
    }

    if (options.ethereumRpc) {
      conf.ethereumRpc = options.ethereumRpc
    }

    if (options.hostname) {
      conf.hostname = options.hostname
    }

    if (options.ipfsApi) {
      conf.ipfsApi = options.ipfsApi
    }

    if (options.network) {
      conf.network = parseInt(Network[options.network])
    }

    if (options.port) {
      conf.port = options.port
    }

    if (options.verbose) {
      conf.verbose = options.verbose
    }

    return conf
  }
}
