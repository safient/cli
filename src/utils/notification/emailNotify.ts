/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {Notifire, ChannelTypeEnum} from "@notifire/core";
import {SESEmailProvider} from '@notifire/ses'
import { TriggerParameters } from "../../types";
const notifire = new Notifire();




export const sendEmail = async (id: string, subject: string, template: string, triggerParamater: TriggerParameters): Promise<boolean> => {
    try{
        await notifire.registerProvider(
            new SESEmailProvider({
                region: process.env.SES_REGION!,
                accessKeyId: process.env.ACCESS_KEY!,
                secretAccessKey: process.env.ACCESS_SECRET!,
                from: "hello@safient.io",
            })
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
          });
    
        await notifire.trigger(id, triggerParamater)
    
        return true
    }catch(err){
        throw new Error(`Something went wrong while messaging, ${err}`)
    }
    
}

