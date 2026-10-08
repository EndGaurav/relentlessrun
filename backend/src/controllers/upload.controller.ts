import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/clerk-auth.js";
import { isCloudinaryConfigured, uploadImageToCloudinary } from "../services/cloudinary.service.js";
import { ApiError } from "../utils/api-error.js";
import { validateBody } from "../utils/validate.js";
import { z } from "zod";

const uploadImageSchema = z.object({
  /** data:image/...;base64,... or https URL */
  file: z.string().min(20, "Image data is required"),
  folder: z.string().max(80).optional(),
});

const MAX_DATA_URL_CHARS = 15_000_000; // ~11MB payload

export async function uploadProofImage(request: AuthenticatedRequest, response: Response) {
  const payload = validateBody(uploadImageSchema, request);

  if (payload.file.startsWith("data:") && payload.file.length > MAX_DATA_URL_CHARS) {
    throw new ApiError(413, "Image is too large. Please select an image under 10 MB.");
  }

  // 1. Direct remote URL (already hosted on Cloudinary or web)
  if (payload.file.startsWith("https://") || payload.file.startsWith("http://")) {
    response.status(201).json({
      data: {
        url: payload.file,
        provider: "direct-url",
      },
    });
    return;
  }

  if (!payload.file.startsWith("data:image/")) {
    throw new ApiError(400, "Provide a valid image data URL or web image URL");
  }

  // 2. Upload strictly to Cloudinary CDN
  if (!isCloudinaryConfigured()) {
    throw new ApiError(
      503,
      "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your backend environment variables.",
    );
  }

  const uploaded = await uploadImageToCloudinary(
    payload.file,
    payload.folder ?? "relentlessrun/admin",
  );

  response.status(201).json({
    data: {
      url: uploaded.secure_url,
      provider: "cloudinary",
      bytes: uploaded.bytes,
    },
  });
}

export async function uploadConfig(_request: AuthenticatedRequest, response: Response) {
  response.json({
    data: {
      cloudinary: isCloudinaryConfigured(),
      maxDataUrlChars: MAX_DATA_URL_CHARS,
      accepted: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic"],
    },
  });
}
