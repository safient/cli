import { Wallet as EthersWallet } from 'ethers'

import { AccountService } from './account.service'
import { ServiceResponse } from '../core/service-response.'
import { Service } from '../core/service'
import { Wallet } from '../../utils/wallet'
import { SafientCore } from '@safient/core'
import { DatabaseType, Network, User } from '../../types'

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
        this.account,
        parseInt(this.network.toString()),
        DatabaseType.threadDB,
        apiKey,
        secret,
      )
      return await this.login()
    } catch (e: any) {
      return this.error<User>(e.error)
    }
  }

  async login(): Promise<ServiceResponse<User>> {
    try {
      const user = await this.safient.loginUser()

      if (user.data) {
        this.user = user.data
      }

      return this.success<User>(this.user)
    } catch (e: any) {
      throw this.error<User>(e.error)
    }
  }

  async get(did: string): Promise<ServiceResponse<User>> {
    try {
      const user = await this.safient.getUser({ did: did })

      return this.success<User>(user.data as User)
    } catch (e: any) {
      throw this.error<User>(e.error)
    }
  }

  async create(name: string, email: string): Promise<ServiceResponse<User>> {
    try {
      const userAddress = await this.account.getAddress()
      const user = await this.safient.createUser(name, email, 0, userAddress)

      if (user.data) {
        this.user = user.data
        console.log(this.user)
      }

      return this.success<User>(this.user)
    } catch (e: any) {
      return this.error<User>(e.error)
    }
  }
}
