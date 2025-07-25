const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter object using the default SMTP transport
  // Replace with your actual SMTP configuration
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // Use 'true' for 465, 'false' for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    // Optional: Add TLS options if needed (e.g., for self-signed certs)
    // tls: {
    //   rejectUnauthorized: false
    // }
  });

  // 2. Setup email data
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // Sender address
    to: options.email, // List of receivers
    subject: options.subject, // Subject line
    html: options.message, // HTML body
  };

  // 3. Send mail with defined transport object
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;