import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { logger, runWithContext } from "../utils/logger.js";

export function requestTraceMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incomingReqId = req.header("x-request-id") || req.header("x-correlation-id");
  const requestId = incomingReqId || randomUUID();

  // Set header on response for client tracing
  res.setHeader("X-Request-ID", requestId);

  const context = {
    requestId,
    path: req.path,
    method: req.method,
    ip: req.ip || req.socket.remoteAddress,
  };

  const startTime = performance.now();

  res.on("finish", () => {
    const durationMs = Math.round(performance.now() - startTime);
    const statusCode = res.statusCode;
    const contentLength = res.getHeader("content-length");

    const meta = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: statusCode,
      durationMs,
      ...(contentLength ? { contentLength: Number(contentLength) } : {}),
    };

    const message = `HTTP ${req.method} ${req.originalUrl || req.url} ${statusCode} - ${durationMs}ms`;

    if (statusCode >= 500) {
      logger.error(message, undefined, meta);
    } else if (statusCode >= 400) {
      logger.warn(message, meta);
    } else {
      logger.info(message, meta);
    }
  });

  runWithContext(context, () => {
    next();
  });
}
