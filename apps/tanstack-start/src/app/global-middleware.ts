import * as Sentry from "@sentry/tanstackstart-react";
import {
  createMiddleware,
  // @ts-expect-error
  registerGlobalMiddleware,
} from "@tanstack/react-start";

registerGlobalMiddleware({
  middleware: [
    createMiddleware().server(Sentry.sentryGlobalServerMiddlewareHandler()),
  ],
});
