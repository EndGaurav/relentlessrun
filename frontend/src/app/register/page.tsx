import { PageShell } from "../components/app-shell";
import { PaymentRegistrationForm } from "./payment-registration-form";

export default function RegisterPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden border-b border-(--line) pt-24 sm:pt-28 md:pt-32 pb-4 sm:pb-6">
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

        <div className="container-page py-4 sm:py-6">
          <div className="mx-auto max-w-xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-sky-400">
              ⚡ 2-Minute Easy Registration
            </span>
            <h1 className="mt-3 text-3xl font-extrabold leading-[1.15] tracking-tight text-(--foreground) sm:text-4xl md:text-5xl">
              Join The Challenge
            </h1>
            <p className="lede mx-auto mt-2.5 max-w-lg text-xs sm:text-sm text-slate-400">
              Pick your event & distance, enter shipping details for your Finisher Medal & T-Shirt, and pay securely via UPI.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-6 sm:pb-8 md:pb-10">
        <div className="container-page max-w-5xl">
          <PaymentRegistrationForm />
        </div>
      </section>
    </PageShell>
  );
}
