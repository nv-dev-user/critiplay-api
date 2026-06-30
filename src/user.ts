import { withSupabase } from "@supabase/server/adapters/hono";
import { Hono } from "hono";

const user = new Hono().basePath('/user');

user.use('*', withSupabase({ auth: 'user' }));

export default user;