import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  bytes: number;
  format: string;
};

export function getCloudinaryConfig() {
  const cloud_name = (process.env.CLOUDINARY_CLOUD_NAME || env.cloudinaryCloudName || "")
    .trim()
    .replace(/^["']|["']$/g, "");
  const api_key = (process.env.CLOUDINARY_API_KEY || env.cloudinaryApiKey || "")
    .trim()
    .replace(/^["']|["']$/g, "");
  const api_secret = (process.env.CLOUDINARY_API_SECRET || env.cloudinaryApiSecret || "")
    .trim()
    .replace(/^["']|["']$/g, "");
  return { cloud_name, api_key, api_secret };
}

export function isCloudinaryConfigured() {
  const cfg = getCloudinaryConfig();
  return Boolean(cfg.cloud_name && cfg.api_key && cfg.api_secret);
}

/**
 * Upload a data URL or remote image URL to Cloudinary (signed upload).
 */
export async function uploadImageToCloudinary(
  file: string,
  folder = "relentlessrun/proofs",
): Promise<CloudinaryUploadResult> {
  const cfg = getCloudinaryConfig();
  if (!cfg.cloud_name || !cfg.api_key || !cfg.api_secret) {
    throw new ApiError(
      503,
      "Cloudinary is not configured. Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in your environment.",
    );
  }

  cloudinary.config({
    cloud_name: cfg.cloud_name,
    api_key: cfg.api_key,
    api_secret: cfg.api_secret,
    secure: true,
  });

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(new ApiError(502, `Cloudinary upload failed: ${error.message}`));
          return;
        }
        if (!result) {
          reject(new ApiError(502, "Cloudinary upload failed - no result returned"));
          return;
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          bytes: result.bytes || 0,
          format: result.format || "",
        });
      },
    );
  });
}

/**
 * Delete an image from Cloudinary by public ID.
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  const cfg = getCloudinaryConfig();
  if (!cfg.cloud_name || !cfg.api_key || !cfg.api_secret) {
    throw new ApiError(503, "Cloudinary is not configured");
  }

  cloudinary.config({
    cloud_name: cfg.cloud_name,
    api_key: cfg.api_key,
    api_secret: cfg.api_secret,
    secure: true,
  });

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error) => {
      if (error) {
        reject(new ApiError(502, `Cloudinary delete failed: ${error.message}`));
        return;
      }
      resolve();
    });
  });
}
