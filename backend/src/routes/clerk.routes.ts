import { Router } from "express";
import verifyClerkWebhook from "../middlewares/clerk.middleware";
import clerkWebhook from "../controllers/clerk.controllers";

const router = Router();

router.route("/webhooks/register").post(verifyClerkWebhook,clerkWebhook)

export default router;