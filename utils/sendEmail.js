import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error.message);
    return { success: false, error: error.message };
  }
};
