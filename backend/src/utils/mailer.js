import { Resend } from 'resend';
import dotenv from 'dotenv';

import { otpTemplate } from '../views/emails/otp.js';
import { welcomeTemplate } from '../views/emails/welcome.js';
import { passwordResetTemplate } from '../views/emails/passwordReset.js';
import { contactUsTemplate } from '../views/emails/contactUs.js';
import { subscriptionAcceptedTemplate } from '../views/emails/subscriptionAccepted.js';
import { subscriptionRejectedTemplate } from '../views/emails/subscriptionRejected.js';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'Livrili <onboarding@resend.dev>';

function logEmail(to, subject, reason) {
  console.log(`\n========== EMAIL (${reason}) ==========`);
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('='.repeat(40) + '\n');
}

const sendEmail = async (to, subject, html) => {
  if (!process.env.RESEND_API_KEY) {
    logEmail(to, subject, 'Resend API key not configured');
    return false;
  }

  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    });
    console.log('Email sent:', result.id);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    logEmail(to, subject, 'send failed – fallback');
    return false;
  }
};

export const sendVerificationCode = async (to, code, name) => {
  const subject = 'Verify your Livrili Account';
  const html = otpTemplate({ name, code });
  return sendEmail(to, subject, html);
};

export const sendWelcomeEmail = async (to, name) => {
  const subject = 'Welcome to Livrili!';
  const html = welcomeTemplate({ name });
  return sendEmail(to, subject, html);
};

export const sendPasswordResetEmail = async (to, name, resetLink) => {
  const subject = 'Reset your Livrili Password';
  const html = passwordResetTemplate({ name, resetLink });
  return sendEmail(to, subject, html);
};

export const sendContactUsEmail = async (to, name, message) => {
  const subject = 'We received your message';
  const html = contactUsTemplate({ name, message });
  return sendEmail(to, subject, html);
};

export const sendSubscriptionAcceptedEmail = async (to, { name, planName, amount, startDate, endDate, billingCycle, features }) => {
  const subject = 'Subscription Approved!';
  const html = subscriptionAcceptedTemplate({ name, planName, amount, startDate, endDate, billingCycle, features });
  return sendEmail(to, subject, html);
};

export const sendSubscriptionRejectedEmail = async (to, { name, planName, reason }) => {
  const subject = 'Update on your Subscription Request';
  const html = subscriptionRejectedTemplate({ name, planName, reason });
  return sendEmail(to, subject, html);
};

export default sendEmail;
