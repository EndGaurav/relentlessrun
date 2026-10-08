import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  bytes: number;
  format: string;
};

function cleanStr(val: string | undefined): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").trim();
}

export function getCloudinaryConfig() {
  const cloudinaryUrl = cleanStr(process.env.CLOUDINARY_URL);
  if (cloudinaryUrl && cloudinaryUrl.startsWith("cloudinary://")) {
    try {
      const match = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
      if (match) {
        return {
          api_key: match[1].trim(),
          api_secret: match[2].trim(),
          cloud_name: match[3].trim(),
        };
      }
    } catch {
      // fallback
    }
  }

  const cloud_name = cleanStr(process.env.CLOUDINARY_CLOUD_NAME || env.cloudinaryCloudName);
  const api_key = cleanStr(process.env.CLOUDINARY_API_KEY || env.cloudinaryApiKey);
  const api_secret = cleanStr(process.env.CLOUDINARY_API_SECRET || env.cloudinaryApiSecret);
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
      "Cloudinary is not configured. Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET (or CLOUDINARY_URL) are set in your environment.",
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
