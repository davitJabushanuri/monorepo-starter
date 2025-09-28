import { createFileRoute } from "@tanstack/react-router";

import ChatArea from "@/components/demo.chat-area";

export const Route = createFileRoute("/demo/db-chat")({
  component: App,
});

function App() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <ChatArea />
    </div>
  );
}
