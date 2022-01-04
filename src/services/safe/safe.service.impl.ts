import { SafeService } from './safe.service'
import { ServiceResponse } from '../core/service-response.'
import { accountService } from '../core/services'
import { Service } from '../core/service'
import { CryptoSafe, SecretSafe, Safe, SafeStore } from '../../types'

export class SafeServiceImpl extends Service implements SafeService {
  async create(
    beneficiary: string,
    data: string,
    onchain: boolean,
  ): Promise<ServiceResponse<string>> {
    try {
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

      return this.success<string>(safe.data as string)
    } catch (e: any) {
      return this.error<string>(e.error)
    }
  }

  async get(safeId: string): Promise<ServiceResponse<Safe>> {
    try {
      const safe = await accountService.safient.getSafe(safeId)
      1
      return this.success<Safe>(safe.data as Safe)
    } catch (e: any) {
      return this.error<Safe>(e.error)
    }
  }

  async reconstruct(safeId: string): Promise<ServiceResponse<boolean>> {
    try {
      const reconstruct = await accountService.safient.reconstructSafe(
        safeId,
        accountService.user.did,
      )
      1
      return this.success<boolean>(reconstruct.data as boolean)
    } catch (e: any) {
      return this.error<boolean>(e.error)
    }
  }
}
