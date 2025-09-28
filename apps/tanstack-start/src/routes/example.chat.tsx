import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import GuitarRecommendation from "@/components/example-GuitarRecommendation";

import "../demo.index.css";

function InitalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="mx-auto w-full max-w-3xl text-center">
        <h1 className="mb-4 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text font-bold text-6xl text-transparent uppercase">
          <span className="text-white">TanStack</span> Chat
        </h1>
        <p className="mx-auto mb-6 w-2/3 text-gray-400 text-lg">
          You can ask me about anything, I might or might not have a good
          answer, but you can still ask.
        </p>
        {children}
      </div>
    </div>
  );
}

function ChattingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute right-0 bottom-0 left-64 border-orange-500/10 border-t bg-gray-900/80 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-3xl px-4 py-3">{children}</div>
    </div>
  );
}

function Messages({ messages }: { messages: Array<UIMessage> }) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, []);

  if (!messages.length) {
    return null;
  }

  return (
    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto pb-24">
      <div className="mx-auto w-full max-w-3xl px-4">
        {messages.map(({ id, role, parts }) => (
          <div
            key={id}
            className={`p-4 ${
              role === "assistant"
                ? "bg-gradient-to-r from-orange-500/5 to-red-600/5"
                : "bg-transparent"
            }`}
          >
            <div className="mx-auto flex w-full max-w-3xl items-start gap-4">
              {role === "assistant" ? (
                <div className="mt-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-600 font-medium text-sm text-white">
                  AI
                </div>
              ) : (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-700 font-medium text-sm text-white">
                  Y
                </div>
              )}
              <div className="flex-1">
                {parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <demo>
                      <div className="min-w-0 flex-1" key={index}>
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
                    );
                  }

                  if (
                    part.type === "tool-recommendGuitar" &&
                    part.state === "output-available" &&
                    (part.output as { id: string })?.id
                  ) {
                    return (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <demo>
                      <div key={index} className="mx-auto max-w-[80%]">
                        <GuitarRecommendation
                          id={(part.output as { id: string })?.id}
                        />
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatPage() {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/demo-chat",
    }),
  });
  const [input, setInput] = useState("");

  const Layout = messages.length ? ChattingLayout : InitalLayout;

  return (
    <div className="relative flex h-[calc(100vh-32px)] bg-gray-900">
      <div className="flex flex-1 flex-col">
        <Messages messages={messages} />

        <Layout>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput("");
            }}
          >
            <div className="relative mx-auto max-w-xl">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type something clever (or don't, we won't judge)..."
                className="w-full resize-none overflow-hidden rounded-lg border border-orange-500/20 bg-gray-800/50 py-3 pr-12 pl-4 text-sm text-white placeholder-gray-400 shadow-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                rows={1}
                style={{ minHeight: "44px", maxHeight: "200px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
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
                className="-translate-y-1/2 absolute top-1/2 right-2 p-2 text-orange-500 transition-colors hover:text-orange-400 focus:outline-none disabled:text-gray-500"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </Layout>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/example/chat")({
  component: ChatPage,
});
