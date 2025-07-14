#!/usr/bin/env python3
"""
Article Cleaning Script for MinePenge
Removes low-value articles and improves data quality
"""

import json
import re
from pathlib import Path
from datetime import datetime

class ArticleCleaner:
    def __init__(self, articles_file="src/data/articles.json"):
        self.articles_file = Path(articles_file)
        self.backup_file = self.articles_file.with_suffix('.json.backup')
        self.articles = []
        self.removed_articles = []
        self.stats = {
            'total_before': 0,
            'total_after': 0,
            'removed': 0,
            'rules_applied': {}
        }
    
    def load_articles(self):
        """Load articles from JSON file"""
        print(f"📖 Loading articles from {self.articles_file}")
        with open(self.articles_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            self.articles = data.get('articles', [])
        self.stats['total_before'] = len(self.articles)
        print(f"✅ Loaded {self.stats['total_before']} articles")
    
    def create_backup(self):
        """Create backup of original file"""
        import shutil
        shutil.copy2(self.articles_file, self.backup_file)
        print(f"💾 Backup created: {self.backup_file}")
    
    def remove_portfolio_updates(self):
        """Remove portfolio update articles"""
        print("\n🔍 Removing portfolio update articles...")
        
        # Pattern to match portfolio update titles
        portfolio_patterns = [
            r'^Opdatering af porteføljen\s*[–-]?\s*',  # "Opdatering af porteføljen –"
            r'^Portefølje opdatering\s*[–-]?\s*',      # "Portefølje opdatering –"
            r'^Månedlig portefølje\s*[–-]?\s*',        # "Månedlig portefølje –"
        ]
        
        removed_count = 0
        filtered_articles = []
        
        for article in self.articles:
            title = article.get('title', '')
            should_remove = False
            
            for pattern in portfolio_patterns:
                if re.match(pattern, title, re.IGNORECASE):
                    should_remove = True
                    break
            
            if should_remove:
                self.removed_articles.append({
                    'title': title,
                    'url': article.get('url', ''),
                    'source': article.get('source', ''),
                    'reason': 'portfolio_update'
                })
                removed_count += 1
            else:
                filtered_articles.append(article)
        
        self.articles = filtered_articles
        self.stats['removed'] += removed_count
        self.stats['rules_applied']['portfolio_updates'] = removed_count
        
        print(f"✅ Removed {removed_count} portfolio update articles")
        return removed_count
    
    def remove_duplicate_titles(self):
        """Remove articles with duplicate titles"""
        print("\n🔍 Removing duplicate titles...")
        
        seen_titles = set()
        filtered_articles = []
        removed_count = 0
        
        for article in self.articles:
            title = article.get('title', '').strip()
            if title and title not in seen_titles:
                seen_titles.add(title)
                filtered_articles.append(article)
            else:
                self.removed_articles.append({
                    'title': title,
                    'url': article.get('url', ''),
                    'source': article.get('source', ''),
                    'reason': 'duplicate_title'
                })
                removed_count += 1
        
        self.articles = filtered_articles
        self.stats['removed'] += removed_count
        self.stats['rules_applied']['duplicate_titles'] = removed_count
        
        print(f"✅ Removed {removed_count} duplicate titles")
        return removed_count
    
    def remove_empty_articles(self):
        """Remove articles with missing essential data"""
        print("\n🔍 Removing articles with missing data...")
        
        filtered_articles = []
        removed_count = 0
        
        for article in self.articles:
            title = article.get('title', '').strip()
            url = article.get('url', '').strip()
            summary = article.get('summary', '').strip()
            
            # Remove if missing essential data
            if not title or not url or not summary:
                self.removed_articles.append({
                    'title': title,
                    'url': url,
                    'source': article.get('source', ''),
                    'reason': 'missing_data'
                })
                removed_count += 1
            else:
                filtered_articles.append(article)
        
        self.articles = filtered_articles
        self.stats['removed'] += removed_count
        self.stats['rules_applied']['missing_data'] = removed_count
        
        print(f"✅ Removed {removed_count} articles with missing data")
        return removed_count
    
    def save_articles(self):
        """Save cleaned articles back to file"""
        print(f"\n💾 Saving cleaned articles...")
        
        # Update metadata
        output_data = {
            'articles': self.articles,
            'metadata': {
                'total_articles': len(self.articles),
                'last_updated': datetime.now().isoformat(),
                'cleaning_stats': self.stats
            }
        }
        
        with open(self.articles_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        
        self.stats['total_after'] = len(self.articles)
        print(f"✅ Saved {self.stats['total_after']} articles")
    
    def save_removed_report(self):
        """Save report of removed articles"""
        report_file = Path('removed_articles_report.json')
        
        report_data = {
            'timestamp': datetime.now().isoformat(),
            'stats': self.stats,
            'removed_articles': self.removed_articles
        }
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, ensure_ascii=False, indent=2)
        
        print(f"📊 Removed articles report saved: {report_file}")
    
    def print_summary(self):
        """Print cleaning summary"""
        print("\n" + "="*50)
        print("🧹 ARTICLE CLEANING SUMMARY")
        print("="*50)
        print(f"📊 Total articles before: {self.stats['total_before']}")
        print(f"📊 Total articles after: {self.stats['total_after']}")
        print(f"🗑️  Total removed: {self.stats['removed']}")
        print(f"📈 Reduction: {self.stats['removed']/self.stats['total_before']*100:.1f}%")
        
        print("\n📋 Rules applied:")
        for rule, count in self.stats['rules_applied'].items():
            print(f"   • {rule}: {count} articles")
        
        print("\n💾 Files:")
        print(f"   • Backup: {self.backup_file}")
        print(f"   • Report: removed_articles_report.json")
        print("="*50)
    
    def run_cleaning(self):
        """Run the complete cleaning process"""
        print("🚀 Starting article cleaning process...")
        
        # Load and backup
        self.load_articles()
        self.create_backup()
        
        # Apply cleaning rules
        self.remove_portfolio_updates()
        self.remove_duplicate_titles()
        self.remove_empty_articles()
        
        # Save results
        self.save_articles()
        self.save_removed_report()
        self.print_summary()

def main():
    """Main function"""
    cleaner = ArticleCleaner()
    cleaner.run_cleaning()

if __name__ == "__main__":
    main() 