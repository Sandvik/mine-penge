import React from 'react';
import { Heart, ExternalLink, Clock, User } from 'lucide-react';
import UserFeedback from './UserFeedback';

function ArticleCard({ article, isFavorite = false, onToggleFavorite, selectedTag = null }) {
  const { 
    title, 
    summary, 
    minepenge_tags, 
    source, 
    published_date,
    publishedAt, 
    foundAt, 
    complexity_level, 
    target_audiences,
    article_id,
    url
  } = article || {};

  // Debug: Log the source field
  console.log('Article source:', source, 'URL:', url, 'for article:', article_id);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'begynder': return 'bg-success-100 text-success-800';
      case 'øvet': return 'bg-primary-100 text-primary-800';
      case 'avanceret': return 'bg-warning-100 text-warning-800';
      default: return 'bg-nordic-100 text-nordic-800';
    }
  };

  const getAudienceIcon = (audiences) => {
    if (!audiences || audiences.length === 0) return '👤';
    
    const audience = audiences[0]; // Use first audience for icon
    switch (audience) {
      case 'studerende':
      case 'nybegynder_investering': return '🎓';
      case 'børnefamilie':
      case 'familieøkonomi': return '👨‍👩‍👧‍👦';
      case 'pensionister':
      case 'pensionist': return '👴';
      case 'erhverv':
      case 'investor': return '💼';
      default: return '👤';
    }
  };

  const getAudienceLabel = (audiences) => {
    if (!audiences || audiences.length === 0) return 'Bred';
    
    const audience = audiences[0]; // Use first audience for label
    switch (audience) {
      case 'studerende': return 'Studerende';
      case 'nybegynder_investering': return 'Nybegynder';
      case 'børnefamilie': return 'Børnefamilie';
      case 'familieøkonomi': return 'Familieøkonomi';
      case 'pensionister': return 'Pensionister';
      case 'pensionist': return 'Pensionist';
      case 'erhverv': return 'Erhverv';
      case 'investor': return 'Investor';
      default: return audience.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getComplexityLabel = (complexity) => {
    switch (complexity) {
      case 'begynder': return 'Begynder';
      case 'øvet': return 'Øvet';
      case 'avanceret': return 'Avanceret';
      default: return complexity || 'Begynder';
    }
  };

  // Function to format time display
  const formatTime = (publishedDate, publishedAt) => {
    // Try published_date first, then publishedAt
    const dateString = publishedDate || publishedAt;
    
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      
      if (diffInDays > 0) {
        if (diffInDays === 1) return 'I går';
        if (diffInDays < 7) return `${diffInDays} dage siden`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} uger siden`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} måneder siden`;
        return `${Math.floor(diffInDays / 365)} år siden`;
      } else if (diffInHours > 0) {
        return `${diffInHours} timer siden`;
      } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minutter siden`;
      } else {
        return 'Lige nu';
      }
    } catch (e) {
      console.error('Error parsing date:', dateString, e);
      return null;
    }
  };

  // Function to format source display
  const formatSource = (source, url) => {
    // First try to use the source field
    if (source) {
      let cleanSource = source
        .replace(/^https?:\/\//, '') // Remove http:// or https://
        .replace(/^www\./, '') // Remove www.
        .replace(/\/$/, '') // Remove trailing slash
        .replace(/\/blog.*$/, '') // Remove /blog and everything after
        .replace(/\(.*?\)/g, '') // Remove parentheses and content
        .trim();
      
      // Capitalize first letter
      return cleanSource.charAt(0).toUpperCase() + cleanSource.slice(1);
    }
    
    // If no source, extract from URL
    if (url) {
      try {
        const urlObj = new URL(url);
        let domain = urlObj.hostname
          .replace(/^www\./, '') // Remove www.
          .replace(/\.dk$/, '') // Remove .dk
          .replace(/\.com$/, '') // Remove .com
          .replace(/\.net$/, '') // Remove .net
          .replace(/\.org$/, ''); // Remove .org
        
        // Capitalize first letter
        return domain.charAt(0).toUpperCase() + domain.slice(1);
      } catch (e) {
        console.error('Error parsing URL:', url, e);
      }
    }
    
    return 'Ukendt kilde';
  };

  const formattedTime = formatTime(published_date, publishedAt);

  return (
    <article className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200 hover:shadow-lg transition-shadow duration-200 relative">
      {/* Article ID - Top right corner */}
      {article_id && (
        <div className="absolute top-2 right-2">
          <span className="bg-nordic-100 text-nordic-600 text-xs font-mono px-2 py-1 rounded border border-nordic-200">
            ID: {article_id}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-nordic-900 mb-2 leading-tight">
            {title || 'Sådan sparer du 10.000 kr. om året på mad'}
          </h3>
          <div className="flex items-center text-sm text-nordic-500 space-x-4">
            {formattedTime && (
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formattedTime}
              </span>
            )}
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {getAudienceIcon(target_audiences)} {getAudienceLabel(target_audiences)}
            </span>
            {complexity_level && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(complexity_level)}`}>
                {getComplexityLabel(complexity_level)}
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
        {(minepenge_tags || ['opsparing', 'børnefamilie', 'begynder']).slice(0, 3).map((tag, index) => {
          // Check if this tag matches the selected tag
          const isSelectedTag = selectedTag && tag.toLowerCase() === selectedTag.toLowerCase();
          
          return (
            <span 
              key={index}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                isSelectedTag 
                  ? 'bg-primary-600 text-white shadow-md ring-2 ring-primary-300 font-semibold' 
                  : index === 0 ? 'bg-primary-100 text-primary-800' :
                    index === 1 ? 'bg-success-100 text-success-800' :
                    getDifficultyColor(tag)
              }`}
            >
              {tag}
            </span>
          );
        })}
        {minepenge_tags && minepenge_tags.length > 3 && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-nordic-100 text-nordic-600">
            +{minepenge_tags.length - 3} mere
          </span>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-nordic-200">
        <span className="text-sm text-nordic-500">
          Kilde: {formatSource(source, url)}
        </span>
        <a 
          href={url || "#"}
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
        <UserFeedback articleId={article_id} />
      </div>
    </article>
  );
}

export default ArticleCard; 