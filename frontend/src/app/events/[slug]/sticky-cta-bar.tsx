"use client";

import { useEffect } from "react";
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
}) {
  const amount = price.toLowerCase().includes("free") ? "Free" : formatPrice(price);
  const mrp = compareAtPrice ? formatPrice(compareAtPrice) : undefined;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const floating = document.querySelector("[data-floating-contact]") as HTMLElement | null;

    if (!media.matches || !floating) return;

    const originalDisplay = floating.style.display;
    floating.style.display = "none";

    const onChange = () => {
      if (media.matches) {
        floating.style.display = "none";
      } else {
        floating.style.display = originalDisplay;
      }
    };
    media.addEventListener("change", onChange);

    return () => {
      media.removeEventListener("change", onChange);
      floating.style.display = originalDisplay;
    };
  }, []);

  return (
    <>
      <div className="h-20 md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-(--gold-line) bg-(--panel-glass-strong) px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-baseline gap-1.5 text-xl font-black tracking-tight text-(--foreground)">
              <IndianRupee className="h-4 w-4 self-center text-(--gold-deep)" />
              {amount}
              {mrp ? (
                <span className="text-xs font-medium text-(--muted-soft) line-through">{mrp}</span>
              ) : null}
            </p>
            <p className="inline-flex items-center gap-1 truncate text-[0.6rem] font-black uppercase tracking-wider text-(--gold-deep)">
              <Sparkles className="h-3 w-3" />
              Kit included - Limited slots
            </p>
          </div>
          <Link
            className="btn btn-gold btn-lg shrink-0 gap-1.5 px-6 text-sm"
            href={`/register?event=${encodeURIComponent(slug)}`}
          >
            Register now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
