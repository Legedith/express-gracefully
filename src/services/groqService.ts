import { supabase } from "@/integrations/supabase/client";

export const transformTextWithGroq = async (angryText: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('transform-text', {
      body: { angryText }
    });

    if (error) {
      console.error("Error calling transform-text function:", error);
      throw new Error("Failed to transform the message. Please check your connection and try again.");
    }

    return data.transformedText || "Unable to transform the message. Please try again.";
  } catch (error) {
    console.error("Error calling transform-text function:", error);
    throw new Error("Failed to transform the message. Please check your connection and try again.");
  }
};