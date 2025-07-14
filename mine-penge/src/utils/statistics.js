import articlesData from '../data/articles.json';

export const calculateStatistics = () => {
  const articles = articlesData.articles || [];
  
  // Count total articles
  const totalArticles = articles.length;
  
  // Get unique sources
  const sources = [...new Set(articles.map(article => article.source))];
  
  // Count articles by source
  const articlesBySource = sources.reduce((acc, source) => {
    acc[source] = articles.filter(article => article.source === source).length;
    return acc;
  }, {});
  
  // Get latest article date
  const latestArticle = articles.reduce((latest, article) => {
    if (!latest || !article.date_published) return latest;
    if (!latest.date_published) return article;
    return new Date(article.date_published) > new Date(latest.date_published) ? article : latest;
  }, null);
  
  return {
    totalArticles,
    sources,
    articlesBySource,
    latestArticle: latestArticle?.date_published,
    totalSources: sources.length
  };
}; 