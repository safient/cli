import type { Server } from 'http'
import { SafientSDK } from '@safient/core'

import { createServer } from '../server'
import { Network, WorkerOptions } from '../types'
import { Wallet } from '../utils/wallet'

const apiKey = process.env.USER_API_KEY
const secret = process.env.USER_API_SECRET

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
  network: Network.local,
}

/**
 * Safient worker implementation
 */
export class SafienWorker {
  private server?: Server
  public hostname?: string
  public port?: number
  public wallet?: Wallet

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

    // Initializing a wallet account that is connected to the provided network
    this.wallet = new Wallet()
    const account = await this.wallet.account(options.network)

    // Initialize Safient core.
    const safient = new SafientSDK(account, await account.getChainId(), 'threadDB')
    const safien = await safient.safientCore.connectUser(apiKey, secret)
    const loginUser = await safient.safientCore.getLoginUser(
      safien.idx ? safien.idx.id : '',
    )
    if (loginUser.email !== options.email) {
      console.log(
        'Email mismatch. Make sure you have provided the correct email of the user',
      )
    }

    if (!loginUser) {
      const userAddress = await account.getAddress()
      await safient.safientCore.registerNewUser(
        options.name,
        options.email,
        0,
        userAddress,
      )
    }

    // Initializing a server
    this.server = await createServer(options.port, options.hostname)
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
      conf.network = options.network
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
