import { prisma } from "../lib/prisma.js";
import { logger } from "../utils/logger.js";
import { sendAbandonedReminderEmail } from "./email.service.js";

// Step 1 triggers after 20 minutes (15-30m window)
const STEP_1_DELAY_MS = 20 * 60 * 1000;
// Step 2 triggers after 6 hours (6-12h window)
const STEP_2_DELAY_MS = 6 * 60 * 60 * 1000;
// Cutoff: don't process registrations older than 72 hours
const MAX_AGE_MS = 72 * 60 * 60 * 1000;

export async function processAbandonedRegistrations() {
  const now = Date.now();
  const step1Cutoff = new Date(now - STEP_1_DELAY_MS);
  const step2Cutoff = new Date(now - STEP_2_DELAY_MS);
  const maxAgeCutoff = new Date(now - MAX_AGE_MS);

  try {
    // ── 1. Find Step 1 candidates (20+ mins old, Step 1 not yet sent) ──
    const step1Candidates = await prisma.registration.findMany({
      where: {
        status: "PENDING_PAYMENT",
        registeredAt: {
          lte: step1Cutoff,
          gte: maxAgeCutoff,
        },
        abandonedReminder1SentAt: null,
      },
      include: {
        user: { select: { email: true, name: true } },
        event: { select: { title: true, slug: true, priceInPaise: true } },
      },
      take: 25,
    });

    let step1SentCount = 0;
    for (const reg of step1Candidates) {
      const recipientEmail = reg.user.email;
      if (!recipientEmail) continue;

      const result = await sendAbandonedReminderEmail({
        to: recipientEmail,
        runnerName: reg.user.name || reg.shippingName || "Runner",
        eventTitle: reg.event.title,
        eventSlug: reg.event.slug,
        distance: reg.distance,
        bibNumber: reg.bibNumber,
        amountInPaise: reg.event.priceInPaise,
        step: 1,
      });

      if (result.sent) {
        step1SentCount++;
        await prisma.registration.update({
          where: { id: reg.id },
          data: { abandonedReminder1SentAt: new Date() },
        });
      }
    }

    // ── 2. Find Step 2 candidates (6+ hours old, Step 1 sent, Step 2 not sent) ──
    const step2Candidates = await prisma.registration.findMany({
      where: {
        status: "PENDING_PAYMENT",
        registeredAt: {
          lte: step2Cutoff,
          gte: maxAgeCutoff,
        },
        abandonedReminder1SentAt: { not: null },
        abandonedReminder2SentAt: null,
      },
      include: {
        user: { select: { email: true, name: true } },
        event: { select: { title: true, slug: true, priceInPaise: true } },
      },
      take: 25,
    });

    let step2SentCount = 0;
    for (const reg of step2Candidates) {
      const recipientEmail = reg.user.email;
      if (!recipientEmail) continue;

      const result = await sendAbandonedReminderEmail({
        to: recipientEmail,
        runnerName: reg.user.name || reg.shippingName || "Runner",
        eventTitle: reg.event.title,
        eventSlug: reg.event.slug,
        distance: reg.distance,
        bibNumber: reg.bibNumber,
        amountInPaise: reg.event.priceInPaise,
        step: 2,
      });

      if (result.sent) {
        step2SentCount++;
        await prisma.registration.update({
          where: { id: reg.id },
          data: { abandonedReminder2SentAt: new Date() },
        });
      }
    }

    if (step1SentCount > 0 || step2SentCount > 0) {
      logger.info("[Abandoned Recovery] Processed reminders", {
        step1Sent: step1SentCount,
        step2Sent: step2SentCount,
      });
    }

    return {
      step1Processed: step1Candidates.length,
      step1Sent: step1SentCount,
      step2Processed: step2Candidates.length,
      step2Sent: step2SentCount,
    };
  } catch (error) {
    logger.error("[Abandoned Recovery] Error processing abandoned registrations", error);
    return {
      step1Processed: 0,
      step1Sent: 0,
      step2Processed: 0,
      step2Sent: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Starts a recurring background worker that checks for abandoned registrations every 10 minutes.
 */
export function startAbandonedRecoveryCron() {
  logger.info("[Abandoned Recovery] Starting background recovery worker (every 10m)");

  // Initial run after 1 minute of server startup
  setTimeout(() => {
    void processAbandonedRegistrations();
  }, 60 * 1000);

  // Check every 10 minutes
  const interval = setInterval(() => {
    void processAbandonedRegistrations();
  }, 10 * 60 * 1000);

  return () => clearInterval(interval);
}
