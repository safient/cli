//TODO: Export the types used in @safient/core

import { SafientCore } from '@safient/core'

import { Network } from '../types'
import { Wallet } from '../utils/wallet'
import { success, warning, info, error } from '../utils/message'
import { SafeData } from '@safient/core/dist/types/types'

const apiKey = process.env.USER_API_KEY
const secret = process.env.USER_API_SECRET

export class Safient {
  private wallet?: Wallet
  private network: Network
  private safient?: SafientCore
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
    this.safient = new SafientCore(account, await account.getChainId(), 'threadDB')
    this.userConnection = await this.safient.connectUser(apiKey, secret)
    console.log(info('Your DID: '), this.userConnection.idx.id)
    this.user = await this.safient.getLoginUser(
      this.userConnection.idx ? this.userConnection.idx.id : '',
    )
    return true
  }

   myInfo(): any {

    return this.user
  }

  async createUser(name: string, email: string): Promise<boolean> {
    // Initializing a wallet account that is connected to the provided network
    this.wallet = new Wallet()
    const account = await this.wallet.account(this.network)

    // Initialize Safient core.
    this.safient = new SafientCore(account, await account.getChainId(), 'threadDB')
    this.userConnection = await this.safient.connectUser(apiKey, secret)
    this.user = await this.safient.getLoginUser(
      this.userConnection.idx ? this.userConnection.idx.id : '',
    )

    if (!this.user) {
      const userAddress = await account.getAddress()
      await this.safient.registerNewUser(name, email, 0, userAddress)

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

  async createSafe(beneficiary: string, data: string, onchain = false) {
    console.log(info('Creating a new safe'))
    const safe = await this.safient?.createNewSafe(
      this.user.did,
      beneficiary,
      data,
      onchain,
      0,
      0,
    )

    console.log(success('Safe has been created with id 🔐 : '), safe)
  }

  async showSafe(safeId: string): Promise<SafeData|undefined> {
    console.log(info('Retrieving safe info'))
    const safe = await this.safient?.getSafeData(safeId)

    if (safe) {
      console.log(success('Safe details 🔐 : '), safe)
    } else {
      console.log(error('Safe not found'))
    }
    
    return safe
  }
}
