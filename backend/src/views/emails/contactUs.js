import { baseLayout } from './layout.js';

export function contactUsTemplate({ name, message }) {
  const preview = message && message.length > 100 ? message.substring(0, 100) + '...' : message || '';

  const body = `
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
      Hi <strong style="color: #111827;">${name || 'there'}</strong>,
    </p>
    <p style="margin: 0 0 8px 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
      We received your message and will get back to you within <strong>24 hours</strong>.
    </p>

    ${preview ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 16px 0 24px 0;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; font-size: 14px; color: #6b7280; line-height: 1.6; font-style: italic;">
          &ldquo;${preview}&rdquo;
        </td>
      </tr>
    </table>
    ` : ''}

    <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
      For urgent issues, you can reach us directly at:
    </p>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #7C3AED; font-weight: 600;">
      <a href="mailto:livrili.team@gmail.com" style="color: #7C3AED; text-decoration: none;">livrili.team@gmail.com</a>
    </p>

    <p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5;">
      Thank you for reaching out!
    </p>
  `;

  return baseLayout({ title: 'We received your message', previewText: 'Livrili support', body });
}
