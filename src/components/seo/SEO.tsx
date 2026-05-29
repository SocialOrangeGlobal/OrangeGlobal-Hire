import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  schema?: string;
}

export default function SEO({
  title,
  description,
  url,
  image,
  schema,
}: SEOProps) {
  const siteUrl = 'https://www.orangeglobal.co';
  const defaultTitle = 'Orange Global | Find Jobs, Australia Visa & Immigration, Staffing Solutions';
  const defaultDescription = 'Orange Global — Search & apply for jobs worldwide, get expert Australia visa & immigration support, and hire top talent through staffing, recruitment & executive search solutions.';
  const defaultImage = `${siteUrl}/og-image.jpg`;

  const seo = {
    title: title ? `${title} | Orange Global` : defaultTitle,
    description: description || defaultDescription,
    url: url ? `${siteUrl}${url}` : siteUrl,
    image: image || defaultImage,
  };

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:image" content={seo.image} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seo.url} />

      {/* Structured Data (Schema.org) */}
      {schema && (
        <script type="application/ld+json">
          {schema}
        </script>
      )}
    </Helmet>
  );
}
