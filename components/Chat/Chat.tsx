import { Message } from "@/types";
import { FC } from "react";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";

interface Props {
  messages: Message[];
  loading: boolean;
  onSend: (message: Message) => void;
}

export const Chat: FC<Props> = ({ messages, loading, onSend }) => {
  return (
    <>
      <div className="flex flex-col h-screen p-2 sm:p-4">
        <div className="overflow-auto h-[80vh] mb-2">
          {messages.map((message, index) => (
            <div key={index} className="my-1 sm:my-1.5">
              <ChatMessage message={message} />
            </div>
          ))}

          {loading && (
            <div className="my-1 sm:my-1.5">
              <ChatLoader />
            </div>
          )}
        </div>

        <div className="w-full h-[20vh]">
          <ChatInput onSend={onSend} />
        </div>
      </div>
    </>
  );
};
