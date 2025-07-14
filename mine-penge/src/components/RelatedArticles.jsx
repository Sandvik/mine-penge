import React from 'react';
import { ExternalLink } from 'lucide-react';
import { getRelatedArticles } from '../services/articleService';

function RelatedArticles({ currentArticleId, limit = 3 }) {
  const [relatedArticles, setRelatedArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (currentArticleId) {
      setLoading(true);
      try {
        const articles = getRelatedArticles(currentArticleId, limit);
        setRelatedArticles(articles);
      } catch (error) {
        console.error('Error loading related articles:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setRelatedArticles([]);
      setLoading(false);
    }
  }, [currentArticleId, limit]);

  if (loading) {
    return (
      <div className="bg-nordic-50 rounded-2xl p-6 border border-nordic-200">
        <h3 className="text-lg font-semibold text-nordic-900 mb-4">
          Du kunne også være interesseret i...
        </h3>
        <div className="animate-pulse space-y-3">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-nordic-50 rounded-lg p-4 border border-nordic-300">
              <div className="h-4 bg-nordic-200 rounded mb-2"></div>
              <div className="h-3 bg-nordic-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="bg-nordic-50 rounded-2xl p-6 border border-nordic-200">
      <h3 className="text-lg font-semibold text-nordic-900 mb-4">
        Du kunne også være interesseret i...
      </h3>
      <div className="space-y-3">
        {relatedArticles.map((article) => (
          <div key={article.article_id} className="bg-nordic-50 rounded-lg p-4 border border-nordic-300 hover:shadow-md transition-shadow">
            <h4 className="font-medium text-nordic-900 mb-2 line-clamp-2">
              {article.title}
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-nordic-500">
                {article.source}
              </span>
              <a 
                href={article.url}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
              >
                Læs mere
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedArticles; 