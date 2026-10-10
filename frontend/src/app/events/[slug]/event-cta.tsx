import { ShieldCheck, Sparkles } from "lucide-react";
import type { PublicEvent } from "../../data/events";
import { RegisterCta } from "../../components/register-cta";
import { Medal3D } from "./medal";
import { EventCountdown } from "./countdown";
import { Reveal } from "./reveal";

function formatPrice(price: string) {
  return price.replace(/^Rs\.\s*/, "₹");
}

export function EventCta({ event }: { event: PublicEvent }) {
  const priceLabel = event.price.toLowerCase().includes("free")
    ? "Register Now"
    : `Register Now — ${formatPrice(event.price)}`;

  return (
    <section className="relative overflow-hidden bg-[#090d16] border-t border-white/10">
      <div className="container-page py-14 sm:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-b from-[#0e1d38] via-[#0d1322] to-[#090d16] px-6 py-12 text-center shadow-2xl sm:px-12 sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl opacity-40"
              style={{
                background:
                  "radial-gradient(circle, rgba(56,189,248,0.7) 0%, rgba(2,132,199,0.2) 50%, transparent 70%)",
              }}
            />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center">
              <div className="w-28 drop-shadow-[0_20px_30px_rgba(2,132,199,0.3)] sm:w-36">
                <Medal3D className="h-auto w-full" />
              </div>

              <h2 className="heading mt-6 text-white">This one&rsquo;s yours to conquer.</h2>
              <p className="lede mt-3 max-w-lg text-slate-300">
                {event.name} — select your target distance and finish secure UPI registration in 2 minutes.
              </p>

              {event.endsAt ? (
                <div className="mt-6 flex flex-col items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-black uppercase tracking-widest text-slate-400">
                    <Sparkles className="h-3.5 w-3.5 text-[#38bdf8]" />
                    Registration closes in
                  </span>
                  <EventCountdown targetDate={event.endsAt} />
                </div>
              ) : null}

              <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
                <RegisterCta
                  className="neon-btn-blue h-12 px-8 rounded-full text-xs font-black uppercase tracking-wider shadow-lg sm:min-w-56"
                  signedInLabel="Register Now"
                  signedOutLabel={priceLabel}
                  slug={event.slug}
                />
              </div>

              <p className="mt-6 flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-[#38bdf8]" />
                Secure 256-Bit Razorpay Payment · Instant Registration Confirmation
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
