import { baseLayout } from './layout.js';

export function subscriptionAcceptedTemplate({ name, planName, amount, startDate, endDate, billingCycle, features }) {
  const featuresList = features && features.length > 0
    ? features.map((f, i) => `
      <tr>
        <td style="padding: 8px 0; font-size: 14px; color: #374151; ${i > 0 ? 'border-top: 1px solid #f3f4f6;' : ''}">
          <span style="color: #059669; font-weight: 700; margin-right: 8px;">✓</span> ${f}
        </td>
      </tr>
    `).join('')
    : '';

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  const body = `
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Congratulations <strong style="color: #111827;">${name || 'there'}!</strong>
    </p>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
      Your subscription has been <strong style="color: #059669;">approved</strong> and is now active.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 24px 0; border: 1px solid #e5e7eb; border-radius: 12px;">
      <tr>
        <td style="background-color: #f0fdf4; padding: 16px 20px; border-bottom: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 18px; font-weight: 700; color: #059669;">${planName || 'Premium Plan'}</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #6b7280;">Active</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #f3f4f6;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="font-size: 14px; color: #6b7280; width: 40%;">Amount</td>
              <td style="font-size: 14px; color: #111827; font-weight: 600; width: 60%;">${amount ? Number(amount).toLocaleString() : '—'} DZD</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #f3f4f6;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="font-size: 14px; color: #6b7280; width: 40%;">Billing Cycle</td>
              <td style="font-size: 14px; color: #111827; font-weight: 600; width: 60%;">${billingCycle || 'Monthly'}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #f3f4f6;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="font-size: 14px; color: #6b7280; width: 40%;">Start Date</td>
              <td style="font-size: 14px; color: #111827; font-weight: 600; width: 60%;">${fmtDate(startDate)}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="font-size: 14px; color: #6b7280; width: 40%;">End Date</td>
              <td style="font-size: 14px; color: #111827; font-weight: 600; width: 60%;">${fmtDate(endDate)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${featuresList ? `
    <p style="margin: 0 0 12px 0; font-size: 14px; color: #374151; font-weight: 600;">What's included:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 24px 0;">
      ${featuresList}
    </table>
    ` : ''}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="background-color: #7C3AED; border-radius: 8px;">
                <a href="https://livrili-frontend.onrender.com/Dashboard/parametres" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; border-radius: 8px; background-color: #7C3AED;">View Subscription</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">
      Thank you for choosing Livrili Premium!
    </p>
  `;

  return baseLayout({ title: 'Subscription Approved!', previewText: `${planName} is now active`, body });
}
