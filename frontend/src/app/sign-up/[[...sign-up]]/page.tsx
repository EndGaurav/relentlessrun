"use client";

import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { ChevronRight, Medal, Route } from "lucide-react";
import { PageShell } from "../../components/app-shell";
import { useTheme } from "../../components/theme-provider";

function ThemedSignUp() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const card = document.querySelector("[class*='cl-card'], [class*='cl-internal']");
      if (card) {
        const form = card.querySelector("form");
        if (form) { form.noValidate = true; observer.disconnect(); }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <SignUp
      fallbackRedirectUrl="/dashboard"
      path="/sign-up"
      routing="path"
      signInUrl="/sign-in"
      appearance={{
        variables: {
          colorPrimary: "#38bdf8",
          colorBackground: "#0f172a",
          colorNeutral: "#94a3b8",
          borderRadius: "12px",
        },
        elements: {
          rootBox: "mx-auto w-full",
          cardBox: "w-full shadow-none",
          card: "w-full shadow-none rounded-2xl border border-white/10 bg-[#0f172a]",
          footer: "hidden",
          formButtonPrimary:
            "bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold normal-case h-11 shadow-lg shadow-blue-500/25 transition-all rounded-xl",
          formFieldInput:
            "bg-[#1e293b] border-white/10 text-zinc-100 h-10 focus:border-sky-400 rounded-xl",
          formFieldError: "text-red-400 text-xs mt-1",
          formFieldErrorText: "text-red-400",
          formFieldLabel: "text-slate-300 font-semibold text-xs tracking-wide uppercase",
          headerTitle: "text-white font-black tracking-tight",
          headerSubtitle: "text-slate-400 text-xs",
          socialButtonsBlockButton:
            "border-white/10 bg-[#1e293b] text-zinc-100 hover:bg-[#334155] h-11 font-semibold rounded-xl transition-all",
          socialButtonsBlockButtonText: "text-slate-200 font-medium",
          dividerLine: "bg-white/10",
          dividerText: "text-slate-500 text-xs",
          formFieldAction: "text-sky-400 hover:text-sky-300 font-medium text-xs",
          footerActionLink: "text-sky-400 hover:text-sky-300 font-semibold",
          formResendCodeLink: "text-sky-400 hover:text-sky-300 font-medium",
          alert: "bg-red-900/20 border-red-800/30 text-red-300 rounded-xl",
        },
      }}
    />
  );
}

export default function SignUpPage() {
  return (
    <PageShell>
      <div className="auth-classic">
      <section className="auth-classic-shell section">
        <div className="container-page grid min-h-[calc(100vh-11rem)] items-center gap-10 py-6 sm:py-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <div className="auth-classic-intro hidden lg:block">
            <p className="auth-classic-kicker">JOIN RELENTLESS RUN</p>
            <h1 className="auth-classic-title mt-5">Your finish line starts here.</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
              Pick a race, run on your own route anywhere, and turn each verified finish into premium medals, rankings, and certificates.
            </p>
            <div className="mt-9 space-y-4 border-t border-white/10 pt-7 text-sm text-slate-300">
              <p className="flex items-center gap-3"><Route className="h-4 w-4 text-sky-400" /> Run, walk or cycle anywhere, anytime</p>
              <p className="flex items-center gap-3"><Medal className="h-4 w-4 text-cyan-400" /> Official medals, leaderboard & e-certificates</p>
            </div>
          </div>

          <div className="auth-classic-form mx-auto w-full max-w-[430px]">
            <div className="text-center lg:text-left">
              <p className="auth-classic-kicker">Get started</p>
              <h1 className="auth-classic-form-title mt-3">Create your runner account</h1>
              <p className="mt-3 text-sm leading-6 text-slate-400">Sign up with Google or email. You&apos;ll land on your runner portal after.</p>
            </div>
          <div className="mt-6 w-full sm:mt-8">
            <ClerkLoading>
              <div className="w-full rounded-2xl border border-white/10 bg-[#0f172a] p-6 animate-pulse">
                <div className="h-5 w-36 rounded-full bg-slate-800" />
                <div className="mt-6 h-11 rounded-lg bg-slate-800" />
                <div className="mt-3 h-11 rounded-lg bg-slate-800" />
                <div className="mt-6 h-10 rounded-full bg-slate-700" />
              </div>
            </ClerkLoading>
            <ClerkLoaded>
              <ThemedSignUp />
            </ClerkLoaded>
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link className="inline-flex items-center gap-1 font-semibold text-sky-400 hover:text-sky-300 transition-colors" href="/sign-in">
              Sign in <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </p>
          </div>
        </div>
      </section>
      </div>
    </PageShell>
  );
}
