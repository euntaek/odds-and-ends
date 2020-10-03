import nodemailer from 'nodemailer';

interface MailParams {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  service: process.env.SMTPT_SERVICE,
  host: process.env.SMTPT_HOST,
  port: parseInt(process.env.SMTPT_PORT as string, 10),
  secure: process.env.SMTPT_SECURE === 'true',
  auth: {
    user: process.env.SMTPT_USER,
    pass: process.env.SMTPT_PASSWORD,
  },
});

const sendMail = async ({
  to,
  subject,
  html,
}: MailParams): Promise<{ success: boolean; data: any; error: any }> => {
  try {
    const info = await transporter.sendMail({
      from: `심플게시판<${process.env.SMTPT_USER}>`,
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
