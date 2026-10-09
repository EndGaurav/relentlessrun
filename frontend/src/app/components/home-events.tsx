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
import { getApiUrl, resolveImageUrl } from "../../lib/api";
import { type ApiEvent, mapApiEventToPublic } from "../../lib/events-api";
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
  const percent = 36 + (positive % 16); // 36% to 51% booked
  const bibsLeft = 45 + (positive % 35); // 45 to 79 bibs left
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
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-400 hover:shadow-2xl"
    >
      {/* Banner / Poster - 65% Card Height */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-[#090d16]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={`${event.name} banner`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={resolveImageUrl(event.bannerImageUrl)}
          onError={(e) => {
            const fallback = "/images/mountain-run-hero.svg";
            if (!e.currentTarget.src.endsWith(fallback)) {
              e.currentTarget.src = fallback;
            }
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#090d16]/95 via-[#090d16]/40 to-transparent"
        />

        {/* Top Badges */}
        <div className="relative z-10 p-4 flex items-start justify-between gap-2">
          {/* Live Scarcity Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0284c7] px-3 py-1 text-[0.65rem] font-black uppercase tracking-wider text-white shadow-lg">
            <Flame className="h-3 w-3 fill-white" />
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
            <span className="font-semibold text-sky-600 flex items-center gap-1">
              <Zap className="h-3 w-3" /> Only {scarcity.bibsLeft} Bibs Remaining
            </span>
            <span className="text-slate-500 font-mono">
              {scarcity.percent}% filled
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${scarcity.percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-[#0284c7] to-blue-700"
            />
          </div>
        </div>

        {/* Title & Distance */}
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#090d16] transition-colors group-hover:text-[#0284c7]">
          {event.name}
        </h3>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {event.distance.split(",").map((d) => (
            <span
              key={d}
              className="rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-0.5 font-mono text-[0.68rem] font-bold text-sky-700"
            >
              {d.trim()}
            </span>
          ))}
        </div>

        <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-600 line-clamp-2">
          {event.highlight}
        </p>

        {/* Countdown & Price Footer */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[0.7rem] text-slate-500 font-medium">
            <Timer className="h-3.5 w-3.5 text-sky-600 shrink-0" />
            <span>Closes in:</span>
            <span className="font-mono font-bold text-[#090d16]">
              {timeLeft.hours}h {String(timeLeft.minutes).padStart(2, "0")}m
            </span>
          </div>

          <div className="text-right">
            <span className="font-mono text-lg font-black text-[#090d16]">
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

function FeaturedEventSpotlight({ event }: { event: PublicEvent }) {
  const scarcity = useMemo(() => getEventScarcity(event.slug), [event.slug]);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 18,
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl transition-all hover:border-sky-400/60"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Visual Poster */}
        <div className="relative min-h-[300px] sm:min-h-[360px] lg:min-h-[440px] lg:col-span-5 overflow-hidden bg-slate-950 flex items-center justify-center p-6">
          {/* Ambient blurred backdrop for seamless color fill */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
            src={event.bannerImageUrl || "/images/mountain-run-hero.svg"}
          />

          {/* Main crisp full image — 100% uncropped */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={`${event.name} banner`}
            className="relative z-1 max-h-[300px] sm:max-h-[360px] lg:max-h-[400px] w-auto h-auto object-contain transition-transform duration-700 hover:scale-105 drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
            src={event.bannerImageUrl || "/images/mountain-run-hero.svg"}
            onError={(e) => {
              const fallback = "/images/mountain-run-hero.svg";
              if (!e.currentTarget.src.endsWith(fallback)) {
                e.currentTarget.src = fallback;
              }
            }}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0284c7] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg">
              <Flame className="h-3.5 w-3.5 fill-white" />
              <span>{scarcity.percent}% Booked</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#090d16]/90 backdrop-blur-md px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-400 shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>Active Challenge</span>
            </span>
          </div>

          {/* Reward strip on image */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-white shadow-xl">
              <Medal className="h-4 w-4 text-[#38bdf8] shrink-0" />
              <span className="truncate">{event.reward}</span>
            </div>
          </div>
        </div>

        {/* Right Details Content */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 lg:col-span-7 bg-[#0d1322] text-white">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="rounded-full border border-sky-400/40 bg-sky-500/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-[#38bdf8]">
                ⭐ FEATURED SPOTLIGHT CHALLENGE
              </span>
              {event.date && (
                <span className="text-xs font-semibold text-slate-400">
                  🗓️ {event.date}
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {event.name}
            </h3>

            {/* Distances */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              {event.distance.split(",").map((d) => (
                <span
                  key={d}
                  className="rounded-xl bg-sky-950/80 border border-sky-400/30 px-3 py-1 font-mono text-xs font-bold text-sky-300"
                >
                  {d.trim()}
                </span>
              ))}
            </div>

            <div className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-300 font-medium whitespace-pre-line line-clamp-4">
              {event.description || event.highlight}
            </div>

            {/* Progress Scarcity Bar */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" /> Only {scarcity.bibsLeft} bibs left in current batch!
                </span>
                <span className="text-slate-400 font-mono font-bold">
                  {scarcity.percent}% full
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800 p-0.5 border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scarcity.percent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Action Strip */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Timer className="h-4 w-4 text-[#38bdf8]" />
                <span>Registration Closes in:</span>
                <span className="font-mono font-bold text-white">
                  {timeLeft.hours}h {String(timeLeft.minutes).padStart(2, "0")}m {String(timeLeft.seconds).padStart(2, "0")}s
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-black text-white">
                  {event.price.replace(/^Rs\.\s*/, "").replace(/^₹/, "₹")}
                </span>
                {event.compareAtPrice && (
                  <span className="text-sm font-semibold line-through text-slate-500">
                    {event.compareAtPrice}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/events/${event.slug}`}
                className="neon-btn-blue flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-xl hover:scale-105 transition-transform active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>Claim Your Bib & Medal</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HomeEvents({ initial = staticUpcoming.slice(0, 3) }: { initial?: PublicEvent[] }) {
  const [events, setEvents] = useState<PublicEvent[]>(initial);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(getApiUrl("/api/events?scope=open"), {
          cache: "no-store",
        });
        if (!response.ok) return;
        const json = await response.json();
        const rows = (json.data ?? []) as ApiEvent[];
        if (cancelled) return;
        if (Array.isArray(rows)) {
          const sorted = [...rows].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
          setEvents(sorted.slice(0, 3).map((event) => mapApiEventToPublic(event, "upcoming")));
        }
      } catch {
        // keep initial/fallback
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (events.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center text-slate-400">
        <p className="text-sm">No active challenges at the moment. Check back soon!</p>
      </div>
    );
  }

  // 1 Event: Show balanced full-width spotlight showcase
  if (events.length === 1) {
    return <FeaturedEventSpotlight event={events[0]} />;
  }

  // 2 Events: Centered 2-column balanced grid
  if (events.length === 2) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 md:grid-cols-2 max-w-4xl mx-auto">
        {events.map((event, i) => (
          <EventCard key={event.slug} event={event} index={i} />
        ))}
      </div>
    );
  }

  // 3+ Events: Standard 3-column responsive grid
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, i) => (
        <EventCard key={event.slug} event={event} index={i} />
      ))}
    </div>
  );
}
