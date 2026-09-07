"use client";

import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
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
  User,
  Zap,
  X,
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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open dashboard and profile menu"
        aria-expanded={open}
        className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#090d16]/85 backdrop-blur-xl transition-all duration-200 hover:border-white/30 hover:bg-[#090d16] hover:text-white shadow-xl cursor-pointer active:scale-95 ${
          isMobile
            ? "px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-white"
            : "px-4 py-1.5 sm:px-4.5 sm:py-2 text-xs font-bold uppercase tracking-wider text-white"
        } ${
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
  const pathname = usePathname();
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-[#090d16]/92 backdrop-blur-3xl border-b border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.85),inset_0_-1px_0_rgba(255,255,255,0.06)] py-2 sm:py-2.5 px-4 sm:px-6 lg:px-8"
          : "bg-transparent border-b border-transparent py-3 sm:pt-4 px-4 sm:px-6 lg:px-8"
      }`}
    >
      {/* ─── Desktop bar ─── */}
      <div className="hidden w-full max-w-7xl mx-auto md:block">
        <div>
          <div className="flex h-12 items-center justify-between gap-4 px-2 sm:h-13">
            {/* Left — Brand */}
            <Link
              href="/"
              aria-label="Relentless Run home"
              className="group relative flex min-w-0 shrink-0 items-center gap-3"
            >
              <div className="relative flex items-center rounded-2xl bg-[#0d1322] p-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.7)] border border-white/10 transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(56,189,248,0.3)]">
                <motion.img
                  src="/3d-header-logo.png"
                  alt="Relentless Run"
                  width={200}
                  height={52}
                  animate={{ y: [0, -2, 0], scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05 }}
                  className="h-10 sm:h-11 lg:h-12 w-auto rounded-lg object-contain drop-shadow-[0_4px_16px_rgba(56,189,248,0.4)]"
                />
              </div>
            </Link>

            {/* Center — Nav pill strictly */}
            <nav
              className="hidden items-center gap-1 rounded-full border border-white/15 bg-[#090d16]/90 backdrop-blur-xl px-3 py-1.5 shadow-2xl lg:flex"
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

            {/* Right — Actions */}
            <div className="flex items-center gap-3">
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
        <div className="flex h-12 w-full items-center justify-between px-2 py-1">
          <Link href="/" aria-label="Relentless Run home" className="group flex min-w-0 shrink-0 items-center">
            <div className="rounded-xl bg-[#0d1322] p-1 border border-white/10 shadow-md">
              <motion.img
                src="/3d-header-logo.png"
                alt="Relentless Run"
                width={160}
                height={42}
                animate={{ y: [0, -2, 0], scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                whileHover={{ scale: 1.06 }}
                className="h-8 sm:h-9 w-auto object-contain shrink-0 drop-shadow-[0_4px_12px_rgba(56,189,248,0.25)]"
              />
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {isLoaded && isSignedIn && (
              <DashboardProfileDropdown isMobile />
            )}
            <Hamburger open={open} onClick={() => setOpen((v) => !v)} />
          </div>
        </div>
      </div>

      {/* ─── Ultra-Sleek Frosted Glass Mobile Drawer Menu ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:hidden pointer-events-auto"
          >
            {/* Crystalline Blurred Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/45 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />

            {/* Glowing Accent Orb behind glass */}
            <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-sky-500/25 blur-[100px]" />

            {/* Frosted Liquid Glass Menu Card */}
            <motion.nav
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex w-full max-w-sm flex-col overflow-hidden rounded-[28px] border border-white/25 bg-slate-950/50 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_25px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(56,189,248,0.2)] text-white"
            >
              {/* Top Glass Neon Horizon Line */}
              <div className="h-1 w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 opacity-90" />

              <div className="p-5 space-y-4">
                {/* Brand / Athlete Profile Glass Card */}
                {isLoaded && isSignedIn && user ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/[0.08] p-3.5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.fullName ?? "Athlete"}
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-sky-400/60 shadow-lg"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500 to-blue-700 text-sm font-black text-white ring-2 ring-sky-400/60 shadow-lg">
                        {(user.fullName ?? user.firstName ?? "A").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-xs font-black uppercase tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          {user.fullName ?? user.firstName ?? "Athlete"}
                        </p>
                        <span className="rounded-full bg-sky-500/25 border border-sky-400/50 px-2 py-0.5 text-[0.55rem] font-black uppercase tracking-wider text-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.4)]">
                          ACTIVE ⚡
                        </span>
                      </div>
                      <p className="truncate text-[0.7rem] text-slate-300 font-medium mt-0.5">
                        {user.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/[0.08] p-3.5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[0.68rem] font-black uppercase tracking-widest text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
                        <Zap className="h-3.5 w-3.5 fill-sky-400 text-sky-400" />
                        <span>Relentless Run India</span>
                      </div>
                      <p className="mt-1 text-[0.72rem] text-slate-200 font-medium">
                        Official GPS Races & Finisher Medals
                      </p>
                    </div>
                  </div>
                )}

                {/* Frosted Nav Items */}
                <div className="space-y-2">
                  {publicNav.map(([label, href, Icon]) => {
                    const active = isActive(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-xs font-extrabold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
                          active
                            ? "bg-gradient-to-r from-sky-500/35 via-blue-600/30 to-sky-500/15 border border-sky-400/70 text-white shadow-[0_0_20px_rgba(56,189,248,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-xl"
                            : "border border-white/10 bg-white/[0.06] text-slate-200 hover:bg-white/[0.12] hover:text-white hover:border-white/25 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                            active
                              ? "bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                              : "bg-white/[0.08] text-sky-400 border border-white/10 group-hover:bg-white/15 group-hover:text-white"
                          }`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2.2} />
                        </span>
                        <span className="flex-1 font-bold">{label}</span>
                        <svg
                          className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 ${
                            active ? "text-sky-400" : "text-slate-400 group-hover:text-white"
                          }`}
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 4 4 4-4 4" />
                        </svg>
                      </Link>
                    );
                  })}

                  {/* Dashboard Link (if signed in) */}
                  {isLoaded && isSignedIn && (
                    <>
                      <div className="my-2 h-px bg-white/15" />
                      <Link
                        href="/dashboard"
                        onClick={() => setOpen(false)}
                        className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-xs font-extrabold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
                          isActive("/dashboard")
                            ? "bg-gradient-to-r from-sky-500/35 via-blue-600/30 to-sky-500/15 border border-sky-400/70 text-white shadow-[0_0_20px_rgba(56,189,248,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-xl"
                            : "border border-white/10 bg-white/[0.06] text-slate-200 hover:bg-white/[0.12] hover:text-white hover:border-white/25 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                            isActive("/dashboard")
                              ? "bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                              : "bg-white/[0.08] text-sky-400 border border-white/10 group-hover:bg-white/15 group-hover:text-white"
                          }`}
                        >
                          <LayoutDashboard className="h-4 w-4" strokeWidth={2.2} />
                        </span>
                        <span className="flex-1 font-bold">Athlete Dashboard</span>
                        <svg
                          className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 4 4 4-4 4" />
                        </svg>
                      </Link>
                    </>
                  )}
                </div>

                {/* Actions Footer */}
                {isLoaded && isSignedIn ? (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        void signOut(() => router.push("/"));
                      }}
                      className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/20 px-4 py-3 text-xs font-black uppercase tracking-wider text-rose-200 backdrop-blur-xl transition-all duration-200 hover:bg-rose-500/30 hover:border-rose-400/70 hover:text-white active:scale-[0.98] cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    >
                      <LogOut className="h-4 w-4 text-rose-300 transition-transform group-hover:-translate-x-0.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <Link
                      href="/sign-in"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center rounded-2xl border border-white/20 bg-white/[0.08] px-4 py-3 text-xs font-black uppercase tracking-wider text-white backdrop-blur-xl transition-all hover:bg-white/20 active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="neon-btn-blue flex items-center justify-center rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg active:scale-95"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
