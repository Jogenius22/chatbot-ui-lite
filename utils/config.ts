import { OpenAIModel, ChatbotConfig } from "@/types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key must be provided.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

let chatbotConfig: ChatbotConfig;

export const setChatbotConfig = async (newConfig: Partial<ChatbotConfig>) => {
  const { data, error } = await supabase
    .from("config")
    .update({ ...newConfig })
    .match({ id: 1 });

  if (error || !data) {
    console.error("Error updating configuration: ", error);
    return;
  }

  // Update local config
  chatbotConfig = data[0];
  console.log("Updated chatbot configuration: ", data[0]);
};

export const getChatbotConfig = async (): Promise<ChatbotConfig> => {
  if (chatbotConfig) {
    // If local config exists, return it
    return chatbotConfig;
  }

  // Otherwise, fetch from DB
  const { data, error } = await supabase
    .from("config")
    .select("*")
    .match({ id: 1 });

  if (error || !data) {
    console.error("Error fetching configuration: ", error);
    return {
      model: OpenAIModel.DAVINCI_TURBO,
      temperature: 0.5,
      maxTokens: 200,
      prompt: "You are a helpful, friendly, assistant.",
    };
  }

  // Save the fetched config to local variable
  chatbotConfig = data[0];
  return data[0];
};
