import { OpenAIModel, ChatbotConfig } from "@/types";
import { createPool } from "mysql2/promise";
import mysql from "mysql2/promise";

let chatbotConfig: ChatbotConfig;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Database URL and key must be provided.");
}
const pool = mysql.createPool(databaseUrl);

export const setChatbotConfig = async (newConfig: Partial<ChatbotConfig>) => {
  try {
    // De-structure the newConfig object into individual variables
    const { model, temperature, maxTokens, prompt } = newConfig;

    // Use SQL UPDATE statement to update the configuration
    const [rows, fields] = await pool.execute(
      "UPDATE config SET model = ?, temperature = ?, max_tokens = ?, prompt = ? WHERE id = 1",
      [model, temperature, maxTokens, prompt]
    );

    console.log("Updated chatbot configuration: ", fields);

    // Fetch the updated config
    const updatedConfig = await getChatbotConfig();
    chatbotConfig = updatedConfig;

    return updatedConfig;
  } catch (error) {
    console.error("Error updating configuration: ", error);
    throw new Error("Failed to update configuration");
  }
};

export const getChatbotConfig = async (): Promise<ChatbotConfig> => {
  try {
    // Fetch the chatbot configuration from the database
    const [rows] = (await pool.query(
      "SELECT * FROM config WHERE id = 1"
    )) as unknown as [mysql.RowDataPacket[]];

    if (rows.length === 0) {
      throw new Error("No configuration found");
    }
    console.log(
      "Successfully fetched chatbot configuration from the database:",
      rows[0]
    );
    // Set the chatbotConfig variable
    chatbotConfig = rows[0] as ChatbotConfig;

    return chatbotConfig;
  } catch (error) {
    console.error("Error fetching configuration:", error);

    // Set the default configuration in case of an error
    chatbotConfig = {
      model: OpenAIModel.DAVINCI_TURBO,
      temperature: 0.5,
      maxTokens: 200,
      prompt: "You are a helpful, friendly assistant.",
    };

    return chatbotConfig;
  }
};
