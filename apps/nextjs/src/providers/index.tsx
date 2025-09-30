"use client";
import { ErrorBoundaryProvider } from "./error-boundary-provider";
import { TanstackQueryProvider } from "./tanstack-query-provider";
import { ThemeProvider } from "./theme-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundaryProvider>
      <TanstackQueryProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </TanstackQueryProvider>
    </ErrorBoundaryProvider>
  );
};
