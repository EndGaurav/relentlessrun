"use client";

import Link from "next/link";
import { ArrowRight, IndianRupee, Sparkles } from "lucide-react";

function formatPrice(price: string) {
  return price.replace(/^Rs\.\s*/, "₹");
}

export function EventStickyCta({
  price,
  compareAtPrice,
  slug,
}: {
  price: string;
  compareAtPrice?: string;
  slug: string;
  eventName?: string;
}) {
  const amount = price.toLowerCase().includes("free") ? "Free" : formatPrice(price);
  const mrp = compareAtPrice ? formatPrice(compareAtPrice) : undefined;

  return (
    <>
      {/* Spacer so page bottom content isn't covered on mobile */}
      <div className="h-28 md:hidden" aria-hidden="true" />

      {/* 100% Solid, Opaque & High-End Sticky Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-[#080c14] border-t border-sky-500/20 shadow-[0_-16px_40px_rgba(0,0,0,0.85)] md:hidden">
        {/* Shimmer Accent Line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent" />

        <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {/* Price & Value Proposition */}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="flex items-baseline gap-1.5">
              <span className="flex items-center text-lg font-black tracking-tight text-white font-mono leading-none">
                <IndianRupee className="h-3.5 w-3.5 mr-0.5 text-[#38bdf8]" />
                {amount.replace("₹", "")}
              </span>
              {mrp ? (
                <span className="text-[0.65rem] font-semibold text-slate-500 line-through">
                  {mrp}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 inline-flex items-center gap-1 truncate text-[0.58rem] font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="h-2.5 w-2.5 shrink-0 text-amber-400" />
              Medal + E-Certificate Included
            </p>
          </div>

          {/* Premium Glowing CTA Button */}
          <Link
            className="neon-btn-blue group relative flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shrink-0 select-none active:scale-95 transition-transform"
            href={`/register?event=${encodeURIComponent(slug)}`}
          >
            <span>Register Now</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </>
  );
}
