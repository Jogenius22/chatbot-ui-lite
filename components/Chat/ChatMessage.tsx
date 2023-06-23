import { Message } from "@/types";
import { FC } from "react";

interface Props {
  message: Message;
}

export const ChatMessage: FC<Props> = ({ message }) => {
  return (
    <div
      className={`flex flex-col ${
        message.role === "assistant" ? "items-start" : "items-end"
      }`}
    >
      <div
        className={`flex items-center rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap ${
          message.role === "assistant"
            ? "bg-[#29d395] text-white"
            : "bg-[#f91272] text-white"
        }`}
        style={{ overflowWrap: "anywhere" }}
      >
        {message.content}
      </div>
    </div>
  );
};
