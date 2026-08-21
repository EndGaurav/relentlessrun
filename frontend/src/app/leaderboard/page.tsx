import { Suspense } from "react";
import type { Metadata } from "next";
import { PageShell } from "../components/app-shell";
import { Breadcrumb } from "../components/breadcrumb";
import { LeaderboardClient } from "./leaderboard-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mountainrun.in";

export const metadata: Metadata = {
  title: "Running Leaderboard - Verified Results | Mountain Run",
 description:
    "View GPS-verified running results and rankings. See top performers in virtual marathons, 5K, 10K races across India. Real-time leaderboards.",
 keywords: [
    "running leaderboard",
    "verified results",
    "GPS rankings",
    "virtual race results",
    "marathon leaderboard",
    "running rankings India",
  ],
 openGraph: {
    title: "Running Leaderboard - Verified Results",
 description:
      "View GPS-verified running results and rankings from Mountain Run events.",
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
      <section className="page-section">
        <div className="container-page max-w-5xl">
          <Breadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Leaderboard", href: "/leaderboard" },
            ]}
          />
          <Suspense
            fallback={
              <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-(--line) bg-(--panel) py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-(--line) border-t-(--sage)" />
                <p className="mt-4 text-sm font-medium text-(--muted)">Loading leaderboard...</p>
              </div>
            }
          >
            <LeaderboardClient />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
