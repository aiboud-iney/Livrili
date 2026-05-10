import { baseLayout } from './layout.js';

export function welcomeTemplate({ name }) {
  const body = `
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Welcome to Livrili, <strong style="color: #111827;">${name || 'there'}!</strong>
    </p>
    <p style="margin: 0 0 8px 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
      Your account has been verified. You now have full access to:
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 16px 0 24px 0;">
      <tr>
        <td style="padding: 8px 0; font-size: 14px; color: #374151;">
          <span style="color: #7C3AED; font-weight: 700; margin-right: 8px;">✓</span> Browse available shipments
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 14px; color: #374151; border-top: 1px solid #f3f4f6;">
          <span style="color: #7C3AED; font-weight: 700; margin-right: 8px;">✓</span> Post your own shipments
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 14px; color: #374151; border-top: 1px solid #f3f4f6;">
          <span style="color: #7C3AED; font-weight: 700; margin-right: 8px;">✓</span> Track deliveries in real-time
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 14px; color: #374151; border-top: 1px solid #f3f4f6;">
          <span style="color: #7C3AED; font-weight: 700; margin-right: 8px;">✓</span> Manage your fleet and routes
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="background-color: #7C3AED; border-radius: 8px;">
                <a href="https://livrili-frontend.onrender.com/Dashboard" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; border-radius: 8px; background-color: #7C3AED;">Go to Dashboard</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">
      We're excited to have you on board. If you have any questions, just reply to this email.
    </p>
  `;

  return baseLayout({ title: 'Welcome to Livrili!', previewText: 'Your account has been verified.', body });
}
