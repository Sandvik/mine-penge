import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin, urlparse
from datetime import datetime
import logging

# Opsætning af logging
logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Console output funktioner
def print_progress(message):
    print(f"PROGRESS: {message}")

def print_success(message):
    print(f"SUCCESS: {message}")

def print_error(message):
    print(f"ERROR: {message}")

def print_info(message):
    print(f"INFO: {message}")

def print_warning(message):
    print(f"WARNING: {message}")

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
                if attempt < retry_count - 1:
                    print_warning(f"Forsøg {attempt + 1} fejlede for {url.split('/')[-1]}: {e}")
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    print_error(f"Kunne ikke hente {url.split('/')[-1]} efter {retry_count} forsøg")
                    return None

    def find_blog_urls_from_search(self):
        """Finder blog URLs ved at søge på Google med site: operator"""
        # Denne metode er ikke længere nødvendig da vi bruger dynamisk scraping
        # af blog listing sider og sitemap i stedet
        return []

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
            # logger.info(f"Scraper listing side: {listing_url}")  # Reduced logging
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
        # logger.info(f"Scraper blog indlæg: {url}")  # Reduced logging
        
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
        
        # Ekstraher udgivelsesdato fra <p itemprop="datePublished">
        if not date_published:
            p_date_tags = soup.find_all('p', attrs={'itemprop': 'datePublished'})
            for p_tag in p_date_tags:
                # Try datetime attribute first
                datetime_attr = p_tag.get('datetime')
                if datetime_attr:
                    try:
                        date_obj = datetime.fromisoformat(datetime_attr.replace('Z', '+00:00'))
                        date_published = date_obj.isoformat()
                        logger.info(f"Fandt dato i <p> datetime: {datetime_attr} -> {date_published}")
                        break
                    except ValueError as e:
                        logger.warning(f"Kunne ikke parse <p> datetime: {datetime_attr}, fejl: {e}")
                # Try text content
                text_content = p_tag.get_text().strip()
                if text_content:
                    try:
                        if ' ' in text_content:
                            date_obj = datetime.strptime(text_content, '%d/%m/%Y %H:%M')
                        else:
                            date_obj = datetime.strptime(text_content, '%d/%m/%Y')
                        date_published = date_obj.isoformat()
                        logger.info(f"Fandt dato i <p> tekst: {text_content} -> {date_published}")
                        break
                    except ValueError as e:
                        logger.warning(f"Kunne ikke parse <p> tekst: {text_content}, fejl: {e}")
        
        # Metode 1.1: Find itemprop="datePublished" elementer
        if not date_published:
            date_published_elements = soup.find_all(attrs={'itemprop': 'datePublished'})
            for element in date_published_elements:
                # Først prøv datetime attribut
                datetime_attr = element.get('datetime')
                if datetime_attr:
                    try:
                        # Parse ISO format datetime
                        date_obj = datetime.fromisoformat(datetime_attr.replace('Z', '+00:00'))
                        date_published = date_obj.isoformat()
                        logger.info(f"Fandt dato i itemprop datetime: {datetime_attr} -> {date_published}")
                        break
                    except ValueError as e:
                        logger.warning(f"Kunne ikke parse datetime attribut: {datetime_attr}, fejl: {e}")
                
                # Hvis ikke datetime, prøv tekst indhold
                if not date_published:
                    text_content = element.get_text().strip()
                    if text_content:
                        # Prøv at parse DD/MM/YYYY HH:MM format
                        try:
                            if ' ' in text_content:
                                date_obj = datetime.strptime(text_content, '%d/%m/%Y %H:%M')
                            else:
                                date_obj = datetime.strptime(text_content, '%d/%m/%Y')
                            date_published = date_obj.isoformat()
                            logger.info(f"Fandt dato i itemprop tekst: {text_content} -> {date_published}")
                            break
                        except ValueError as e:
                            logger.warning(f"Kunne ikke parse itemprop tekst: {text_content}, fejl: {e}")
        
        # Metode 1.5: Find elementer der indeholder "Slået op den"
        if not date_published:
            # Søg efter elementer der indeholder "Slået op den"
            elements_with_date = soup.find_all(string=re.compile(r'Slået op den'))
            for element in elements_with_date:
                parent = element.parent
                # Check for <p> tag with date as child
                if parent:
                    p_tag = parent.find('p')
                    if p_tag:
                        # Try datetime attribute first
                        datetime_attr = p_tag.get('datetime')
                        if datetime_attr:
                            try:
                                date_obj = datetime.fromisoformat(datetime_attr.replace('Z', '+00:00'))
                                date_published = date_obj.isoformat()
                                logger.info(f"Fandt dato i <p> datetime: {datetime_attr} -> {date_published}")
                                break
                            except ValueError as e:
                                logger.warning(f"Kunne ikke parse <p> datetime: {datetime_attr}, fejl: {e}")
                        # Try text content
                        text_content = p_tag.get_text().strip()
                        if text_content:
                            try:
                                if ' ' in text_content:
                                    date_obj = datetime.strptime(text_content, '%d/%m/%Y %H:%M')
                                else:
                                    date_obj = datetime.strptime(text_content, '%d/%m/%Y')
                                date_published = date_obj.isoformat()
                                logger.info(f"Fandt dato i <p> tekst: {text_content} -> {date_published}")
                                break
                            except ValueError as e:
                                logger.warning(f"Kunne ikke parse <p> tekst: {text_content}, fejl: {e}")
                # Fallback: old logic
                parent_text = parent.get_text() if parent else str(element)
                date_match = re.search(r'Slået op den (\d{2}/\d{2}/\d{4}(?: \d{2}:\d{2})?)', parent_text)
                if date_match:
                    date_str = date_match.group(1)
                    try:
                        if ' ' in date_str:
                            date_obj = datetime.strptime(date_str, '%d/%m/%Y %H:%M')
                        else:
                            date_obj = datetime.strptime(date_str, '%d/%m/%Y')
                        date_published = date_obj.isoformat()
                        logger.info(f"Fandt dato i HTML element: {date_str} -> {date_published}")
                        break
                    except ValueError as e:
                        logger.warning(f"Kunne ikke parse dato fra HTML element: {date_str}, fejl: {e}")
                        continue
        
        # Metode 2: Find dato i tekst format "Slået op den DD/MM/YYYY HH:MM"
        if not date_published:
            # Søg efter mønsteret "Slået op den" efterfulgt af dato (tillad HTML-tags/whitespace imellem)
            date_patterns = [
                r'Slået op den[\s\S]{0,50}?(\d{2}/\d{2}/\d{4} \d{2}:\d{2})',  # Med tid
                r'Slået op den[\s\S]{0,50}?(\d{2}/\d{2}/\d{4})',  # Uden tid
                r'(\d{2}/\d{2}/\d{4} \d{2}:\d{2})',  # Bare dato med tid
                r'(\d{2}/\d{2}/\d{4})',  # Bare dato
            ]
            

            
            for pattern in date_patterns:
                # Søg i hele indholdet
                date_match = re.search(pattern, content)
                if date_match:
                    date_str = date_match.group(1)
                    try:
                        # Konverter fra DD/MM/YYYY til ISO format
                        if ' ' in date_str:
                            # Med tid: DD/MM/YYYY HH:MM
                            date_obj = datetime.strptime(date_str, '%d/%m/%Y %H:%M')
                        else:
                            # Uden tid: DD/MM/YYYY
                            date_obj = datetime.strptime(date_str, '%d/%m/%Y')
                        
                        date_published = date_obj.isoformat()
                        logger.info(f"Fandt dato i tekst: {date_str} -> {date_published}")
                        break
                    except ValueError as e:
                        logger.warning(f"Kunne ikke parse dato: {date_str}, fejl: {e}")
                        continue
                
                # Søg også i hele HTML'en hvis ikke fundet i content
                if not date_published:
                    date_match = re.search(pattern, str(soup))
                    if date_match:
                        date_str = date_match.group(1)
                        try:
                            # Konverter fra DD/MM/YYYY til ISO format
                            if ' ' in date_str:
                                # Med tid: DD/MM/YYYY HH:MM
                                date_obj = datetime.strptime(date_str, '%d/%m/%Y %H:%M')
                            else:
                                # Uden tid: DD/MM/YYYY
                                date_obj = datetime.strptime(date_str, '%d/%m/%Y')
                            
                            date_published = date_obj.isoformat()
                            # logger.info(f"Fandt dato i HTML: {date_str} -> {date_published}")  # Reduced logging
                            break
                        except ValueError as e:
                            logger.warning(f"Kunne ikke parse dato fra HTML: {date_str}, fejl: {e}")
                            continue
                # Søg også i ren tekst fra hele HTML'en hvis ikke fundet endnu
                if not date_published:
                    text = soup.get_text(separator=" ")
                    date_match = re.search(pattern, text)
                    if date_match:
                        date_str = date_match.group(1)
                        try:
                            if ' ' in date_str:
                                date_obj = datetime.strptime(date_str, '%d/%m/%Y %H:%M')
                            else:
                                date_obj = datetime.strptime(date_str, '%d/%m/%Y')
                            date_published = date_obj.isoformat()
                            # logger.info(f"Fandt dato i ren tekst: {date_str} -> {date_published}")  # Reduced logging
                            break
                        except ValueError as e:
                            logger.warning(f"Kunne ikke parse dato fra ren tekst: {date_str}, fejl: {e}")
                            continue
        
        # Metode 3: Søg efter dato mønstre i hele HTML'en
        if not date_published:
            # Søg efter dato mønstre i hele siden
            date_patterns = [
                r'(\d{2}/\d{2}/\d{4} \d{2}:\d{2})',  # DD/MM/YYYY HH:MM
                r'(\d{2}/\d{2}/\d{4})',  # DD/MM/YYYY
                r'(\d{4}-\d{2}-\d{2})',  # YYYY-MM-DD
            ]
            
            for pattern in date_patterns:
                date_match = re.search(pattern, str(soup))
                if date_match:
                    date_str = date_match.group(1)
                    try:
                        if '/' in date_str and len(date_str.split('/')[0]) == 2:
                            # DD/MM/YYYY format
                            if ' ' in date_str:
                                date_obj = datetime.strptime(date_str, '%d/%m/%Y %H:%M')
                            else:
                                date_obj = datetime.strptime(date_str, '%d/%m/%Y')
                        else:
                            # YYYY-MM-DD format
                            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
                        
                        date_published = date_obj.isoformat()
                        # logger.info(f"Fandt dato med regex: {date_str} -> {date_published}")  # Reduced logging
                        break
                    except ValueError as e:
                        logger.warning(f"Kunne ikke parse dato: {date_str}, fejl: {e}")
                        continue
        
        # Fallback: Søg direkte i raw HTML efter <p itemprop="datePublished" ...>
        if not date_published:
            raw_html = response.text
            # Find <p itemprop="datePublished" ... datetime="...">
            p_tag_match = re.search(r'<p[^>]*itemprop=["\"]datePublished["\"][^>]*>', raw_html)
            if p_tag_match:
                p_tag = p_tag_match.group(0)
                # Prøv at finde datetime attribut
                datetime_match = re.search(r'datetime=["\"]([^"\"]+)["\"]', p_tag)
                if datetime_match:
                    datetime_attr = datetime_match.group(1)
                    try:
                        date_obj = datetime.fromisoformat(datetime_attr.replace('Z', '+00:00'))
                        date_published = date_obj.isoformat()
                        # logger.info(f"Fandt dato i raw <p> datetime: {datetime_attr} -> {date_published}")  # Reduced logging
                    except ValueError as e:
                        logger.warning(f"Kunne ikke parse raw <p> datetime: {datetime_attr}, fejl: {e}")
                # Hvis ikke, prøv at finde tekst mellem taggene
                if not date_published:
                    text_match = re.search(r'<p[^>]*itemprop=["\"]datePublished["\"][^>]*>([^<]+)</p>', raw_html)
                    if text_match:
                        text_content = text_match.group(1).strip()
                        try:
                            if ' ' in text_content:
                                date_obj = datetime.strptime(text_content, '%d/%m/%Y %H:%M')
                            else:
                                date_obj = datetime.strptime(text_content, '%d/%m/%Y')
                            date_published = date_obj.isoformat()
                            # logger.info(f"Fandt dato i raw <p> tekst: {text_content} -> {date_published}")  # Reduced logging
                        except ValueError as e:
                            logger.warning(f"Kunne ikke parse raw <p> tekst: {text_content}, fejl: {e}")
        
        blog_post = {
            'title': title,
            'content': content,
            'url': url,
            'source': 'Moneypenny',
            'date_published': date_published or 'INGEN DATO FUNDET',
            'scrape_date': datetime.now().isoformat(),
            'last_updated': datetime.now().isoformat(),
            'summary': summary
        }
        
        return blog_post

    def scrape_all_blogs(self):
        """Hovedfunktion der scraper alle blog indlæg"""
        print_info("Starter scraping af Moneypenny blog...")
        
        # Find alle blog URLs
        all_urls = set()
        
        # Metode 1: Fra sitemap
        print_progress("Søger efter URLs i sitemap...")
        sitemap_urls = self.discover_blog_urls_from_sitemap()
        all_urls.update(sitemap_urls)
        if sitemap_urls:
            print_success(f"Fandt {len(sitemap_urls)} URLs fra sitemap")
        else:
            print_warning("Ingen URLs fundet i sitemap")
        
        # Metode 2: Fra blog listing sider
        print_progress("Scraper blog listing sider...")
        listing_urls = self.scrape_blog_listing_pages()
        all_urls.update(listing_urls)
        if listing_urls:
            print_success(f"Fandt {len(listing_urls)} URLs fra listing sider")
        else:
            print_warning("Ingen URLs fundet i listing sider")
        
        print_info(f"Total antal unikke blog URLs fundet: {len(all_urls)}")
        
        # Scrape hvert blog indlæg
        successful_scrapes = 0
        failed_scrapes = 0
        urls_to_scrape = list(all_urls)
        
        print_progress(f"Starter scraping af {len(urls_to_scrape)} artikler...")
        
        for i, url in enumerate(urls_to_scrape, 1):
            # Vis progress hver 5. artikel eller hvis det er de første 3
            if i <= 3 or i % 5 == 0 or i == len(urls_to_scrape):
                print_progress(f"Scraper artikel {i}/{len(urls_to_scrape)}")
            
            blog_post = self.extract_blog_content(url)
            if blog_post:
                self.blog_posts.append(blog_post)
                successful_scrapes += 1
                # Vis titel for de første 3 artikler
                if i <= 3:
                    title = blog_post.get('title', 'Ingen titel')[:50]
                    date = blog_post.get('date_published', 'Ingen dato')
                    print_success(f"Artikel {i}: '{title}...' (Dato: {date})")
            else:
                failed_scrapes += 1
                print_error(f"Kunne ikke scrape artikel {i}")
            
            # Vær høflig og vent mellem requests
            time.sleep(1)
        
        print_success(f"Scraping færdig! {successful_scrapes} succesfulde, {failed_scrapes} fejlede")
        if failed_scrapes > 0:
            print_warning(f"{failed_scrapes} artikler kunne ikke scrapes - tjek ovenstående fejl")
        
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
        
        print_success(f"Data gemt til {filename}")
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
        print(f"\n{'='*60}")
        print(f"SCRAPING FÆRDIG!")
        print(f"{'='*60}")
        print(f"Antal indlæg scraped: {len(blog_posts)}")
        print(f"Data gemt til: {filename}")
        
        # Beregn gennemsnitlig ordantal
        total_words = sum(len(post.get('content', '').split()) for post in blog_posts)
        avg_words = total_words // len(blog_posts) if blog_posts else 0
        print(f"Gennemsnitlig ordantal: {avg_words}")
        
        # Vis de første 3 titler som eksempel
        print(f"\nEksempler på titler:")
        for i, post in enumerate(blog_posts[:3]):
            title = post.get('title', 'Ingen titel')[:60]
            print(f"  {i+1}. {title}...")
            
    else:
        print_error("Ingen blog indlæg kunne scrapes!")

if __name__ == "__main__":
    main()