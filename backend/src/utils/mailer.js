import dotenv from 'dotenv';

import { otpTemplate } from '../views/emails/otp.js';
import { welcomeTemplate } from '../views/emails/welcome.js';
import { passwordResetTemplate } from '../views/emails/passwordReset.js';
import { contactUsTemplate } from '../views/emails/contactUs.js';
import { subscriptionAcceptedTemplate } from '../views/emails/subscriptionAccepted.js';
import { subscriptionRejectedTemplate } from '../views/emails/subscriptionRejected.js';

dotenv.config();

const FROM_EMAIL = 'livrili.team@gmail.com';
const FROM_NAME = 'Livrili';

const sendEmail = async (to, subject, html) => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn(`[EMAIL SKIPPED - no BREVO_API_KEY] To: ${to} | Subject: ${subject}`);
    throw new Error('Email service not configured (BREVO_API_KEY missing)');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Brevo error ${response.status}:`, body);
    throw new Error(`Failed to send email (Brevo ${response.status})`);
  }

  console.log(`Email sent via Brevo to ${to} [${response.status}]`);
};

export const sendOtpEmail = async (userEmail, otp) => {
  const subject = 'Verify your Livrili Account';
  const html = otpTemplate({ name: '', code: otp });
  await sendEmail(userEmail, subject, html);
};

export const sendWelcomeEmail = async (to, name) => {
  const subject = 'Welcome to Livrili!';
  const html = welcomeTemplate({ name });
  await sendEmail(to, subject, html);
};

export const sendPasswordResetEmail = async (to, name, resetLink) => {
  const subject = 'Reset your Livrili Password';
  const html = passwordResetTemplate({ name, resetLink });
  await sendEmail(to, subject, html);
};

export const sendContactUsEmail = async (to, name, message) => {
  const subject = 'We received your message';
  const html = contactUsTemplate({ name, message });
  await sendEmail(to, subject, html);
};

export const sendSubscriptionAcceptedEmail = async (to, { name, planName, amount, startDate, endDate, billingCycle, features }) => {
  const subject = 'Subscription Approved!';
  const html = subscriptionAcceptedTemplate({ name, planName, amount, startDate, endDate, billingCycle, features });
  await sendEmail(to, subject, html);
};

export const sendSubscriptionRejectedEmail = async (to, { name, planName, reason }) => {
  const subject = 'Update on your Subscription Request';
  const html = subscriptionRejectedTemplate({ name, planName, reason });
  await sendEmail(to, subject, html);
};

export default sendEmail;
