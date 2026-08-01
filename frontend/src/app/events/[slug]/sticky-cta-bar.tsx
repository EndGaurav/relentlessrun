"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, IndianRupee } from "lucide-react";

function formatPrice(price: string) {
  return price.replace(/^Rs\.\s*/, "").replace(/^₹/, "").trim();
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
  const amount = formatPrice(price);
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
      <div className="h-14 md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-(--line) bg-(--panel-glass-strong) px-4 py-2.5 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-baseline gap-1.5 text-lg font-black tracking-tight text-(--foreground)">
              <IndianRupee className="h-4 w-4 self-center text-(--sage)" />
              {amount}
              {mrp ? (
                <span className="text-xs font-medium text-(--muted-soft) line-through">
                  ₹{mrp}
                </span>
              ) : null}
            </p>
            <p className="truncate text-[0.6rem] font-semibold uppercase tracking-wider text-(--muted-soft)">
              Early bird · Limited seats
            </p>
          </div>
          <Link
            className="btn btn-primary h-11 shrink-0 gap-1.5 px-6 text-sm"
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
