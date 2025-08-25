import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { angryText } = await req.json();
    
    if (!angryText) {
      return new Response(
        JSON.stringify({ error: 'angryText is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      console.error('GROQ_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
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
- Follow google and amazon level professionalism and values while transforming the message. 

Return ONLY the transformed message, no explanations, no thig that says i'll help you or anything else, just the transformed message.`
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
      console.error(`Groq API error: ${response.status}`);
      return new Response(
        JSON.stringify({ error: `Groq API error: ${response.status}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const transformedText = data.choices[0]?.message?.content || "Unable to transform the message. Please try again.";

    return new Response(
      JSON.stringify({ transformedText }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in transform-text function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to transform the message. Please check your connection and try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});