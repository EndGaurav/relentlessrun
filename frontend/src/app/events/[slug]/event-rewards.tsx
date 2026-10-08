import Link from "next/link";
import { ArrowUpRight, FileBadge, Medal, Shirt, Sparkles, Trophy, Truck } from "lucide-react";
import { Medal3D } from "./medal";
import { Reveal, SectionHeader } from "./reveal";

const items = [
  {
    icon: Medal,
    title: "Finisher Medal",
    desc: "A heavyweight metal medal with a premium ribbon, designed to be proudly displayed.",
  },
  {
    icon: Shirt,
    title: "Performance Event T-Shirt",
    desc: "Exclusive athletic-fit quick-dry tee included with every kit, in a special-edition print.",
  },
  {
    icon: FileBadge,
    title: "Official Printed Certificate",
    desc: "Your name, distance, and verified finish time on a verified certificate, delivered to your door.",
  },
  {
    icon: Trophy,
    title: "Hall of Fame Ranking",
    desc: "Your verified finish joins the public leaderboard with pacing and city stats.",
  },
  {
    icon: Truck,
    title: "Free Doorstep Delivery",
    desc: "Everything ships free across India after your GPS proof is verified.",
  },
];

export function EventRewards() {
  return (
    <section id="rewards" className="section scroll-mt-24 border-b border-white/10 bg-[#090d16]">
      <div className="container-page">
        <SectionHeader
          eyebrow="What You Receive"
          title={
            <>
              A finish you&rsquo;ll be{" "}
              <span className="text-gradient-premium">proud to own</span>
            </>
          }
          lead="Every verified finisher walks away with a complete premium reward kit — built to be worn, hung, and celebrated."
        />

        <div className="mt-10 grid items-start gap-6 sm:mt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* Reward list */}
          <div className="space-y-3.5">
            {items.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <article className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-[#0d1322] p-4.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:shadow-[0_10px_25px_-5px_rgba(56,189,248,0.12)] sm:p-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-[#38bdf8] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-cyan-500/20">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold tracking-tight text-white sm:text-base">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">{desc}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Product showcase */}
          <Reveal delay={0.1} className="lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-gradient-to-b from-[#0f172a] via-[#0d1322] to-[#090d16] shadow-2xl">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl opacity-30"
                style={{
                  background:
                    "radial-gradient(circle, rgba(56,189,248,0.7) 0%, rgba(2,132,199,0.3) 45%, transparent 70%)",
                }}
              />

              <div className="relative flex items-center justify-center px-6 pt-10 pb-6">
                <div className="w-48 drop-shadow-[0_25px_35px_rgba(2,132,199,0.3)] sm:w-56 transition-transform duration-500 hover:scale-105">
                  <Medal3D className="h-auto w-full" />
                </div>
              </div>

              {/* Floating mini chips */}
              <div className="absolute left-4 top-8 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-900/90 px-3 py-1.5 text-[0.7rem] font-bold text-white shadow-xl backdrop-blur-md sm:left-7 sm:top-10">
                <Shirt className="h-3.5 w-3.5 text-[#38bdf8]" />
                Premium T-shirt
              </div>
              <div
                className="absolute bottom-24 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-900/90 px-3 py-1.5 text-[0.7rem] font-bold text-white shadow-xl backdrop-blur-md sm:bottom-28 sm:right-6"
              >
                <FileBadge className="h-3.5 w-3.5 text-[#38bdf8]" />
                Official certificate
              </div>
              <div
                className="absolute bottom-12 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-900/90 px-3 py-1.5 text-[0.7rem] font-bold text-white shadow-xl backdrop-blur-md sm:bottom-16 sm:left-6"
              >
                <Truck className="h-3.5 w-3.5 text-[#38bdf8]" />
                Free delivery
              </div>

              {/* Footer tag */}
              <div className="relative border-t border-white/10 bg-white/[0.02] px-6 py-5 text-center">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#38bdf8]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Kit worth ₹900+ · Included with every entry
                </p>
                <div>
                  <Link
                    className="group mt-2.5 inline-flex items-center gap-1 text-[0.75rem] font-bold uppercase tracking-wider text-slate-300 transition-colors hover:text-[#38bdf8]"
                    href="#select"
                  >
                    Claim yours
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
