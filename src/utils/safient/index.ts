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
    console.log(info('Connected user info: ' + accountService.user))
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

    const user = await accountService.create(name, email, false)
    if (user.hasError()) {
      console.log(error('Error while creating the new user : '))
      return false
    }

    console.log(success('A new user account has been suuccessfully createed 🔐 : '))
    return true
  }

  async createSafe(beneficiary: string, data: string, onchain = true): Promise<boolean> {
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
      5,
      0,
    )

    console.log(success('Safe has been created with id 🔐 : '), safe.data)

    return true
  }

  async createClaim(safeId: string): Promise<boolean> {
    console.log(info('Creating claim for safe:'), safeId)
    const claimId = await safeService.claim(safeId);

    if (claimId.hasError()) {
      console.log(error('Error while fetching safe ' + claimId.error))
      return false
    }else{
      console.log(success('Claim ID 🔐 : '), claimId.data)
      return true
    }
  }

  async createSignal(safeId: string): Promise<boolean> {
    console.log(info('Creating Signal for safe:'), safeId)
    const result = await safeService.signal(safeId)

    if (result.hasError()) {
      console.log(error('Error while signaling a safe ' + result.error))
      return false
    }
    if(result.data === true){
      console.log(success('Signal Created 🏁'))
      return true
    }else{
      console.log(error('Signal Could not be created'))
      return false
    }
  }

  async recover(safeId: string): Promise<boolean> {
    console.log(info('Creating Signal for safe:'), safeId)
    const result = await safeService.recover(safeId)

    if (result.hasError()) {
      console.log(error('Error while recovring a safe ' + result.error))
      return false
    }
    console.log(success('Safe has been recovered: '), result.data)

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
