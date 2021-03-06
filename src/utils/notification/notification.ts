import { EmailTriggerParameters, SMSTriggerParameters } from '../../types'
import { error } from '../message'
import { sendEmail } from './email'
import { sendMsg } from './sms'
import { emailTemplate } from './template/email'
import { smsTemplate } from './template/sms'

export const sendClaimNofitication = async (
  emailId: string,
  phone: string,
  safeId: string,
  claimId?: string,
): Promise<boolean> => {
  try {
    const emailTriggerParamater: EmailTriggerParameters = {
      $user_id: emailId,
      $email: emailId,
      safeId: safeId,
      claimId: claimId,
    }
    const smsTriggerParamater: SMSTriggerParameters = {
      $user_id: emailId,
      $phone: phone,
      safeId: safeId,
      claimId: claimId,
    }
    await sendEmail(
      emailTemplate.claim.id,
      emailTemplate.claim.subject,
      emailTemplate.claim.data,
      emailTriggerParamater,
    )
    if (phone) {
      await sendMsg(smsTemplate.claim.id, smsTemplate.claim.data, smsTriggerParamater)
    }

    return true
  } catch (e) {
    console.log(error(`Error while sending claim notification`))
    return false
  }
}

export const sendCreateSafeNofitication = async (
  emailId: string,
  phone: string,
  safeId: string,
  claimId?: string,
): Promise<boolean> => {
  try {
    const emailTriggerParamater: EmailTriggerParameters = {
      $user_id: emailId,
      $email: emailId,
      safeId: safeId,
      claimId: claimId,
    }
    const smsTriggerParamater: SMSTriggerParameters = {
      $user_id: emailId,
      $phone: phone,
      safeId: safeId,
      claimId: claimId,
    }
    await sendEmail(
      emailTemplate.createSafe.id,
      emailTemplate.createSafe.subject,
      emailTemplate.createSafe.data,
      emailTriggerParamater,
    )
    if (phone) {
      await sendMsg(
        smsTemplate.createSafe.id,
        smsTemplate.createSafe.data,
        smsTriggerParamater,
      )
    }

    return true
  } catch (e) {
    console.log(error(`Error while sending create safe notification`))
    return false
  }
}

export const sendSignalNotification = async (
  emailId: string,
  safeId: string,
  did: string,
  claimId?: string,
): Promise<boolean> => {
  try {
    const triggerParamater: EmailTriggerParameters = {
      $user_id: did,
      $email: emailId,
      safeId: safeId,
      claimId: claimId,
    }
    const res = await sendEmail(
      emailTemplate.recovery.id,
      emailTemplate.recovery.subject,
      emailTemplate.recovery.data,
      triggerParamater,
    )

    return true
  } catch (e) {
    throw new Error(`Something went wrong while sending mail, ${e}`)
  }
}

export const sendRecoveryNotification = async (
  emailId: string,
  phone: string,
  safeId: string,
  claimId?: string,
): Promise<boolean> => {
  try {
    const triggerParamater: EmailTriggerParameters = {
      $user_id: emailId,
      $email: emailId,
      safeId: safeId,
      claimId: claimId,
    }

    const smsTriggerParamater: SMSTriggerParameters = {
      $user_id: emailId,
      $phone: phone,
      safeId: safeId,
      claimId: claimId,
    }

    const res = await sendEmail(
      emailTemplate.recovery.id,
      emailTemplate.recovery.subject,
      emailTemplate.recovery.data,
      triggerParamater,
    )
    if (phone) {
      await sendMsg(
        smsTemplate.recovery.id,
        smsTemplate.recovery.data,
        smsTriggerParamater,
      )
    }

    return true
  } catch (e) {
    throw new Error(`Something went wrong while sending mail, ${e}`)
  }
}
