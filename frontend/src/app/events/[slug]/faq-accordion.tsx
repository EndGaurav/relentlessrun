"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

const faqs = [
  {
    q: "Is this a physical event I need to travel for?",
    a: "No. This is a virtual athletic challenge — you run, walk or cycle anywhere you like (park, road, treadmill, or trail) during the event window. Zero travel required.",
  },
  {
    q: "How do I complete my chosen distance?",
    a: "Select your preferred distance during registration, then complete it at your own pace anytime during the event dates. Track your activity with any GPS app such as Strava, Garmin, Apple Fitness, Nike Run Club, or treadmill console.",
  },
  {
    q: "How do I submit proof of my run?",
    a: "Once finished, log in to your Relentless Run dashboard, select your event, and upload a screenshot or GPX/activity export. Our team manually reviews and verifies each submission within 24 hours.",
  },
  {
    q: "Is the race bib delivered physically or digitally?",
    a: "Your official race bib is 100% digital and available for instant download from your runner dashboard right after registration! It comes already sized for Instagram Stories and WhatsApp. Only your physical heavy metal finisher medal is shipped to your doorstep once your run proof is verified.",
  },
  {
    q: "When will I receive my medal and kit rewards?",
    a: "As soon as your run proof is verified, your official finisher medal and certificate are carefully packed and dispatched with tracked courier delivery straight to your doorstep.",
  },
  {
    q: "Is my payment safe & secure?",
    a: "Yes, 100%. All transactions are processed through Razorpay with 256-bit SSL encryption, supporting UPI (GPay, PhonePe, Paytm), credit/debit cards, and netbanking. Instant confirmation is sent via SMS and email.",
  },
  {
    q: "Can I run on a treadmill or indoors?",
    a: "Yes! You can run outdoors with GPS tracking or indoors on a treadmill. For treadmill runs, simply upload a clear photo of your treadmill console showing total distance and elapsed time.",
  },
  {
    q: "What if I need help during the event?",
    a: "Our support team is available via WhatsApp (+91 8287 491 957) and email throughout the event. We are happy to assist with registration, distance questions, or proof submissions.",
  },
];

export function EventFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((item, index) => {
        const isOpen = open === index;
        return (
          <div
            key={item.q}
            className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
              isOpen
                ? "border-[#0284c7] bg-white shadow-md ring-1 ring-[#0284c7]/30"
                : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5 sm:py-4"
            >
              <span className="flex items-center gap-3 text-sm font-semibold text-slate-900 sm:text-base">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                    isOpen ? "bg-[#0284c7] text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <MessageCircleQuestion className="h-3.5 w-3.5" />
                </span>
                {item.q}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-[#0284c7]" : "text-slate-400"
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="border-t border-slate-100 px-4 py-3.5 text-sm leading-relaxed text-slate-600 sm:px-5 sm:py-4 font-medium">
                    {item.a}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
