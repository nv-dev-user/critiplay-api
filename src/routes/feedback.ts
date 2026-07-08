import type { Context } from "hono";
import type { Env } from "..";
import type { Feedback } from "@/db/models/feedback";

export const feedbackCreationHandler = async (c: Context<Env>) => {
  let feedback: Feedback;
  try {
    const requestBody = await c.req.json();
    if (requestBody.feedback) {
      feedback = requestBody.feedback;
    } else {
      throw new Error("Missing feedback field in request body.");
    }
  } catch (error) {
    return c.json({ message: "Invalid JSON body." }, 400);
  }

  // TODO
};
