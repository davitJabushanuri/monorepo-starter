import { afterEach, expect } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup, type RenderOptions, render } from "@testing-library/react";
import { ErrorBoundaryProvider } from "@/providers/error-boundary-provider";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundaryProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ErrorBoundaryProvider>
  );
};

const customRender = (
  // biome-ignore lint/suspicious/noExplicitAny: <>
  ui: React.ReactElement<any>,
  options: RenderOptions = {},
) =>
  render(ui, {
    wrapper: AppProviders,
    ...options,
  });

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

export { customRender as render };
