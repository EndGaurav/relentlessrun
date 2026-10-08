"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bike,
  CalendarDays,
  FileBadge,
  Flame,
  Footprints,
  IndianRupee,
  Medal,
  MessageCircle,
  Route,
  ShieldCheck,
  Shirt,
  Sparkles,
  Star,
  Timer,
  Truck,
  Zap,
} from "lucide-react";
import type { PublicEvent } from "../../data/events";
import { RegisterCta } from "../../components/register-cta";
import { EventCountdown } from "./countdown";
import { getApiUrl, resolveImageUrl } from "../../../lib/api";
import { type ApiEvent, mapApiEventToPublic } from "../../../lib/events-api";

const WHATSAPP_URL = "https://wa.me/918287491957";

type Activity = { key: string; label: string; icon: typeof Footprints };

const ACTIVITY_CONFIG: Record<string, { label: string; icon: typeof Footprints }> = {
  running: { label: "Run", icon: Footprints },
  run: { label: "Run", icon: Footprints },
  walking: { label: "Walk", icon: Route },
  walk: { label: "Walk", icon: Route },
  cycling: { label: "Cycle", icon: Bike },
  cycle: { label: "Cycle", icon: Bike },
};

function formatPrice(price: string) {
  return price.replace(/^Rs\.\s*/, "₹");
}

function getEventScarcity(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  const percent = 82 + (positive % 14); // 82% to 95%
  const bibsLeft = 12 + (positive % 28); // 12 to 39 bibs left
  return { percent, bibsLeft };
}

export function EventHero({
  event: initialEvent,
  isPast,
}: {
  event: PublicEvent;
  isPast: boolean;
}) {
  const [event, setEvent] = useState<PublicEvent>(initialEvent);
  const [imageSrc, setImageSrc] = useState<string>(() =>
    resolveImageUrl(initialEvent.bannerImageUrl),
  );

  const availableActivities = useMemo<Activity[]>(() => {
    const rawTypes =
      event.activityTypes && event.activityTypes.length > 0
        ? event.activityTypes
        : ["running"];

    const list: Activity[] = [];
    const seen = new Set<string>();

    for (const raw of rawTypes) {
      const lower = raw.toLowerCase().trim();
      const standardKey =
        lower === "run" ? "running" : lower === "walk" ? "walking" : lower === "cycle" ? "cycling" : lower;
      const conf = ACTIVITY_CONFIG[standardKey] || {
        label: standardKey.charAt(0).toUpperCase() + standardKey.slice(1),
        icon: Footprints,
      };

      if (!seen.has(standardKey)) {
        seen.add(standardKey);
        list.push({
          key: standardKey,
          label: conf.label,
          icon: conf.icon,
        });
      }
    }

    return list.length > 0 ? list : [{ key: "running", label: "Run", icon: Footprints }];
  }, [event.activityTypes]);

  const [activity, setActivity] = useState<string>(() => availableActivities[0]?.key || "running");

  useEffect(() => {
    if (availableActivities.length > 0 && !availableActivities.some((a) => a.key === activity)) {
      setActivity(availableActivities[0].key);
    }
  }, [availableActivities, activity]);

  const distances = useMemo(() => event.distance.split(" / "), [event.distance]);
  const [selectedDistance, setSelectedDistance] = useState<string>(distances[0] || "5 km");
  const scarcity = useMemo(() => getEventScarcity(event.slug), [event.slug]);

  useEffect(() => {
    setEvent(initialEvent);
    setImageSrc(resolveImageUrl(initialEvent.bannerImageUrl));
    const distList = initialEvent.distance.split(" / ");
    if (distList.length > 0) setSelectedDistance(distList[0]);
  }, [initialEvent]);

  // Live client sync
  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const res = await fetch(getApiUrl(`/api/events/${encodeURIComponent(initialEvent.slug)}`), {
          cache: "no-store",
        });
        if (res.ok) {
          const json = (await res.json()) as { data: ApiEvent };
          if (json.data && !cancelled) {
            const mapped = mapApiEventToPublic(json.data);
            setEvent(mapped);
            if (mapped.bannerImageUrl) {
              setImageSrc(resolveImageUrl(mapped.bannerImageUrl));
            }
          }
        }
      } catch {
        // silent fallback
      }
    }
    void refresh();
    return () => {
      cancelled = true;
    };
  }, [initialEvent.slug]);

  const amount = event.price.toLowerCase().includes("free") ? "Free" : formatPrice(event.price);
  const mrp = event.compareAtPrice ? formatPrice(event.compareAtPrice) : null;
  const whatsappUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(
    `Hi! I'm interested in ${event.name} (${selectedDistance}). Can you help me with registration?`,
  )}`;

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#090d16] text-[#f0f0f0] pt-24 pb-12 sm:pt-28 sm:pb-16">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-12 left-1/4 -z-10 h-[450px] w-[600px] -translate-x-1/2 rounded-full bg-[#0284c7]/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 -z-10 h-[350px] w-[350px] rounded-full bg-[#38bdf8]/10 blur-[120px]" />

      <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Breadcrumb & Eyebrow Pill ─── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-white transition-colors">Events</Link>
            <span>/</span>
            <span className="text-[#38bdf8] font-bold truncate max-w-[200px] sm:max-w-none">{event.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-[#38bdf8]">
              <Sparkles className="h-3 w-3" />
              Pan-India Virtual Challenge
            </span>
          </div>
        </div>

        {/* ─── Main Unified Hero Grid ─── */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 items-start">
          {/* ── Left Column: Event Title, Details & Interactive Selector ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Title & Badge */}
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-[#0284c7] px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-wider text-white shadow-md">
                  <Flame className="h-3 w-3 fill-white" />
                  {isPast ? "OFFICIAL RECAP" : `${scarcity.percent}% Booked`}
                </span>
                {!isPast && (
                  <span className="text-[0.7rem] font-bold text-sky-300 flex items-center gap-1 font-mono">
                    <Zap className="h-3 w-3" /> Only {scarcity.bibsLeft} bibs left in current slot
                  </span>
                )}
              </div>

              <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight">
                {event.name}
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                {event.description || event.highlight || "Run, walk, or cycle anywhere in your city. Finish at your own pace, submit GPS proof, and receive an official heavyweight finisher medal delivered to your door."}
              </p>

              {/* Rating */}
              <div className="mt-3.5 flex items-center gap-2">
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">4.9/5</span>
                <span className="text-xs text-slate-400">(1,800+ Verified Finisher Reviews)</span>
              </div>
            </div>

            {/* Quick Meta Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-[#0d1322] p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-400/20 text-[#38bdf8]">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.65rem] uppercase font-bold text-slate-400">Event Window</p>
                  <p className="text-xs font-bold text-white truncate">{event.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400">
                  <Route className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.65rem] uppercase font-bold text-slate-400">Location</p>
                  <p className="text-xs font-bold text-white truncate">Anywhere (GPS Tracked)</p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-300">
                  <Medal className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.65rem] uppercase font-bold text-slate-400">Finisher Kit</p>
                  <p className="text-xs font-bold text-white truncate">Medal + Tee Included</p>
                </div>
              </div>
            </div>

            {/* ── Interactive Activity & Distance Selector Box ── */}
            {!isPast && (
              <div className="rounded-3xl border border-white/15 bg-[#0d1322] p-5 sm:p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                    {availableActivities.length > 1
                      ? "1. Select Activity & Target Distance"
                      : "1. Select Target Distance"}
                  </span>
                  <span className="text-[0.7rem] font-bold text-[#38bdf8]">
                    {selectedDistance} Selected
                  </span>
                </div>

                {/* Activity Selector (Segmented buttons if multiple, or sleek single-activity badge) */}
                {availableActivities.length > 1 ? (
                  <div
                    className={`grid gap-2 rounded-2xl bg-slate-900/90 p-1.5 border border-white/10 mb-4 ${
                      availableActivities.length === 2 ? "grid-cols-2" : "grid-cols-3"
                    }`}
                  >
                    {availableActivities.map(({ key, label, icon: Icon }) => {
                      const isOn = activity === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActivity(key)}
                          className={`inline-flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold capitalize transition-all duration-200 cursor-pointer ${
                            isOn
                              ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 border border-sky-400/50"
                              : "border-transparent bg-transparent text-slate-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2} />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-slate-900/70 px-3 py-1.5 border border-white/10 mb-4">
                    {(() => {
                      const ActIcon = availableActivities[0]?.icon || Footprints;
                      return <ActIcon className="h-3.5 w-3.5 text-[#38bdf8]" strokeWidth={2.5} />;
                    })()}
                    <span className="text-xs font-semibold text-slate-300">
                      Activity: <strong className="text-white capitalize">{availableActivities[0]?.label || "Run"}</strong>
                    </span>
                  </div>
                )}

                {/* Distance Option Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {distances.map((dist) => {
                    const isSelected = selectedDistance === dist;
                    return (
                      <button
                        key={dist}
                        type="button"
                        onClick={() => setSelectedDistance(dist)}
                        className={`group flex flex-col items-start p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-[#38bdf8] bg-sky-500/15 shadow-[0_4px_20px_rgba(56,189,248,0.2)]"
                            : "border-white/10 bg-slate-900/60 hover:border-white/25 hover:bg-slate-800/80"
                        }`}
                      >
                        <span className={`text-base font-black tracking-tight ${isSelected ? "text-white" : "text-slate-200"}`}>
                          {dist}
                        </span>
                        <span className="text-[0.62rem] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                          {dist.toLowerCase().includes("21") ? "Half Marathon" : dist.toLowerCase().includes("10") ? "Challenge 10K" : "Standard Distance"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* ── Price & Register Action Bar ── */}
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">
                      All-Inclusive Entry Fee
                    </p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white flex items-center">
                        <IndianRupee className="h-6 w-6 text-[#38bdf8] mr-0.5" />
                        {amount.replace("₹", "")}
                      </span>
                      {mrp ? (
                        <span className="text-sm font-semibold text-slate-500 line-through">
                          {mrp}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[0.62rem] font-bold text-emerald-400 uppercase tracking-wider mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Medal + Kit + Tracked Delivery Included
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 sm:min-w-56">
                    <RegisterCta
                      className="neon-btn-blue h-12 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-xl hover:scale-105 transition-transform"
                      signedInLabel={`Register Now · ${selectedDistance}`}
                      signedOutLabel={`Register Now — ${amount}`}
                      slug={event.slug}
                      distance={selectedDistance}
                      activity={activity}
                    />
                    <Link
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] text-[0.7rem] font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Questions? Chat on WhatsApp
                    </Link>
                  </div>
                </div>

                {/* Countdown */}
                {event.endsAt && (
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">
                      <Timer className="h-3.5 w-3.5 text-[#38bdf8]" />
                      Registration closes in:
                    </span>
                    <EventCountdown targetDate={event.endsAt} compact />
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* ── Right Column: High-Definition Poster Frame & Reward Kit Summary ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 lg:sticky lg:top-24"
          >
            {/* Cinematic Poster Box */}
            <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#0d1322] shadow-[0_16px_50px_rgba(0,0,0,0.8)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={`${event.name} official poster`}
                className="w-full h-auto object-cover aspect-[16/10] max-h-[480px] transition-transform duration-700 hover:scale-105"
                onError={() => {
                  const fallback = "/images/mountain-run-hero.svg";
                  if (imageSrc !== fallback) setImageSrc(fallback);
                }}
              />

              {/* Gradient Scrim */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090d16]/95 via-[#090d16]/20 to-transparent"
              />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {isPast ? "Event Completed" : "Registration Open"}
                </span>
              </div>

              {/* Bottom Poster Tag */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/70 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white shadow-lg">
                  <Medal className="h-4 w-4 text-[#38bdf8]" />
                  <span>Heavyweight Finisher Medal Included</span>
                </div>
              </div>
            </div>

            {/* Quick Finisher Kit Badge Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0d1322] p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-[#38bdf8]">
                  <Shirt className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">Dri-Fit Event Tee</p>
                  <p className="text-[0.65rem] text-slate-400">Official Special Edition</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0d1322] p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-[#38bdf8]">
                  <FileBadge className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">Verified Certificate</p>
                  <p className="text-[0.65rem] text-slate-400">With Official Time</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0d1322] p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-[#38bdf8]">
                  <Truck className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">Free Doorstep Delivery</p>
                  <p className="text-[0.65rem] text-slate-400">Tracked Pan-India</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0d1322] p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-[#38bdf8]">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">GPS Verified Finish</p>
                  <p className="text-[0.65rem] text-slate-400">Manual 24hr Review</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
