import { createMiddleware } from "@tanstack/react-start";

export const loggingMiddleware = createMiddleware().server(({ next }) => {
  return next();
});
