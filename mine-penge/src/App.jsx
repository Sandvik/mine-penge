import React, { useState, useMemo } from 'react';
import Navigation from './components/Navigation';
import FilterBar from './components/FilterBar';
import ArticleCard from './components/ArticleCard';
import Sidebar from './components/Sidebar';
import articleService from './services/articleService';

function App() {
  // All state definitions
  const [filters, setFilters] = useState({
    topic: '',
    audience: '',
    difficulty: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  // Get articles from service
  const [articles, setArticles] = useState(articleService.getAllArticles());
  const [isLoading, setIsLoading] = useState(false);

  // Load fresh articles from scraper
  const loadFreshArticles = async () => {
    setIsLoading(true);
    try {
      const freshArticles = await articleService.loadFreshArticles();
      setArticles(freshArticles);
    } catch (error) {
      console.error('Error loading fresh articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger scraper
  const triggerScraper = async () => {
    setIsLoading(true);
    try {
      const result = await articleService.triggerScraper();
      if (result) {
        setArticles(result);
      } else {
        console.log('Scraper completed but no new articles loaded');
      }
    } catch (error) {
      console.error('Error triggering scraper:', error);
      // Show user-friendly error message
      alert('Kunne ikke starte scraper. Sørg for at backend kører på http://localhost:8000');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter articles based on current filters and search
  const filteredArticles = useMemo(() => {
    console.log('Filtering articles with filters:', filters, 'and search:', searchQuery);
    let filtered = articles.filter(article => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          article.title.toLowerCase().includes(searchLower) ||
          article.summary.toLowerCase().includes(searchLower) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          article.source.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) {
          console.log('Filtered out by search:', article.title);
          return false;
        }
      }

      // Topic filter
      if (filters.topic && !article.tags.includes(filters.topic)) {
        console.log('Filtered out by topic:', article.title);
        return false;
      }
      
      // Audience filter
      if (filters.audience && article.audience !== filters.audience) {
        console.log('Filtered out by audience:', article.title);
        return false;
      }
      
      // Difficulty filter
      if (filters.difficulty && article.difficulty !== filters.difficulty) {
        console.log('Filtered out by difficulty:', article.title);
        return false;
      }
      
      return true;
    });
    console.log('Filtered articles count:', filtered.length);
    return filtered;
  }, [filters, searchQuery]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    console.log('Filter changed:', filterType, value);
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: value
      };
      console.log('New filters:', newFilters);
      return newFilters;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      topic: '',
      audience: '',
      difficulty: ''
    });
  };

  // Toggle favorite
  const toggleFavorite = (articleId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(articleId)) {
        newFavorites.delete(articleId);
      } else {
        newFavorites.add(articleId);
      }
      return newFavorites;
    });
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-nordic-50">
      <Navigation onSearch={handleSearch} />
      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-nordic-900 mb-2">
                  Seneste artikler
                  {Object.values(filters).some(f => f) && (
                    <span className="text-sm font-normal text-nordic-600 ml-2">
                      ({filteredArticles.length} resultater)
                    </span>
                  )}
                </h2>
                <p className="text-nordic-600">AI-udvalgte råd til din privatøkonomi</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={loadFreshArticles}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Indlæser...' : 'Opdater'}
                </button>
                <button
                  onClick={triggerScraper}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Scraper...' : 'Start Scraper'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {filteredArticles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                isFavorite={favorites.has(article.id)}
                onToggleFavorite={() => toggleFavorite(article.id)}
              />
            ))}
            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-nordic-500">Ingen artikler matcher dine filtre</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ryd filtre
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App; 