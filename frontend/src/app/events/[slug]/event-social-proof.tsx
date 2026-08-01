"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { BadgeCheck, MapPin, TrendingUp, Users } from "lucide-react";

export type SocialProofStat = {
  label: string;
  value?: number | null;
  suffix?: string;
  icon: "users" | "badge" | "map" | "trend";
  live?: boolean;
};

const ICONS = {
  users: Users,
  badge: BadgeCheck,
  map: MapPin,
  trend: TrendingUp,
} as const;

function CountUp({ value, suffix = "", live = false }: { value: number; suffix?: string; live?: boolean }) {
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
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="flex items-baseline gap-1">
      <span className="text-xl font-black tabular-nums tracking-tight text-(--foreground) sm:text-2xl">
        {display.toLocaleString("en-IN")}
      </span>
      {suffix ? <span className="text-sm font-bold text-(--sage)">{suffix}</span> : null}
      {live ? <span className="pulsing-dot self-center" /> : null}
    </span>
  );
}

export function EventSocialProof({ stats }: { stats: SocialProofStat[] }) {
  const visible = stats.filter((stat) => stat.value != null && stat.value > 0);
  if (visible.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {visible.map((stat) => {
        const Icon = ICONS[stat.icon];
        return (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-(--line) bg-(--panel) p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-(--sage)/30 hover:shadow-lg sm:p-5"
          >
            <div aria-hidden className="absolute -left-3 -top-3 h-10 w-10 rounded-full bg-(--sage) opacity-0 transition-all duration-300 group-hover:opacity-8" />
            <Icon className="mx-auto h-4.5 w-4.5 text-(--sage)" strokeWidth={1.75} />
            <div className="mt-2">
              <CountUp value={stat.value ?? 0} suffix={stat.suffix} live={stat.live} />
            </div>
            <p className="mt-1 text-[0.55rem] font-bold uppercase tracking-widest text-(--muted-soft)">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
