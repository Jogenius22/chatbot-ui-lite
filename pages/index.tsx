import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Message, ChatbotConfig } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/get");
        if (!response.ok) {
          throw new Error("Failed to fetch chatbot configuration");
        }
        const config = await response.json();
        setChatbotConfig(config);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleSend = async (message: Message) => {
    let currentChatbotConfig = chatbotConfig;
    if (!currentChatbotConfig) {
      console.log("Fetching chatbot configuration...");
      try {
        const response = await fetch("/api/get");
        if (!response.ok) {
          console.error("Failed to fetch chatbot configuration.");
          return;
        }
        const config = await response.json();
        setChatbotConfig(config);
        currentChatbotConfig = config; // Set the local variable
        console.log(config);
      } catch (error) {
        console.error("Error fetching chatbot configuration:", error);
        return;
      }
    }

    const updatedMessages = [...messages, message];

    setMessages(updatedMessages);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatbotConfig: currentChatbotConfig,
        messages: updatedMessages,
      }),
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data = response.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      if (isFirst) {
        isFirst = false;
        setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            content: chunkValue,
          },
        ]);
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + chunkValue,
          };
          return [...messages.slice(0, -1), updatedMessage];
        });
      }
    }
  };

   useEffect(() => {
     scrollToBottom();
   }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Soy tu coach y directora de felicidad virtual creada por inteligencia artificial. Mi propósito es ayudar a mejorar el desempeño en las empresas ¿Sobre qué quieres consultar hoy?`,
      },
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>Chatbot UI</title>
        <meta
          name="description"
          content="A simple chatbot with OpenAI chat model using Next.js, TypeScript, and Tailwind CSS."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col p-4 bg-[#101728]">
        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            <Chat messages={messages} loading={loading} onSend={handleSend} />
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </>
  );
}
