import { baseLayout } from './layout.js';

export function subscriptionRejectedTemplate({ name, planName, reason }) {
  const body = `
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hello <strong style="color: #111827;">${name || 'there'}</strong>,
    </p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
      Unfortunately, your subscription request for <strong>${planName || 'Premium Plan'}</strong> was <strong style="color: #dc2626;">not approved</strong>.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 24px 0;">
      <tr>
        <td style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px;">
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #dc2626; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Reason</p>
          <p style="margin: 0; font-size: 15px; color: #991b1b; line-height: 1.6;">${reason || 'Your payment receipt could not be verified. Please check your payment details and try again.'}</p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 20px 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
      You can submit a new subscription request anytime. If you believe this was a mistake, please contact our support team.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="background-color: #7C3AED; border-radius: 8px;">
                <a href="https://livrili-frontend.onrender.com/Dashboard/parametres" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; border-radius: 8px; background-color: #7C3AED;">Try Again</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">
      Need help? Contact <a href="mailto:livrili.team@gmail.com" style="color: #7C3AED;">livrili.team@gmail.com</a>
    </p>
  `;

  return baseLayout({ title: 'Subscription Update', previewText: 'Your subscription was not approved', body });
}
