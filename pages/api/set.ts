import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import { ChatbotConfig } from "@/types";

import { setChatbotConfig } from "@/utils/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const newConfig: Partial<ChatbotConfig> = req.body;

    try {
      await setChatbotConfig(newConfig);
      res.status(200).json({
        status: "success",
        message: "Configuration updated successfully.",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "error", message: "Failed to update configuration." });
    }
  } else {
    res.status(405).json({ status: "error", message: "Method not allowed." });
  }
}
