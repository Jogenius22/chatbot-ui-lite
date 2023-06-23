// pages/api/get.ts
import { NextApiRequest, NextApiResponse } from "next";
import { ChatbotConfig, OpenAIModel } from "@/types";
import { createPool } from "mysql2/promise";
import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Database URL must be provided.");
}
const pool = mysql.createPool(databaseUrl);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Fetch the chatbot configuration from the database
    const [rows] = (await pool.query(
      "SELECT * FROM config WHERE id = 1"
    )) as unknown as [mysql.RowDataPacket[]];

    if (rows.length === 0) {
      throw new Error("No configuration found");
    }

    const chatbotConfig = rows[0] as ChatbotConfig;
    return res.status(200).json(chatbotConfig);
  } catch (error) {
    console.error("Error fetching configuration:", error);

    // Set the default configuration in case of an error
    const chatbotConfig = {
      model: OpenAIModel.DAVINCI_TURBO,
      temperature: 0.5,
      maxTokens: 200,
      prompt: "You are a helpful, friendly assistant.",
    };
    return res.status(500).json(chatbotConfig);
  }
};

export default handler;
