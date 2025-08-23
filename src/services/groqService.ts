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
            content: `Transform angry workplace messages into concise, professional alternatives. Keep responses sharp and brief while maintaining a positive, optimistic tone.

Rules:
- Be direct and concise - no unnecessary words
- Stay professional and diplomatic  
- Use positive, solution-focused language
- Keep the core message intact
- Add brief professional framing when needed
- Maximum 2-3 sentences
- Sound optimistic and collaborative

Return ONLY the transformed message, no explanations.`
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