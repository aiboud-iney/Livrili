import { baseLayout } from './layout.js';

export function otpTemplate({ name, code }) {
  const body = `
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hello <strong style="color: #111827;">${name || 'there'}</strong>,
    </p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
      Use the code below to verify your Livrili account. This code expires in <strong>10 minutes</strong>.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 24px 0;">
      <tr>
        <td align="center" style="background-color: #f5f3ff; border: 2px solid #7C3AED; border-radius: 12px; padding: 24px;">
          <p style="margin: 0 0 12px 0; font-size: 12px; color: #7C3AED; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Verification Code</p>
          <p style="margin: 0; font-size: 42px; font-weight: 700; color: #7C3AED; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">${code}</p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 24px 0;">
      <tr>
        <td style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 6px; padding: 14px 16px;">
          <p style="margin: 0; font-size: 13px; color: #991b1b; line-height: 1.5;">
            <strong>Security tip:</strong> Never share this code with anyone. Livrili will never ask for your verification code.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">
      If you didn't create a Livrili account, please ignore this email.
    </p>
  `;

  return baseLayout({ title: 'Verify your Livrili Account', previewText: `Your verification code: ${code}`, body });
}
