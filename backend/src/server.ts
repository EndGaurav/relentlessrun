import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { startAbandonedRecoveryCron } from "./services/abandoned-recovery.service.js";
import { logger } from "./utils/logger.js";

const server = app.listen(env.port, "0.0.0.0", () => {
  logger.info(`Relentless Run API listening on port ${env.port}`, {
    port: env.port,
    env: env.nodeEnv,
  });

  // Start background abandoned registration recovery worker
  startAbandonedRecoveryCron();
});

async function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info("Prisma disconnected, process exiting.");
    process.exit(0);
  });
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
