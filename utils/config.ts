import { OpenAIModel, ChatbotConfig } from "@/types";
import { createPool } from "mysql2/promise";
import mysql from "mysql2/promise";

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
    return {
      status: "success",
      message: "Configuration updated successfully.",
    };
  } catch (error) {
    console.error("Error updating configuration: ", error);
    throw new Error("Failed to update configuration");
  }
};
