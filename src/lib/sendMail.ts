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

const sendMail = async ({
  to,
  subject,
  html,
}: MailParams): Promise<{ success: boolean; data: any; error: any }> => {
  try {
    const info = await transporter.sendMail({
      from: `160chars<${SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return { success: true, data: info, error: null };
  } catch (error) {
    return { success: false, data: null, error };
  }
};

export default sendMail;
