"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { galleryMoments } from "../data/events";
import type { HomeMoment } from "../../lib/events-api";
import { HomeSectionHeader } from "./home-section-header";



function ensureSvgPath(src: string): string {
  if (!src) return "/images/sunrise-finish.svg";
  if (src.includes("sunrise-finish")) return "/images/sunrise-finish.svg";
  if (src.includes("club-push")) return "/images/club-push.svg";
  if (src.includes("first-medal")) return "/images/first-medal.svg";
  if (src.includes("weekend-long-run")) return "/images/weekend-long-run.svg";
  if (src.includes("mountain-run-hero")) return "/images/mountain-run-hero.svg";
  if (src.endsWith(".png")) return src.replace(/\.png$/, ".svg");
  return src;
}

const fallbackMoments: HomeMoment[] = galleryMoments.map((m, i) => ({
  id: `static-${i}`,
  title: m.title,
  meta: m.meta,
  image: m.image,
}));

export function HomeGalleryPreview({
  moments: initial,
}: {
  moments?: HomeMoment[];
}) {
  const moments =
    initial && initial.length > 0 ? initial : fallbackMoments;

  if (moments.length === 0) {
    return null;
  }

  return (
    <section
      className="section border-b border-(--line) relative overflow-hidden"
      style={{
        background:
          "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.03) 0px, transparent 65%), radial-gradient(at 100% 100%, rgba(13, 148, 136, 0.04) 0px, transparent 65%), var(--background)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-10 h-80 w-80 rounded-full bg-indigo-500/3 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/3 right-10 h-80 w-80 rounded-full bg-emerald-500/4 blur-3xl pointer-events-none"
      />

      <div className="container-page relative z-10">
        <HomeSectionHeader
          action={
            <Link className="btn btn-secondary group w-full sm:w-auto" href="/gallery">
              Open gallery
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          }
          align="split"
          eyebrow="Moments of glory"
          title="Finish-line stories"
        />

        <div className="mt-8 grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
          {moments.map((moment, index) => (
            <Link
              key={moment.id ?? `${moment.title}-${index}`}
              className="gallery-card group block overflow-hidden border border-(--line) rounded-(--radius) bg-(--panel) shadow-xs transition-all duration-300 hover:border-(--line-strong) hover:shadow-md"
              href="/gallery"
            >
                <div className="gallery-card-media relative aspect-4/3 overflow-hidden bg-slate-950">
                  <Image
                    alt={moment.title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    src={ensureSvgPath(moment.image)}
                    width={400}
                    height={300}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    loading="lazy"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute left-3.5 bottom-3.5 z-10 rounded-full border border-white/20 bg-(--panel-glass-strong) px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-(--foreground) backdrop-blur-md shadow-xs">
                    {moment.meta}
                  </span>
                </div>
                <div className="p-4 bg-transparent">
                  <h3 className="text-sm font-bold text-(--foreground) transition-colors duration-300 group-hover:text-(--sage)">
                    {moment.title}
                  </h3>
                  <p className="mt-1 text-xs text-(--muted-soft) font-medium">{moment.meta}</p>
                </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
