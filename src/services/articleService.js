// Article service with database support and JSON fallback
import databaseService from './databaseService.js';

class ArticleService {
  constructor() {
    this.useDatabase = process.env.USE_DATABASE === 'true';
    this.articles = [];
    this.loaded = false;
  }

  async loadArticles() {
    if (this.loaded) return this.articles;

    try {
      if (this.useDatabase) {
        console.log('📊 Loading articles from database...');
        const result = await databaseService.getAllArticles(1, 10000); // Load all articles
        this.articles = result.articles;
        console.log(`✅ Loaded ${this.articles.length} articles from database`);
      } else {
        console.log('📄 Loading articles from JSON files...');
        // Fallback to JSON loading
        const response = await fetch('/src/data/articles.json');
        this.articles = await response.json();
        console.log(`✅ Loaded ${this.articles.length} articles from JSON`);
      }
      
      this.loaded = true;
      return this.articles;
    } catch (error) {
      console.error('❌ Error loading articles:', error);
      // Fallback to empty array
      this.articles = [];
      this.loaded = true;
      return this.articles;
    }
  }

  async getAllArticles(page = 1, pageSize = 20) {
    if (this.useDatabase) {
      try {
        return await databaseService.getAllArticles(page, pageSize);
      } catch (error) {
        console.error('Database error, falling back to JSON:', error);
        // Fallback to JSON
        await this.loadArticles();
        return this.getArticlesFromMemory(page, pageSize);
      }
    } else {
      await this.loadArticles();
      return this.getArticlesFromMemory(page, pageSize);
    }
  }

  async getArticlesByTag(tag, page = 1, pageSize = 20) {
    if (this.useDatabase) {
      try {
        return await databaseService.getArticlesByTag(tag, page, pageSize);
      } catch (error) {
        console.error('Database error, falling back to JSON:', error);
        // Fallback to JSON
        await this.loadArticles();
        return this.getArticlesByTagFromMemory(tag, page, pageSize);
      }
    } else {
      await this.loadArticles();
      return this.getArticlesByTagFromMemory(tag, page, pageSize);
    }
  }

  async searchArticles(query, page = 1, pageSize = 20) {
    if (this.useDatabase) {
      try {
        return await databaseService.searchArticles(query, page, pageSize);
      } catch (error) {
        console.error('Database error, falling back to JSON:', error);
        // Fallback to JSON
        await this.loadArticles();
        return this.searchArticlesFromMemory(query, page, pageSize);
      }
    } else {
      await this.loadArticles();
      return this.searchArticlesFromMemory(query, page, pageSize);
    }
  }

  async getAvailableTags() {
    if (this.useDatabase) {
      try {
        return await databaseService.getAvailableTags();
      } catch (error) {
        console.error('Database error, falling back to JSON:', error);
        // Fallback to JSON
        await this.loadArticles();
        return this.getAvailableTagsFromMemory();
      }
    } else {
      await this.loadArticles();
      return this.getAvailableTagsFromMemory();
    }
  }

  async getStatistics() {
    if (this.useDatabase) {
      try {
        return await databaseService.getStatistics();
      } catch (error) {
        console.error('Database error, falling back to JSON:', error);
        // Fallback to JSON
        await this.loadArticles();
        return this.getStatisticsFromMemory();
      }
    } else {
      await this.loadArticles();
      return this.getStatisticsFromMemory();
    }
  }

  // Memory-based methods (JSON fallback)
  getArticlesFromMemory(page = 1, pageSize = 20) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = this.articles.slice(startIndex, endIndex);
    
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

  getArticlesByTagFromMemory(tag, page = 1, pageSize = 20) {
    const filteredArticles = this.articles.filter(article => 
      article.minepenge_tags && article.minepenge_tags.includes(tag)
    );
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    
    return {
      articles: paginatedArticles,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalArticles: filteredArticles.length,
        totalPages: Math.ceil(filteredArticles.length / pageSize),
        hasNextPage: endIndex < filteredArticles.length,
        hasPrevPage: page > 1
      }
    };
  }

  searchArticlesFromMemory(query, page = 1, pageSize = 20) {
    const searchTerm = query.toLowerCase();
    const filteredArticles = this.articles.filter(article => 
      article.title?.toLowerCase().includes(searchTerm) ||
      article.summary?.toLowerCase().includes(searchTerm) ||
      article.minepenge_tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    
    return {
      articles: paginatedArticles,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalArticles: filteredArticles.length,
        totalPages: Math.ceil(filteredArticles.length / pageSize),
        hasNextPage: endIndex < filteredArticles.length,
        hasPrevPage: page > 1
      }
    };
  }

  getAvailableTagsFromMemory() {
    const allTags = new Set();
    this.articles.forEach(article => {
      if (article.minepenge_tags) {
        article.minepenge_tags.forEach(tag => allTags.add(tag));
      }
    });
    return Array.from(allTags).sort();
  }

  getStatisticsFromMemory() {
    const sources = new Set();
    const tags = new Set();
    const audiences = new Set();
    
    this.articles.forEach(article => {
      if (article.source) sources.add(article.source);
      if (article.minepenge_tags) {
        article.minepenge_tags.forEach(tag => tags.add(tag));
      }
      if (article.target_audiences) {
        article.target_audiences.forEach(audience => audiences.add(audience));
      }
    });
    
    return {
      total_articles: this.articles.length,
      total_sources: sources.size,
      total_tags: tags.size,
      total_audiences: audiences.size
    };
  }

  // Curation methods
  async blacklistArticle(articleId, reason = 'Manual blacklist') {
    if (this.useDatabase) {
      try {
        return await databaseService.blacklistArticle(articleId, reason);
      } catch (error) {
        console.error('Database error:', error);
        throw error;
      }
    } else {
      // For JSON mode, we could store blacklist in localStorage
      const blacklisted = JSON.parse(localStorage.getItem('blacklistedArticles') || '[]');
      if (!blacklisted.includes(articleId)) {
        blacklisted.push(articleId);
        localStorage.setItem('blacklistedArticles', JSON.stringify(blacklisted));
      }
      return { success: true };
    }
  }

  async unblacklistArticle(articleId) {
    if (this.useDatabase) {
      try {
        return await databaseService.unblacklistArticle(articleId);
      } catch (error) {
        console.error('Database error:', error);
        throw error;
      }
    } else {
      // For JSON mode, remove from localStorage
      const blacklisted = JSON.parse(localStorage.getItem('blacklistedArticles') || '[]');
      const updated = blacklisted.filter(id => id !== articleId);
      localStorage.setItem('blacklistedArticles', JSON.stringify(updated));
      return { success: true };
    }
  }

  async getBlacklistedArticles() {
    if (this.useDatabase) {
      try {
        return await databaseService.getBlacklistedArticles();
      } catch (error) {
        console.error('Database error:', error);
        throw error;
      }
    } else {
      // For JSON mode, get from localStorage
      const blacklisted = JSON.parse(localStorage.getItem('blacklistedArticles') || '[]');
      return blacklisted.map(id => ({ article_id: id }));
    }
  }

  // Helper method to check if article is blacklisted
  isArticleBlacklisted(articleId) {
    if (this.useDatabase) {
      // This would need to be handled in the database queries
      return false;
    } else {
      const blacklisted = JSON.parse(localStorage.getItem('blacklistedArticles') || '[]');
      return blacklisted.includes(articleId);
    }
  }
}

// Create singleton instance
const articleService = new ArticleService();

export default articleService; 