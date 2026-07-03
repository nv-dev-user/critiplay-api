import type { SupabaseContext } from "@supabase/server";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

import { getUserByCanonicalUsername, getUserByEmail, insertProfile } from "@/db/repositories/users.repository";

interface Env { Variables: { supabaseContext: SupabaseContext } }

interface LoginRequestBody {
    usernameOrEmail: string;
    password: string;
}

interface RegisterRequestBody {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

// TODO: Add password reset functionality (forgotten page & reset page with token)

// TODO: Add rate limiting to prevent brute force attacks
//* Login user and set cookies
export const loginHandler = async (c: Context<Env>) => {
    const { usernameOrEmail, password }: LoginRequestBody = await c.req.json();

    // Validate input fields
    if (!usernameOrEmail || !password) {
        return c.json({ error: 'All fields are required' }, 400);
    }

    // Normalize the input for consistency
    const normalizedUsernameOrEmail = usernameOrEmail.toLowerCase();

    // Check if the input is an email or a username
    let existingUser = await getUserByCanonicalUsername(normalizedUsernameOrEmail);

    if (!existingUser) {
        existingUser = await getUserByEmail(normalizedUsernameOrEmail);

        if (!existingUser) {
            return c.json({ error: 'User does not exist' }, 400);
        }
    }

    if (!existingUser.email) {
        return c.json({ error: 'User does not have an email associated' }, 400);
    }

    // Attempt to sign in the user with Supabase Auth
    const { supabase } = c.get('supabaseContext');
    const { data, error } = await supabase.auth.signInWithPassword({
        email: existingUser.email,
        password
    });

    if (error || !data.user) {
        return c.json({ error: 'Invalid username or password' }, 401);
    } else {
        setCookie(
            c,
            'access_token',
            data.session.access_token,
            {
                path: '/',
                maxAge: data.session.expires_in,
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production' ? true : false
            }
        );
        setCookie(
            c,
            'refresh_token',
            data.session.refresh_token,
            {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production' ? true : false
            }
        )
        return c.json({ message: 'Login successful' });
    }
}

// TODO: Confirm email before finalizing registration
// TODO: Verify password strength before finalizing registration
// TODO: Add rate limiting to prevent brute force attacks
//* Register user and set cookies
export const registerHandler = async (c: Context<Env>) => {
    const { email, username, password, confirmPassword }: RegisterRequestBody = await c.req.json();

    // Validate input fields
    if (!email || !username || !password || !confirmPassword) {
        return c.json({ error: 'All fields are required' }, 400);
    }

    if (password !== confirmPassword) {
        return c.json({ error: 'Passwords do not match' }, 400);
    }

    // Validate password format
    if (password.length < 8) {
        return c.json({ error: 'Password must be at least 8 characters long' }, 400);
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return c.json({ error: 'Username can only contain letters, numbers, underscores, and hyphens' }, 400);
    }

    // Validate username length too ?

    // Normalize email and username for consistency
    const normalizedUsername = username.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    // Check if username is already used
    //! ERROR BD
    const existingUsername = await getUserByCanonicalUsername(normalizedUsername);

    if (existingUsername) {
        return c.json({ error: 'Username already used' }, 400);
    }

    // Create user in Supabase Auth if email and username are unique
    const { supabase, supabaseAdmin } = c.get('supabaseContext');
    const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password
    });

    if (error || !data.user) {
        if (error?.message.includes('User already registered')) {
            return c.json({ error: 'Email already used' }, 400);
        }
        console.error('[ERR] Error creating user in Supabase Auth:', error);
        return c.json({ error: 'Unexpected error occurred' }, 500);
    }

    const profile = await insertProfile(data.user.id, normalizedUsername, username);

    if (!profile) {
        await supabaseAdmin.auth.admin.deleteUser(data.user.id); // Rollback user creation in Supabase Auth
        return c.json({ error: 'Error creating user profile' }, 500);
    }

    if (!data.session) {
        return c.json({ message: 'Please confirm your email address' }, 201);
    }

    setCookie(
        c,
        'access_token',
        data.session.access_token,
        {
            path: '/',
            maxAge: data.session.expires_in,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production' ? true : false
        }
    );
    setCookie(
        c,
        'refresh_token',
        data.session.refresh_token,
        {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production' ? true : false
        }
    );

    return c.json({ message: 'Registration successful' }, 201);
}

//* Refresh the user's session using the refresh token
export const refreshHandler = async (c: Context<Env>) => {
    const { supabase } = c.get('supabaseContext');

    const refreshToken = getCookie(c, 'refresh_token');
    if (!refreshToken) {return c.json({ error: 'No refresh token' }, 401);}

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

    if (error || !data.session) {
        return c.json({ error: 'Error refreshing session' }, 500);
    }

    setCookie(
        c,
        'access_token',
        data.session.access_token,
        {
            path: '/',
            maxAge: data.session.expires_in,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production' ? true : false
        }
    );
    setCookie(
        c,
        'refresh_token',
        data.session.refresh_token,
        {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production' ? true : false
        }
    );

    return c.json({ message: 'Session refreshed' });
}
