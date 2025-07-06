// Sitemap generator for SEO optimization
import articlesData from '../data/articles.json';

export const generateSitemap = () => {
  const baseUrl = 'https://minepenge.nu';
  const currentDate = new Date().toISOString();
  
  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/opsparing', priority: '0.9', changefreq: 'weekly' },
    { url: '/investering', priority: '0.9', changefreq: 'weekly' },
    { url: '/budget', priority: '0.9', changefreq: 'weekly' },
    { url: '/gæld', priority: '0.8', changefreq: 'weekly' },
    { url: '/pension', priority: '0.8', changefreq: 'weekly' },
    { url: '/bolig', priority: '0.8', changefreq: 'weekly' },
    { url: '/studerende', priority: '0.8', changefreq: 'weekly' },
    { url: '/familieøkonomi', priority: '0.8', changefreq: 'weekly' },
  ];

  // Generate article URLs
  const articlePages = articlesData.articles?.map(article => ({
    url: `/artikel/${article.article_id}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: article.published_date || currentDate
  })) || [];

  // Generate tag pages
  const allTags = new Set();
  articlesData.articles?.forEach(article => {
    if (article.minepenge_tags) {
      article.minepenge_tags.forEach(tag => allTags.add(tag));
    }
  });

  const tagPages = Array.from(allTags).map(tag => ({
    url: `/tag/${encodeURIComponent(tag)}`,
    priority: '0.6',
    changefreq: 'weekly'
  }));

  // Combine all pages
  const allPages = [...staticPages, ...articlePages, ...tagPages];

  // Generate XML sitemap
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemapXml;
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