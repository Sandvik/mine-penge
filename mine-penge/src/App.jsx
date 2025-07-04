import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import ArticleCard from './components/ArticleCard';
import Footer from './components/Footer';
import SEODashboard from './pages/SEODashboard';
import LandingPageGenerator from './pages/LandingPageGenerator';
import QAFeedGenerator from './pages/QAFeedGenerator';
import InternalLinkStructure from './pages/InternalLinkStructure';
import EmbedWidget from './pages/EmbedWidget';
import { fetchArticles, scrapeArticles } from './services/articleService';
import ScrollToTopButton from './components/ScrollToTopButton';
import './index.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState(['Alle tags']);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchQuery, selectedTopics]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await fetchArticles();
      setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    try {
      setScraping(true);
      await scrapeArticles();
      await loadArticles(); // Reload articles after scraping
    } catch (error) {
      console.error('Error scraping articles:', error);
    } finally {
      setScraping(false);
    }
  };

  const filterArticles = () => {
    let filtered = [...articles];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by selected topics
    if (!selectedTopics.includes('Alle tags')) {
      const selectedTag = selectedTopics[0]; // Kun 1 tag er aktivt
      
      // Mapping af sidebar tags til artikel tags/audience/difficulty
      const tagMapping = {
        'Opsparing': ['opsparing', 'spare', 'spareri'],
        'Investering': ['investering', 'aktiesparekonto', 'fonde'],
        'Gæld': ['gæld', 'lån', 'rente', 'gældfri', 'gældfrihed', 'boliglån'],
        'Budget': ['budget', 'økonomi', 'privatøkonomi'],
        'Pension': ['pension', 'pensionsopsparing', 'aldersopsparing', 'ratepension'],
        'Forsikring': ['forsikring'],
        'Bolig': ['bolig', 'huskøb', 'lejlighed', 'ejendom', 'boligmarked'],
        'Skatter': ['skat', 'skatter'],
        'Børn & Familie': ['børnefamilie', 'familieøkonomi'],
        'Studerende': ['studerende'],
        'Begynder': ['begynder'],
        'Øvet': ['øvet'],
        'Avanceret': ['avanceret']
      };

      const mappedTags = tagMapping[selectedTag] || [selectedTag.toLowerCase()];
      
      filtered = filtered.filter(article => {
        // Tjek om artiklen har et af de mappede tags
        if (article.tags && article.tags.some(tag => 
          mappedTags.some(mappedTag => tag.toLowerCase().includes(mappedTag.toLowerCase()))
        )) {
          return true;
        }
        
        // Tjek om artiklen har det valgte audience
        if (article.audience && article.audience.toLowerCase() === selectedTag.toLowerCase()) {
          return true;
        }
        
        // Tjek om artiklen har den valgte difficulty
        if (article.difficulty && article.difficulty.toLowerCase() === selectedTag.toLowerCase()) {
          return true;
        }
        
        return false;
      });
    }

    setFilteredArticles(filtered);
  };

  const handleTopicChange = (topic) => {
    setSelectedTopics([topic]);
  };

  const toggleFavorite = (articleId) => {
    setFavorites(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const HomePage = () => (
    <div className="min-h-screen bg-nordic-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-nordic-900 mb-2 sm:mb-4">
            Velkommen til MinePenge.dk
          </h1>
          <p className="text-nordic-600 text-base sm:text-lg">
            Din guide til personlig økonomi og finansiel frihed
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
          <button
            onClick={loadArticles}
            disabled={loading}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? 'Indlæser...' : 'Opdater artikler'}
          </button>
          <button
            onClick={handleScrape}
            disabled={scraping}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            {scraping ? 'Scraper...' : 'Start scraper'}
          </button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredArticles.map((article, index) => (
            <ArticleCard
              key={article.id || index}
              article={article}
              isFavorite={favorites.includes(article.id)}
              onToggleFavorite={() => toggleFavorite(article.id)}
            />
          ))}
        </div>

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
        
        <Footer />
        <ScrollToTopButton />
      </div>
    </Router>
  );
}

export default App; 