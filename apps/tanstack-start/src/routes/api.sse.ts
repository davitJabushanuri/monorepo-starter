import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createFileRoute } from "@tanstack/react-router";
import { server, transports } from "@/utils/demo.sse";

export const Route = createFileRoute("/api/sse")({
  server: {
    handlers: {
      GET: async () => {
        let body = "";
        const headers: Record<string, string> = {};
        const statusCode = 200;
        const resp = {
          on: (event: string, callback: () => void) => {
            if (event === "close") {
              callback();
            }
          },
          writeHead: (statusCode: number, headers: Record<string, string>) => {
            headers;
            statusCode;
          },
          write: (data: string) => {
            body += `${data}\n`;
          },
        };
        // biome-ignore lint/suspicious/noExplicitAny: <>
        const transport = new SSEServerTransport("/api/messages", resp as any);
        transports[transport.sessionId] = transport;
        transport.onerror = (_error) => {};
        resp.on("close", () => {
          delete transports[transport.sessionId];
        });
        await server.connect(transport);
        const response = new Response(body, {
          status: statusCode,
          headers: headers,
        });
        return response;
      },
    },
  },
});
