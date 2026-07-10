import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { supabase } from "../../setup";
import { profile } from "@/db";
import { db } from "@/db/connect";
import app from "@/index";

const purgeTestUser = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("Error listing users:", error);
    throw error;
  }

  const testUsers = data.users.filter(
    (user) =>
      user.email === "test1@register.com" ||
      user.email === "test2@register.com",
  );

  for (const testUser of testUsers) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      testUser.id,
    );
    if (deleteError) {
      console.error("Error deleting test user:", deleteError);
      throw deleteError;
    }
  }
};

beforeAll(async () => {
  await purgeTestUser(); // Ensure no existing test user

  const { data, error } = await supabase.auth.admin.createUser({
    email: "test1@register.com",
    password: "password",
    email_confirm: true,
  });

  if (error) {
    console.error("Error creating test user:", error);
    throw error;
  }

  try {
    await db.insert(profile).values({
      id: data.user.id,
      canonicalUsername: "registeruser",
      username: "RegisterUser",
    });
  } catch (dbError) {
    console.error("Error inserting profile into database:", dbError);
    throw dbError;
  }
});

afterAll(async () => {
  await purgeTestUser();
});

describe("POST /auth/register", () => {
  it("should return 400 - Missing body", async () => {
    const response = await app.request("/auth/register", { method: "POST" });
    expect(response.status).toBe(400);
  });

  it("should return 400 - Invalid JSON body", async () => {
    const response = await app.request("/auth/register", {
      method: "POST",
      body: "invalid-json",
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 - Empty body", async () => {
    const response = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({}),
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 - Missing email", async () => {
    const response = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ password: "password" }),
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 - Missing password", async () => {
    const response = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "test@register.com" }),
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 - Missing username", async () => {
    const response = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test1@register.com",
        password: "password",
        confirmPassword: "password",
      }),
    });
    expect(response.status).toBe(400);
  });

  it("should return 409 - Missing confirmation password", async () => {
    const response = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@register.com",
        password: "password",
        username: "RegisterUser",
      }),
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 - Invalid email", async () => {
    const response = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "invalid-email",
        password: "password",
        confirmPassword: "password",
        username: "RegisterUser",
      }),
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 - Passwords do not match", async () => {
    const response = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test2@register.com",
        password: "password",
        confirmPassword: "wrongpassword",
        username: "RegisterUser",
      }),
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 - Username already used", async () => {
    const response = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test2@register.com",
        password: "password",
        confirmPassword: "password",
        username: "RegisterUser",
      }),
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 - Email already used", async () => {
    const response = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test1@register.com",
        password: "password",
        confirmPassword: "password",
        username: "NewRegisterUser",
      }),
    });
    expect(response.status).toBe(400);
  });

  it("should return 200 - Successful registration", async () => {
    const response = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test2@register.com",
        password: "password",
        confirmPassword: "password",
        username: "NewRegisterUser",
      }),
    });
    expect(response.status).toBe(201);
  });

  it("should have the correct canonicalUsername in the database after registration", async () => {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }

    let newUser = data.users.find(
      (user) => user.email === "test2@register.com",
    );
    if (!newUser) {
      const response = await app.request("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: "test2@register.com",
          password: "password",
          confirmPassword: "password",
          username: "NewRegisterUser",
        }),
      });

      if (response.status !== 201) {
        throw new Error(`Failed to register user for test: ${response.status}`);
      }

      newUser = (await supabase.auth.admin.listUsers()).data.users.find(
        (user) => user.email === "test2@register.com",
      );

      if (!newUser) {
        throw new Error("Failed to find the newly registered user.");
      }
    }

    const result = await db
      .select()
      .from(profile)
      .where(eq(profile.id, newUser.id))
      .limit(1);

    if (result.length === 0) {
      throw new Error(`Error fetching profile: ${newUser.id}`);
    }

    expect(result[0].canonicalUsername).toBe("newregisteruser");
  });
});
