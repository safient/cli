import { Network, SafeMeta } from '../../types'
import { accountService, safeService } from '../../services'

import { success, info, error } from '../message'
import { errorLog, infoLog } from '../logger/logger'

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
      errorLog('User needs to connect the wallet first ', `Error while connecting user wallet @ ${Date.now()}`)
      return false
    }

    const user = await accountService.create(name, email, false)
    if (user.hasError()) {
      errorLog(`Error while creating the new user : ${user.error?.message} `, `Error, ${JSON.stringify(user.error)} @ ${Date.now()}`)
      return false
    }

    infoLog('A new user account has been suuccessfully created', `User created @ ${Date.now()}`)
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
    console.log(safe)
    infoLog(`Safe has been created with id 🔐 : ${safe.data}`, `Safe was created with ${JSON.stringify(safe.data)} @ ${Date.now()}`)    
    return true
  }

  async createClaim(safeId: string): Promise<boolean> {
    console.log(info('Creating claim for safe:'), safeId)
    const claimId = await safeService.claim(safeId)

    if (claimId.hasError()) {
      errorLog(`Error while creating safe: ${claimId.getErrorMessage()}`, `Error while creating safe ${JSON.stringify(claimId.error)} @ ${Date.now()}`)
      return false
    } else {
      infoLog(`Claim ID 🔐: ${claimId.data}`, `Claim ID created @ ${Date.now()}`)
      return true
    }
  }

  async createSignal(safeId: string): Promise<boolean> {
    console.log(info('Creating Signal for safe:'), safeId)
    const result = await safeService.signal(safeId)

    if (result.hasError()) {
      errorLog(`Error while signaling safe: ${result.getErrorMessage()}`, `Error while signaling safe ${JSON.stringify(result.error)} @ ${Date.now()}`)
      return false
    }
    if (result.data === true) {
      infoLog(`'Signal Created 🏁'`, `'Signal Created' @ ${Date.now()}`)
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
      errorLog(`Error while recovering a safe:  ${result.getErrorMessage()}`, `Error while recovering a safe ${JSON.stringify(result.error)} @ ${Date.now()}`)
      return false
    }
    infoLog(`Safe has been recovered: ${result}`, `'Safe Recovered' @ ${Date.now()}`)
    return true
  }

  async showSafe(safeId: string): Promise<boolean> {
    console.log(info('Retrieving safe info for safe :'), safeId)
    const safe = await safeService.get(safeId)

    if (safe.hasError()) {
      errorLog(`Error while fetching safe:  ${safe.getErrorMessage()}`, `Error while fetching safe ${JSON.stringify(safe.error)} @ ${Date.now()}`)
      return false
    }
    infoLog(`Safe details 🔐 : ${safe.data}`, `'Safe data fetched' @ ${Date.now()}`)
    return true
  }
}
