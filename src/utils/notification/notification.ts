import { TriggerParameters } from '../../types'
import { sendEmail } from './emailNotify'
import { emailTemplate } from './template/email'

export const sendClaimNofitication = async (
  emailId: string,
  safeId: string,
  claimId?: string,
): Promise<boolean> => {
  try {
    const triggerParamater: TriggerParameters = {
      $user_id: emailId,
      $email: emailId,
      safeId: safeId,
      claimId: claimId,
    }
    console.log(emailId, safeId, claimId)
    const res = await sendEmail(
      emailTemplate.claim.id,
      emailTemplate.claim.subject,
      emailTemplate.claim.data,
      triggerParamater,
    )

    return true
  } catch (e) {
    throw new Error(`Something went wrong while sending mail, ${e}`)
  }
}

export const sendSignalNotification = async (
  emailId: string,
  safeId: string,
  did: string,
  claimId?: string,
): Promise<boolean> => {
  try {
    const triggerParamater: TriggerParameters = {
      $user_id: did,
      $email: emailId,
      safeId: safeId,
      claimId: claimId,
    }
    const res = await sendEmail(
      emailTemplate.signal.id,
      emailTemplate.signal.subject,
      emailTemplate.signal.data,
      triggerParamater,
    )

    return true
  } catch (e) {
    throw new Error(`Somethinbg went wrong while sending mail, ${e}`)
  }
}
