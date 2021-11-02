//TODO: Export the types used in @safient/core

import { Wallet as EthersWallet } from 'ethers'
import { Types, SafientCore } from '@safient/core'

import { Network, Safe } from '../types'
import { Wallet } from '../utils/wallet'
import { success, info, error } from '../utils/message'

const apiKey = process.env.USER_API_KEY
const secret = process.env.USER_API_SECRET

const DEFAULT_CONFIG = {
  name: '',
  email: '',
  network: Network.testnet,
}

export class Safient {
  private account?: EthersWallet
  private network: Network
  private safient?: SafientCore
  private user?: Types.UserResponse

  constructor(network: Network) {
    this.network = network ? network : DEFAULT_CONFIG.network
  }

  async connectUser(): Promise<boolean> {
    // Initializing a wallet account that is connected to the provided network
    const wallet = new Wallet()
    this.account = await wallet.account(this.network)

    // Initialize Safient core.
    this.safient = new SafientCore(
      this.account,
      await this.account.getChainId(),
      'threadDB',
    )
    this.user = await this.safient.loginUser(apiKey, secret)
    console.log(info('Your DID: '), this.user?.idx?.id)

    return this.user.status ? true : false
  }

  myInfo(): any {
    return this.user?.data
  }

  async mySafes(): Promise<Safe[]> {
    const user = await this.safient?.getUser({ did: this.user?.idx?.id })
    return user ? user.safes : []
  }

  async createUser(name: string, email: string): Promise<boolean> {
    if (!this.account || !this.safient) {
      console.log(error('User needs to connect the wallet first '))
      return false
    }

    const userAddress = await this.account.getAddress()
    await this.safient.createUser(name, email, 0, userAddress)
    console.log(success('A new user account has been suuccessfully createed 🔐 : '))

    return true
  }

  async createSafe(beneficiary: string, data: string, onchain = false): Promise<boolean> {
    if (!this.user?.data?.did) {
      console.log(error('User needs to login first '))
      return false
    }

    console.log(info('Creating a new safe'))

    const safe = await this.safient?.createSafe(
      this.user.data.did,
      beneficiary,
      data,
      onchain,
      0,
      0,
    )

    console.log(success('Safe has been created with id 🔐 : '), safe)

    return true
  }

  async showSafe(safeId: string): Promise<Types.SafeData | undefined> {
    console.log(info('Retrieving safe info for safe :'), safeId)
    const safe = await this.safient?.getSafe(safeId)

    if (safe) {
      console.log(success('Safe details 🔐 : '), safe)
    } else {
      console.log(error('Safe not found'))
    }

    return safe
  }

  async reconstructSafe(safeId: string, did: string): Promise<any> {
    return await this.safient?.reconstructSafe(safeId, did)
  }
}
