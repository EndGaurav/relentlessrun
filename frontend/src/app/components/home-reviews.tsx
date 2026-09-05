"use client";

import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Quote, Star, Users, Award, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { HomeTestimonial } from "../../lib/events-api";
import { HomeSectionHeader } from "./home-section-header";

/* ─── Fallback data ─── */
const fallbackReviews: HomeTestimonial[] = [
  { name: "Aarav Sharma", role: "10 km finisher", city: "Pune", rating: 5, quote: "Registration was simple and the proof upload was clear. Getting my certificate the same week felt amazing." },
  { name: "Nisha Verma", role: "5 km beginner", city: "Mumbai", rating: 5, quote: "I liked that I could run in my own city but still feel part of a real event. The medal made it truly memorable." },
  { name: "Rohan Mehta", role: "21 km finisher", city: "Delhi", rating: 5, quote: "The leaderboard gave my long run a real target. Clean experience from payment all the way to verification." },
  { name: "Priya Patel", role: "10 km finisher", city: "Ahmedabad", rating: 5, quote: "First virtual run and it exceeded expectations. The GPS verification was smooth and the certificate looks great." },
  { name: "Vikram Singh", role: "Half marathon", city: "Jaipur", rating: 5, quote: "Well organized event with timely medal delivery. Loved the digital finisher badge and live community leaderboard." },
  { name: "Ananya Gupta", role: "5 km runner", city: "Bangalore", rating: 5, quote: "Perfect for busy schedules — ran my 5K at 6 AM before work and uploaded proof in minutes. Instant digital certificate!" },
  { name: "Arjun Nair", role: "Cycling 25 km", city: "Kochi", rating: 5, quote: "Great that they now include cycling too! Did the 25 km distance along the coast. Fair ranking and prompt medal dispatch." },
  { name: "Deepika Joshi", role: "Walking 10 km", city: "Dehradun", rating: 5, quote: "As a walker I finally found an event that welcomes non-runners. The pace didn't matter — just finishing felt rewarding." },
];

/* ─── Helpers ─── */
function deriveBadge(role: string): string {
  const r = role.toLowerCase();
  if (r.includes("21") || r.includes("half")) return "Elite Finisher";
  if (r.includes("10")) return "Verified Runner";
  if (r.includes("5")) return "Rising Runner";
  if (r.includes("cycling")) return "Cycling Finisher";
  if (r.includes("walk")) return "Walker Verified";
  return "Verified Runner";
}

function deriveAchievement(role: string): string {
  return role
    .replace(/^(\d+)\s*km/i, "$1K")
    .replace(/\bfinisher\b/i, "Finisher")
    .replace(/\bbeginner\b/i, "Beginner")
    .replace(/\brunner\b/i, "Runner");
}

/* ─── Trust Bar ─── */
const trustStats = [
  { value: "4.9/5", label: "Average Rating", icon: Star, iconColor: "text-amber-400 fill-amber-400" },
  { value: "25,000+", label: "Registered Runners", icon: Users, iconColor: "text-[#38bdf8]" },
  { value: "98%", label: "Finish Rate", icon: Award, iconColor: "text-emerald-400" },
  { value: "1,800+", label: "Verified Reviews", icon: ShieldCheck, iconColor: "text-[#38bdf8]" },
];

function TrustBar() {
  return (
    <div className="mb-12 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-[#0d1322]/80 p-5 backdrop-blur-xl shadow-xl shadow-black/40 sm:grid-cols-4 sm:gap-6 sm:p-7">
      {trustStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="flex flex-col items-center justify-center text-center p-2">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              <span className="font-display text-2xl font-black tracking-tight text-[#f0f0f0] sm:text-3xl">
                {stat.value}
              </span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {stat.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Avatar ─── */
function AvatarCircle({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 font-bold text-slate-950 text-sm shadow-md ring-2 ring-sky-400/40">
      {initials}
    </span>
  );
}

/* ─── Review Card ─── */
function ReviewCard({ review }: { review: HomeTestimonial }) {
  const badge = deriveBadge(review.role);
  const achievement = deriveAchievement(review.role);

  return (
    <article className="group relative flex w-[330px] sm:w-[380px] shrink-0 flex-col justify-between rounded-2xl border border-white/10 bg-[#0d1322]/90 p-6 sm:p-7 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#38bdf8]/50 hover:bg-[#111827] hover:shadow-2xl hover:shadow-[#38bdf8]/10">
      {/* Quotation watermark */}
      <Quote
        aria-hidden="true"
        className="absolute top-5 right-5 h-12 w-12 text-[#38bdf8]/10 transition-colors duration-300 group-hover:text-[#38bdf8]/20"
      />

      <div>
        {/* Header Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#38bdf8]">
            <BadgeCheck className="h-3.5 w-3.5 text-[#38bdf8]" />
            {badge}
          </span>

          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="ml-1 text-[#f0f0f0] font-bold">{review.rating}.0</span>
          </div>
        </div>

        {/* Quote content */}
        <blockquote className="mb-6">
          <p className="text-sm sm:text-base leading-relaxed text-[#f0f0f0] font-medium">
            &ldquo;{review.quote}&rdquo;
          </p>
        </blockquote>
      </div>

      {/* User Info Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center gap-3">
        <AvatarCircle name={review.name} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-bold text-[#f0f0f0]">
              {review.name}
            </span>
            <BadgeCheck className="h-4 w-4 shrink-0 text-[#38bdf8]" />
          </div>
          <p className="truncate text-xs text-slate-400">
            {achievement} {review.city ? `· ${review.city}` : ""}
          </p>
        </div>
      </div>
    </article>
  );
}

/* ─── Main ─── */
export function HomeReviews({ testimonials: initial }: { testimonials?: HomeTestimonial[] }) {
  const [reviews] = useState<HomeTestimonial[]>(
    initial && initial.length > 0 ? initial : fallbackReviews,
  );

  // Duplicate reviews array for smooth infinite continuous loop
  const marqueeReviews = [...reviews, ...reviews];

  return (
    <section className="relative py-16 sm:py-24 border-b border-white/10 overflow-hidden bg-[#090d16]">
      {/* Background glow effects */}
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[600px] rounded-full bg-sky-500/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <TrustBar />

        <HomeSectionHeader
          action={
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 font-bold text-slate-950 text-sm hover:from-sky-400 hover:to-blue-500 transition-all shadow-lg shadow-sky-500/20 group"
              href="/events"
            >
              Explore Events
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          }
          align="split"
          eyebrow="Runner Reviews"
          title="Experiences from the Community"
        />
        {/* Infinite Auto-scrolling Marquee Track (Constrained to container width) */}
        <div className="relative mt-8 w-full overflow-hidden rounded-3xl py-2">
          {/* Left and Right Fade Gradient Masks */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 sm:w-24 bg-gradient-to-r from-[#0d1322] via-[#090d16] to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 sm:w-24 bg-gradient-to-l from-[#0d1322] via-[#090d16] to-transparent" />

          {/* Marquee Row */}
          <div className="animate-marquee-slow flex gap-6">
            {marqueeReviews.map((review, i) => (
              <ReviewCard key={`${review.name}-${i}`} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}




