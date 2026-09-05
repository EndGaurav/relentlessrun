"use client";

import { Show, useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { BrandText } from "./brand-text";
import { ThemeToggle } from "./theme-toggle";

/* ─── Nav items with icons ─── */
const publicNav = [
  ["Events",      "/events",      Calendar],
  ["Gallery",     "/gallery",     Camera  ],
  ["Leaderboard", "/leaderboard", Trophy  ],
] as const;

/* ─── Animated hamburger ─── */
function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={onClick}
      className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-(--line) bg-(--panel-soft) text-(--foreground) transition-all duration-200 hover:border-(--sage)/30 hover:bg-(--sage-soft) active:scale-90"
    >
      <span className="flex w-5 flex-col gap-[5px]">
        <motion.span
          animate={open ? { rotate: 45, y: 6.5, width: 20 } : { rotate: 0, y: 0, width: 20 }}
          className="block h-[1.5px] origin-center rounded-full bg-current"
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          className="block h-[1.5px] origin-center rounded-full bg-current"
          transition={{ duration: 0.2 }}
        />
        <motion.span
          animate={open ? { rotate: -45, y: -6.5, width: 20 } : { rotate: 0, y: 0, width: 20 }}
          className="block h-[1.5px] origin-center rounded-full bg-current"
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

/* ─── Profile dropdown ─── */
function ProfileDropdown() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const name = user?.fullName ?? user?.firstName ?? "Account";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const avatarUrl = user?.imageUrl;

  return (
    <div className="relative" ref={ref}>
      <AvatarButton onClick={() => setOpen((v) => !v)} />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 origin-top-right overflow-hidden rounded-2xl border border-(--line-strong) bg-(--panel) shadow-[0_20px_40px_-8px_rgba(0,0,0,0.12),0_8px_16px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.5)]"
          >
            <div className="h-[3px] w-full bg-linear-to-r from-(--sage) via-amber-400 to-indigo-500" />
            
            {/* Athlete Header */}
            <div className="border-b border-(--line) bg-(--panel-soft)/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="truncate text-xs font-bold text-(--foreground)">{name}</p>
                <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[0.55rem] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Athlete 🥇
                </span>
              </div>
              <p className="truncate text-[0.65rem] text-(--muted) font-mono mt-0.5">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            <div className="p-1.5 space-y-0.5">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-(--foreground) transition-all duration-200 hover:bg-(--sage-soft) hover:text-(--sage)"
              >
                <LayoutDashboard className="h-4 w-4 text-(--sage)" />
                My Runner Portal
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-(--foreground) transition-all duration-200 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400"
              >
                <Trophy className="h-4 w-4 text-amber-500" />
                Trophy Cabinet & Medals
              </Link>
              <Link
                href="/leaderboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-(--foreground) transition-all duration-200 hover:bg-(--sage-soft) hover:text-(--sage)"
              >
                <Award className="h-4 w-4 text-(--sage)" />
                Official Leaderboard
              </Link>
              <Link
                href="/events"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-(--foreground) transition-all duration-200 hover:bg-(--sage-soft) hover:text-(--sage)"
              >
                <CalendarDays className="h-4 w-4 text-(--muted)" />
                Browse Open Races
              </Link>

              <div className="my-1 border-t border-(--line)" />

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openUserProfile();
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-(--muted) transition-all duration-200 hover:bg-(--panel-soft) hover:text-(--foreground) cursor-pointer"
              >
                <Settings className="h-3.5 w-3.5" />
                Account Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void signOut(() => router.push("/"));
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-(--danger) transition-all duration-200 hover:bg-(--danger)/8 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Desktop nav link ─── */
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
          ? "text-white"
          : "text-white/70 hover:text-white"
      }`}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 -z-10 rounded-full bg-orange-500/20 border border-orange-500/40"
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
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4">
      {/* ─── Desktop floating bar ─── */}
      <div
        className={`hidden w-full max-w-7xl transition-all duration-500 ease-out md:block ${
          scrolled ? "-translate-y-0.5" : ""
        }`}
      >
        <div
          className={`overflow-hidden rounded-full border border-white/15 shadow-2xl transition-all duration-500 ease-out ${
            scrolled
              ? "bg-[#090d16]/95 backdrop-blur-2xl"
              : "bg-[#090d16]/85 backdrop-blur-xl"
          }`}
        >
          <div className="flex items-center justify-between gap-4 px-6 py-2.5">
            {/* Left — Brand */}
            <Link
              href="/"
              aria-label="Relentless Run home"
              className="group flex min-w-0 shrink-0 items-center gap-3"
            >
              <motion.img
                src="/3d-header-logo.png"
                alt="Relentless Run"
                width={240}
                height={64}
                animate={{ y: [0, -3, 0], scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                whileHover={{ scale: 1.08 }}
                className="h-14 sm:h-16 lg:h-18 max-h-18 w-auto object-contain drop-shadow-[0_4px_16px_rgba(56,189,248,0.3)]"
              />
              <span className="hidden xl:inline-flex items-center gap-1.5 rounded-md bg-sky-500/20 px-2.5 py-0.5 font-mono text-[0.6rem] font-bold text-[#f0f0f0] uppercase tracking-widest border border-sky-500/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span>LIVE RACES</span>
              </span>
            </Link>


            {/* Center — Nav pill */}
            <nav
              className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 backdrop-blur-md lg:flex"
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
              <Show when="signed-in">
                <NavLink
                  active={isActive("/dashboard")}
                  href="/dashboard"
                  label="Dashboard"
                />
              </Show>
            </nav>

            {/* Right — Actions */}
            <div className="flex items-center gap-3">
              <Show when="signed-out">
                <Link
                  className="hidden h-9 items-center rounded-full px-4 text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors hover:text-white sm:inline-flex"
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
              </Show>
              <Show when="signed-in">
                <ProfileDropdown />
              </Show>
            </div>
          </div>
        </div>
      </div>



      {/* ─── Mobile bar ─── */}
      <div className="flex w-full items-center justify-between md:hidden">
        <div className={`flex w-full items-center justify-between rounded-[1.2rem] border border-(--line-strong) px-4 py-2.5 transition-all duration-500 ${
          scrolled
            ? "bg-(--header-bg) shadow-[0_18px_40px_-28px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
            : "bg-(--header-bg)/80 backdrop-blur-xl"
        }`}>
          <Link href="/" aria-label="Relentless Run home" className="group flex min-w-0 shrink-0 items-center">
            <motion.img
              src="/3d-header-logo.png"
              alt="Relentless Run"
              width={180}
              height={48}
              animate={{ y: [0, -2, 0], scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              whileHover={{ scale: 1.06 }}
              className="h-11 sm:h-13 w-auto object-contain shrink-0 drop-shadow-[0_4px_12px_rgba(56,189,248,0.25)]"
            />
          </Link>

          <div className="flex items-center gap-1.5">
            <ThemeToggle size="sm" />
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="hidden rounded-full border border-(--line-strong) px-3 py-2 text-xs font-semibold text-(--foreground) sm:inline-flex"
              >
                Sign in
              </Link>
            </Show>
            <Show when="signed-in">
              <ProfileDropdown />
            </Show>
            <Hamburger open={open} onClick={() => setOpen((v) => !v)} />
          </div>
        </div>
      </div>

      {/* ─── Mobile overlay menu ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex items-center justify-center md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-(--overlay) backdrop-blur-md"
              onClick={() => setOpen(false)}
            />

            {/* Centered menu */}
            <motion.nav
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex w-[88vw] max-w-sm flex-col gap-2 rounded-[1.5rem] border border-(--line-strong) bg-(--panel) p-3 shadow-2xl"
            >
              <div className="rounded-[1.1rem] border border-(--line) bg-(--panel-soft)/70 px-4 py-3">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-(--sage)">
                  Mountain Run
                </p>
                <p className="mt-1 text-sm text-(--muted)">
                  Plan a run, join a race, or check your results.
                </p>
              </div>

              {publicNav.map(([label, href, Icon], i) => {
                const active = isActive(href);
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        active
                          ? "bg-(--sage-soft) text-(--sage)"
                          : "text-(--muted) hover:bg-(--sage-soft)/40 hover:text-(--foreground)"
                      }`}
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${
                        active
                          ? "bg-(--sage) text-white shadow-sm"
                          : "bg-(--panel-soft) text-(--muted-soft) group-hover:bg-(--line)"
                      }`}>
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="flex-1">{label}</span>
                      <svg className={`h-4 w-4 transition-all group-hover:translate-x-0.5 ${active ? "text-(--sage)" : "text-(--muted-soft)"}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 4 4 4-4 4" />
                      </svg>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Dashboard */}
              <Show when="signed-in">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: publicNav.length * 0.05, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mx-3 my-1.5 h-px bg-gradient-to-r from-(--line) via-(--line) to-transparent" />
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      isActive("/dashboard")
                        ? "bg-(--sage-soft) text-(--sage)"
                        : "text-(--muted) hover:bg-(--sage-soft)/40 hover:text-(--foreground)"
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${
                      isActive("/dashboard")
                        ? "bg-(--sage) text-white shadow-sm"
                        : "bg-(--panel-soft) text-(--muted-soft) group-hover:bg-(--line)"
                    }`}>
                      <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span className="flex-1">Dashboard</span>
                    <svg className={`h-4 w-4 transition-all group-hover:translate-x-0.5 ${isActive("/dashboard") ? "text-(--sage)" : "text-(--muted-soft)"}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 4 4 4-4 4" />
                    </svg>
                  </Link>
                </motion.div>
              </Show>

              {/* Sign in for signed-out */}
              <Show when="signed-out">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: publicNav.length * 0.05, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mx-3 my-1.5 h-px bg-gradient-to-r from-(--line) via-(--line) to-transparent" />
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/sign-in"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center rounded-2xl border border-(--line-strong) px-4 py-3 text-sm font-semibold text-(--foreground) transition-all duration-200 hover:bg-(--panel-soft)"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center rounded-2xl bg-(--accent) px-4 py-3 text-sm font-semibold text-(--on-accent) transition-all duration-200 hover:bg-(--accent-hover)"
                    >
                      Create account
                    </Link>
                  </div>
                </motion.div>
              </Show>

              <Show when="signed-in">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: publicNav.length * 0.05, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mx-3 my-1.5 h-px bg-gradient-to-r from-(--line) via-(--line) to-transparent" />
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-2xl bg-(--accent) px-4 py-3 text-sm font-semibold text-(--on-accent) transition-all duration-200 hover:bg-(--accent-hover)"
                  >
                    Open dashboard
                  </Link>
                </motion.div>
              </Show>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
