"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { type ReactNode, useRef } from "react";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
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
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const inner = (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="heading mt-3 text-(--foreground) sm:mt-4">{title}</h2>
      {lead ? <p className="lede mx-auto mt-3 max-w-2xl sm:mt-4">{lead}</p> : null}
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
