import { Network, SafeMeta } from '../../types'
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
    console.log(info('Connected user info: ' + JSON.stringify(accountService.user)))
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
      console.log(error(`Error while creating the new user : ${user.error?.message} `))
      return false
    }

    console.log(success('A new user account has been suuccessfully createed 🔐 : '))
    return true
  }

  async createSafe(
    safeName: string,
    safeDesc: string,
    beneficiary: string,
    data: string,
    onchain = false,
  ): Promise<boolean> {
    console.log(info('Creating a new safe'))

    const safe = await safeService.create(safeName, safeDesc, beneficiary, data, onchain)

    console.log(success('Safe has been created with id 🔐 : '), safe.data)

    return true
  }

  async createClaim(safeId: string): Promise<boolean> {
    console.log(info('Creating claim for safe:'), safeId)
    const claimId = await safeService.claim(safeId)

    if (claimId.hasError()) {
      console.log(error('Error while creating safe: ' + claimId.getErrorMessage()))
      return false
    } else {
      console.log(success('Claim ID 🔐: '), claimId.data)
      return true
    }
  }

  async createSignal(safeId: string): Promise<boolean> {
    console.log(info('Creating Signal for safe:'), safeId)
    const result = await safeService.signal(safeId)

    if (result.hasError()) {
      console.log(error('Error while signaling a safe: ' + result.getErrorMessage()))
      return false
    }
    if (result.data === true) {
      console.log(success('Signal Created 🏁'))
      return true
    } else {
      console.log(error('Signal Could not be created'))
      return false
    }
  }

  async recover(safeId: string): Promise<boolean> {
    console.log(info('Creating Recovery for safe:'), safeId)
    const result = await safeService.recover(safeId)
    console.log(result)
    if (result.hasError()) {
      console.log(error('Error while recovering a safe: ' + result.getErrorMessage()))
      return false
    }
    console.log(success('Safe has been recovered: '), result)

    return true
  }

  async showSafe(safeId: string): Promise<boolean> {
    console.log(info('Retrieving safe info for safe :'), safeId)
    const safe = await safeService.get(safeId)

    if (safe.hasError()) {
      console.log(error('Error while fetching safe:'), safe.getErrorMessage())
      return false
    }

    console.log(success('Safe details 🔐 : '), safe.data)
    return true
  }
}
