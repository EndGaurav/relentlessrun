"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Flame,
  Gauge,
  Timer,
  TrendingUp,
  ShieldCheck,
  Award,
  Activity,
  Zap,
} from "lucide-react";

const brandLogos = [
  { name: "Nike", label: "NIKE" },
  { name: "Puma", label: "PUMA" },
  { name: "Adidas", label: "ADIDAS" },
  { name: "Reebok", label: "REEBOK" },
];

const activityHistory = [
  { date: "4 May", dist: "10 KM", time: "26 min", cal: "247 cal" },
  { date: "3 May", dist: "12 KM", time: "30 min", cal: "290 cal" },
  { date: "2 May", dist: "6 KM", time: "22 min", cal: "200 cal" },
  { date: "1 May", dist: "15 KM", time: "40 min", cal: "350 cal" },
];

export function HomeHero() {
  return (
    <section className="relative min-h-[100dvh] sm:min-h-[92vh] w-full overflow-hidden bg-[#090d16] text-white isolate flex flex-col justify-between sm:justify-center items-center pt-20 pb-8 sm:pt-28 sm:pb-20">
      {/* ─── Animated Ken Burns Background Image ─── */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {/* Mobile Full-Height Vertical 9:16 Image */}
        <motion.img
          src="/runner-mobile.jpg"
          alt="Relentless Run Marathon"
          initial={{ scale: 1, y: 0 }}
          animate={{
            scale: [1, 1.06, 1],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 14,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="h-full w-full object-cover object-[center_35%] brightness-[0.95] contrast-[1.05] block sm:hidden will-change-transform"
        />
        {/* Desktop Widescreen 16:9 Image */}
        <motion.img
          src="/runner-hd.jpg"
          alt="Relentless Run Marathon"
          initial={{ scale: 1, x: 0, y: 0 }}
          animate={{
            scale: [1, 1.07, 1],
            x: [0, -12, 0],
            y: [0, -6, 0],
          }}
          transition={{
            duration: 16,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="h-full w-full object-cover object-center brightness-[0.95] contrast-[1.05] hidden sm:block will-change-transform"
        />
        {/* Crisp Semi-Transparent Overlay with subtle top/bottom readability gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/75 sm:bg-black/40" />
      </div>

      {/* Radiant Electric Blue Accent Orbs */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[280px] w-[320px] sm:h-[450px] sm:w-[650px] -translate-x-1/2 rounded-full bg-[#0284c7]/25 blur-[90px] sm:blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 -z-10 h-[180px] w-[180px] sm:h-[300px] sm:w-[300px] rounded-full bg-[#38bdf8]/20 blur-[80px] sm:blur-[110px]" />

      <div className="container-page relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-between sm:justify-center items-center w-full flex-1 py-3 sm:py-10">
        {/* Top Text Content (Badge + Heading + Description) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center w-full pt-1 sm:pt-0"
        >
          {/* Glass Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-sky-400/40 bg-slate-950/70 px-3 sm:px-4.5 py-1 sm:py-1.5 text-[0.62rem] sm:text-xs font-black uppercase tracking-wider text-sky-300 backdrop-blur-xl mb-2.5 sm:mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] max-w-full">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 fill-sky-400 text-sky-400 shrink-0 animate-pulse" />
            <span className="truncate">INDIA&apos;S #1 VIRTUAL RUNNING PLATFORM</span>
          </div>

          {/* Catchy Hook Line */}
          <h1 className="font-display font-black text-3xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight sm:tracking-tighter uppercase leading-[0.95] sm:leading-[0.92] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            CHASE THE
            <span className="block text-[#38bdf8] italic font-black drop-shadow-[0_0_30px_rgba(56,189,248,0.6)]">
              FINISH LINE
            </span>
          </h1>

          <p className="mt-2.5 sm:mt-6 max-w-md sm:max-w-2xl text-xs sm:text-lg text-slate-100/90 font-medium leading-relaxed px-2 sm:px-0 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            Every mile tells a story. Pick your route, record with Strava or Garmin, and earn official heavy-metal finisher medals delivered straight to your door across India.
          </p>
        </motion.div>

        {/* Clear Area in Center on Mobile to showcase runners' faces perfectly */}
        <div className="hidden sm:block sm:h-0" />

        {/* Bottom Glassmorphic CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-auto sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-5 w-full sm:w-auto px-2 sm:px-0 pb-2 sm:pb-0"
        >
          {/* Primary Glass Button */}
          <Link
            href="/events"
            className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-sky-500/85 via-blue-600/85 to-indigo-600/85 backdrop-blur-2xl px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-[0_8px_32px_rgba(2,132,199,0.4),0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.6)] border border-sky-300/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(56,189,248,0.65),inset_0_1px_2px_rgba(255,255,255,0.8)] active:scale-95"
          >
            {/* Animated Light Sweep Sheen */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            
            <span className="relative z-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Explore Challenges</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
          </Link>

          {/* Secondary Ultra-Glass Frosted Button */}
          <Link
            href="/register"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full border border-white/30 bg-slate-950/45 px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all duration-300 hover:border-sky-400/80 hover:bg-white/15 hover:shadow-[0_0_25px_rgba(56,189,248,0.35),inset_0_1px_2px_rgba(255,255,255,0.5)] active:scale-95"
          >
            <ShieldCheck className="h-4 w-4 text-sky-400 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <span className="text-slate-100 group-hover:text-white transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">GPS Verified Races</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}




