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
    <section className="relative py-20 bg-[#0b0f19] text-[#f0f0f0] border-t border-white/10 overflow-hidden">
      <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <HomeSectionHeader
          action={
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#f0f0f0] backdrop-blur-md transition-all hover:bg-white/[0.12] hover:border-white/40"
              href="/gallery"
            >
              <span>Explore Community Gallery</span>
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 text-[#38bdf8] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          }
          align="split"
          eyebrow="MOMENTS OF GLORY"
          title="FINISH-LINE STORIES"
          lead="Real photos and inspiring finisher moments from runners across India."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {moments.map((moment, index) => (
            <Link
              key={moment.id ?? `${moment.title}-${index}`}
              className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-[#38bdf8]/50 hover:bg-white/[0.06] hover:-translate-y-1.5"
              href="/gallery"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-black/60">
                <Image
                  alt={moment.title}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  src={ensureSvgPath(moment.image)}
                  width={400}
                  height={300}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#090d16]/90 via-transparent to-transparent pointer-events-none" />
                <span className="absolute left-3.5 bottom-3.5 z-10 rounded-full border border-white/20 bg-slate-900/80 px-3 py-1 text-[0.65rem] font-black uppercase tracking-wider text-[#38bdf8] backdrop-blur-md shadow-md">
                  {moment.meta}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display font-extrabold text-lg uppercase tracking-tight text-[#f0f0f0] transition-colors group-hover:text-[#38bdf8]">
                  {moment.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400 font-medium">{moment.meta}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

}

