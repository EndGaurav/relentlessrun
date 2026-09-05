import { Suspense } from "react";
import type { Metadata } from "next";
import { PageShell } from "../components/app-shell";
import { Breadcrumb } from "../components/breadcrumb";
import { LeaderboardClient } from "./leaderboard-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://relentlessrun.in";

export const metadata: Metadata = {
  title: "Official Virtual Run Leaderboard & Finish Times | RelentlessRun India",
  description:
    "View live GPS-verified virtual running leaderboards, finisher rankings, pace, and race stats for 5K, 10K, and 21K marathon challenges across India.",
  keywords: [
    "running leaderboard",
    "verified results",
    "GPS rankings",
    "virtual race results",
    "marathon leaderboard",
    "running rankings India",
    "virtual marathon winners",
  ],
  openGraph: {
    title: "Official Virtual Run Leaderboard & Finish Times | RelentlessRun India",
    description:
      "View live GPS-verified running results and rankings from RelentlessRun events.",
    url: "/leaderboard",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/leaderboard`,
  },
};

export default function LeaderboardPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Official Leaderboard",
        item: `${SITE_URL}/leaderboard`,
      },
    ],
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="relative overflow-hidden bg-[#090d16]">
        <section className="py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumb
              items={[
                { name: "Home", href: "/" },
                { name: "Leaderboard", href: "/leaderboard" },
              ]}
            />
            <Suspense
              fallback={
                <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0d1322]/80 py-16 backdrop-blur-xl">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-white/10 border-t-[#38bdf8]" />
                  <p className="mt-4 text-sm font-medium text-slate-400">Loading leaderboard...</p>
                </div>
              }
            >
              <LeaderboardClient />
            </Suspense>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

