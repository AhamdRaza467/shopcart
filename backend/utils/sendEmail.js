const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define the email options
  const mailOptions = {
    from: `"ShopCart Admin" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // Actually send the email
  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent: ${info.messageId}`);
};

module.exports = sendEmail;
