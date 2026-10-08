"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { type ReactNode, useRef } from "react";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 1, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "center",
  theme = "dark",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  align?: "center" | "left";
  theme?: "dark" | "light";
  className?: string;
}) {
  const isLight = theme === "light";
  const inner = (
    <>
      <p className={`text-xs font-black uppercase tracking-[0.2em] ${isLight ? "text-[#0284c7]" : "text-[#38bdf8]"}`}>
        {eyebrow}
      </p>
      <h2 className={`heading mt-3 sm:mt-4 font-bold tracking-tight ${isLight ? "text-[#090d16]" : "text-white"}`}>
        {title}
      </h2>
      {lead ? (
        <p className={`lede mx-auto mt-3 max-w-2xl font-medium sm:mt-4 ${isLight ? "text-slate-600" : "text-slate-300"}`}>
          {lead}
        </p>
      ) : null}
    </>
  );

  return (
    <Reveal
      className={
        align === "center"
          ? `mx-auto max-w-3xl text-center ${className ?? ""}`
          : `max-w-3xl ${className ?? ""}`
      }
    >
      {inner}
    </Reveal>
  );
}
