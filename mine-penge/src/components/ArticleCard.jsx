import React from 'react';
import { Heart, ExternalLink, Clock, User } from 'lucide-react';
import UserFeedback from './UserFeedback';

function ArticleCard({ article, isFavorite = false, onToggleFavorite }) {
  const { title, summary, tags, source, publishedAt, foundAt, difficulty, audience, relevance_score } = article || {};

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'begynder': return 'bg-success-100 text-success-800';
      case 'øvet': return 'bg-primary-100 text-primary-800';
      case 'avanceret': return 'bg-warning-100 text-warning-800';
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
    if (score >= 80) return 'bg-success-100 text-success-800';
    if (score >= 60) return 'bg-primary-100 text-primary-800';
    if (score >= 40) return 'bg-warning-100 text-warning-800';
    return 'bg-nordic-100 text-nordic-800';
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
              ? 'text-error-500 bg-error-50 hover:bg-error-100' 
              : 'text-nordic-400 hover:text-error-500 hover:bg-error-50'
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
              index === 0 ? 'bg-primary-100 text-primary-800' :
              index === 1 ? 'bg-success-100 text-success-800' :
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
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
        >
          Læs mere
          <ExternalLink className="h-4 w-4 ml-1" />
        </a>
      </div>
      
      {/* User Feedback */}
      <div className="mt-4 pt-4 border-t border-nordic-100">
        <UserFeedback articleId={article?.id} />
      </div>
    </article>
  );
}

export default ArticleCard; 