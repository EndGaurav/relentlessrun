import { env } from "../config/env.js";

export type CertificateRenderData = {
  certificateNumber: string;
  runnerName: string;
  eventTitle: string;
  distance: string;
  bibNumber: string;
  finishTimeLabel: string;
  issuedAtLabel: string;
  verifyUrl: string;
};

export function createCertificateNumber(bibNumber: string) {
  const year = new Date().getFullYear();
  return `MR-${year}-${bibNumber.replace(/[^A-Z0-9]/gi, "").toUpperCase()}`;
}

export function createCertificateQrPayload(certificateNumber: string) {
  const verifyUrl = buildCertificatePublicUrl(certificateNumber);
  return JSON.stringify({
    issuer: "Mountain Run",
    certificateNumber,
    verifyUrl,
  });
}

export function buildCertificatePublicUrl(certificateNumber: string) {
  const base = env.frontendUrl.replace(/\/$/, "");
  return `${base}/certificates/${encodeURIComponent(certificateNumber)}`;
}

export function formatFinishTime(seconds: number | null | undefined) {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) {
    return "—";
  }
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  }
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

export function toCertificateRenderData(input: {
  certificateNumber: string;
  runnerName: string;
  eventTitle: string;
  distance: string;
  bibNumber: string;
  finishTimeSeconds?: number | null;
  issuedAt?: Date | null;
}): CertificateRenderData {
  const issued = input.issuedAt ?? new Date();
  return {
    certificateNumber: input.certificateNumber,
    runnerName: input.runnerName,
    eventTitle: input.eventTitle,
    distance: input.distance,
    bibNumber: input.bibNumber,
    finishTimeLabel: formatFinishTime(input.finishTimeSeconds),
    issuedAtLabel: issued.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    verifyUrl: buildCertificatePublicUrl(input.certificateNumber),
  };
}

/** HTML email body for certificate delivery — premium Mountain Run template. */
export function buildCertificateEmailHtml(data: CertificateRenderData) {
  const DARK_GREEN = "#1a3a2e";
  const MED_GREEN = "#0d5c45";
  const GOLD = "#c9a227";
  const GOLD_LIGHT = "#e8c84a";
  const CREAM = "#fefcf7";
  const MUTED = "#8a7a5a";
  const LINE = "#e8dfc8";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Mountain Run Certificate</title>
</head>
<body style="margin:0;padding:0;background:#f0ede5;font-family:Arial,sans-serif;">

  <!-- Preheader (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Congratulations ${escapeHtml(data.runnerName)}! Your Mountain Run certificate is ready. 🏅
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0ede5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- ═══ HEADER BAND ═══ -->
          <tr>
            <td style="background:${DARK_GREEN};border-radius:16px 16px 0 0;padding:0;overflow:hidden;">
              <!-- Tricolor strip -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="33.3%" height="4" style="background:#FF9933;"></td>
                  <td width="33.4%" height="4" style="background:#ffffff;"></td>
                  <td width="33.3%" height="4" style="background:#138808;"></td>
                </tr>
              </table>
              <!-- Logo area -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:28px 32px 20px;text-align:center;">
                    <!-- Mountain icon text -->
                    <div style="display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(201,162,39,0.4);border-radius:50px;padding:6px 20px;margin-bottom:12px;">
                      <span style="font-size:11px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:${GOLD};">⛰️ MOUNTAIN RUN</span>
                    </div>
                    <p style="margin:0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.55);">Run Anywhere, Anytime</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══ CERTIFICATE CARD ═══ -->
          <tr>
            <td style="background:${CREAM};border-left:1px solid ${LINE};border-right:1px solid ${LINE};padding:0;">

              <!-- Gold top rule -->
              <div style="height:2px;background:linear-gradient(90deg,transparent,${GOLD},transparent);"></div>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:36px 40px 28px;text-align:center;">

                    <!-- Greeting -->
                    <p style="margin:0 0 6px;font-size:14px;color:${MUTED};">Dear</p>

                    <!-- Runner Name -->
                    <div style="border-top:2px solid ${GOLD};border-bottom:2px solid ${GOLD};display:inline-block;padding:10px 32px;margin:8px 0 16px;">
                      <p style="margin:0;font-size:32px;color:${DARK_GREEN};font-family:Georgia,'Times New Roman',serif;font-weight:700;">
                        ${escapeHtml(data.runnerName)}
                      </p>
                    </div>

                    <!-- Medal emoji + title -->
                    <p style="margin:0 0 4px;font-size:13px;letter-spacing:0.05em;color:${MUTED};">🏅 &nbsp;Congratulations!&nbsp; 🏅</p>
                    <h1 style="margin:8px 0 4px;font-size:26px;font-weight:800;letter-spacing:-0.02em;color:${DARK_GREEN};font-family:Georgia,serif;">
                      CERTIFICATE OF ACHIEVEMENT
                    </h1>
                    <p style="margin:0 0 20px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:${GOLD};">
                      ── Virtual Run ──
                    </p>

                    <!-- Description -->
                    <p style="margin:0;font-size:14px;color:#4a4a4a;line-height:1.7;">
                      You have successfully completed the
                      <strong style="color:${DARK_GREEN};">${escapeHtml(data.distance)}</strong> Virtual Run
                      <br/>in the <strong style="color:${DARK_GREEN};">${escapeHtml(data.eventTitle)}</strong>.
                    </p>
                    <p style="margin:6px 0 0;font-size:13px;color:${MUTED};">
                      Every step you took brought you closer to the summit. Proud of you! 🏔️
                    </p>

                  </td>
                </tr>
              </table>

              <!-- Gold divider -->
              <div style="height:1px;background:linear-gradient(90deg,transparent,${GOLD},transparent);margin:0 40px;"></div>

              <!-- ── Details grid ── -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0;">
                <tr>
                  <td style="padding:24px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:12px;overflow:hidden;border:1px solid ${LINE};">
                      <tr>
                        <td width="50%" style="padding:14px 18px;background:#f8f4ec;border-bottom:1px solid ${LINE};border-right:1px solid ${LINE};">
                          <p style="margin:0 0 3px;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${MUTED};">🏃 Distance</p>
                          <p style="margin:0;font-size:16px;font-weight:800;color:${DARK_GREEN};">${escapeHtml(data.distance)}</p>
                        </td>
                        <td width="50%" style="padding:14px 18px;background:#f8f4ec;border-bottom:1px solid ${LINE};">
                          <p style="margin:0 0 3px;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${MUTED};">⏱️ Finish Time</p>
                          <p style="margin:0;font-size:16px;font-weight:800;color:${DARK_GREEN};">${escapeHtml(data.finishTimeLabel)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="padding:14px 18px;background:#ffffff;border-right:1px solid ${LINE};">
                          <p style="margin:0 0 3px;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${MUTED};">🗓️ Date Issued</p>
                          <p style="margin:0;font-size:14px;font-weight:700;color:${DARK_GREEN};">${escapeHtml(data.issuedAtLabel)}</p>
                        </td>
                        <td width="50%" style="padding:14px 18px;background:#ffffff;">
                          <p style="margin:0 0 3px;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${MUTED};">🏷️ Bib Number</p>
                          <p style="margin:0;font-size:14px;font-weight:700;color:${DARK_GREEN};">${escapeHtml(data.bibNumber)}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Certificate number -->
                    <p style="margin:12px 0 0;text-align:center;font-size:10px;color:${MUTED};font-family:monospace;letter-spacing:0.1em;">
                      Certificate No: <strong style="color:${DARK_GREEN};">${escapeHtml(data.certificateNumber)}</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Gold divider -->
              <div style="height:1px;background:linear-gradient(90deg,transparent,${GOLD},transparent);margin:0 40px;"></div>

              <!-- ── CTA Button ── -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:28px 40px;text-align:center;">
                    <a href="${escapeHtml(data.verifyUrl)}"
                       style="display:inline-block;background:linear-gradient(135deg,${DARK_GREEN},${MED_GREEN});color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.05em;border:2px solid ${GOLD};box-shadow:0 4px 16px rgba(26,58,46,0.25);">
                      🏆 &nbsp;View Your Certificate
                    </a>
                    <p style="margin:12px 0 0;font-size:11px;color:${MUTED};">
                      Print, download, or share it on social media!
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ═══ FOOTER ═══ -->
          <tr>
            <td style="background:${DARK_GREEN};border-radius:0 0 16px 16px;padding:0;">

              <!-- Gold divider -->
              <div style="height:2px;background:linear-gradient(90deg,transparent,${GOLD},transparent);"></div>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:24px 32px;text-align:center;">

                    <!-- Sign off -->
                    <p style="margin:0 0 4px;font-size:20px;color:rgba(255,255,255,0.9);font-family:Georgia,'Times New Roman',serif;font-style:italic;">
                      Keep Running, Keep Inspiring!
                    </p>
                    <p style="margin:0 0 16px;font-size:11px;color:${GOLD};letter-spacing:0.2em;text-transform:uppercase;">── Every Finish Has a Story ──</p>

                    <!-- Team sign -->
                    <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#ffffff;">Mountain Run Team</p>
                    <p style="margin:0 0 20px;font-size:11px;color:rgba(255,255,255,0.5);">Organizer · mountainrun.in</p>

                    <!-- Tricolor strip -->
                    <table width="200" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 16px;">
                      <tr>
                        <td width="66" height="3" style="background:#FF9933;border-radius:2px 0 0 2px;"></td>
                        <td width="68" height="3" style="background:#ffffff;"></td>
                        <td width="66" height="3" style="background:#138808;border-radius:0 2px 2px 0;"></td>
                      </tr>
                    </table>

                    <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.3);line-height:1.6;">
                      This certificate was issued automatically after GPS proof approval.<br/>
                      Verify authenticity anytime at the link above.<br/>
                      This is an e-certificate and does not require a physical signature.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Tricolor bottom strip -->
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
                You're receiving this because you participated in a Mountain Run virtual event.<br/>
                © ${new Date().getFullYear()} Mountain Run. All rights reserved.
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
