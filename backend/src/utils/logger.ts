import { AsyncLocalStorage } from "node:async_hooks";

export type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export interface LogContext {
  requestId?: string;
  userId?: string;
  path?: string;
  method?: string;
  [key: string]: unknown;
}

// Global AsyncLocalStorage store for tracking request context across async calls
export const traceStorage = new AsyncLocalStorage<LogContext>();

export function getLogContext(): LogContext | undefined {
  return traceStorage.getStore();
}

export function runWithContext<T>(context: LogContext, fn: () => T): T {
  return traceStorage.run(context, fn);
}

export function updateLogContext(fields: Partial<LogContext>): void {
  const store = traceStorage.getStore();
  if (store) {
    Object.assign(store, fields);
  }
}

function getMinLogLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel | undefined;
  if (envLevel && envLevel in LOG_LEVELS) {
    return envLevel;
  }
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

function shouldLog(level: LogLevel): boolean {
  const minLevel = getMinLogLevel();
  return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
}

function formatMeta(meta?: Record<string, unknown>): string {
  if (!meta || Object.keys(meta).length === 0) {
    return "";
  }
  try {
    return ` ${JSON.stringify(meta)}`;
  } catch {
    return " [Unserializable meta]";
  }
}

function normalizeError(err: unknown): Record<string, unknown> | undefined {
  if (!err) return undefined;
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
      ...(err as unknown as Record<string, unknown>),
    };
  }
  if (typeof err === "object") {
    return err as Record<string, unknown>;
  }
  return { message: String(err) };
}

function outputLog(level: LogLevel, message: string, meta?: Record<string, unknown>, err?: unknown): void {
  if (!shouldLog(level)) {
    return;
  }

  const timestamp = new Date().toISOString();
  const context = traceStorage.getStore() || {};
  const formattedError = normalizeError(err);

  const isJsonFormat =
    process.env.LOG_FORMAT?.toLowerCase() === "json" ||
    (process.env.NODE_ENV === "production" && process.env.LOG_FORMAT?.toLowerCase() !== "pretty");

  if (isJsonFormat) {
    const payload = {
      timestamp,
      level,
      message,
      context,
      ...(meta && Object.keys(meta).length > 0 ? { meta } : {}),
      ...(formattedError ? { error: formattedError } : {}),
    };
    const logStr = JSON.stringify(payload);
    if (level === "error") {
      console.error(logStr);
    } else if (level === "warn") {
      console.warn(logStr);
    } else {
      console.log(logStr);
    }
    return;
  }

  // Pretty format for local dev
  const reqIdTag = context.requestId ? ` [req:${context.requestId}]` : "";
  const userTag = context.userId ? ` [user:${context.userId}]` : "";
  const levelTag = `[${level.toUpperCase()}]`;
  const metaStr = formatMeta(meta);

  const logLine = `${timestamp} ${levelTag}${reqIdTag}${userTag} ${message}${metaStr}`;

  if (level === "error") {
    console.error(logLine);
    if (formattedError?.stack) {
      console.error(formattedError.stack);
    }
  } else if (level === "warn") {
    console.warn(logLine);
  } else {
    console.log(logLine);
  }
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>): void {
    outputLog("debug", message, meta);
  },

  info(message: string, meta?: Record<string, unknown>): void {
    outputLog("info", message, meta);
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    outputLog("warn", message, meta);
  },

  error(message: string, error?: unknown, meta?: Record<string, unknown>): void {
    outputLog("error", message, meta, error);
  },

  // Helper for inline timing logs
  time(label: string): () => void {
    const start = performance.now();
    return () => {
      const durationMs = Math.round(performance.now() - start);
      outputLog("debug", `${label} completed in ${durationMs}ms`, { durationMs });
    };
  },
};
