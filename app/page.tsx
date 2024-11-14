"use client";

import { FlowiseClient } from "flowise-sdk";
import { Chat } from "@/components/ui/chat";
import { useState } from "react";
import { type Message } from "@/components/ui/chat-message";

const client = new FlowiseClient({
  baseUrl: "https://flowise-dev.intelliaa.com",
});

export default function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (message: string) => {
    setIsLoading(true);
    const userMessageId = Date.now().toString();

    // Agregar mensaje del usuario
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        role: "user",
        content: message,
      },
    ]);

    try {
      const response = await client.createPrediction({
        chatflowId: "79f4ca9f-bd88-4896-829b-6772afcc2b56",
        overrideConfig: {
          systemMessage: "You are a helpful assistant",
        },
        question: message,
        streaming: false, // Cambiado a false ya que no usaremos streaming por ahora
      });

      console.log("Respuesta de Flowise:", response);

      // Agregar mensaje del asistente
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: response.text, // Usar el texto de la respuesta directamente
        },
      ]);
    } catch (error) {
      console.error("Error detallado:", error);
      const errorMessageId = Date.now().toString();
      setMessages((prev) => [
        ...prev,
        {
          id: errorMessageId,
          role: "assistant",
          content: "Lo siento, ocurrió un error al procesar tu mensaje.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (
    event?: { preventDefault?: () => void },
    ...rest: any[]
  ) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }

    if (!input.trim() || isLoading) return;

    await handleSend(input);
    setInput("");
  };

  return (
    <div className='flex mx-auto h-screen w-[90%] py-10'>
      <Chat
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isGenerating={isLoading}
        stop={() => {}}
      />
    </div>
  );
}
