import { Router } from "express";
import {
  checkPaymentStatus,
  createPaymentOrder,
  handleRazorpayWebhook,
  verifyPayment,
} from "../controllers/payment.controller.js";
import { requireClerkAuth } from "../middleware/clerk-auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const paymentRouter = Router();

paymentRouter.post("/create-order", requireClerkAuth, asyncHandler(createPaymentOrder));
paymentRouter.post("/verify", requireClerkAuth, asyncHandler(verifyPayment));
paymentRouter.post("/check-status", requireClerkAuth, asyncHandler(checkPaymentStatus));
paymentRouter.post("/webhook", asyncHandler(handleRazorpayWebhook));
