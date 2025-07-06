// Migration script to import JSON data to MariaDB database
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import databaseService from '../src/services/databaseService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateToDatabase() {
  try {
    console.log('🚀 Starting migration to database...');
    
    // Connect to database
    await databaseService.connect();
    
    // Read all JSON files
    const dataDir = path.join(__dirname, '../src/data');
    const scraperDataDir = path.join(__dirname, '../scraper/data/tagged');
    
    const jsonFiles = [
      path.join(dataDir, 'articles.json'),
      path.join(scraperDataDir, 'tagged_budgetnoerden_blog_posts.json'),
      path.join(scraperDataDir, 'tagged_mitteldorf_blog_posts.json'),
      path.join(scraperDataDir, 'tagged_moneypenny_blog_posts.json'),
      path.join(scraperDataDir, 'tagged_nordnet_blog_posts.json'),
      path.join(scraperDataDir, 'tagged_ungmedpenge_blog_posts.json')
    ];
    
    let totalArticles = 0;
    let importedArticles = 0;
    let skippedArticles = 0;
    let errorArticles = 0;
    
    for (const filePath of jsonFiles) {
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        continue;
      }
      
      console.log(`📁 Processing: ${path.basename(filePath)}`);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const articles = JSON.parse(fileContent);
        
        if (!Array.isArray(articles)) {
          console.log(`⚠️  File does not contain array: ${filePath}`);
          continue;
        }
        
        totalArticles += articles.length;
        
        for (const article of articles) {
          try {
            // Skip if no article_id
            if (!article.article_id) {
              console.log(`⚠️  Skipping article without ID: ${article.title?.substring(0, 50)}...`);
              skippedArticles++;
              continue;
            }
            
            // Import article to database
            await databaseService.importArticle(article);
            importedArticles++;
            
            if (importedArticles % 10 === 0) {
              console.log(`✅ Imported ${importedArticles} articles...`);
            }
            
          } catch (error) {
            console.error(`❌ Error importing article ${article.article_id}:`, error.message);
            errorArticles++;
          }
        }
        
      } catch (error) {
        console.error(`❌ Error reading file ${filePath}:`, error.message);
      }
    }
    
    // Get final statistics
    const stats = await databaseService.getStatistics();
    
    console.log('\n📊 Migration Summary:');
    console.log(`Total articles processed: ${totalArticles}`);
    console.log(`Successfully imported: ${importedArticles}`);
    console.log(`Skipped: ${skippedArticles}`);
    console.log(`Errors: ${errorArticles}`);
    console.log(`\nDatabase Statistics:`);
    console.log(`Total articles in DB: ${stats.total_articles}`);
    console.log(`Total sources: ${stats.total_sources}`);
    console.log(`Total tags: ${stats.total_tags}`);
    console.log(`Total audiences: ${stats.total_audiences}`);
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await databaseService.disconnect();
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateToDatabase();
}

export default migrateToDatabase; 