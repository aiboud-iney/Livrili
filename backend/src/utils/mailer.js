import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import { otpTemplate } from '../views/emails/otp.js';
import { welcomeTemplate } from '../views/emails/welcome.js';
import { passwordResetTemplate } from '../views/emails/passwordReset.js';
import { contactUsTemplate } from '../views/emails/contactUs.js';
import { subscriptionAcceptedTemplate } from '../views/emails/subscriptionAccepted.js';
import { subscriptionRejectedTemplate } from '../views/emails/subscriptionRejected.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

const FROM = '"Livrili" <livrili.team@gmail.com>';

function logEmail(to, subject, reason) {
  console.log(`\n========== EMAIL (${reason}) ==========`);
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('='.repeat(40) + '\n');
}

const sendEmail = async (to, subject, html) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
    logEmail(to, subject, 'Gmail SMTP not configured');
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: FROM,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    logEmail(to, subject, 'send failed – fallback');
    return false;
  }
};

export const sendOtpEmail = async (userEmail, otp) => {
  const subject = 'Verify your Livrili Account';
  const html = otpTemplate({ name: '', code: otp });
  return sendEmail(userEmail, subject, html);
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
