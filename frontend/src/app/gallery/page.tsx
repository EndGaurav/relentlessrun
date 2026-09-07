import type { Metadata } from "next";
import { PageShell } from "../components/app-shell";
import { GalleryClient } from "./gallery-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://relentlessrun.in";

export const metadata: Metadata = {
  title: "Finisher Gallery & Race Moments | RelentlessRun India",
  description:
    "Explore verified finisher moments, medal showcases, and community runner stories from RelentlessRun virtual marathons and 5K/10K challenges across India.",
  keywords: [
    "running gallery",
    "race photos",
    "virtual run photos",
    "marathon gallery india",
    "running moments",
    "finisher photos",
    "finisher medals showcase",
  ],
  openGraph: {
    title: "Finisher Gallery & Race Moments | RelentlessRun India",
    description:
      "View race photos, finisher moments, and achievements from RelentlessRun virtual events.",
    url: "/gallery",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/gallery`,
  },
};

export default function GalleryPage() {
  return (
    <PageShell>
      <div className="relative min-w-0 bg-[#f8fafc]">
        <GalleryClient />
      </div>
    </PageShell>
  );
}

