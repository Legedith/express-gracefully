const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const transformTextWithGroq = async (angryText: string): Promise<string> => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a professional communication expert. Transform angry, frustrated, or blunt workplace messages into polished, diplomatic, and professional alternatives that maintain the core message but use appropriate corporate language.

Guidelines:
- Keep the original intent and meaning
- Use diplomatic, positive language
- Add professional framing phrases like "I'd like to discuss", "I believe we could explore", "I'd appreciate clarity on"
- Remove emotional language, profanity, or aggressive tone
- Make it suitable for workplace communication
- Keep it concise and actionable
- Return ONLY the transformed professional message, no explanations`
          },
          {
            role: "user",
            content: `Transform this message into professional workplace language: "${angryText}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Unable to transform the message. Please try again.";
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw new Error("Failed to transform the message. Please check your connection and try again.");
  }
};