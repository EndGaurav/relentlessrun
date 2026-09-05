import type { Metadata } from "next";
import { FileText, Medal, Shirt, Trophy } from "lucide-react";
import { PageShell } from "../components/app-shell";
import { Breadcrumb } from "../components/breadcrumb";
import { EventsCatalog } from "./events-catalog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://relentlessrun.in";

export const metadata: Metadata = {
  title: "Upcoming Virtual Running Events India 2026 | 5K, 10K, 21K Races — RelentlessRun",
  description:
    "Explore and register for upcoming virtual running events across India. Complete 1.5K, 5K, 10K, or 21K half marathons from anywhere. GPS verification, custom metal medals, DRI-FIT t-shirts, and instant E-certificates.",
  keywords: [
    "virtual running events",
    "virtual running events india",
    "online marathon India",
    "5K run events",
    "10K run events",
    "half marathon virtual",
    "running races India",
    "GPS verified runs",
    "virtual race registration",
    "virtual marathon 2026",
  ],
  openGraph: {
    title: "Upcoming Virtual Running Events India 2026 | 5K, 10K, 21K Races — RelentlessRun",
    description:
      "Explore and register for upcoming virtual running events across India. GPS verification, custom medals & instant certificates.",
    url: "/events",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/events`,
  },
};

export default function EventsPage() {
  return (
    <PageShell>
      <div className="relative overflow-hidden bg-[#090d16]">
        {/* Hero Banner */}
        <section className="relative overflow-hidden border-b border-white/10 py-10 sm:py-14">
          <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[500px] rounded-full bg-sky-500/5 blur-[100px]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <Breadcrumb
              items={[
                { name: "Home", href: "/" },
                { name: "Events", href: "/events" },
              ]}
            />

            <div className="mx-auto mt-6 max-w-2xl text-center sm:mt-8">
              <span className="inline-block rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#38bdf8]">
                Official Races & Challenges
              </span>
              <h1 className="mt-4 font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#f0f0f0]">
                Find Your Next Finish Line
              </h1>
              <p className="mt-4 text-base text-slate-300 max-w-lg mx-auto">
                Choose a run, register once, upload GPS proof, and earn your heavy metal finisher medal &amp; certificate.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                {[
                  { label: "Heavy Medals", icon: Medal },
                  { label: "DRI-FIT T-shirts", icon: Shirt },
                  { label: "E-Certificates", icon: FileText },
                  { label: "Live Leaderboard", icon: Trophy },
                ].map(({ label, icon: Icon }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-bold text-[#f0f0f0] backdrop-blur-md shadow-sm">
                    <Icon className="h-3.5 w-3.5 text-[#38bdf8]" strokeWidth={2} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <EventsCatalog />
          </div>
        </section>
      </div>
    </PageShell>
  );
}

