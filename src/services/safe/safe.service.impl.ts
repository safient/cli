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

  //Currently signal based claim
  async claim(safeId: string): Promise<ServiceResponse<number>> {
    try {
      const file = {
        name: 'dummy.pdf',
      };
      const disputeId = await accountService.safient.createClaim(safeId, file, 'Claim evidence','Lorsem Text')
      return this.success<number>(disputeId.data!)
    } catch (e: any) {
      throw this.error<Safe>(e.error)
    }
  }

  async signal(safeId: string): Promise<ServiceResponse<boolean>> {
    try {
      let status: boolean
      const txReceipt = await accountService.safient.createSignal(safeId)
      if(txReceipt.data?.status === 1){
        status = true
      }else{
        status = false
      }
      return this.success<boolean>(status)
    } catch (e: any) {
      throw this.error<Safe>(e.error)
    }
  }


  //Currently signal based claim
  async recover(safeId: string): Promise<ServiceResponse<any>> {
    try {
      const recoveredData = await accountService.safient.recoverSafeByBeneficiary(safeId, accountService.user.did)
      return this.success<any>(recoveredData.data.data.data)
    } catch (e: any) {
      throw this.error<Safe>(e.error)
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
