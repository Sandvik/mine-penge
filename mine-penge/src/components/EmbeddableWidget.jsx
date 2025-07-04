import React, { useState, useEffect } from 'react';

function EmbeddableWidget({ theme = 'su', limit = 3, showSource = true }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/articles/relevant?min_score=3.0`);
        const data = await response.json();
        
        // Filter by theme if specified
        let filteredArticles = data.articles;
        if (theme && theme !== 'all') {
          filteredArticles = data.articles.filter(article => 
            article.tags && article.tags.some(tag => tag.toLowerCase().includes(theme.toLowerCase()))
          );
        }
        
        // Take only the specified limit
        setArticles(filteredArticles.slice(0, limit));
        setLoading(false);
      } catch (err) {
        setError('Kunne ikke indlæse artikler');
        setLoading(false);
      }
    };

    fetchArticles();
  }, [theme, limit]);

  const getThemeTitle = (theme) => {
    const themes = {
      'su': 'SU og Studerende',
      'opsparing': 'Opsparing',
      'bolig': 'Bolig og Huskøb',
      'investering': 'Investering',
      'gæld': 'Gæld og Lån',
      'pension': 'Pension',
      'budget': 'Budget',
      'all': 'Personlig Økonomi'
    };
    return themes[theme] || 'Personlig Økonomi';
  };

  if (loading) {
    return (
      <div className="minepenge-widget">
        <div className="widget-header">
          <h3>MinePenge.dk - {getThemeTitle(theme)}</h3>
        </div>
        <div className="widget-content">
          <p>Indlæser artikler...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="minepenge-widget">
        <div className="widget-header">
          <h3>MinePenge.dk - {getThemeTitle(theme)}</h3>
        </div>
        <div className="widget-content">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="minepenge-widget">
      <div className="widget-header">
        <h3>MinePenge.dk - {getThemeTitle(theme)}</h3>
        <a href="https://minepenge.dk" target="_blank" rel="noopener noreferrer">
          Se alle artikler →
        </a>
      </div>
      
      <div className="widget-content">
        {articles.length === 0 ? (
          <p>Ingen artikler fundet for dette emne.</p>
        ) : (
          <div className="widget-articles">
            {articles.map((article, index) => (
              <div key={article.id} className="widget-article">
                <h4 className="article-title">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </h4>
                <p className="article-summary">{article.summary}</p>
                <div className="article-meta">
                  {showSource && <span className="article-source">{article.source}</span>}
                  <span className="article-date">{article.publishedAt}</span>
                  {article.relevance_score && (
                    <span className="article-relevance">Relevans: {article.relevance_score}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="widget-footer">
        <p>Powered by <a href="https://minepenge.dk" target="_blank" rel="noopener noreferrer">MinePenge.dk</a></p>
      </div>
    </div>
  );
}

export default EmbeddableWidget; 