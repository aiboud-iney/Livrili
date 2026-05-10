import express from 'express';
import sendEmail from '../utils/mailer.js';

const router = express.Router();

const LIVRILI_EMAIL = 'livrili.team@gmail.com';

router.post('/', async (req, res) => {
  const { name, email, subject, message, type } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message is required' });
  }

  const emailSubject = subject?.trim()
    ? `[Livrili Feedback] ${subject.trim()}`
    : `[Livrili Feedback] ${type || 'General'} from ${name || email || 'User'}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <div style="background:#7C3AED;padding:20px 24px;border-radius:12px 12px 0 0;">
        <h2 style="color:white;margin:0;font-size:20px;">New Feedback Received</h2>
      </div>
      <div style="background:#f9f9f9;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          ${name ? `<tr><td style="padding:8px 0;font-weight:700;color:#374151;width:100px;">Name</td><td style="padding:8px 0;color:#111;">${name}</td></tr>` : ''}
          ${email ? `<tr><td style="padding:8px 0;font-weight:700;color:#374151;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#7C3AED;">${email}</a></td></tr>` : ''}
          ${type ? `<tr><td style="padding:8px 0;font-weight:700;color:#374151;">Type</td><td style="padding:8px 0;color:#111;">${type}</td></tr>` : ''}
          ${subject?.trim() ? `<tr><td style="padding:8px 0;font-weight:700;color:#374151;">Subject</td><td style="padding:8px 0;color:#111;">${subject}</td></tr>` : ''}
        </table>
        <div style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:16px;">
          <p style="font-weight:700;color:#374151;margin:0 0 8px;">Message</p>
          <p style="color:#111;line-height:1.7;margin:0;white-space:pre-wrap;">${message}</p>
        </div>
        <p style="font-size:12px;color:#9ca3af;margin-top:20px;">Sent via Livrili</p>
      </div>
    </div>
  `;

  try {
    await sendEmail(LIVRILI_EMAIL, emailSubject, html);
    res.json({ message: 'Feedback sent successfully' });
  } catch (err) {
    console.error('Feedback email error:', err);
    res.status(500).json({ message: 'Failed to send feedback' });
  }
});

export default router;
