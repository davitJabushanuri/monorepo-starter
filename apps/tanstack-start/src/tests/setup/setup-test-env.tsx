/// <reference types="@vitest/browser/providers/playwright" />

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "vitest-browser-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const customRender = (
  // biome-ignore lint/suspicious/noExplicitAny: <>
  ui: React.ReactElement<any>,
  options: {
    wrapper?: React.ComponentType<{ children: React.ReactNode }>;
  } = {},
) =>
  render(ui, {
    wrapper: options.wrapper || AppProviders,
  });

export * from "vitest-browser-react";
export { customRender as render };
