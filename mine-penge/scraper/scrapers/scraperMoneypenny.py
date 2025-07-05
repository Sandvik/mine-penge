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

class MoneypennyBlogScraper:
    def __init__(self):
        self.base_url = "https://moneypennyandmore.dk"
        self.blog_base_url = "https://moneypennyandmore.dk/blog/"
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

    def find_blog_urls_from_search(self):
        """Finder blog URLs ved at søge på Google med site: operator"""
        blog_urls = set()
        
        # Definerede søgetermer for at finde forskellige typer indlæg
        search_terms = [
            "site:moneypennyandmore.dk/blog/ investering",
            "site:moneypennyandmore.dk/blog/ aktier", 
            "site:moneypennyandmore.dk/blog/ lysa",
            "site:moneypennyandmore.dk/blog/ nordnet",
            "site:moneypennyandmore.dk/blog/ 2024",
            "site:moneypennyandmore.dk/blog/ 2025"
        ]
        
        # Mock URLs baseret på de fundne eksempler (da vi ikke kan søge på Google direkte)
        known_urls = [
            "https://moneypennyandmore.dk/blog/status-marts-2025-min-lysa-tyv-ligger-pa-38.8-siden-start",
            "https://moneypennyandmore.dk/blog/en-opdatering-pa-mine-fondsportefoljer-januar-2025",
            "https://moneypennyandmore.dk/blog/status-2025-min-lysa-tyv-har-snuppet-11.849-kr.-og-givet-et-afkast-pa-47.03",
            "https://moneypennyandmore.dk/blog/nyhed-fra-lysa-fra-2025-beskattes-din-lysa-gevinst-som-aktieindkomst",
            "https://moneypennyandmore.dk/blog/giv-dit-barn-en-million-i-pensionsgave",
            "https://moneypennyandmore.dk/blog/hvad-er-et-aktiedepot-en-simpel-guide-til-at-komme-i-gang-med-investeringer",
            "https://moneypennyandmore.dk/blog/fire-bevaegelsen-bevaeger-sig",
            "https://moneypennyandmore.dk/blog/hvad-er-en-aktiesparekonto",
            "https://moneypennyandmore.dk/blog/klodshans-metoden",
            "https://moneypennyandmore.dk/blog/manedsopsparing-sadan-startede-jeg-min",
            "https://moneypennyandmore.dk/blog/hvad-er-skats-positivliste",
            "https://moneypennyandmore.dk/blog/investering-sadan-kommer-du-igang",
            "https://moneypennyandmore.dk/blog/robotradgiveren-lysa-er-kommet-til-danmark",
            "https://moneypennyandmore.dk/blog/hvilken-investeringsplatform-skal-jeg-vaelge",
            "https://moneypennyandmore.dk/blog/hvad-er-xdagen",
            "https://moneypennyandmore.dk/blog/11-steder-med-gratis-fodselsdagsgaver-og-tilbud"
        ]
        
        blog_urls.update(known_urls)
        return list(blog_urls)

    def discover_blog_urls_from_sitemap(self):
        """Prøver at finde blog URLs fra sitemap"""
        sitemap_urls = [
            f"{self.base_url}/sitemap.xml",
            f"{self.base_url}/sitemap_index.xml",
            f"{self.base_url}/blog-sitemap.xml"
        ]
        
        blog_urls = set()
        
        for sitemap_url in sitemap_urls:
            response = self.get_page_content(sitemap_url)
            if response:
                try:
                    soup = BeautifulSoup(response.content, 'xml')
                    urls = soup.find_all('url')
                    for url in urls:
                        loc = url.find('loc')
                        if loc and '/blog/' in loc.text:
                            blog_urls.add(loc.text)
                except Exception as e:
                    logger.warning(f"Kunne ikke parse sitemap {sitemap_url}: {e}")
                    
        return list(blog_urls)

    def scrape_blog_listing_pages(self):
        """Scraper blog listing sider for at finde alle blog indlæg"""
        blog_urls = set()
        
        # Prøv forskellige blog listing sider
        listing_urls = [
            f"{self.blog_base_url}",
            f"{self.blog_base_url}?page=1",
            f"{self.blog_base_url}category/all",
        ]
        
        for listing_url in listing_urls:
            logger.info(f"Scraper listing side: {listing_url}")
            response = self.get_page_content(listing_url)
            
            if response:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Find links der indeholder '/blog/' og ikke er listing sider
                links = soup.find_all('a', href=True)
                for link in links:
                    href = link['href']
                    full_url = urljoin(self.base_url, href)
                    
                    # Check om det er et blog indlæg
                    if ('/blog/' in full_url and 
                        full_url != self.blog_base_url and
                        not full_url.endswith('/blog/') and
                        'category' not in full_url and
                        'page=' not in full_url):
                        blog_urls.add(full_url)
        
        return list(blog_urls)

    def extract_blog_content(self, url):
        """Ekstraherer indhold fra et enkelt blog indlæg"""
        logger.info(f"Scraper blog indlæg: {url}")
        
        response = self.get_page_content(url)
        if not response:
            return None
            
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Ekstraher titel
        title = ""
        title_selectors = ['h1', 'title', '.post-title', '.blog-title', '[class*="title"]']
        for selector in title_selectors:
            title_element = soup.select_one(selector)
            if title_element:
                title = title_element.get_text().strip()
                break
        
        if not title:
            title = soup.title.get_text().strip() if soup.title else "Ingen titel fundet"
        
        # Ekstraher hovedindhold
        content = ""
        content_selectors = [
            '.post-content', '.blog-content', '.entry-content', 
            '.content', 'article', '.post-body', 'main'
        ]
        
        content_element = None
        for selector in content_selectors:
            content_element = soup.select_one(selector)
            if content_element:
                break
        
        if content_element:
            # Fjern script og style tags
            for script in content_element(["script", "style", "nav", "footer", "header"]):
                script.decompose()
            content = content_element.get_text(separator=' ', strip=True)
        else:
            # Fallback: tag alt tekst fra body
            body = soup.find('body')
            if body:
                for script in body(["script", "style", "nav", "footer", "header"]):
                    script.decompose()
                content = body.get_text(separator=' ', strip=True)
        
        # Lav et kort resume (første 200 tegn)
        summary = content[:200] + "..." if len(content) > 200 else content
        
        # Prøv at find meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            summary = meta_desc['content']
        
        # Prøv at finde udgivelsesdato
        date_published = ""
        date_selectors = [
            'meta[property="article:published_time"]',
            'meta[name="date"]',
            '.date', '.published', '.post-date',
            'time[datetime]'
        ]
        
        for selector in date_selectors:
            date_element = soup.select_one(selector)
            if date_element:
                date_published = (date_element.get('content') or 
                                date_element.get('datetime') or 
                                date_element.get_text()).strip()
                break
        
        blog_post = {
            'url': url,
            'title': title,
            'summary': summary,
            'content': content,
            'date_published': date_published,
            'scraped_at': datetime.now().isoformat(),
            'word_count': len(content.split())
        }
        
        return blog_post

    def scrape_all_blogs(self):
        """Hovedfunktion der scraper alle blog indlæg"""
        logger.info("Starter scraping af Moneypenny blog...")
        
        # Find alle blog URLs
        all_urls = set()
        
        # Metode 1: Fra kendte URLs
        known_urls = self.find_blog_urls_from_search()
        all_urls.update(known_urls)
        logger.info(f"Fandt {len(known_urls)} kendte URLs")
        
        # Metode 2: Fra sitemap
        sitemap_urls = self.discover_blog_urls_from_sitemap()
        all_urls.update(sitemap_urls)
        logger.info(f"Fandt {len(sitemap_urls)} URLs fra sitemap")
        
        # Metode 3: Fra blog listing sider
        listing_urls = self.scrape_blog_listing_pages()
        all_urls.update(listing_urls)
        logger.info(f"Fandt {len(listing_urls)} URLs fra listing sider")
        
        logger.info(f"Total antal unikke blog URLs fundet: {len(all_urls)}")
        
        # Scrape hvert blog indlæg
        successful_scrapes = 0
        for i, url in enumerate(all_urls, 1):
            logger.info(f"Scraper {i}/{len(all_urls)}: {url}")
            
            blog_post = self.extract_blog_content(url)
            if blog_post:
                self.blog_posts.append(blog_post)
                successful_scrapes += 1
            
            # Vær høflig og vent mellem requests
            time.sleep(1)
        
        logger.info(f"Scraping færdig! {successful_scrapes}/{len(all_urls)} indlæg scraped succesfuldt")
        
        return self.blog_posts

    def save_to_json(self, filename="data/moneypenny_blog_posts.json"):
        """Gemmer alle blog indlæg til JSON fil"""
        output = {
            'scraped_at': datetime.now().isoformat(),
            'total_posts': len(self.blog_posts),
            'blog_posts': self.blog_posts
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Data gemt til {filename}")
        return filename

def main():
    """Hovedfunktion"""
    scraper = MoneypennyBlogScraper()
    
    # Scrape alle blog indlæg
    blog_posts = scraper.scrape_all_blogs()
    
    if blog_posts:
        # Gem til JSON
        filename = scraper.save_to_json()
        
        # Print statistikker
        print(f"\n{'='*50}")
        print(f"SCRAPING FÆRDIG!")
        print(f"{'='*50}")
        print(f"Antal indlæg scraped: {len(blog_posts)}")
        print(f"Data gemt til: {filename}")
        print(f"Gennemsnitlig ordantal: {sum(post['word_count'] for post in blog_posts) // len(blog_posts)}")
        
        # Vis de første 3 titler som eksempel
        print(f"\nEksempler på titler:")
        for i, post in enumerate(blog_posts[:3]):
            print(f"{i+1}. {post['title']}")
            
    else:
        print("Ingen blog indlæg kunne scrapes!")

if __name__ == "__main__":
    main()