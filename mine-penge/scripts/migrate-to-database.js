#!/usr/bin/env node

// Migration script: Import JSON data to database
// Usage: node scripts/migrate-to-database.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import databaseService from '../src/services/databaseService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateToDatabase() {
  try {
    console.log('🚀 Starting migration from JSON to database...');
    
    // Initialize database
    await databaseService.initializeDatabase();
    
    // Read JSON data
    const articlesPath = path.join(__dirname, '../src/data/articles.json');
    const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8')).articles;
    
    console.log(`📊 Found ${articlesData.length} articles to migrate`);
    
    // Migrate articles
    let migrated = 0;
    let skipped = 0;
    
    for (const article of articlesData) {
      try {
        // Check if article already exists
        const existing = await databaseService.getArticleById(article.article_id);
        
        if (existing) {
          console.log(`⏭️  Skipping existing article: ${article.article_id}`);
          skipped++;
          continue;
        }
        
        // Create article in database
        await databaseService.createArticle({
          article_id: article.article_id,
          title: article.title,
          summary: article.summary,
          content: article.content,
          url: article.url,
          source: article.source,
          published_date: article.published_date || article.scraped_date,
          found_at: article.found_at,
          complexity_level: article.complexity_level || 'begynder',
          target_audiences: article.target_audiences || [],
          minepenge_tags: article.minepenge_tags || []
        });
        
        migrated++;
        console.log(`✅ Migrated: ${article.article_id}`);
        
      } catch (error) {
        console.error(`❌ Error migrating article ${article.article_id}:`, error.message);
      }
    }
    
    console.log('\n📈 Migration completed!');
    console.log(`✅ Migrated: ${migrated} articles`);
    console.log(`⏭️  Skipped: ${skipped} articles (already existed)`);
    
    // Get statistics (handle errors gracefully)
    try {
      const stats = await databaseService.getStatistics();
      console.log(`📊 Database now contains ${stats.totalArticles} articles`);
    } catch (error) {
      console.log(`📊 Database now contains ${migrated} articles (statistics unavailable)`);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await databaseService.disconnect();
  }
}

// Run migration
migrateToDatabase(); 