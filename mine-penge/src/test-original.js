// Test script to check if original articles are loaded
import articlesData from './data/articles.json';
import originalArticlesData from './data/original_articles.json';

console.log('Articles data structure:', Object.keys(articlesData));
console.log('Original articles count:', originalArticlesData.length);
console.log('Combined articles count:', (articlesData.articles || []).length + originalArticlesData.length);

// Check if original articles have the right source
const originalArticles = originalArticlesData.filter(article => article.source === 'MinePenge Original');
console.log('Articles with MinePenge Original source:', originalArticles.length); 