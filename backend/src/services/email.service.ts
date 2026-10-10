import { Resend } from "resend";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import {
  buildCertificateEmailHtml,
  type CertificateRenderData,
} from "./certificate.service.js";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

export type RegistrationEmailPayload = {
  to: string;
  runnerName: string;
  eventTitle: string;
  distance: string;
  bibNumber: string;
  amountInPaise: number;
};

function formatRupees(amountInPaise: number) {
  return `Rs. ${(amountInPaise / 100).toFixed(0)}`;
}

function buildConfirmationHtml(payload: RegistrationEmailPayload) {
  const DARK_GREEN = "#1a3a2e";
  const GOLD = "#c9a227";
  const CREAM = "#fefcf7";
  const MUTED = "#8a7a5a";
  const LINE = "#e8dfc8";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Registration Confirmed — Relentless Run</title>
</head>
<body style="margin:0;padding:0;background:#f0ede5;font-family:Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Registration confirmed! Welcome to Relentless Run, ${payload.runnerName}. Your Bib is ready. 🏃
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0ede5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:${DARK_GREEN};border-radius:16px 16px 0 0;overflow:hidden;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="33.3%" height="4" style="background:#FF9933;"></td>
                  <td width="33.4%" height="4" style="background:#ffffff;"></td>
                  <td width="33.3%" height="4" style="background:#138808;"></td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:28px 32px 20px;text-align:center;">
                    <div style="display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(201,162,39,0.4);border-radius:50px;padding:6px 20px;margin-bottom:10px;">
                      <span style="font-size:11px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:${GOLD};">⚡ RELENTLESS RUN</span>
                    </div>
                    <p style="margin:0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.5);">Run Anywhere, Anytime</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body card -->
          <tr>
            <td style="background:${CREAM};border-left:1px solid ${LINE};border-right:1px solid ${LINE};padding:0;">
              <div style="height:2px;background:linear-gradient(90deg,transparent,${GOLD},transparent);"></div>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:36px 40px 20px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:28px;">🎉</p>
                    <h1 style="margin:0 0 6px;font-size:26px;font-weight:800;color:${DARK_GREEN};font-family:Georgia,serif;">
                      Registration Confirmed!
                    </h1>
                    <p style="margin:0 0 20px;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:${GOLD};">── You're officially in! ──</p>
                    <p style="margin:0;font-size:15px;color:#4a4a4a;line-height:1.7;">
                      Hi <strong style="color:${DARK_GREEN};">${payload.runnerName}</strong>,<br/>
                      Your Relentless Run registration is confirmed and payment has been received successfully.<br/>
                      We're thrilled to have you on board! 🏔️
                    </p>
                  </td>
                </tr>
              </table>

              <div style="height:1px;background:linear-gradient(90deg,transparent,${GOLD},transparent);margin:0 40px;"></div>

              <!-- Details -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:24px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:12px;overflow:hidden;border:1px solid ${LINE};">
                      <tr>
                        <td style="padding:14px 18px;background:#f8f4ec;border-bottom:1px solid ${LINE};width:40%;">
                          <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};">🏆 Event</p>
                        </td>
                        <td style="padding:14px 18px;background:#f8f4ec;border-bottom:1px solid ${LINE};">
                          <p style="margin:0;font-size:14px;font-weight:700;color:${DARK_GREEN};">${payload.eventTitle}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid ${LINE};">
                          <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};">🏃 Distance</p>
                        </td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid ${LINE};">
                          <p style="margin:0;font-size:14px;font-weight:700;color:${DARK_GREEN};">${payload.distance}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 18px;background:#f8f4ec;border-bottom:1px solid ${LINE};">
                          <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};">🏷️ Bib Number</p>
                        </td>
                        <td style="padding:14px 18px;background:#f8f4ec;border-bottom:1px solid ${LINE};">
                          <p style="margin:0;font-size:18px;font-weight:900;color:${DARK_GREEN};letter-spacing:0.05em;">${payload.bibNumber}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 18px;background:#ffffff;">
                          <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};">💳 Amount Paid</p>
                        </td>
                        <td style="padding:14px 18px;background:#ffffff;">
                          <p style="margin:0;font-size:14px;font-weight:700;color:${DARK_GREEN};">${formatRupees(payload.amountInPaise)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <div style="height:1px;background:linear-gradient(90deg,transparent,${GOLD},transparent);margin:0 40px;"></div>

              <!-- Next step message -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:24px 40px;text-align:center;">
                    <p style="margin:0;font-size:14px;color:#4a4a4a;line-height:1.7;">
                      📸 After completing your run, upload your <strong style="color:${DARK_GREEN};">GPS proof</strong> from your dashboard.<br/>
                      Once approved, your official e-certificate will be emailed to you.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${DARK_GREEN};border-radius:0 0 16px 16px;padding:0;">
              <div style="height:2px;background:linear-gradient(90deg,transparent,${GOLD},transparent);"></div>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:24px 32px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:18px;color:rgba(255,255,255,0.9);font-family:Georgia,serif;font-style:italic;">
                      Keep Running, Keep Inspiring!
                    </p>
                    <p style="margin:0 0 16px;font-size:11px;color:${GOLD};letter-spacing:0.2em;text-transform:uppercase;">── Every Finish Has a Story ──</p>
                    <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#ffffff;">Relentless Run Team</p>
                    <p style="margin:0 0 16px;font-size:11px;color:rgba(255,255,255,0.4);">Organizer · relentlessrun.in</p>
                    <table width="200" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                      <tr>
                        <td width="66" height="3" style="background:#FF9933;border-radius:2px 0 0 2px;"></td>
                        <td width="68" height="3" style="background:#ffffff;"></td>
                        <td width="66" height="3" style="background:#138808;border-radius:0 2px 2px 0;"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="33.3%" height="4" style="background:#FF9933;border-radius:0 0 0 16px;"></td>
                  <td width="33.4%" height="4" style="background:#ffffff;"></td>
                  <td width="33.3%" height="4" style="background:#138808;border-radius:0 0 16px 0;"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Disclaimer -->
          <tr>
            <td style="padding:16px;text-align:center;">
              <p style="margin:0;font-size:10px;color:#94a3b8;line-height:1.5;">
                You're receiving this because you registered for a Relentless Run virtual event.<br/>
                © ${new Date().getFullYear()} Relentless Run. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}


export type EmailSendResult = { sent: boolean; id?: string; error?: string };

export async function sendRegistrationConfirmationEmail(
  payload: RegistrationEmailPayload,
): Promise<EmailSendResult> {
  if (!resend) {
    logger.warn("[email] RESEND_API_KEY is not set. Skipping confirmation email", { to: payload.to });
    logger.info("[email] Would send confirmation email", {
      to: payload.to,
      bibNumber: payload.bibNumber,
      eventTitle: payload.eventTitle,
    });
    return { sent: false, error: "RESEND_API_KEY is not configured" };
  }

  try {
    const from = env.resendFromEmail;
    const result = await resend.emails.send({
      from,
      to: payload.to,
      subject: `Relentless Run confirmed — Bib ${payload.bibNumber}`,
      html: buildConfirmationHtml(payload),
    });

    if (result.error) {
      logger.error("[email] Resend error", result.error, { from, to: payload.to });
      return {
        sent: false,
        error: `${result.error.message} (from: ${from})`,
      };
    }

    logger.info("[email] Confirmation email sent successfully", {
      emailId: result.data?.id,
      to: payload.to,
      bibNumber: payload.bibNumber,
    });
    return { sent: true, id: result.data?.id };
  } catch (error) {
    logger.error("[email] Failed to send confirmation email", error, { to: payload.to });
    const message = error instanceof Error ? error.message : "Unknown email error";
    return { sent: false, error: message };
  }
}

export async function sendCertificateEmail(input: {
  to: string;
  data: CertificateRenderData;
}): Promise<EmailSendResult> {
  if (!resend) {
    logger.warn("[email] RESEND_API_KEY is not set. Skipping certificate email", { to: input.to });
    logger.info("[email] Would send certificate email", {
      to: input.to,
      certificateNumber: input.data.certificateNumber,
      verifyUrl: input.data.verifyUrl,
    });
    return { sent: false, error: "RESEND_API_KEY is not configured" };
  }

  try {
    const from = env.resendFromEmail;
    const result = await resend.emails.send({
      from,
      to: input.to,
      subject: `Your Relentless Run certificate — ${input.data.eventTitle}`,
      html: buildCertificateEmailHtml(input.data),
    });

    if (result.error) {
      logger.error("[email] Certificate Resend error", result.error, { from, to: input.to });
      return {
        sent: false,
        error: `${result.error.message} (from: ${from})`,
      };
    }

    logger.info("[email] Certificate email sent successfully", {
      emailId: result.data?.id,
      to: input.to,
      certificateNumber: input.data.certificateNumber,
    });
    return { sent: true, id: result.data?.id };
  } catch (error) {
    logger.error("[email] Failed to send certificate email", error, { to: input.to });
    const message = error instanceof Error ? error.message : "Unknown email error";
    return { sent: false, error: message };
  }
}

export type AbandonedReminderEmailPayload = {
  to: string;
  runnerName: string;
  eventTitle: string;
  eventSlug: string;
  distance: string;
  bibNumber: string;
  amountInPaise: number;
  step: 1 | 2;
};

function buildAbandonedReminderHtml(payload: AbandonedReminderEmailPayload) {
  const DARK_GREEN = "#1a3a2e";
  const GOLD = "#c9a227";
  const CREAM = "#fefcf7";
  const MUTED = "#8a7a5a";
  const LINE = "#e8dfc8";
  const EMERALD = "#059669";

  const checkoutUrl = `${env.frontendUrl}/register?event=${encodeURIComponent(payload.eventSlug)}&distance=${encodeURIComponent(payload.distance)}`;

  const isStep1 = payload.step === 1;

  const headline = isStep1
    ? "Did your registration get stuck?"
    : "Your race kit & slot are waiting!";

  const subheadline = isStep1
    ? "── Your Bib slot is temporarily reserved ──"
    : "── Don't miss out on your official medal & bib ──";

  const introText = isStep1
    ? `We noticed you started registering for <strong>${payload.eventTitle}</strong> (${payload.distance}) but couldn't complete the checkout. If you faced any payment issue or got interrupted, we've kept your Bib temporarily reserved so you don't lose your spot.`
    : `Slots and finisher medal kits for <strong>${payload.eventTitle}</strong> are filling up quickly! Complete your entry now to secure your personalized race kit and leaderboard ranking.`;

  const ctaText = isStep1
    ? "Complete Registration & Lock Your Bib →"
    : "Secure Your Race Spot Now →";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${headline} — Relentless Run</title>
</head>
<body style="margin:0;padding:0;background:#f0ede5;font-family:Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${isStep1 ? `Hey ${payload.runnerName}, complete your registration for ${payload.eventTitle} to lock in Bib ${payload.bibNumber}.` : `Hey ${payload.runnerName}, finisher kits are filling fast for ${payload.eventTitle}!`}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0ede5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:${DARK_GREEN};border-radius:16px 16px 0 0;overflow:hidden;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="33.3%" height="4" style="background:#FF9933;"></td>
                  <td width="33.4%" height="4" style="background:#ffffff;"></td>
                  <td width="33.3%" height="4" style="background:#138808;"></td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:28px 32px 20px;text-align:center;">
                    <div style="display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(201,162,39,0.4);border-radius:50px;padding:6px 20px;margin-bottom:10px;">
                      <span style="font-size:11px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:${GOLD};">⚡ RELENTLESS RUN</span>
                    </div>
                    <p style="margin:0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.5);">Run Anywhere, Anytime</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body card -->
          <tr>
            <td style="background:${CREAM};border-left:1px solid ${LINE};border-right:1px solid ${LINE};padding:0;">
              <div style="height:2px;background:linear-gradient(90deg,transparent,${GOLD},transparent);"></div>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:36px 40px 20px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:28px;">${isStep1 ? "⏳" : "🏃‍♂️"}</p>
                    <h1 style="margin:0 0 6px;font-size:24px;font-weight:800;color:${DARK_GREEN};font-family:Georgia,serif;">
                      ${headline}
                    </h1>
                    <p style="margin:0 0 20px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:${GOLD};">${subheadline}</p>
                    <p style="margin:0;font-size:15px;color:#4a4a4a;line-height:1.7;">
                      Hi <strong style="color:${DARK_GREEN};">${payload.runnerName}</strong>,<br/>
                      ${introText}
                    </p>
                  </td>
                </tr>
              </table>

              <div style="height:1px;background:linear-gradient(90deg,transparent,${GOLD},transparent);margin:0 40px;"></div>

              <!-- Summary details -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:24px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:12px;overflow:hidden;border:1px solid ${LINE};">
                      <tr>
                        <td style="padding:14px 18px;background:#f8f4ec;border-bottom:1px solid ${LINE};width:40%;">
                          <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};">🏆 Event</p>
                        </td>
                        <td style="padding:14px 18px;background:#f8f4ec;border-bottom:1px solid ${LINE};">
                          <p style="margin:0;font-size:14px;font-weight:700;color:${DARK_GREEN};">${payload.eventTitle}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid ${LINE};">
                          <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};">🏃 Distance</p>
                        </td>
                        <td style="padding:14px 18px;background:#ffffff;border-bottom:1px solid ${LINE};">
                          <p style="margin:0;font-size:14px;font-weight:700;color:${DARK_GREEN};">${payload.distance}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 18px;background:#f8f4ec;border-bottom:1px solid ${LINE};">
                          <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};">🏷️ Reserved Bib</p>
                        </td>
                        <td style="padding:14px 18px;background:#f8f4ec;border-bottom:1px solid ${LINE};">
                          <p style="margin:0;font-size:16px;font-weight:900;color:${DARK_GREEN};letter-spacing:0.05em;">${payload.bibNumber}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 18px;background:#ffffff;">
                          <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};">💳 Entry Fee</p>
                        </td>
                        <td style="padding:14px 18px;background:#ffffff;">
                          <p style="margin:0;font-size:14px;font-weight:700;color:${DARK_GREEN};">${formatRupees(payload.amountInPaise)}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <div style="text-align:center;margin-top:28px;">
                      <a href="${checkoutUrl}" style="display:inline-block;background:${EMERALD};color:#ffffff;text-decoration:none;font-weight:800;font-size:15px;padding:16px 36px;border-radius:50px;box-shadow:0 4px 12px rgba(5,150,105,0.3);letter-spacing:0.02em;">
                        ${ctaText}
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Benefits reminder -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 40px 24px;">
                    <div style="background:#f8f4ec;border:1px solid ${LINE};border-radius:12px;padding:16px 20px;">
                      <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:${DARK_GREEN};text-transform:uppercase;letter-spacing:0.1em;">
                        ✨ What's included in your kit:
                      </p>
                      <p style="margin:0;font-size:13px;color:#555;line-height:1.6;">
                        🏅 Premium Heavy Finisher Medal delivered to your home<br/>
                        📜 Official E-Certificate with QR verification<br/>
                        📊 Leaderboard ranking & runner analytics
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${DARK_GREEN};border-radius:0 0 16px 16px;padding:0;">
              <div style="height:2px;background:linear-gradient(90deg,transparent,${GOLD},transparent);"></div>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:24px 32px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:16px;color:rgba(255,255,255,0.9);font-family:Georgia,serif;font-style:italic;">
                      Keep Running, Keep Inspiring!
                    </p>
                    <p style="margin:0 0 16px;font-size:11px;color:${GOLD};letter-spacing:0.2em;text-transform:uppercase;">── Every Finish Has a Story ──</p>
                    <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#ffffff;">Relentless Run Team</p>
                    <p style="margin:0 0 16px;font-size:11px;color:rgba(255,255,255,0.4);">relentlessrun.in</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Disclaimer -->
          <tr>
            <td style="padding:16px;text-align:center;">
              <p style="margin:0;font-size:10px;color:#94a3b8;line-height:1.5;">
                You're receiving this because you initiated registration on Relentless Run.<br/>
                © ${new Date().getFullYear()} Relentless Run. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendAbandonedReminderEmail(
  payload: AbandonedReminderEmailPayload,
): Promise<EmailSendResult> {
  if (!resend) {
    logger.warn("[email] RESEND_API_KEY is not set. Skipping abandoned reminder email", {
      to: payload.to,
      step: payload.step,
    });
    return { sent: false, error: "RESEND_API_KEY is not configured" };
  }

  try {
    const from = env.resendFromEmail;
    const subject =
      payload.step === 1
        ? `Did your payment get stuck? 🏃 Complete registration for ${payload.eventTitle}`
        : `⚡ Race slots & kits are filling fast — ${payload.eventTitle}`;

    const result = await resend.emails.send({
      from,
      to: payload.to,
      subject,
      html: buildAbandonedReminderHtml(payload),
    });

    if (result.error) {
      logger.error("[email] Abandoned reminder Resend error", result.error, {
        from,
        to: payload.to,
        step: payload.step,
      });
      return { sent: false, error: result.error.message };
    }

    logger.info("[email] Abandoned reminder email sent", {
      emailId: result.data?.id,
      to: payload.to,
      step: payload.step,
      bibNumber: payload.bibNumber,
    });

    return { sent: true, id: result.data?.id };
  } catch (error) {
    logger.error("[email] Failed to send abandoned reminder email", error, {
      to: payload.to,
      step: payload.step,
    });
    const message = error instanceof Error ? error.message : "Unknown email error";
    return { sent: false, error: message };
  }
}

