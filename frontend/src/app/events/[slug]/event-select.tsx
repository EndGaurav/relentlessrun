"use client";

import { useState } from "react";
import Link from "next/link";
import { Bike, Footprints, IndianRupee, Route, Sparkles, Timer } from "lucide-react";
import type { PublicEvent } from "../../data/events";
import { RegisterCta } from "../../components/register-cta";
import { EventCountdown } from "./countdown";
import { SectionHeader } from "./reveal";

const WHATSAPP_URL = "https://wa.me/918287491957";

type Activity = { key: string; label: string; icon: typeof Footprints; active: string };

const activities: Activity[] = [
  { key: "run", label: "Run", icon: Footprints, active: "border-[#0d9488] bg-[#0d9488] text-white shadow-[0_10px_24px_-10px_rgba(13,148,136,0.6)]" },
  { key: "walk", label: "Walk", icon: Route, active: "border-sky-500 bg-sky-500 text-white shadow-[0_10px_24px_-10px_rgba(14,165,233,0.6)]" },
  { key: "cycle", label: "Cycle", icon: Bike, active: "border-violet-500 bg-violet-500 text-white shadow-[0_10px_24px_-10px_rgba(139,92,246,0.6)]" },
];

function distanceNum(d: string) {
  const m = d.match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
}

function tier(km: number, activity: string) {
  if (activity === "walk" && km >= 5) return { label: "Power walk", chip: "border-sky-200 bg-sky-50 text-sky-700", bar: "bg-sky-500" };
  if (activity === "cycle") return { label: "Ride", chip: "border-violet-200 bg-violet-50 text-violet-700", bar: "bg-violet-500" };
  if (km <= 3.2) return { label: "Easy starter", chip: "border-emerald-200 bg-emerald-50 text-emerald-700", bar: "bg-emerald-500" };
  if (km === 5) return { label: "Classic 5K", chip: "border-[#0d9488] bg-[#f0fdfa] text-[#0d9488]", bar: "bg-[#0d9488]" };
  if (km === 10) return { label: "10K challenge", chip: "border-violet-200 bg-violet-50 text-violet-700", bar: "bg-violet-500" };
  if (km >= 21) return { label: "Half marathon", chip: "border-[#c9a227] bg-[#fdf8ec] text-[#9a7a12]", bar: "bg-[#c9a227]" };
  return { label: "Challenge", chip: "border-slate-200 bg-slate-50 text-slate-600", bar: "bg-slate-400" };
}

function formatPrice(price: string) {
  return price.replace(/^Rs\.\s*/, "₹");
}

export function EventSelect({ event }: { event: PublicEvent }) {
  const [activity, setActivity] = useState(activities[0].key);
  const distances = event.distance.split(" / ");
  const whatsappUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(`Hi! I'm interested in ${event.name}. Can you help me with registration?`)}`;
  const amount = event.price.toLowerCase().includes("free") ? "Free" : formatPrice(event.price);
  const mrp = event.compareAtPrice ? formatPrice(event.compareAtPrice) : null;

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#090d16] text-[#f0f0f0]">
      <div className="container-page py-14 sm:py-20">
        <SectionHeader
          eyebrow="Choose & Run"
          title={
            <>
              Pick Your Challenge,{" "}
              <span className="text-[#38bdf8]">Find Your Pace</span>
            </>
          }
          lead="Choose a distance that suits your fitness goals — tap to register. Every entry includes the official finisher medal & kit."
        />

        <div className="mt-10 grid items-start gap-6 sm:mt-14 lg:grid-cols-[1.1fr_380px] lg:gap-8">
          {/* Purchase / Payment card - sticky on desktop */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-3xl border border-white/15 bg-[#0d1322] shadow-2xl">
              <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

              <div className="p-6 sm:p-7">
                {/* Price */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[0.68rem] font-black uppercase tracking-widest text-slate-400">
                      Official Entry Fee
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                        {amount}
                      </span>
                      {mrp ? (
                        <span className="text-sm font-semibold text-slate-400 line-through">
                          {mrp}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-sky-500/15 border border-sky-400/30 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-sky-300">
                      <Sparkles className="h-3 w-3 text-[#38bdf8]" />
                      Early Bird Slot • Finisher Kit Included
                    </p>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25">
                    <IndianRupee className="h-5 w-5" />
                  </span>
                </div>

                {/* Countdown */}
                {event.endsAt ? (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                    <p className="inline-flex items-center gap-1.5 text-[0.65rem] font-black uppercase tracking-widest text-slate-300">
                      <Timer className="h-3.5 w-3.5 text-[#38bdf8]" />
                      Registration Closes In
                    </p>
                    <div className="mt-3 flex justify-center">
                      <EventCountdown targetDate={event.endsAt} />
                    </div>
                  </div>
                ) : null}

                {/* What's included */}
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#38bdf8]">
                    Every Entry Includes
                  </p>
                  <ul className="mt-3 space-y-2 text-xs font-medium text-slate-300">
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#38bdf8]" />
                      Finisher medal + DRI-FIT T-shirt + E-Certificate
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#38bdf8]" />
                      GPS verified ranking on National Leaderboard
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#38bdf8]" />
                      Free tracked doorstep delivery across India
                    </li>
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-6 space-y-3">
                  <RegisterCta
                    className="neon-btn-blue w-full py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-xl hover:scale-[1.02] transition-transform"
                    signedInLabel="Register now"
                    signedOutLabel={`Register now — ${amount}`}
                    slug={event.slug}
                  />
                  <Link
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 py-3 text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-all"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Have questions? Ask on WhatsApp
                  </Link>
                </div>

                <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[0.68rem] font-medium text-slate-400">
                  <Sparkles className="h-3 w-3 text-[#38bdf8]" />
                  Instant UPI confirmation · 100% Safe & Verified
                </p>
              </div>
            </div>
          </div>

          {/* Distance picker */}
          <div className="order-2 lg:order-1">
            <div className="rounded-3xl border border-white/10 bg-[#0d1322] p-5 shadow-2xl sm:p-7">
              <p className="text-[0.68rem] font-black uppercase tracking-widest text-slate-400 mb-3">
                Select Activity & Distance
              </p>

              {/* Activity segmented */}
              <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-900/90 p-1.5 border border-white/10">
                {activities.map(({ key, label, icon: Icon }) => {
                  const isOn = activity === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActivity(key)}
                      aria-pressed={isOn}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold capitalize transition-all duration-200 cursor-pointer ${
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

              {/* Distance chips */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {distances.map((distance) => {
                  const km = distanceNum(distance);
                  const t = tier(km ?? 5, activity);
                  return (
                    <Link
                      key={distance}
                      href={`/register?event=${encodeURIComponent(event.slug)}&distance=${encodeURIComponent(distance)}`}
                      className="group flex flex-col rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#38bdf8] hover:bg-slate-800/80 hover:shadow-xl shadow-md"
                    >
                      <span className="text-lg font-black tracking-tight text-white group-hover:text-[#38bdf8] transition-colors">
                        {distance}
                      </span>
                      <span className="mt-1 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                        {t.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}