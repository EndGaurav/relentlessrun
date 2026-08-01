import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  IndianRupee,
  Trophy,
  BadgeCheck,
  Sparkles,
  ArrowRight,
  Users,
  Timer,
  Target,
  ShieldCheck,
  Route,
  CheckCircle,
  Medal,
  Shirt,
  FileBadge,
  Clock,
  MessageCircle,
  MapPinned,
  Star,
} from "lucide-react";
import { PageShell } from "../../components/app-shell";
import { Breadcrumb } from "../../components/breadcrumb";
import { allPublicEvents } from "../../data/events";
import { fetchEventBySlug } from "../../../lib/events-api";
import { auth } from "@clerk/nextjs/server";
import { EventCountdown } from "./countdown";
import { DistanceSelector } from "./distance-selector";
import { EventFaq } from "./faq-accordion";
import { EventSocialProof, type SocialProofStat } from "./event-social-proof";
import { EventStickyCta } from "./sticky-cta-bar";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mountainrun.in";
const WHATSAPP_URL = "https://wa.me/917518418960";

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

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

const trustPills = [
  { label: "GPS Verified", icon: MapPinned },
  { label: "Secure UPI", icon: ShieldCheck },
  { label: "Pan-India", icon: MapPin },
  { label: "Free Shipping", icon: Route },
];

const rewardsGrid = [
  { title: "Finisher medal", text: "A physical medal shipped after your proof is verified.", icon: Medal },
  { title: "Premium T-shirt", text: "Exclusive event T-shirt included with your kit.", icon: Shirt },
  { title: "Real certificate", text: "A genuine certificate for every verified finisher, delivered to your door.", icon: FileBadge },
  { title: "Leaderboard rank", text: "Your verified time with pacing stats on the board.", icon: Trophy },
  { title: "Verified timing", text: "Official duration verified by our team from your GPS proof.", icon: Clock },
  { title: "WhatsApp support", text: "Real humans on WhatsApp to help you at every step.", icon: MessageCircle },
];

const whyJoin = [
  { title: "Run from anywhere", text: "Park, road, treadmill or your city — no travel needed.", icon: MapPin },
  { title: "Your pace, your time", text: "Finish at any hour within the event window.", icon: Clock },
  { title: "Fair & verified", text: "Every result is checked by a real team, no bots.", icon: BadgeCheck },
  { title: "Secure payment", text: "Razorpay UPI, cards and netbanking — fully protected.", icon: ShieldCheck },
];

const testimonials = [
  {
    name: "Aarav Sharma",
    meta: "10 km finisher · Pune",
    quote: "Registration was simple and the proof upload was clear. Getting my certificate the same week felt amazing.",
  },
  {
    name: "Nisha Verma",
    meta: "5 km beginner · Mumbai",
    quote: "I liked that I could run in my own city but still feel part of an event. The medal made it truly memorable.",
  },
  {
    name: "Rohan Mehta",
    meta: "21 km finisher · Delhi",
    quote: "The leaderboard gave my long run a real target. Clean experience from payment all the way to verification.",
  },
];

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);
  if (!event) notFound();

  const { userId } = await auth();
  const isSignedIn = !!userId;
  const isPast = event.status === "past";

  const registerUrl = `/register?event=${encodeURIComponent(event.slug)}`;
  const whatsappUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(`Hi! I'm interested in ${event.name}. Can you help me with registration?`)}`;

  const socialStats: SocialProofStat[] = isPast
    ? [
        { label: "Finishers", value: event.finishers, icon: "users" },
        { label: "Verified", value: event.verifiedResults, icon: "badge" },
        { label: "Cities", value: event.cities, icon: "map" },
      ]
    : [
        { label: "Runners registered", value: event.registrations, icon: "users", live: true },
        { label: "GPS verified results", value: event.verifiedResults, icon: "badge" },
        { label: "Cities across India", value: event.cities, icon: "map" },
      ];

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

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-(--line)">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: [
              "radial-gradient(ellipse 80% 50% at 0% 0%, color-mix(in srgb, var(--sage) 12%, transparent) 0%, transparent 60%)",
              "radial-gradient(ellipse 50% 40% at 100% 100%, color-mix(in srgb, var(--sage) 6%, transparent) 0%, transparent 50%)",
              "var(--background)",
            ].join(", "),
          }}
        />
        <div aria-hidden className="pointer-events-none absolute top-8 right-8 flex gap-1.5 opacity-20">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-(--sage) animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>

        <div className="container-page py-6 sm:py-8">
          <Breadcrumb
            items={[
              { name: "Home", href: "/" },
              { name: "Events", href: "/events" },
              { name: event.name, href: `/events/${slug}` },
            ]}
          />

          {/* ─── Header (title block) ─── */}
          <div className="mt-6 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">{isPast ? "Past Event" : "Open Event"}</span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  isPast ? "bg-(--panel-soft) text-(--muted)" : "bg-(--sage-soft) text-(--sage)"
                }`}
              >
                {isPast ? <Timer className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                {isPast ? "Completed" : "Open for registration"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-(--foreground) sm:text-4xl lg:text-5xl">
              {event.name}
            </h1>

            {event.activityTypes && event.activityTypes.length > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {event.activityTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1.5 rounded-full border border-(--line) bg-(--panel-soft) px-3 py-1 text-xs font-semibold capitalize text-(--muted)"
                  >
                    {type}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
            {/* ─── Main ─── */}
            <div className="min-w-0">
              <p className="mb-6 text-sm leading-relaxed text-(--muted) max-w-2xl sm:text-base">{event.description}</p>

              {event.bannerImageUrl ? (
                <div className="relative mb-6 overflow-hidden rounded-2xl border border-(--line) bg-(--panel) shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={`${event.name} banner`}
                    className="aspect-[16/7] w-full object-cover"
                    src={event.bannerImageUrl}
                  />
                  {!isPast ? (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      <Sparkles className="h-3 w-3" />
                      Open for registration
                    </span>
                  ) : null}
                </div>
              ) : null}

              {/* ─── Info cards ─── */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {[
                  { label: "Date", value: event.date, icon: CalendarDays },
                  { label: "Distance", value: event.distance, icon: Target },
                  { label: "Entry fee", value: event.price, icon: IndianRupee },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="group relative overflow-hidden rounded-2xl border border-(--line) bg-(--panel) p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-(--sage)/30 hover:shadow-lg sm:p-5"
                  >
                    <div aria-hidden className="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-(--sage) opacity-5 transition-all duration-300 group-hover:scale-[2] group-hover:opacity-8" />
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-(--sage) to-emerald-600 text-white shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="mt-3 text-[0.55rem] font-bold uppercase tracking-widest text-(--muted-soft)">{label}</p>
                    <p className="mt-0.5 text-sm font-bold tracking-tight text-(--foreground) sm:text-base">{value}</p>
                  </div>
                ))}
              </div>

              {/* ─── Trust pills ─── */}
              {!isPast ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {trustPills.map(({ label, icon: Icon }) => (
                    <span key={label} className="trust-pill">
                      <Icon className="h-3.5 w-3.5 text-(--sage)" />
                      {label}
                    </span>
                  ))}
                </div>
              ) : null}

              {/* ─── Countdown + distance selector + CTA ─── */}
              {!isPast ? (
                <div className="mt-6 space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <EventCountdown targetDate={event.endsAt} />
                  </div>

                  <DistanceSelector slug={event.slug} distances={event.distance.split(" / ")} />

                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <Link className="btn btn-primary flex-1 gap-2 text-sm group" href={registerUrl}>
                      {isSignedIn ? "Register for this race" : "Register now — secure your spot"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      className="btn flex-1 gap-2 text-sm"
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ backgroundColor: "#25D366", color: "#fff", borderColor: "transparent" }}
                    >
                      <WhatsAppIcon />
                      Ask on WhatsApp
                    </Link>
                  </div>
                </div>
              ) : null}

              {/* ─── Coupon ─── */}
              {event.couponCode && event.showCouponOnCard && !isPast ? (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-(--sage)/20 bg-(--sage-soft) px-4 py-3.5 sm:px-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--sage) text-white">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-(--foreground)">Special coupon available</p>
                    <p className="mt-0.5 text-xs text-(--muted)">
                      Use code <code className="rounded-md bg-(--panel) px-1.5 py-0.5 font-bold tracking-wider text-(--sage)">{event.couponCode}</code> at checkout
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* ─── Sidebar ─── */}
            <aside className="order-first lg:order-none lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-2xl border border-(--line) bg-(--panel) shadow-sm">
                <div className={`h-1.5 w-full ${isPast ? "bg-(--muted-soft)" : "bg-gradient-to-r from-(--sage) to-emerald-500"}`} />

                <div className="p-5 sm:p-6">
                  {isPast ? (
                    <>
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--panel-soft) text-(--muted)">
                          <Timer className="h-4 w-4" />
                        </span>
                        <p className="text-xs font-bold uppercase tracking-wider text-(--muted-soft)">Closed</p>
                      </div>
                      <h2 className="mt-4 text-lg font-bold tracking-tight text-(--foreground)">Event completed</h2>
                      <p className="mt-2 text-sm leading-relaxed text-(--muted)">
                        Registration for this race is closed. Check out the recap above or browse upcoming events.
                      </p>
                      <div className="mt-5 space-y-2.5">
                        <Link className="btn btn-primary btn-full" href="/events">Browse open events</Link>
                        <Link className="btn btn-secondary btn-full" href="/leaderboard">View leaderboard</Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[0.55rem] font-bold uppercase tracking-widest text-(--muted-soft)">Entry fee</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-black tracking-tight text-(--foreground) sm:text-3xl">{event.price}</p>
                            {event.compareAtPrice ? (
                              <p className="text-sm font-medium text-(--muted-soft) line-through">{event.compareAtPrice}</p>
                            ) : null}
                          </div>
                          <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-(--sage-soft) px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-(--sage)">
                            <Sparkles className="h-3 w-3" />
                            Early bird pricing
                          </p>
                        </div>
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-(--sage) to-emerald-600 text-white shadow-sm">
                          <IndianRupee className="h-5 w-5" />
                        </span>
                      </div>

                      <div className="mt-4 rounded-xl border border-(--line) bg-(--panel-soft) px-3.5 py-2.5">
                        <p className="text-[0.55rem] font-bold uppercase tracking-widest text-(--muted-soft)">Registration closes in</p>
                        <div className="mt-1">
                          <EventCountdown targetDate={event.endsAt} compact />
                        </div>
                      </div>

                      {event.couponCode && event.showCouponOnCard ? (
                        <div className="mt-4 flex items-center gap-2 rounded-xl border border-(--sage)/20 bg-(--sage-soft) px-3.5 py-2.5">
                          <Sparkles className="h-4 w-4 shrink-0 text-(--sage)" />
                          <p className="text-xs text-(--muted)">
                            Use code <strong className="tracking-wider text-(--sage)">{event.couponCode}</strong>
                          </p>
                        </div>
                      ) : null}

                      <div className="mt-5 space-y-2.5">
                        <Link className="btn btn-primary btn-full gap-2 text-sm group" href={registerUrl}>
                          {isSignedIn ? "Register for this race" : "Register now"}
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Link>
                        <Link className="btn btn-secondary btn-full text-sm" href="/events">Browse other events</Link>
                      </div>

                      {event.benefits && event.benefits.length > 0 ? (
                        <div className="mt-5 border-t border-(--line) pt-4">
                          <p className="mb-3 text-[0.55rem] font-bold uppercase tracking-widest text-(--muted-soft)">Includes</p>
                          <div className="space-y-2.5">
                            {event.benefits.map((benefit) => (
                              <div key={benefit} className="flex items-center gap-2.5 text-xs text-(--muted)">
                                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-(--sage)" />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {!isSignedIn ? (
                        <div className="mt-4 rounded-xl bg-(--panel-soft) px-4 py-3 text-center text-xs text-(--muted)">
                          Already have an account? <Link href="/sign-in" className="font-semibold text-(--sage) hover:underline">Sign in</Link>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* ─── Social proof ─── */}
          <div className="mt-10">
            <EventSocialProof stats={socialStats} />
          </div>
        </div>
      </section>

      {/* ─── What you get ─── */}
      {!isPast ? (
        <section className="section border-b border-(--line)">
          <div className="container-page">
            <div className="max-w-2xl">
              <p className="eyebrow">Rewards</p>
              <h2 className="heading mt-3 text-(--foreground)">What you get</h2>
              <p className="lede mt-3">
                Every verified finisher gets a real finish record with physical rewards shipped to your door.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-3">
              {rewardsGrid.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="group flex flex-col rounded-2xl border border-(--line) bg-(--panel) p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-(--sage)/30 hover:shadow-lg sm:p-5"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-(--line) bg-(--panel-soft) text-(--sage) transition-colors duration-300 group-hover:bg-(--sage-soft)">
                      <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-4 text-sm font-bold tracking-tight text-(--foreground) transition-colors duration-300 group-hover:text-(--sage) sm:text-base">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-(--muted) sm:text-sm">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── Why join ─── */}
      {!isPast ? (
        <section className="section border-b border-(--line)">
          <div className="container-page">
            <div className="max-w-2xl">
              <p className="eyebrow">Why this event</p>
              <h2 className="heading mt-3 text-(--foreground)">Built for every kind of runner</h2>
              <p className="lede mt-3">
                No travel, no crowds, no pressure — just you, your distance, and a verified finish.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
              {whyJoin.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="group rounded-2xl border border-(--line) bg-(--panel) p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-(--sage)/30 hover:shadow-lg"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-(--sage) to-emerald-600 text-white shadow-sm">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="mt-4 text-sm font-bold text-(--foreground)">{item.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-(--muted)">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── Benefits (DB) ─── */}
      {event.benefits && event.benefits.length > 0 && !isPast ? (
        <section className="section border-b border-(--line)">
          <div className="container-page">
            <div className="max-w-2xl">
              <p className="eyebrow">Included with entry</p>
              <h2 className="heading mt-3 text-(--foreground)">Your registration includes</h2>
            </div>
            <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {event.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="group relative flex items-center gap-3.5 rounded-2xl border border-(--line) bg-(--panel) p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-(--sage)/30 hover:shadow-lg sm:p-5"
                >
                  <div aria-hidden className="absolute -left-2 -top-2 h-6 w-6 rounded-full bg-(--sage) opacity-0 transition-all duration-300 group-hover:opacity-8" />
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-(--sage) to-emerald-600 text-white shadow-sm">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-(--foreground)">{benefit}</p>
                    <p className="mt-0.5 text-xs text-(--muted-soft)">Included with your registration</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── How it works ─── */}
      {!isPast ? (
        <section className="section border-b border-(--line)">
          <div className="container-page">
            <div className="max-w-2xl">
              <p className="eyebrow">How it works</p>
              <h2 className="heading mt-3 text-(--foreground)">Three simple steps</h2>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { step: "01", title: "Register & pay", desc: "Choose your distance, enter shipping details, and complete payment via UPI.", icon: ShieldCheck },
                { step: "02", title: "Run anytime", desc: "Complete your distance anywhere during the event window. Track using any GPS app.", icon: Route },
                { step: "03", title: "Upload proof", desc: "Submit your GPS activity from your dashboard. Get verified and claim your certificate + medal.", icon: Trophy },
              ].map(({ step, title, desc, icon: Icon }) => (
                <div
                  key={step}
                  className="group relative overflow-hidden rounded-2xl border border-(--line) bg-(--panel) p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-(--sage)/30 hover:shadow-lg"
                >
                  <span aria-hidden className="absolute -top-6 -right-6 text-[4rem] font-black leading-none text-(--sage) opacity-5 transition-all duration-300 group-hover:scale-110 group-hover:opacity-10 select-none">
                    {step}
                  </span>
                  <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-(--sage) to-emerald-600 text-white shadow-sm">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="relative z-10 mt-4 text-sm font-bold text-(--foreground) transition-colors duration-300 group-hover:text-(--sage)">{title}</h3>
                  <p className="relative z-10 mt-1.5 text-xs leading-relaxed text-(--muted)">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── Past event recap ─── */}
      {isPast ? (
        <section className="section border-b border-(--line)">
          <div className="container-page">
            <div className="max-w-2xl">
              <p className="eyebrow">Event recap</p>
              <h2 className="heading mt-3 text-(--foreground)">How it went</h2>
              <p className="lede mt-3">
                {event.resultNote ?? "This race has finished. Here is a quick look at participation and rewards."}
              </p>
            </div>
            <div className="mt-8">
              <EventSocialProof stats={socialStats} />
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-(--line) bg-(--panel) px-4 py-3.5 sm:px-5 sm:py-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-(--sage-soft) text-(--sage)">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="text-sm leading-relaxed text-(--muted) italic">{event.highlight}</p>
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── Testimonials ─── */}
      {!isPast ? (
        <section className="section border-b border-(--line)">
          <div className="container-page">
            <div className="max-w-2xl">
              <p className="eyebrow">Runner reviews</p>
              <h2 className="heading mt-3 text-(--foreground)">Loved by runners across India</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">
              {testimonials.map((review) => (
                <article
                  key={review.name}
                  className="flex h-full flex-col rounded-2xl border border-(--line) bg-(--panel) p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-(--sage)/30 hover:shadow-lg sm:p-6"
                >
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-(--muted)">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3 border-t border-(--line) pt-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-indigo-500 text-xs font-bold text-white">
                      {review.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-(--foreground)">{review.name}</p>
                      <p className="truncate text-xs text-(--muted-soft)">{review.meta}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── FAQ ─── */}
      {!isPast ? (
        <section className="section border-b border-(--line)">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Questions</p>
              <h2 className="heading mt-3 text-(--foreground)">Everything you need to know</h2>
            </div>
            <div className="mt-8">
              <EventFaq />
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── Final CTA ─── */}
      {!isPast ? (
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: [
                "radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in srgb, var(--sage) 14%, transparent) 0%, transparent 60%)",
                "var(--background)",
              ].join(", "),
            }}
          />
          <div className="container-page py-12 text-center sm:py-16">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-(--line) bg-(--panel) px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-(--muted)">
                <Users className="h-3.5 w-3.5 text-(--sage)" />
                {event.name}
              </span>
              <h2 className="heading text-(--foreground)">Ready to join?</h2>
              <p className="lede max-w-lg">
                Secure your spot today — pick a distance and complete payment in under two minutes with UPI.
              </p>
              <EventCountdown targetDate={event.endsAt} />
              <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
                <Link className="btn btn-primary gap-2 text-sm group" href={registerUrl}>
                  Register now
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  className="btn gap-2 text-sm"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: "#25D366", color: "#fff", borderColor: "transparent" }}
                >
                  <WhatsAppIcon />
                  Ask a question
                </Link>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-(--muted-soft)">
                <ShieldCheck className="h-3.5 w-3.5 text-(--sage)" />
                Secure Razorpay payment · Instant confirmation
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {!isPast ? <EventStickyCta price={event.price} compareAtPrice={event.compareAtPrice} slug={event.slug} /> : null}
    </PageShell>
  );
}
