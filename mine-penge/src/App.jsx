import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleAnalytics from './components/GoogleAnalytics';
import Sidebar from './components/Sidebar';
import MobileSidebar from './components/MobileSidebar';
import ArticleCard from './components/ArticleCard';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import SEODashboard from './pages/SEODashboard';
import LandingPageGenerator from './pages/LandingPageGenerator';
import QAFeedGenerator from './pages/QAFeedGenerator';
import InternalLinkStructure from './pages/InternalLinkStructure';
import EmbedWidget from './pages/EmbedWidget';
import OmOs from './pages/OmOs';
import Kontakt from './pages/Kontakt';
import HeroDemo from './pages/HeroDemo';
import FAQ from './pages/FAQ';
import ChatTest from './pages/ChatTest';
import StudentInvestmentGuide from './pages/StudentInvestmentGuide';
import FamilyFinanceGuide from './pages/FamilyFinanceGuide';
import InvesteringGuide from './pages/InvesteringGuide';
import BoligHusGuide from './pages/BoligHusGuide';
import PensionistGuide from './pages/PensionistGuide';
import TestPage from './pages/TestPage';
import HeroSectionAdvanced from './components/HeroSectionAdvanced';
import CurationPanel from './components/CurationPanel';
import ChatWidget from './components/ChatWidget';
import { fetchArticles, searchArticles, getArticlesByFilter, getStatistics, getAvailableFilters } from './services/articleService';
import curationService from './services/curationService';
import ScrollToTopButton from './components/ScrollToTopButton';
import RelatedArticles from './components/RelatedArticles';
import AdSense from './components/AdSense';
import { getPublisherId, getAdSlot } from './config/adsense';
import { generateSitemap } from './utils/sitemapGenerator';
import './index.css';

// Sitemap component
const Sitemap = () => {
  const sitemap = generateSitemap();
  
  return (
    <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
      {sitemap}
    </div>
  );
};

function App() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);

  const [selectedTopics, setSelectedTopics] = useState(['Alle tags']);
  const [filters, setFilters] = useState({
    topic: '',
    audience: ''
  });
  const [loading, setLoading] = useState(true);
  const [curationPanelOpen, setCurationPanelOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
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
    console.log('Filters:', filters);
    console.log('Current page:', pagination.currentPage);
    console.log('useEffect dependencies changed - articles, selectedTopics, filters, or pagination.currentPage');
    
    if (articles.length > 0) {
      console.log('Calling showCurrentPageArticles from useEffect');
      showCurrentPageArticles();
    } else {
      console.log('No articles available, skipping showCurrentPageArticles');
    }
  }, [articles, selectedTopics, filters, pagination.currentPage]);

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
    
    // Apply topic and audience filtering
    let filteredByTopic = nonBlacklistedArticles;
    
    // Topic filtering
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
    }
    
    // Audience filtering
    if (filters.audience) {
      console.log('Filtering by audience:', filters.audience);
      filteredByTopic = filteredByTopic.filter(article => {
        if (article.target_audiences && Array.isArray(article.target_audiences)) {
          const hasAudience = article.target_audiences.includes(filters.audience);
          if (hasAudience) {
            console.log('Article matches audience:', article.title, 'Audience:', filters.audience);
          }
          return hasAudience;
        }
        return false;
      });
      console.log('After audience filtering:', filteredByTopic.length);
    }
    
    // Sort articles by date (newest first) and then by source for variety
    const sortedArticles = [...filteredByTopic].sort((a, b) => {
      // Use the same smart date detection as articleService
      const getArticleDate = (article) => {
                 // 1. Prøv date_published (hvis det ikke er 'INGEN DATO FUNDET')
         if (article.date_published && article.date_published !== 'INGEN DATO FUNDET') {
           // Hvis det er en ISO dato (f.eks. "2020-08-05T10:36:00+00:00")
           if (article.date_published.includes('T') || article.date_published.includes('-')) {
             return new Date(article.date_published);
           }
          // Parse dansk dato format
          const danishMonths = {
            'januar': 0, 'jan': 0, 'februar': 1, 'feb': 1, 'marts': 2, 'mar': 2,
            'april': 3, 'apr': 3, 'maj': 4, 'juni': 5, 'jun': 5, 'juli': 6, 'jul': 6,
            'august': 7, 'aug': 7, 'september': 8, 'sep': 8, 'oktober': 9, 'okt': 9,
            'november': 10, 'nov': 10, 'december': 11, 'dec': 11
          };
          
          const patterns = [
            /(\d{1,2})\.\s*(\w+)\s+(\d{4})/,  // "16. juli 2024"
            /(\d{1,2})\.\s*(\w+)/,  // "5. maj" (antager nuværende år)
          ];
          
                     for (const pattern of patterns) {
             const match = article.date_published.toLowerCase().match(pattern);
             if (match) {
               const [_, day, monthName, year = new Date().getFullYear()] = match;
               const month = danishMonths[monthName];
               if (month !== undefined) {
                 // Hvis datoen ikke har år, antag at den er fra 2023 eller tidligere
                 // for at undgå at gamle artikler bliver behandlet som nye
                 const assumedYear = year === new Date().getFullYear() ? 2023 : parseInt(year);
                 return new Date(assumedYear, month, parseInt(day));
               }
             }
           }
        }
        
        // 2. Prøv URL-analyse
        if (article.url) {
          const patterns = [
            /\/(\d{4})\/(\d{2})\//,  // /2024/12/
            /\/(\d{4})-(\d{2})-(\d{2})\//,  // /2024-12-25/
            /\/(\d{4})\/(\d{2})\/(\d{2})\//  // /2024/12/25/
          ];
          
          for (const pattern of patterns) {
            const match = article.url.match(pattern);
            if (match) {
              const [_, year, month, day = '01'] = match;
              return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            }
          }
        }
        
        // 3. Brug scrape_date som fallback
        if (article.scrape_date) {
          return new Date(article.scrape_date);
        }
        
        // 4. Brug last_updated som sidste udvej
        if (article.last_updated) {
          return new Date(article.last_updated);
        }
        
        // 5. Fallback til meget gammel dato
        return new Date('2020-01-01');
      };
      
      const dateA = getArticleDate(a);
      const dateB = getArticleDate(b);
      
      // Sort by date (newest first)
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

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    console.log('=== handleFilterChange called ===');
    console.log('Filter type:', filterType, 'Value:', value);
    
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    
    // Reset to first page when changing filters
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      topic: '',
      audience: ''
    });
    setSelectedTopics(['Alle tags']);
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const loadArticles = async (page = 1) => {
    try {
      setLoading(true);
      const data = await fetchArticles(page, pagination.pageSize);
      setArticles(data.articles || []);
      setPagination(data.pagination || {});
      setStatistics(getStatistics());
      
      // Get available tags for sidebar
      const filters = getAvailableFilters();
      setAvailableTags(filters.tags || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading articles:', error);
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    
    // Auto-scroll to search bar when changing pages
    setTimeout(() => {
      const searchBar = document.querySelector('[data-testid="search-bar"]') || 
                       document.querySelector('input[type="text"]') ||
                       document.querySelector('.max-w-7xl');
      if (searchBar) {
        searchBar.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100); // Small delay to ensure state update is complete
  };

  const handleBlacklistUpdate = () => {
    // Reload articles to reflect blacklist changes
    showCurrentPageArticles();
  };

  const handleOpenMobileSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const handleCloseMobileSidebar = () => {
    setMobileSidebarOpen(false);
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
    <>
      <SEOHead 
        title="MinePenge.nu - Dansk Privatøkonomi"
        description="Få styr på pengene med guides, AI-værktøjer og inspiration til unge og børnefamilier. Lær om budget, opsparing, investering og privatøkonomi."
        keywords="privatøkonomi, budget, opsparing, investering, dansk økonomi, penge, familieøkonomi, studerende økonomi"
      />
      
      <div className="min-h-screen bg-nordic-100">
        {/* Hero Section */}
        <HeroSectionAdvanced statistics={statistics} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 lg:py-6">

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
                selectedTag={selectedTopics.length > 0 && !selectedTopics.includes('Alle tags') ? selectedTopics[0] : null}
              />
            ))}
          </div>

          {/* Related Articles - Show based on selected tag or first article */}
          {filteredArticles.length > 0 && (
            <div className="mt-8">
              <RelatedArticles 
                currentArticleId={filteredArticles[0].article_id} 
                limit={3}
              />
            </div>
          )}

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
    </>
  );

  return (
    <Router>
      <GoogleAnalytics />
      <div className="min-h-screen bg-nordic-100">
        <div className="flex flex-col lg:flex-row">
          <Sidebar 
            selectedTopics={selectedTopics}
            onTopicChange={handleTopicChange}
            availableTags={availableTags}
            articles={articles}
            onOpenMobileSidebar={handleOpenMobileSidebar}
          />
          
          <main className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/chat-test" element={<ChatTest />} />
                      <Route path="/student-investment-guide" element={<StudentInvestmentGuide />} />
        <Route path="/family-finance-guide" element={<FamilyFinanceGuide />} />
        <Route path="/investering-guide" element={<InvesteringGuide />} />
        <Route path="/bolig-hus-guide" element={<BoligHusGuide />} />
        <Route path="/pensionist-guide" element={<PensionistGuide />} />
              <Route path="/seo-dashboard" element={<SEODashboard />} />
              <Route path="/landing-page-generator" element={<LandingPageGenerator />} />
              <Route path="/qa-feed-generator" element={<QAFeedGenerator />} />
              <Route path="/internal-link-structure" element={<InternalLinkStructure />} />
              <Route path="/embed-widget" element={<EmbedWidget />} />
              <Route path="/om-os" element={<OmOs />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/hero-demo" element={<HeroDemo />} />
              <Route path="/sitemap.xml" element={<Sitemap />} />
            </Routes>
          </main>
        </div>
        
        {/* Mobile Sidebar */}
        <MobileSidebar
          selectedTopics={selectedTopics}
          onTopicChange={handleTopicChange}
          availableTags={availableTags}
          articles={articles}
          isOpen={mobileSidebarOpen}
          onClose={handleCloseMobileSidebar}
        />
        
        {/* Curation Panel - Only visible in debug mode */}
        {isDebugMode && (
          <CurationPanel 
            isOpen={curationPanelOpen}
            onClose={() => setCurationPanelOpen(false)}
            onBlacklistUpdate={handleBlacklistUpdate}
          />
        )}
        
        <ScrollToTopButton />
        <ChatWidget />
        <Footer />
      </div>
    </Router>
  );
}

export default App; 