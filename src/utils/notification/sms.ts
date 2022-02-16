import { Notifire, ChannelTypeEnum } from '@notifire/core'
import { SNSSmsProvider } from '@notifire/sns'
import { SMSTriggerParameters } from '../../types'
import { error } from '../message'

const notifire = new Notifire()

export const sendMsg = async (
    id: string,
    template: string,
    triggerParamater: SMSTriggerParameters,
) : Promise<boolean> => {

  try{
    const snsProvider = await notifire.registerProvider(
        new SNSSmsProvider({
            region: process.env.SNS_REGION,
            accessKeyId: process.env.ACCESS_KEY!,
            secretAccessKey: process.env.ACCESS_SECRET!,
        })
    )

    const messageTemplate = await notifire.registerTemplate({
        id: id,
        messages: [
          {
            channel: ChannelTypeEnum.SMS,
            template: template,
          },
        ],
      });

      await notifire.trigger(id, triggerParamater)
    return true
  }catch(err){

    console.log(error(`Error while sending sms: ${err}`))
    throw new Error(`Error while sending sms`)
  }
}
