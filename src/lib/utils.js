const nodemailer = require("nodemailer");

/**
 * Sends an email using nodemailer.
 *
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Subject of the email.
 * @param {string} htmlContent - HTML content of the email.
 * @returns {Promise} Resolves if email is sent successfully, rejects otherwise.
 */
const sendMail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g., "smtp.gmail.com"
    port: process.env.SMTP_PORT, // 587 for TLS or 465 for SSL
    secure: process.env.SMTP_PORT === "465", // true for SSL, false for TLS
    auth: {
      user: process.env.SMTP_USER, // Your email address
      pass: process.env.SMTP_PASSWORD, // Your email password or app password
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.SMTP_USER, // Sender address
    to, // Recipient address
    subject, // Subject line
    html: htmlContent, // HTML body content
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
