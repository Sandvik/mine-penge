// Article service for handling data from Python scraper scripts and APIs
import testArticlesData from '../data/test_articles.json';

class ArticleService {
  constructor() {
    this.articles = testArticlesData.articles || [];
    this.metadata = {};
    this.apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    this.updateMetadata();
  }

  // Get all articles
  getAllArticles() {
    return this.articles;
  }

  // Get articles by filter
  getArticlesByFilter(filters = {}) {
    let filtered = this.articles;

    // Filter by topic
    if (filters.topic) {
      filtered = filtered.filter(article => 
        article.tags.includes(filters.topic)
      );
    }

    // Filter by audience
    if (filters.audience) {
      filtered = filtered.filter(article => 
        article.audience === filters.audience
      );
    }

    // Filter by difficulty
    if (filters.difficulty) {
      filtered = filtered.filter(article => 
        article.difficulty === filters.difficulty
      );
    }

    // Filter by search query
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.summary.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        article.source.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }

  // Get article by ID
  getArticleById(id) {
    return this.articles.find(article => article.id === id);
  }

  // Get metadata
  getMetadata() {
    return this.metadata;
  }

  // Add new article (for future use with backend)
  addArticle(article) {
    const newArticle = {
      ...article,
      id: this.getNextId(),
      publishedAt: new Date().toISOString()
    };
    this.articles.push(newArticle);
    this.updateMetadata();
    return newArticle;
  }

  // Update article
  updateArticle(id, updates) {
    const index = this.articles.findIndex(article => article.id === id);
    if (index !== -1) {
      this.articles[index] = { ...this.articles[index], ...updates };
      this.updateMetadata();
      return this.articles[index];
    }
    return null;
  }

  // Delete article
  deleteArticle(id) {
    const index = this.articles.findIndex(article => article.id === id);
    if (index !== -1) {
      this.articles.splice(index, 1);
      this.updateMetadata();
      return true;
    }
    return false;
  }

  // Get next available ID
  getNextId() {
    return Math.max(...this.articles.map(article => article.id)) + 1;
  }

  // Update metadata
  updateMetadata() {
    this.metadata = {
      totalArticles: this.articles.length,
      lastUpdated: new Date().toISOString(),
      sources: [...new Set(this.articles.map(article => article.source))],
      topics: [...new Set(this.articles.flatMap(article => article.tags))],
      audiences: [...new Set(this.articles.map(article => article.audience))],
      difficulties: [...new Set(this.articles.map(article => article.difficulty))]
    };
  }

  // Load fresh articles from test_articles.json
  async loadFreshArticles() {
    try {
      console.log('Loading fresh articles from API...');
      
      // Try to load from API first
      const response = await fetch(`${this.apiBaseUrl}/api/test-articles`);
      
      if (response.ok) {
        const freshData = await response.json();
        
        if (freshData.articles && Array.isArray(freshData.articles)) {
          this.articles = freshData.articles;
          this.updateMetadata();
          console.log(`Loaded ${this.articles.length} fresh articles from API`);
          return this.articles;
        } else {
          console.warn('Invalid data format from API');
          return this.articles; // Fallback to current data
        }
      } else {
        console.log('API not available, falling back to local file');
        // Fallback to local file
        const freshData = await import('../data/test_articles.json');
        
        if (freshData.default.articles && Array.isArray(freshData.default.articles)) {
          this.articles = freshData.default.articles;
          this.updateMetadata();
          console.log(`Loaded ${this.articles.length} fresh articles from local file`);
          return this.articles;
        } else {
          console.warn('Invalid data format from local file');
          return this.articles; // Fallback to current data
        }
      }
    } catch (error) {
      console.error('Error loading fresh articles:', error);
      return this.articles; // Fallback to current data
    }
  }

  // Trigger Python scraper to run
  async triggerScraper() {
    try {
      console.log('Triggering Python scraper...');
      
      // Try to run the scraper directly
      const response = await fetch(`${this.apiBaseUrl}/api/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sources: [
            "dr.dk", "tv2.dk", "finans.dk", "bolius.dk", "moneymum.dk", "pengepugeren.dk", "samvirke.dk",
            "nordea.com", "moneypennyandmore.dk", "kenddinepenge.dk", "styrpaabudget.dk", "lunar.app", 
            "fairkredit.dk", "privatøkonomiskrådgivning.dk", "nordlaan.dk", "collectia.dk", "goddik.dk",
            "kreditnu.dk", "danskebank.com", "pwc.dk"
          ]
        })
      });
      
      if (response.ok) {
        console.log('Scraper completed successfully');
        // Load fresh articles after scraping
        return await this.loadFreshArticles();
      } else {
        console.log('Scraper API not available, showing manual instructions');
        alert('Scraper API ikke tilgængelig. Kør scraper manuelt:\n\n1. Åbn terminal i backend mappen\n2. Kør: python main.py\n3. Klik "Opdater" for at indlæse nye artikler');
        return false;
      }
    } catch (error) {
      console.error('Error triggering scraper:', error);
      alert('Kunne ikke starte scraper. Kør scraper manuelt:\n\n1. Åbn terminal i backend mappen\n2. Kør: python main.py\n3. Klik "Opdater" for at indlæse nye artikler');
      return false;
    }
  }

  // Load articles from external source (future use)
  async loadFromAPI(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.articles = data.articles || data;
      this.updateMetadata();
      return this.articles;
    } catch (error) {
      console.error('Error loading from API:', error);
      return this.articles;
    }
  }

  // Save articles to external source (future use)
  async saveToAPI(url) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articles: this.articles,
          metadata: this.metadata
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving to API:', error);
      return false;
    }
  }

  // Export data
  exportData() {
    return {
      articles: this.articles,
      metadata: this.metadata
    };
  }

  // Import data
  importData(data) {
    if (data.articles && Array.isArray(data.articles)) {
      this.articles = data.articles;
      this.updateMetadata();
      return true;
    }
    return false;
  }

  // Get scraper status
  async getScraperStatus() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/status`);
      if (response.ok) {
        return await response.json();
      }
      return { status: 'offline' };
    } catch (error) {
      return { status: 'offline', error: error.message };
    }
  }

  // Get statistics
  getStatistics() {
    return {
      totalArticles: this.articles.length,
      sources: this.metadata.sources.length,
      topics: this.metadata.topics.length,
      lastUpdated: this.metadata.lastUpdated
    };
  }
}

// Create singleton instance
const articleService = new ArticleService();

// Export functions for App.jsx
export const fetchArticles = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/articles');
    if (response.ok) {
      const data = await response.json();
      return data.articles || data;
    } else {
      // Fallback to local data
      return articleService.getAllArticles();
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Fallback to local data
    return articleService.getAllArticles();
  }
};

export const scrapeArticles = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sources: [
          "dr.dk", "tv2.dk", "finans.dk", "bolius.dk", "moneymum.dk", "pengepugeren.dk", "samvirke.dk",
          "nordea.com", "moneypennyandmore.dk", "kenddinepenge.dk", "styrpaabudget.dk", "lunar.app", 
          "fairkredit.dk", "privatøkonomiskrådgivning.dk", "nordlaan.dk", "collectia.dk", "goddik.dk",
          "kreditnu.dk", "danskebank.com", "pwc.dk"
        ]
      })
    });
    
    if (response.ok) {
      console.log('Scraper completed successfully');
      return true;
    } else {
      console.error('Scraper failed');
      return false;
    }
  } catch (error) {
    console.error('Error scraping articles:', error);
    return false;
  }
};

export default articleService; 