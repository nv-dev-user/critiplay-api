import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { supabase } from "../../setup";
import { db } from "@/db/connect";
import profile from "@/db/models/profile";
import app from "@/index";

const purgeTestUser = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("Error listing users:", error);
    throw error;
  }

  const testUser = data.users.find((user) => user.email === "test1@login.com");

  if (testUser) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      testUser.id,
    );
    if (deleteError) {
      console.error("Error deleting test user:", deleteError);
      throw deleteError;
    }
  }
};

//* Set up a test user before running the login tests
beforeAll(async () => {
  await purgeTestUser(); // Ensure no existing test user

  const { data, error } = await supabase.auth.admin.createUser({
    email: "test1@login.com",
    password: "password",
    email_confirm: true,
  });

  if (error) {
    console.error("Error creating test user:", error);
    throw error;
  }

  if (data.user?.id) {
    await db.insert(profile).values({
      id: data.user.id,
      canonicalUsername: "test1",
      username: "Test1",
    });
  }
});

//* Clean up the test user after tests
afterAll(purgeTestUser);

describe("POST /auth/login", () => {
  it("should return 400 - Missing body", async () => {
    const response = await app.request("/auth/login", { method: "POST" });
    expect(response.status).toBe(400);
  });

  it("should return 400 - Invalid JSON body", async () => {
    const response = await app.request("/auth/login", {
      method: "POST",
      body: "invalid-json",
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 - Empty body", async () => {
    const response = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({}),
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 - Missing email", async () => {
    const response = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ password: "password" }),
    });
    expect(response.status).toBe(400);
  });

  it("should return 400 - Missing password", async () => {
    const response = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ usernameOrEmail: "test1@test.com" }),
    });
    expect(response.status).toBe(400);
  });

  it("should return 401 - Invalid credentials", async () => {
    const response = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        usernameOrEmail: "test1@login.com",
        password: "wrongpassword",
      }),
    });
    expect(response.status).toBe(401);
  });

  it("should return 200 - Successful login with email", async () => {
    const response = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        usernameOrEmail: "test1@login.com",
        password: "password",
      }),
    });
    expect(response.status).toBe(200);
  });

  it("should return 200 - Successful login with username", async () => {
    const response = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ usernameOrEmail: "Test1", password: "password" }),
    });
    expect(response.status).toBe(200);
  });
});
