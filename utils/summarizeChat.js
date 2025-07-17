import { GoogleGenAI } from "@google/genai";



export const summarizeChat = async (generativeInfo, parameters, apiKey) => {
    const ai = new GoogleGenAI({ apiKey });

    const textInput = JSON.stringify(generativeInfo);
    
    const systemInstruction = `
    -You are a helpful assistant that summarizes conversations in a paragraph.
    -Your task is to create a concise summary of the conversation based on the provided conversation data between the user and the agent.
    -The summary should be clear, concise, and capture the main points of the conversation within 150 words as a single paragraph.
    -The conversation should be positive and clear.
    -Avoid critiques or feedback on the conversation
`;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: textInput,
            
            generationConfig: {
                systemInstruction,
            },
        });

        const outputText = result.text.trim();

        return outputText;
    } catch (err) {
        console.error("Error during Gemini summarization:", err);
        throw err;
    }
};
