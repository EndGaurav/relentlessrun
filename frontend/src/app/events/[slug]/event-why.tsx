import { Bike, Clock3, MapPinned, Route, Smartphone, ShieldCheck } from "lucide-react";
import { Reveal, SectionHeader } from "./reveal";

const cards = [
  {
    icon: MapPinned,
    title: "Run anywhere",
    desc: "Park, road, treadmill or your own street — no travel, no city limits.",
    tile: "from-emerald-500/15 to-teal-500/5 text-emerald-700",
  },
  {
    icon: Route,
    title: "Choose your distance",
    desc: "From a friendly 1.6 km to a full 21 km. Run, walk or cycle your way in.",
    tile: "from-[#d9b137]/15 to-[#c9a227]/5 text-[#9a7a12]",
  },
  {
    icon: Smartphone,
    title: "Track your run",
    desc: "Use Strava, Garmin or your phone — any GPS app you already love.",
    tile: "from-sky-500/15 to-blue-500/5 text-sky-700",
  },
  {
    icon: ShieldCheck,
    title: "Submit proof",
    desc: "Upload your GPS activity. A real team verifies every single finish.",
    tile: "from-violet-500/15 to-indigo-500/5 text-violet-700",
  },
  {
    icon: Clock3,
    title: "Your pace, your time",
    desc: "Finish at sunrise or midnight — any hour within the event window.",
    tile: "from-rose-500/15 to-pink-500/5 text-rose-700",
  },
  {
    icon: Bike,
    title: "Rewards at your door",
    desc: "Medal, certificate and kit delivered free across India. Zero hassles.",
    tile: "from-[#0d9488]/15 to-emerald-500/5 text-[#0d9488]",
  },
];

export function EventWhy() {
  return (
    <section className="section border-b border-white/10 bg-[#090d16] text-[#f0f0f0]">
      <div className="container-page">
        <SectionHeader
          eyebrow="Why This Challenge"
          title={
            <>
              Built For Every Kind Of{" "}
              <span className="text-[#38bdf8]">Athlete</span>
            </>
          }
          lead="No crowds. No pressure. Just you, your target distance, and a finish that is 100% verified."
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.08}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#0d1322] p-6 sm:p-7 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#38bdf8] hover:shadow-[0_12px_40px_rgba(56,189,248,0.2)]">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/10 text-[#38bdf8] shadow-md group-hover:scale-105 group-hover:bg-[#0284c7] group-hover:text-white transition-all duration-300">
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-[#38bdf8]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300 font-medium">{desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
