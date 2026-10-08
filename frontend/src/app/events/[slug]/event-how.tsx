import { FileBadge, Route, ShieldCheck, Truck } from "lucide-react";
import type { PublicEvent } from "../../data/events";
import { Reveal, SectionHeader } from "./reveal";

export function EventHow({ event }: { event: PublicEvent }) {
  const steps = [
    {
      icon: ShieldCheck,
      title: "Register & Pay",
      desc: "Choose your activity and distance, then finish secure registration in under two minutes.",
    },
    {
      icon: Route,
      title: `Run Anytime · ${event.date}`,
      desc: "Finish your distance anywhere, at any pace — road, trail, park, or treadmill.",
    },
    {
      icon: FileBadge,
      title: "Submit GPS Proof",
      desc: "Upload a screenshot from Strava, Garmin, Nike Run, or any fitness app. Verified in 24 hrs.",
    },
    {
      icon: Truck,
      title: "Receive Rewards",
      desc: "Your premium medal, official certificate, and t-shirt ship free to your doorstep.",
    },
  ];

  return (
    <section className="section border-b border-white/10 bg-[#090d16]">
      <div className="container-page">
        <SectionHeader
          eyebrow="How It Works"
          title={
            <>
              Four steps to a{" "}
              <span className="text-gradient-premium">verified finish</span>
            </>
          }
          lead="You stay in your training routine. We handle everything else — tracking, verification, and reward delivery."
        />

        <div className="relative mt-12 sm:mt-16">
          {/* Desktop connector */}
          <div
            aria-hidden
            className="absolute inset-x-16 top-6 hidden h-0.5 bg-gradient-to-r from-transparent via-[#38bdf8]/40 to-transparent sm:block"
          />

          <div className="grid gap-6 sm:grid-cols-4 sm:gap-4">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.12} className="relative">
                <div className="relative flex items-start gap-4 sm:flex-col sm:items-center sm:text-center">
                  {/* mobile connector */}
                  {i < steps.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute left-6 top-12 h-[calc(100%+1rem)] w-0.5 bg-cyan-500/20 sm:hidden"
                    />
                  ) : null}

                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#38bdf8] to-[#0284c7] text-slate-950 font-black shadow-lg shadow-cyan-500/25">
                    <Icon className="h-5 w-5 text-slate-950" strokeWidth={2.2} />
                  </span>

                  <div className="flex-1 rounded-2xl border border-white/10 bg-[#0d1322] p-4.5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_12px_28px_-6px_rgba(56,189,248,0.15)] sm:w-full sm:p-5">
                    <p className="text-[0.65rem] font-black uppercase tracking-widest text-[#38bdf8]">
                      Step {i + 1}
                    </p>
                    <h3 className="mt-1.5 text-sm font-bold tracking-tight text-white">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
