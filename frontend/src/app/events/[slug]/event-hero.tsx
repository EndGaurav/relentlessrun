"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  FileBadge,
  Medal,
  Route,
  Shirt,
  Sparkles,
  Star,
  Trophy,
  Truck,
} from "lucide-react";
import type { PublicEvent } from "../../data/events";
import { Breadcrumb } from "../../components/breadcrumb";
import { RegisterCta } from "../../components/register-cta";
import { EventCountdown } from "./countdown";
import { Medal3D } from "./medal";

const rewardBadges = [
  { icon: Medal, label: "Finisher Medal" },
  { icon: Shirt, label: "Premium T-shirt" },
  { icon: FileBadge, label: "Official Certificate" },
  { icon: Truck, label: "Free Delivery" },
  { icon: Trophy, label: "Hall of Fame" },
];

export function EventHero({ event, isPast }: { event: PublicEvent; isPast: boolean }) {
  const distances = event.distance.split(" / ");
  const priceLabel =
    event.price.toLowerCase().includes("free")
      ? "Register now"
      : `Register now — ${event.price.replace(/^Rs\.\s*/, "₹")}`;

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#090d16] text-[#f0f0f0] pt-20 sm:pt-24 pb-16">
      {/* Background radiant glows */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 -z-10 h-[380px] w-[500px] sm:w-[700px] rounded-full bg-[#0284c7]/20 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 -z-10 h-[220px] w-[220px] rounded-full bg-[#38bdf8]/15 blur-[90px]" />

      <div className="container-page pb-10 pt-4">
        {/* ─── Headline block ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-slate-950/80 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-sky-300 backdrop-blur-md shadow-xl mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[#38bdf8]" />
            <span>INDIA&rsquo;S PREMIER VIRTUAL RUN</span>
          </div>

          <h1 className="mt-2 font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white">
            <span className="block text-slate-300 font-extrabold text-xl sm:text-2xl uppercase tracking-widest mb-1">
              {isPast ? "OFFICIAL RECAP" : "ACTIVE CHALLENGE"}
            </span>
            <span className="block text-[#38bdf8] italic drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
              {event.name}
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-300 font-medium leading-relaxed px-2">
            Run anywhere. Your pace. Your proof. Finish with pride and earn official heavy-metal medals delivered to your doorstep.
          </p>

          {/* Rating */}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs font-bold text-slate-300 ml-1">
              4.9/5 Trusted by runners across India
            </p>
          </div>

          {/* CTAs */}
          <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <RegisterCta
              className="neon-btn-blue rounded-full px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-xl hover:scale-105 transition-transform"
              signedInLabel="Register now"
              signedOutLabel={priceLabel}
              slug={event.slug}
            />
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md hover:bg-white/20 transition-all shadow-md"
              href="#rewards"
              scroll
            >
              See rewards
            </Link>
          </div>

          {!isPast && event.endsAt ? (
            <div className="mt-5 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/90 backdrop-blur-xl px-4 py-1.5 text-xs font-bold text-slate-200 shadow-lg">
                <EventCountdown targetDate={event.endsAt} compact />
              </span>
            </div>
          ) : null}

          {/* Floating reward badges */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {rewardBadges.map(({ icon: Icon, label }, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-[0.7rem] sm:text-xs font-bold text-slate-200 backdrop-blur-md shadow-md hover:border-sky-400/50 hover:bg-white/[0.08] transition-all"
              >
                <Icon className="h-3.5 w-3.5 text-[#38bdf8]" />
                {label}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* ─── Modern cinematic poster frame ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-8 max-w-5xl sm:mt-12"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.bannerImageUrl ?? "/images/mountain-run-hero.svg"}
              alt={`${event.name} banner`}
              className="w-full h-auto max-h-[520px] object-contain sm:object-cover aspect-[16/9] sm:aspect-[16/8] lg:aspect-[21/9]"
              onError={(e) => {
                const fallback = "/images/mountain-run-hero.svg";
                if (!e.currentTarget.src.endsWith(fallback)) {
                  e.currentTarget.src = fallback;
                }
              }}
            />

            {/* Gradient Overlay */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090d16]/90 via-transparent to-transparent"
            />

            {/* Status badge */}
            <span className="absolute left-3 top-3 sm:left-5 sm:top-5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 text-[0.65rem] sm:text-xs font-black uppercase tracking-wider text-white shadow-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {isPast ? "Event Completed" : "Open for Registration"}
            </span>

            {/* Bottom Meta Bar */}
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                  <CalendarDays className="h-3.5 w-3.5 text-[#38bdf8]" />
                  {event.date}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                  <Route className="h-3.5 w-3.5 text-[#38bdf8]" />
                  {distances.slice(0, 3).join(" · ")}
                  {distances.length > 3 ? " +" : ""}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
