import type { SupabaseContext } from "@supabase/server";
import { withSupabase } from "@supabase/server/adapters/hono";
import { createClient } from "@supabase/supabase-js";
import { Hono } from "hono";
import { cors } from "hono/cors";

import {
  loginHandler,
  registerHandler,
  refreshHandler,
} from "./routes/auth/guest";
import { meHandler, logoutHandler } from "./routes/auth/protected";
import {
  gameDeletionHandler,
  gameHandler,
  gameListHandler,
  gamePatchHandler,
} from "./routes/game";
import {
  organizationCreationHandler,
  organizationDeletionHandler,
  organizationHandler,
  organizationPatchHandler,
} from "./routes/organization";

export interface Env {
  Variables: { supabaseContext: SupabaseContext };
}

const origins = process.env.ORIGINS?.split(",") ?? [];

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY must be set in environment variables",
  );
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY,
);

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: origins,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

const guest = withSupabase({ auth: "none" });
const userOnly = withSupabase({ auth: "user" });

//* PUBLIC ROUTES
app.post("/auth/login", guest, loginHandler);
app.post("/auth/register", guest, registerHandler);
app.post("/auth/refresh", guest, refreshHandler);

app.get("/game/:gameSlug", guest, gameHandler);
app.get("/game", guest, gameListHandler);

app.get("/organization/:organizationId", guest, organizationHandler);

//* PROTECTED ROUTES
app.get("/auth/me", userOnly, meHandler);
app.post("/auth/logout", userOnly, logoutHandler);

app.post("/game/:gameSlug/delete", userOnly, gameDeletionHandler);
app.patch("/game/:gameSlug", userOnly, gamePatchHandler);

app.post("/organization", userOnly, organizationCreationHandler);
app.patch("/organization/:organizationId", userOnly, organizationPatchHandler);
app.delete(
  "/organization/:organizationId",
  userOnly,
  organizationDeletionHandler,
);

//* ERROR HANDLER
app.onError((_, c) => {
  return c.json(
    { message: "Something went wrong! Please try again later." },
    500,
  );
});

export default app;
