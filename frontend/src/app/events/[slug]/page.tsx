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
import { EventSelect } from "./event-select";
import { EventCompare } from "./event-compare";
import { EventCommunity } from "./event-community";
import { EventReviews } from "./event-reviews";
import { EventCta } from "./event-cta";
import { EventFaq } from "./faq-accordion";
import { EventStickyCta } from "./sticky-cta-bar";
import { Reveal, SectionHeader } from "./reveal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mountainrun.in";

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

export function generateStaticParams() {
  return allPublicEvents.map((event) => ({ slug: event.slug }));
}

export const dynamicParams = true;

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);
  if (!event) notFound();

  const isPast = event.status === "past";

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: event.name,
            description: event.description,
            url: `${SITE_URL}/events/${slug}`,
            startDate: event.date,
            location: { "@type": "VirtualLocation", url: `${SITE_URL}/events/${slug}` },
            organizer: { "@type": "Organization", name: "Mountain Run", url: SITE_URL },
            offers: {
              "@type": "Offer",
              price: event.price.replace(/[^\d]/g, ""),
              priceCurrency: "INR",
              availability: isPast ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
            },
            eventStatus: isPast ? "https://schema.org/EventMovedOnline" : "https://schema.org/EventScheduled",
          }),
        }}
      />

      {isPast ? (
        <>
          <EventHero event={event} isPast />
          <EventStats />
          <EventCommunity />
          <EventReviews />

          <section className="section relative overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in srgb, var(--sage) 10%, transparent) 0%, transparent 60%), var(--background)",
              }}
            />
            <div className="container-page text-center">
              <Reveal>
                <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-(--line) bg-(--panel) px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-(--muted)">
                    <Sparkles className="h-3.5 w-3.5 text-(--sage)" />
                    {event.name} - finished
                  </span>
                  <h2 className="heading text-(--foreground)">{event.name} recap</h2>
                  <p className="lede max-w-lg">{event.highlight}</p>
                  <Link className="btn btn-gold gap-2 text-sm" href="/events">
                    Join the next event
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
          <EventSelect event={event} />
          <EventStats />
          <EventWhy />
          <EventRewards />
          <EventHow event={event} />
          <EventCompare />
          <EventCommunity />
          <EventReviews />

          <section className="section border-b border-(--line)">
            <div className="container-page">
              <SectionHeader
                eyebrow="Questions"
                title={
                  <>
                    Everything you need to <span className="text-gradient-premium">know</span>
                  </>
                }
                lead="If it's not covered here, our team is one WhatsApp message away."
              />
              <div className="mt-10 sm:mt-14">
                <EventFaq />
              </div>
            </div>
          </section>

          <EventCta event={event} />
          <EventStickyCta price={event.price} compareAtPrice={event.compareAtPrice} slug={event.slug} />
        </>
      )}
    </PageShell>
  );
}