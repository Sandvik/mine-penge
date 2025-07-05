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
import { fetchArticles, searchArticles, getArticlesByFilter, getStatistics, getAvailableFilters } from './services/articleService';
import ScrollToTopButton from './components/ScrollToTopButton';
import './index.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState(['Alle tags']);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    loadArticles();
  }, []);

  // Show articles when articles state changes
  useEffect(() => {
    if (articles.length > 0 && selectedTopics.includes('Alle tags')) {
      showCurrentPageArticles();
    }
  }, [articles]);

  // Simple function to show articles for current page
  const showCurrentPageArticles = () => {
    // Sort articles by date (newest first) and then by source for variety
    const sortedArticles = [...articles].sort((a, b) => {
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
    setFilteredArticles(currentPageArticles);
    
    // Update pagination info
    setPagination(prev => ({
      ...prev,
      totalArticles: articles.length,
      totalPages: Math.ceil(articles.length / prev.pageSize),
      hasNextPage: endIndex < articles.length,
      hasPrevPage: pagination.currentPage > 1
    }));
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
    setFilteredArticles(searchData.articles || []);
    setPagination(searchData.pagination || pagination);
  };

  // Handle topic change
  const handleTopicChange = (topic) => {
    setSelectedTopics([topic]);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    if (topic === 'Alle tags') {
      showCurrentPageArticles();
    } else {
      const filterData = getArticlesByFilter({
        topic: topic.toLowerCase()
      }, 1, pagination.pageSize);
      setFilteredArticles(filterData.articles || []);
      setPagination(filterData.pagination || pagination);
    }
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
      
      // Fallback to hardcoded tags if no tags found in data
      const tags = filters.tags && filters.tags.length > 0 ? filters.tags : [
        'Opsparing',
        'Investering', 
        'Gæld',
        'Budget',
        'Pension',
        'Forsikring',
        'Bolig',
        'Skatter',
        'Børn & Familie',
        'Studerende',
        'Begynder',
        'Øvet',
        'Avanceret'
      ];
      
      setAvailableTags(tags);
      
      // Show initial articles after state is updated
      setTimeout(() => showCurrentPageArticles(), 0);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };





  const handlePageChange = (newPage) => {
    // Update articles for new page
    if (selectedTopics.includes('Alle tags')) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      setTimeout(() => showCurrentPageArticles(), 0);
    } else {
      const selectedTag = selectedTopics[0];
      const filterData = getArticlesByFilter({
        topic: selectedTag.toLowerCase()
      }, newPage, pagination.pageSize);
      setFilteredArticles(filterData.articles || []);
      setPagination(filterData.pagination || pagination);
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-nordic-900 mb-3 sm:mb-4 leading-tight">
            Velkommen
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl font-serif font-medium text-primary-600 mb-2 sm:mb-3">
            & MinePenge
          </p>
          <p className="text-base sm:text-lg lg:text-xl font-modern font-light text-nordic-500 mt-3 sm:mt-4 italic">
            Fordi det er meget mere end bare økonomi
          </p>
        </div>

        {/* Statistics */}
        {statistics.totalArticles > 0 && (
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">{statistics.totalArticles}</div>
                <div className="text-sm text-gray-600">Artikler</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">{statistics.sources?.length || 0}</div>
                <div className="text-sm text-gray-600">Kilder</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">{statistics.availableTags || 0}</div>
                <div className="text-sm text-gray-600">Tags</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">{pagination.totalPages}</div>
                <div className="text-sm text-gray-600">Sider</div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <SearchBar onSearch={handleSearch} />

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredArticles.map((article, index) => (
            <ArticleCard
              key={article.article_id || index}
              article={article}
              isFavorite={favorites.includes(article.article_id)}
              onToggleFavorite={() => toggleFavorite(article.article_id)}
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
        <Navigation />
        
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
        
        <ScrollToTopButton />
        <Footer />
      </div>
    </Router>
  );
}

export default App; 