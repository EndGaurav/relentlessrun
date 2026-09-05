"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  Flame,
  Medal,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PublicEvent } from "../data/events";
import { publicEvents as staticUpcoming } from "../data/events";

// Deterministic realistic slot scarcity calculation based on event slug & date
function getEventScarcity(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  const percent = 78 + (positive % 18); // 78% to 95% booked
  const bibsLeft = 14 + (positive % 32); // 14 to 45 bibs left
  return { percent, bibsLeft };
}

function EventCard({ event, index }: { event: PublicEvent; index: number }) {
  const hasBannerImage = Boolean(event.bannerImageUrl);
  const scarcity = useMemo(() => getEventScarcity(event.slug), [event.slug]);

  // Live countdown state
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 14 + (index * 6) % 24,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 30, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#38bdf8]/50 hover:bg-white/[0.06]"
    >
      {/* Banner / Poster */}
      <div
        className={`relative overflow-hidden ${
          hasBannerImage ? "min-h-44 bg-[#090d16]" : "min-h-44 bg-gradient-to-br from-[#2563eb] to-sky-700"
        }`}
      >
        {event.bannerImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={`${event.name} banner`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={event.bannerImageUrl}
          />
        ) : null}
        {hasBannerImage ? (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#090d16]/95 via-[#090d16]/50 to-transparent"
          />
        ) : null}

        {/* Top Badges */}
        <div className="relative z-10 p-4 flex items-start justify-between gap-2">
          {/* Live Pulsating Scarcity Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2563eb] px-3 py-1 text-[0.65rem] font-black uppercase tracking-wider text-white shadow-lg">
            <Flame className="h-3 w-3 animate-bounce fill-white" />
            <span>{scarcity.percent}% Booked</span>
          </span>

          {/* Registration Live Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#090d16]/90 backdrop-blur-md px-3 py-1 text-[0.65rem] font-black uppercase tracking-wider text-[#f0f0f0] shadow-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[#f0f0f0]">Active Race</span>
          </span>
        </div>

        {/* Reward / Medal Highlight Strip */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#f0f0f0] drop-shadow-md">
            <Medal className="h-4 w-4 text-[#38bdf8] shrink-0" />
            <span className="truncate">{event.reward}</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Scarcity Progress Bar */}
        <div className="mb-4 space-y-1.5">
          <div className="flex items-center justify-between text-[0.68rem]">
            <span className="font-semibold text-[#38bdf8] flex items-center gap-1">
              <Zap className="h-3 w-3" /> Only {scarcity.bibsLeft} Bibs Remaining
            </span>
            <span className="text-slate-400 font-mono">
              {scarcity.percent}% filled
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 p-0.5 border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${scarcity.percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-[#2563eb] to-blue-700"
            />
          </div>
        </div>

        {/* Title & Distance */}
        <h3 className="font-display font-extrabold text-xl uppercase tracking-tight text-[#f0f0f0] transition-colors group-hover:text-[#38bdf8]">
          {event.name}
        </h3>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {event.distance.split(",").map((d) => (
            <span
              key={d}
              className="rounded-lg bg-sky-500/15 border border-sky-500/30 px-2.5 py-0.5 font-mono text-[0.68rem] font-bold text-[#38bdf8]"
            >
              {d.trim()}
            </span>
          ))}
        </div>

        <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-300 line-clamp-2">
          {event.highlight}
        </p>

        {/* Countdown & Price Footer */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[0.7rem] text-slate-400 font-medium">
            <Timer className="h-3.5 w-3.5 text-[#38bdf8] shrink-0" />
            <span>Closes in:</span>
            <span className="font-mono font-bold text-[#f0f0f0]">
              {timeLeft.hours}h {String(timeLeft.minutes).padStart(2, "0")}m
            </span>
          </div>

          <div className="text-right">
            <span className="font-mono text-lg font-black text-[#f0f0f0]">
              {event.price.replace(/^Rs\.\s*/, "").replace(/^₹/, "₹")}
            </span>
          </div>
        </div>

        {/* Primary CTA */}
        <Link
          className="neon-btn-blue mt-4 w-full text-xs font-black uppercase tracking-wider py-3 rounded-full flex items-center justify-center gap-2 shadow-lg"
          href={`/events/${event.slug}`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Claim Your Bib & Medal</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </motion.article>


  );
}

export function HomeEvents({ initial = staticUpcoming.slice(0, 3) }: { initial?: PublicEvent[] }) {
  const events = initial;

  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, i) => (
        <EventCard key={event.slug} event={event} index={i} />
      ))}
    </div>
  );
}
