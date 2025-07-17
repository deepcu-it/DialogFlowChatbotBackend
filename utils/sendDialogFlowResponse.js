export const sendDialogFlowResponse = (res, text) => {
    const messages = Array.isArray(text) ? text.map(t => ({ text: { text: [t] } })) : [{ text: { text: [text] } }];
    return res.status(200).json({
        "fulfillment_response": {
            "messages": messages
        }
    });
}