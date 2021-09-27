//TODO: Export the types used in @safient/core

import { SafientSDK } from '@safient/core'

import { Network } from '../types'
import { Wallet } from '../utils/wallet'
import { error, success, warning, info } from '../utils/message'

const apiKey = process.env.USER_API_KEY
const secret = process.env.USER_API_SECRET

export class Safient {
  private wallet?: Wallet
  private network: Network
  private safient?: SafientSDK
  private userConnection: any
  private user: any

  constructor(network: Network) {
    this.network = network
  }

  async connectUser(): Promise<boolean> {
    // Initializing a wallet account that is connected to the provided network
    this.wallet = new Wallet()
    const account = await this.wallet.account(this.network)

    // Initialize Safient core.
    this.safient = new SafientSDK(account, await account.getChainId(), 'threadDB')
    this.userConnection = await this.safient.safientCore.connectUser(apiKey, secret)
    this.user = await this.safient.safientCore.getLoginUser(
      this.userConnection.idx ? this.userConnection.idx.id : '',
    )
    return true
  }

  async createUser(name: string, email: string): Promise<boolean> {
    // Initializing a wallet account that is connected to the provided network
    this.wallet = new Wallet()
    const account = await this.wallet.account(this.network)

    // Initialize Safient core.
    this.safient = new SafientSDK(account, await account.getChainId(), 'threadDB')
    this.userConnection = await this.safient.safientCore.connectUser(apiKey, secret)
    this.user = await this.safient.safientCore.getLoginUser(
      this.userConnection.idx ? this.userConnection.idx.id : '',
    )

    if (!this.user) {
      const userAddress = await account.getAddress()
      await this.safient.safientCore.registerNewUser(name, email, 0, userAddress)

      console.log(success('A new user account has been suuccessfully createed 🔐 : '))
    } else if (this.user.email !== email) {
      console.log(
        warning(
          'Email mismatch. Make sure you have provided the correct email of the user',
        ),
      )
      return false
    }

    return true
  }

  async createSafe(beneficiary: string, data: string) {
    console.log(info('Creating a new safe'))
    const safe = await this.safient?.safientCore.createNewSafe(
      this.user.did,
      beneficiary,
      data,
      false,
      0,
      0,
    )

    console.log(success('Safe has been created with id 🔐 : '), safe)
  }

  async showSafe(safeId: string) {
    console.log(info('Retrieving safe info'))
    const safe = await this.safient?.safientCore.getSafeData(safeId)

    console.log(success('Safe details 🔐 : '))
    console.log(safe)
  }
}
