// Hybrid Database Service for MinePenge
// Automatically switches between SQLite (local) and MySQL (production)

import Database from 'better-sqlite3';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseService {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.connection = null;
    this.dbType = this.isProduction ? 'mysql' : 'sqlite';
  }

  // Initialize database connection
  async connect() {
    try {
      if (this.isProduction) {
        // MySQL for production (one.com)
        this.connection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'minepenge',
          port: process.env.DB_PORT || 3306
        });
        console.log('Connected to MySQL database');
      } else {
        // SQLite for local development
        this.connection = new Database('./database/minepenge.db');
        console.log('Connected to SQLite database');
      }
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  // Disconnect from database
  async disconnect() {
    if (this.connection) {
      if (this.isProduction) {
        await this.connection.end();
      } else {
        this.connection.close();
      }
      this.connection = null;
    }
  }

  // Execute query (handles both SQLite and MySQL)
  async query(sql, params = []) {
    if (!this.connection) {
      await this.connect();
    }

    try {
      if (this.isProduction) {
        // MySQL
        const [rows] = await this.connection.execute(sql, params);
        return rows;
      } else {
        // SQLite
        const stmt = this.connection.prepare(sql);
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          return stmt.all(params);
        } else {
          return stmt.run(params);
        }
      }
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  // Article methods
  async getArticles(page = 1, pageSize = 20, filters = {}) {
    let sql = `
      SELECT * FROM articles 
      WHERE 1=1
    `;
    const params = [];

    // Apply filters
    if (filters.source) {
      sql += ` AND source = ?`;
      params.push(filters.source);
    }

    if (filters.complexity) {
      sql += ` AND complexity_level = ?`;
      params.push(filters.complexity);
    }

    if (filters.search) {
      if (this.isProduction) {
        sql += ` AND MATCH(title, summary) AGAINST(? IN BOOLEAN MODE)`;
      } else {
        sql += ` AND (title LIKE ? OR summary LIKE ?)`;
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }
      params.push(filters.search);
    }

    // Add pagination
    const offset = (page - 1) * pageSize;
    sql += ` ORDER BY published_date DESC LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    const articles = await this.query(sql, params);
    
    // Get total count
    const countSql = sql.replace(/SELECT \*/, 'SELECT COUNT(*) as total').replace(/ORDER BY.*LIMIT.*OFFSET.*/, '');
    const countResult = await this.query(countSql, params.slice(0, -2));
    const total = this.isProduction ? countResult[0].total : countResult[0].total;

    return {
      articles: articles.map(this.formatArticle),
      pagination: {
        currentPage: page,
        pageSize,
        totalArticles: total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async getArticleById(articleId) {
    const sql = `SELECT * FROM articles WHERE article_id = ?`;
    const result = await this.query(sql, [articleId]);
    return result.length > 0 ? this.formatArticle(result[0]) : null;
  }

  async createArticle(articleData) {
    const sql = `
      INSERT INTO articles (
        article_id, title, summary, content, url, source, 
        published_date, found_at, complexity_level, 
        target_audiences, minepenge_tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      articleData.article_id,
      articleData.title,
      articleData.summary,
      articleData.content,
      articleData.url,
      articleData.source,
      articleData.published_date,
      articleData.found_at,
      articleData.complexity_level,
      JSON.stringify(articleData.target_audiences),
      JSON.stringify(articleData.minepenge_tags)
    ];

    return await this.query(sql, params);
  }

  async updateArticle(articleId, articleData) {
    const sql = `
      UPDATE articles SET 
        title = ?, summary = ?, content = ?, url = ?, 
        complexity_level = ?, target_audiences = ?, minepenge_tags = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE article_id = ?
    `;
    
    const params = [
      articleData.title,
      articleData.summary,
      articleData.content,
      articleData.url,
      articleData.complexity_level,
      JSON.stringify(articleData.target_audiences),
      JSON.stringify(articleData.minepenge_tags),
      articleId
    ];

    return await this.query(sql, params);
  }

  // Blacklist methods
  async addToBlacklist(articleId, reason = '') {
    const sql = `INSERT INTO blacklist (article_id, reason) VALUES (?, ?)`;
    return await this.query(sql, [articleId, reason]);
  }

  async removeFromBlacklist(articleId) {
    const sql = `DELETE FROM blacklist WHERE article_id = ?`;
    return await this.query(sql, [articleId]);
  }

  async getBlacklistedArticles() {
    const sql = `SELECT article_id FROM blacklist`;
    const result = await this.query(sql);
    return result.map(row => row.article_id);
  }

  async isBlacklisted(articleId) {
    const sql = `SELECT COUNT(*) as count FROM blacklist WHERE article_id = ?`;
    const result = await this.query(sql, [articleId]);
    return this.isProduction ? result[0].count > 0 : result[0].count > 0;
  }

  // Statistics methods
  async getStatistics() {
    const stats = {};
    
    try {
      // Total articles
      const totalArticles = await this.query('SELECT COUNT(*) as count FROM articles');
      stats.totalArticles = this.isProduction ? totalArticles[0].count : totalArticles[0].count;
      
      // Sources
      const sources = await this.query('SELECT DISTINCT source FROM articles');
      stats.sources = sources.map(row => row.source);
      
      // Tags - handle case where tags table doesn't exist yet
      try {
        const tags = await this.query('SELECT DISTINCT name FROM tags');
        stats.availableTags = tags.map(row => row.name);
      } catch (error) {
        // If tags table doesn't exist, extract tags from articles
        const articlesWithTags = await this.query('SELECT minepenge_tags FROM articles WHERE minepenge_tags IS NOT NULL LIMIT 100');
        const allTags = new Set();
        articlesWithTags.forEach(article => {
          if (article.minepenge_tags) {
            try {
              const tags = JSON.parse(article.minepenge_tags);
              if (Array.isArray(tags)) {
                tags.forEach(tag => allTags.add(tag));
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        });
        stats.availableTags = Array.from(allTags);
      }
      
    } catch (error) {
      console.error('Error getting statistics:', error);
      stats.totalArticles = 0;
      stats.sources = [];
      stats.availableTags = [];
    }
    
    return stats;
  }

  // Utility methods
  formatArticle(dbArticle) {
    return {
      ...dbArticle,
      target_audiences: dbArticle.target_audiences ? JSON.parse(dbArticle.target_audiences) : [],
      minepenge_tags: dbArticle.minepenge_tags ? JSON.parse(dbArticle.minepenge_tags) : [],
      publishedAt: dbArticle.published_date,
      foundAt: dbArticle.found_at
    };
  }

  // Initialize database tables
  async initializeDatabase() {
    const schema = this.isProduction ? this.getMySQLSchema() : this.getSQLiteSchema();
    
    // Split schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await this.query(statement);
        } catch (error) {
          console.log('Schema statement skipped (might already exist):', error.message);
        }
      }
    }
    
    console.log('Database initialized successfully');
  }

  getSQLiteSchema() {
    return `
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        summary TEXT,
        content TEXT,
        url TEXT NOT NULL,
        source TEXT NOT NULL,
        published_date TEXT,
        scraped_date TEXT DEFAULT CURRENT_TIMESTAMP,
        found_at TEXT,
        complexity_level TEXT DEFAULT 'begynder',
        target_audiences TEXT,
        minepenge_tags TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS blacklist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_id TEXT NOT NULL,
        reason TEXT,
        added_by TEXT DEFAULT 'admin',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_article_id ON articles(article_id);
      CREATE INDEX IF NOT EXISTS idx_source ON articles(source);
      CREATE INDEX IF NOT EXISTS idx_published_date ON articles(published_date);
    `;
  }

  getMySQLSchema() {
    return `
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id VARCHAR(255) UNIQUE NOT NULL,
        title TEXT NOT NULL,
        summary TEXT,
        content LONGTEXT,
        url VARCHAR(500) NOT NULL,
        source VARCHAR(100) NOT NULL,
        published_date DATETIME,
        scraped_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        found_at DATETIME,
        complexity_level ENUM('begynder', 'øvet', 'avanceret') DEFAULT 'begynder',
        target_audiences JSON,
        minepenge_tags JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_article_id (article_id),
        INDEX idx_source (source),
        INDEX idx_published_date (published_date),
        FULLTEXT idx_search (title, summary)
      );

      CREATE TABLE IF NOT EXISTS blacklist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id VARCHAR(255) NOT NULL,
        reason TEXT,
        added_by VARCHAR(100) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_article_id (article_id)
      );
    `;
  }
}

// Create singleton instance
const databaseService = new DatabaseService();

export default databaseService; 