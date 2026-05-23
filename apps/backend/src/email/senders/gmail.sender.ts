import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASSWORD
  }
});

interface SendMailPayload {
  to: string;
  subject: string;
  content: string;
}

export async function sendEmail(
  payload: SendMailPayload
) {
  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to: payload.to,
    subject: payload.subject,
    text: payload.content,
     headers: {
      'X-MailPilot': 'true'
    }
  });
}