import type { Server } from 'http'
import { Safient } from './safient'

import { createServer } from '../service/http'
import { Network, GatewayOptions } from '../types'

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
 * Safient HTTP gateway
 */
export class Gateway {
  private server?: Server
  public hostname?: string
  public port?: number
  public safient: Safient

  constructor(safient: Safient) {
    // Initialize the Safient core here
    this.safient = safient
  }

  /**
   * Create an HTTP gateway
   * @param opts - Gateway Options
   */
  async create(opts: GatewayOptions): Promise<Server> {
    const options = this._loadConfig(opts)

    this.port = options.port

    // Connecting the user or creating a new one if doesn't already exist
    if (!opts.registed) {
      await this.safient.createUser(options.name, options.email)
    }

    // Initializing a server
    this.server = await createServer(options.port, options.hostname, this.safient)
    return this.server
  }

  _loadConfig(options: GatewayOptions): GatewayOptions {
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
