import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { SupabaseContext } from "@supabase/server";

type Env = { Variables: { supabaseContext: SupabaseContext } };

//* Get user information
export const meHandler = async (c: Context<Env>) => {
    const { supabase } = c.get('supabaseContext');
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return c.json({ error: 'User not authenticated' }, 401);
    }

    return c.json({ user });
}

//* Logout user and clear cookies
export const logoutHandler = async (c: Context<Env>) => {
    const { supabase } = c.get('supabaseContext');

    setCookie(
        c,
        'access_token',
        '',
        {
            path: '/',
            maxAge: 0,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production' ? true : false
        }
    );
    setCookie(
        c,
        'refresh_token',
        '',
        {
            path: '/',
            maxAge: 0,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production' ? true : false
        }
    );

    const { error } = await supabase.auth.signOut();

    if (error) {
        return c.json({ error: 'Error signing out' }, 500);
    }

    return c.json({ message: 'Logout successful' });
}
