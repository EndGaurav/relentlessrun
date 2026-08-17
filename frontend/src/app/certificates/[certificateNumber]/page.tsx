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
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatIssuedAt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ── Inline SVG Emblems & Graphics ── */

function AshokaChakra({ size = 48, color = "#000088" }: { size?: number; color?: string }) {
  const r = size / 2;
  const spokes = 24;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx={r} cy={r} r={r - 2} stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx={r} cy={r} r={r * 0.18} fill={color} />
      {Array.from({ length: spokes }).map((_, i) => {
        const angle = (i * 360) / spokes;
        const rad = (angle * Math.PI) / 180;
        const x2 = r + (r - 3) * Math.cos(rad);
        const y2 = r + (r - 3) * Math.sin(rad);
        return <line key={i} x1={r} y1={r} x2={x2} y2={y2} stroke={color} strokeWidth="0.75" opacity="0.85" />;
      })}
    </svg>
  );
}

function IndiaGateWatermark() {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute right-12 top-10 h-64 w-auto pointer-events-none opacity-[0.045] mix-blend-multiply select-none"
      aria-hidden="true"
    >
      <path d="M40 240 L40 100 L20 100 L20 80 L180 80 L180 100 L160 100 L160 240 L130 240 L130 140 Q100 110 70 140 L70 240 Z" fill="#1a3a2e" />
      <rect x="15" y="65" width="170" height="15" fill="#1a3a2e" />
      <rect x="30" y="50" width="140" height="15" fill="#1a3a2e" />
      <path d="M50 50 L100 30 L150 50 Z" fill="#1a3a2e" />
      <circle cx="100" cy="115" r="14" stroke="#1a3a2e" strokeWidth="2" fill="none" />
    </svg>
  );
}

function MountainLogoCrest() {
  return (
    <div className="flex flex-col items-center text-center">
      <svg width="72" height="44" viewBox="0 0 72 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Mountains */}
        <polygon points="36,4 12,38 60,38" fill="#1a3a2e" />
        <polygon points="50,14 36,38 66,38" fill="#0d5c45" opacity="0.85" />
        <polygon points="20,16 6,38 34,38" fill="#2d5a47" opacity="0.9" />
        {/* Snow peak */}
        <polygon points="36,4 30,15 36,13 42,15" fill="#ffffff" />
        {/* Gold Sun */}
        <circle cx="52" cy="10" r="4.5" fill="#c9a227" />
        {/* Runner ascending summit */}
        <ellipse cx="40" cy="7.5" rx="1.6" ry="1.6" fill="#fcfaf5" />
        <path d="M40 9 L39 14 L36 17 L38 18 L40 15 L43 18 L45 17 L42 14 L41 9 Z" fill="#fcfaf5" />
      </svg>
      <p className="text-lg sm:text-xl font-black uppercase tracking-[0.2em] text-[#1a3a2e] leading-tight font-serif mt-0.5">
        MOUNTAIN <span className="text-[#d97706]">RUN</span>
      </p>
      <p className="text-[0.55rem] font-extrabold uppercase tracking-[0.28em] text-[#7a6e5a]">
        — RUN ANYWHERE, ANYTIME —
      </p>
    </div>
  );
}

function AthletesGraphic() {
  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-2 bottom-6 h-36 sm:h-44 w-auto pointer-events-none select-none opacity-25 sm:opacity-35 mix-blend-multiply"
      aria-hidden="true"
    >
      {/* Mountain slopes */}
      <path d="M0 200 L0 120 Q50 140 100 170 L180 185 L280 200 Z" fill="#1a3a2e" opacity="0.4" />
      {/* Runner (Orange) */}
      <g transform="translate(10, 40) scale(0.95)">
        <ellipse cx="25" cy="10" rx="4.5" ry="4.5" fill="#FF9933" />
        <path d="M25 15 Q21 25 18 33 L10 28 L4 40 L12 43 L15 35 L20 38 L16 52 L6 65 L14 68 L24 55 L29 66 L37 63 L27 48 L30 35 L37 40 L42 32 L32 25 L29 15 Z" fill="#FF9933" />
      </g>
      {/* Walker / Hiker (Grey/Sage) */}
      <g transform="translate(60, 45) scale(0.9)">
        <ellipse cx="25" cy="10" rx="4.5" ry="4.5" fill="#52796f" />
        <path d="M25 15 L24 35 L16 50 L10 70 L18 72 L23 54 L32 72 L40 70 L30 48 L35 35 L42 42 L46 36 L36 28 L28 15 Z" fill="#52796f" />
      </g>
      {/* Cyclist (Green) */}
      <g transform="translate(120, 65) scale(0.85)">
        {/* Wheels */}
        <circle cx="20" cy="55" r="16" stroke="#138808" strokeWidth="2.5" fill="none" />
        <circle cx="65" cy="55" r="16" stroke="#138808" strokeWidth="2.5" fill="none" />
        {/* Frame */}
        <path d="M20 55 L38 55 L55 35 L28 35 Z M38 55 L48 30 L65 55" stroke="#138808" strokeWidth="2.5" fill="none" />
        {/* Rider */}
        <ellipse cx="44" cy="14" rx="4" ry="4" fill="#138808" />
        <path d="M44 18 L36 32 L46 45 L36 50 M44 18 L55 28 L62 30" stroke="#138808" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

function FreedomSeal() {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center p-2 shadow-lg border-2 border-dashed border-[#c9a227]"
        style={{ background: "linear-gradient(135deg, #1a3a2e, #0d5c45)" }}
      >
        <div className="rounded-full border border-white/20 p-1 flex flex-col items-center">
          <p className="text-[0.45rem] font-black uppercase tracking-wider text-[#FF9933] leading-none">FREEDOM · FITNESS</p>
          <div className="my-0.5">
            <AshokaChakra size={16} color="#c9a227" />
          </div>
          <p className="text-[0.42rem] font-bold uppercase tracking-wider text-[#138808] leading-none">MOUNTAIN RUN</p>
        </div>
      </div>
    </div>
  );
}

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
    return () => {
      cancelled = true;
    };
  }, [params.certificateNumber]);

  return (
    <PageShell>
      <section className="section py-8 sm:py-12">
        <div className="container-page max-w-5xl">
          {/* Header Action Bar (Hidden on print) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
            <div>
              <p className="eyebrow text-[#c9a227] font-bold">Official E-Certificate of Completion</p>
              <h1 className="heading text-2xl sm:text-3xl mt-1">Mountain Run Certificate</h1>
              <p className="lede text-xs sm:text-sm mt-0.5">Verified participant finish credential.</p>
            </div>
            {data && (
              <div className="flex items-center gap-3">
                <button
                  className="btn btn-primary gap-2 shadow-lg h-11 px-6 text-sm font-bold"
                  onClick={() => window.print()}
                  type="button"
                  style={{
                    background: "linear-gradient(135deg, #1a3a2e, #0d5c45)",
                    border: "1.5px solid #c9a227",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                  Download PDF / Print
                </button>
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="card p-16 text-center">
              <div className="inline-block h-9 w-9 border-3 border-[#c9a227] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-semibold text-(--muted)">Verifying official certificate record…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="card p-12 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-lg font-bold text-(--danger)">{error}</p>
              <p className="text-xs text-(--muted) mt-1">Please double check your Certificate ID or contact support.</p>
              <Link className="btn btn-secondary mt-6" href="/">Return to Home</Link>
            </div>
          )}

          {/* ══════ MAIN A4 LANDSCAPE CERTIFICATE CANVAS ══════ */}
          {data && (
            <article
              id="certificate-print"
              className="relative overflow-hidden rounded-2xl shadow-2xl transition-all aspect-[1.414/1] w-full max-w-[1080px] mx-auto"
              style={{
                background: "linear-gradient(140deg, #fcfaf5 0%, #fefcf9 50%, #f5efe3 100%)",
                border: "3px solid #c9a227",
                boxShadow: "0 20px 50px rgba(26,58,46,0.18)",
                color: "#1a3a2e",
              }}
            >
              {/* Subtle Topo Grid Background */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.035]"
                style={{
                  backgroundImage: `radial-gradient(#1a3a2e 1px, transparent 1px), radial-gradient(#c9a227 1px, #fcfaf5 1px)`,
                  backgroundSize: "28px 28px",
                  backgroundPosition: "0 0, 14px 14px",
                }}
              />

              {/* Watermarks */}
              <IndiaGateWatermark />
              <AthletesGraphic />

              {/* Top Indian Tricolor Ribbon Bar */}
              <div className="flex h-2.5 w-full shadow-xs">
                <div className="flex-1 bg-[#FF9933]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#138808]" />
              </div>

              {/* Certificate Inner Content */}
              <div className="relative px-6 py-6 sm:px-12 sm:py-8 flex flex-col justify-between h-[calc(100%-10px)]">

                {/* ── TOP HEADER SECTION ── */}
                <div className="flex items-start justify-between gap-4">
                  {/* Top-Left: Ashoka Chakra + Tricolor Crest */}
                  <div className="flex items-center gap-3">
                    <div className="relative p-1 rounded-full bg-white shadow-md border border-[#c9a227]/40">
                      <AshokaChakra size={44} color="#000088" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#FF9933] leading-none">VIRTUAL RUN</p>
                      <p className="text-[0.55rem] font-black uppercase tracking-[0.15em] text-[#138808] leading-tight">CHALLENGE 2026</p>
                    </div>
                  </div>

                  {/* Center: Mountain Run Logo */}
                  <div className="flex justify-center">
                    <MountainLogoCrest />
                  </div>

                  {/* Top-Right: Event Tag + Flag */}
                  <div className="flex flex-col items-end text-right">
                    <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#d97706] leading-none">
                      — EVENT —
                    </p>
                    <p className="text-xs sm:text-sm font-black uppercase tracking-wide text-[#1a3a2e] leading-tight mt-0.5 max-w-[200px]">
                      {data.event}
                    </p>
                    {/* Tricolor wave ribbon */}
                    <div className="flex h-1.5 w-20 rounded-full overflow-hidden mt-1.5 shadow-xs">
                      <div className="flex-1 bg-[#FF9933]" />
                      <div className="flex-1 bg-white" />
                      <div className="flex-1 bg-[#138808]" />
                    </div>
                  </div>
                </div>

                {/* ── MAIN TITLE ── */}
                <div className="text-center mt-2">
                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#1a3a2e] leading-none"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.02em" }}
                  >
                    CERTIFICATE
                  </h2>
                  <div className="flex items-center justify-center gap-3 mt-1">
                    <span className="h-0.5 w-12 sm:w-20 bg-[#c9a227]" />
                    <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.35em] text-[#c9a227]">
                      OF ACHIEVEMENT ★
                    </p>
                    <span className="h-0.5 w-12 sm:w-20 bg-[#c9a227]" />
                  </div>
                </div>

                {/* ── RECIPIENT NAME & SUBTEXT ── */}
                <div className="text-center mt-1">
                  <p className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.28em] text-[#7a6e5a]">
                    PROUDLY PRESENTED TO
                  </p>

                  <div className="my-1.5 sm:my-2.5 inline-block">
                    <div
                      className="px-8 sm:px-14 py-1.5"
                      style={{
                        borderTop: "2px solid #c9a227",
                        borderBottom: "2px solid #c9a227",
                      }}
                    >
                      <p
                        className="text-3xl sm:text-4xl lg:text-5xl text-[#1a3a2e] font-bold"
                        style={{
                          fontFamily: "'Dancing Script', 'Brush Script MT', 'Segoe Script', cursive",
                          lineHeight: 1.2,
                          textShadow: "0 1px 2px rgba(0,0,0,0.06)",
                        }}
                      >
                        {data.runnerName}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4a4030]">
                    for successfully participating in the{" "}
                    <strong className="text-[#1a3a2e] font-extrabold">{data.event}</strong>
                  </p>
                  <p className="text-[0.7rem] sm:text-xs font-bold text-[#d97706] uppercase tracking-wide mt-0.5">
                    {data.distance} Running, Walking &amp; Cycling Challenge
                  </p>
                </div>

                {/* ── 4-COLUMN STATS CARD ── */}
                <div className="rounded-xl border-2 border-[#d9cdb0] bg-white/95 backdrop-blur-sm shadow-xs overflow-hidden my-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#d9cdb0]">
                    {/* Distance */}
                    <div className="flex flex-col items-center text-center p-2.5 sm:p-3">
                      <div className="text-base sm:text-lg mb-0.5">🛣️</div>
                      <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#7a6e5a]">DISTANCE</p>
                      <p className="text-sm sm:text-base font-black text-[#1a3a2e] mt-0.5">[ {data.distance} ]</p>
                    </div>

                    {/* Completion Time */}
                    <div className="flex flex-col items-center text-center p-2.5 sm:p-3">
                      <div className="text-base sm:text-lg mb-0.5">⏱️</div>
                      <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#7a6e5a]">COMPLETION TIME</p>
                      <p className="text-sm sm:text-base font-black text-[#1a3a2e] mt-0.5">
                        [ {formatFinishTime(data.finishTimeSeconds)} ]
                      </p>
                    </div>

                    {/* Activity Date */}
                    <div className="flex flex-col items-center text-center p-2.5 sm:p-3">
                      <div className="text-base sm:text-lg mb-0.5">📅</div>
                      <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#7a6e5a]">ACTIVITY DATE</p>
                      <p className="text-xs sm:text-sm font-black text-[#1a3a2e] mt-0.5">
                        [ {formatIssuedAt(data.issuedAt)} ]
                      </p>
                    </div>

                    {/* Event & Bib */}
                    <div className="flex flex-col items-center text-center p-2.5 sm:p-3">
                      <div className="text-base sm:text-lg mb-0.5">🏅</div>
                      <p className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#7a6e5a]">CATEGORY &amp; BIB</p>
                      <p className="text-xs sm:text-sm font-black text-[#c9a227] uppercase mt-0.5 leading-tight">
                        Bib #{data.bibNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── INSPIRATIONAL MOTTO ── */}
                <p className="text-center text-[0.65rem] sm:text-xs text-[#52796f] font-semibold italic">
                  &ldquo;Your commitment towards fitness, freedom and a healthier India is truly inspiring. JAI HIND!&rdquo;
                </p>

                {/* ── BOTTOM SIGNATURES, EMBLEM & QR CODE ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 items-end gap-4 text-center mt-2">
                  {/* Left: Organizer Signature */}
                  <div className="flex flex-col items-center">
                    <p
                      className="text-xl sm:text-2xl text-[#1a3a2e] font-bold"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      Mountain Run Team
                    </p>
                    <div className="h-0.5 w-28 bg-[#c9a227] my-1" />
                    <p className="text-[0.55rem] font-black uppercase tracking-[0.15em] text-[#1a3a2e]">
                      MOUNTAIN RUN TEAM
                    </p>
                    <p className="text-[0.5rem] text-[#7a6e5a]">Race Director</p>
                  </div>

                  {/* Center-Left: Official Freedom & Fitness Seal */}
                  <div className="flex flex-col items-center">
                    <FreedomSeal />
                  </div>

                  {/* Center-Right: QR Code */}
                  <div className="flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=0&color=1a3a2e&bgcolor=fcfaf5&data=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : data.certificateNumber)}`}
                      alt="Certificate QR"
                      className="w-12 h-12 rounded border border-[#d9cdb0] shadow-xs"
                    />
                    <p className="text-[0.5rem] font-black uppercase tracking-wider text-[#1a3a2e] mt-1">
                      VERIFY CERTIFICATE
                    </p>
                    <p className="text-[0.45rem] text-[#7a6e5a]">Scan to Verify</p>
                  </div>

                  {/* Right: Keep Running Signature */}
                  <div className="flex flex-col items-center">
                    <p
                      className="text-xl sm:text-2xl text-[#1a3a2e] font-bold"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      Keep Running
                    </p>
                    <div className="h-0.5 w-28 bg-[#c9a227] my-1" />
                    <p className="text-[0.55rem] font-black uppercase tracking-wider text-[#1a3a2e]">
                      KEEP RUNNING, KEEP INSPIRING!
                    </p>
                    <p className="text-[0.48rem] text-[#7a6e5a]">Every Finish Has a Story</p>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="text-center pt-2 border-t border-[#d9cdb0]/40">
                  <p className="text-[0.5rem] font-bold uppercase tracking-wider text-[#7a6e5a]">
                    THIS IS AN OFFICIAL E-CERTIFICATE AND DOES NOT REQUIRE A PHYSICAL SIGNATURE · CERT ID: {data.certificateNumber}
                  </p>
                </div>
              </div>

              {/* Bottom Tricolor Strip */}
              <div className="flex h-2.5 w-full">
                <div className="flex-1 bg-[#FF9933]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#138808]" />
              </div>
            </article>
          )}

          {/* Action buttons (hidden on print) */}
          {data && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div className="flex gap-2">
                <Link className="btn btn-secondary" href="/dashboard">
                  My Dashboard
                </Link>
                <Link className="btn btn-ghost" href="/leaderboard">
                  Leaderboard
                </Link>
              </div>
              <p className="text-xs text-(--muted)">
                Verified Certificate ID: <strong className="font-mono text-(--foreground)">{data.certificateNumber}</strong>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Perfect A4 Landscape Print Styles ── */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

          @media print {
            @page {
              size: A4 landscape;
              margin: 0 !important;
            }
            html, body {
              width: 100% !important;
              height: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body * {
              visibility: hidden !important;
            }
            #certificate-print,
            #certificate-print * {
              visibility: visible !important;
            }
            #certificate-print {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              max-width: 100% !important;
              border-radius: 0 !important;
              border: none !important;
              box-shadow: none !important;
              margin: 0 !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            header, footer, nav, .print\\:hidden, .section {
              display: none !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          }
        `,
      }} />
    </PageShell>
  );
}
