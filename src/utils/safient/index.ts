import { CryptoSafe, SecretSafe, Network, SafeStore, SafeMeta } from '../../types'
import { accountService, safeService } from '../../services'

import { success, info, error } from '../message'

const DEFAULT_CONFIG = {
  name: '',
  email: '',
  network: Network.local,
}

export class Safient {
  private network: Network

  constructor(network: Network) {
    this.network = network ? network : DEFAULT_CONFIG.network
  }

  async connect(): Promise<boolean> {
    const user = await accountService.connect(this.network)
    return user.hasData() ? true : false
  }

  myInfo(): void {
    console.log(info('Connected user info: ' + accountService.user.did))
  }

  async mySafes(): Promise<SafeMeta[]> {
    const safes = accountService.user.safes
    return safes
  }

  async createUser(name: string, email: string): Promise<boolean> {
    if (!accountService.account || !accountService.safient) {
      console.log(error('User needs to connect the wallet first '))
      return false
    }

    const user = await accountService.create(name, email)
    if (user.hasError()) {
      console.log(error('Error while creating the new user : '))
      return false
    }

    console.log(success('A new user account has been suuccessfully createed 🔐 : '))
    return true
  }

  async createSafe(beneficiary: string, data: string, onchain = false): Promise<boolean> {
    console.log(info('Creating a new safe'))

    const secretSafe: SecretSafe = {
      seedPhrase: data,
      privateKey: null,
      keyStore: null,
    }
    const cryptoSafe: CryptoSafe = {
      data: secretSafe,
    }
    const safeData: SafeStore = {
      safe: cryptoSafe,
    }

    const safe = await accountService.safient.createSafe(
      accountService.user.did,
      beneficiary,
      safeData,
      onchain,
      0,
      0,
      0,
    )

    console.log(success('Safe has been created with id 🔐 : '), safe.data)

    return true
  }

  async showSafe(safeId: string): Promise<boolean> {
    console.log(info('Retrieving safe info for safe :'), safeId)
    const safe = await safeService.get(safeId)

    if (safe.hasError()) {
      console.log(error('Error while fetching safe ' + safe.error))
      return false
    }

    console.log(success('Safe details 🔐 : '), safe.data)
    return true
  }
}
