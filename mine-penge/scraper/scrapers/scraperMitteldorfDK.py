import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin, urlparse
from datetime import datetime
import logging

# Opsætning af logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MitteldorfBlogScraper:
    def __init__(self):
        self.base_url = "https://mitteldorf.dk"
        self.blog_base_url = "https://mitteldorf.dk/blog/"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.blog_posts = []

    def get_page_content(self, url, retry_count=3):
        """Henter indhold fra en URL med retry funktionalitet"""
        for attempt in range(retry_count):
            try:
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                return response
            except requests.RequestException as e:
                logger.warning(f"Forsøg {attempt + 1} fejlede for {url}: {e}")
                if attempt < retry_count - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    logger.error(f"Kunne ikke hente {url} efter {retry_count} forsøg")
                    return None

    def find_known_blog_urls(self):
        """Returnerer kendte blog URLs baseret på søgeresultater"""
        known_urls = [
            "https://mitteldorf.dk/blog/kindle/",
            "https://mitteldorf.dk/blog/lysa/",
            "https://mitteldorf.dk/blog/fem-ting-vi-kan-laere-fra-fire-bevaegelsen/",
            "https://mitteldorf.dk/blog/fiskeren-og-forretningsmanden/",
            "https://mitteldorf.dk/blog/freedom24-gratis-aktier-august-2024/",
            "https://mitteldorf.dk/blog/fiscouts/",
            "https://mitteldorf.dk/blog/budgetter-er-nemme-med-50-30-20-reglen/",
            "https://mitteldorf.dk/blog/min-100-thing-challenge/",
            "https://mitteldorf.dk/blog/berkshire-hathaway-perfekte-investering/",
            "https://mitteldorf.dk/blog/moats-oekosystem/"
        ]
        return known_urls

    def discover_blog_urls_from_sitemap(self):
        """Prøver at finde blog URLs fra sitemap"""
        sitemap_urls = [
            f"{self.base_url}/sitemap.xml",
            f"{self.base_url}/sitemap_index.xml",
            f"{self.base_url}/feed.rss"
        ]
        
        blog_urls = set()
        
        for sitemap_url in sitemap_urls:
            logger.info(f"Checker sitemap: {sitemap_url}")
            response = self.get_page_content(sitemap_url)
            if response:
                try:
                    if 'rss' in sitemap_url:
                        # RSS feed
                        soup = BeautifulSoup(response.content, 'xml')
                        items = soup.find_all('item')
                        for item in items:
                            link = item.find('link')
                            if link and link.text:
                                blog_urls.add(link.text.strip())
                                logger.info(f"Fandt RSS URL: {link.text.strip()}")
                    else:
                        # XML sitemap
                        soup = BeautifulSoup(response.content, 'xml')
                        urls = soup.find_all('url')
                        for url in urls:
                            loc = url.find('loc')
                            if loc and '/blog/' in loc.text:
                                blog_urls.add(loc.text)
                                logger.info(f"Fandt sitemap URL: {loc.text}")
                except Exception as e:
                    logger.warning(f"Kunne ikke parse sitemap {sitemap_url}: {e}")
                    
        return list(blog_urls)

    def scrape_blog_listing_page(self):
        """Scraper blog listing siden for at finde alle blog indlæg"""
        blog_urls = set()
        
        logger.info(f"Scraper blog listing: {self.blog_base_url}")
        response = self.get_page_content(self.blog_base_url)
        
        if response:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find alle links på blog siden
            links = soup.find_all('a', href=True)
            for link in links:
                href = link['href']
                full_url = urljoin(self.base_url, href)
                
                # Check om det er et blog indlæg
                if ('/blog/' in full_url and 
                    full_url != self.blog_base_url and
                    not full_url.endswith('/blog/') and
                    not any(word in full_url for word in ['#', '?', 'javascript:'])):
                    blog_urls.add(full_url)
        
        return list(blog_urls)

    def extract_blog_content(self, url):
        """Ekstraherer indhold fra et enkelt blog indlæg"""
        logger.info(f"Scraper blog indlæg: {url}")
        
        response = self.get_page_content(url)
        if not response:
            return None
            
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Ekstraher titel - moderne web strukturer
        title = ""
        title_selectors = [
            'h1',
            '.article-title',
            '.post-title',
            '.entry-title',
            'title'
        ]
        for selector in title_selectors:
            title_element = soup.select_one(selector)
            if title_element:
                title = title_element.get_text().strip()
                break
        
        if not title and soup.title:
            title = soup.title.get_text().strip()
            # Fjern sidenavn fra titel
            title = re.sub(r'\s*\|\s*Christian Mitteldorf.*$', '', title)
            title = re.sub(r'\s*—\s*.*$', '', title)
        
        # Ekstraher hovedindhold
        content = ""
        content_selectors = [
            'article',
            '.article-content',
            '.post-content',
            '.entry-content',
            '.content',
            'main',
            '.blog-content'
        ]
        
        content_element = None
        for selector in content_selectors:
            content_element = soup.select_one(selector)
            if content_element:
                break
        
        if content_element:
            # Fjern uønskede elementer
            for unwanted in content_element([
                "script", "style", "nav", "footer", "header", 
                ".social-share", ".author-box", ".related-posts",
                ".comments", ".comment-form", ".sidebar", ".navigation"
            ]):
                unwanted.decompose()
            content = content_element.get_text(separator=' ', strip=True)
        else:
            # Fallback: tag alt tekst fra body
            body = soup.find('body')
            if body:
                for unwanted in body(["script", "style", "nav", "footer", "header", "sidebar"]):
                    unwanted.decompose()
                content = body.get_text(separator=' ', strip=True)
        
        # Fjern overflødig whitespace og rens indhold
        content = re.sub(r'\s+', ' ', content).strip()
        
        # Fjern typiske affiliate/disclaimer tekst
        content = re.sub(r'Dette indlæg kan indeholde links.*?Læs mere her\.', '', content)
        content = re.sub(r'SponsorLysa.*?beslutninger\.', '', content)
        content = re.sub(r'Der er altid en risiko.*?igen\.', '', content)
        
        # Lav et kort resume (første 200 tegn af hovedindholdet)
        summary = content[:200] + "..." if len(content) > 200 else content
        
        # Prøv at find meta description for bedre resume
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            summary = meta_desc['content']
        
        # Prøv at finde udgivelsesdato
        date_published = ""
        date_selectors = [
            'meta[property="article:published_time"]',
            'meta[name="date"]',
            '.date',
            '.published',
            '.post-date',
            '.entry-date',
            'time[datetime]'
        ]
        
        for selector in date_selectors:
            date_element = soup.select_one(selector)
            if date_element:
                date_published = (date_element.get('content') or 
                                date_element.get('datetime') or 
                                date_element.get_text()).strip()
                break
        
        # Prøv at parse dato fra URL eller indhold
        if not date_published:
            # Kig efter dato mønstre i URL eller indhold
            date_patterns = [
                r'(\d{1,2})\.\s*(januar|februar|marts|april|maj|juni|juli|august|september|oktober|november|december)\s*(\d{4})',
                r'(\d{4})-(\d{2})-(\d{2})'
            ]
            
            for pattern in date_patterns:
                match = re.search(pattern, content, re.IGNORECASE)
                if match:
                    date_published = match.group(0)
                    break
        
        # Forfatter
        author = "Christian Mitteldorf"  # Blog ejer
        
        # Find kategorier/tags baseret på indhold
        categories = []
        
        # Auto-kategorier baseret på indhold
        if any(word in content.lower() for word in ['aktier', 'aktie', 'investering', 'warren buffett', 'berkshire']):
            categories.append('Investering')
        if any(word in content.lower() for word in ['fire', 'økonomisk uafhængighed', 'pension']):
            categories.append('FIRE')
        if any(word in content.lower() for word in ['budget', 'økonomi', 'opsparing']):
            categories.append('Økonomi')
        if any(word in content.lower() for word in ['minimalisme', '100 thing', 'ting', 'oprydning']):
            categories.append('Minimalisme')
        if any(word in content.lower() for word in ['bog', 'anmeldelse', 'læsning']):
            categories.append('Boganmeldelser')
        if any(word in content.lower() for word in ['lysa', 'robot', 'platform', 'app']):
            categories.append('Fintech')
        
        blog_post = {
            'url': url,
            'title': title,
            'summary': summary,
            'content': content,
            'author': author,
            'categories': categories,
            'date_published': date_published,
            'scraped_at': datetime.now().isoformat(),
            'word_count': len(content.split()),
            'source': 'Mitteldorf Blog'
        }
        
        return blog_post

    def scrape_all_blogs(self):
        """Hovedfunktion der scraper alle blog indlæg"""
        logger.info("Starter scraping af Mitteldorf blog...")
        
        # Find alle blog URLs
        all_urls = set()
        
        # Metode 1: Fra kendte URLs
        known_urls = self.find_known_blog_urls()
        all_urls.update(known_urls)
        logger.info(f"Fandt {len(known_urls)} kendte URLs")
        
        # Metode 2: Fra sitemap og RSS
        try:
            sitemap_urls = self.discover_blog_urls_from_sitemap()
            all_urls.update(sitemap_urls)
            logger.info(f"Fandt {len(sitemap_urls)} URLs fra sitemap/RSS")
        except Exception as e:
            logger.warning(f"Sitemap scraping fejlede: {e}")
        
        # Metode 3: Fra blog listing side
        try:
            listing_urls = self.scrape_blog_listing_page()
            all_urls.update(listing_urls)
            logger.info(f"Fandt {len(listing_urls)} URLs fra blog listing")
        except Exception as e:
            logger.warning(f"Listing scraping fejlede: {e}")
        
        logger.info(f"Total antal unikke blog URLs fundet: {len(all_urls)}")
        
        # Fjern URLs der ikke ligner blog indlæg
        filtered_urls = []
        for url in all_urls:
            # Fjern ikke-artikel URLs
            skip_words = ['#', '?', 'javascript:', '/bog/', '/nyhedsbrev/', '/kontakt/']
            if not any(word in url.lower() for word in skip_words):
                # Accepter kun URLs der er blog artikler
                if (url.startswith(self.base_url) and 
                    '/blog/' in url and
                    url != self.blog_base_url and
                    not url.endswith('/blog/')):
                    filtered_urls.append(url)
        
        logger.info(f"Filtrerede URLs til {len(filtered_urls)} faktiske blog indlæg")
        
        # Scrape hvert blog indlæg
        successful_scrapes = 0
        for i, url in enumerate(filtered_urls, 1):
            logger.info(f"Scraper {i}/{len(filtered_urls)}: {url}")
            
            blog_post = self.extract_blog_content(url)
            if blog_post and blog_post['content'].strip():  # Kun gem hvis der er indhold
                self.blog_posts.append(blog_post)
                successful_scrapes += 1
            
            # Vær høflig og vent mellem requests
            time.sleep(1)
        
        logger.info(f"Scraping færdig! {successful_scrapes}/{len(filtered_urls)} indlæg scraped succesfuldt")
        
        return self.blog_posts

    def save_to_json(self, filename="data/mitteldorf_blog_posts.json"):
        """Gemmer alle blog indlæg til JSON fil"""
        output = {
            'scraped_at': datetime.now().isoformat(),
            'source': 'Mitteldorf Blog (mitteldorf.dk/blog/)',
            'total_posts': len(self.blog_posts),
            'blog_posts': self.blog_posts
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Data gemt til {filename}")
        return filename

    def get_statistics(self):
        """Returnerer statistikker om de scrapede blog indlæg"""
        if not self.blog_posts:
            return {}
        
        total_words = sum(post['word_count'] for post in self.blog_posts)
        avg_words = total_words // len(self.blog_posts)
        
        # Find de mest almindelige kategorier
        all_categories = []
        for post in self.blog_posts:
            all_categories.extend(post.get('categories', []))
        
        category_counts = {}
        for cat in all_categories:
            category_counts[cat] = category_counts.get(cat, 0) + 1
        
        # Find de mest produktive forfattere
        author_counts = {}
        for post in self.blog_posts:
            author = post.get('author', 'Ukendt')
            if author:
                author_counts[author] = author_counts.get(author, 0) + 1
        
        return {
            'total_posts': len(self.blog_posts),
            'total_words': total_words,
            'average_words_per_post': avg_words,
            'top_categories': sorted(category_counts.items(), key=lambda x: x[1], reverse=True)[:5],
            'top_authors': sorted(author_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        }

def main():
    """Hovedfunktion"""
    scraper = MitteldorfBlogScraper()
    
    # Scrape alle blog indlæg
    blog_posts = scraper.scrape_all_blogs()
    
    if blog_posts:
        # Gem til JSON
        filename = scraper.save_to_json()
        
        # Få statistikker
        stats = scraper.get_statistics()
        
        # Print resultater
        print(f"\n{'='*50}")
        print(f"MITTELDORF BLOG SCRAPING FÆRDIG!")
        print(f"{'='*50}")
        print(f"Antal indlæg scraped: {stats['total_posts']}")
        print(f"Data gemt til: {filename}")
        print(f"Total antal ord: {stats['total_words']:,}")
        print(f"Gennemsnitlig ordantal per indlæg: {stats['average_words_per_post']}")
        
        if stats['top_categories']:
            print(f"\nTop kategorier:")
            for cat, count in stats['top_categories']:
                print(f"  - {cat}: {count} indlæg")
        
        if stats['top_authors']:
            print(f"\nTop forfattere:")
            for author, count in stats['top_authors']:
                print(f"  - {author}: {count} indlæg")
        
        # Vis de første 3 titler som eksempel
        print(f"\nEksempler på titler:")
        for i, post in enumerate(blog_posts[:3]):
            print(f"{i+1}. {post['title']}")
            
    else:
        print("Ingen blog indlæg kunne scrapes!")

if __name__ == "__main__":
    main()