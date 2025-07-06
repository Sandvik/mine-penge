import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  article = null,
  structuredData = null 
}) => {
  const baseUrl = 'https://minepenge.nu';
  const defaultTitle = 'MinePenge.nu - Dansk Privatøkonomi';
  const defaultDescription = 'Få styr på pengene med guides, AI-værktøjer og inspiration til unge og børnefamilier. Lær om budget, opsparing, investering og privatøkonomi.';
  const defaultImage = `${baseUrl}/og-image.jpg`;

  const finalTitle = title ? (title.includes('MinePenge.nu') ? title : `${title} | MinePenge.nu`) : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : defaultImage;
  const finalUrl = url ? (url.startsWith('http') ? url : `${baseUrl}${url}`) : baseUrl;

  // Generate structured data for articles
  const generateArticleStructuredData = () => {
    if (!article) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.summary,
      "image": finalImage,
      "author": {
        "@type": "Organization",
        "name": "MinePenge.nu"
      },
      "publisher": {
        "@type": "Organization",
        "name": "MinePenge.nu",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        }
      },
      "datePublished": article.published_date,
      "dateModified": article.published_date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": finalUrl
      },
      "keywords": article.minepenge_tags?.join(', ') || keywords,
      "articleSection": article.minepenge_tags?.[0] || "Privatøkonomi"
    };
  };

  const articleStructuredData = generateArticleStructuredData();
  const finalStructuredData = structuredData || articleStructuredData;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="MinePenge.nu" />
      <meta property="og:locale" content="da_DK" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalUrl} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={finalImage} />
      
      {/* Article specific meta tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.published_date} />
          <meta property="article:modified_time" content={article.published_date} />
          <meta property="article:author" content="MinePenge.nu" />
          {article.minepenge_tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Structured Data */}
      {finalStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData)}
        </script>
      )}
      
      {/* Breadcrumb structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Hjem",
              "item": baseUrl
            },
            ...(url && url !== '/' ? [{
              "@type": "ListItem",
              "position": 2,
              "name": title || "Side",
              "item": finalUrl
            }] : [])
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead; 