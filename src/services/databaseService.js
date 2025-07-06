// Database service for MariaDB/MySQL on one.com hosting
import mysql from 'mysql2/promise';

class DatabaseService {
  constructor() {
    this.connection = null;
    this.config = {
      host: process.env.DB_HOST || 'minepenge.nu.mysql',
      user: process.env.DB_USER || 'your_username',
      password: process.env.DB_PASSWORD || 'your_password',
      database: process.env.DB_NAME || 'minepenge_db',
      port: process.env.DB_PORT || 3306,
      charset: 'utf8mb4',
      timezone: '+01:00', // Danish timezone
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
      multipleStatements: true
    };
  }

  async connect() {
    try {
      if (!this.connection) {
        this.connection = await mysql.createConnection(this.config);
        console.log('Database connected successfully');
      }
      return this.connection;
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
      console.log('Database disconnected');
    }
  }

  async query(sql, params = []) {
    try {
      const connection = await this.connect();
      const [rows] = await connection.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Article methods
  async getAllArticles(page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    
    const sql = `
      SELECT 
        a.*,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT ta.name) as target_audiences
      FROM articles a
      LEFT JOIN article_tags at ON a.id = at.article_id
      LEFT JOIN tags t ON at.tag_id = t.id
      LEFT JOIN article_audiences aa ON a.id = aa.article_id
      LEFT JOIN target_audiences ta ON aa.audience_id = ta.id
      WHERE a.id NOT IN (SELECT article_id FROM blacklisted_articles)
      GROUP BY a.id
      ORDER BY a.published_date DESC, a.source ASC
      LIMIT ? OFFSET ?
    `;

    const countSql = `
      SELECT COUNT(DISTINCT a.id) as total
      FROM articles a
      WHERE a.id NOT IN (SELECT article_id FROM blacklisted_articles)
    `;

    const [articles, countResult] = await Promise.all([
      this.query(sql, [pageSize, offset]),
      this.query(countSql)
    ]);

    const totalArticles = countResult[0].total;
    const totalPages = Math.ceil(totalArticles / pageSize);

    return {
      articles: articles.map(article => ({
        ...article,
        minepenge_tags: article.tags ? article.tags.split(',') : [],
        target_audiences: article.target_audiences ? article.target_audiences.split(',') : []
      })),
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalArticles: totalArticles,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  async getArticlesByTag(tag, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    
    const sql = `
      SELECT 
        a.*,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT ta.name) as target_audiences
      FROM articles a
      INNER JOIN article_tags at ON a.id = at.article_id
      INNER JOIN tags t ON at.tag_id = t.id
      LEFT JOIN article_audiences aa ON a.id = aa.article_id
      LEFT JOIN target_audiences ta ON aa.audience_id = ta.id
      WHERE t.name = ? AND a.id NOT IN (SELECT article_id FROM blacklisted_articles)
      GROUP BY a.id
      ORDER BY a.published_date DESC
      LIMIT ? OFFSET ?
    `;

    const countSql = `
      SELECT COUNT(DISTINCT a.id) as total
      FROM articles a
      INNER JOIN article_tags at ON a.id = at.article_id
      INNER JOIN tags t ON at.tag_id = t.id
      WHERE t.name = ? AND a.id NOT IN (SELECT article_id FROM blacklisted_articles)
    `;

    const [articles, countResult] = await Promise.all([
      this.query(sql, [tag, pageSize, offset]),
      this.query(countSql, [tag])
    ]);

    const totalArticles = countResult[0].total;
    const totalPages = Math.ceil(totalArticles / pageSize);

    return {
      articles: articles.map(article => ({
        ...article,
        minepenge_tags: article.tags ? article.tags.split(',') : [],
        target_audiences: article.target_audiences ? article.target_audiences.split(',') : []
      })),
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalArticles: totalArticles,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  async searchArticles(query, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    const searchTerm = `%${query}%`;
    
    const sql = `
      SELECT 
        a.*,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        GROUP_CONCAT(DISTINCT ta.name) as target_audiences
      FROM articles a
      LEFT JOIN article_tags at ON a.id = at.article_id
      LEFT JOIN tags t ON at.tag_id = t.id
      LEFT JOIN article_audiences aa ON a.id = aa.article_id
      LEFT JOIN target_audiences ta ON aa.audience_id = ta.id
      WHERE (a.title LIKE ? OR a.summary LIKE ? OR t.name LIKE ?) 
        AND a.id NOT IN (SELECT article_id FROM blacklisted_articles)
      GROUP BY a.id
      ORDER BY a.published_date DESC
      LIMIT ? OFFSET ?
    `;

    const countSql = `
      SELECT COUNT(DISTINCT a.id) as total
      FROM articles a
      LEFT JOIN article_tags at ON a.id = at.article_id
      LEFT JOIN tags t ON at.tag_id = t.id
      WHERE (a.title LIKE ? OR a.summary LIKE ? OR t.name LIKE ?) 
        AND a.id NOT IN (SELECT article_id FROM blacklisted_articles)
    `;

    const [articles, countResult] = await Promise.all([
      this.query(sql, [searchTerm, searchTerm, searchTerm, pageSize, offset]),
      this.query(countSql, [searchTerm, searchTerm, searchTerm])
    ]);

    const totalArticles = countResult[0].total;
    const totalPages = Math.ceil(totalArticles / pageSize);

    return {
      articles: articles.map(article => ({
        ...article,
        minepenge_tags: article.tags ? article.tags.split(',') : [],
        target_audiences: article.target_audiences ? article.target_audiences.split(',') : []
      })),
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalArticles: totalArticles,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  async getAvailableTags() {
    const sql = `
      SELECT name, category, COUNT(at.article_id) as article_count
      FROM tags t
      LEFT JOIN article_tags at ON t.id = at.tag_id
      LEFT JOIN articles a ON at.article_id = a.id
      WHERE a.id NOT IN (SELECT article_id FROM blacklisted_articles)
      GROUP BY t.id, t.name, t.category
      ORDER BY t.name
    `;

    const tags = await this.query(sql);
    return tags.map(tag => tag.name);
  }

  async getStatistics() {
    const sql = `
      SELECT 
        COUNT(*) as total_articles,
        COUNT(DISTINCT source) as total_sources,
        COUNT(DISTINCT t.id) as total_tags,
        COUNT(DISTINCT ta.id) as total_audiences
      FROM articles a
      LEFT JOIN article_tags at ON a.id = at.article_id
      LEFT JOIN tags t ON at.tag_id = t.id
      LEFT JOIN article_audiences aa ON a.id = aa.article_id
      LEFT JOIN target_audiences ta ON aa.audience_id = ta.id
      WHERE a.id NOT IN (SELECT article_id FROM blacklisted_articles)
    `;

    const result = await this.query(sql);
    return result[0];
  }

  // Curation methods
  async blacklistArticle(articleId, reason = 'Manual blacklist') {
    const sql = `
      INSERT INTO blacklisted_articles (article_id, reason) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE reason = VALUES(reason)
    `;
    
    return await this.query(sql, [articleId, reason]);
  }

  async unblacklistArticle(articleId) {
    const sql = 'DELETE FROM blacklisted_articles WHERE article_id = ?';
    return await this.query(sql, [articleId]);
  }

  async getBlacklistedArticles() {
    const sql = 'SELECT * FROM blacklisted_articles ORDER BY blacklisted_at DESC';
    return await this.query(sql);
  }

  // Import methods for migration
  async importArticle(articleData) {
    const connection = await this.connect();
    
    try {
      await connection.beginTransaction();

      // Insert article
      const articleSql = `
        INSERT INTO articles (article_id, title, summary, content, source, url, published_date, author, word_count, complexity_level)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          summary = VALUES(summary),
          content = VALUES(content),
          source = VALUES(source),
          url = VALUES(url),
          published_date = VALUES(published_date),
          author = VALUES(author),
          word_count = VALUES(word_count),
          complexity_level = VALUES(complexity_level)
      `;

      const articleParams = [
        articleData.article_id,
        articleData.title,
        articleData.summary,
        articleData.original_data?.content || '',
        articleData.source,
        articleData.url,
        articleData.published_date ? new Date(articleData.published_date) : null,
        articleData.original_data?.author || '',
        articleData.original_data?.word_count || 0,
        articleData.complexity_level || 'begynder'
      ];

      const articleResult = await connection.execute(articleSql, articleParams);
      const articleId = articleResult[0].insertId || articleResult[0].affectedRows;

      // Insert tags
      if (articleData.minepenge_tags && articleData.minepenge_tags.length > 0) {
        for (const tagName of articleData.minepenge_tags) {
          // Insert tag if not exists
          const tagSql = `
            INSERT INTO tags (name) VALUES (?) 
            ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)
          `;
          const tagResult = await connection.execute(tagSql, [tagName]);
          const tagId = tagResult[0].insertId;

          // Link article to tag
          const articleTagSql = `
            INSERT INTO article_tags (article_id, tag_id) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE id = id
          `;
          await connection.execute(articleTagSql, [articleId, tagId]);
        }
      }

      // Insert target audiences
      if (articleData.target_audiences && articleData.target_audiences.length > 0) {
        for (const audienceName of articleData.target_audiences) {
          // Insert audience if not exists
          const audienceSql = `
            INSERT INTO target_audiences (name) VALUES (?) 
            ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)
          `;
          const audienceResult = await connection.execute(audienceSql, [audienceName]);
          const audienceId = audienceResult[0].insertId;

          // Link article to audience
          const articleAudienceSql = `
            INSERT INTO article_audiences (article_id, audience_id) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE id = id
          `;
          await connection.execute(articleAudienceSql, [articleId, audienceId]);
        }
      }

      await connection.commit();
      return articleId;
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }
}

// Create singleton instance
const databaseService = new DatabaseService();

export default databaseService; 