import type { Metadata } from "next";
import { PageShell } from "../components/app-shell";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return (
    <PageShell>
      <div className="relative overflow-hidden bg-[#090d16]">
        <section className="py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <DashboardClient />
          </div>
        </section>
      </div>
    </PageShell>
  );
}

