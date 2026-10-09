"use client";

import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  LayoutDashboard,
  Settings,
  LogOut,
  CalendarDays,
  Trophy,
  Calendar,
  Award,
  User,
  Zap,
  X,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { BrandText } from "./brand-text";
import { ThemeToggle } from "./theme-toggle";

/* ─── Nav items with icons ─── */
const publicNav = [
  ["Events",      "/events",      Calendar],
  ["Gallery",     "/gallery",     Camera  ],
  ["Leaderboard", "/leaderboard", Trophy  ],
] as const;

/* ─── Animated hamburger button ─── */
function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={onClick}
      className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-white/20 bg-slate-900/80 text-white backdrop-blur-xl shadow-lg transition-all duration-200 hover:border-sky-400/50 hover:bg-slate-800/90 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)] active:scale-90"
    >
      <span className="flex w-5 flex-col gap-[5px]">
        <motion.span
          animate={open ? { rotate: 45, y: 7, width: 20 } : { rotate: 0, y: 0, width: 20 }}
          className="block h-[2px] origin-center rounded-full bg-current"
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          className="block h-[2px] origin-center rounded-full bg-current"
          transition={{ duration: 0.2 }}
        />
        <motion.span
          animate={open ? { rotate: -45, y: -7, width: 20 } : { rotate: 0, y: 0, width: 20 }}
          className="block h-[2px] origin-center rounded-full bg-current"
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
      </span>
    </button>
  );
}

/* ─── Avatar with gradient ring ─── */
function AvatarButton({ onClick }: { onClick: () => void }) {
  const { user } = useUser();
  if (!user) return null;
  const name = user.fullName ?? user.firstName ?? "Account";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const avatarUrl = user.imageUrl;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open profile menu"
      className="group relative cursor-pointer rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--sage)/40"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-(--line) transition-all duration-300 group-hover:ring-(--sage)/50 group-hover:scale-105 sm:h-9 sm:w-9"
        />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-indigo-500 text-[0.6rem] font-bold text-white ring-2 ring-(--line) transition-all duration-300 group-hover:ring-(--sage)/50 group-hover:scale-105 sm:h-9 sm:w-9">
          {initials}
        </span>
      )}
      {/* Online indicator */}
      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-(--panel) bg-emerald-500" />
    </button>
  );
}

/* ─── Profile dropdown trigger as Dashboard Pill ─── */
function DashboardProfileDropdown({ isMobile = false }: { isMobile?: boolean }) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isActive = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  if (!user) return null;
  const name = user.fullName ?? user.firstName ?? "Account";
  const firstLetter = (
    user.firstName ||
    user.fullName ||
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    "A"
  )
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      {isMobile ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open athlete profile menu"
          aria-expanded={open}
          className={`relative flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-full border border-emerald-400/50 bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/25 transition-all duration-200 hover:scale-105 active:scale-95 ${
            isActive ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#090d16]" : ""
          }`}
        >
          <span className="text-sm font-black uppercase text-white font-sans leading-none">
            {firstLetter}
          </span>
          {/* Active status indicator dot */}
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#090d16] bg-emerald-400" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open dashboard and profile menu"
          aria-expanded={open}
          className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#090d16]/85 backdrop-blur-xl px-4 py-1.5 sm:px-4.5 sm:py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xl cursor-pointer active:scale-95 transition-all duration-200 hover:border-white/30 hover:bg-[#090d16] hover:text-white ${
            isActive
              ? "border-sky-400/50 bg-sky-500/20 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
              : ""
          }`}
        >
          <User className="h-3.5 w-3.5 text-white/90" />
          <span>Dashboard</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/60 text-[0.65rem] leading-none"
          >
            ▾
          </motion.span>
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 origin-top-right overflow-hidden rounded-2xl border border-white/20 bg-slate-950/60 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_20px_50px_rgba(0,0,0,0.7),0_0_20px_rgba(56,189,248,0.15)]"
          >
            <div className="h-[2px] w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />
            
            {/* Athlete Header */}
            <div className="border-b border-white/10 bg-white/[0.06] p-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <p className="truncate text-xs font-black uppercase tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{name}</p>
                <span className="rounded-full bg-sky-500/25 border border-sky-400/40 px-1.5 py-0.5 text-[0.55rem] font-black uppercase tracking-wider text-sky-300">
                  Athlete ⚡
                </span>
              </div>
              <p className="truncate text-[0.65rem] text-slate-300 font-medium mt-0.5">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            <div className="p-2 space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl border border-transparent bg-white/[0.04] px-3 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/15 hover:text-sky-300"
              >
                <LayoutDashboard className="h-4 w-4 text-sky-400" />
                Athlete Dashboard
              </Link>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openUserProfile();
                }}
                className="flex w-full items-center gap-2.5 rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                Account Settings
              </button>

              <div className="my-1 border-t border-white/10" />

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void signOut(() => router.push("/"));
                }}
                className="flex w-full items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/15 px-3 py-2 text-xs font-black uppercase tracking-wider text-rose-200 transition-all duration-200 hover:bg-rose-500/25 hover:border-rose-400/60 hover:text-white cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-300" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
        active
          ? "text-white font-extrabold"
          : "text-white/70 hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-sky-500/30 via-sky-400/25 to-blue-600/30 border border-sky-400/50 shadow-[0_0_16px_rgba(56,189,248,0.35)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </Link>
  );
}


/* ─── Main header ─── */
export function AppHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scrolling completely on mobile and desktop when menu is open
  useEffect(() => {
    if (!open) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.touchAction = prevBodyTouchAction;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const isHome = pathname === "/";
  const showDarkHeader = scrolled || !isHome;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out ${
        showDarkHeader
          ? "bg-[#090d16]/92 backdrop-blur-3xl border-b border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.85),inset_0_-1px_0_rgba(255,255,255,0.06)] py-2 sm:py-2.5 px-3 sm:px-6 lg:px-8"
          : "bg-transparent border-b border-transparent py-3 sm:pt-4 px-3 sm:px-6 lg:px-8"
      }`}
    >
      {/* ─── Desktop bar ─── */}
      <div className="hidden w-full max-w-7xl mx-auto md:block">
        <div>
          <div className="relative flex h-12 items-center justify-between gap-4 px-2 sm:h-13">
            {/* Left — Brand */}
            <Link
              href="/"
              aria-label="Relentless Run home"
              className="group relative flex min-w-0 shrink-0 items-center gap-3"
            >
              <img
                src="/3d-header-logo.png"
                alt="Relentless Run"
                width={160}
                height={40}
                className="h-7 sm:h-7.5 lg:h-8 w-auto object-contain drop-shadow-[0_4px_16px_rgba(56,189,248,0.35)] transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Center — Nav pill strictly mathematically centered to screen */}
            <nav
              className="hidden items-center gap-1 rounded-full border border-white/15 bg-[#090d16]/90 backdrop-blur-xl px-3.5 py-1.5 shadow-2xl lg:flex absolute left-1/2 -translate-x-1/2 z-10"
              aria-label="Main navigation"
            >
              {publicNav.map(([label, href]) => (
                <NavLink
                  key={href}
                  active={isActive(href)}
                  href={href}
                  label={label}
                />
              ))}
            </nav>

            {/* Right — Actions cleanly on the right */}
            <div className="flex items-center gap-3 shrink-0 ml-auto z-10">
              {isLoaded && !isSignedIn && (
                <>
                  <Link
                    className="hidden h-9 items-center rounded-full border border-white/15 bg-[#090d16]/90 backdrop-blur-xl px-4 text-xs font-bold uppercase tracking-wider text-slate-200 transition-all hover:text-white hover:border-white/30 shadow-md sm:inline-flex"
                    href="/sign-in"
                  >
                    Sign in
                  </Link>
                  <Link
                    className="neon-btn-blue hidden h-9 items-center rounded-full px-5 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 sm:inline-flex"
                    href="/register"
                  >
                    Register Now
                  </Link>
                </>
              )}
              {isLoaded && isSignedIn && (
                <DashboardProfileDropdown />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile bar ─── */}
      <div className="flex w-full items-center justify-between md:hidden">
        <div className="flex h-12 w-full items-center justify-between pl-0.5 pr-1 py-1">
          <Link href="/" aria-label="Relentless Run home" className="group flex min-w-0 shrink-0 items-center">
            <img
              src="/3d-header-logo.png"
              alt="Relentless Run"
              width={120}
              height={30}
              className="h-5.5 sm:h-6.5 w-auto object-contain shrink-0 drop-shadow-[0_3px_10px_rgba(56,189,248,0.25)] transition-transform duration-300 active:scale-95"
            />
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isLoaded && isSignedIn && (
              <DashboardProfileDropdown isMobile />
            )}
            <Hamburger open={open} onClick={() => setOpen((v) => !v)} />
          </div>
        </div>
      </div>
    </header>

    {/* ─── Minimalist Mobile Navigation Overlay (Portaled to document.body) ─── */}
    {mounted && typeof document !== "undefined" && createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] md:hidden flex flex-col h-[100dvh] w-full bg-[#fbfaf8] text-[#1a1a1a] select-none overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Top Bar: Brand Logo + Circular Close Button */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 shrink-0">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                <img
                  src="/3d-header-logo.png"
                  alt="Relentless Run"
                  width={140}
                  height={32}
                  className="h-7 w-auto object-contain"
                />
              </Link>

              {/* Circular Soft Gray Close Button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors active:scale-90 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col justify-between px-6 py-4">
              <div className="space-y-6">
                {/* User Card (If Signed In) */}
                {isLoaded && isSignedIn && user && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-3.5 rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-white font-extrabold text-lg shadow-sm">
                      {(user.firstName || user.fullName || "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-extrabold uppercase tracking-wide text-slate-900">
                          {user.fullName || user.firstName || "Athlete"}
                        </p>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-100 px-2 py-0.5 text-[0.6rem] font-black uppercase text-sky-700 border border-sky-200">
                          PRO <span className="text-amber-500 text-[0.65rem]">⚡</span>
                        </span>
                      </div>
                      <p className="truncate text-xs font-medium text-slate-500 mt-0.5">
                        {user.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Menu Navigation Title */}
                <div>
                  <p className="text-[0.7rem] font-extrabold tracking-widest text-slate-400 uppercase mb-3 px-1">
                    MENU NAVIGATION
                  </p>

                  {/* Navigation Links Stack */}
                  <div className="space-y-2.5">
                    {[
                      {
                        label: "EVENTS",
                        href: "/events",
                        icon: Calendar,
                        badge: "ACTIVE RACES",
                      },
                      {
                        label: "GALLERY",
                        href: "/gallery",
                        icon: Camera,
                      },
                      {
                        label: "LEADERBOARD",
                        href: "/leaderboard",
                        icon: Trophy,
                      },
                      {
                        label: "ATHLETE DASHBOARD",
                        href: "/dashboard",
                        icon: LayoutDashboard,
                      },
                    ].map((item, idx) => {
                      const active = isActive(item.href);
                      const Icon = item.icon;

                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: idx * 0.04 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center justify-between rounded-2xl p-4 transition-all duration-200 active:scale-[0.98] border ${
                              active
                                ? "bg-white border-sky-300 text-sky-600 shadow-[0_4px_16px_rgba(2,132,199,0.08)]"
                                : "bg-white/80 hover:bg-white border-slate-200/70 text-slate-800 shadow-sm"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                                  active
                                    ? "bg-sky-500 text-white"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                <Icon className="h-4.5 w-4.5" />
                              </div>
                              <span className="text-sm font-black tracking-wider uppercase">
                                {item.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-wide text-emerald-700 border border-emerald-200">
                                  {item.badge}
                                </span>
                              )}
                              <ArrowRight className={`h-4 w-4 ${active ? "text-sky-500" : "text-slate-400"}`} />
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Footer: Sign Out / Sign In & Copyright */}
              <div className="pt-6 pb-2 space-y-3 text-center">
                {isLoaded && isSignedIn ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      void signOut(() => router.push("/"));
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/80 py-3.5 text-xs font-black uppercase tracking-wider text-rose-600 transition-all duration-200 hover:bg-rose-100 active:scale-[0.98] cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" />
                    SIGN OUT
                  </button>
                ) : (
                  <div className="flex gap-2.5">
                    <Link
                      href="/sign-in"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-2xl border border-slate-200 bg-white py-3.5 text-xs font-black uppercase tracking-wider text-slate-800 text-center shadow-sm active:scale-[0.98]"
                    >
                      SIGN IN
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-2xl bg-sky-600 py-3.5 text-xs font-black uppercase tracking-wider text-white text-center shadow-md active:scale-[0.98]"
                    >
                      REGISTER
                    </Link>
                  </div>
                )}

                <p className="text-[0.65rem] font-medium text-slate-400">
                  Relentless Run © 2026 • Virtual Marathon Platform
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
  </>
  );
}
