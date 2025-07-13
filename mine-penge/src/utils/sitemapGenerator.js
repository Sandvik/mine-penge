// Sitemap generator for SEO optimization
import articles from '../data/articles.json';

export const generateSitemap = () => {
  const baseUrl = 'https://minepenge.nu';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/faq', priority: '0.8', changefreq: 'weekly' },
    { url: '/student-investment-guide', priority: '0.9', changefreq: 'weekly' },
    { url: '/family-finance-guide', priority: '0.9', changefreq: 'weekly' },
    { url: '/investering-guide', priority: '0.9', changefreq: 'weekly' },
    { url: '/bolig-hus-guide', priority: '0.9', changefreq: 'weekly' },
    { url: '/om-os', priority: '0.5', changefreq: 'monthly' },
    { url: '/kontakt', priority: '0.5', changefreq: 'monthly' }
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add article pages (if you have individual article pages)
  // For now, we'll focus on the main pages and aggregated content

  sitemap += `</urlset>`;

  return sitemap;
};

// Function to generate sitemap for build process
export const generateSitemapForBuild = () => {
  const sitemap = generateSitemap();
  
  // Write to public folder so it gets copied to dist
  if (typeof window === 'undefined') {
    // Server-side only
    const fs = require('fs');
    const path = require('path');
    
    const publicPath = path.join(process.cwd(), 'public');
    const sitemapPath = path.join(publicPath, 'sitemap.xml');
    
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('Sitemap generated at:', sitemapPath);
  }
  
  return sitemap;
};

export const generateSitemapIndex = () => {
  const baseUrl = 'https://minepenge.nu';
  const currentDate = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;
}; 