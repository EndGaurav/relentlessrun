import { z } from "zod";

export const createPaymentOrderSchema = z.object({
  registrationId: z.string().min(1),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const checkPaymentStatusSchema = z
  .object({
    orderId: z.string().optional(),
    registrationId: z.string().optional(),
  })
  .refine((data) => Boolean(data.orderId || data.registrationId), {
    message: "Either orderId or registrationId must be provided",
  });
