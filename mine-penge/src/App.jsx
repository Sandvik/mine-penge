import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import FilterBar from './components/FilterBar';
import ArticleCard from './components/ArticleCard';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import EmbedWidget from './pages/EmbedWidget';
import LandingPageGenerator from './pages/LandingPageGenerator';
import QAFeedGenerator from './pages/QAFeedGenerator';
import InternalLinkStructure from './pages/InternalLinkStructure';
import SEODashboard from './pages/SEODashboard';
import articleService from './services/articleService';
import ScrollToTopButton from './components/ScrollToTopButton';

function HomePage() {
  // All state definitions
  const [filters, setFilters] = useState({
    topic: '',
    audience: '',
    difficulty: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [currentView, setCurrentView] = useState('seneste'); // New state for navigation

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

  // Sidebar navigation handlers
  const handleNavigate = (view) => {
    setCurrentView(view);
    // Clear filters when changing view
    setFilters({
      topic: '',
      audience: '',
      difficulty: ''
    });
  };

  const handleFilterTopic = (topic) => {
    setFilters(prev => ({
      ...prev,
      topic: prev.topic === topic ? '' : topic // Toggle filter
    }));
  };

  const handleFilterAudience = (audience) => {
    setFilters(prev => ({
      ...prev,
      audience: prev.audience === audience ? '' : audience // Toggle filter
    }));
  };

  const handleShowNew = () => {
    // Filter to show only new articles (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const newArticles = articles.filter(article => {
      const articleDate = new Date(article.foundAt);
      return articleDate > oneDayAgo;
    });
    
    setCurrentView('nye');
    // Don't modify articles state, let filteredArticles handle it
  };

  const handleShowSaved = () => {
    // Show only favorited articles
    setCurrentView('gemte');
    // Don't modify articles state, let filteredArticles handle it
  };

  // Map sidebar topic names to actual article tags
  const mapTopicToTags = (topic) => {
    const topicMap = {
      'Osparing': ['opsparing', 'spare', 'spareri', 'børneopsparing', 'pensionsopsparing'],
      'SU': ['su', 'studerende', 'fradrag', 'skattefradrag'],
      'Bolig': ['bolig', 'huskøb', 'lejlighed', 'ejendom', 'boligmarked'],
      'Investering': ['investering', 'aktiesparekonto', 'fonde'],
      'Gæld': ['gæld', 'lån', 'rente', 'gældfri', 'gældfrihed'],
      'Pension': ['pension', 'pensionsopsparing', 'aldersopsparing', 'ratepension', 'folkepension']
    };
    return topicMap[topic] || [topic.toLowerCase()];
  };

  // Map sidebar audience names to actual article audience values
  const mapAudienceToValues = (audience) => {
    const audienceMap = {
      'Studerende': 'studerende',
      'Børnefamilie': 'boligejer',
      'Pensionist': 'erhverv',
      'Bred målgruppe': 'investor'
    };
    return audienceMap[audience] || audience.toLowerCase();
  };

  // Filter articles based on current filters and search
  const filteredArticles = useMemo(() => {
    console.log('Filtering articles with filters:', filters, 'and search:', searchQuery, 'currentView:', currentView);
    let filtered = articles.filter(article => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const searchWords = searchLower.split(' ').filter(word => word.length > 0);
        
        const matchesSearch = searchWords.every(word => {
          return article.title.toLowerCase().includes(word) ||
                 article.summary.toLowerCase().includes(word) ||
                 article.tags.some(tag => tag.toLowerCase().includes(word)) ||
                 article.source.toLowerCase().includes(word);
        });
        
        console.log('Tjekker artikel:', article.title, 'searchWords:', searchWords, 'matchesSearch:', matchesSearch);

        if (!matchesSearch) {
          console.log('Filtered out by search:', article.title);
          return false;
        }
      }

      // Topic filter
      if (filters.topic) {
        const expectedTags = mapTopicToTags(filters.topic);
        const matches = article.tags.some(tag => 
          expectedTags.some(expectedTag => 
            tag.toLowerCase().includes(expectedTag.toLowerCase()) || 
            expectedTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        console.log('Filter topic:', filters.topic, 'Expected tags:', expectedTags, 'Article:', article.title, 'Tags:', article.tags, 'Matches:', matches);
        if (!matches) {
          console.log('Filtered out by topic:', article.title);
          return false;
        }
      }
      
      // Audience filter
      if (filters.audience) {
        const expectedAudience = mapAudienceToValues(filters.audience);
        const matches = article.audience.toLowerCase() === expectedAudience.toLowerCase();
        console.log('Filter audience:', filters.audience, 'Expected:', expectedAudience, 'Article audience:', article.audience, 'Matches:', matches);
        if (!matches) {
          console.log('Filtered out by audience:', article.title);
          return false;
        }
      }
      
      // Difficulty filter
      if (filters.difficulty && article.difficulty !== filters.difficulty) {
        console.log('Filtered out by difficulty:', article.title);
        return false;
      }
      
      return true;
    });

    // Apply view-specific filtering
    if (currentView === 'nye') {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      filtered = filtered.filter(article => {
        const articleDate = new Date(article.foundAt);
        return articleDate > oneDayAgo;
      });
    } else if (currentView === 'gemte') {
      filtered = filtered.filter(article => favorites.has(article.id));
    } else if (currentView === 'populaere') {
      // Sort by relevance score for popular articles
      filtered.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
    } else if (currentView === 'anbefalede') {
      // Filter for high relevance articles
      filtered = filtered.filter(article => (article.relevance_score || 0) >= 50);
    }

    console.log('Filtered articles count:', filtered.length, 'view:', currentView);
    return filtered;
  }, [filters, searchQuery, currentView, favorites]);

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
    console.log('handleSearch called with:', query);
    setSearchQuery(query);
  };

  // Get view title based on current view
  const getViewTitle = () => {
    switch (currentView) {
      case 'seneste':
        return 'Seneste artikler';
      case 'populaere':
        return 'Populære artikler';
      case 'anbefalede':
        return 'Anbefalede artikler';
      case 'gemte':
        return 'Gemte artikler';
      case 'nye':
        return 'Nye artikler (sidste 24 timer)';
      default:
        return 'Seneste artikler';
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex flex-col">
      <Navigation onSearch={handleSearch} />
      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
      <ScrollToTopButton />
      
      <div className="flex flex-1">
        <Sidebar 
          onNavigate={handleNavigate}
          onFilterTopic={handleFilterTopic}
          onFilterAudience={handleFilterAudience}
          onShowNew={handleShowNew}
          onShowSaved={handleShowSaved}
        />
        
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-nordic-900 mb-2">
                  {getViewTitle()}
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
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Indlæser...' : 'Opdater'}
                </button>
                <button
                  onClick={triggerScraper}
                  disabled={isLoading}
                  className="px-4 py-2 bg-success-500 text-white rounded-lg hover:bg-success-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Ryd filtre
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-primary-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/seo-dashboard" element={<SEODashboard />} />
          <Route path="/embed-widget" element={<EmbedWidget />} />
          <Route path="/landing-pages" element={<LandingPageGenerator />} />
          <Route path="/qa-feed" element={<QAFeedGenerator />} />
          <Route path="/internal-links" element={<InternalLinkStructure />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 