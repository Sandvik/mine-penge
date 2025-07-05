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

class UngmedpengeBlogScraper:
    def __init__(self):
        self.base_url = "https://ungmedpenge.dk"
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
            "https://ungmedpenge.dk/investeringsforeninger/",
            "https://ungmedpenge.dk/aktier-for-begyndere/",
            "https://ungmedpenge.dk/opdatering-af-portefoeljen-december-2023/",
            "https://ungmedpenge.dk/opdatering-af-portefoeljen-maj-2020/",
            "https://ungmedpenge.dk/opdatering-af-portefoeljen-juli-2023/",
            "https://ungmedpenge.dk/aktiesektorer/",
            "https://ungmedpenge.dk/investeringsmuligheder/",
            "https://ungmedpenge.dk/budget-for-studerende/",
            "https://ungmedpenge.dk/anmeldelse-af-lendino/"
        ]
        return known_urls

    def discover_blog_urls_from_sitemap(self):
        """Prøver at finde blog URLs fra sitemap"""
        sitemap_urls = [
            f"{self.base_url}/sitemap.xml",
            f"{self.base_url}/sitemap_index.xml",
            f"{self.base_url}/wp-sitemap.xml",
            f"{self.base_url}/wp-sitemap-posts-post-1.xml"
        ]
        
        blog_urls = set()
        
        for sitemap_url in sitemap_urls:
            logger.info(f"Checker sitemap: {sitemap_url}")
            response = self.get_page_content(sitemap_url)
            if response:
                try:
                    soup = BeautifulSoup(response.content, 'xml')
                    urls = soup.find_all('url')
                    for url in urls:
                        loc = url.find('loc')
                        if loc and loc.text.startswith(self.base_url):
                            url_text = loc.text
                            # WordPress artikel URLs (ikke sider som /om-mig/, /kontakt/ etc.)
                            if (not any(page in url_text for page in ['/om-mig/', '/kontakt/', '/min-portefoelje/', '/mine-oekonomiske-maal/', '/gratis/', '/link/']) and
                                url_text != self.base_url and
                                not url_text.endswith('/') or url_text.count('/') > 3):
                                blog_urls.add(url_text)
                                logger.info(f"Fandt blog URL: {url_text}")
                except Exception as e:
                    logger.warning(f"Kunne ikke parse sitemap {sitemap_url}: {e}")
                    
        return list(blog_urls)

    def scrape_main_page_for_links(self):
        """Scraper hovedsiden for links til artikler"""
        blog_urls = set()
        
        logger.info(f"Scraper hovedside: {self.base_url}")
        response = self.get_page_content(self.base_url)
        
        if response:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find alle links på hovedsiden
            links = soup.find_all('a', href=True)
            for link in links:
                href = link['href']
                full_url = urljoin(self.base_url, href)
                
                # Check om det er et blog indlæg (undgå statiske sider)
                if (full_url.startswith(self.base_url) and 
                    not any(page in full_url for page in ['/om-mig/', '/kontakt/', '/min-portefoelje/', '/mine-oekonomiske-maal/', '/gratis/', '/link/']) and
                    full_url != self.base_url and
                    not full_url.endswith('/') or full_url.count('/') > 3):
                    blog_urls.add(full_url)
        
        return list(blog_urls)

    def discover_urls_from_rss_feed(self):
        """Prøver at finde blog URLs fra RSS feed"""
        rss_urls = [
            f"{self.base_url}/feed/",
            f"{self.base_url}/rss/",
            f"{self.base_url}/feed.xml"
        ]
        
        blog_urls = set()
        
        for rss_url in rss_urls:
            logger.info(f"Checker RSS feed: {rss_url}")
            response = self.get_page_content(rss_url)
            if response:
                try:
                    soup = BeautifulSoup(response.content, 'xml')
                    # RSS struktur
                    items = soup.find_all('item')
                    for item in items:
                        link = item.find('link')
                        if link and link.text:
                            blog_urls.add(link.text.strip())
                            logger.info(f"Fandt RSS URL: {link.text.strip()}")
                except Exception as e:
                    logger.warning(f"Kunne ikke parse RSS {rss_url}: {e}")
        
        return list(blog_urls)

    def extract_blog_content(self, url):
        """Ekstraherer indhold fra et enkelt blog indlæg"""
        logger.info(f"Scraper blog indlæg: {url}")
        
        response = self.get_page_content(url)
        if not response:
            return None
            
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Ekstraher titel - WordPress strukturer
        title = ""
        title_selectors = [
            'h1.entry-title',
            'h1.post-title',
            '.entry-title',
            '.post-title',
            'h1',
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
            title = re.sub(r'\s*—\s*.*$', '', title)
            title = re.sub(r'\s*\|\s*.*$', '', title)
        
        # Ekstraher hovedindhold - WordPress strukturer
        content = ""
        content_selectors = [
            '.entry-content',
            '.post-content',
            '.content',
            'article .content',
            '.single-post .content',
            'main .post',
            '.post-body',
            'article'
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
                ".comments", ".comment-form", ".sidebar"
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
        
        # Fjern typiske WordPress/theme elementer
        content = re.sub(r'Linket er et reklamelink.*?hjælper mig samtidig\.', '', content)
        content = re.sub(r'Dette indlæg er udarbejdet med støtte.*?\.', '', content)
        
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
            '.entry-date',
            '.post-date',
            '.date',
            '.published',
            'time[datetime]'
        ]
        
        for selector in date_selectors:
            date_element = soup.select_one(selector)
            if date_element:
                date_published = (date_element.get('content') or 
                                date_element.get('datetime') or 
                                date_element.get_text()).strip()
                break
        
        # Prøv at finde forfatter
        author = ""
        author_selectors = [
            'meta[name="author"]',
            '.author',
            '.post-author',
            '.entry-author',
            '.byline'
        ]
        
        for selector in author_selectors:
            author_element = soup.select_one(selector)
            if author_element:
                author = (author_element.get('content') or 
                         author_element.get_text()).strip()
                break
        
        # Standardforfatter hvis ingen findes
        if not author:
            author = "Frederik Askov Storm"  # Blog ejer
        
        # Find kategorier/tags
        categories = []
        category_selectors = [
            '.post-categories a',
            '.entry-categories a',
            '.categories a',
            '.tags a',
            '.post-tags a'
        ]
        
        for selector in category_selectors:
            category_elements = soup.select(selector)
            for cat_element in category_elements:
                cat_text = cat_element.get_text().strip()
                if cat_text and cat_text not in categories:
                    categories.append(cat_text)
        
        # Tilføj standard kategorier baseret på indhold
        if 'aktier' in content.lower() or 'aktie' in title.lower():
            categories.append('Aktier')
        if 'investering' in content.lower() or 'investering' in title.lower():
            categories.append('Investering')
        if 'portefølje' in content.lower() or 'portefølje' in title.lower():
            categories.append('Portefølje')
        if 'budget' in content.lower() or 'budget' in title.lower():
            categories.append('Budget')
        
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
            'source': 'Ungmedpenge Blog'
        }
        
        return blog_post

    def scrape_all_blogs(self):
        """Hovedfunktion der scraper alle blog indlæg"""
        logger.info("Starter scraping af Ungmedpenge blog...")
        
        # Find alle blog URLs
        all_urls = set()
        
        # Metode 1: Fra kendte URLs
        known_urls = self.find_known_blog_urls()
        all_urls.update(known_urls)
        logger.info(f"Fandt {len(known_urls)} kendte URLs")
        
        # Metode 2: Fra sitemap
        try:
            sitemap_urls = self.discover_blog_urls_from_sitemap()
            all_urls.update(sitemap_urls)
            logger.info(f"Fandt {len(sitemap_urls)} URLs fra sitemap")
        except Exception as e:
            logger.warning(f"Sitemap scraping fejlede: {e}")
        
        # Metode 3: Fra hovedside
        try:
            main_page_urls = self.scrape_main_page_for_links()
            all_urls.update(main_page_urls)
            logger.info(f"Fandt {len(main_page_urls)} URLs fra hovedside")
        except Exception as e:
            logger.warning(f"Hovedside scraping fejlede: {e}")
        
        # Metode 4: Fra RSS feed
        try:
            rss_urls = self.discover_urls_from_rss_feed()
            all_urls.update(rss_urls)
            logger.info(f"Fandt {len(rss_urls)} URLs fra RSS feed")
        except Exception as e:
            logger.warning(f"RSS scraping fejlede: {e}")
        
        logger.info(f"Total antal unikke blog URLs fundet: {len(all_urls)}")
        
        # Fjern URLs der ikke ligner blog indlæg
        filtered_urls = []
        for url in all_urls:
            # Fjern statiske sider og andre ikke-artikel URLs
            skip_words = ['/om-mig/', '/kontakt/', '/min-portefoelje/', '/mine-oekonomiske-maal/', '/gratis/', '/link/', '#', '?']
            if not any(word in url.lower() for word in skip_words):
                # Accepter kun URLs der ser ud som artikler
                if (url.startswith(self.base_url) and 
                    url != self.base_url and
                    (not url.endswith('/') or url.count('/') > 3)):
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

    def save_to_json(self, filename="data/ungmedpenge_blog_posts.json"):
        """Gemmer alle blog indlæg til JSON fil"""
        output = {
            'scraped_at': datetime.now().isoformat(),
            'source': 'Ungmedpenge Blog (ungmedpenge.dk)',
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
    scraper = UngmedpengeBlogScraper()
    
    # Scrape alle blog indlæg
    blog_posts = scraper.scrape_all_blogs()
    
    if blog_posts:
        # Gem til JSON
        filename = scraper.save_to_json()
        
        # Få statistikker
        stats = scraper.get_statistics()
        
        # Print resultater
        print(f"\n{'='*50}")
        print(f"UNGMEDPENGE BLOG SCRAPING FÆRDIG!")
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