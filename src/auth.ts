import { withSupabase } from "@supabase/server/adapters/hono";
import { Hono } from "hono";
import { db } from "./db/connect";
import { profiles } from "./db/schemas/public";
import { eq } from "drizzle-orm";
import { supabase } from ".";
import { authUsers } from "./db/schemas/auth";
import { getUserByCanonicalUsername, getUserByEmail, insertProfile } from "./db/repositories/users.repository";

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

const auth = new Hono().basePath('/auth');

auth.use('*', withSupabase({ auth: 'none' }));

auth.post('/login', async (c) => {
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

    // Attempt to sign in the user with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
        email: existingUser.email!,
        password
    });

    if (error || !data.user) {
        return c.json({ error: 'Invalid username or password' }, 401);
    } else {
        return c.json({ message: 'Login successful', session: data.session }, 200);
    }
})

// TODO: Confirm email before finalizing registration
// TODO: Verify password strength before finalizing registration
auth.post('/register', async (c) => {
    const { email, username, password, confirmPassword }: RegisterRequestBody = await c.req.json();

    // Validate input fields
    if (!email || !username || !password || !confirmPassword) {
        return c.json({ error: 'All fields are required' }, 400);
    }

    if (password !== confirmPassword) {
        return c.json({ error: 'Passwords do not match' }, 400);
    }

    // Normalize email and username for consistency
    const normalizedUsername = username.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    // Check if email is already used
    const existingEmail = await getUserByEmail(normalizedEmail);

    if (existingEmail) {
        return c.json({ error: 'Email already used' }, 400);
    }

    // Check if username is already used
    const existingUsername = await getUserByCanonicalUsername(normalizedUsername);

    if (existingUsername) {
        return c.json({ error: 'Username already used' }, 400);
    }

    // Create user in Supabase Auth if email and username are unique
    const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password
    });

    if (error || !data.user) {
        if (error?.message.includes('User already registered')) {
            return c.json({ error: 'Email already used' }, 400);
        }
        return c.json({ error: error?.message }, 500);
    }

    const profile = await insertProfile(data.user.id, normalizedUsername, username);

    return c.json({ message: 'Registration successful', user: profile.id, session: data.session }, 201);
})

export default auth;