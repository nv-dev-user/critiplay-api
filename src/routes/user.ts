import type { SupabaseContext } from "@supabase/server";
import { Hono } from "hono";

// TODOs

const user = new Hono<{Variables: { supabaseContext: SupabaseContext }}>().basePath('/user');

export default user;