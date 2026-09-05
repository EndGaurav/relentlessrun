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
    <section className="event-classic-stats border-b border-(--line)">
      <div className="container-page -mt-7 sm:-mt-8">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden border border-(--line) bg-(--line) shadow-premium sm:grid-cols-4">
            {stats.map(({ icon: Icon, value, suffix, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 bg-(--panel) px-4 py-6 text-center transition-colors duration-300 hover:bg-(--panel-soft) sm:py-8"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--gold-line) bg-(--gold-soft) text-(--gold-deep)">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                </span>
                <span className="mt-1 text-2xl font-black tabular-nums tracking-tight text-(--foreground) sm:text-3xl">
                  <CountUp value={value} />
                  <span className="text-(--gold-deep)">{suffix}</span>
                </span>
                <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-(--muted-soft) sm:text-[0.65rem]">
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
