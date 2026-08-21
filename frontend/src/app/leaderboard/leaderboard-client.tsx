"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Flame,
  MapPin,
  Ruler,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiUrl } from "../../lib/api";
import { cn } from "../../lib/cn";
import { publicEvents } from "../data/events";

export type LeaderboardEntry = {
  rank: number;
  runnerName: string;
  city?: string;
  state?: string;
  distance: string;
  finishTimeSeconds: number | null;
  bibNumber?: string;
  userId?: string;
  clerkId?: string | null;
  status: string;
  isPadded?: boolean;
};

export type ParticipantEntry = {
  rosterNumber: number;
  runnerName: string;
  city?: string;
  state?: string;
  distance: string;
  bibNumber: string;
  status: string;
  proofStatus: string;
  registrationStatus: string;
  registeredAt?: string;
  finishTimeSeconds?: number | null;
  userId?: string;
  clerkId?: string | null;
};

type UserReg = {
  id: string;
  distance: string;
  bibNumber: string;
  proofStatus: string;
  status: string;
  finishTimeSeconds: number | null;
};

type EventOption = {
  id?: string;
  slug: string;
  name: string;
  distances?: string[];
};

function parseKm(distStr: string): number {
  if (!distStr) return 5;
  const lower = distStr.toLowerCase().trim();
  if (lower.includes("half") || lower.includes("21.1")) return 21.0975;
  if (lower.includes("full") || (lower.includes("marathon") && !lower.includes("half"))) return 42.195;
  const match = distStr.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (match && match[1]) {
    const val = parseFloat(match[1]);
    if (!Number.isNaN(val) && val > 0) return val;
  }
  return 5;
}

function formatTime(seconds: number | null | undefined): string {
  if (seconds == null || Number.isNaN(seconds) || seconds <= 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${String(h).padStart(2, "0")}:${mm}:${ss}` : `${mm}:${ss}`;
}

function formatPace(seconds: number | null | undefined, distanceStr: string): string {
  if (seconds == null || Number.isNaN(seconds) || seconds <= 0) return "—";
  const km = parseKm(distanceStr);
  if (km <= 0) return "—";
  const paceSec = Math.round(seconds / km);
  const m = Math.floor(paceSec / 60);
  const s = Math.floor(paceSec % 60);
  return `${m}:${String(s).padStart(2, "0")} /km`;
}

function getInitials(name: string): string {
  if (!name) return "MR";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent = "sage",
}: {
  icon: typeof Trophy;
  label: string;
  value: string | number;
  accent?: "sage" | "gold" | "indigo";
}) {
  const accentColors = {
    sage: "text-(--sage) group-hover:border-(--sage)/30 group-hover:bg-(--sage)/10",
    gold: "text-amber-500 group-hover:border-amber-500/30 group-hover:bg-amber-500/10",
    indigo: "text-indigo-500 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10",
  };

  return (
    <div className="group flex flex-col items-center gap-1.5 rounded-2xl border border-(--line) bg-(--panel) px-3 py-3 text-center transition-all hover:shadow-md sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-4 sm:text-left">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-(--line) bg-(--panel-soft) transition-all sm:h-10 sm:w-10",
          accentColors[accent],
        )}
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-base font-bold tracking-tight tabular-nums text-foreground sm:text-xl">
          {value}
        </p>
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-(--muted) sm:text-xs">
          {label}
        </p>
      </div>
    </div>
  );
}

// ── Top 3 Podium Card Component ─────────────────────────────────────────────
function PodiumCard({
  entry,
  position,
  activeDistance,
}: {
  entry: LeaderboardEntry;
  position: 1 | 2 | 3;
  activeDistance: string;
}) {
  const isFirst = position === 1;

  const medalMeta = {
    1: {
      title: "1st Place",
      badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
      borderClass: "border-amber-500/40 shadow-amber-500/10",
      avatarClass: "from-amber-400 to-yellow-600 text-white ring-amber-400/40",
      crown: true,
      rankLabel: "Gold 🥇",
    },
    2: {
      title: "2nd Place",
      badgeClass: "bg-slate-400/15 text-slate-600 dark:text-slate-300 border-slate-400/30",
      borderClass: "border-slate-300 dark:border-slate-700",
      avatarClass: "from-slate-400 to-slate-600 text-white ring-slate-400/30",
      crown: false,
      rankLabel: "Silver 🥈",
    },
    3: {
      title: "3rd Place",
      badgeClass: "bg-amber-800/15 text-amber-800 dark:text-amber-300 border-amber-800/30",
      borderClass: "border-amber-700/30",
      avatarClass: "from-amber-700 to-amber-900 text-white ring-amber-700/30",
      crown: false,
      rankLabel: "Bronze 🥉",
    },
  }[position];

  return (
    <motion.div
      initial={{ opacity: 0, y: isFirst ? -8 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: position * 0.1 }}
      className={cn(
        "relative flex flex-col items-center justify-between rounded-2xl border bg-(--panel) p-4 text-center transition-all duration-300 hover:shadow-xl sm:p-5",
        medalMeta.borderClass,
        isFirst && "sm:-translate-y-2 ring-1 ring-amber-500/30 bg-linear-to-b from-amber-500/5 via-(--panel) to-(--panel)",
      )}
    >
      {/* Crown for #1 */}
      {medalMeta.crown && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-linear-to-r from-amber-500 to-yellow-400 px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-wider text-slate-950 shadow-md">
          <Crown className="h-3 w-3" /> Champion
        </div>
      )}

      {/* Header Badge */}
      <div className="mb-3 flex w-full items-center justify-between">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider",
            medalMeta.badgeClass,
          )}
        >
          {medalMeta.rankLabel}
        </span>
        {entry.bibNumber && (
          <span className="font-mono text-[0.65rem] font-medium text-(--muted)">
            {entry.bibNumber}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div className="relative my-2">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr font-bold tracking-tight shadow-md ring-4 sm:h-16 sm:w-16 sm:text-lg",
            medalMeta.avatarClass,
          )}
        >
          {getInitials(entry.runnerName)}
        </div>
        <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-(--panel) text-xs font-bold shadow border border-(--line)">
          #{position}
        </span>
      </div>

      {/* Runner Info */}
      <div className="mt-2 w-full min-w-0">
        <h3 className="truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
          {entry.runnerName}
        </h3>
        {entry.city && (
          <p className="flex items-center justify-center gap-1 text-xs text-(--muted)">
            <MapPin className="h-3 w-3 text-(--muted-soft)" />
            {entry.city}
          </p>
        )}
      </div>

      {/* Time & Pace stats */}
      <div className="mt-4 w-full rounded-xl border border-(--line) bg-(--panel-soft) p-2.5">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-(--muted)">Time</p>
            <p className="font-mono text-xs font-bold tracking-wide text-foreground sm:text-sm">
              {formatTime(entry.finishTimeSeconds)}
            </p>
          </div>
          <div className="border-l border-(--line)">
            <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-(--muted)">Pace</p>
            <p className="font-mono text-xs font-bold tracking-wide text-(--sage) sm:text-sm">
              {formatPace(entry.finishTimeSeconds, activeDistance)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function LeaderboardClient() {
  const searchParams = useSearchParams();
  const initialEventParam = searchParams.get("event") || "";
  const initialDistanceParam = searchParams.get("distance") || "";

  const reduce = useReducedMotion();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const currentClerkId = user?.id ?? null;

  const [events, setEvents] = useState<EventOption[]>(
    publicEvents.map((e) => ({
      slug: e.slug,
      name: e.name,
      distances: e.distance
        ? e.distance.split("/").map((d) => d.trim()).filter(Boolean)
        : ["1.6 km", "3 km", "5 km", "10 km", "21 km"],
    })),
  );

  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialEventParam || publicEvents[0]?.slug || "monsoon-mountain-miles",
  );
  const [selectedDistance, setSelectedDistance] = useState<string>(
    initialDistanceParam || "5 km",
  );
  const [activeTab, setActiveTab] = useState<"verified" | "participants">("verified");
  const [searchQuery, setSearchQuery] = useState("");

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [participants, setParticipants] = useState<ParticipantEntry[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<UserReg[]>([]);
  const [availableDistances, setAvailableDistances] = useState<string[]>([
    "1.6 km",
    "3 km",
    "5 km",
    "10 km",
    "21 km",
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync available distances when event changes
  const distanceOptions = useMemo(() => {
    if (availableDistances.length > 0) return availableDistances;
    const currentEv = events.find((e) => e.slug === selectedSlug);
    if (currentEv?.distances?.length) return currentEv.distances;
    return ["1.6 km", "3 km", "5 km", "10 km", "21 km"];
  }, [availableDistances, events, selectedSlug]);

  // Load list of events from backend
  const loadEvents = useCallback(async () => {
    try {
      const response = await fetch(getApiUrl("/api/events"));
      if (!response.ok) return;
      const json = await response.json();
      const list = (json.data ?? []) as Array<{
        id: string;
        slug: string;
        title: string;
        distances: string[];
      }>;
      if (list.length > 0) {
        const mapped = list.map((e) => ({
          id: e.id,
          slug: e.slug,
          name: e.title,
          distances: e.distances?.length
            ? e.distances
            : ["1.6 km", "3 km", "5 km", "10 km", "21 km"],
        }));
        setEvents(mapped);
        if (initialEventParam && mapped.some((e) => e.slug === initialEventParam)) {
          setSelectedSlug(initialEventParam);
        }
      }
    } catch {
      // Keep static fallback
    }
  }, [initialEventParam]);

  // Load leaderboard & participants data for the selected event & distance
  const loadLeaderboard = useCallback(async () => {
    if (!selectedSlug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const distQuery = selectedDistance ? `?distance=${encodeURIComponent(selectedDistance)}` : "";
      const response = await fetch(
        getApiUrl(`/api/registrations/leaderboard/${encodeURIComponent(selectedSlug)}${distQuery}`),
      );

      if (!response.ok) {
        throw new Error("Could not load leaderboard data");
      }

      const json = await response.json();
      const rankedData = (json.data ?? []) as LeaderboardEntry[];
      const rosterData = (json.participants ?? []) as ParticipantEntry[];
      const userRegs = (json.userRegistrations ?? []) as UserReg[];
      const distList = (json.meta?.availableDistances ?? []) as string[];

      setEntries(rankedData);
      setParticipants(rosterData);
      setUserRegistrations(userRegs);
      if (distList.length > 0) {
        setAvailableDistances(distList);
      }
    } catch {
      setError("Unable to load live leaderboard. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [selectedDistance, selectedSlug]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadEvents();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadEvents]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadLeaderboard();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadLeaderboard]);

  // Filtered entries based on search
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase().trim();
    return entries.filter(
      (e) =>
        e.runnerName.toLowerCase().includes(q) ||
        (e.bibNumber && e.bibNumber.toLowerCase().includes(q)) ||
        (e.city && e.city.toLowerCase().includes(q)),
    );
  }, [entries, searchQuery]);

  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return participants;
    const q = searchQuery.toLowerCase().trim();
    return participants.filter(
      (p) =>
        p.runnerName.toLowerCase().includes(q) ||
        (p.bibNumber && p.bibNumber.toLowerCase().includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q)),
    );
  }, [participants, searchQuery]);

  // Top 3 Podium Runners
  const topThree = useMemo(() => {
    return {
      first: entries[0] || null,
      second: entries[1] || null,
      third: entries[2] || null,
    };
  }, [entries]);

  // User's own entry / standing on the board
  const userStanding = useMemo(() => {
    if (!isSignedIn) return null;
    const matchingRank = entries.find(
      (e) =>
        (currentClerkId && e.clerkId === currentClerkId) ||
        (user?.fullName && e.runnerName.toLowerCase() === user.fullName.toLowerCase()),
    );
    const userRegForEvent = userRegistrations.find(
      (r) => r.distance.toLowerCase().trim() === selectedDistance.toLowerCase().trim(),
    );
    const otherDistanceReg = userRegistrations.find(
      (r) => r.distance.toLowerCase().trim() !== selectedDistance.toLowerCase().trim(),
    );

    return {
      rankedEntry: matchingRank || null,
      currentDistanceReg: userRegForEvent || null,
      otherDistanceReg: otherDistanceReg || null,
    };
  }, [currentClerkId, entries, isSignedIn, selectedDistance, user, userRegistrations]);

  // General stats
  const stats = useMemo(() => {
    const totalFin = entries.length;
    const totalPart = participants.length;
    const km = parseKm(selectedDistance);
    const totalKm = Math.round((totalFin + totalPart) * km);
    return {
      finishers: totalFin,
      participants: totalPart,
      distance: selectedDistance,
      totalKm,
    };
  }, [entries.length, participants.length, selectedDistance]);

  return (
    <div className="min-w-0 pb-16">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-(--line)">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: [
              "radial-gradient(ellipse 80% 50% at 0% 0%, color-mix(in srgb, var(--sage) 14%, transparent) 0%, transparent 60%)",
              "radial-gradient(ellipse 60% 40% at 100% 100%, color-mix(in srgb, #eab308 10%, transparent) 0%, transparent 50%)",
              "var(--background)",
            ].join(", "),
          }}
        />

        <div className="container-page py-10 sm:py-12 md:py-14">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-(--sage)/30 bg-(--sage-soft) px-3 py-1 text-xs font-bold uppercase tracking-wider text-(--sage)">
              <Sparkles className="h-3.5 w-3.5" /> Official Event Leaderboard
            </div>
            <h1 className="mt-3 text-4xl font-black leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              Verified Race Rankings
            </h1>
            <p className="lede mx-auto mt-3 max-w-lg text-sm sm:text-base">
              Explore real-time standings across all distance categories. Every finish is verified with GPS tracking.
            </p>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div
            className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <StatCard icon={Trophy} label="Ranked Finishers" value={stats.finishers} accent="gold" />
            <StatCard icon={Users} label="Total Runners" value={Math.max(stats.participants, stats.finishers)} accent="sage" />
            <StatCard icon={Ruler} label="Active Category" value={stats.distance} accent="indigo" />
            <StatCard icon={Flame} label="Total KM Run" value={`${stats.totalKm} km`} accent="sage" />
          </motion.div>
        </div>
      </section>

      {/* ── CONTROLS & FILTERS ─────────────────────────────────── */}
      <section className="section pt-6 sm:pt-8">
        <div className="container-page">
          <div className="flex flex-col gap-5">
            {/* Event Selector & Search Bar */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Event Select */}
              <div className="lg:col-span-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-(--muted) mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-(--sage)" /> Select Event
                  </span>
                </label>
                <select
                  className="input w-full font-medium"
                  value={selectedSlug}
                  onChange={(e) => {
                    setSelectedSlug(e.target.value);
                    setSearchQuery("");
                  }}
                >
                  {events.map((ev) => (
                    <option key={ev.slug} value={ev.slug}>
                      {ev.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instant Search Bar */}
              <div className="lg:col-span-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-(--muted) mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-(--sage)" /> Search Runner or Bib #
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by runner name, city, or bib (e.g. MR-5K-101)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input w-full pl-9 pr-8"
                  />
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--muted)" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-(--muted) hover:bg-(--panel-soft) hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── DISTANCE CATEGORY PILLS (1.6 km, 5 km, 10 km, 21 km) ── */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-(--muted)">
                Choose Distance Category:
              </p>
              <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
                {distanceOptions.map((dist) => {
                  const isSelected = selectedDistance.toLowerCase().trim() === dist.toLowerCase().trim();
                  return (
                    <button
                      key={dist}
                      onClick={() => {
                        setSelectedDistance(dist);
                        setSearchQuery("");
                      }}
                      className={cn(
                        "group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm cursor-pointer",
                        isSelected
                          ? "bg-(--sage) text-(--on-accent) shadow-md shadow-(--sage)/20"
                          : "border border-(--line) bg-(--panel) text-(--muted) hover:border-(--sage)/40 hover:text-foreground",
                      )}
                    >
                      <Ruler className={cn("h-3.5 w-3.5", isSelected ? "text-white" : "text-(--muted-soft) group-hover:text-(--sage)")} />
                      {dist}
                      {isSelected && (
                        <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[0.65rem] font-mono">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── DUAL TAB TOGGLE (Verified Rankings vs Participants Roster) ── */}
            <div className="mt-2 flex items-center justify-between border-b border-(--line) pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("verified")}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all sm:text-sm cursor-pointer",
                    activeTab === "verified"
                      ? "border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "text-(--muted) hover:text-foreground",
                  )}
                >
                  <Trophy className="h-4 w-4" />
                  Verified Leaderboard ({entries.length})
                </button>
                <button
                  onClick={() => setActiveTab("participants")}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all sm:text-sm cursor-pointer",
                    activeTab === "participants"
                      ? "border border-(--sage)/30 bg-(--sage-soft) text-(--sage)"
                      : "text-(--muted) hover:text-foreground",
                  )}
                >
                  <Users className="h-4 w-4" />
                  Event Roster ({participants.length})
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-(--muted)">
                <ShieldCheck className="h-4 w-4 text-(--sage)" /> GPS Timestamp Verified
              </div>
            </div>
          </div>

          {/* ── USER RECOGNITION / PERSONAL STANDING BANNER ──────── */}
          {isLoaded && isSignedIn && !loading && (
            <div className="mt-6">
              {userStanding?.rankedEntry ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black shadow">
                      #{userStanding.rankedEntry.rank}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        You are ranked <span className="text-amber-500">#{userStanding.rankedEntry.rank}</span> in {selectedDistance}!
                      </p>
                      <p className="text-xs text-(--muted)">
                        Time: <span className="font-mono font-bold text-foreground">{formatTime(userStanding.rankedEntry.finishTimeSeconds)}</span>
                        {" · "}
                        Pace: <span className="font-mono font-bold text-(--sage)">{formatPace(userStanding.rankedEntry.finishTimeSeconds, selectedDistance)}</span>
                        {userStanding.rankedEntry.bibNumber && ` · Bib: ${userStanding.rankedEntry.bibNumber}`}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="btn btn-secondary text-xs w-fit py-2 px-3 self-end sm:self-center"
                  >
                    View in Dashboard
                  </Link>
                </motion.div>
              ) : userStanding?.otherDistanceReg ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2 rounded-2xl border border-(--line) bg-(--panel-soft) p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-xs sm:text-sm text-(--muted)">
                    You are registered for <span className="font-bold text-foreground">{userStanding.otherDistanceReg.distance}</span> in this event.
                  </p>
                  <button
                    onClick={() => setSelectedDistance(userStanding.otherDistanceReg!.distance)}
                    className="text-xs font-bold text-(--sage) underline-offset-2 hover:underline w-fit cursor-pointer"
                  >
                    Switch to {userStanding.otherDistanceReg.distance} Leaderboard →
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2 rounded-2xl border border-dashed border-(--line) p-4 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-(--muted)"
                >
                  <span>
                    Want to see your name on the board? Register for this event or submit your run from Dashboard.
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/events/${selectedSlug}`} className="font-bold text-foreground hover:underline">
                      Register Now
                    </Link>
                    <span>·</span>
                    <Link href="/dashboard" className="font-bold text-(--sage) hover:underline">
                      Upload GPS Proof
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* ── LOADING STATE ────────────────────────────────────── */}
          {loading ? (
            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-(--line) bg-(--panel) py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-(--line) border-t-(--sage)" />
              <p className="mt-4 text-sm font-medium text-(--muted)">Loading {selectedDistance} rankings...</p>
            </div>
          ) : error ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
              {error}
            </div>
          ) : (
            <>
              {/* ── TAB 1: VERIFIED LEADERBOARD ─────────────────────── */}
              {activeTab === "verified" && (
                <div className="mt-8 space-y-8">
                  {/* TOP 3 PODIUM (Visible when no search active and at least 3 entries exist) */}
                  {!searchQuery && entries.length >= 3 && (
                    <div>
                      <div className="mb-4 text-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-500">
                          Podium Finishers
                        </p>
                        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                          Top 3 in {selectedDistance}
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                        {/* 2nd Place (Left) */}
                        {topThree.second && (
                          <div className="order-2 sm:order-1">
                            <PodiumCard
                              entry={topThree.second}
                              position={2}
                              activeDistance={selectedDistance}
                            />
                          </div>
                        )}

                        {/* 1st Place (Center, Elevated) */}
                        {topThree.first && (
                          <div className="order-1 sm:order-2">
                            <PodiumCard
                              entry={topThree.first}
                              position={1}
                              activeDistance={selectedDistance}
                            />
                          </div>
                        )}

                        {/* 3rd Place (Right) */}
                        {topThree.third && (
                          <div className="order-3 sm:order-3">
                            <PodiumCard
                              entry={topThree.third}
                              position={3}
                              activeDistance={selectedDistance}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* FULL RANKINGS TABLE */}
                  <div className="overflow-hidden rounded-2xl border border-(--line) bg-(--panel) shadow-sm">
                    <div className="border-b border-(--line) bg-(--panel-soft) px-4 py-3 sm:px-6 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground">
                        All Verified Finishers · {selectedDistance}
                      </h3>
                      <span className="text-xs text-(--muted) font-mono">
                        Showing {filteredEntries.length} runners
                      </span>
                    </div>

                    <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
                      <table className="w-full min-w-152 text-left text-sm">
                        <thead>
                          <tr className="border-b border-(--line) bg-(--panel-soft)/50 text-[0.65rem] font-bold uppercase tracking-wider text-(--muted)">
                            <th className="px-4 py-3.5">Rank</th>
                            <th className="px-4 py-3.5">Runner</th>
                            <th className="px-4 py-3.5">Bib #</th>
                            <th className="px-4 py-3.5">City</th>
                            <th className="px-4 py-3.5">Distance</th>
                            <th className="px-4 py-3.5">Pace</th>
                            <th className="px-4 py-3.5">Finish Time</th>
                            <th className="px-4 py-3.5">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEntries.map((row, idx) => {
                            const isYou =
                              Boolean(currentClerkId && row.clerkId === currentClerkId) ||
                              Boolean(user?.fullName && row.runnerName.toLowerCase() === user.fullName.toLowerCase());
                            const isTop3 = row.rank <= 3;

                            return (
                              <motion.tr
                                key={`${row.rank}-${row.bibNumber || row.runnerName}`}
                                initial={reduce ? false : { opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.3) }}
                                className={cn(
                                  "border-b border-(--line) last:border-b-0 transition-colors hover:bg-(--panel-soft)/70",
                                  isYou && "bg-(--sage-soft) ring-1 ring-(--sage)/40",
                                  isTop3 && "font-medium",
                                )}
                              >
                                {/* Rank */}
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                                    {row.rank === 1 ? (
                                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                        🥇
                                      </span>
                                    ) : row.rank === 2 ? (
                                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-400/20 text-slate-600 dark:text-slate-300">
                                        🥈
                                      </span>
                                    ) : row.rank === 3 ? (
                                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-800/20 text-amber-800 dark:text-amber-300">
                                        🥉
                                      </span>
                                    ) : (
                                      <span className="w-6 text-center text-(--muted)">
                                        #{row.rank}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Runner Avatar & Name */}
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center gap-2.5">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-(--line) bg-(--panel-soft) text-[0.65rem] font-bold text-foreground">
                                      {getInitials(row.runnerName)}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-foreground flex items-center gap-1.5">
                                        {row.runnerName}
                                        {isYou && (
                                          <span className="rounded-full bg-(--sage) px-1.5 py-0.2 text-[0.6rem] font-bold uppercase tracking-wider text-white">
                                            You
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                {/* Bib */}
                                <td className="px-4 py-3.5 font-mono text-xs text-(--muted)">
                                  {row.bibNumber || `MR-${parseKm(selectedDistance)}K-${100 + row.rank}`}
                                </td>

                                {/* City */}
                                <td className="px-4 py-3.5 text-xs text-(--muted)">
                                  {row.city || "India"}
                                </td>

                                {/* Distance */}
                                <td className="px-4 py-3.5 font-medium text-foreground text-xs">
                                  {row.distance || selectedDistance}
                                </td>

                                {/* Pace */}
                                <td className="px-4 py-3.5 font-mono text-xs font-semibold text-(--sage)">
                                  {formatPace(row.finishTimeSeconds, selectedDistance)}
                                </td>

                                {/* Time */}
                                <td className="px-4 py-3.5 font-mono text-xs font-bold text-foreground">
                                  {formatTime(row.finishTimeSeconds)}
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3.5">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="h-3 w-3" /> Verified
                                  </span>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {filteredEntries.length === 0 && (
                      <div className="py-12 text-center text-sm text-(--muted)">
                        No runners match &ldquo;{searchQuery}&rdquo;. Try another name or bib number.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── TAB 2: PARTICIPANTS ROSTER ─────────────────────── */}
              {activeTab === "participants" && (
                <div className="mt-8 space-y-6">
                  <div className="overflow-hidden rounded-2xl border border-(--line) bg-(--panel) shadow-sm">
                    <div className="border-b border-(--line) bg-(--panel-soft) px-4 py-3 sm:px-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">
                          Registered Event Participants · {selectedDistance}
                        </h3>
                        <p className="text-xs text-(--muted)">
                          All runners confirmed for this event. Verified times appear on the Leaderboard tab.
                        </p>
                      </div>
                      <span className="text-xs text-(--muted) font-mono">
                        {filteredParticipants.length} registered
                      </span>
                    </div>

                    <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
                      <table className="w-full min-w-152 text-left text-sm">
                        <thead>
                          <tr className="border-b border-(--line) bg-(--panel-soft)/50 text-[0.65rem] font-bold uppercase tracking-wider text-(--muted)">
                            <th className="px-4 py-3.5">#</th>
                            <th className="px-4 py-3.5">Runner Name</th>
                            <th className="px-4 py-3.5">Bib Number</th>
                            <th className="px-4 py-3.5">City</th>
                            <th className="px-4 py-3.5">Distance</th>
                            <th className="px-4 py-3.5">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredParticipants.map((p, idx) => {
                            const isYou =
                              Boolean(currentClerkId && p.clerkId === currentClerkId) ||
                              Boolean(user?.fullName && p.runnerName.toLowerCase() === user.fullName.toLowerCase());

                            return (
                              <tr
                                key={`${p.rosterNumber}-${p.bibNumber}`}
                                className={cn(
                                  "border-b border-(--line) last:border-b-0 transition-colors hover:bg-(--panel-soft)/70",
                                  isYou && "bg-(--sage-soft) ring-1 ring-(--sage)/40",
                                )}
                              >
                                <td className="px-4 py-3.5 font-mono text-xs text-(--muted)">
                                  {idx + 1}
                                </td>
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-(--line) bg-(--panel-soft) text-[0.65rem] font-bold text-foreground">
                                      {getInitials(p.runnerName)}
                                    </div>
                                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                                      {p.runnerName}
                                      {isYou && (
                                        <span className="rounded-full bg-(--sage) px-1.5 py-0.2 text-[0.6rem] font-bold uppercase tracking-wider text-white">
                                          You
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 font-mono text-xs font-bold text-foreground">
                                  {p.bibNumber}
                                </td>
                                <td className="px-4 py-3.5 text-xs text-(--muted)">
                                  {p.city || "India"}
                                </td>
                                <td className="px-4 py-3.5 text-xs font-medium text-foreground">
                                  {p.distance}
                                </td>
                                <td className="px-4 py-3.5">
                                  <span
                                    className={cn(
                                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider",
                                      p.status === "Verified Finisher"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : p.status === "Under Review"
                                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                                    )}
                                  >
                                    {p.status === "Verified Finisher" ? (
                                      <CheckCircle2 className="h-3 w-3" />
                                    ) : (
                                      <Clock className="h-3 w-3" />
                                    )}
                                    {p.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {filteredParticipants.length === 0 && (
                      <div className="py-12 text-center text-sm text-(--muted)">
                        No registered runners found for {selectedDistance}.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
