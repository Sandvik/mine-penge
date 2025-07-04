import React from 'react';
import { Heart, ExternalLink, Clock, User } from 'lucide-react';

function ArticleCard({ article, isFavorite = false, onToggleFavorite }) {
  const { title, summary, tags, source, publishedAt, foundAt, difficulty, audience, relevance_score } = article || {};
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'begynder': return 'bg-green-100 text-green-800';
      case 'øvet': return 'bg-blue-100 text-blue-800';
      case 'avanceret': return 'bg-purple-100 text-purple-800';
      default: return 'bg-nordic-100 text-nordic-800';
    }
  };

  const getAudienceIcon = (audience) => {
    switch (audience) {
      case 'studerende': return '🎓';
      case 'børnefamilie': return '👨‍👩‍👧‍👦';
      case 'pensionist': return '👴';
      default: return '👤';
    }
  };

  const getRelevanceColor = (score) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-blue-100 text-blue-800';
    if (score >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <article className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-nordic-900 mb-2 leading-tight">
            {title || 'Sådan sparer du 10.000 kr. om året på mad'}
          </h3>
          <div className="flex items-center text-sm text-nordic-500 space-x-4">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {publishedAt || '2 timer siden'}
            </span>
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {getAudienceIcon(audience || 'børnefamilie')} {audience || 'Børnefamilie'}
            </span>
            {relevance_score && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(relevance_score)}`}>
                Relevans: {relevance_score}
              </span>
            )}
            {foundAt && (
              <span className="text-xs text-nordic-400">
                Fundet: {new Date(foundAt).toLocaleDateString('da-DK')}
              </span>
            )}
          </div>
        </div>
        <button 
          onClick={onToggleFavorite}
          className={`p-2 rounded-lg transition-colors ${
            isFavorite 
              ? 'text-red-500 bg-red-50 hover:bg-red-100' 
              : 'text-nordic-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Summary */}
      <p className="text-nordic-700 mb-4 leading-relaxed">
        {summary || 'AI-resumé: Planlægning og madplaner kan spare dig for tusindvis af kroner årligt. Her er de bedste tips til at reducere dit madbudget uden at gå på kompromis med kvaliteten.'}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(tags || ['opsparing', 'børnefamilie', 'begynder']).map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              index === 0 ? 'bg-blue-100 text-blue-800' :
              index === 1 ? 'bg-green-100 text-green-800' :
              getDifficultyColor(tag)
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-nordic-200">
        <span className="text-sm text-nordic-500">
          Kilde: {source || 'DR.dk'}
        </span>
        <a
          href={article?.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          Læs mere
          <ExternalLink className="h-4 w-4 ml-1" />
        </a>
      </div>
    </article>
  );
}

export default ArticleCard; 