export function baseLayout({ title, previewText, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
</head>
<body style="font-family: 'Segoe UI', Arial, Helvetica, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f5; min-width: 100%;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">

          <tr>
            <td style="background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); padding: 36px 24px; text-align: center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <img src="https://livrili-backend.onrender.com/images/logo-purple.png" alt="Livrili" width="48" height="48" style="display: block; border: 0; outline: none; width: 48px; height: 48px;" />
                    <h1 style="margin: 12px 0 0 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; font-family: 'Segoe UI', Arial, Helvetica, sans-serif;">Livrili</h1>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.75); font-weight: 400;">Logistics, Simplified</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 24px;">
              ${body}
            </td>
          </tr>

          <tr>
            <td style="padding: 0 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="border-top: 1px solid #e5e7eb; height: 1px; line-height: 1px; font-size: 1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af; line-height: 1.5;">
                Need help? Contact us at
                <a href="mailto:livrili.team@gmail.com" style="color: #7C3AED; text-decoration: underline; font-weight: 500;">livrili.team@gmail.com</a>
              </p>
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #9ca3af;">
                <a href="#" style="color: #7C3AED; text-decoration: none; margin: 0 8px;">Instagram</a>
                &bull;
                <a href="#" style="color: #7C3AED; text-decoration: none; margin: 0 8px;">LinkedIn</a>
                &bull;
                <a href="#" style="color: #7C3AED; text-decoration: none; margin: 0 8px;">Facebook</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #d1d5db;">
                &copy; ${new Date().getFullYear()} Livrili. All rights reserved.
              </p>
              <p style="margin: 0 4px 0 0; font-size: 11px; color: #d1d5db;">
                If you didn't request this email, you can safely ignore it.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
