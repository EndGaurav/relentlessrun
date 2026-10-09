"use client";

import Link from "next/link";
import { ArrowRight, IndianRupee, Sparkles } from "lucide-react";

function WhatsAppMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

function formatPrice(price: string) {
  return price.replace(/^Rs\.\s*/, "₹");
}

export function EventStickyCta({
  price,
  compareAtPrice,
  slug,
  eventName,
}: {
  price: string;
  compareAtPrice?: string;
  slug: string;
  eventName?: string;
}) {
  const amount = price.toLowerCase().includes("free") ? "Free" : formatPrice(price);
  const mrp = compareAtPrice ? formatPrice(compareAtPrice) : undefined;
  const whatsappMsg = encodeURIComponent(
    `Hi! I'm looking at ${eventName || "this event"} on Relentless Run. Can you help me register?`
  );
  const whatsappUrl = `https://wa.me/918287491957?text=${whatsappMsg}`;

  return (
    <>
      {/* Spacer so page bottom content isn't covered on mobile */}
      <div className="h-28 md:hidden" aria-hidden="true" />

      {/* 100% Solid, Opaque & High-End Sticky Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-[#080c14] border-t border-sky-500/20 shadow-[0_-16px_40px_rgba(0,0,0,0.85)] md:hidden">
        {/* Shimmer Accent Line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent" />

        <div className="mx-auto flex max-w-md items-center justify-between gap-2.5 px-3.5 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {/* WhatsApp 1-Click Quick Help */}
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ask questions on WhatsApp"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 active:scale-95 transition-all shadow-sm"
          >
            <WhatsAppMiniIcon />
          </Link>

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
            <p className="mt-0.5 inline-flex items-center gap-1 truncate text-[0.58rem] font-bold uppercase tracking-wider text-[#38bdf8]">
              <Sparkles className="h-2.5 w-2.5 shrink-0" />
              Medal + Kit Included
            </p>
          </div>

          {/* Premium Glowing CTA Button */}
          <Link
            className="neon-btn-blue group relative flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shrink-0 select-none active:scale-95 transition-transform"
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
