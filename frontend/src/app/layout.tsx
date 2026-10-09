import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkUserSync } from "../components/clerk-user-sync";
import { ThemeProvider } from "./components/theme-provider";
import { FloatingContact } from "./components/floating-contact";
import { Analytics } from "@vercel/analytics/next";
import { StructuredData } from "./components/structured-data";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://relentlessrun.in";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Relentless Run | India's #1 Virtual Marathon & Running Challenges",
    template: "%s | Relentless Run",
  },
  description:
    "Relentless Run is India's premier GPS-verified virtual running platform. Participate in 1.5K, 5K, 10K, and 21K virtual marathon challenges. Track with Strava, Garmin, Nike, or Google Fit, and earn authentic heavy metal finisher medals & instant verified E-certificates.",
  keywords: [
    "relentless run",
    "relentlessrun",
    "relentless run india",
    "relentless run marathon",
    "relentless running events",
    "virtual marathon india",
    "virtual running events india",
    "online running challenge india",
    "virtual 5k run india",
    "virtual 10k race india",
    "half marathon virtual 2026",
    "running events india",
    "strava virtual marathon india",
    "garmin running challenges india",
    "virtual run with medal delivery",
    "finisher metal medals india",
    "running certificates india",
    "fitness challenge india",
    "virtual race registration",
  ],
  authors: [{ name: "Relentless Run", url: SITE_URL }],
  creator: "Relentless Run",
  publisher: "Relentless Run",
  applicationName: "Relentless Run",
  category: "Sports & Fitness",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    siteName: "Relentless Run",
    title: "Relentless Run | India's #1 Virtual Marathon & Running Challenges",
    description:
      "Join Relentless Run — India's premier virtual running platform. Run anywhere with Strava/Garmin, earn authentic metal finisher medals and digital certificates.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Relentless Run - India's Premier Virtual Marathon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Relentless Run | India's #1 Virtual Marathon & Running Challenges",
    description:
      "Join Relentless Run — India's premier virtual running platform. Run anywhere with Strava/Garmin, earn authentic metal finisher medals and digital certificates.",
    images: ["/og-image.png"],
    creator: "@relentlessrun",
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0c",
};

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  process.env.CLERK_PUBLISHABLE_KEY ||
  "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external origins to reduce latency */}
        <link rel="preconnect" href="https://clerk.relentlessrun.in" />
        <link rel="preconnect" href="https://api.relentlessrun.in" />
        <link rel="dns-prefetch" href="https://clerk.relentlessrun.in" />
        <link rel="dns-prefetch" href="https://api.relentlessrun.in" />
        <StructuredData />
      </head>
      <body className="relative min-h-full flex flex-col bg-[#090d16] text-[#f0f0f0] overflow-x-hidden">
        {/* Global Runner Backdrop Image Overlay (Hardware accelerated) */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[-1] select-none overflow-hidden will-change-transform transform-gpu"
        >
          <img
            src="/runner-img.jpg"
            alt=""
            className="h-full w-full object-cover object-center opacity-20 scale-100 brightness-75 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#090d16]/80 via-[#090d16]/90 to-[#090d16]" />
        </div>

        <ThemeProvider>
          <ClerkProvider
            publishableKey={publishableKey || undefined}
            appearance={{
              variables: {
                colorPrimary: "#0d9488",
                borderRadius: "0.75rem",
              },
              elements: {
                formButtonPrimary:
                  "bg-[var(--foreground)] hover:bg-[var(--accent-hover)] shadow-none",
                footerActionLink: "text-[var(--foreground)] hover:text-[var(--muted)]",
                socialButtonsBlockButton: "border border-[var(--line)]",
              },
            }}
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
            afterSignOutUrl="/"
          >
            <ClerkUserSync />
            {children}
            <FloatingContact />
          </ClerkProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
