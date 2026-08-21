const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mountainrun.in';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Mountain Run',
  alternateName: 'MountainRun India',
  url: SITE_URL,
  logo: `${SITE_URL}/logo-mark.svg`,
  description: "India's premier virtual running events platform with GPS verification, UPI registration, finisher medals, and verified certificates.",
  sameAs: [
    'https://instagram.com/mountainrun',
    'https://facebook.com/mountainrun',
    'https://twitter.com/mountainrun',
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Mountain Run',
  alternateName: 'Mountain Run - Virtual Running Events',
  url: SITE_URL,
  description: 'Join virtual marathons, 5K, 10K, 21K races across India. Run anywhere, track with Strava or Garmin, earn authentic metal medals.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/events?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do virtual running events work on Mountain Run?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Register for any event, choose your distance (1.5K, 5K, 10K, 21K), run anytime during the race window using any GPS tracking app (Strava, Nike, Garmin), and upload your screenshot to receive your medal and certificate.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I submit my GPS running proof?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After finishing your run, open your runner dashboard on Mountain Run and upload a screenshot from your tracking app. Our verification team verifies your pace and timing within 24-48 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'When and how will I receive my finisher medal and certificate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your official E-Certificate is generated instantly upon proof approval. Heavy physical finisher medals and running t-shirts are dispatched to your doorstep via tracked courier within 7-10 business days.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which GPS running apps are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We support all major running apps and smartwatches including Strava, Garmin Connect, Nike Run Club, Adidas Running, Apple Fitness, Google Fit, and Samsung Health.',
      },
    },
  ],
};

export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />
    </>
  );
}
