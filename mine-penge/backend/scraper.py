import requests
from bs4 import BeautifulSoup
from newspaper import Article
from langdetect import detect
import hashlib
import re
from typing import List, Dict, Any
import asyncio
import aiohttp
from datetime import datetime, timedelta

class ArticleScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Danish keywords for filtering
        self.danish_keywords = [
            'økonomi', 'penge', 'opsparing', 'investering', 'su', 'bolig', 
            'gæld', 'pension', 'budget', 'madspild', 'studerende', 'familieøkonomi',
            'mine penge', 'privatøkonomi', 'spare', 'lån', 'rente', 'skat'
        ]
        
        # Source configurations
        self.sources = {
            'dr.dk': {
                'base_url': 'https://www.dr.dk',
                'search_url': 'https://www.dr.dk/sog',
                'article_selectors': ['article', '.article', '.news-item'],
                'title_selectors': ['h1', 'h2', '.article-title'],
                'content_selectors': ['.article-body', '.content', 'p']
            },
            'tv2.dk': {
                'base_url': 'https://nyheder.tv2.dk',
                'search_url': 'https://nyheder.tv2.dk/sog',
                'article_selectors': ['.article', '.news-item', 'article'],
                'title_selectors': ['h1', 'h2', '.article-title'],
                'content_selectors': ['.article-body', '.content', 'p']
            },
            'finans.dk': {
                'base_url': 'https://finans.dk',
                'search_url': 'https://finans.dk/sog',
                'article_selectors': ['.article', '.news-item', 'article'],
                'title_selectors': ['h1', 'h2', '.article-title'],
                'content_selectors': ['.article-body', '.content', 'p']
            },
            'bolius.dk': {
                'base_url': 'https://bolius.dk',
                'search_url': 'https://bolius.dk/sog',
                'article_selectors': ['.article', '.news-item', 'article'],
                'title_selectors': ['h1', 'h2', '.article-title'],
                'content_selectors': ['.article-body', '.content', 'p']
            }
        }

    async def scrape_articles(self, sources: List[str], keywords: List[str]) -> List[Dict[str, Any]]:
        """Scrape articles from specified sources"""
        articles = []
        
        for source in sources:
            if source in self.sources:
                try:
                    source_articles = await self.scrape_source(source, keywords)
                    articles.extend(source_articles)
                    print(f"Scraped {len(source_articles)} articles from {source}")
                except Exception as e:
                    print(f"Error scraping {source}: {e}")
        
        return articles

    async def scrape_source(self, source: str, keywords: List[str]) -> List[Dict[str, Any]]:
        """Scrape articles from a specific source"""
        source_config = self.sources[source]
        articles = []
        
        # Search for articles with keywords
        for keyword in keywords:
            try:
                search_url = f"{source_config['search_url']}?query={keyword}"
                response = self.session.get(search_url, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                article_links = self.extract_article_links(soup, source_config)
                
                # Process each article link
                for link in article_links[:5]:  # Limit to 5 articles per keyword
                    try:
                        article_data = await self.process_article(link, source)
                        if article_data:
                            articles.append(article_data)
                    except Exception as e:
                        print(f"Error processing article {link}: {e}")
                        
            except Exception as e:
                print(f"Error searching {source} for '{keyword}': {e}")
        
        return articles

    def extract_article_links(self, soup: BeautifulSoup, source_config: Dict) -> List[str]:
        """Extract article links from search results"""
        links = []
        
        # Look for article links in various selectors
        for selector in source_config['article_selectors']:
            elements = soup.select(selector)
            for element in elements:
                link_elem = element.find('a', href=True)
                if link_elem:
                    href = link_elem['href']
                    if href.startswith('/'):
                        href = source_config['base_url'] + href
                    links.append(href)
        
        return list(set(links))  # Remove duplicates

    async def process_article(self, url: str, source: str) -> Dict[str, Any]:
        """Process a single article URL"""
        try:
            # Use newspaper3k to extract article content
            article = Article(url, language='da')
            article.download()
            article.parse()
            
            # Check if article is in Danish
            if not article.text or detect(article.text) != 'da':
                return None
            
            # Check if article contains relevant keywords
            text_lower = article.text.lower()
            if not any(keyword in text_lower for keyword in self.danish_keywords):
                return None
            
            # Generate article data
            article_data = {
                'id': self.generate_id(url),
                'title': article.title or 'Ingen titel',
                'summary': self.generate_summary(article.text),
                'tags': self.extract_tags(article.text),
                'source': source,
                'publishedAt': self.extract_publish_date(article),
                'audience': self.classify_audience(article.text),
                'difficulty': self.classify_difficulty(article.text),
                'url': url
            }
            
            return article_data
            
        except Exception as e:
            print(f"Error processing article {url}: {e}")
            return None

    def generate_id(self, url: str) -> int:
        """Generate a unique ID for the article"""
        return int(hashlib.md5(url.encode()).hexdigest()[:8], 16)

    def generate_summary(self, text: str) -> str:
        """Generate a summary of the article"""
        # Simple summary: take first 200 characters
        summary = text[:200].strip()
        if len(text) > 200:
            summary += "..."
        return f"AI-resumé: {summary}"

    def extract_tags(self, text: str) -> List[str]:
        """Extract relevant tags from article text"""
        tags = []
        text_lower = text.lower()
        
        # Topic tags
        if any(word in text_lower for word in ['opsparing', 'spare', 'sparer']):
            tags.append('opsparing')
        if any(word in text_lower for word in ['su', 'studerende', 'studie']):
            tags.append('su')
        if any(word in text_lower for word in ['bolig', 'hus', 'lejlighed', 'ejendom']):
            tags.append('bolig')
        if any(word in text_lower for word in ['investering', 'aktier', 'fonde']):
            tags.append('investering')
        if any(word in text_lower for word in ['gæld', 'lån', 'skylder']):
            tags.append('gæld')
        if any(word in text_lower for word in ['pension', 'pensionsopsparing']):
            tags.append('pension')
        
        # Default tag if none found
        if not tags:
            tags.append('økonomi')
        
        return tags

    def classify_audience(self, text: str) -> str:
        """Classify the target audience"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['studerende', 'su', 'universitet']):
            return 'studerende'
        elif any(word in text_lower for word in ['familie', 'børn', 'børnefamilie']):
            return 'børnefamilie'
        elif any(word in text_lower for word in ['pensionist', 'pension']):
            return 'pensionist'
        else:
            return 'bred'

    def classify_difficulty(self, text: str) -> str:
        """Classify the difficulty level"""
        # Simple classification based on text length and complexity
        word_count = len(text.split())
        
        if word_count < 500:
            return 'begynder'
        elif word_count < 1000:
            return 'øvet'
        else:
            return 'avanceret'

    def extract_publish_date(self, article: Article) -> str:
        """Extract publish date from article"""
        try:
            if article.publish_date:
                # Calculate relative time
                now = datetime.now()
                diff = now - article.publish_date
                
                if diff.days == 0:
                    hours = diff.seconds // 3600
                    if hours == 0:
                        return "Lige nu"
                    elif hours == 1:
                        return "1 time siden"
                    else:
                        return f"{hours} timer siden"
                elif diff.days == 1:
                    return "1 dag siden"
                else:
                    return f"{diff.days} dage siden"
            else:
                return "Ukendt dato"
        except:
            return "Ukendt dato"

    def deduplicate_articles(self, articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate articles based on URL"""
        seen_urls = set()
        unique_articles = []
        
        for article in articles:
            if article['url'] not in seen_urls:
                seen_urls.add(article['url'])
                unique_articles.append(article)
        
        return unique_articles

    def save_articles_to_json(self, articles: List[Dict[str, Any]], filename: str = "scraped_articles.json"):
        """Save scraped articles to JSON file"""
        data = {
            "articles": articles,
            "metadata": {
                "totalArticles": len(articles),
                "lastUpdated": datetime.now().isoformat(),
                "sources": list(set(article["source"] for article in articles)),
                "topics": list(set(tag for article in articles for tag in article["tags"])),
                "audiences": list(set(article["audience"] for article in articles)),
                "difficulties": list(set(article["difficulty"] for article in articles))
            }
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            import json
            json.dump(data, f, ensure_ascii=False, indent=2)

# Example usage
if __name__ == "__main__":
    scraper = ArticleScraper()
    
    async def test_scraper():
        articles = await scraper.scrape_articles(
            sources=['dr.dk', 'tv2.dk'],
            keywords=['økonomi', 'opsparing']
        )
        print(f"Scraped {len(articles)} articles")
        scraper.save_articles_to_json(articles)
    
    asyncio.run(test_scraper()) 