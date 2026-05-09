import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const mailFrom = process.env.GMAIL_USER || 'noreply@livrili.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

function logEmail(to, subject, reason) {
  console.log(`\n========== EMAIL (${reason}) ==========`);
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`From:    ${mailFrom}`);
  console.log('='.repeat(40) + '\n');
}

const sendEmail = async (to, subject, html) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
    logEmail(to, subject, 'Gmail credentials not configured');
    return true;
  }

  try {
    const result = await transporter.sendMail({
      from: `"Livrili" <${mailFrom}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    logEmail(to, subject, 'send failed – fallback');
    return false;
  }
};

export const sendVerificationCode = async (to, code) => {
  const subject = 'Verify your Livrili Account';
  const html = generateVerificationEmailHTML(code);
  return sendEmail(to, subject, html);
};

function generateVerificationEmailHTML(code) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Livrili Verification Code</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 24px;
            color: #555;
        }
        .otp-section {
            text-align: center;
            margin: 32px 0;
        }
        .otp-label {
            font-size: 14px;
            color: #888;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 500;
        }
        .otp-box {
            background-color: #f9f9f9;
            border: 2px solid #7C3AED;
            border-radius: 8px;
            padding: 24px;
            display: inline-block;
            margin: 12px 0;
        }
        .otp-code {
            font-size: 48px;
            font-weight: 700;
            color: #7C3AED;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            margin: 0;
            word-spacing: 12px;
        }
        .expiration {
            background-color: #fef3f2;
            border-left: 4px solid #f97316;
            padding: 16px;
            margin: 24px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #7c2d12;
        }
        .message {
            color: #666;
            font-size: 15px;
            margin: 24px 0;
            line-height: 1.8;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #999;
        }
        .footer-text {
            margin: 8px 0;
        }
        .brand {
            color: #7C3AED;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Livrili</h1>
        </div>

        <div class="content">
            <p class="greeting">Hello,</p>

            <p class="message">
                Your one-time password (OTP) for verifying your Livrili account is below.
                Please use this code to complete your verification.
            </p>

            <div class="otp-section">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-box">
                    <p class="otp-code">${code}</p>
                </div>
            </div>

            <div class="expiration">
                <strong>⏱ Code Expires In:</strong> 10 minutes from the time you received this email.
            </div>

            <p class="message">
                For your security, never share this code with anyone.
                Our team will never ask you for this code.
            </p>
        </div>

        <div class="footer">
            <div class="footer-text">
                If you didn't request this verification code, you can safely ignore this email.
            </div>
            <div class="footer-text">
                © 2024 <span class="brand">Livrili</span>. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

export default sendEmail;
