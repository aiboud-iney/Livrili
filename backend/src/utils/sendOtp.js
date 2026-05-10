import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

export async function sendOtpEmail(userEmail, otp) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f0fdf4;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;padding:24px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:480px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          <tr>
            <td style="background-color:#16a34a;padding:32px 24px;text-align:center;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Livrili</h1>
              <p style="margin:4px 0 0;font-size:14px;color:rgba(255,255,255,0.8);">Verify your account</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;">
              <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hello,</p>
              <p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.6;">
                Use the code below to verify your Livrili account. This code expires in <strong>10 minutes</strong>.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="background-color:#f0fdf4;border:2px solid #16a34a;border-radius:12px;padding:24px;">
                    <p style="margin:0 0 12px;font-size:11px;color:#16a34a;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Verification Code</p>
                    <p style="margin:0;font-size:40px;font-weight:700;color:#16a34a;letter-spacing:8px;font-family:'Courier New',Courier,monospace;">${otp}</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:20px;">
                <tr>
                  <td style="background-color:#fef2f2;border-left:4px solid #ef4444;border-radius:6px;padding:14px 16px;">
                    <p style="margin:0;font-size:13px;color:#991b1b;line-height:1.5;">
                      <strong>Security tip:</strong> Never share this code with anyone. Livrili will never ask for your verification code.
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0;font-size:14px;color:#9ca3af;">If you didn't create a Livrili account, please ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">
                Need help? Contact us at
                <a href="mailto:livrili.team@gmail.com" style="color:#16a34a;text-decoration:underline;">livrili.team@gmail.com</a>
              </p>
              <p style="margin:0;font-size:12px;color:#d1d5db;">&copy; ${new Date().getFullYear()} Livrili. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const info = await transporter.sendMail({
    from: '"Livrili" <livrili.team@gmail.com>',
    to: userEmail,
    subject: 'Verify your Livrili Account',
    html,
  });

  console.log('OTP email sent:', info.messageId);
}
