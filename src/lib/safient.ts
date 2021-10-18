//TODO: Export the types used in @safient/core

import { Wallet as EthersWallet } from 'ethers'
import { SafientCore } from '@safient/core'

import { Network } from '../types'
import { Wallet } from '../utils/wallet'
import { success, info, error } from '../utils/message'
import { SafeData } from '@safient/core/dist/types/types'

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
  private userConnection: any
  private user: any

  constructor(network: Network) {
    this.network = network ? network : DEFAULT_CONFIG.network
  }

  async connectUser(): Promise<boolean> {
    // Initializing a wallet account that is connected to the provided network
    const wallet = new Wallet()
    this.account = await wallet.account(this.network)

    // Initialize Safient core.
    this.safient = new SafientCore(this.account, await this.account.getChainId(), 'threadDB')
    this.userConnection = await this.safient.connectUser(apiKey, secret)
    console.log(info('Your DID: '), this.userConnection.idx.id)
    this.user = await this.safient.getLoginUser(
      this.userConnection.idx ? this.userConnection.idx.id : '',
    )
    return this.user ? true : false
  }

   myInfo(): any {

    return this.user
  }

  async createUser(name: string, email: string): Promise<boolean> {

    if(!this.account || !this.safient) {
      console.log(error('User needs to connect the wallet first '))
      return false
    }
  
    const userAddress = await this.account.getAddress()
    await this.safient.registerNewUser(name, email, 0, userAddress)
    console.log(success('A new user account has been suuccessfully createed 🔐 : '))

    return true
  }

  async createSafe(beneficiary: string, data: string, onchain = false): Promise<void> {
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
