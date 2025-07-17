import { sendEmail } from "../utils/sendEmail.js";

export const automateEmail = async (req, res) => {
  try {
    const parameters = req.body.queryResult.parameters;

    const recipient = parameters.email;
    const phone = parameters["phone-number"];
    const service = parameters.ServiceType;
    const name = parameters.person?.name || "User";

    const subject = "Service Confirmation - Dialogflow Bot";
    const text = `Hi ${name},\n\nThanks for reaching out!\nYour request for "${service}" has been successfully received.\nWe will contact you shortly at ${phone}.\n\nRegards,\nSmart Service Bot`;

    const emailStatus = await sendEmail({ to: recipient, subject, text });

    if (!emailStatus.success) {
      throw new Error(emailStatus.error || "Failed to send email");
    }

    res.status(200).json({
      fulfillmentText: `Hi ${name}, your request for ${service} has been processed. Confirmation sent to ${recipient}.`,
    });
  } catch (e) {
    console.error("Webhook Error:", e.message);
    res.status(200).json({
      fulfillmentText:
        "Sorry, we encountered an issue while sending your confirmation email. Please try again.",
    });
  }
};
export const saveDataInDatabase = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Data saved in database",
        });
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message,
        });
    }
}
export const checkWebhook = async (req, res) => {
    try {
        
        res.status(200).json({
            success: true,
            message: "Webhook is active",
        });
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message,
        });
    }
}