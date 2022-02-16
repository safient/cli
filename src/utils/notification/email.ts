/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Notifire, ChannelTypeEnum } from '@notifire/core'
import { SESEmailProvider } from '@notifire/ses'
import { EmailTriggerParameters } from '../../types'
import { error } from '../message'
const notifire = new Notifire()

export const sendEmail = async (
  id: string,
  subject: string,
  template: string,
  triggerParamater: EmailTriggerParameters,
): Promise<boolean> => {
  try {
    await notifire.registerProvider(
      new SESEmailProvider({
        region: process.env.SES_REGION!,
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.ACCESS_SECRET!,
        from: 'hello@safient.io',
      }),
    )

    await notifire.registerTemplate({
      id: id,
      messages: [
        {
          subject: subject,
          channel: ChannelTypeEnum.EMAIL,
          template: template,
        },
      ],
    })

    await notifire.trigger(id, triggerParamater)

    return true
  } catch (err) {

    console.log(error(`Error while sending email: ${err}`))
    throw new Error(`Error while sending email`)
  }
}
