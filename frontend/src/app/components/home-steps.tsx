"use client";

import { Award, MapPinned, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const steps: { step: string; title: string; text: string; icon: LucideIcon }[] = [
  {
    step: "01",
    title: "Choose Your Challenge",
    text: "Pick an event, choose your distance (1.5K, 5K, 10K, 21K), and select your finisher reward kit.",
    icon: MapPinned,
  },
  {
    step: "02",
    title: "Run & Track Proof",
    text: "Run anywhere at your own pace. Sync with Strava or Garmin and upload your activity screenshot.",
    icon: Upload,
  },
  {
    step: "03",
    title: "Earn Finisher Medals",
    text: "Get instantly verified to claim your official metal medal, DRI-FIT t-shirt, and E-certificate.",
    icon: Award,
  },
];

export function HomeSteps() {
  return (
    <section className="relative py-16 bg-[#0b0f19] text-[#f0f0f0]">
      <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#38bdf8]">
            HOW IT WORKS
          </span>
          <h2 className="mt-4 font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#f0f0f0]">
            THREE SIMPLE <span className="text-[#38bdf8]">STEPS</span>
          </h2>
          <p className="mt-3 text-base text-slate-300">
            From registration to your doorstep — how peak performance yields real rewards.
          </p>
        </div>

        {/* 3 Step Glass Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#38bdf8]/50 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-blue-950/40 hover:-translate-y-1"
              >
                {/* Glowing step badge top right */}
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-blue-500/15 text-[#38bdf8] shadow-lg group-hover:bg-[#2563eb] group-hover:text-white transition-all duration-300">
                    <Icon className="h-7 w-7" strokeWidth={2} />
                  </div>
                  <span className="font-display font-black text-4xl text-slate-600 group-hover:text-[#38bdf8]/60 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="mt-6 font-display font-bold text-2xl uppercase tracking-tight text-[#f0f0f0]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {item.text}
                </p>

                {/* Bottom subtle accent line */}
                <div className="mt-6 h-1 w-12 rounded-full bg-white/10 group-hover:w-full group-hover:bg-[#38bdf8] transition-all duration-500" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}


