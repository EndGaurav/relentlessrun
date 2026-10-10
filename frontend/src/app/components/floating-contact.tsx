"use client";

import { usePathname } from "next/navigation";

const PHONE = "+918287491957";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function FloatingContact() {
  const pathname = usePathname();
  const isEventPage = pathname?.startsWith("/events/");

  // Hide on admin, athlete dashboard, and registration checkout to keep inputs unblocked
  const isExcluded =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/register");
  if (isExcluded) return null;

  return (
    <div
      data-floating-contact="true"
      className={`fixed z-50 flex items-center transition-all duration-300 right-4 sm:right-6 ${
        isEventPage ? "bottom-24 sm:bottom-6" : "bottom-5 sm:bottom-6"
      }`}
    >
      <a
        href={`tel:${PHONE}`}
        aria-label="Call athlete support"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-(--sage) text-white shadow-lg shadow-(--sage)/30 transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-(--sage)/40 active:scale-95 sm:h-13 sm:w-13"
      >
        <PhoneIcon />
      </a>
    </div>
  );
}
