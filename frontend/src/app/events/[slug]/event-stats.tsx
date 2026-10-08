"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Flag, Medal, Star, Users } from "lucide-react";
import { Reveal } from "./reveal";

type Stat = {
  icon: typeof Users;
  value: number;
  suffix: string;
  label: string;
};

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      const id = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(id);
    }
    const duration = 1300;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(Math.round((1 - Math.pow(1 - t, 3)) * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);

  return <span ref={ref}>{display.toLocaleString("en-IN")}</span>;
}

const stats: Stat[] = [
  { icon: Users, value: 25000, suffix: "+", label: "Runners joined" },
  { icon: Flag, value: 120, suffix: "+", label: "Cities covered" },
  { icon: Star, value: 98, suffix: "%", label: "Completion rate" },
  { icon: Medal, value: 1800, suffix: "+", label: "Verified reviews" },
];

export function EventStats() {
  return (
    <section className="relative py-12 border-b border-white/10 bg-[#090d16]">
      <div className="container-page">
        <Reveal>
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-[#0d1322] p-4 sm:p-6 shadow-2xl sm:grid-cols-4 sm:gap-6">
            {stats.map(({ icon: Icon, value, suffix, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-3 text-center rounded-2xl hover:bg-white/[0.03] transition-colors"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/10 text-[#38bdf8] shadow-md">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="mt-1 text-2xl font-black tabular-nums tracking-tight text-white sm:text-3xl">
                  <CountUp value={value} />
                  <span className="text-[#38bdf8]">{suffix}</span>
                </span>
                <span className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
