#!/usr/bin/env python3
"""
Scraper for Forbrugerrådet Tænk artikler
Henter kun artikler om privatøkonomi, tests og rådgivning
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import os
from urllib.parse import urljoin, urlparse
from datetime import datetime
import time
import logging
import urllib3

# Disable SSL warnings for testing
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Opsætning af logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class TaenkScraper:
    def __init__(self):
        self.base_url = "https://taenk.dk"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        # Disable SSL verification for the session
        self.session.verify = False
        
        # Kun relevante økonomiske kategorier
        self.financial_categories = [
            "/test/privatoekonomi-og-aftaler",
            "/test/aktiesparekonti", 
            "/test/banker",
            "/test/bilforsikringer-til-benzin-og-dieselbiler",
            "/test/bilforsikringer-til-elbil",
            "/test/boligkreditter",
            "/test/boliglaan",
            "/test/boerneopsparinger",
            "/test/elselskaber",
            "/test/forbrugslaan",
            "/test/forsikringer",
            "/test/investeringsforeninger",
            "/test/kreditkort",
            "/test/livsforsikringer",
            "/test/pensionsopsparinger",
            "/test/realkreditlaan",
            "/test/skat",
            "/test/prioritetslaan",
            "/test/laan-til-andelsbolig",
            "/test/laan-til-energiforbedringer",
            "/test/handelsplatforme-til-vaerdipapirer",
            "/test/opsparingskonti",
            "/test/sundhedsforsikringer",
            "/test/realkreditlaan-til-sommerhuse",
            "/raadgivning/rettigheder"
        ]
        
        # Økonomiske nøgleord for at filtrere relevante artikler
        self.financial_keywords = [
            'bank', 'lån', 'kredit', 'forsikring', 'investering', 'aktie', 'pension', 
            'opsparing', 'skat', 'bolig', 'realkredit', 'forbrugslån', 'kreditkort',
            'elselskab', 'el', 'energi', 'pris', 'omkostning', 'udgift', 'spare',
            'rente', 'afdrag', 'gæld', 'budget', 'økonomi', 'penge', 'kroner',
            'udbytte', 'afkast', 'portefølje', 'fond', 'etf', 'obligation',
            'prioritetslån', 'andelsbolig', 'sommerhus', 'energiforbedring'
        ]
        
        # Kategorier der skal undgås
        self.exclude_categories = [
            'mad', 'indkøb', 'kemi', 'test', 'produkt', 'vaskemidler', 'kosmetik',
            'legetøj', 'tøj', 'sko', 'elektronik', 'hvidevarer', 'have', 'ferie',
            'rejse', 'sundhed', 'pleje', 'baby', 'børn', 'hund', 'kat', 'cykel',
            'bil', 'transport', 'hobby', 'fritid', 'sport', 'fitness', 'køkken',
            'møbler', 'boligindretning', 'renovation', 'værktøj', 'have', 'have'
        ]
        
        self.articles = []
        
    def get_page_content(self, url):
        """Henter indhold fra en URL med retry logic"""
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = self.session.get(url, timeout=10)
                response.raise_for_status()
                return response
            except requests.RequestException as e:
                logger.warning(f"Forsøg {attempt + 1} fejlede for {url}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2)
                else:
                    logger.error(f"Kunne ikke hente {url} efter {max_retries} forsøg")
                    return None
        return None
    
    def is_financial_article(self, title, content, url):
        """Tjekker om en artikel er økonomisk relevant - smart filtrering"""
        title_lower = title.lower()
        content_lower = content.lower()
        url_lower = url.lower()
        
        # Debug logging
        debug_info = []
        
        # 1. Tjek for irrelevante kategorier i URL (smart mønstre)
        irrelevant_url_patterns = [
            r'/test/(kaffe|mad|kemi|rengøring|toilet|vask|pleje|creme|olie|legetøj|cykel|løbehjul|bil|transport|møbel|elektronik|tøj|sko|kosmetik|sundhed|medicin|baby|børn|gravide|universalrengøring|toiletrens|mavecreme|maveolie|instant|foodprocessor|vaske-toerremaskine|loebehjul|loebecykler|kemitest|uønsket kemi|rengøringsmidler|vaskemidler|opvaskemidler|luftfriskere|desinfektionsmidler|rengøringsservietter|gulvvaskemiddel|badebomber|badeslim|intimsæbe|intim|bad|sæbe|babyolie|babysalve|vådservietter|sutter|puslebord|cocktaileffekt|hovedpinepiller|panodil|ipren|hormonforstyrrende|festivalbilletter|koncertbilletter|radon|indeklima|støvsuger|bliv-medlem)',
            r'/test/(kølefryseskab|mascara|klapvogn|proteinpulver|hårvoks|makeup|shampoo|vaskemaskine|tørretumbler|barnevogn|babymad|tv|computer|mobil|tablet|sport|fitness|drikke|kosttilskud|parfume|mode|have|grill|værktøj|ferie|rejse|hotel|fly|motorcykel|båd|camping|boligindretning|sengetøj|dyner|puder|gardiner|lamper|køkkenudstyr|gryder|pander|bestik|tallerkener|glas|kopper|service|opvaskemaskine|køleskab|fryser|ovn|komfur|mikroovn|kaffemaskine|elkedel|brødrister|blender|slowjuicer|airfryer|riskoger|ismaskine|sodavandsmaskine|elcykel|el-løbehjul|elbil|ladcykel|autostol|cykelhjelm|cykelstol|cykelanhænger|skateboard|rulleskøjter|ski|snowboard|skøjter|løbesko|fodbold|håndbold|basket|tennis|badminton|golf|svømning|dykning|fiskeri|jagt|telt|sovepose|liggeunderlag|rygsæk|kuffert|taske|pung|ur|smykker|briller|solbriller|høreapparat|tandbørste|tandpasta|tandtråd|mundskyl|barbermaskine|hårtørrer|glattejern|krøllejern|hårbørste|hårspray|hårgelé|hårmousse|hårkur|hårfarve|hårblegning|hårfjerningscreme|voks|epilator|skraber|barberskum|aftershave|deodorant|bodylotion|solcreme|selvbruner|ansigtsmaske|ansigtscreme|øjencreme|læbepomade|neglelak|neglelakfjerner|neglefil|negleklipper|fodcreme|fodbad|fodfil|fodmaske|fodpeeling|fodspray|fodpudder|foddeodorant|fodsalve|fodgel|fodbalsam|fodolie|fodskum)',
        ]
        
        for pattern in irrelevant_url_patterns:
            if re.search(pattern, url_lower):
                debug_info.append(f"Ekskluderet pga. irrelevant kategori i URL: {pattern}")
                logger.debug(f"Ekskluderet artikel '{title}' pga. irrelevant kategori i URL: {pattern}")
                return False
        
        # 2. Tjek for irrelevante ord i titel
        irrelevant_title_patterns = [
            r'\b(kaffe|mad|kemi|rengøring|toilet|vask|pleje|creme|olie|legetøj|cykel|løbehjul|bil|transport|møbel|elektronik|tøj|sko|kosmetik|sundhed|medicin|baby|børn|gravide|kølefryseskab|mascara|klapvogn|proteinpulver|hårvoks|makeup|shampoo|vaskemaskine|tørretumbler|barnevogn|babymad|tv|computer|mobil|tablet|sport|fitness|drikke|kosttilskud|parfume|mode|have|grill|værktøj|ferie|rejse|hotel|fly|motorcykel|båd|camping|boligindretning|sengetøj|dyner|puder|gardiner|lamper|køkkenudstyr|gryder|pander|bestik|tallerkener|glas|kopper|service|opvaskemaskine|køleskab|fryser|ovn|komfur|mikroovn|kaffemaskine|elkedel|brødrister|blender|slowjuicers|airfryer|riskoger|ismaskine|sodavandsmaskine|elcykel|el-løbehjul|elbil|ladcykel|autostol|cykelhjelm|cykelstol|cykelanhænger|skateboard|rulleskøjter|ski|snowboard|skøjter|løbesko|fodbold|håndbold|basket|tennis|badminton|golf|svømning|dykning|fiskeri|jagt|telt|sovepose|liggeunderlag|rygsæk|kuffert|taske|pung|ur|smykker|briller|solbriller|høreapparat|tandbørste|tandpasta|tandtråd|mundskyl|barbermaskine|hårtørrer|glattejern|krøllejern|hårbørste|hårspray|hårgelé|hårmousse|hårkur|hårfarve|hårblegning|hårfjerningscreme|voks|epilator|skraber|barberskum|aftershave|deodorant|bodylotion|solcreme|selvbruner|ansigtsmaske|ansigtscreme|øjencreme|læbepomade|neglelak|neglelakfjerner|neglefil|negleklipper|fodcreme|fodbad|fodfil|fodmaske|fodpeeling|fodspray|fodpudder|foddeodorant|fodsalve|fodgel|fodbalsam|fodolie|fodskum)\b'
        ]
        
        for pattern in irrelevant_title_patterns:
            if re.search(pattern, title_lower):
                debug_info.append(f"Ekskluderet pga. irrelevant ord i titel: {pattern}")
                logger.debug(f"Ekskluderet artikel '{title}' pga. irrelevant ord i titel: {pattern}")
                return False
        
        # 3. Kræv specifikke økonomiske kategorier i URL
        financial_url_patterns = [
            '/test/bank', '/test/laan', '/test/kredit', '/test/forsikring', 
            '/test/investering', '/test/aktie', '/test/pension', '/test/opsparing',
            '/test/skat', '/test/bolig', '/test/realkredit', '/test/forbrugslaan',
            '/test/kreditkort', '/test/elselskab', '/test/energi', '/test/prioritetslaan',
            '/test/andelsbolig', '/test/energiforbedring', '/test/handelsplatform',
            '/test/sundhedsforsikring', '/test/sommerhus', '/privatoekonomi/',
            '/raadgivning/rettigheder'
        ]
        
        # Tjek om URL'en indeholder økonomiske mønstre
        url_financial = any(pattern in url_lower for pattern in financial_url_patterns)
        
        if not url_financial:
            debug_info.append("Ekskluderet pga. manglende økonomisk kategori i URL")
            logger.debug(f"Ekskluderet artikel '{title}' pga. manglende økonomisk kategori i URL")
            return False
        
        # 4. Tjek for økonomiske nøgleord i indhold
        financial_keywords = [
            'bank', 'laan', 'kredit', 'forsikring', 'investering', 'aktie', 'pension', 
            'opsparing', 'skat', 'bolig', 'realkredit', 'forbrugslaan', 'kreditkort',
            'elselskab', 'energi', 'pris', 'omkostning', 'udgift', 'spare',
            'rente', 'afdrag', 'gaeld', 'budget', 'oekonomi', 'penge', 'kroner',
            'udbytte', 'afkast', 'portefølje', 'fond', 'etf', 'aktiesparekonto',
            'prioritetslaan', 'andelsbolig', 'energiforbedring', 'handelsplatform',
            'opsparingskonto', 'sundhedsforsikring', 'sommerhus', 'rettigheder'
        ]
        
        financial_matches = 0
        matched_keywords = []
        for keyword in financial_keywords:
            if keyword in title_lower or keyword in content_lower:
                financial_matches += 1
                matched_keywords.append(keyword)
        
        # Kræv mindst 2 økonomiske nøgleord i indholdet
        if financial_matches < 2:
            debug_info.append(f"Ekskluderet pga. for få økonomiske nøgleord ({financial_matches} < 2). Matched: {matched_keywords}")
            logger.debug(f"Ekskluderet artikel '{title}' pga. for få økonomiske nøgleord ({financial_matches} < 2). Matched: {matched_keywords}")
            return False
        
        # Artikel accepteret
        logger.debug(f"Artikel accepteret: '{title}' med {financial_matches} økonomiske nøgleord: {matched_keywords}")
        return True
    
    def is_article_url(self, url):
        """Tjekker om en URL er en artikel fra taenk.dk/privatoekonomi"""
        # Kun artikler fra privatøkonomi-sektionen
        if url.startswith("https://taenk.dk/privatoekonomi"):
            # Undgå kategorisider og admin sider
            if not any(skip in url for skip in ['/admin', '/search', '/sitemap', '/rss', '/magasin', '/soeg']):
                return True
        return False
    
    def clean_content(self, content):
        """Fjerner skabelon-tekst, gentagelser og paywall-beskeder fra indholdet"""
        # Fjern kendte skabelon-tekster og paywall-sætninger
        patterns = [
            r'Allerede medlem\? Log ind.*',
            r'Se hele testen.*',
            r'Få adgang.*',
            r'Log ind for at se testen.*',
            r'Grundige og uvildige test koster penge.*',
            r'Ved køb af 12 måneders medlemskab.*',
            r'X LUK',
            r'Tilbage til testen',
            r'Se testresultater.*',
            r'\s{2,}',
        ]
        for pat in patterns:
            content = re.sub(pat, '', content, flags=re.IGNORECASE)
        # Fjern gentagne linjer
        lines = content.split('\n')
        seen = set()
        cleaned_lines = []
        for line in lines:
            line = line.strip()
            if line and line not in seen:
                cleaned_lines.append(line)
                seen.add(line)
        cleaned = ' '.join(cleaned_lines)
        # Fjern ekstra mellemrum
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        return cleaned

    def extract_article_data(self, title, content, url, date):
        """Returnerer artikeldata i standardformat, med renset content og bedre summary"""
        cleaned_content = self.clean_content(content)
        # Hvis næsten intet indhold tilbage, markér som paywalled
        if len(cleaned_content) < 50:
            cleaned_content = '[PAYWALLED] ' + (title or url)
        # Summary: første meningsfulde sætning eller 200 tegn
        summary = ''
        for sent in re.split(r'[.!?]', cleaned_content):
            sent = sent.strip()
            if len(sent) > 30:
                summary = sent
                break
        if not summary:
            summary = cleaned_content[:200] + '...' if len(cleaned_content) > 200 else cleaned_content
        return {
            'title': title,
            'content': cleaned_content,
            'url': url,
            'source': 'Forbrugerrådet Tænk',
            'date_published': date,
            'scrape_date': datetime.now().isoformat(),
            'last_updated': datetime.now().isoformat(),
            'summary': summary
        }
    
    def extract_article_content(self, url):
        """Ekstraherer indhold fra et enkelt artikel, følger 'Se hele testen'-link hvis det findes"""
        logger.info(f"Scraper artikel: {url}")
        response = self.get_page_content(url)
        if not response:
            logger.warning(f"Kunne ikke hente {url}")
            return None
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string.strip() if soup.title else ''
        # Find 'Se hele testen'-link
        test_link = None
        for a in soup.find_all('a', href=True):
            if re.search(r'se hele testen', a.get_text(strip=True), re.IGNORECASE):
                test_link = urljoin(url, a['href'])
                break
        # Hvis der er et test-link, følg det og brug dets indhold
        if test_link and test_link != url:
            logger.info(f"Følger test-link: {test_link}")
            response = self.get_page_content(test_link)
            if not response:
                logger.warning(f"Kunne ikke hente test-link {test_link}")
                return None
            soup = BeautifulSoup(response.text, 'html.parser')
            url = test_link
            title = soup.title.string.strip() if soup.title else title
        # Udtræk tekstindhold
        content = self.extract_main_text(soup)
        date = self.extract_date(soup, url, content)
        return self.extract_article_data(title, content, url, date)

    def extract_main_text(self, soup):
        """Udtrækker hovedindhold fra en artikel-side"""
        # Prøv at finde hovedtekst i <article>, <main>, eller store <div>
        main_selectors = ['article', 'main', 'div.article', 'div.main', 'div.node__content']
        for sel in main_selectors:
            main = soup.select_one(sel)
            if main:
                text = main.get_text(separator='\n', strip=True)
                if len(text) > 100:
                    return text
        # Fallback: alt tekst på siden
        return soup.get_text(separator='\n', strip=True)

    def extract_date(self, soup, url, content):
        """Samlet dato-ekstraktion (samme logik som før)"""
        date = ''  # Sikrer at date altid er defineret
        # Prøv forskellige dato-selektorer
        date_selectors = [
            'time[datetime]',
            'time',
            'span.date',
            'span.published',
            'div.date',
            'div.published',
            'meta[property="article:published_time"]',
            'meta[name="publish_date"]',
            '.field--name-created',
            '.node__meta'
        ]
        for selector in date_selectors:
            date_elem = soup.select_one(selector)
            if date_elem:
                if date_elem.name == 'meta':
                    date = date_elem.get('content', '')
                else:
                    if date_elem.name == 'time' and date_elem.get('datetime'):
                        date = date_elem.get('datetime')
                    else:
                        date = date_elem.get_text(strip=True)
                break
        # Hvis ingen dato fundet, prøv at finde dato i URL eller side
        if not date:
            url_date_match = re.search(r'/(\d{4})/(\d{2})/(\d{2})/', url)
            if url_date_match:
                year, month, day = url_date_match.groups()
                date = f"{year}-{month}-{day}"
            else:
                test_date_match = re.search(r'Testet i (\w+)\s+(\d{4})', content)
                if test_date_match:
                    month_name, year = test_date_match.groups()
                    month_map = {
                        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
                        'maj': '05', 'jun': '06', 'jul': '07', 'aug': '08',
                        'sep': '09', 'okt': '10', 'nov': '11', 'dec': '12'
                    }
                    month_num = month_map.get(month_name.lower()[:3], '01')
                    date = f"{year}-{month_num}-01"
                else:
                    date_text_match = re.search(r'(\d{1,2})\.\s*(\w+)\s*(\d{4})', content)
                    if date_text_match:
                        day, month_name, year = date_text_match.groups()
                        month_map = {
                            'januar': '01', 'februar': '02', 'marts': '03', 'april': '04',
                            'maj': '05', 'juni': '06', 'juli': '07', 'august': '08',
                            'september': '09', 'oktober': '10', 'november': '11', 'december': '12'
                        }
                        month_num = month_map.get(month_name.lower(), '01')
                        date = f"{year}-{month_num}-{day.zfill(2)}"
        return date
    
    def get_article_links_from_category(self, category_url):
        """Henter alle artikel-links fra en kategori"""
        logger.info(f"Scraper kategori: {category_url}")
        
        full_url = urljoin(self.base_url, category_url)
        response = self.get_page_content(full_url)
        if not response:
            return []
            
        soup = BeautifulSoup(response.content, 'html.parser')
        article_links = []
        
        # Find alle links der kunne være artikler
        links = soup.find_all('a', href=True)
        for link in links:
            href = link['href']
            if href.startswith('/'):
                full_article_url = urljoin(self.base_url, href)
                if self.is_article_url(full_article_url):
                    article_links.append(full_article_url)
        
        return list(set(article_links))  # Fjern duplikater
    
    def scrape_all_categories(self, max_articles=None):
        """Scraper kun privatøkonomi-kategorien og dens underkategorier"""
        logger.info("Starter scraping af Forbrugerrådet Tænk - KUN privatøkonomi")
        
        # Start med hovedkategorien
        start_url = "/privatoekonomi"
        all_article_links = self.get_article_links_from_category(start_url)
        
        # Fjern duplikater
        unique_links = list(set(all_article_links))
        logger.info(f"Fandt {len(unique_links)} unikke artikler i privatøkonomi")
        
        # Begræns antal artikler hvis max_articles er sat
        if max_articles:
            unique_links = unique_links[:max_articles]
            logger.info(f"Test mode: Scraper kun {max_articles} artikler")
        
        # Scraper hver artikel
        for i, link in enumerate(unique_links):
            logger.info(f"Scraper artikel {i+1}/{len(unique_links)}: {link}")
            article = self.extract_article_content(link)
            if article:
                self.articles.append(article)
            time.sleep(0.5)  # Pause mellem artikler
        
        logger.info(f"Scraping færdig. Fandt {len(self.articles)} økonomiske artikler i privatøkonomi")
        return self.articles
    
    def save_articles(self, filename="taenk_blog_posts.json"):
        """Gemmer artikler til JSON fil"""
        output_path = os.path.join("data", filename)
        
        data = {
            'source': 'Forbrugerrådet Tænk',
            'scraped_at': datetime.now().isoformat(),
            'total_articles': len(self.articles),
            'articles': self.articles
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Artikler gemt til {output_path}")
        return output_path

def main():
    import os
    import sys
    
    # Opret data mappe hvis den ikke findes
    os.makedirs("data", exist_ok=True)
    
    scraper = TaenkScraper()
    
    # Tjek om test mode er aktiveret
    test_mode = "--test" in sys.argv
    max_articles = 10 if test_mode else None
    
    articles = scraper.scrape_all_categories(max_articles=max_articles)
    
    if articles:
        filename = "taenk_test_articles.json" if test_mode else "taenk_blog_posts.json"
        output_file = scraper.save_articles(filename)
        print(f"Scraping færdig! {len(articles)} økonomiske artikler gemt til {output_file}")
        
        if test_mode:
            # Vis de første 3 artikler som eksempel
            print("\nEksempel på fundne artikler:")
            for i, article in enumerate(articles[:3]):
                print(f"{i+1}. {article['title']}")
                print(f"   URL: {article['url']}")
                print(f"   Indhold (første 100 tegn): {article['content'][:100]}...")
                print()
    else:
        print("Ingen økonomiske artikler fundet")

if __name__ == "__main__":
    main() 