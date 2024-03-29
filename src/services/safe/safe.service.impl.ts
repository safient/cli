/* eslint-disable @typescript-eslint/no-inferrable-types */
import { SafeService } from './safe.service'
import { ServiceResponse } from '../core/service-response'
import { accountService } from '../core/services'
import { Service } from '../core/service'
import { CryptoSafe, SecretSafe, Safe, SafeStore, SafeStage } from '../../types'
import {
  sendClaimNofitication,
  sendCreateSafeNofitication,
  sendRecoveryNotification,
} from '../../utils/notification/notification'
import { SafientResponse } from '@safient/core/dist/lib/services'
import { EventResponse } from '@safient/core/dist/lib/types'
import { errorLogger } from '../../utils/logger/logger'

export class SafeServiceImpl extends Service implements SafeService {
  async create(
    safeName: string,
    safeDescription: string,
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
        safeData,
        { email: beneficiary },
        { type: 0, period: 0 },
        { name: safeName, description: safeDescription },
        onchain,
      )
      if (safe.data?.id) {
        await sendCreateSafeNofitication(beneficiary, '', safe.data.id, '')
      }

      return this.success<string>(safe.data?.id as string)
    } catch (e: any) {
      errorLogger.error(e)
      return this.error<string>(e.error)
    }
  }

  async get(safeId: string): Promise<ServiceResponse<Safe>> {
    try {
      const safe = await accountService.safient.getSafe(safeId)
      1
      return this.success<Safe>(safe.data as Safe)
    } catch (e: any) {
      errorLogger.error(e)
      return this.error<Safe>(e.error)
    }
  }

  //Currently signal based claim
  async claim(safeId: string): Promise<ServiceResponse<number>> {
    try {
      let disputeId: number = 0
      const response: SafientResponse<EventResponse> = await accountService.safient.createClaim(
        safeId,
      )
      if (response.data?.id) {
        disputeId = parseInt(response.data.id)
        await sendClaimNofitication(
          response.data.recepient.email!,
          '',
          safeId,
          response.data?.id,
        )
      }
      return this.success<number>(disputeId)
    } catch (e: any) {
      errorLogger.error(e)
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
      errorLogger.error(e)
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
      return this.success<string>(recoveredData.data.safe.data)
    } catch (e: any) {
      errorLogger.error(e)
      return this.error<string>(e)
    }
  }

  async reconstruct(safeId: string): Promise<ServiceResponse<boolean>> {
    try {
      const reconstruct = await accountService.safient.reconstructSafe(
        safeId,
        accountService.user.did,
      )

      // TODO: Throw error if claim doesn't exist
      const safeData = await accountService.safient.getSafe(safeId)
      
      if (
        reconstruct.data &&
        safeData.data?.stage === SafeStage.RECOVERED &&
        safeData.data?.beneficiary
      ) {
        const userData = await accountService.safient.getUser({
          did: safeData.data?.beneficiary,
        })
        await sendRecoveryNotification(userData.data!.email!, '', safeId, '')
      }

      return this.success<boolean>(reconstruct.data as boolean)
    } catch (e: any) {
      errorLogger.error(e)
      return this.error<boolean>(e)
    }
  }

  async submitProof(safeId: string): Promise<ServiceResponse<boolean>> {
    try {
      const reconstruct = await accountService.safient.incentiviseGuardians(safeId)
      return this.success<boolean>(reconstruct.data as boolean)
    } catch (e: any) {
      errorLogger.error(e)
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
      errorLogger.error(e)
      return this.error<boolean>(e)
    }
  }
}
