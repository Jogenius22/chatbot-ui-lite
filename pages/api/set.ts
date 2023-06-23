import { NextApiRequest, NextApiResponse } from "next";
import { ChatbotConfig } from "@/types";

import { setChatbotConfig } from "@/utils/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const newConfig: Partial<ChatbotConfig> = req.body;

    try {
      const result = await setChatbotConfig(newConfig);
      res.status(200).json(result);
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
