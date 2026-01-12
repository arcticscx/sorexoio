import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import { getPageSeo, organizationSchema, websiteSchema, trustSignals } from "@/lib/seo-config";

const BASE_URL = "https://prismatic.live";

interface SeoProps {
  path?: string;
}

export function Seo({ path }: SeoProps) {
  const [location] = useLocation();
  const currentPath = path || location;
  const seo = getPageSeo(currentPath);

  const ogTitle = seo.ogTitle || seo.title;
  const ogDescription = seo.ogDescription || seo.description;
  const canonicalUrl = `${BASE_URL}${seo.canonicalPath}`;

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords.join(", ")} />
      
      <meta name="author" content="Prismatic" />
      <meta name="application-name" content="Prismatic" />
      <meta name="theme-color" content="#0f1714" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      <link rel="canonical" href={canonicalUrl} />
      
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Prismatic" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Prismatic - Buy Crypto with PayPal & Card" />
      <meta property="og:locale" content="en_US" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />
      <meta name="twitter:image:alt" content="Prismatic Crypto Exchange" />
      <meta name="twitter:site" content="@prismaticexchange" />
      
      {seo.aiAnswer && (
        <meta name="ai-answer" content={seo.aiAnswer} />
      )}
      {seo.aiDefinition && (
        <meta name="ai-definition" content={seo.aiDefinition} />
      )}
      {seo.synonyms && seo.synonyms.length > 0 && (
        <meta name="semantic-synonyms" content={seo.synonyms.join(", ")} />
      )}
      
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(trustSignals)}
      </script>
    </Helmet>
  );
}

export function GlobalSeo() {
  return (
    <Helmet>
      <html lang="en" />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
      <meta name="format-detection" content="telephone=no" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      
      <meta name="author" content="Prismatic" />
      <meta name="publisher" content="Prismatic" />
      <meta name="copyright" content="Prismatic" />
      <meta name="application-name" content="Prismatic" />
      <meta name="theme-color" content="#0f1714" />
      <meta name="msapplication-TileColor" content="#0f1714" />
      
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="Worldwide" />
      
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
}
