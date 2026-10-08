import type { Response } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
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

  if (!payload.file.startsWith("data:") && !payload.file.startsWith("https://") && !payload.file.startsWith("http://")) {
    throw new ApiError(400, "Provide a valid data URL or web image URL");
  }

  // 1. Prefer Cloudinary when configured (production CDN storage).
  if (isCloudinaryConfigured()) {
    try {
      const uploaded = await uploadImageToCloudinary(
        payload.file,
        payload.folder ?? "relentlessrun/proofs",
      );
      response.status(201).json({
        data: {
          url: uploaded.secure_url,
          provider: "cloudinary",
          bytes: uploaded.bytes,
        },
      });
      return;
    } catch (err) {
      console.warn("Cloudinary upload failed, falling back to local disk storage:", err);
    }
  }

  // 2. Direct remote URL
  if (payload.file.startsWith("https://") || payload.file.startsWith("http://")) {
    response.status(201).json({
      data: {
        url: payload.file,
        provider: "direct-url",
      },
    });
    return;
  }

  // 3. Local disk storage fallback (works 100% reliably in local and self-hosted/EC2)
  if (payload.file.startsWith("data:image/")) {
    try {
      const matches = payload.file.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (matches) {
        const mimeSubtype = matches[1].toLowerCase().replace(/\+xml$/, "");
        const ext = mimeSubtype === "jpeg" ? "jpg" : mimeSubtype;
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");

        const uploadsDir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filename = `img_${Date.now()}_${crypto.randomBytes(6).toString("hex")}.${ext}`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, buffer);

        response.status(201).json({
          data: {
            url: `/uploads/${filename}`,
            provider: "local-disk",
            bytes: buffer.length,
          },
        });
        return;
      }
    } catch (e) {
      console.error("Failed to write image to disk:", e);
    }
  }

  // 4. Fallback inline data url for small images
  response.status(201).json({
    data: {
      url: payload.file,
      provider: "inline-data-url",
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
