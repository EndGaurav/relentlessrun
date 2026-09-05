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
    <section
      className="relative min-h-[85vh] w-full overflow-hidden bg-cover bg-center bg-no-repeat pt-28 pb-20 text-[#f0f0f0] isolate flex items-center justify-center"
      style={{ backgroundImage: `url('/runner-img.jpg')` }}
    >
      {/* Deep Charcoal Navy Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#090d16]/95 via-[#090d16]/80 to-[#090d16]/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-[#090d16]/80" />

      {/* Radiant Electric Blue Glow Orbs */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#2563eb]/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 -z-10 h-[350px] w-[350px] rounded-full bg-[#0284c7]/20 blur-[110px]" />

      <div className="container-page relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center py-10">
        
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/40 bg-[#0284c7]/15 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#38bdf8] backdrop-blur-md mb-6 shadow-lg shadow-blue-950/40">
            <Zap className="h-4 w-4 fill-[#38bdf8]" />
            <span>INDIA&apos;S #1 VIRTUAL RUNNING PLATFORM</span>
          </div>

          {/* Catchy Hook Line from ChatGPT list */}
          <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter uppercase leading-[0.92] text-[#f0f0f0] drop-shadow-2xl">
            CHASE THE
            <span className="block text-[#38bdf8] italic font-black">
              FINISH LINE
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-xl text-slate-300 font-normal leading-relaxed drop-shadow-md">
            Every mile tells a story. Pick your route, record with Strava or Garmin, and earn official heavy-metal finisher medals delivered straight to your door across India.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/events"
              className="neon-btn-blue inline-flex items-center gap-3 rounded-full px-9 py-4 text-sm font-black uppercase tracking-wider text-white transition-all shadow-xl hover:scale-105"
            >
              <span>Explore Challenges</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/60 px-8 py-4 text-sm font-bold text-[#f0f0f0] backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-all shadow-lg"
            >
              <ShieldCheck className="h-4 w-4 text-[#38bdf8]" />
              <span>GPS Verified Races</span>
            </Link>
          </div>

          {/* Clean Proof Bar */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 w-full max-w-3xl">
            <div className="flex flex-col items-center">
              <span className="font-display font-black text-3xl text-[#38bdf8]">45,000+</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Active Runners</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display font-black text-3xl text-[#f0f0f0]">100%</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">GPS Verified</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display font-black text-3xl text-[#38bdf8]">19,000+</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Pincodes Delivered</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display font-black text-3xl text-[#f0f0f0]">4.9 ★</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Runner Rating</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}




