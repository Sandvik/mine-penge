import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import ArticleCard from './components/ArticleCard';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';
import SEODashboard from './pages/SEODashboard';
import LandingPageGenerator from './pages/LandingPageGenerator';
import QAFeedGenerator from './pages/QAFeedGenerator';
import InternalLinkStructure from './pages/InternalLinkStructure';
import EmbedWidget from './pages/EmbedWidget';
import CurationPanel from './components/CurationPanel';
import { fetchArticles, searchArticles, getArticlesByFilter, getStatistics, getAvailableFilters } from './services/articleService';
import curationService from './services/curationService';
import ScrollToTopButton from './components/ScrollToTopButton';
import './index.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState(['Alle tags']);
  const [loading, setLoading] = useState(true);
  const [curationPanelOpen, setCurationPanelOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalArticles: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [statistics, setStatistics] = useState({});
  const [availableTags, setAvailableTags] = useState([]);

  const isDebugMode = import.meta.env.DEV || import.meta.env.MODE === 'development';

  useEffect(() => {
    loadArticles();
  }, []);

  // Show articles when articles state changes
  useEffect(() => {
    console.log('=== useEffect triggered ===');
    console.log('Articles length:', articles.length);
    console.log('Selected topics:', selectedTopics);
    console.log('Current page:', pagination.currentPage);
    console.log('useEffect dependencies changed - articles, selectedTopics, or pagination.currentPage');
    
    if (articles.length > 0) {
      console.log('Calling showCurrentPageArticles from useEffect');
      showCurrentPageArticles();
    } else {
      console.log('No articles available, skipping showCurrentPageArticles');
    }
  }, [articles, selectedTopics, pagination.currentPage]);

  // Separate useEffect to debug selectedTopics changes
  useEffect(() => {
    console.log('=== selectedTopics changed ===');
    console.log('New selectedTopics:', selectedTopics);
    console.log('Articles available:', articles.length);
  }, [selectedTopics]);

  // Simple function to show articles for current page
  const showCurrentPageArticles = () => {
    console.log('=== showCurrentPageArticles START ===');
    console.log('Articles length:', articles.length);
    console.log('Selected topics:', selectedTopics);
    
    if (articles.length === 0) {
      console.log('No articles available, returning');
      return;
    }
    
    // Get all articles from articleService for proper filtering
    const allArticles = getArticlesByFilter({}, 1, 10000).articles; // Get all articles
    console.log('Total articles available in service:', allArticles.length);
    
    // Filter out blacklisted articles first
    const nonBlacklistedArticles = curationService.filterArticles(allArticles);
    console.log('After blacklist filtering:', nonBlacklistedArticles.length);
    
    // Apply topic filtering if a specific topic is selected
    let filteredByTopic = nonBlacklistedArticles;
    if (selectedTopics.length > 0 && !selectedTopics.includes('Alle tags')) {
      const selectedTopic = selectedTopics[0];
      console.log('Filtering by selected topic:', selectedTopic);
      console.log('Looking for articles with minepenge_tags containing:', selectedTopic.toLowerCase());
      
      filteredByTopic = nonBlacklistedArticles.filter(article => {
        if (article.minepenge_tags && Array.isArray(article.minepenge_tags)) {
          const hasTag = article.minepenge_tags.some(tag => {
            const tagLower = tag.toLowerCase();
            const topicLower = selectedTopic.toLowerCase();
            
            // Only use exact match
            const exactMatch = tagLower === topicLower;
            
            if (exactMatch) {
              console.log('Article matches:', article.title, 'Tag:', tag, 'Topic:', selectedTopic);
            }
            return exactMatch;
          });
          return hasTag;
        }
        return false;
      });
      console.log('After topic filtering:', filteredByTopic.length);
      console.log('Sample filtered articles:', filteredByTopic.slice(0, 3).map(a => ({ title: a.title, tags: a.minepenge_tags })));
    } else {
      console.log('No specific topic selected, showing all articles');
    }
    
    // Sort articles by date (newest first) and then by source for variety
    const sortedArticles = [...filteredByTopic].sort((a, b) => {
      // First sort by date (newest first)
      const dateA = new Date(a.published_date || a.scraped_date || 0);
      const dateB = new Date(b.published_date || b.scraped_date || 0);
      
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
      
      // If same date, sort by source for variety
      const sourceA = a.source || '';
      const sourceB = b.source || '';
      return sourceA.localeCompare(sourceB);
    });
    
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const currentPageArticles = sortedArticles.slice(startIndex, endIndex);
    
    console.log('Setting filteredArticles to:', currentPageArticles.length, 'articles');
    console.log('Sample articles:', currentPageArticles.slice(0, 2).map(a => ({ title: a.title, tags: a.minepenge_tags })));
    
    setFilteredArticles(currentPageArticles);
    
    // Update pagination info
    setPagination(prev => ({
      ...prev,
      totalArticles: filteredByTopic.length,
      totalPages: Math.ceil(filteredByTopic.length / prev.pageSize),
      hasNextPage: endIndex < filteredByTopic.length,
      hasPrevPage: pagination.currentPage > 1
    }));
    console.log('=== showCurrentPageArticles END ===');
  };

  // Handle search
  const handleSearch = (searchQuery) => {
    console.log('handleSearch called with:', searchQuery);
    
    if (!searchQuery.trim()) {
      console.log('Empty search, showing current page articles');
      showCurrentPageArticles();
      return;
    }
    
    console.log('Searching for:', searchQuery);
    const searchData = searchArticles(searchQuery, pagination.currentPage, pagination.pageSize);
    console.log('Search results:', searchData);
    
    // Filter blacklisted articles from search results
    const filteredSearchResults = curationService.filterArticles(searchData.articles || []);
    setFilteredArticles(filteredSearchResults);
    
    // Update pagination with filtered results
    const updatedPagination = {
      ...searchData.pagination,
      totalArticles: filteredSearchResults.length,
      totalPages: Math.ceil(filteredSearchResults.length / pagination.pageSize)
    };
    setPagination(updatedPagination);
  };

  // Handle topic change
  const handleTopicChange = (topic) => {
    console.log('=== handleTopicChange START ===');
    console.log('Topic clicked:', topic);
    console.log('Current articles count:', articles.length);
    console.log('Current selectedTopics:', selectedTopics);
    
    console.log('Setting selectedTopics to:', [topic]);
    setSelectedTopics([topic]);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    // Let useEffect handle the filtering by calling showCurrentPageArticles
    console.log('=== handleTopicChange END ===');
  };

  const loadArticles = async (page = 1) => {
    try {
      setLoading(true);
      const data = await fetchArticles(page, pagination.pageSize);
      setArticles(data.articles || []);
      setPagination(data.pagination || {});
      setStatistics(getStatistics());
      
      // Get available tags and log for debugging
      const filters = getAvailableFilters();
      console.log('Available filters:', filters);
      console.log('Available tags:', filters.tags);
      console.log('Available audiences:', filters.audiences);
      console.log('Available complexities:', filters.complexities);
      
      // Capitalize tags for display and add some common ones
      const rawTags = filters.tags && filters.tags.length > 0 ? filters.tags : [];
      const capitalizedTags = rawTags.map(tag => {
        // Capitalize first letter and handle special cases
        if (tag === 'opsparing') return 'Opsparing';
        if (tag === 'investering') return 'Investering';
        if (tag === 'gæld') return 'Gæld';
        if (tag === 'budget') return 'Budget';
        if (tag === 'pension') return 'Pension';
        if (tag === 'forsikring') return 'Forsikring';
        if (tag === 'bolig') return 'Bolig';
        if (tag === 'skatter') return 'Skatter';
        if (tag === 'børn') return 'Børn & Familie';
        if (tag === 'studerende') return 'Studerende';
        if (tag === 'begynder') return 'Begynder';
        if (tag === 'øvet') return 'Øvet';
        if (tag === 'avanceret') return 'Avanceret';
        
        // General capitalization
        return tag.charAt(0).toUpperCase() + tag.slice(1);
      });
      
      // Remove duplicates and sort
      const uniqueTags = [...new Set(capitalizedTags)].sort();
      
      setAvailableTags(uniqueTags);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    console.log('=== handlePageChange START ===');
    console.log('Changing to page:', newPage);
    console.log('Selected topics:', selectedTopics);
    
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    
    // Let useEffect handle the filtering by calling showCurrentPageArticles
    console.log('=== handlePageChange END ===');
  };

  // Handle blacklist updates
  const handleBlacklistUpdate = () => {
    // Refresh articles when blacklist changes
    showCurrentPageArticles();
  };

  const toggleFavorite = (articleId) => {
    setFavorites(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const PaginationControls = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8 mb-4">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Forrige
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-lg ${
              page === pagination.currentPage
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
        
        {endPage < pagination.totalPages && (
          <>
            {endPage < pagination.totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              {pagination.totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Næste
        </button>
      </div>
    );
  };

  const HomePage = () => (
    <div className="min-h-screen bg-nordic-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 lg:py-6">
        {/* Header */}
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-nordic-900 mb-2 sm:mb-3 leading-tight">
            Velkommen
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl font-serif font-medium text-primary-600 mb-1 sm:mb-2">
            & MinePenge
          </p>
          <p className="text-base sm:text-lg lg:text-xl font-modern font-light text-nordic-500 mt-2 sm:mt-3 italic">
            Fordi det er meget mere end bare økonomi
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600">{statistics.totalArticles || articles.length}</div>
            <div className="text-sm sm:text-base text-nordic-600">Artikler</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600">{statistics.sources?.length || 5}</div>
            <div className="text-sm sm:text-base text-nordic-600">Kilder</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600">{statistics.availableTags || availableTags.length}</div>
            <div className="text-sm sm:text-base text-nordic-600">Tags</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600">{pagination.totalPages || 1}</div>
            <div className="text-sm sm:text-base text-nordic-600">Sider</div>
          </div>
        </div>

        {/* How to use section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-2xl font-bold text-nordic-900 mb-4">Sådan bruger du MinePenge</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-nordic-900 mb-2">Søg og find</h3>
              <p className="text-sm text-nordic-700">
                Brug søgefeltet til at finde artikler om specifikke emner som "budget", "investering" eller "pension"
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-nordic-900 mb-2">Filtrer efter interesse</h3>
              <p className="text-sm text-nordic-700">
                Brug sidebar-filtrene til at finde indhold tilpasset din situation og kompleksitetsniveau
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-nordic-900 mb-2">Læs og lær</h3>
              <p className="text-sm text-nordic-700">
                Klik på artiklerne for at læse fuldt indhold og få praktiske råd til din økonomi
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} />

        {/* Selected Tag Indicator */}
        {selectedTopics.length > 0 && !selectedTopics.includes('Alle tags') && (
          <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-primary-700 font-medium">
                  Viser artikler med tag: 
                </span>
                <span className="ml-2 px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-semibold">
                  {selectedTopics[0]}
                </span>
                <span className="ml-2 text-primary-600">
                  ({pagination.totalArticles} artikler fundet)
                </span>
              </div>
              <button
                onClick={() => handleTopicChange('Alle tags')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Vis alle artikler
              </button>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredArticles.map((article, index) => (
            <ArticleCard
              key={article.article_id || index}
              article={article}
              isFavorite={favorites.includes(article.article_id)}
              onToggleFavorite={() => toggleFavorite(article.article_id)}
              selectedTag={selectedTopics.length > 0 && !selectedTopics.includes('Alle tags') ? selectedTopics[0] : null}
            />
          ))}
        </div>

        {/* Pagination */}
        <PaginationControls />

        {filteredArticles.length === 0 && !loading && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-nordic-500 text-base sm:text-lg">
              Ingen artikler fundet. Prøv at ændre dine filtre eller start scraperen.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-nordic-100">
        <Navigation onOpenCuration={isDebugMode ? () => setCurationPanelOpen(true) : undefined} />
        
        <div className="flex flex-col lg:flex-row">
          <Sidebar 
            selectedTopics={selectedTopics}
            onTopicChange={handleTopicChange}
            availableTags={availableTags}
          />
          
          <main className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/seo-dashboard" element={<SEODashboard />} />
              <Route path="/landing-page-generator" element={<LandingPageGenerator />} />
              <Route path="/qa-feed-generator" element={<QAFeedGenerator />} />
              <Route path="/internal-link-structure" element={<InternalLinkStructure />} />
              <Route path="/embed-widget" element={<EmbedWidget />} />
            </Routes>
          </main>
        </div>
        
        {/* Curation Panel - Only visible in debug mode */}
        {isDebugMode && (
          <CurationPanel 
            isOpen={curationPanelOpen}
            onClose={() => setCurationPanelOpen(false)}
            onBlacklistUpdate={handleBlacklistUpdate}
          />
        )}
        
        <ScrollToTopButton />
        <Footer />
      </div>
    </Router>
  );
}

export default App; 