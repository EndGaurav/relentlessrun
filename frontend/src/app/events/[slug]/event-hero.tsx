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
  Route,
  ShieldCheck,
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
  const percent = 36 + (positive % 16); // 36% to 51% Booked
  const bibsLeft = 45 + (positive % 35); // 45 to 79 bibs left
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

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#f8fafc] text-[#090d16] pt-24 pb-12 sm:pt-28 sm:pb-16 isolate">
      {/* Background ambient lighting */}
      <div aria-hidden className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-sky-200/40 blur-[140px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-10 -z-10 h-[300px] w-[300px] rounded-full bg-blue-100/50 blur-[100px]" />

      <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ─── Breadcrumb & Eyebrow Pill ─── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-slate-900 transition-colors">Events</Link>
            <span>/</span>
            <span className="text-[#0284c7] font-bold truncate max-w-[200px] sm:max-w-none">{event.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-600/30 bg-sky-50 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-[#0284c7] shadow-sm">
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
                  {isPast ? "OFFICIAL RECAP" : "Registration Open"}
                </span>
              </div>

              <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#090d16] leading-tight">
                {event.name}
              </h1>

              <div className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                {event.description || event.highlight || "Run, walk, or cycle anywhere in your city. Finish at your own pace, submit GPS proof, and receive an official heavyweight finisher medal delivered to your door."}
              </div>

              {/* Rating */}
              <div className="mt-3.5 flex items-center gap-2">
                <div className="flex gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-900">4.9/5</span>
                <span className="text-xs text-slate-500 font-medium">(1,800+ Verified Finisher Reviews)</span>
              </div>
            </div>

            {/* Quick Meta Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7]">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.65rem] uppercase font-bold text-slate-500">Event Window</p>
                  <p className="text-xs font-bold text-[#090d16] truncate">{event.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                  <Route className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.65rem] uppercase font-bold text-slate-500">Location</p>
                  <p className="text-xs font-bold text-[#090d16] truncate">Anywhere (GPS Tracked)</p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 border border-purple-200 text-purple-600">
                  <Medal className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.65rem] uppercase font-bold text-slate-500">Finisher Kit</p>
                  <p className="text-xs font-bold text-[#090d16] truncate">Medal + Certificate</p>
                </div>
              </div>
            </div>

            {/* ── Interactive Activity & Distance Selector Box ── */}
            {!isPast && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                    {availableActivities.length > 1
                      ? "1. Select Activity & Target Distance"
                      : "1. Select Target Distance"}
                  </span>
                  <span className="text-[0.7rem] font-bold text-[#0284c7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                    {selectedDistance} Selected
                  </span>
                </div>

                {/* Activity Selector (Segmented buttons if multiple, or sleek single-activity badge) */}
                {availableActivities.length > 1 ? (
                  <div
                    className={`grid gap-2 rounded-2xl bg-slate-100 p-1.5 border border-slate-200 mb-4 ${
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
                              ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 border border-sky-400"
                              : "border-transparent bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white"
                          }`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2} />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200 mb-4">
                    {(() => {
                      const ActIcon = availableActivities[0]?.icon || Footprints;
                      return <ActIcon className="h-3.5 w-3.5 text-[#0284c7]" strokeWidth={2.5} />;
                    })()}
                    <span className="text-xs font-semibold text-slate-700">
                      Activity: <strong className="text-slate-900 capitalize">{availableActivities[0]?.label || "Run"}</strong>
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
                            ? "border-[#0284c7] bg-sky-50/80 shadow-[0_4px_20px_rgba(2,132,199,0.15)] ring-1 ring-[#0284c7]"
                            : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-100/80"
                        }`}
                      >
                        <span className={`text-base font-black tracking-tight ${isSelected ? "text-[#0284c7]" : "text-slate-800"}`}>
                          {dist}
                        </span>
                        <span className="text-[0.62rem] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                          {dist.toLowerCase().includes("21") ? "Half Marathon" : dist.toLowerCase().includes("10") ? "Challenge 10K" : "Standard Distance"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* ── Price & Register Action Bar ── */}
                <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">
                      All-Inclusive Entry Fee
                    </p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#090d16] flex items-center">
                        <IndianRupee className="h-6 w-6 text-[#0284c7] mr-0.5" />
                        {amount.replace("₹", "")}
                      </span>
                      {mrp ? (
                        <span className="text-sm font-semibold text-slate-400 line-through">
                          {mrp}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[0.62rem] font-bold text-emerald-600 uppercase tracking-wider mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> Medal + Kit + Tracked Delivery Included
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 sm:min-w-56">
                    <RegisterCta
                      className="btn btn-primary h-12 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-xl hover:scale-105 transition-transform"
                      signedInLabel={`Register Now · ${selectedDistance}`}
                      signedOutLabel={`Register Now — ${amount}`}
                      slug={event.slug}
                      distance={selectedDistance}
                      activity={activity}
                    />
                  </div>
                </div>

                {/* Countdown */}
                {event.endsAt && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
                      <Timer className="h-3.5 w-3.5 text-[#0284c7]" />
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
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-2xl flex items-center justify-center min-h-[360px] sm:min-h-[420px]">
              {/* Ambient blurred backdrop for seamless color fill */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
              />

              {/* Main crisp full image — 100% uncropped */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={`${event.name} official poster`}
                className="relative z-1 max-w-full max-h-[420px] sm:max-h-[460px] w-auto h-auto object-contain p-2 sm:p-4 transition-transform duration-700 hover:scale-105 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
                onError={() => {
                  const fallback = "/images/mountain-run-hero.svg";
                  if (imageSrc !== fallback) setImageSrc(fallback);
                }}
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
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/80 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white shadow-lg">
                  <Medal className="h-4 w-4 text-[#38bdf8]" />
                  <span>Heavyweight Finisher Medal Included</span>
                </div>
              </div>
            </div>

            {/* Quick Finisher Kit Badge Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7]">
                  <Medal className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">Finisher Metal Medal</p>
                  <p className="text-[0.65rem] text-slate-500">Custom Embossed</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7]">
                  <FileBadge className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">Verified Certificate</p>
                  <p className="text-[0.65rem] text-slate-500">With Official Time</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7]">
                  <Truck className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">Free Doorstep Delivery</p>
                  <p className="text-[0.65rem] text-slate-500">Tracked Pan-India</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7]">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">GPS Verified Finish</p>
                  <p className="text-[0.65rem] text-slate-500">Manual 24hr Review</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
