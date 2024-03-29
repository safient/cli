import { Wallet as EthersWallet } from 'ethers'

import { AccountService } from './account.service'
import { ServiceResponse } from '../core/service-response'
import { Service } from '../core/service'
import { Wallet } from '../../utils/wallet'
import { SafientCore } from '@safient/core'
import { DatabaseType, Network, User } from '../../types'
import { errorLogger } from '../../utils/logger/logger'

const apiKey = process.env.USER_API_KEY
const secret = process.env.USER_API_SECRET

const DEFAULT_CONFIG = {
  name: '',
  email: '',
  network: Network.local,
}

export class AccountServiceImpl extends Service implements AccountService {
  account!: EthersWallet
  private network!: Network
  safient!: SafientCore
  user!: User

  async connect(network: Network): Promise<ServiceResponse<User>> {
    // Initializing a wallet account that is connected to the provided network

    this.network = network ? network : DEFAULT_CONFIG.network
    const wallet = new Wallet()
    this.account = await wallet.account(this.network)

    try {
      // Initialize Safient core.
      this.safient = new SafientCore(
        parseInt(this.network.toString()),
      )
      return await this.login()
    } catch (e: any) {
      errorLogger.error(e)
      return this.error<User>(e.error)
    }
  }

  async login(): Promise<ServiceResponse<User>> {
    try {
      const user = await this.safient.loginUser(this.account)

      if (user.data) {
        this.user = user.data
      }

      return this.success<User>(this.user)
    } catch (e: any) {
      errorLogger.error(e)
      return this.error<User>(e.error)
    }
  }

  async get(did: string): Promise<ServiceResponse<User>> {
    try {
      const user = await this.safient.getUser({ did: did })

      return this.success<User>(user.data as User)
    } catch (e: any) {
      errorLogger.error(e)
      return this.error<User>(e.error)
    }
  }

  async create(
    name: string,
    email: string,
    guardian: boolean,
  ): Promise<ServiceResponse<User>> {
    try {
      const userAddress = await this.account.getAddress()
      const user = await this.safient.createUser(this.account, {name: name, email: email}, guardian)
      if (user.data) {
        this.user = user.data
      }

      return this.success<User>(this.user)
    } catch (e: any) {
      console.log(e)
      errorLogger.error(e)
      return this.error<User>(e.error)
    }
  }
}
