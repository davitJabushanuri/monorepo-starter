import { afterEach, expect, mock } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup, type RenderOptions, render } from "@testing-library/react";
import { ErrorBoundaryProvider } from "@/providers/error-boundary-provider";

expect.extend(matchers);

// Set up environment variables for tests
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000/api";
process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";

mock.module("better-auth/react", () => ({
  createAuthClient: () => ({
    signIn: {
      email: mock(),
      social: mock(),
    },
    signUp: {
      email: mock(),
    },
    signOut: mock(),
    useSession: mock(),
    getSession: mock(),
  }),
}));

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
