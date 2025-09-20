import { WEB_URL, MOBILE_URL, PORT } from '@repo/config';
import { Hono } from 'hono'
import { auth } from '@/features/auth';
import { logger } from "hono/logger";
import { cors } from 'hono/cors';


export type Variables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};


const app = new Hono<{
  Variables: Variables
}>().basePath('/api')
app.use(logger());

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.use(
  "/auth/*", // or replace with "*" to enable cors for all routes
  cors({
    origin: [WEB_URL, MOBILE_URL],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default {
  fetch: app.fetch,
  port: PORT,
}
