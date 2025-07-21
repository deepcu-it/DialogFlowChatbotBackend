import express from "express";

import { automateEmail, checkWebhook, saveDataInDatabase } from "../controllers/webhookController.js";
import { sendDialogFlowResponse } from "../utils/sendDialogFlowResponse.js";

import path from "path";
import { sendEmail } from "../utils/sendEmail.js";
import { getChatFromGoogleLogs } from "../utils/getChatFromGoogleLogs.js";
import { summarizeChat } from "../utils/summarizeChat.js";
const router = express.Router();

router.route("/check").get(checkWebhook);


router.post("/fetchlogs-summarize-sendEmail", async (req, res) => {

    const sessionId = req.body.sessionInfo.session.split("/").at(-1) || "99e821ae-2d0b-4517-ba55-d81829c0874f";
    console.log("Session ID:", sessionId);
    const PROJECT_ID = process.env.PROJECT_ID;

    try {
        // Step 1: Fetch logs
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulate delay for logs fetching
        console.log("Fetching logs from Google logs...");
        const logs = await getChatFromGoogleLogs(sessionId, PROJECT_ID);
        console.log("Chats fetched from Google logs.");

        if (logs.length === 0) {
            console.log("No logs found for the session.");
            return res.status(404).json({ success: false, message: "No logs found" });
        }

        // Step 2: Format generative info
        const generativeInfo = logs.map((log) => ({
            userPrompt: log.payload.queryResult.generativeInfo?.actionTracingInfo.actions[0]?.userUtterance.text || "No user prompt",
            response: log.payload.queryResult.generativeInfo?.actionTracingInfo.actions[1]?.agentUtterance.text || "No agent response",
        }));

        const parameters = logs.at(-1).payload.queryResult.parameters || {};
        console.log("Generative info formatted.");

        // Step 3: Summarize conversation
        const summary = await summarizeChat(generativeInfo, parameters, process.env.GEMINI_API_KEY);

        console.log("Chat summarized.");
        // Step 4: Send email
        await sendEmail({
            to: "ghostttttttt@me.com",
            subject: `Summary for session ${sessionId}`,
            text: summary,
        });
        console.log("Email sent successfully.");

        return sendDialogFlowResponse(res, ["Chat summarized and mail sent successfully."]);

    } catch (error) {
        console.error("Final route error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
});

export default router;