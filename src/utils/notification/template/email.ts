
const APP_URL = 'https://app.safient.io'
const WALLET_URL = 'https://wallet.safient.io'

export const emailTemplate = {
    claim: {
        id: 'claim-email',
        subject: "Claim created for your safe",
        data: `
        <!DOCTYPE html>
        <html
          lang="en"
          style="margin: 0; padding: 0; box-sizing: border-box; font-family: Helvetica, sans-serif; font-size: 10%"
        >
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>Safient Wallet |- Benificiary Claim</title>
          </head>
          <body
            style="
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              border: 1px soild gray;
              background-color: #fff;
              color: #555770;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <div class="container" style="margin: 0; box-sizing: border-box; padding: 3rem; background-color: #fff">
              <div class="content" style="margin: 0; padding: 0; box-sizing: border-box; font-size: 1rem">
                <h2 style="margin: 0; padding: 0; box-sizing: border-box; margin-bottom: 1.6rem; font-size: 1rem">
                  Hello there 👋
                </h2>
        
                <p
                  style="
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    margin-bottom: 2rem;
                    font-size: 1rem;
                    font-weight: 400;
                    line-height: 1.6;
                    max-width: 70rem;
                  "
                >
                  Your Benificiary has claimed a wallet. Login at ${WALLET_URL} to access the wallet and respond within the due date.
                </p>
        
                <div class="signature" style="margin: 0; padding: 0; box-sizing: border-box">
                  <h3 style="margin: 0; padding: 0; box-sizing: border-box; font-size: 1rem">Thanks,</h3>
                  <p
                    style="
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                      margin-bottom: 2rem;
                      font-weight: 400;
                      line-height: 1.6;
                      font-size: 1rem;
                      margin-top: 0.4rem;
                    "
                  >
                    Safient Team
                  </p>
                </div>
              </div>
              <footer
                class="footer"
                style="
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  margin-top: 4rem;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <img
                  src="https://i.ibb.co/3v5Pvrz/logo-8a275223-1.png"
                  alt="logo-8a275223-1"
                  style="margin: 0; padding: 0; box-sizing: border-box; width: auto; height: 30px"
                  height="30"
                />
                <ul
                  style="
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    list-style: none;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2rem;
                  "
                >
                  <li style="margin: 0; padding: 0; box-sizing: border-box">
                    <a
                      href="https://twitter.com/safientio"
                      target="_next"
                      style="margin: 0; padding: 0; box-sizing: border-box"
                    >
                      <img
                        src="https://i.ibb.co/mSvt1VR/twitter-1.png"
                        alt="twitter-1"
                        border="0"
                        style="margin: 0; padding: 0; box-sizing: border-box; height: 24px; width: 24px"
                        width="24"
                        height="24"
                      />
                    </a>
                  </li>
                  <li style="margin: 0; padding: 0; box-sizing: border-box">
                    <a href="https://github.com/safient" target="_next" style="margin: 0; padding: 0; box-sizing: border-box">
                      <img
                        src="https://i.ibb.co/ZzY8VSB/github-1.png"
                        alt="github-1"
                        border="0"
                        style="margin: 0; padding: 0; box-sizing: border-box; height: 24px; width: 24px"
                        width="24"
                        height="24"
                      />
                    </a>
                  </li>
                  <li style="margin: 0; padding: 0; box-sizing: border-box">
                    <a href="https://wallet.safient.io/gm" target="_next" style="margin: 0; padding: 0; box-sizing: border-box">
                      <img
                        src="https://i.ibb.co/9t39QH4/global.png"
                        alt="global"
                        border="0"
                        style="margin: 0; padding: 0; box-sizing: border-box; height: 24px; width: 24px"
                        width="24"
                        height="24"
                      />
                    </a>
                  </li>
                </ul>
              </footer>
            </div>
          </body>
        </html>
                
        `
    },
    signal: {
        id: 'signal-email',
        subject: "A signal has been created for your claim",
        data: `
        <!DOCTYPE html>
        <html
          lang="en"
          style="margin: 0; padding: 0; box-sizing: border-box; font-family: Helvetica, sans-serif; font-size: 62.5%"
        >
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>Safient Wallet |- Benificiary Claim</title>
          </head>
          <body
            style="
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              border: 1px soild gray;
              background-color: #fff;
              color: #555770;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <div class="container" style="margin: 0; box-sizing: border-box; padding: 3rem; background-color: #fff">
              <div class="content" style="margin: 0; padding: 0; box-sizing: border-box; font-size: 1.6rem">
                <h2 style="margin: 0; padding: 0; box-sizing: border-box; margin-bottom: 1.6rem; font-size: 1.8rem">
                  Hello there 👋
                </h2>
        
                <p
                  style="
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    margin-bottom: 2rem;
                    font-size: 1.6rem;
                    font-weight: 400;
                    line-height: 1.6;
                    max-width: 70rem;
                  "
                >
                A signal has been created for your safe. Login at ${WALLET_URL} to check the status.
                </p>
        
                <div class="signature" style="margin: 0; padding: 0; box-sizing: border-box">
                  <h3 style="margin: 0; padding: 0; box-sizing: border-box; font-size: 1.8rem">Thanks,</h3>
                  <p
                    style="
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                      margin-bottom: 2rem;
                      font-weight: 400;
                      line-height: 1.6;
                      font-size: 1.6rem;
                      margin-top: 0.4rem;
                    "
                  >
                    Safient Team
                  </p>
                </div>
              </div>
              <footer
                class="footer"
                style="
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  margin-top: 4rem;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <img
                  src="https://i.ibb.co/3v5Pvrz/logo-8a275223-1.png"
                  alt="logo-8a275223-1"
                  style="margin: 0; padding: 0; box-sizing: border-box; width: auto; height: 30px"
                  height="30"
                />
                <ul
                  style="
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    list-style: none;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2rem;
                  "
                >
                  <li style="margin: 0; padding: 0; box-sizing: border-box">
                    <a
                      href="https://twitter.com/safientio"
                      target="_next"
                      style="margin: 0; padding: 0; box-sizing: border-box"
                    >
                      <img
                        src="https://i.ibb.co/mSvt1VR/twitter-1.png"
                        alt="twitter-1"
                        border="0"
                        style="margin: 0; padding: 0; box-sizing: border-box; height: 24px; width: 24px"
                        width="24"
                        height="24"
                      />
                    </a>
                  </li>
                  <li style="margin: 0; padding: 0; box-sizing: border-box">
                    <a href="https://github.com/safient" target="_next" style="margin: 0; padding: 0; box-sizing: border-box">
                      <img
                        src="https://i.ibb.co/ZzY8VSB/github-1.png"
                        alt="github-1"
                        border="0"
                        style="margin: 0; padding: 0; box-sizing: border-box; height: 24px; width: 24px"
                        width="24"
                        height="24"
                      />
                    </a>
                  </li>
                  <li style="margin: 0; padding: 0; box-sizing: border-box">
                    <a href="https://wallet.safient.io/gm" target="_next" style="margin: 0; padding: 0; box-sizing: border-box">
                      <img
                        src="https://i.ibb.co/9t39QH4/global.png"
                        alt="global"
                        border="0"
                        style="margin: 0; padding: 0; box-sizing: border-box; height: 24px; width: 24px"
                        width="24"
                        height="24"
                      />
                    </a>
                  </li>
                </ul>
              </footer>
            </div>
          </body>
        </html>
             
            
        `
    },
    recovery: {
        id: 'recovery-email',
        subject: "Your safe is recovered!",
        data: `
        <!DOCTYPE html>
        <html
          lang="en"
          style="margin: 0; padding: 0; box-sizing: border-box; font-family: Helvetica, sans-serif; font-size: 62.5%"
        >
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>Safient Wallet |- Benificiary Claim</title>
          </head>
          <body
            style="
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              border: 1px soild gray;
              background-color: #fff;
              color: #555770;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <div class="container" style="margin: 0; box-sizing: border-box; padding: 3rem; background-color: #fff">
              <div class="content" style="margin: 0; padding: 0; box-sizing: border-box; font-size: 1.6rem">
                <h2 style="margin: 0; padding: 0; box-sizing: border-box; margin-bottom: 1.6rem; font-size: 1.8rem">
                  Hello there 👋
                </h2>
        
                <p
                  style="
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    margin-bottom: 2rem;
                    font-size: 1.6rem;
                    font-weight: 400;
                    line-height: 1.6;
                    max-width: 70rem;
                  "
                >
                Your safe has been recovered 🎉. Login at ${WALLET_URL} to access your safe.
                </p>
        
                <div class="signature" style="margin: 0; padding: 0; box-sizing: border-box">
                  <h3 style="margin: 0; padding: 0; box-sizing: border-box; font-size: 1.8rem">Thanks,</h3>
                  <p
                    style="
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                      margin-bottom: 2rem;
                      font-weight: 400;
                      line-height: 1.6;
                      font-size: 1.6rem;
                      margin-top: 0.4rem;
                    "
                  >
                    Safient Team
                  </p>
                </div>
              </div>
              <footer
                class="footer"
                style="
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  margin-top: 4rem;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <img
                  src="https://i.ibb.co/3v5Pvrz/logo-8a275223-1.png"
                  alt="logo-8a275223-1"
                  style="margin: 0; padding: 0; box-sizing: border-box; width: auto; height: 30px"
                  height="30"
                />
                <ul
                  style="
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    list-style: none;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2rem;
                  "
                >
                  <li style="margin: 0; padding: 0; box-sizing: border-box">
                    <a
                      href="https://twitter.com/safientio"
                      target="_next"
                      style="margin: 0; padding: 0; box-sizing: border-box"
                    >
                      <img
                        src="https://i.ibb.co/mSvt1VR/twitter-1.png"
                        alt="twitter-1"
                        border="0"
                        style="margin: 0; padding: 0; box-sizing: border-box; height: 24px; width: 24px"
                        width="24"
                        height="24"
                      />
                    </a>
                  </li>
                  <li style="margin: 0; padding: 0; box-sizing: border-box">
                    <a href="https://github.com/safient" target="_next" style="margin: 0; padding: 0; box-sizing: border-box">
                      <img
                        src="https://i.ibb.co/ZzY8VSB/github-1.png"
                        alt="github-1"
                        border="0"
                        style="margin: 0; padding: 0; box-sizing: border-box; height: 24px; width: 24px"
                        width="24"
                        height="24"
                      />
                    </a>
                  </li>
                  <li style="margin: 0; padding: 0; box-sizing: border-box">
                    <a href="https://wallet.safient.io/gm" target="_next" style="margin: 0; padding: 0; box-sizing: border-box">
                      <img
                        src="https://i.ibb.co/9t39QH4/global.png"
                        alt="global"
                        border="0"
                        style="margin: 0; padding: 0; box-sizing: border-box; height: 24px; width: 24px"
                        width="24"
                        height="24"
                      />
                    </a>
                  </li>
                </ul>
              </footer>
            </div>
          </body>
        </html> 
        `
    },

    createSafe: {
      id: 'create-safe-email',
      subject: "A safe has been created",
      data: `
      <!DOCTYPE html>
      <html
        lang="en"
        style="margin: 0; padding: 0; box-sizing: border-box; font-family: Helvetica, sans-serif; font-size: 10%"
      >
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <title>Safient Wallet |- Benificiary Claim</title>
        </head>
        <body
          style="
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            border: 1px soild gray;
            background-color: #fff;
            color: #555770;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <div class="container" style="margin: 0; box-sizing: border-box; padding: 3rem; background-color: #fff">
            <div class="content" style="margin: 0; padding: 0; box-sizing: border-box; font-size: 1rem">
              <h2 style="margin: 0; padding: 0; box-sizing: border-box; margin-bottom: 1.6rem; font-size: 1rem">
                Hello there 👋
              </h2>
      
              <p
                style="
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  margin-bottom: 2rem;
                  font-size: 1rem;
                  font-weight: 400;
                  line-height: 1.6;
                  max-width: 70rem;
                "
              >
                A safe has been created and you are added as a beneficiary. Login at ${WALLET_URL} to access the wallet.
              </p>
      
              <div class="signature" style="margin: 0; padding: 0; box-sizing: border-box">
                <h3 style="margin: 0; padding: 0; box-sizing: border-box; font-size: 1rem">Thanks,</h3>
                <p
                  style="
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    margin-bottom: 2rem;
                    font-weight: 400;
                    line-height: 1.6;
                    font-size: 1rem;
                    margin-top: 0.4rem;
                  "
                >
                  Safient Team
                </p>
              </div>
            </div>
            <footer
              class="footer"
              style="
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                margin-top: 4rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
            >
              <img
                src="https://i.ibb.co/3v5Pvrz/logo-8a275223-1.png"
                alt="logo-8a275223-1"
                style="margin: 0; padding: 0; box-sizing: border-box; width: auto; height: 30px"
                height="30"
              />
              <ul
                style="
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  list-style: none;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  gap: 2rem;
                "
              >
                <li style="margin: 0; padding: 0; box-sizing: border-box">
                  <a
                    href="https://twitter.com/safientio"
                    target="_next"
                    style="margin: 0; padding: 0; box-sizing: border-box"
                  >
                    <img
                      src="https://i.ibb.co/mSvt1VR/twitter-1.png"
                      alt="twitter-1"
                      border="0"
                      style="margin: 0; padding: 0; box-sizing: border-box; height: 24px; width: 24px"
                      width="24"
                      height="24"
                    />
                  </a>
                </li>
                <li style="margin: 0; padding: 0; box-sizing: border-box">
                  <a href="https://github.com/safient" target="_next" style="margin: 0; padding: 0; box-sizing: border-box">
                    <img
                      src="https://i.ibb.co/ZzY8VSB/github-1.png"
                      alt="github-1"
                      border="0"
                      style="margin: 0; padding: 0; box-sizing: border-box; height: 24px; width: 24px"
                      width="24"
                      height="24"
                    />
                  </a>
                </li>
                <li style="margin: 0; padding: 0; box-sizing: border-box">
                  <a href="https://wallet.safient.io/gm" target="_next" style="margin: 0; padding: 0; box-sizing: border-box">
                    <img
                      src="https://i.ibb.co/9t39QH4/global.png"
                      alt="global"
                      border="0"
                      style="margin: 0; padding: 0; box-sizing: border-box; height: 24px; width: 24px"
                      width="24"
                      height="24"
                    />
                  </a>
                </li>
              </ul>
            </footer>
          </div>
        </body>
      </html>
              
      `
  }
}