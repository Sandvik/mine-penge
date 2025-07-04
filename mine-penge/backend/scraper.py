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
        
        # Danish keywords for filtering - Primary (high relevance)
        self.primary_keywords = [
            'økonomi', 'penge', 'opsparing', 'investering', 'su', 'bolig', 
            'gæld', 'pension', 'budget', 'madspild', 'studerende', 'familieøkonomi',
            'mine penge', 'privatøkonomi', 'spare', 'lån', 'rente', 'skat',
            'mentor', 'rådgivning', 'økonomisk rådgivning', 'budgetmøde', 'sparring',
            'mentorforløb', 'webinar', 'undervisning', 'økonomisk mentor',
            'pengepugeren', 'pengepuger', 'økonomisk uafhængighed', 'finansiel frihed',
            'aktiesparekonto', 'fonde', 'aktier', 'børnepenge', 'børneopsparing',
            'huskøb', 'lejlighed', 'ejendom', 'boligmarked', 'renterabat',
            'gældfri', 'gældfrihed', 'spareri', 'spareri', 'økonomisk råd',
            'pengeforvaltning', 'økonomisk planlægning', 'budgettering',
            'forbrug', 'forbrugsråd', 'sparertips', 'økonomiske tips'
        ]
        
        # Secondary keywords (medium relevance)
        self.secondary_keywords = [
            'erhverv', 'virksomhed', 'arbejde', 'job', 'løn', 'indkomst',
            'forbrug', 'køb', 'købsråd', 'tilbud', 'rabat', 'sparepenge',
            'bank', 'bankkonto', 'kreditkort', 'betaling', 'faktura',
            'forsikring', 'forsikringsråd', 'bilforsikring', 'husejerforsikring',
            'skat', 'skattefradrag', 'årsopgørelse', 'selvangivelse',
            'pension', 'pensionsopsparing', 'aldersopsparing', 'ratepension'
        ]
        
        # Negative keywords (exclude these)
        self.negative_keywords = [
            'sport', 'underholdning', 'kultur', 'politik', 'udland', 'krig',
            'terror', 'kriminalitet', 'domstol', 'retssag', 'død', 'ulykke',
            'naturkatastrofe', 'vejr', 'traffic', 'fodbold', 'tennis',
            'film', 'musik', 'bog', 'kunst', 'teater', 'festival'
        ]
        
        # Source configurations
        self.sources = {
            'dr.dk': {
                'base_url': 'https://www.dr.dk',
                'main_urls': [
                    'https://www.dr.dk/nyheder/penge',
                    'https://www.dr.dk/nyheder/erhverv',
                    'https://www.dr.dk/nyheder/indland'
                ],
                'article_selectors': ['article', '.article', '.news-item', '.teaser'],
                'title_selectors': ['h1', 'h2', '.article-title', '.teaser-title'],
                'content_selectors': ['.article-body', '.content', 'p', '.teaser-text']
            },
            'tv2.dk': {
                'base_url': 'https://nyheder.tv2.dk',
                'main_urls': [
                    'https://nyheder.tv2.dk/penge',
                    'https://nyheder.tv2.dk/erhverv',
                    'https://nyheder.tv2.dk/indland'
                ],
                'article_selectors': ['.article', '.news-item', 'article', '.teaser'],
                'title_selectors': ['h1', 'h2', '.article-title', '.teaser-title'],
                'content_selectors': ['.article-body', '.content', 'p', '.teaser-text']
            },
            'finans.dk': {
                'base_url': 'https://finans.dk',
                'main_urls': [
                    'https://finans.dk/nyheder',
                    'https://finans.dk/analyse',
                    'https://finans.dk/penge'
                ],
                'article_selectors': ['.article', '.news-item', 'article', '.teaser'],
                'title_selectors': ['h1', 'h2', '.article-title', '.teaser-title'],
                'content_selectors': ['.article-body', '.content', 'p', '.teaser-text']
            },
            'bolius.dk': {
                'base_url': 'https://bolius.dk',
                'main_urls': [
                    'https://bolius.dk/penge',
                    'https://bolius.dk/forbrug',
                    'https://bolius.dk/nyheder'
                ],
                'article_selectors': ['.article', '.news-item', 'article', '.teaser'],
                'title_selectors': ['h1', 'h2', '.article-title', '.teaser-title'],
                'content_selectors': ['.article-body', '.content', 'p', '.teaser-text']
            },
            'moneymum.dk': {
                'base_url': 'https://moneymum.dk',
                'main_urls': [
                    'https://moneymum.dk',
                    'https://moneymum.dk/blog',
                    'https://moneymum.dk/artikler'
                ],
                'article_selectors': ['.post', '.blog-post', 'article', '.entry'],
                'title_selectors': ['h1', 'h2', '.entry-title', '.post-title'],
                'content_selectors': ['.entry-content', '.post-content', '.content', 'p']
            },
            'pengepugeren.dk': {
                'base_url': 'https://pengepugeren.dk',
                'main_urls': [
                    'https://pengepugeren.dk',
                    'https://pengepugeren.dk/blog',
                    'https://pengepugeren.dk/artikler'
                ],
                'article_selectors': ['.post', '.blog-post', 'article', '.entry', '.blog-entry'],
                'title_selectors': ['h1', 'h2', '.entry-title', '.post-title', '.blog-title'],
                'content_selectors': ['.entry-content', '.post-content', '.content', '.blog-content', 'p']
            }
        }

    async def scrape_articles(self, sources: List[str], keywords: List[str] = None) -> List[Dict[str, Any]]:
        """Scrape articles from specified sources"""
        articles = []
        total_links_found = 0
        total_links_validated = 0
        
        for source in sources:
            if source in self.sources:
                try:
                    source_articles, links_found, links_validated = await self.scrape_source(source, keywords or [])
                    articles.extend(source_articles)
                    total_links_found += links_found
                    total_links_validated += links_validated
                    print(f"Scraped {len(source_articles)} articles from {source} (found {links_found} links, validated {links_validated})")
                except Exception as e:
                    print(f"Error scraping {source}: {e}")
        
        print(f"\nSummary: Found {total_links_found} total links, validated {total_links_validated}, processed {len(articles)} articles")
        return articles

    async def scrape_source(self, source: str, keywords: List[str] = None) -> tuple[List[Dict[str, Any]], int, int]:
        """Scrape articles from a specific source"""
        source_config = self.sources[source]
        articles = []
        total_links_found = 0
        total_links_validated = 0
        
        # Scrape from main URLs instead of search
        for main_url in source_config['main_urls']:
            try:
                print(f"Scraping {source} from: {main_url}")
                response = self.session.get(main_url, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                article_links = self.extract_article_links(soup, source_config)
                total_links_found += len(article_links)
                
                print(f"Found {len(article_links)} links on {main_url}")
                
                # Process each article link
                for link in article_links[:10]:  # Limit to 10 articles per URL
                    try:
                        # Validate URL before processing
                        if await self.validate_url(link):
                            total_links_validated += 1
                            article_data = await self.process_article(link, source)
                            if article_data:
                                articles.append(article_data)
                                print(f"Successfully processed: {article_data['title'][:50]}...")
                        else:
                            print(f"Skipping invalid URL: {link}")
                    except Exception as e:
                        print(f"Error processing article {link}: {e}")
                        
            except Exception as e:
                print(f"Error scraping {source} from {main_url}: {e}")
        
        return articles, total_links_found, total_links_validated

    async def validate_url(self, url: str) -> bool:
        """Validate if a URL is accessible and returns a valid response"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.head(url, timeout=10, allow_redirects=True) as response:
                    return response.status == 200
        except Exception as e:
            print(f"URL validation failed for {url}: {e}")
            return False

    def extract_article_links(self, soup: BeautifulSoup, source_config: Dict) -> List[str]:
        """Extract article links from search results"""
        links = []
        
        # Look for article links in various selectors
        for selector in source_config['article_selectors']:
            elements = soup.select(selector)
            for element in elements:
                # Find all links within the element
                link_elems = element.find_all('a', href=True)
                for link_elem in link_elems:
                    href = link_elem['href']
                    
                    # Handle relative URLs
                    if href.startswith('/'):
                        href = source_config['base_url'] + href
                    elif href.startswith('./'):
                        href = source_config['base_url'] + href[1:]
                    elif not href.startswith('http'):
                        href = source_config['base_url'] + '/' + href
                    
                    # Basic URL validation
                    if self.is_valid_url(href):
                        links.append(href)
        
        # Also look for any links that might contain article-like URLs
        all_links = soup.find_all('a', href=True)
        for link in all_links:
            href = link['href']
            
            # Handle relative URLs
            if href.startswith('/'):
                href = source_config['base_url'] + href
            elif href.startswith('./'):
                href = source_config['base_url'] + href[1:]
            elif not href.startswith('http'):
                href = source_config['base_url'] + '/' + href
            
            # Check if it looks like an article URL
            if self.is_valid_url(href) and self.looks_like_article_url(href, source_config['base_url']):
                links.append(href)
        
        return list(set(links))  # Remove duplicates

    def looks_like_article_url(self, url: str, base_url: str) -> bool:
        """Check if URL looks like an article URL"""
        # Common article URL patterns
        article_patterns = [
            '/artikel/', '/article/', '/nyhed/', '/news/',
            '/penge/', '/erhverv/', '/indland/', '/udland/',
            '/blog/', '/post/', '/entry/', '/story/',
            '/2024/', '/2023/', '/2022/', '/2021/',
            '/januar/', '/februar/', '/marts/', '/april/',
            '/maj/', '/juni/', '/juli/', '/august/',
            '/september/', '/oktober/', '/november/', '/december/'
        ]
        
        url_lower = url.lower()
        return any(pattern in url_lower for pattern in article_patterns)

    def is_valid_url(self, url: str) -> bool:
        """Basic URL validation"""
        import re
        # Check if URL has proper format
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'localhost|'  # localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        return bool(url_pattern.match(url))

    def calculate_relevance_score(self, text: str, title: str) -> float:
        """Calculate relevance score for an article"""
        text_lower = text.lower()
        title_lower = title.lower()
        
        score = 0.0
        
        # Check for negative keywords (exclude if found)
        for keyword in self.negative_keywords:
            if keyword in text_lower or keyword in title_lower:
                return 0.0  # Exclude completely
        
        # Primary keywords (high weight)
        for keyword in self.primary_keywords:
            if keyword in text_lower:
                score += 2.0
            if keyword in title_lower:
                score += 3.0  # Title matches are more important
        
        # Secondary keywords (medium weight)
        for keyword in self.secondary_keywords:
            if keyword in text_lower:
                score += 1.0
            if keyword in title_lower:
                score += 1.5
        
        # Bonus for multiple keyword matches
        primary_matches = sum(1 for keyword in self.primary_keywords if keyword in text_lower)
        if primary_matches >= 3:
            score += 2.0  # Bonus for multiple primary keywords
        
        return score

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
            
            # Calculate relevance score
            relevance_score = self.calculate_relevance_score(article.text, article.title or '')
            
            # Only include articles with minimum relevance score
            if relevance_score < 2.0:
                print(f"Article excluded due to low relevance score ({relevance_score}): {article.title}")
                return None
            
            # Generate article data
            article_data = {
                'id': self.generate_id(url),
                'title': article.title or 'Ingen titel',
                'summary': self.generate_summary(article.text),
                'tags': self.extract_tags(article.text),
                'source': source,
                'publishedAt': self.extract_publish_date(article),
                'foundAt': datetime.now().isoformat(),  # When article was found
                'audience': self.classify_audience(article.text),
                'difficulty': self.classify_difficulty(article.text),
                'url': url,
                'relevance_score': round(relevance_score, 2)
            }
            
            print(f"Article included with relevance score {relevance_score}: {article.title}")
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
        if any(word in text_lower for word in ['mentor', 'rådgivning', 'økonomisk rådgivning']):
            tags.append('rådgivning')
        if any(word in text_lower for word in ['budget', 'budgetmøde']):
            tags.append('budget')
        if any(word in text_lower for word in ['webinar', 'undervisning', 'kursus']):
            tags.append('undervisning')
        
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
        elif any(word in text_lower for word in ['mentor', 'rådgivning', 'økonomisk mentor']):
            return 'rådgivning'
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
            sources=['dr.dk', 'tv2.dk', 'moneymum.dk']
        )
        print(f"Scraped {len(articles)} articles")
        scraper.save_articles_to_json(articles)
    
    asyncio.run(test_scraper()) 