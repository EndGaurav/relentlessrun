"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageShell } from "../../components/app-shell";
import { getApiUrl, readApiError } from "../../../lib/api";

type CertificateData = {
  certificateNumber: string;
  status: string;
  runnerName: string;
  event: string;
  distance: string;
  bibNumber: string;
  finishTimeSeconds?: number | null;
  issuedAt: string | null;
  pdfUrl?: string | null;
  verified?: boolean;
};

function formatFinishTime(seconds: number | null | undefined) {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return "—";
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

function formatIssuedAt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

/* ─── Inline SVG assets ─────────────────────────────────────────── */

function MountainLogo() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="28" fill="#1a3a2e" />
      <polygon points="28,10 14,38 42,38" fill="none" stroke="#f5f5f0" strokeWidth="2.2" strokeLinejoin="round" />
      <polygon points="22,38 33,22 44,38" fill="rgba(255,255,255,0.08)" stroke="#c9a227" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="40" cy="14" r="3.5" fill="#f5f5f0" />
      <path d="M40 10.5 L41.5 14 L40 12 L38.5 14 Z" fill="#c9a227" />
    </svg>
  );
}

function RunnerSilhouette() {
  return (
    <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-10" aria-hidden="true">
      <ellipse cx="72" cy="18" rx="9" ry="9" fill="currentColor" />
      <path d="M72 27 Q65 45 60 58 L48 52 L38 72 L50 76 L56 62 L64 68 L58 90 L44 110 L56 114 L70 92 L78 110 L90 106 L76 84 L80 65 L90 72 L96 60 L82 50 L78 32 Z" fill="currentColor" />
    </svg>
  );
}

function TricolorStripe({ className }: { className?: string }) {
  return (
    <div className={`flex overflow-hidden ${className ?? ""}`}>
      <div className="flex-1 bg-[#FF9933]" />
      <div className="flex-1 bg-white" />
      <div className="flex-1 bg-[#138808]" />
    </div>
  );
}

function WaxSeal() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#1a3a2e" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="#c9a227" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="32" y="27" textAnchor="middle" fill="#f5f5f0" fontSize="9" fontWeight="700" fontFamily="Arial" letterSpacing="1">MOUNTAIN</text>
      <text x="32" y="38" textAnchor="middle" fill="#c9a227" fontSize="8" fontWeight="700" fontFamily="Arial" letterSpacing="1">RUN</text>
      <text x="32" y="49" textAnchor="middle" fill="#f5f5f0" fontSize="14">✓</text>
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2 L14 12 H4 L12 18 L9 28 L18 22 L27 28 L24 18 L32 12 H22 Z" fill="#c9a227" stroke="#9a7a12" strokeWidth="1" />
      <circle cx="18" cy="17" r="5" fill="#fff" fillOpacity="0.25" />
    </svg>
  );
}

function DiamondDivider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <span className="flex-1 h-px bg-linear-to-r from-transparent via-[#c9a227]/40 to-[#c9a227]/60" />
      <span className="rotate-45 h-2.5 w-2.5 border border-[#c9a227]/60 inline-block" />
      <span className="h-1.5 w-1.5 bg-[#c9a227]/60 rounded-full inline-block" />
      <span className="rotate-45 h-2.5 w-2.5 border border-[#c9a227]/60 inline-block" />
      <span className="flex-1 h-px bg-linear-to-l from-transparent via-[#c9a227]/40 to-[#c9a227]/60" />
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────── */

export default function CertificateVerifyPage() {
  const params = useParams<{ certificateNumber: string }>();
  const [data, setData] = useState<CertificateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          getApiUrl(`/api/certificates/verify/${encodeURIComponent(params.certificateNumber)}`),
        );
        if (!response.ok) throw new Error(await readApiError(response, "Certificate not found"));
        const json = await response.json();
        if (!cancelled) setData(json.data as CertificateData);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not verify certificate");
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [params.certificateNumber]);

  return (
    <PageShell>
      <section className="section">
        <div className="container-page max-w-4xl">

          {/* Page header — hidden when printing */}
          <div className="flex flex-wrap items-end justify-between gap-3 mb-8 print:hidden">
            <div>
              <p className="eyebrow">E-Certificate</p>
              <h1 className="heading mt-2">Certificate of Achievement</h1>
              <p className="lede mt-2">Verified Mountain Run participant certificate.</p>
            </div>
            {data && (
              <button
                className="btn btn-primary gap-2"
                onClick={() => window.print()}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                Print / Save PDF
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="card mt-4 p-12 text-center">
              <div className="inline-block h-8 w-8 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-(--muted)">Verifying certificate…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="card mt-4 p-10 text-center">
              <div className="text-4xl mb-4">❌</div>
              <p className="text-base font-semibold text-(--danger)">{error}</p>
              <Link className="btn btn-secondary mt-6" href="/">Back to Home</Link>
            </div>
          )}

          {/* ── CERTIFICATE ─────────────────────────────────────────────── */}
          {data && (
            <article
              id="certificate-print"
              className="relative overflow-hidden rounded-2xl shadow-2xl"
              style={{
                background: "linear-gradient(145deg, #f9f6ef 0%, #fefcf7 60%, #f0ede5 100%)",
                border: "1px solid #d4c89a",
              }}
            >

              {/* ── Tricolor top strip ── */}
              <TricolorStripe className="h-2 w-full" />

              {/* ── Corner ornaments ── */}
              <div className="absolute top-4 left-4 w-16 h-16 opacity-30 pointer-events-none" aria-hidden="true">
                <svg viewBox="0 0 60 60" fill="none"><path d="M0 0 L60 0 L60 5 L5 5 L5 60 L0 60 Z" fill="#c9a227" /></svg>
              </div>
              <div className="absolute top-4 right-4 w-16 h-16 opacity-30 pointer-events-none" aria-hidden="true">
                <svg viewBox="0 0 60 60" fill="none"><path d="M60 0 L0 0 L0 5 L55 5 L55 60 L60 60 Z" fill="#c9a227" /></svg>
              </div>
              <div className="absolute bottom-4 left-4 w-16 h-16 opacity-30 pointer-events-none" aria-hidden="true">
                <svg viewBox="0 0 60 60" fill="none"><path d="M0 60 L60 60 L60 55 L5 55 L5 0 L0 0 Z" fill="#c9a227" /></svg>
              </div>
              <div className="absolute bottom-4 right-4 w-16 h-16 opacity-30 pointer-events-none" aria-hidden="true">
                <svg viewBox="0 0 60 60" fill="none"><path d="M60 60 L0 60 L0 55 L55 55 L55 0 L60 0 Z" fill="#c9a227" /></svg>
              </div>

              {/* ── Runner silhouette (decorative BG) ── */}
              <div className="absolute left-0 bottom-0 text-[#1a3a2e] pointer-events-none select-none" aria-hidden="true">
                <RunnerSilhouette />
              </div>

              {/* ── Main content ── */}
              <div className="relative px-8 py-10 sm:px-16 sm:py-14">

                {/* Top: Logo + Event badge */}
                <div className="flex items-start justify-between mb-2">
                  {/* Left: Logo + Brand */}
                  <div className="flex items-center gap-3">
                    <MountainLogo />
                    <div>
                      <p className="text-[0.6rem] font-black uppercase tracking-[0.25em] text-[#1a3a2e]">Mountain Run</p>
                      <p className="text-[0.55rem] tracking-[0.15em] text-[#6b5c3a] uppercase">Run Anywhere, Anytime</p>
                    </div>
                  </div>
                  {/* Right: Event pill */}
                  <div className="text-right">
                    <div
                      className="inline-block rounded-lg px-3 py-2 text-right"
                      style={{ background: "linear-gradient(135deg, #1a3a2e, #0d5c45)", border: "1px solid #c9a227" }}
                    >
                      <p className="text-[0.45rem] font-bold uppercase tracking-[0.2em] text-[#c9a227]">— Event —</p>
                      <p className="text-[0.6rem] font-black uppercase tracking-wide text-white leading-tight mt-0.5">{data.event}</p>
                    </div>
                  </div>
                </div>

                <DiamondDivider />

                {/* Certificate title */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <MedalIcon />
                    <span className="text-[0.55rem] font-black uppercase tracking-[0.35em] text-[#6b5c3a]">Certificate of Achievement</span>
                    <MedalIcon />
                  </div>
                  <h2
                    className="text-5xl sm:text-6xl font-black uppercase tracking-tight text-[#1a3a2e] leading-none"
                    style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
                  >
                    CERTIFICATE
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="h-px w-12 bg-[#c9a227]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c9a227]">of Achievement</p>
                    <span className="h-px w-12 bg-[#c9a227]" />
                  </div>
                </div>

                <DiamondDivider />

                {/* Presented to */}
                <div className="text-center">
                  <p
                    className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#6b5c3a]"
                  >
                    This Certificate is Proudly Presented To
                  </p>

                  {/* Runner name */}
                  <div className="my-4 relative">
                    <div
                      className="inline-block px-8 py-3"
                      style={{
                        borderTop: "2px solid #c9a227",
                        borderBottom: "2px solid #c9a227",
                      }}
                    >
                      <p
                        className="text-4xl sm:text-5xl text-[#1a3a2e]"
                        style={{
                          fontFamily: "'Segoe Script', 'Brush Script MT', 'Dancing Script', cursive",
                          lineHeight: 1.3,
                          textShadow: "0 1px 2px rgba(0,0,0,0.08)",
                        }}
                      >
                        {data.runnerName}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[#6b5c3a]">
                    for successfully completing the{" "}
                    <strong className="text-[#1a3a2e] font-black text-base">{data.distance}</strong>{" "}
                    Virtual Run
                  </p>
                  <p className="text-xs text-[#8a7a5a] mt-1">
                    in the <strong className="text-[#1a3a2e]">{data.event}</strong>
                  </p>
                </div>

                {/* ── Details grid ── */}
                <div
                  className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  {[
                    {
                      icon: (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" /><path d="M3 12h4" /><path d="M17 12h4" /><path d="M8 7l2 5h4l2-5" /></svg>
                      ),
                      label: "Distance",
                      value: data.distance,
                    },
                    {
                      icon: (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
                      ),
                      label: "Completion Time",
                      value: formatFinishTime(data.finishTimeSeconds),
                    },
                    {
                      icon: (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                      ),
                      label: "Activity Date",
                      value: formatIssuedAt(data.issuedAt),
                    },
                    {
                      icon: (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
                      ),
                      label: "Bib Number",
                      value: data.bibNumber,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col items-center text-center rounded-xl px-3 py-4 gap-2"
                      style={{
                        background: "rgba(255,255,255,0.65)",
                        border: "1px solid rgba(201,162,39,0.35)",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <span className="text-[#1a3a2e]">{item.icon}</span>
                      <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#8a7a5a]">{item.label}</p>
                      <p className="text-sm font-bold text-[#1a3a2e] leading-tight">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Certificate number */}
                <div className="mt-4 text-center">
                  <p className="text-[0.6rem] font-mono text-[#8a7a5a] tracking-wider">
                    Cert. No: <span className="font-bold text-[#1a3a2e]">{data.certificateNumber}</span>
                  </p>
                </div>

                <DiamondDivider />

                {/* ── Footer: Signature + Seal + Tagline ── */}
                <div className="flex flex-wrap items-end justify-between gap-6">

                  {/* Signature */}
                  <div>
                    <p
                      className="text-2xl text-[#1a3a2e]"
                      style={{ fontFamily: "'Segoe Script', 'Brush Script MT', cursive" }}
                    >
                      Mountain Run Team
                    </p>
                    <div className="h-px w-40 bg-[#c9a227]/60 my-1" />
                    <p className="text-[0.55rem] font-bold uppercase tracking-[0.15em] text-[#8a7a5a]">Mountain Run Team</p>
                    <p className="text-[0.5rem] text-[#8a7a5a]">Organizer</p>
                  </div>

                  {/* Wax Seal (center) */}
                  <div className="flex flex-col items-center gap-1">
                    <WaxSeal />
                    <p className="text-[0.5rem] font-bold uppercase tracking-[0.15em] text-[#8a7a5a]">Verify Certificate</p>
                    <p className="text-[0.45rem] text-[#8a7a5a]">Scan to Verify</p>
                  </div>

                  {/* Tagline */}
                  <div className="text-right">
                    <p
                      className="text-xl text-[#1a3a2e]"
                      style={{ fontFamily: "'Segoe Script', 'Brush Script MT', cursive" }}
                    >
                      Keep Running
                    </p>
                    <div className="h-px w-40 bg-[#c9a227]/60 my-1 ml-auto" />
                    <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-[#8a7a5a]">Keep Running, Keep Inspiring!</p>
                    <p className="text-[0.5rem] text-[#8a7a5a]">Every Finish Has a Story</p>
                  </div>
                </div>

                {/* Verified badge */}
                <div className="mt-6 text-center">
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.55rem] font-bold uppercase tracking-[0.2em]"
                    style={{ background: "rgba(26,58,46,0.08)", color: "#1a3a2e", border: "1px solid rgba(26,58,46,0.2)" }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#138808] inline-block animate-pulse" />
                    {data.status === "SENT" ? "Issued & Verified" : data.status === "GENERATED" ? "Issued" : data.status}
                  </span>
                </div>

                {/* Disclaimer */}
                <p className="mt-5 text-center text-[0.5rem] text-[#8a7a5a] tracking-wide">
                  This is an E-Certificate and does not require a physical signature.
                </p>
              </div>

              {/* ── Tricolor bottom strip ── */}
              <TricolorStripe className="h-2 w-full" />
            </article>
          )}

          {/* Action buttons */}
          {data && (
            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              <Link className="btn btn-secondary" href="/dashboard">My Dashboard</Link>
              <Link className="btn btn-ghost" href="/leaderboard">Leaderboard</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Print styles ── */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

          @media print {
            @page {
              size: A4 landscape;
              margin: 0.4in 0.5in;
            }
            body * { visibility: hidden !important; }
            #certificate-print,
            #certificate-print * { visibility: visible !important; }
            #certificate-print {
              position: fixed !important;
              inset: 0 !important;
              width: 100% !important;
              height: 100% !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              overflow: visible !important;
            }
            header, footer, nav, .print\\:hidden { display: none !important; }
          }
        `,
      }} />
    </PageShell>
  );
}
