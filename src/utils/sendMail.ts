import nodemailer from 'nodemailer';

import {
  SMTP_SERVICE,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASSWORD,
} from '../constans/smtp';

interface MailParams {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  service: SMTP_SERVICE,
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

const sendMail = async ({ to, subject, html }: MailParams): Promise<ServiceData> => {
  try {
    const info = await transporter.sendMail({
      from: `Teanpho<${SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent message ID: %s', info.messageId);
    console.log('Message sent info: %s', info);
    return { success: true, data: info };
  } catch (error) {
    return { success: false, error };
  }
};

export default sendMail;
