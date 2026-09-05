"use client";

import type { ReactNode } from "react";

export function HomeSectionHeader({
  eyebrow,
  title,
  lead,
  action,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  action?: ReactNode;
  align?: "left" | "split";
}) {
  if (align === "split") {
    return (
      <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between mb-8">
        <div className="min-w-0">
          <span className="inline-block rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#38bdf8]">
            {eyebrow}
          </span>
          <h2 className="mt-3 font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#f0f0f0]">
            {title}
          </h2>
          {lead ? (
            <p className="mt-3 text-base text-slate-300 max-w-xl">{lead}</p>
          ) : null}
        </div>
        {action ? (
          <div className="w-full shrink-0 sm:w-auto">{action}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <span className="inline-block rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#38bdf8]">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#f0f0f0]">
        {title}
      </h2>
      {lead ? (
        <p className="mt-3 text-base text-slate-300 max-w-2xl">{lead}</p>
      ) : null}
    </div>
  );
}


