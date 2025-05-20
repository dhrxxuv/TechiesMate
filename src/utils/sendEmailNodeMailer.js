require('dotenv').config()
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY || 'your-resend-api-key-here');

const sendEmail = async (toEmail, subject, htmlContent) => {
  try {
    const data = await resend.emails.send({
      from: 'no-reply@techiesmate.biz', 
      to: [toEmail],
      subject: subject,
      html: htmlContent,
    });

    return data;
  } catch (error) {
    console.error("Resend email error:", error);
    throw new Error("Failed to send email via Resend.");
  }
};

module.exports = sendEmail;
