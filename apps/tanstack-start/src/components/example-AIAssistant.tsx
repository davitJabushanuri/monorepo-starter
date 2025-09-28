import { useChat } from "@ai-sdk/react";
import { useStore } from "@tanstack/react-store";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { showAIAssistant } from "../store/example-assistant";
import GuitarRecommendation from "./example-GuitarRecommendation";

function Messages({ messages }: { messages: Array<UIMessage> }) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, []);

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
        Ask me anything! I'm here to help.
      </div>
    );
  }

  return (
    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
      {messages.map(({ id, role, parts }) => (
        <div
          key={id}
          className={`py-3 ${
            role === "assistant"
              ? "bg-gradient-to-r from-orange-500/5 to-red-600/5"
              : "bg-transparent"
          }`}
        >
          {parts.map((part) => {
            if (part.type === "text") {
              return (
                <div key={part.text} className="flex items-start gap-2 px-4">
                  {role === "assistant" ? (
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-600 font-medium text-white text-xs">
                      AI
                    </div>
                  ) : (
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gray-700 font-medium text-white text-xs">
                      Y
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <ReactMarkdown
                      rehypePlugins={[
                        rehypeRaw,
                        rehypeSanitize,
                        rehypeHighlight,
                        remarkGfm,
                      ]}
                    >
                      {part.text}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            }
            if (
              part.type === "tool-recommendGuitar" &&
              part.state === "output-available" &&
              (part.output as { id: string })?.id
            ) {
              return (
                <div key={id} className="mx-auto max-w-[80%]">
                  <GuitarRecommendation
                    id={(part.output as { id: string })?.id}
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      ))}
    </div>
  );
}

export default function AIAssistant() {
  const isOpen = useStore(showAIAssistant);
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/demo-chat",
    }),
  });
  const [input, setInput] = useState("");

  return (
    <div className="relative z-50">
      <button
        type="button"
        onClick={() => showAIAssistant.setState((state) => !state)}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-3 py-1 text-white transition-opacity hover:opacity-90"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/20 font-medium text-xs">
          AI
        </div>
        AI Assistant
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 flex h-[600px] w-[700px] flex-col rounded-lg border border-orange-500/20 bg-gray-900 shadow-xl">
          <div className="flex items-center justify-between border-orange-500/20 border-b p-3">
            <h3 className="font-semibold text-white">AI Assistant</h3>
            <button
              type="button"
              onClick={() => showAIAssistant.setState((state) => !state)}
              className="text-gray-400 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Messages messages={messages} />

          <div className="border-orange-500/20 border-t p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage({ text: input });
                setInput("");
              }}
            >
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full resize-none overflow-hidden rounded-lg border border-orange-500/20 bg-gray-800/50 py-2 pr-10 pl-3 text-sm text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  rows={1}
                  style={{ minHeight: "36px", maxHeight: "120px" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage({ text: input });
                      setInput("");
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="-translate-y-1/2 absolute top-1/2 right-2 p-1.5 text-orange-500 transition-colors hover:text-orange-400 focus:outline-none disabled:text-gray-500"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
