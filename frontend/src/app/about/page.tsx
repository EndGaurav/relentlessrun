import type { Metadata } from "next";
import { PageShell } from "../components/app-shell";
import { Breadcrumb } from "../components/breadcrumb";
import { AboutClient } from "./about-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mountainrun.in";

export const metadata: Metadata = {
  title: "About Mountain Run | India's Premier GPS-Verified Virtual Race Platform",
  description:
    "Learn about Mountain Run - India's trusted virtual running and cycling platform. GPS-verified events, UPI registration, premium heavy metal medals, verifiable digital certificates, and fair leaderboards.",
  keywords: [
    "about Mountain Run",
    "virtual running platform india",
    "GPS verified runs",
    "running events India",
    "virtual marathon platform",
    "finisher medals india",
  ],
  openGraph: {
    title: "About Mountain Run | India's Premier GPS-Verified Virtual Race Platform",
    description:
      "Learn about Mountain Run - India's trusted virtual running platform with GPS verification & real medals.",
    url: "/about",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <PageShell>
      <section className="page-section">
        <div className="container-page">
          <Breadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "About", href: "/about" },
            ]}
          />
          <AboutClient />
        </div>
      </section>
    </PageShell>
  );
}
