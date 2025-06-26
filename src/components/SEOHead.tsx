import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  schemaData?: any;
  noIndex?: boolean;
}

export default function SEOHead({
  title = 'Divly - Smart Dividend Portfolio Tracker',
  description = 'Professional dividend portfolio tracking and analysis platform with AI-powered insights, real-time analytics, and comprehensive investment tools.',
  keywords = [
    'dividend tracker',
    'portfolio management',
    'dividend investing',
    'stock analysis',
    'investment portfolio',
    'dividend income',
    'financial planning',
    'investment tracker',
    'dividend calculator',
    'portfolio analytics'
  ],
  canonicalUrl,
  ogImage = '/og-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  author = 'Divly Team',
  publishedTime,
  modifiedTime,
  schemaData,
  noIndex = false
}: SEOHeadProps) {
  const fullTitle = title.includes('Divly') ? title : `${title} | Divly`;
  const keywordsString = keywords.join(', ');
  
  // Default structured data
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Divly",
    "applicationCategory": "FinanceApplication",
    "description": description,
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1250"
    },
    "author": {
      "@type": "Organization",
      "name": "Divly",
      "url": "https://divly.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Divly",
      "logo": {
        "@type": "ImageObject",
        "url": "https://divly.app/icon-512x512.png"
      }
    }
  };

  const schema = schemaData || defaultSchema;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={`${title} - Divly Screenshot`} />
      <meta property="og:site_name" content="Divly" />
      <meta property="og:locale" content="en_US" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Article specific tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${title} - Divly Screenshot`} />
      <meta name="twitter:creator" content="@DivlyApp" />
      <meta name="twitter:site" content="@DivlyApp" />
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#059669" />
      <meta name="msapplication-TileColor" content="#059669" />
      <meta name="apple-mobile-web-app-title" content="Divly" />
      <meta name="application-name" content="Divly" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icon-180x180.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#059669" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://api.divly.app" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Additional Performance Hints */}
      <link rel="prefetch" href="/dashboard" />
      <link rel="prefetch" href="/positions" />
      <link rel="prefetch" href="/dividend-calendar" />
    </Head>
  );
} 