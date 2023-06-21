export enum OpenAIModel {
  DAVINCI_TURBO = "gpt-3.5-turbo",
  GPT_4 = "gpt-4",
}

export interface Message {
  role: Role;
  content: string;
}

export type Role = "assistant" | "user";

export type ChatbotConfig = {
  model: OpenAIModel;
  temperature: number;
  maxTokens: number;
  prompt: string;
};
