import { SafeService } from './safe.service'
import { ServiceResponse } from '../core/service-response'
import { accountService } from '../core/services'
import { Service } from '../core/service'
import { CryptoSafe, SecretSafe, Safe, SafeStore } from '../../types'
import { sendClaimNofitication, sendSignalNotification } from '../../utils/notification/notification'

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
      }
      const disputeId = await accountService.safient.createClaim(
        safeId,
        file,
        'Claim evidence',
        'Lorsem Text',
      )
      if(disputeId){
        const res = await sendClaimNofitication("koshik@consensolabs.com", safeId, "didofcreator", disputeId.toString())
      }
      return this.success<number>(disputeId.data!)
    } catch (e: any) {
      return this.error<number>(e)
    }
  }

  async signal(safeId: string): Promise<ServiceResponse<boolean>> {
    try {
      let status: boolean
      const txReceipt = await accountService.safient.createSignal(safeId)
      if (txReceipt.data?.status === 1) {
        status = true
      } else {
        status = false
      }
      return this.success<boolean>(status)
    } catch (e: any) {
      return this.error<boolean>(e)
    }
  }

  //Currently signal based claim
  async recover(safeId: string): Promise<ServiceResponse<string>> {
    try {
      const recoveredData = await accountService.safient.recoverSafeByBeneficiary(
        safeId,
        accountService.user.did,
      )
      const res = await sendSignalNotification("yathish@consensolabs.com", safeId, "did", undefined)
      return this.success<string>(recoveredData.data.safe.data)
    } catch (e: any) {
      return this.error<string>(e)
    }
  }

  async reconstruct(safeId: string): Promise<ServiceResponse<boolean>> {
    try {
      const reconstruct = await accountService.safient.reconstructSafe(
        safeId,
        accountService.user.did,
      )
      return this.success<boolean>(reconstruct.data as boolean)
    } catch (e: any) {
      return this.error<boolean>(e)
    }
  }

  async submitProof(safeId: string): Promise<ServiceResponse<boolean>> {
    try {
      const reconstruct = await accountService.safient.incentiviseGuardians(safeId)
      return this.success<boolean>(reconstruct.data as boolean)
    } catch (e: any) {
      return this.error<boolean>(e)
    }
  }

  async claimReward(safeId: string): Promise<ServiceResponse<boolean>> {
    try {
      const reconstruct = await accountService.safient.reconstructSafe(
        safeId,
        accountService.user.did,
      )
      1
      return this.success<boolean>(reconstruct.data as boolean)
    } catch (e: any) {
      return this.error<boolean>(e)
    }
  }
}
