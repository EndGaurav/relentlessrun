import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AppFooter } from "./components/app-footer";
import { AppHeader } from "./components/app-header";
import { HomeEvents } from "./components/home-events";
import { HomeFaq } from "./components/home-faq";
import { HomeGalleryPreview } from "./components/home-gallery-preview";
import { HomeHero } from "./components/home-hero";
import { HomeReviews } from "./components/home-reviews";
import { HomeRewards } from "./components/home-rewards";
import { HomeSectionHeader } from "./components/home-section-header";
import { HomeSteps } from "./components/home-steps";
import { fetchOpenEvents, fetchHomeContent } from "../lib/events-api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://relentlessrun.in";

export const metadata: Metadata = {
  title: "Virtual Running Events India 2026 | Real Medals & GPS Verified Races — Peak Run",
  description:
    "Join India's premier virtual running events. Run 1.5K, 5K, 10K, 21K marathons from anywhere. Track with Strava, Garmin, Nike, earn authentic metal finisher medals, t-shirts, and instant E-certificates.",
  keywords: [
    "virtual running",
    "virtual running events india",
    "virtual marathon india",
    "online running challenge",
    "virtual 5k run",
    "virtual 10k race",
    "half marathon virtual",
    "running events india",
    "strava virtual marathon india",
    "garmin running challenges",
    "virtual run with medal",
    "running medals india",
    "running certificates",
    "fitness challenge india",
    "virtual race registration",
  ],
  openGraph: {
    title: "Virtual Running Events India 2026 | Real Medals & GPS Verified Races — Peak Run",
    description:
      "Join India's premier virtual running events. Run anywhere with Strava/Garmin, earn authentic metal finisher medals and digital certificates.",
    url: "/",
    type: "website",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function Home() {
  const serverEvents = await fetchOpenEvents({ homeFeaturedFirst: true, limit: 3 }).catch(() => undefined);
  const serverHome = await fetchHomeContent().catch(() => undefined);

  return (
    <div className="page-shell flex min-h-screen flex-col bg-[#090d16] text-[#f0f0f0]">
      <AppHeader />

      <main className="flex-1 pt-0">
        <HomeHero />
        <HomeSteps />

        <section className="relative py-20 bg-[#0b0f19] text-[#f0f0f0] border-t border-white/10">
          <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <HomeSectionHeader
              action={
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#f0f0f0] backdrop-blur-md transition-all hover:bg-white/[0.12] hover:border-white/40"
                  href="/events"
                >
                  <span>View All Races</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 text-[#38bdf8] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              }
              align="split"
              eyebrow="UPCOMING RACES"
              lead="Featured virtual challenges. Choose your target distance and claim your official bib & finisher medal kit."
              title="OPEN CHALLENGES"
            />

            <HomeEvents initial={serverEvents} />
          </div>
        </section>

        <HomeRewards />
        {/* Moments + reviews are admin-managed via /admin/content (with static fallbacks). */}
        <HomeGalleryPreview moments={serverHome?.moments} />
        <HomeFaq />
        <HomeReviews testimonials={serverHome?.testimonials} />
      </main>

      <AppFooter />
    </div>
  );


}
