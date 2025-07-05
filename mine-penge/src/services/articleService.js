// Article service for handling data from Python scraper scripts and APIs
import articlesData from '../data/articles.json';

class ArticleService {
  constructor() {
    this.articles = articlesData.articles || [];
    this.metadata = articlesData.metadata || {};
    this.apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    this.cache = new Map();
    this.lastFetch = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutter
  }

  // Get all articles with pagination
  getAllArticles(page = 1, pageSize = 20) {
    // Sort articles by date (newest first) and then by source for variety
    const sortedArticles = [...this.articles].sort((a, b) => {
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
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = sortedArticles.slice(startIndex, endIndex);
    
    return {
      articles: paginatedArticles,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalArticles: this.articles.length,
        totalPages: Math.ceil(this.articles.length / pageSize),
        hasNextPage: endIndex < this.articles.length,
        hasPrevPage: page > 1
      }
    };
  }

  // Get articles by filter with pagination
  getArticlesByFilter(filters = {}, page = 1, pageSize = 20) {
    let filtered = this.articles;

    // Filter by topic/tags
    if (filters.topic) {
      filtered = filtered.filter(article => 
        article.minepenge_tags && article.minepenge_tags.some(tag => 
          tag.toLowerCase().includes(filters.topic.toLowerCase())
        )
      );
    }

    // Filter by audience
    if (filters.audience) {
      filtered = filtered.filter(article => 
        article.target_audiences && article.target_audiences.includes(filters.audience)
      );
    }

    // Filter by difficulty/complexity
    if (filters.difficulty) {
      filtered = filtered.filter(article => 
        article.complexity_level === filters.difficulty
      );
    }

    // Filter by source
    if (filters.source) {
      filtered = filtered.filter(article => 
        article.source && article.source.toLowerCase().includes(filters.source.toLowerCase())
      );
    }

    // Filter by search query
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title && article.title.toLowerCase().includes(searchLower) ||
        article.summary && article.summary.toLowerCase().includes(searchLower) ||
        (article.minepenge_tags && article.minepenge_tags.some(tag => 
          tag.toLowerCase().includes(searchLower)
        ))
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filtered.slice(startIndex, endIndex);
    
    return {
      articles: paginatedArticles,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalArticles: filtered.length,
        totalPages: Math.ceil(filtered.length / pageSize),
        hasNextPage: endIndex < filtered.length,
        hasPrevPage: page > 1
      }
    };
  }

  // Get article by ID
  getArticleById(id) {
    return this.articles.find(article => article.article_id === id);
  }

  // Get metadata
  getMetadata() {
    return this.metadata;
  }

  // Get available filters
  getAvailableFilters() {
    const allTags = new Set();
    const allAudiences = new Set();
    const allComplexities = new Set();
    const allSources = new Set();

    this.articles.forEach(article => {
      if (article.minepenge_tags) {
        article.minepenge_tags.forEach(tag => allTags.add(tag));
      }
      if (article.target_audiences) {
        article.target_audiences.forEach(audience => allAudiences.add(audience));
      }
      if (article.complexity_level) {
        allComplexities.add(article.complexity_level);
      }
      if (article.source) {
        allSources.add(article.source);
      }
    });

    return {
      tags: Array.from(allTags).sort(),
      audiences: Array.from(allAudiences).sort(),
      complexities: Array.from(allComplexities).sort(),
      sources: Array.from(allSources).sort()
    };
  }

  // Get statistics
  getStatistics() {
    const filters = this.getAvailableFilters();
    
    return {
      totalArticles: this.articles.length,
      lastUpdated: this.metadata.lastUpdated,
      sources: this.metadata.sources || [],
      articlesPerSource: this.metadata.articlesPerSource || {},
      availableTags: filters.tags.length,
      availableAudiences: filters.audiences.length,
      availableComplexities: filters.complexities.length,
      averageArticlesPerPage: 20,
      totalPages: Math.ceil(this.articles.length / 20)
    };
  }

  // Load fresh articles from articles.json
  async loadFreshArticles() {
    try {
      console.log('Loading fresh articles from articles.json...');
      
      // Check if cache is still valid
      if (this.lastFetch && (Date.now() - this.lastFetch) < this.cacheTimeout) {
        console.log('Using cached articles data');
        return this.articles;
      }

      // Try to load from API first (if available)
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/articles`);
        
        if (response.ok) {
          const freshData = await response.json();
          
          if (freshData.articles && Array.isArray(freshData.articles)) {
            this.articles = freshData.articles;
            this.metadata = freshData.metadata || {};
            this.lastFetch = Date.now();
            console.log(`Loaded ${this.articles.length} fresh articles from API`);
            return this.articles;
          }
        }
      } catch (apiError) {
        console.log('API not available, using local file');
      }

      // Fallback to local file
      const freshData = await import('../data/articles.json');
      
      if (freshData.default.articles && Array.isArray(freshData.default.articles)) {
        this.articles = freshData.default.articles;
        this.metadata = freshData.default.metadata || {};
        this.lastFetch = Date.now();
        console.log(`Loaded ${this.articles.length} fresh articles from local file`);
        return this.articles;
      } else {
        throw new Error('Invalid data format in articles.json');
      }
    } catch (error) {
      console.error('Error loading fresh articles:', error);
      throw error;
    }
  }

  // Trigger Python scraper to run
  async triggerScraper() {
    try {
      console.log('Triggering Python scraper...');
      
      const response = await fetch(`${this.apiBaseUrl}/api/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sources: this.metadata.sources || []
        })
      });
      
      if (response.ok) {
        console.log('Scraper completed successfully');
        // Load fresh articles after scraping
        return await this.loadFreshArticles();
      } else {
        throw new Error('Scraper API not available');
      }
    } catch (error) {
      console.error('Error triggering scraper:', error);
      throw new Error('Kunne ikke starte scraper. Kør scraper manuelt:\n\n1. Åbn terminal i scraper mappen\n2. Kør: python3 update_all_data.py\n3. Klik "Opdater" for at indlæse nye artikler');
    }
  }

  // Precise search function
  searchArticles(query, page = 1, pageSize = 20) {
    console.log('searchArticles called with query:', query, 'page:', page);
    
    if (!query || query.trim() === '') {
      console.log('Empty query, returning all articles');
      return this.getAllArticles(page, pageSize);
    }

    const searchLower = query.toLowerCase().trim();
    console.log('Searching for:', searchLower);
    
    // Simple and precise search
    const filtered = this.articles.filter(article => {
      const title = (article.title || '').toLowerCase();
      const summary = (article.summary || '').toLowerCase();
      const tags = (article.minepenge_tags || []).map(tag => tag.toLowerCase());
      
      // Check for exact matches in title, summary, or tags
      const titleMatch = title.includes(searchLower);
      const summaryMatch = summary.includes(searchLower);
      const tagMatch = tags.some(tag => tag.includes(searchLower));
      
      if (titleMatch || summaryMatch || tagMatch) {
        console.log('Found match in article:', article.title);
        return true;
      }
      
      return false;
    });

    console.log('Found', filtered.length, 'articles for search:', searchLower);

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filtered.slice(startIndex, endIndex);
    
    return {
      articles: paginatedArticles,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalArticles: filtered.length,
        totalPages: Math.ceil(filtered.length / pageSize),
        hasNextPage: endIndex < filtered.length,
        hasPrevPage: page > 1
      },
      searchQuery: query
    };
  }

  // Get articles by tag with pagination
  getArticlesByTag(tag, page = 1, pageSize = 20) {
    const filtered = this.articles.filter(article => 
      article.minepenge_tags && article.minepenge_tags.some(t => 
        t.toLowerCase() === tag.toLowerCase()
      )
    );

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filtered.slice(startIndex, endIndex);
    
    return {
      articles: paginatedArticles,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalArticles: filtered.length,
        totalPages: Math.ceil(filtered.length / pageSize),
        hasNextPage: endIndex < filtered.length,
        hasPrevPage: page > 1
      },
      selectedTag: tag
    };
  }

  // Get articles by source with pagination
  getArticlesBySource(source, page = 1, pageSize = 20) {
    const filtered = this.articles.filter(article => 
      article.source && article.source.toLowerCase().includes(source.toLowerCase())
    );

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filtered.slice(startIndex, endIndex);
    
    return {
      articles: paginatedArticles,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalArticles: filtered.length,
        totalPages: Math.ceil(filtered.length / pageSize),
        hasNextPage: endIndex < filtered.length,
        hasPrevPage: page > 1
      },
      selectedSource: source
    };
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    this.lastFetch = null;
  }
}

// Create singleton instance
const articleService = new ArticleService();

// Export functions for backward compatibility
export const fetchArticles = async (page = 1, pageSize = 20) => {
  try {
    await articleService.loadFreshArticles();
    return articleService.getAllArticles(page, pageSize);
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const scrapeArticles = async () => {
  try {
    return await articleService.triggerScraper();
  } catch (error) {
    console.error('Error scraping articles:', error);
    throw error;
  }
};

export const searchArticles = (query, page = 1, pageSize = 20) => {
  return articleService.searchArticles(query, page, pageSize);
};

export const getArticlesByTag = (tag, page = 1, pageSize = 20) => {
  return articleService.getArticlesByTag(tag, page, pageSize);
};

export const getArticlesByFilter = (filters, page = 1, pageSize = 20) => {
  return articleService.getArticlesByFilter(filters, page, pageSize);
};

export const getAvailableFilters = () => {
  return articleService.getAvailableFilters();
};

export const getStatistics = () => {
  return articleService.getStatistics();
};

export default articleService; 