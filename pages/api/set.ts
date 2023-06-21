import { NextApiRequest, NextApiResponse } from "next";
import { setChatbotConfig } from "../../utils/config";
import { ChatbotConfig } from "../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const newConfig: Partial<ChatbotConfig> = req.body;

    try {
      await setChatbotConfig(newConfig);
      res
        .status(200)
        .json({
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
