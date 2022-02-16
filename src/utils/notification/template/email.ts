export const emailTemplate = {
    claim: {
        id: 'claim-email',
        subject: "Claim created for your safe",
        data: `
                A claim has been created for the safe with ID: {{safeId}}
        `
    },
    signal: {
        id: 'signal-email',
        subject: "A signal based Claim has been created for your claim",
        data: `
               A signal based claim has been created for your safe with ID: {{safeId}}.
               Do login to cancel this claim!
        `
    },
    recovery: {
        subject: "Your safe is recovered!",
        data: `
                A recovery for your safe {{safeId}} has been created
        `
    }
}