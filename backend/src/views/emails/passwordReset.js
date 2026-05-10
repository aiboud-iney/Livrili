import { baseLayout } from './layout.js';

export function passwordResetTemplate({ name, resetLink }) {
  const body = `
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hello <strong style="color: #111827;">${name || 'there'}</strong>,
    </p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
      We received a request to reset your Livrili account password. Click the button below to set a new password.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="background-color: #7C3AED; border-radius: 8px;">
                <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; border-radius: 8px; background-color: #7C3AED;">Reset Password</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 24px 0;">
      <tr>
        <td style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 14px 16px;">
          <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5;">
            <strong>Link expires in 1 hour.</strong> If you didn't request this, please ignore this email and your password will remain unchanged.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">
      Can't click the button? Copy and paste this link into your browser:<br>
      <a href="${resetLink}" style="color: #7C3AED; word-break: break-all; font-size: 13px;">${resetLink}</a>
    </p>
  `;

  return baseLayout({ title: 'Reset your Livrili Password', previewText: 'Password reset link', body });
}
