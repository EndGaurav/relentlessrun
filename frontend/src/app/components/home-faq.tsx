"use client";

import { ChevronDown, HelpCircle, MessageSquare, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type FaqItem = {
  question: string;
  answer: string;
};

const homeFaqs: FaqItem[] = [
  {
    question: "What is virtual running and how does Peak Run work?",
    answer:
      "Virtual running lets you compete anywhere on your terms. Choose an event distance (1.5K, 5K, 10K, 21K), run on your favorite route, and track with Strava or Garmin. Upload a screenshot to claim your verified metal medal and E-certificate.",
  },
  {
    question: "Which GPS apps & smartwatches are supported?",
    answer:
      "We support all major running platforms including Strava, Garmin Connect, Nike Run Club (NRC), Adidas Running, Apple Fitness, Samsung Health, Google Fit, Coros, and treadmill console photos.",
  },
  {
    question: "When & how will I receive my finisher medal?",
    answer:
      "Heavy embossed metal finisher medals and DRI-FIT t-shirts are dispatched via express tracked courier partners (Delhivery, Shiprocket) within 7-10 business days of GPS proof approval.",
  },
  {
    question: "How do I get my official E-Certificate?",
    answer:
      "Your official digital certificate is generated instantly upon verification with a unique QR code, finish time, average pace, and overall category rank.",
  },
  {
    question: "Can beginners, joggers, and walkers participate?",
    answer:
      "Absolutely! We offer accessible distances starting from 1.5K fun walks and 5K runs up to 21K half marathons. Walk, jog, or sprint at your own pace.",
  },
  {
    question: "Do you deliver finisher medals across India?",
    answer:
      "Yes, we deliver to all 19,000+ pincodes across India including metro cities, tier-2/3 towns, and remote regions.",
  },
];

export function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-16 lg:py-20 bg-[#090d16] text-[#f0f0f0] border-t border-white/10 overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-1/2 left-0 -z-10 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-[#2563eb]/10 blur-[100px]" />

      <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Side-by-side Grid Layout to reduce vertical height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* LEFT COLUMN - Sticky Header & Quick Support CTA */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <span className="inline-block rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#38bdf8]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="mt-4 font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#f0f0f0] leading-tight">
              EVERYTHING YOU NEED TO KNOW ABOUT <span className="text-[#38bdf8]">VIRTUAL RACES</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Got questions about GPS verification, metal medals, or certificate delivery? We&apos;ve got clear answers for every runner.
            </p>

            {/* Quick Contact Glass Card */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-[#38bdf8]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#f0f0f0]">Still have questions?</span>
                  <span className="block text-[0.7rem] text-slate-400">Our support team is live 24/7</span>
                </div>
              </div>
              <Link
                href="/about"
                className="shrink-0 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f0f0f0] hover:bg-[#2563eb] hover:border-[#2563eb] transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN - Compact Accordions */}
          <div className="lg:col-span-7 space-y-3">
            {homeFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-[#38bdf8]/50 bg-white/[0.06] shadow-xl shadow-blue-950/30"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display font-bold text-sm sm:text-base text-[#f0f0f0] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className={`h-4 w-4 shrink-0 transition-colors ${isOpen ? "text-[#38bdf8]" : "text-slate-400"}`} />
                      <span>{faq.question}</span>
                    </span>
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all ${
                      isOpen ? "border-[#38bdf8] bg-[#2563eb] text-white" : "border-white/15 bg-white/5 text-slate-400"
                    }`}>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-white/5">
                          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}


