export const generateNewsletterEmail = ({ email }) => `
  <div style="
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    margin: 0;
    background:
      linear-gradient(to right, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
      #0f0c29;
    background-size: 40px 40px;
    color: #fff;
    line-height: 1.6;
  ">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="font-size: 28px; margin: 0;">You're Subscribed! 📩</h1>
      <p style="font-size: 16px; margin-top: 5px;">
        Thanks for subscribing to the TesUP newsletter.
      </p>
    </div>

    <div style="
      background: rgba(255, 255, 255, 0.15);
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    ">
      <p style="margin: 0; font-size: 16px;">
        You’ll now receive updates about:
      </p>

      <ul style="
        list-style: none;
        padding: 0;
        margin-top: 10px;
        font-size: 14px;
      ">
        <li>🚀 Platform updates</li>
        <li>💰 Investment opportunities</li>
        <li>📈 Market insights</li>
        <li>🎁 Exclusive offers</li>
      </ul>
    </div>

    <p style="text-align: center; font-size: 14px;">
      We're excited to keep you updated with the latest news and opportunities.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://yourplatform.com" style="
        display: inline-block;
        padding: 12px 25px;
        background: #fff;
        color: #0f0c29;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
      ">Visit TesUP</a>
    </div>

    <p style="font-size: 12px; text-align: center; margin-top: 30px; opacity: 0.8;">
      If you did not subscribe to this newsletter, you can ignore this email or unsubscribe anytime.
    </p>
  </div>
`;

export const generateWelcomeEmail = ({ name, code }) => `
<div style="
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  margin: 0;
background:
  linear-gradient(to right, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
  #0f0c29;
background-size: 40px 40px;
  color: #fff;
  line-height: 1.6;
">
  <div style="text-align: center; margin-bottom: 20px;">
    <h1 style="font-size: 28px; margin: 0;">Welcome to TesUP, ${name}! 🎉</h1>
    <p style="font-size: 16px; margin-top: 5px;">We’re excited to have you on board.</p>
  </div>

  <div style="
    background: rgba(255, 255, 255, 0.15);
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    margin: 20px 0;
  ">
    <p style="margin: 0; font-size: 16px;">Your verification code is:</p>
    <h2 style="
      font-size: 32px;
      letter-spacing: 4px;
      margin: 10px 0 0 0;
      color: #ffe6ff;
    ">${code}</h2>
  </div>

  <p style="text-align: center; font-size: 14px; margin-top: 10px;">
    Enter this code in the app to verify your account and get started.
  </p>

  <div style="text-align: center; margin-top: 30px;">
    <a href="https://yourplatform.com/login" style="
      display: inline-block;
      padding: 12px 25px;
      background: #fff;
      color: #0f0c29;
      text-decoration: none;
      font-weight: bold;
      border-radius: 5px;
    ">Go to Dashboard</a>
  </div>

  <p style="font-size: 12px; text-align: center; margin-top: 30px; opacity: 0.8;">
    If you did not create an account, please ignore this email.
  </p>
</div>
`;

export const generateWithdrawalSuccessEmail = ({ name, amount, coin }) => `
  <div style="
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    margin: 0;
    background:
      linear-gradient(to right, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
      #0f0c29;
    background-size: 40px 40px;
    color: #fff;
    line-height: 1.6;
  ">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="font-size: 28px; margin: 0;">Withdrawal Processed 💸</h1>
      <p style="font-size: 16px; margin-top: 5px;">
        Hi ${name}, your withdrawal request has been successfully processed.
      </p>
    </div>

    <div style="
      background: rgba(255, 255, 255, 0.15);
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    ">
      <p style="margin: 0; font-size: 16px;">Amount Withdrawn</p>
      <h2 style="
        font-size: 32px;
        margin: 10px 0;
        color: #ffe6ff;
      ">${amount} ${coin}</h2>
      <p style="margin: 0; font-size: 14px;">
        The funds have been sent to your selected withdrawal wallet.
      </p>
    </div>

    <p style="text-align: center; font-size: 14px;">
      Depending on the blockchain network, the transfer may take a few minutes to complete.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://yourplatform.com/dashboard" style="
        display: inline-block;
        padding: 12px 25px;
        background: #fff;
        color: #0f0c29;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
      ">Check Account</a>
    </div>

    <p style="font-size: 12px; text-align: center; margin-top: 30px; opacity: 0.8;">
      If you did not request this withdrawal, please contact support immediately.
    </p>
  </div>
`;

export const generateDepositSuccessEmail = ({ name, amount, coin }) => `
  <div style="
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    margin: 0;
    background:
      linear-gradient(to right, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
      #0f0c29;
    background-size: 40px 40px;
    color: #fff;
    line-height: 1.6;
  ">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="font-size: 28px; margin: 0;">Deposit Successful 💰</h1>
      <p style="font-size: 16px; margin-top: 5px;">
        Hi ${name}, your deposit has been successfully confirmed.
      </p>
    </div>

    <div style="
      background: rgba(255, 255, 255, 0.15);
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    ">
      <p style="margin: 0; font-size: 16px;">Amount Deposited</p>
      <h2 style="
        font-size: 32px;
        margin: 10px 0;
        color: #ffe6ff;
      ">${amount} ${coin}</h2>
      <p style="margin: 0; font-size: 14px;">
        The funds have been added to your wallet balance.
      </p>
    </div>

    <p style="text-align: center; font-size: 14px;">
      You can now use your balance to start investing or make withdrawals anytime.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://yourplatform.com/dashboard" style="
        display: inline-block;
        padding: 12px 25px;
        background: #fff;
        color: #0f0c29;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
      ">View Dashboard</a>
    </div>

    <p style="font-size: 12px; text-align: center; margin-top: 30px; opacity: 0.8;">
      If you did not make this deposit, please contact support immediately.
    </p>
  </div>
`;
