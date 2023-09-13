const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) create transporter (service that will send email like gmail)

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) define email options (from, to, text, html format, content)
  const mailOptions = {
    from: "Ecommerce-website <moaza2298@gmail.com>",
    to: options.to,
    subject: options.subject,
    text: options.message,
  };

  // 3) send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
