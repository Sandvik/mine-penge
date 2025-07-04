import requests
from bs4 import BeautifulSoup
from newspaper import Article
from langdetect import detect
import hashlib
import re
from typing import List, Dict, Any, Tuple
import asyncio
import aiohttp
from datetime import datetime, timedelta
import urllib3
import ssl
import certifi
import time
from collections import defaultdict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Disable SSL verification globally for newspaper3k and requests
ssl._create_default_https_context = ssl._create_unverified_context
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class ArticleScraper:
    def __init__(self):
        # Optimize session with connection pooling
        self.session = requests.Session()
        adapter = requests.adapters.HTTPAdapter(
            pool_connections=10,
            pool_maxsize=20,
            max_retries=3
        )
        self.session.mount('http://', adapter)
        self.session.mount('https://', adapter)
        
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.session.verify = False
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        
        # Add rate limiting per source
        self.rate_limiters = defaultdict(float)
        
        # Cache for URL validation
        self.url_validation_cache = {}
        
        # Danish keywords for filtering - Primary (high relevance for personal finance)
        self.primary_keywords = [
            'privatøkonomi', 'mine penge', 'opsparing', 'spare', 'budget', 
            'familieøkonomi', 'husholdningsøkonomi', 'pengeforvaltning',
            'økonomisk råd', 'økonomisk rådgivning', 'pengepugeren', 'pengepuger',
            'økonomisk uafhængighed', 'finansiel frihed', 'gældfri', 'gældfrihed',
            'spareri', 'sparertips', 'økonomiske tips', 'penge tips',
            'aktiesparekonto', 'børnepenge', 'børneopsparing', 'pensionsopsparing',
            'aldersopsparing', 'ratepension', 'folkepension', 'su', 'studerende',
            'bolig', 'huskøb', 'lejlighed', 'ejendom', 'boligmarked', 'renterabat',
            'gæld', 'lån', 'rente', 'skat', 'skattefradrag', 'årsopgørelse',
            'forbrug', 'forbrugsråd', 'madspild', 'købsråd', 'tilbud', 'rabat',
            'forsikring', 'forsikringsråd', 'bilforsikring', 'husejerforsikring',
            'bank', 'bankkonto', 'kreditkort', 'betaling', 'faktura'
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
        
        # Negative keywords (exclude these) - more specific to avoid false positives
        self.negative_keywords = [
            'sport', 'underholdning', 'kultur', 'politik', 'udland', 'krig',
            'terror', 'kriminalitet', 'domstol', 'retssag', 'død', 'ulykke',
            'naturkatastrofe', 'vejr', 'fodbold', 'tennis', 'basketball',
            'film', 'musik', 'bog', 'kunst', 'teater', 'festival',
            'kongehus', 'royal', 'prins', 'prinsesse', 'konge', 'dronning',
            # Exclude professional finance news
            'børs', 'børsnotering', 'ipo', 'fusion', 'overtagelse', 'm&a',
            'analytiker', 'analytikere', 'kursmål', 'anbefaling', 'køb', 'sælg',
            'hold', 'aktieanbefaling', 'investeringsbank', 'sælger', 'køber',
            'trading', 'day trading', 'derivater', 'optioner', 'futures',
            'hedge fund', 'private equity', 'venture capital', 'crowdfunding'
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
                'article_selectors': ['article', '.article', '.news-item', '.teaser', '.teaser-list-item', '.teaser-list__item', '.teaser__link'],
                'title_selectors': ['h1', 'h2', '.article-title', '.teaser-title'],
                'content_selectors': ['.article-body', '.content', 'p', '.teaser-text']
            },
            'moneypennyandmore.dk': {
                'base_url': 'https://moneypennyandmore.dk',
                'main_urls': [
                    'https://moneypennyandmore.dk/blog',
                    'https://moneypennyandmore.dk/artikler',
                    'https://moneypennyandmore.dk'
                ],
                'article_selectors': [
                    'article', '.article', '.blog-post', '.post', '.entry', '.indlæg', '.blog-entry', '.post-item',
                    '.blog', '.blog-item', '.post-item', '.entry-item', '.content-item',
                    'div[class*="blog"]', 'div[class*="post"]', 'div[class*="entry"]',
                    'section[class*="blog"]', 'section[class*="post"]'
                ],
                'title_selectors': [
                    'h1', 'h2', 'h3', '.article-title', '.blog-title', '.post-title', '.entry-title', '.post-heading',
                    '.title', '.headline', '.post-heading', '.entry-heading'
                ],
                'content_selectors': [
                    '.article-body', '.blog-content', '.post-content', '.entry-content', '.content', '.post-body',
                    '.article-text', '.blog-text', '.post-text', '.entry-text', 'p'
                ],
                'link_selectors': [
                    'a[href*="/blog/"]', 'a[href*="/artikler/"]', 'a[href*="blog/"]',
                    '.post-link', '.blog-link', '.entry-link', '.article-link',
                    'a[class*="blog"]', 'a[class*="post"]', 'a[class*="entry"]',
                    'a[href*="moneypennyandmore.dk/blog"]'
                ]
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
                    'https://finans.dk/privatoekonomi',
                    'https://finans.dk/penge',
                    'https://finans.dk/forbrug'
                ],
                'article_selectors': ['.article', '.news-item', 'article', '.teaser', '.news-teaser', '.article-teaser', '.post'],
                'title_selectors': ['h1', 'h2', '.article-title', '.teaser-title', '.post-title'],
                'content_selectors': ['.article-body', '.content', 'p', '.teaser-text', '.post-content']
            },
            'bolius.dk': {
                'base_url': 'https://bolius.dk',
                'main_urls': [
                    'https://bolius.dk',
                    'https://bolius.dk/forbrug',
                    'https://bolius.dk/nyheder'
                ],
                'article_selectors': ['.article', '.news-item', 'article', '.teaser', '.post', '.blog-post'],
                'title_selectors': ['h1', 'h2', '.article-title', '.teaser-title', '.post-title'],
                'content_selectors': ['.article-body', '.content', 'p', '.teaser-text', '.post-content']
            },
            'moneymum.dk': {
                'base_url': 'https://moneymum.dk',
                'main_urls': [
                    'https://moneymum.dk',
                    'https://moneymum.dk/vidensbank',
                    'https://moneymum.dk/online-kurser'
                ],
                'article_selectors': ['.post', '.blog-post', 'article', '.entry', '.page', '.content'],
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
            },
            # ... (keep all your other sources exactly as they are)
        }

    async def scrape_articles(self, sources: List[str], keywords: List[str] = None, max_concurrent: int = 5) -> List[Dict[str, Any]]:
        """Scrape articles from specified sources with async optimization"""
        # Create semaphore for concurrent processing
        semaphore = asyncio.Semaphore(max_concurrent)
        
        # Create async HTTP session
        async with aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            connector=aiohttp.TCPConnector(limit=50, limit_per_host=10)
        ) as session:
            
            # Create tasks for each source
            tasks = []
            for source in sources:
                if source in self.sources:
                    task = self._scrape_source_async(semaphore, session, source, keywords or [])
                    tasks.append(task)
            
            # Execute all tasks concurrently
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Collect articles from successful results
            articles = []
            total_links_found = 0
            total_links_validated = 0
            
            for result in results:
                if isinstance(result, tuple):  # (articles, links_found, links_validated)
                    source_articles, links_found, links_validated = result
                    articles.extend(source_articles)
                    total_links_found += links_found
                    total_links_validated += links_validated
                elif isinstance(result, Exception):
                    logger.error(f"Source scraping failed: {result}")
        
        print(f"\nSummary: Found {total_links_found} total links, validated {total_links_validated}, processed {len(articles)} articles")
        
        # Deduplicate articles before returning
        print(f"\n=== Deduplicating articles ===")
        articles = self.deduplicate_articles(articles)
        
        return articles

    async def _scrape_source_async(self, semaphore: asyncio.Semaphore, session: aiohttp.ClientSession, source: str, keywords: List[str]) -> Tuple[List[Dict[str, Any]], int, int]:
        """Async version of scrape_source with semaphore protection"""
        async with semaphore:
            return await self._scrape_source_implementation(session, source, keywords)

    async def _scrape_source_implementation(self, session: aiohttp.ClientSession, source: str, keywords: List[str]) -> Tuple[List[Dict[str, Any]], int, int]:
        """Async implementation of source scraping"""
        source_config = self.sources[source]
        articles = []
        total_links_found = 0
        total_links_validated = 0
        
        print(f"\n=== Starting to scrape {source} ===")
        
        # Rate limiting
        await self._rate_limit_async(source)
        
        # Scrape from main URLs
        for main_url in source_config['main_urls']:
            try:
                print(f"Scraping {source} from: {main_url}")
                
                async with session.get(main_url, ssl=False) as response:
                    if response.status != 200:
                        continue
                    
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    article_links = self.extract_article_links(soup, source_config)
                    total_links_found += len(article_links)
                    
                    print(f"Found {len(article_links)} links on {main_url}")
                    if len(article_links) > 0:
                        print(f"Sample links: {article_links[:3]}")
                    
                    # Process each article link concurrently in batches
                    batch_size = 5
                    for i in range(0, min(len(article_links), 10), batch_size):
                        batch = article_links[i:i + batch_size]
                        batch_tasks = []
                        
                        for link in batch:
                            if await self.validate_url_cached(link):
                                total_links_validated += 1
                                task = self._process_article_async(session, link, source)
                                batch_tasks.append(task)
                        
                        # Process batch concurrently
                        if batch_tasks:
                            batch_results = await asyncio.gather(*batch_tasks, return_exceptions=True)
                            for result in batch_results:
                                if isinstance(result, dict):
                                    articles.append(result)
                                    print(f"Successfully processed: {result['title'][:50]}...")
                                elif isinstance(result, Exception):
                                    print(f"Error processing article: {result}")
                        
                        # Small delay between batches
                        await asyncio.sleep(0.1)
                        
            except Exception as e:
                print(f"Error scraping {source} from {main_url}: {e}")
        
        print(f"=== Finished scraping {source}: {len(articles)} articles, {total_links_found} links found, {total_links_validated} validated ===")
        return articles, total_links_found, total_links_validated

    async def _rate_limit_async(self, source: str, delay: float = 1.0):
        """Async rate limiting per source"""
        now = time.time()
        last_request = self.rate_limiters[source]
        
        if last_request > 0:
            time_since_last = now - last_request
            if time_since_last < delay:
                await asyncio.sleep(delay - time_since_last)
        
        self.rate_limiters[source] = time.time()

    async def validate_url_cached(self, url: str) -> bool:
        """Cached URL validation to avoid redundant checks"""
        if url in self.url_validation_cache:
            return self.url_validation_cache[url]
        
        # Basic URL format validation (fast)
        is_valid = self.is_valid_url(url)
        self.url_validation_cache[url] = is_valid
        return is_valid

    async def _process_article_async(self, session: aiohttp.ClientSession, url: str, source: str) -> Dict[str, Any]:
        """Async version of process_article with better error handling"""
        try:
            # Try multiple extraction methods
            article_data = None
            
            # Method 1: Try newspaper3k with async session
            try:
                async with session.get(url, ssl=False) as response:
                    if response.status == 200:
                        html = await response.text()
                        article_data = await self._extract_with_newspaper_async(url, html)
            except Exception as e:
                logger.warning(f"Newspaper extraction failed for {url}: {e}")
            
            # Method 2: Fallback to BeautifulSoup extraction
            if not article_data:
                try:
                    async with session.get(url, ssl=False) as response:
                        if response.status == 200:
                            html = await response.text()
                            article_data = self._extract_with_beautifulsoup(url, html, source)
                except Exception as e:
                    logger.warning(f"BeautifulSoup extraction failed for {url}: {e}")
            
            return article_data if article_data else None
            
        except Exception as e:
            print(f"Error processing article {url}: {e}")
            return None

    async def _extract_with_newspaper_async(self, url: str, html: str) -> Dict[str, Any]:
        """Extract content using newspaper3k asynchronously"""
        try:
            article = Article(url, language='da')
            article.set_html(html)
            article.parse()
            
            # Check if article is in Danish and has content
            if not article.text or len(article.text) < 100:
                return None
            
            try:
                if detect(article.text) != 'da':
                    return None
            except:
                # If language detection fails, continue anyway
                pass
            
            # Calculate relevance score
            relevance_score = self.calculate_relevance_score(article.text, article.title or '')
            
            if relevance_score < 5.0:
                return None
            
            return {
                'id': self.generate_id(url),
                'title': article.title or 'Ingen titel',
                'summary': self.generate_summary(article.text),
                'tags': self.extract_tags(article.text),
                'source': url.split('/')[2],  # Extract domain as source
                'publishedAt': self.extract_publish_date(article),
                'foundAt': datetime.now().isoformat(),
                'audience': self.classify_audience(article.text),
                'difficulty': self.classify_difficulty(article.text),
                'url': url,
                'relevance_score': round(relevance_score, 2)
            }
            
        except Exception as e:
            logger.warning(f"Newspaper extraction error for {url}: {e}")
            return None

    def _extract_with_beautifulsoup(self, url: str, html: str, source: str) -> Dict[str, Any]:
        """Fallback extraction using BeautifulSoup"""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            
            # Remove unwanted elements
            for element in soup(['script', 'style', 'nav', 'footer', 'aside', 'header']):
                element.decompose()
            
            # Extract title
            title = ''
            for selector in ['h1', '.article-title', '.post-title', '.entry-title', 'title']:
                title_elem = soup.select_one(selector)
                if title_elem:
                    title = title_elem.get_text(strip=True)
                    if len(title) > 10:  # Ensure we have a meaningful title
                        break
            
            # Extract content
            content = ''
            for selector in ['article', '.article-content', '.post-content', '.entry-content', '.content', 'main']:
                content_elem = soup.select_one(selector)
                if content_elem:
                    content = content_elem.get_text(separator=' ', strip=True)
                    if len(content) > 200:  # Ensure we have meaningful content
                        break
            
            if not title or not content or len(content) < 200:
                return None
            
            # Check language
            try:
                if detect(content) != 'da':
                    return None
            except:
                pass
            
            # Calculate relevance score
            relevance_score = self.calculate_relevance_score(content, title)
            
            if relevance_score < 5.0:
                return None
            
            return {
                'id': self.generate_id(url),
                'title': title,
                'summary': self.generate_summary(content),
                'tags': self.extract_tags(content),
                'source': source,
                'publishedAt': 'Ukendt dato',
                'foundAt': datetime.now().isoformat(),
                'audience': self.classify_audience(content),
                'difficulty': self.classify_difficulty(content),
                'url': url,
                'relevance_score': round(relevance_score, 2)
            }
            
        except Exception as e:
            logger.warning(f"BeautifulSoup extraction error for {url}: {e}")
            return None

    # Keep all your existing methods exactly as they are:
    def extract_article_links(self, soup: BeautifulSoup, source_config: Dict) -> List[str]:
        """Extract article links from search results"""
        links = []
        
        print(f"Trying to extract links with selectors: {source_config['article_selectors']}")
        
        # Look for article links in various selectors
        for selector in source_config['article_selectors']:
            elements = soup.select(selector)
            print(f"Selector '{selector}' found {len(elements)} elements")
            
            for element in elements:
                # Method 1: Find all links within the element
                link_elements = element.find_all('a', href=True)
                for link_elem in link_elements:
                    href = link_elem.get('href')
                    if href:
                        # Make relative URLs absolute and fix double slashes
                        if href.startswith('/'):
                            href = source_config['base_url'].rstrip('/') + href
                        elif not href.startswith('http'):
                            href = source_config['base_url'].rstrip('/') + '/' + href.lstrip('/')
                        
                        # Clean up any double slashes (except in protocol)
                        href = re.sub(r'(https?://[^/]+)/+', r'\1/', href)
                        
                        # Check if it looks like an article URL
                        if self.is_valid_url(href) and self.looks_like_article_url(href, source_config['base_url']):
                            if href not in links:
                                links.append(href)
                                print(f"Added article link: {href}")
                
                # Method 2: Check if the element itself is a link
                if element.name == 'a' and element.get('href'):
                    href = element.get('href')
                    if href.startswith('/'):
                        href = source_config['base_url'].rstrip('/') + href
                    elif not href.startswith('http'):
                        href = source_config['base_url'].rstrip('/') + '/' + href.lstrip('/')
                    
                    # Clean up any double slashes (except in protocol)
                    href = re.sub(r'(https?://[^/]+)/+', r'\1/', href)
                    
                    if self.is_valid_url(href) and self.looks_like_article_url(href, source_config['base_url']):
                        if href not in links:
                            links.append(href)
                            print(f"Added article link (element itself): {href}")
        
        # Special handling for Moneypenny and More
        if not links and 'moneypennyandmore.dk' in source_config['base_url']:
            print("Trying special Moneypenny blog link extraction...")
            
            # Method 1: Look for any links containing 'blog' in the href
            blog_links = soup.find_all('a', href=lambda x: x and 'blog' in x)
            print(f"Found {len(blog_links)} links with 'blog' in href")
            
            for link in blog_links:
                href = link.get('href')
                if href:
                    # Fix double slashes and normalize URL
                    if href.startswith('/'):
                        href = source_config['base_url'].rstrip('/') + href
                    elif not href.startswith('http'):
                        href = source_config['base_url'].rstrip('/') + '/' + href.lstrip('/')
                    
                    # Clean up any double slashes (except in protocol)
                    href = re.sub(r'(https?://[^/]+)/+', r'\1/', href)
                    
                    # For Moneypenny, accept any URL with /blog/ in it
                    if '/blog/' in href and href not in links:
                        links.append(href)
                        print(f"Added Moneypenny blog link: {href}")
            
            # Method 2: Add known articles as fallback
            if not links:
                try:
                    from moneypenny_articles import add_known_articles_to_links
                    links = add_known_articles_to_links(links, source_config['base_url'])
                except ImportError:
                    print("moneypenny_articles module not found, skipping known articles fallback")
        
        print(f"Total unique article links found: {len(links)}")
        return links

    def looks_like_article_url(self, url: str, base_url: str) -> bool:
        """Check if URL looks like an article URL"""
        # Common article URL patterns
        article_patterns = [
            '/artikel/', '/article/', '/nyhed/', '/news/',
            '/penge/', '/erhverv/', '/indland/', '/udland/',
            '/blog/', '/post/', '/entry/', '/story/',
            '/2024/', '/2023/', '/2022/', '/2021/', '/2025/',
            '/januar/', '/februar/', '/marts/', '/april/',
            '/maj/', '/juni/', '/juli/', '/august/',
            '/september/', '/oktober/', '/november/', '/december/',
            # Add more patterns for Danish sites
            '/analyse/', '/kommentar/', '/debate/', '/debatt/',
            '/privatøkonomi/', '/privatoekonomi/', '/oekonomi/',
            '/forbrug/', '/forbrugogliv/', '/investor/',
            # Moneypenny and More specific patterns
            '/blog/', '/artikler/', '/indlæg/', '/post/',
            # Date patterns
            r'/\d{4}-\d{2}-\d{2}/',  # YYYY-MM-DD
            r'/\d{2}-\d{2}-\d{4}/',  # DD-MM-YYYY
        ]
        
        url_lower = url.lower()
        
        # Check for article patterns
        for pattern in article_patterns:
            if pattern in url_lower:
                return True
        
        # Check for date patterns using regex
        import re
        for pattern in [r'/\d{4}-\d{2}-\d{2}/', r'/\d{2}-\d{2}-\d{4}/']:
            if re.search(pattern, url_lower):
                return True
        
        # If URL is from the same domain and has a reasonable length, consider it
        if base_url in url and len(url) > len(base_url) + 10:
            # Exclude obvious non-article URLs
            exclude_patterns = [
                '/search', '/søg', '/login', '/log-ind', '/admin',
                '/category', '/kategori', '/tag', '/arkiv',
                '/rss', '/feed', '/sitemap', '/robots.txt',
                '/events', '/shop', '/priser', '/om-medlemsklubben',
                '/kontakt', '/foredrag', '/coaching', '/presse',
                '/faq', '/handelsbetingelser', '/gdpr',
                '/book-coaching', '/mine-medlemssider', '/store/',
                '.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc'
            ]
            
            for pattern in exclude_patterns:
                if pattern in url_lower:
                    return False
            
            # If it passes all checks, consider it an article
            return True
        
        return False

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
        """Calculate relevance score for an article with improved accuracy"""
        text_lower = text.lower()
        title_lower = title.lower()
        
        score = 0.0
        
        # Check for negative keywords (exclude if found)
        for keyword in self.negative_keywords:
            if keyword in text_lower or keyword in title_lower:
                return 0.0  # Exclude completely
        
        # Primary keywords (high weight) - økonomi-relaterede
        primary_matches = 0
        for keyword in self.primary_keywords:
            if keyword in text_lower:
                score += 4.0  # Increased weight
                primary_matches += 1
            if keyword in title_lower:
                score += 6.0  # Title matches are more important
                primary_matches += 1
        
        # Secondary keywords (medium weight)
        secondary_matches = 0
        for keyword in self.secondary_keywords:
            if keyword in text_lower:
                score += 2.0  # Increased weight
                secondary_matches += 1
            if keyword in title_lower:
                score += 3.0  # Increased weight
        
        # Bonus for multiple keyword matches
        if primary_matches >= 3:
            score += 8.0  # Increased bonus for multiple primary keywords
        elif primary_matches >= 2:
            score += 5.0
        elif primary_matches >= 1:
            score += 2.0
        
        # Bonus for specific high-value topics
        high_value_topics = [
            'bolig', 'huskøb', 'lejlighed', 'ejendom', 'boligmarked',
            'investering', 'aktier', 'fonde', 'aktiesparekonto',
            'pension', 'pensionsopsparing', 'aldersopsparing',
            'su', 'studerende', 'studielån',
            'gæld', 'lån', 'boliglån', 'realkredit',
            'opsparing', 'spare', 'børneopsparing',
            'bank', 'kreditkort', 'mobilepay',
            'skat', 'skattefradrag', 'årsopgørelse',
            'rente', 'rentesænkning', 'nationalbank',
            'forbrug', 'forbruger', 'tilbud', 'rabat',
            'forsikring', 'bilforsikring', 'husejerforsikring',
            'mentor', 'rådgivning', 'økonomisk rådgivning',
            'budget', 'budgetmøde', 'sparring',
            'webinar', 'undervisning', 'kursus',
            'familie', 'børn', 'børnefamilie',
            'madspild', 'madbudget',
            'erhverv', 'virksomhed', 'arbejde', 'job', 'løn',
            'bitcoin', 'krypto', 'guld', 'sølv', 'råvarer'
        ]
        
        for topic in high_value_topics:
            if topic in text_lower:
                score += 3.0  # Increased weight
            if topic in title_lower:
                score += 4.0  # Increased weight
        
        # Penalty for very short articles
        if len(text) < 500:
            score *= 0.7  # Less harsh penalty
        
        # Bonus for longer, more detailed articles
        if len(text) > 2000:
            score += 3.0  # Increased bonus
        
        # Minimum base score for økonomi-related content
        if score > 0:
            score += 5.0  # Base score for relevant content
        
        return score

    def generate_id(self, url: str) -> int:
        """Generate a unique ID for the article"""
        return int(hashlib.md5(url.encode()).hexdigest()[:8], 16)

    def generate_summary(self, text: str) -> str:
        """Generate a summary of the article"""
        # Clean text and take first 200 characters
        clean_text = text.replace('\n', ' ').replace('\r', ' ').strip()
        # Remove multiple spaces
        import re
        clean_text = re.sub(r'\s+', ' ', clean_text)
        
        # Check if text is too short or seems like a template
        if len(clean_text) < 50:
            return "AI-resumé: Artikel tekst ikke tilgængelig"
        
        # Remove common prefixes that might appear in all articles
        prefixes_to_remove = [
            'NYHEDER', 'PENGE', 'BUSINESS', 'FINANS', 'ØKONOMI',
            'AI-resumé:', 'Resumé:', 'Summary:', 'Eksplosive kursstigninger',
            'danske investorer flokkes om aktier med eksplosive kursstigninger'
        ]
        
        for prefix in prefixes_to_remove:
            if clean_text.upper().startswith(prefix.upper()):
                clean_text = clean_text[len(prefix):].strip()
        
        # Find the first meaningful sentence
        sentences = re.split(r'[.!?]+', clean_text)
        meaningful_sentence = ""
        
        for sentence in sentences:
            sentence = sentence.strip()
            if len(sentence) > 20 and not sentence.isupper():  # Skip very short or all-caps sentences
                meaningful_sentence = sentence
                break
        
        if meaningful_sentence:
            summary = meaningful_sentence[:200].strip()
            if len(meaningful_sentence) > 200:
                summary += "..."
        else:
            # Fallback to first 200 characters
            summary = clean_text[:200].strip()
            if len(clean_text) > 200:
                summary += "..."
        
        # Final check: if summary is still the problematic text, use a generic one
        if "eksplosive kursstigninger" in summary.lower() and len(summary) < 100:
            return "AI-resumé: Finansartikel om aktiemarkedet"
        
        return f"AI-resumé: {summary}"

    def extract_tags(self, text: str) -> List[str]:
        """Extract relevant tags from article text with improved precision"""
        import re
        tags = []
        text_lower = text.lower()
        title_lower = text_lower[:200]  # Check title area first
        
        # Tag kun på de første 1500 tegn for bedre præcision
        main_text = text_lower[:1500]
        if len(main_text) < 100:
            return ['økonomi']
        
        # Helper for word boundary match
        def has_word(word):
            return re.search(rf'\b{re.escape(word)}\b', main_text) is not None
        
        def has_word_in_title(word):
            return re.search(rf'\b{re.escape(word)}\b', title_lower) is not None
        
        # BOLIG & EJENDOM (høj prioritet)
        if any(has_word(word) for word in ['bolig', 'hus', 'lejlighed', 'ejendom', 'boligmarked', 'boligpris']):
            tags.append('bolig')
        if any(has_word(word) for word in ['huskøb', 'boligkøb', 'ejendomskøb']):
            tags.append('huskøb')
        if any(has_word(word) for word in ['lejebolig', 'leje', 'udlejning']):
            tags.append('lejebolig')
        if any(has_word(word) for word in ['ejendomsmægler', 'mægler']):
            tags.append('ejendomsmægler')
        
        # INVESTERING & AKTIER
        if any(has_word(word) for word in ['aktie', 'aktier', 'børs', 'investering', 'investor']):
            tags.append('investering')
        if any(has_word(word) for word in ['fond', 'fonde', 'pensionsfond']):
            tags.append('fonde')
        if any(has_word(word) for word in ['aktiesparekonto', 'ask']):
            tags.append('aktiesparekonto')
        if any(has_word(word) for word in ['novo nordisk', 'novo', 'lego', 'vestas']):
            tags.append('danske aktier')
        
        # PENSION
        if any(has_word(word) for word in ['pension', 'pensionsopsparing', 'aldersopsparing']):
            tags.append('pension')
        if any(has_word(word) for word in ['ratepension', 'livrente']):
            tags.append('pensionstyper')
        
        # SU & STUDERENDE
        if any(has_word(word) for word in ['su', 'studerende', 'studie', 'universitet']):
            tags.append('su')
        if any(has_word(word) for word in ['studielån', 'sulån']):
            tags.append('studielån')
        
        # GÆLD & LÅN
        if any(has_word(word) for word in ['gæld', 'lån', 'skylder', 'gældfri']):
            tags.append('gæld')
        if any(has_word(word) for word in ['boliglån', 'realkredit']):
            tags.append('boliglån')
        if any(has_word(word) for word in ['forbrugslån', 'kassekredit']):
            tags.append('forbrugslån')
        
        # OPSPARING & SPARING
        if any(has_word(word) for word in ['opsparing', 'spare', 'sparer', 'sparepenge']):
            tags.append('opsparing')
        if any(has_word(word) for word in ['børneopsparing', 'børnepenge']):
            tags.append('børneopsparing')
        
        # BANK & BETALING
        if any(has_word(word) for word in ['bank', 'bankkonto', 'nordea', 'danske bank', 'jyske bank']):
            tags.append('bank')
        if any(has_word(word) for word in ['kreditkort', 'debetkort']):
            tags.append('kort')
        if any(has_word(word) for word in ['mobilepay', 'vipps', 'swish']):
            tags.append('mobilepay')
        
        # SKAT & FRADRAG
        if any(has_word(word) for word in ['skat', 'skattefradrag', 'årsopgørelse']):
            tags.append('skat')
        if any(has_word(word) for word in ['kørselsfradrag', 'befordringsfradrag']):
            tags.append('fradrag')
        
        # RENTE & RENTESÆTNING
        if any(has_word(word) for word in ['rente', 'rentesænkning', 'rentestigning']):
            tags.append('renter')
        if any(has_word(word) for word in ['nationalbank', 'centralbank']):
            tags.append('nationalbank')
        
        # FORBRUG & FORBRUGER
        if any(has_word(word) for word in ['forbrug', 'forbruger', 'køb', 'købsråd']):
            tags.append('forbrug')
        if any(has_word(word) for word in ['tilbud', 'rabat', 'sparepenge']):
            tags.append('sparertips')
        
        # FORSIKRING
        if any(has_word(word) for word in ['forsikring', 'forsikringsråd']):
            tags.append('forsikring')
        if any(has_word(word) for word in ['bilforsikring', 'husejerforsikring']):
            tags.append('forsikringstyper')
        
        # RÅDGIVNING & MENTOR
        if any(has_word(word) for word in ['mentor', 'rådgivning', 'økonomisk rådgivning']):
            tags.append('rådgivning')
        if any(has_word(word) for word in ['budget', 'budgetmøde']):
            tags.append('budget')
        if any(has_word(word) for word in ['webinar', 'undervisning', 'kursus']):
            tags.append('undervisning')
        
        # FAMILIEØKONOMI
        if any(has_word(word) for word in ['familie', 'børn', 'børnefamilie']):
            tags.append('familieøkonomi')
        if any(has_word(word) for word in ['madspild', 'madbudget']):
            tags.append('madspild')
        
        # ERHVERV & VIRKSOMHED
        if any(has_word(word) for word in ['erhverv', 'virksomhed', 'arbejde', 'job']):
            tags.append('erhverv')
        if any(has_word(word) for word in ['løn', 'indkomst', 'lønforhandling']):
            tags.append('løn')
        
        # KRYPTO & ALTERNATIVE INVESTERINGER
        if any(has_word(word) for word in ['bitcoin', 'krypto', 'cryptocurrency']):
            tags.append('krypto')
        if any(has_word(word) for word in ['guld', 'sølv', 'råvarer']):
            tags.append('råvarer')
        
        # PENSIONIST & ALDERDOM
        if any(has_word(word) for word in ['pensionist', 'aldring', 'senior']):
            tags.append('pensionist')
        
        # ULYKKER & PROBLEMER
        if any(has_word(word) for word in ['svindel', 'bedrageri', 'hvidvask']):
            tags.append('økonomisk kriminalitet')
        if any(has_word(word) for word in ['konkurs', 'gældssanering']):
            tags.append('økonomiske problemer')
        
        # Default tag kun hvis ingen andre fundet
        if not tags:
            tags.append('privatøkonomi')
        
        # Prioritize personal finance tags and limit to 3 most relevant
        priority_tags = ['opsparing', 'investering', 'bolig', 'gæld', 'pension', 'su', 'skat']
        prioritized = [tag for tag in tags if tag in priority_tags]
        other_tags = [tag for tag in tags if tag not in priority_tags]
        
        # Return prioritized tags first, then others, max 3 total
        result = prioritized + other_tags
        return result[:3]

    def classify_audience(self, text: str) -> str:
        """Classify the target audience with improved precision"""
        text_lower = text.lower()
        
        # Check for specific audience indicators
        if any(word in text_lower for word in ['studerende', 'su', 'universitet', 'studie', 'studielån']):
            return 'studerende'
        elif any(word in text_lower for word in ['familie', 'børn', 'børnefamilie', 'børneopsparing', 'børnepenge']):
            return 'børnefamilie'
        elif any(word in text_lower for word in ['pensionist', 'pension', 'aldring', 'senior', 'aldersopsparing']):
            return 'pensionist'
        elif any(word in text_lower for word in ['mentor', 'rådgivning', 'økonomisk rådgivning', 'budgetmøde']):
            return 'rådgivning'
        elif any(word in text_lower for word in ['erhverv', 'virksomhed', 'arbejde', 'job', 'løn', 'lønforhandling']):
            return 'erhverv'
        elif any(word in text_lower for word in ['investor', 'investering', 'aktier', 'børs', 'fonde']):
            return 'investor'
        elif any(word in text_lower for word in ['bolig', 'huskøb', 'lejlighed', 'ejendom', 'boligmarked']):
            return 'boligejer'
        elif any(word in text_lower for word in ['gæld', 'lån', 'boliglån', 'realkredit', 'gældssanering']):
            return 'gældsramt'
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
        """Remove duplicate articles based on URL and title similarity with improved algorithm"""
        seen_urls = set()
        seen_content_hashes = set()
        unique_articles = []
        duplicates_removed = 0
        
        for article in articles:
            url = article['url']
            title = article['title'].lower().strip()
            
            # Create content hash for better deduplication
            content_text = article.get('summary', '') + ' ' + article.get('title', '')
            content_hash = hashlib.md5(content_text.encode()).hexdigest()
            
            # Check if we've seen this URL or content hash
            if url not in seen_urls and content_hash not in seen_content_hashes:
                # Check for similar titles (improved algorithm)
                title_similar = False
                for existing_article in unique_articles:
                    existing_title = existing_article['title'].lower().strip()
                    
                    # Use Jaccard similarity for better title comparison
                    title_words = set(title.split())
                    existing_words = set(existing_title.split())
                    
                    if len(title_words) > 0 and len(existing_words) > 0:
                        intersection = len(title_words.intersection(existing_words))
                        union = len(title_words.union(existing_words))
                        similarity = intersection / union if union > 0 else 0
                        
                        if similarity > 0.8:  # 80% similarity threshold
                            title_similar = True
                            break
                
                if not title_similar:
                    seen_urls.add(url)
                    seen_content_hashes.add(content_hash)
                    unique_articles.append(article)
                else:
                    duplicates_removed += 1
                    print(f"Duplicate article removed (similar title): {article['title']}")
            else:
                duplicates_removed += 1
                print(f"Duplicate article removed (same URL/content): {article['title']}")
        
        print(f"Deduplication: {len(articles)} -> {len(unique_articles)} articles ({duplicates_removed} duplicates removed)")
        return unique_articles

    def save_articles_to_json(self, articles: List[Dict[str, Any]], filename: str = "scraped_articles.json"):
        """Save scraped articles to JSON file with enhanced metadata"""
        # Calculate additional statistics
        total_articles = len(articles)
        avg_relevance = sum(article.get("relevance_score", 0) for article in articles) / total_articles if total_articles > 0 else 0
        
        # Get top tags by frequency
        tag_counts = defaultdict(int)
        for article in articles:
            for tag in article.get("tags", []):
                tag_counts[tag] += 1
        top_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        # Articles per source
        source_counts = defaultdict(int)
        for article in articles:
            source_counts[article.get("source", "unknown")] += 1
        
        # Score distribution
        score_ranges = {
            "5-10": 0, "10-15": 0, "15-20": 0, "20+": 0
        }
        for article in articles:
            score = article.get("relevance_score", 0)
            if 5 <= score < 10:
                score_ranges["5-10"] += 1
            elif 10 <= score < 15:
                score_ranges["10-15"] += 1
            elif 15 <= score < 20:
                score_ranges["15-20"] += 1
            elif score >= 20:
                score_ranges["20+"] += 1
        
        data = {
            "articles": articles,
            "metadata": {
                "totalArticles": total_articles,
                "lastUpdated": datetime.now().isoformat(),
                "sources": list(set(article.get("source", "") for article in articles)),
                "averageRelevanceScore": round(avg_relevance, 2),
                "topTags": [{"tag": tag, "count": count} for tag, count in top_tags],
                "audiences": list(set(article.get("audience", "") for article in articles)),
                "difficulties": list(set(article.get("difficulty", "") for article in articles)),
                "scrapingStats": {
                    "articlesPerSource": dict(source_counts),
                    "relevanceScoreDistribution": score_ranges,
                    "qualityMetrics": {
                        "averageContentLength": sum(len(article.get("summary", "")) for article in articles) / total_articles if total_articles > 0 else 0,
                        "articlesWithHighRelevance": len([a for a in articles if a.get("relevance_score", 0) >= 15])
                    }
                }
            }
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            import json
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Enhanced article data saved to {filename}")
        print(f"Total: {total_articles} articles, Avg relevance: {avg_relevance:.2f}")


# Optimized test function with async support
async def test_scraper():
    """Test the optimized scraper with concurrent processing"""
    scraper = ArticleScraper()
    
    # Test with a few sources first
    test_sources = ['dr.dk', 'tv2.dk', 'finans.dk', 'bolius.dk']
    
    print("Testing optimized scraper with sources:", test_sources)
    print("Using concurrent processing for better performance...")
    
    start_time = time.time()
    articles = await scraper.scrape_articles(test_sources, max_concurrent=3)
    end_time = time.time()
    
    print(f"\nOptimized test completed in {end_time - start_time:.2f} seconds")
    print(f"Found {len(articles)} articles")
    
    # Show top articles by relevance score
    articles_sorted = sorted(articles, key=lambda x: x.get('relevance_score', 0), reverse=True)
    print("\nTop 5 articles by relevance:")
    for i, article in enumerate(articles_sorted[:5], 1):
        print(f"{i}. {article['title'][:60]}... (Score: {article['relevance_score']})")
    
    # Save optimized results
    scraper.save_articles_to_json(articles, "optimized_test_articles.json")
    print(f"Optimized test articles saved to optimized_test_articles.json")

if __name__ == "__main__":
    # Run optimized test
    asyncio.run(test_scraper())