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
    <section className="relative py-16 sm:py-20 bg-[#f8fafc] text-[#090d16] border-t border-slate-200">
      <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <span className="rounded-full border border-sky-600/30 bg-sky-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#0284c7]">
            HOW IT WORKS
          </span>
          <h2 className="mt-4 font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#090d16]">
            THREE SIMPLE <span className="text-[#0284c7]">STEPS</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 font-medium">
            From registration to your doorstep — how peak performance yields real rewards.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-xl transition-all duration-300 hover:border-[#0284c7]/50 hover:shadow-2xl hover:shadow-sky-100/80 hover:-translate-y-1"
              >
                {/* Step badge top right */}
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-[#0284c7] shadow-sm group-hover:bg-[#0284c7] group-hover:text-white transition-all duration-300">
                    <Icon className="h-7 w-7" strokeWidth={2} />
                  </div>
                  <span className="font-display font-black text-4xl text-slate-300 group-hover:text-[#0284c7]/40 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="mt-6 font-display font-bold text-2xl uppercase tracking-tight text-[#090d16]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 font-medium">
                  {item.text}
                </p>

                {/* Bottom subtle accent line */}
                <div className="mt-6 h-1 w-12 rounded-full bg-slate-200 group-hover:w-full group-hover:bg-[#0284c7] transition-all duration-500" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}


