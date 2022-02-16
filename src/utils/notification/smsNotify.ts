// export const sendMsg = async () : Promise<boolean> => {

//   try{
//     const snsProvider = await notifire.registerProvider(
//         new SNSSmsProvider({
//             region: process.env.SNS_REGION,
//             accessKeyId: process.env.ACCESS_KEY",
//             secretAccessKey: process.env.ACCESS_SECRET,
//         })
//     )

//     const messageTemplate = await notifire.registerTemplate({
//         id: "test-message",
//         messages: [
//           {
//             channel: ChannelTypeEnum.SMS,
//             template: `
//                 Hi {{firstName}}!
//                 It works so chill
//             `,
//           },
//         ],
//       });

//       await notifire.trigger("test-message", {
//         $user_id: "Koshik",
//         $phone: "+919900589280",
//         firstName: "Koshik",
//         lastName: "Raj",
//     })
//     return true
//   }catch(e){
//       throw new Error("Something went wrong")
//   }
// }
