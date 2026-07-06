import type { Context } from "hono";
import { setCookie } from "hono/cookie";

import { getUserById } from "@/db/repositories/users.repository";
import type { Env } from "@/index";

//* Get user information
export const meHandler = async (c: Context<Env>) => {
    const { supabase } = c.get('supabaseContext');
    const { data } = await supabase.auth.getUser();

    const user: User | undefined = await getUserById(data.user?.id ?? '');

    if (!user) {
        return c.json({ message: 'User not authenticated' }, 401);
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
        return c.json({ message: 'Error signing out' }, 500);
    }

    return c.json({ message: 'Logout successful' });
}
