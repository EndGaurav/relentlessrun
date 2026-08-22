"use client";

import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { HomeSectionHeader } from "./home-section-header";

type FaqItem = {
  question: string;
  answer: string;
};

const homeFaqs: FaqItem[] = [
  {
    question: "What is virtual running and how does Mountain Run work in India?",
    answer:
      "Virtual running gives you the freedom to run on your own terms. Choose an event, pick your distance (1.5K, 5K, 10K, 21K), and run anytime during the event window. Track your activity with any GPS app (Strava, Garmin, Nike Run Club, Apple Watch, Google Fit) and upload a screenshot to your runner dashboard. Once verified by our arbiters, your official E-Certificate is unlocked instantly and your custom metal finisher medal is dispatched to your doorstep.",
  },
  {
    question: "Which GPS tracking apps and smartwatches are supported?",
    answer:
      "We support all major running platforms including Strava, Garmin Connect, Nike Run Club (NRC), Adidas Running, Apple Fitness, Samsung Health, Google Fit, Coros, and Suunto. Both outdoor GPS runs and treadmill console photos (showing distance and elapsed time) are fully supported.",
  },
  {
    question: "When and how will I receive my finisher medal and running kit?",
    answer:
      "Heavy embossed metal finisher medals, DRI-FIT running t-shirts, and physical race kits are dispatched via express tracked courier partners (Delhivery, Shiprocket, India Post) within 7-10 business days of GPS proof approval. You will receive live tracking updates directly in your dashboard.",
  },
  {
    question: "How do I get and verify my official E-Certificate?",
    answer:
      "Your official digital certificate is generated instantly upon verification. It comes with a unique verifiable QR code, finish time, average pace, overall category rank, and can be downloaded as a high-resolution PDF to share on social media or LinkedIn.",
  },
  {
    question: "Can beginners, joggers, and walkers participate?",
    answer:
      "Absolutely! Mountain Run is designed for all fitness levels. We offer accessible distances starting from 1.5K fun walks and 5K runs up to 10K and 21K half marathons. Walk, jog, or sprint at your own pace.",
  },
  {
    question: "Do you deliver finisher medals to all cities and pincodes in India?",
    answer:
      "Yes, we deliver to all 19,000+ pincodes across India—covering metros like Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, as well as tier-2, tier-3 cities and remote mountain regions.",
  },
];

export function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section border-b border-(--line) bg-(--panel)">
      <div className="container-page">
        <HomeSectionHeader
          align="left"
          eyebrow="Frequently Asked Questions"
          title="Everything you need to know about virtual races"
          lead="Got questions about GPS verification, medals, or certificate delivery? We've got answers."
        />

        <div className="mx-auto mt-8 max-w-3xl space-y-3 sm:mt-12 sm:space-y-4">
          {homeFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-(--line) bg-(--panel-soft) transition-colors hover:border-(--line-strong)"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left font-bold text-sm text-(--foreground) sm:p-5 sm:text-base"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 shrink-0 text-(--sage)" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-(--muted) transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-(--sage)" : ""
                    }`}
                  />
                </button>

                {isOpen ? (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                    <p className="text-xs leading-relaxed text-(--muted) sm:text-sm sm:leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
