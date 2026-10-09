import { Check, Minus } from "lucide-react";
import { Reveal, SectionHeader } from "./reveal";

const traditional = [
  { text: "Wake up at 4:00 AM & commute across city", mark: "x" },
  { text: "Stand in overcrowded holding corrals", mark: "x" },
  { text: "Long queues for bib collection & kit pickup", mark: "x" },
  { text: "Fixed start time with zero weather flexibility", mark: "x" },
  { text: "High travel + hotel expenses", mark: "x" },
  { text: "Basic race without verified personalized kit", mark: "x" },
];

const relentlessrun = [
  { text: "Run anywhere in your favorite park, road, or gym", mark: "ok" },
  { text: "Choose your own optimal start time & pace", mark: "ok" },
  { text: "Fair, manually verified GPS results", mark: "ok" },
  { text: "Compatible with Strava, Garmin, Apple Watch, Nike", mark: "ok" },
  { text: "Free doorstep delivery of heavyweight medal & kit", mark: "ok" },
  { text: "All-inclusive flat price — no hidden travel costs", mark: "ok" },
];

export function EventCompare() {
  return (
    <section className="section border-b border-white/10 bg-[#090d16]">
      <div className="container-page">
        <SectionHeader
          eyebrow="The Relentless Run Difference"
          title={
            <>
              A real race,{" "}
              <span className="text-gradient-premium">without the chaos</span>
            </>
          }
          lead="You get everything you love about race day — the pride, the finisher medal, the verified certificate — minus the 4 AM commute."
        />

        <div className="mt-10 grid gap-6 sm:mt-14 md:grid-cols-2">
          {/* Traditional */}
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#0d1322] p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Traditional Offline Marathon
                </p>
                <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                  Old Way
                </span>
              </div>
              <ul className="mt-6 space-y-3.5">
                {traditional.map(({ text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Relentless Run */}
          <Reveal delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-[#0e1e38] to-[#0d1322] p-6 shadow-[0_12px_40px_-10px_rgba(56,189,248,0.2)] sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-[#38bdf8] opacity-15 blur-3xl"
              />
              <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
                <p className="text-xs font-black uppercase tracking-widest text-[#38bdf8]">
                  Relentless Run Experience
                </p>
                <span className="rounded-full bg-gradient-to-r from-sky-400 to-blue-600 px-3 py-0.5 text-[0.65rem] font-black uppercase tracking-wider text-white shadow-md shadow-sky-500/30">
                  Recommended
                </span>
              </div>
              <ul className="relative mt-6 space-y-3.5">
                {relentlessrun.map(({ text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm font-semibold text-white">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}