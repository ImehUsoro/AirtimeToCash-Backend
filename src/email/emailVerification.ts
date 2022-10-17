export function emailVerificationView(token: string): string {
  const link = `${process.env.BACKEND_URL}/users/verify/${token}`;
  let temp = `
     <div style="max-width: 700px;
     margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
     <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to Airtime to Cash POD G.</h2>
      <p>Hi there, Follow the link by clicking on the button to verify your email
      </p>
       <a href=${link}
       style="background: crimson; text-decoration: none; color: white;
        padding: 10px 20px; margin: 10px 0;
       display: inline-block;">Click here</a>
      </div>
      `;
  return temp;
}

export function forgotPasswordVerification(id: string): string {
  const link = `${process.env.FRONTEND_URL}/user/reset-password/${id}`;

  let temp = `
     <div style="max-width: 700px;
     margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
     <h2 style="text-align: center; text-transform: uppercase;color: teal;">Change your password.</h2>
      <p>Hi there, Follow the link by clicking on the button to change your password.
      </p>
       <a href=${link}
       style="background: crimson; text-decoration: none; color: white;
        padding: 10px 20px; margin: 10px 0;
       display: inline-block;">Click here</a>
      </div>
      `;
  return temp;
}

export function transactionNotification(): string {
  const link = `${process.env.FRONTEND_URL}/admin/dashboard`;

  let temp = `
     <div style="max-width: 700px;
     margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
     <h2 style="text-align: center; text-transform: uppercase;color: teal;">Confirm my Transaction</h2>
      <p>Hi there, a transaction has just been made. Please click the link below to access your dashboard
      </p>
       <a href=${link}
       style="background: crimson; text-decoration: none; color: white;
        padding: 10px 20px; margin: 10px 0;
       display: inline-block;">Click here</a>
      </div>
      `;
  return temp;
}

export function sendOTPNotification(otp: number): string {
  let temp = `
     <div style="max-width: 700px;
     margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
     <h2 style="text-align: center; text-transform: uppercase;color: teal;">Confirm A Transaction</h2>
      <p>Hi there, looks like you're attempting to confirm a transaction.
      </p>
      Please use the OTP code <strong>${otp}</strong> to complete this transaction. This code is valid for 10 minutes.
      </p>
      </div>
      `;
  return temp;
}
