import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageShell } from "../../components/app-shell";
import { allPublicEvents } from "../../data/events";
import { fetchEventBySlug } from "../../../lib/events-api";
import { EventHero } from "./event-hero";
import { EventStats } from "./event-stats";
import { EventWhy } from "./event-why";
import { EventRewards } from "./event-rewards";
import { EventHow } from "./event-how";
import { EventCompare } from "./event-compare";
import { EventCommunity } from "./event-community";
import { EventReviews } from "./event-reviews";
import { EventFaq } from "./faq-accordion";
import { EventStickyCta } from "./sticky-cta-bar";
import { Reveal, SectionHeader } from "./reveal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://relentlessrun.in";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };

  const isPast = event.status === "past";
  const metaTitle = `${event.name} - ${event.distance} Virtual Run | Mountain Run`;
  const metaDescription = isPast
    ? `View results and recap for ${event.name}. ${event.finishers ?? 0} finishers, ${event.verifiedResults ?? 0} verified GPS results from across India.`
    : `Register for ${event.name} - a ${event.distance} virtual running event. GPS verification, medals, certificates, and leaderboard. Entry: ${event.price}.`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [event.name, event.distance, "virtual run", "GPS verified", "running event", "marathon", "5K run", "10K run", "half marathon", "virtual race India"],
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `/events/${slug}`,
      type: "website",
      images: [
        {
          url: event.bannerImageUrl || "/og-image.png",
          width: 1200,
          height: 630,
          alt: event.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [event.bannerImageUrl || "/og-image.png"],
    },
    alternates: { canonical: `${SITE_URL}/events/${slug}` },
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);
  if (!event) notFound();

  const isPast = event.status === "past";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Virtual Running Events",
        item: `${SITE_URL}/events`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: event.name,
        item: `${SITE_URL}/events/${slug}`,
      },
    ],
  };

  const sportsEventSchema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: event.name,
    description: event.description || event.highlight,
    url: `${SITE_URL}/events/${slug}`,
    image: event.bannerImageUrl || `${SITE_URL}/og-image.png`,
    startDate: event.date,
    location: {
      "@type": "VirtualLocation",
      url: `${SITE_URL}/events/${slug}`,
      name: "Online / Virtual (Pan-India)",
    },
    organizer: {
      "@type": "Organization",
      name: "Mountain Run",
      url: SITE_URL,
      logo: `${SITE_URL}/logo-mark.svg`,
    },
    offers: {
      "@type": "Offer",
      price: event.price.replace(/[^\d]/g, ""),
      priceCurrency: "INR",
      url: `${SITE_URL}/events/${slug}`,
      availability: isPast ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      validFrom: "2026-01-01",
    },
    eventStatus: isPast ? "https://schema.org/EventMovedOnline" : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  };

  const eventFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do I participate in ${event.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Register on Mountain Run, choose your distance (${event.distance}), run using any GPS tracking app (Strava, Nike, Garmin), and upload your activity screenshot to claim your medal and certificate.`,
        },
      },
      {
        "@type": "Question",
        name: `When will I receive my finisher medal for ${event.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Finisher medals and performance t-shirts are dispatched to your registered postal address via tracked courier within 7-10 business days after your GPS run proof is verified.",
        },
      },
      {
        "@type": "Question",
        name: "Can I run on a treadmill or outdoors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can run outdoors with any GPS app or on a treadmill (by uploading a clear photo of the treadmill console showing total distance and elapsed time).",
        },
      },
    ],
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsEventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventFaqSchema) }}
      />

      <div className="relative min-w-0 bg-[#f8fafc]">
        {isPast ? (
          <>
            <EventHero event={event} isPast />
            <EventStats />
            <EventCommunity />
            <EventReviews />

            <section className="section relative overflow-hidden bg-[#f8fafc] text-[#090d16] border-t border-slate-200">
              <div className="container-page text-center">
                <Reveal>
                  <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-600/30 bg-sky-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0284c7] shadow-sm">
                      <Sparkles className="h-3.5 w-3.5 text-[#0284c7]" />
                      {event.name} - Finished
                    </span>
                    <h2 className="heading text-[#090d16]">{event.name} Recap</h2>
                    <p className="lede max-w-lg text-slate-600 font-medium">{event.highlight}</p>
                    <Link className="btn btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-xs font-black uppercase tracking-wider text-white shadow-xl hover:scale-105 transition-transform" href="/events">
                      Join Next Event
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </Reveal>
              </div>
            </section>
          </>
        ) : (
          <>
            <EventHero event={event} isPast={false} />
            <EventStats />
            <EventRewards />
            <EventWhy />
            <EventHow event={event} />
            <EventCompare />
            <EventCommunity />
            <EventReviews />

            <section className="section border-b border-slate-200 bg-[#f8fafc] text-[#090d16]">
              <div className="container-page">
                <SectionHeader
                  theme="light"
                  eyebrow="Questions & Answers"
                  title={
                    <>
                      Everything you need to <span className="text-[#0284c7]">know</span>
                    </>
                  }
                  lead="If it's not covered here, our athlete support team is one WhatsApp message away."
                />
                <div className="mt-10 sm:mt-14">
                  <EventFaq />
                </div>
              </div>
            </section>

            <EventStickyCta price={event.price} compareAtPrice={event.compareAtPrice} slug={event.slug} />
          </>
        )}
      </div>
    </PageShell>
  );
}
