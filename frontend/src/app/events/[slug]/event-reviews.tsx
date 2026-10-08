"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Reveal, SectionHeader } from "./reveal";

const reviews = [
  {
    name: "Aarav Sharma",
    meta: "10 km Finisher · Pune",
    quote:
      "Registration was super easy and the GPS proof verification took less than 24 hours. The medal is solid metal and looks amazing in person!",
  },
  {
    name: "Nisha Verma",
    meta: "5 km Finisher · Mumbai",
    quote:
      "I ran in my local park at 6 AM. Getting the leaderboard ranking and the personalized certificate delivered felt super motivating.",
  },
  {
    name: "Rohan Mehta",
    meta: "21 km Half Marathon · Delhi",
    quote:
      "The leaderboard gave my training a real competitive target. Seamless experience from Razorpay checkout all the way to doorstep kit delivery.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function EventReviews() {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const width = card ? card.offsetWidth + 16 : 300;
    el.scrollBy({ left: dir * width, behavior: "smooth" });
  };

  return (
    <section className="section border-b border-white/10 bg-[#090d16]">
      <div className="container-page">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader
            align="left"
            eyebrow="Runner Reviews"
            title={
              <>
                Loved by athletes{" "}
                <span className="text-gradient-premium">across India</span>
              </>
            }
          />
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous reviews"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0d1322] text-slate-300 shadow-sm transition-all duration-200 hover:border-cyan-500/40 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next reviews"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0d1322] text-slate-300 shadow-sm transition-all duration-200 hover:border-cyan-500/40 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <Reveal className="mt-8 sm:mt-10">
          <div
            ref={scroller}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
          >
            {reviews.map((review) => (
              <article
                key={review.name}
                data-card
                className="group relative flex h-full w-[86vw] shrink-0 snap-center flex-col rounded-3xl border border-white/10 bg-[#0d1322] p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_12px_30px_-5px_rgba(56,189,248,0.15)] sm:w-[calc(50vw-2rem)] sm:p-7 lg:w-[calc(33.333vw-2.5rem)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-wider text-emerald-400">
                    Verified Finisher
                  </span>
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-300 sm:text-[0.95rem]">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-xs font-black text-white shadow-md shadow-sky-500/20">
                    {initials(review.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">{review.name}</p>
                    <p className="truncate text-xs text-slate-400">{review.meta}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}