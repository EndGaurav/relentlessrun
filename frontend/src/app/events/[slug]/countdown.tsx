"use client";

import { useEffect, useMemo, useState } from "react";
import { Timer } from "lucide-react";

function getParts(target: number) {
  const total = Math.max(0, target - Date.now());
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { days, hours, minutes, seconds, total };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function EventCountdown({
  targetDate,
  label = "Registration closes in",
  compact = false,
}: {
  targetDate?: string;
  label?: string;
  compact?: boolean;
}) {
  const target = useMemo(
    () => (targetDate ? new Date(targetDate).getTime() : NaN),
    [targetDate],
  );
  const [parts, setParts] = useState(() => (Number.isNaN(target) ? null : getParts(target)));

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const tick = () => setParts(getParts(target));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (!parts || Number.isNaN(target)) return null;

  const isExpired = parts.total <= 0;

  if (isExpired) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-(--danger)/20 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-(--danger) dark:bg-red-900/10">
        <Timer className="h-3.5 w-3.5" />
        Registration closed
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2">
        <span className="font-bold tabular-nums text-(--foreground)">
          {parts.days > 0 ? `${parts.days}d ` : ""}
          {pad(parts.hours)}:{pad(parts.minutes)}:{pad(parts.seconds)}
        </span>
      </div>
    );
  }

  const items = [
    { value: parts.days, label: "Days" },
    { value: parts.hours, label: "Hours" },
    { value: parts.minutes, label: "Mins" },
    { value: parts.seconds, label: "Secs" },
  ];

  return (
    <div className="inline-flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-(--muted)">
        <Timer className="h-3.5 w-3.5 text-(--sage)" />
        {label}
      </span>
      <div className="flex gap-1.5">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex min-w-12 flex-col items-center rounded-xl border border-(--line) bg-(--panel) px-2 py-1.5 shadow-sm"
          >
            <span className="text-lg font-black tabular-nums leading-none tracking-tight text-(--foreground)">
              {pad(item.value)}
            </span>
            <span className="mt-1 text-[0.5rem] font-bold uppercase tracking-widest text-(--muted-soft)">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
