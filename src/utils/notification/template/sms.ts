const APP_URL = 'https://app.safient.io'
const WALLET_URL = 'https://wallet.safient.io'

export const smsTemplate = {
    claim: {
        id: 'claim-sms',
        subject: "Claim created for your safe",
        data: `
                A claim has been created for the safe with ID: {{safeId}}.
                Login at ${APP_URL} to take further action.
                
        `
    },

    createSafe: {
        id: 'create-safe-sms',
        subject: "You are added as Beneficary",
        data: `
                A safe has been created with you as beneficary.
                Login at ${APP_URL} to take further action.
                
        `
    },
    signal: {
        id: 'signal-sms',
        subject: "A signal has been created for your claim",
        data: `
               A signal has been created for your safe with ID: {{safeId}}.
               Login at ${APP_URL} to check the status.
            
        `
    }
    
    ,
    recovery: {
        id: 'recovery-sms',
        subject: "Your safe is recovered!",
        data: `
                Your safe {{safeId}} has been recovered.
                Login at ${APP_URL} to access the safe.
        `
    }
}