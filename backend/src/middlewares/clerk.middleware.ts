import { NextFunction, Request, Response } from "express";
import { Webhook } from "svix";

const verifyClerkWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({
      error: "Clerk webhook secret is not defined in environment variables",
    });
  }

  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({
      error: "Missing Svix headers",
    });
  }

  // Convert safely to string
  const id = svix_id.toString();
  const timestamp = svix_timestamp.toString();
  const signature = svix_signature.toString();

  const headers ={
    "svix-id": id,
    "svix-timestamp": timestamp,
    "svix-signature": signature
  }

  const payload =JSON.stringify(req.body);

  const wh = new Webhook(WEBHOOK_SECRET);
  // 👉 verification logic will go here (Svix)

  try {
    await wh.verify(payload, headers);
    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown verification error";
    return res.status(401).json({
      error: `Webhook verification failed: ${errorMessage}`
    });
  }
};

export default verifyClerkWebhook;
