"use client";

import { FileBadge, Medal, Shirt, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const rewards: { title: string; text: string; icon: LucideIcon }[] = [
  {
    title: "Heavy Metal Finisher Medal",
    text: "Custom-engraved physical metal medal delivered straight to your home after activity verification.",
    icon: Medal,
  },
  {
    title: "Official E-Certificate",
    text: "Instant high-resolution digital certificate with your official timing, splits, and QR verification.",
    icon: FileBadge,
  },
  {
    title: "DRI-FIT Performance Shirt",
    text: "Breathable technical running tee included in premium event registration packages.",
    icon: Shirt,
  },
  {
    title: "Leaderboard & Stats",
    text: "Official ranking on national leaderboards with Strava activity sync and shareable social cards.",
    icon: Trophy,
  },
];

export function HomeRewards() {
  return (
    <section className="relative py-20 bg-[#f8fafc] text-[#090d16] overflow-hidden border-t border-slate-200">
      <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="rounded-full border border-sky-600/30 bg-sky-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#0284c7]">
            FINISHER REWARDS
          </span>
          <h2 className="mt-4 font-bold text-3xl sm:text-4xl text-[#090d16] tracking-tight">
            Rewards That Make The <span className="text-[#0284c7]">Finish Real</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 font-medium">
            Every finisher deserves tangible proof of victory. Earn authentic metal medals, tech apparel, and verified timing certificates.
          </p>
        </div>

        {/* 4 Reward Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rewards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-xl transition-all duration-300 hover:border-[#0284c7]/50 hover:shadow-2xl hover:shadow-sky-100/80 hover:-translate-y-1.5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-[#0284c7] shadow-sm group-hover:scale-110 group-hover:bg-[#0284c7] group-hover:text-white transition-all duration-300">
                  <Icon className="h-7 w-7" strokeWidth={2} />
                </div>

                <h3 className="mt-6 font-bold text-lg text-[#090d16] tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                  {item.text}
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0284c7] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Guaranteed Quality</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}


