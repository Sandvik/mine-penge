#!/usr/bin/env python3
"""
Analyse af nye kilder til MinePenge
Tjekker struktur, indhold og scraping muligheder
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from urllib.parse import urljoin, urlparse
import re

class SourceAnalyzer:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def analyze_taenk(self):
        """Analyser Forbrugerrådet Tænk"""
        print("🔍 Analyserer Forbrugerrådet Tænk...")
        
        base_url = "https://taenk.dk"
        
        try:
            response = self.session.get(base_url, timeout=10, verify=False)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find artikler - prøv forskellige muligheder
            article_elements = []
            
            # Prøv forskellige selectors
            selectors = [
                'article',
                '.article',
                '.post',
                '.news-item',
                '.content-item'
            ]
            
            for selector in selectors:
                elements = soup.select(selector)
                if elements:
                    article_elements = elements
                    print(f"📊 Fundet {len(elements)} artikler med selector: {selector}")
                    break
            
            if not article_elements:
                # Prøv at finde links der kunne være artikler
                links = soup.find_all('a', href=True)
                article_links = [link for link in links if any(word in link.get('href', '').lower() for word in ['artikel', 'nyhed', 'test', 'sammenligning'])]
                print(f"📊 Fundet {len(article_links)} potentielle artikel-links")
                
                return {
                    'url': base_url,
                    'status': 'success',
                    'article_count': len(article_links),
                    'structure': {'found_links': True},
                    'has_pagination': False,
                    'sample_titles': [link.get_text(strip=True)[:50] + '...' for link in article_links[:5] if link.get_text(strip=True)],
                    'note': 'Kunne ikke finde standard artikel-struktur, men fundet artikel-links'
                }
            
            # Analyser struktur
            structure_info = {
                'title_selectors': [],
                'link_selectors': [],
                'summary_selectors': [],
                'date_selectors': []
            }
            
            for i, element in enumerate(article_elements[:5]):
                # Find titler
                title_elem = element.find(['h1', 'h2', 'h3', 'h4']) or element.find(class_=re.compile(r'title|headline'))
                if title_elem:
                    structure_info['title_selectors'].append(str(title_elem.name) + (f".{title_elem.get('class', [''])[0]}" if title_elem.get('class') else ''))
                
                # Find links
                link_elem = element.find('a')
                if link_elem:
                    structure_info['link_selectors'].append('a' + (f".{link_elem.get('class', [''])[0]}" if link_elem.get('class') else ''))
                
                # Find summaries
                summary_elem = element.find(['p', 'div'], class_=re.compile(r'summary|excerpt|description'))
                if summary_elem:
                    structure_info['summary_selectors'].append(str(summary_elem.name) + (f".{summary_elem.get('class', [''])[0]}" if summary_elem.get('class') else ''))
                
                # Find dates
                date_elem = element.find(['time', 'span'], class_=re.compile(r'date|time'))
                if date_elem:
                    structure_info['date_selectors'].append(str(date_elem.name) + (f".{date_elem.get('class', [''])[0]}" if date_elem.get('class') else ''))
            
            # Tjek for pagination
            pagination = soup.find(['nav', 'div'], class_=re.compile(r'pagination|pager'))
            
            return {
                'url': base_url,
                'status': 'success',
                'article_count': len(article_elements),
                'structure': structure_info,
                'has_pagination': bool(pagination),
                'sample_titles': [elem.get_text(strip=True)[:50] + '...' for elem in article_elements[:3] if elem.get_text(strip=True)]
            }
            
        except Exception as e:
            return {
                'url': base_url,
                'status': 'error',
                'error': str(e)
            }
    
    def analyze_penge_dk(self):
        """Analyser Penge.dk"""
        print("🔍 Analyserer Penge.dk...")
        
        # Prøv forskellige mulige URLs
        urls_to_try = [
            "https://penge.dk",
            "https://www.penge.dk",
            "https://penge.dk/artikler",
            "https://www.penge.dk/artikler"
        ]
        
        for url in urls_to_try:
            try:
                print(f"  Prøver: {url}")
                response = self.session.get(url, timeout=10, verify=False)
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Find artikler
                article_elements = soup.find_all('article') or soup.find_all('div', class_=re.compile(r'article|post|card'))
                
                if article_elements:
                    print(f"📊 Fundet {len(article_elements)} artikler på {url}")
                    
                    # Analyser struktur
                    structure_info = {
                        'title_selectors': [],
                        'link_selectors': [],
                        'summary_selectors': [],
                        'date_selectors': []
                    }
                    
                    for i, element in enumerate(article_elements[:5]):
                        # Find titler
                        title_elem = element.find(['h1', 'h2', 'h3', 'h4']) or element.find(class_=re.compile(r'title|headline'))
                        if title_elem:
                            structure_info['title_selectors'].append(str(title_elem.name) + (f".{title_elem.get('class', [''])[0]}" if title_elem.get('class') else ''))
                        
                        # Find links
                        link_elem = element.find('a')
                        if link_elem:
                            structure_info['link_selectors'].append('a' + (f".{link_elem.get('class', [''])[0]}" if link_elem.get('class') else ''))
                        
                        # Find summaries
                        summary_elem = element.find(['p', 'div'], class_=re.compile(r'summary|excerpt|description'))
                        if summary_elem:
                            structure_info['summary_selectors'].append(str(summary_elem.name) + (f".{summary_elem.get('class', [''])[0]}" if summary_elem.get('class') else ''))
                        
                        # Find dates
                        date_elem = element.find(['time', 'span'], class_=re.compile(r'date|time'))
                        if date_elem:
                            structure_info['date_selectors'].append(str(date_elem.name) + (f".{date_elem.get('class', [''])[0]}" if date_elem.get('class') else ''))
                    
                    # Tjek for pagination
                    pagination = soup.find(['nav', 'div'], class_=re.compile(r'pagination|pager'))
                    
                    return {
                        'url': url,
                        'status': 'success',
                        'article_count': len(article_elements),
                        'structure': structure_info,
                        'has_pagination': bool(pagination),
                        'sample_titles': [elem.get_text(strip=True)[:50] + '...' for elem in article_elements[:3] if elem.get_text(strip=True)]
                    }
                    
            except Exception as e:
                print(f"  Fejl med {url}: {str(e)[:50]}...")
                continue
        
        return {
            'url': 'penge.dk',
            'status': 'error',
            'error': 'Kunne ikke tilgå nogen af de prøvede URLs'
        }
    
    def analyze_gaeldsraadgivning(self):
        """Analyser Gældsrådgivning.dk"""
        print("🔍 Analyserer Gældsrådgivning.dk...")
        
        base_url = "https://gaeldsraadgivning.dk"
        
        try:
            response = self.session.get(base_url, timeout=10, verify=False)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find artikler
            article_elements = soup.find_all('article') or soup.find_all('div', class_=re.compile(r'article|post|card'))
            
            print(f"📊 Fundet {len(article_elements)} potentielle artikler")
            
            # Analyser struktur
            structure_info = {
                'title_selectors': [],
                'link_selectors': [],
                'summary_selectors': [],
                'date_selectors': []
            }
            
            for i, element in enumerate(article_elements[:5]):
                # Find titler
                title_elem = element.find(['h1', 'h2', 'h3', 'h4']) or element.find(class_=re.compile(r'title|headline'))
                if title_elem:
                    structure_info['title_selectors'].append(str(title_elem.name) + (f".{title_elem.get('class', [''])[0]}" if title_elem.get('class') else ''))
                
                # Find links
                link_elem = element.find('a')
                if link_elem:
                    structure_info['link_selectors'].append('a' + (f".{link_elem.get('class', [''])[0]}" if link_elem.get('class') else ''))
                
                # Find summaries
                summary_elem = element.find(['p', 'div'], class_=re.compile(r'summary|excerpt|description'))
                if summary_elem:
                    structure_info['summary_selectors'].append(str(summary_elem.name) + (f".{summary_elem.get('class', [''])[0]}" if summary_elem.get('class') else ''))
                
                # Find dates
                date_elem = element.find(['time', 'span'], class_=re.compile(r'date|time'))
                if date_elem:
                    structure_info['date_selectors'].append(str(date_elem.name) + (f".{date_elem.get('class', [''])[0]}" if date_elem.get('class') else ''))
            
            # Tjek for pagination
            pagination = soup.find(['nav', 'div'], class_=re.compile(r'pagination|pager'))
            
            return {
                'url': base_url,
                'status': 'success',
                'article_count': len(article_elements),
                'structure': structure_info,
                'has_pagination': bool(pagination),
                'sample_titles': [elem.get_text(strip=True)[:50] + '...' for elem in article_elements[:3] if elem.get_text(strip=True)]
            }
            
        except Exception as e:
            return {
                'url': base_url,
                'status': 'error',
                'error': str(e)
            }
    
    def analyze_su_dk(self):
        """Analyser SU.dk"""
        print("🔍 Analyserer SU.dk...")
        
        base_url = "https://su.dk"
        
        try:
            response = self.session.get(base_url, timeout=10, verify=False)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find artikler
            article_elements = soup.find_all('article') or soup.find_all('div', class_=re.compile(r'article|post|card'))
            
            print(f"📊 Fundet {len(article_elements)} potentielle artikler")
            
            # Analyser struktur
            structure_info = {
                'title_selectors': [],
                'link_selectors': [],
                'summary_selectors': [],
                'date_selectors': []
            }
            
            for i, element in enumerate(article_elements[:5]):
                # Find titler
                title_elem = element.find(['h1', 'h2', 'h3', 'h4']) or element.find(class_=re.compile(r'title|headline'))
                if title_elem:
                    structure_info['title_selectors'].append(str(title_elem.name) + (f".{title_elem.get('class', [''])[0]}" if title_elem.get('class') else ''))
                
                # Find links
                link_elem = element.find('a')
                if link_elem:
                    structure_info['link_selectors'].append('a' + (f".{link_elem.get('class', [''])[0]}" if link_elem.get('class') else ''))
                
                # Find summaries
                summary_elem = element.find(['p', 'div'], class_=re.compile(r'summary|excerpt|description'))
                if summary_elem:
                    structure_info['summary_selectors'].append(str(summary_elem.name) + (f".{summary_elem.get('class', [''])[0]}" if summary_elem.get('class') else ''))
                
                # Find dates
                date_elem = element.find(['time', 'span'], class_=re.compile(r'date|time'))
                if date_elem:
                    structure_info['date_selectors'].append(str(date_elem.name) + (f".{date_elem.get('class', [''])[0]}" if date_elem.get('class') else ''))
            
            # Tjek for pagination
            pagination = soup.find(['nav', 'div'], class_=re.compile(r'pagination|pager'))
            
            return {
                'url': base_url,
                'status': 'success',
                'article_count': len(article_elements),
                'structure': structure_info,
                'has_pagination': bool(pagination),
                'sample_titles': [elem.get_text(strip=True)[:50] + '...' for elem in article_elements[:3] if elem.get_text(strip=True)]
            }
            
        except Exception as e:
            return {
                'url': base_url,
                'status': 'error',
                'error': str(e)
            }

def main():
    """Hovedfunktion til at analysere alle kilder"""
    print("🚀 Starter analyse af nye kilder...")
    
    analyzer = SourceAnalyzer()
    
    results = {
        'taenk': analyzer.analyze_taenk(),
        'penge_dk': analyzer.analyze_penge_dk(),
        'gaeldsraadgivning': analyzer.analyze_gaeldsraadgivning(),
        'su_dk': analyzer.analyze_su_dk()
    }
    
    # Gem resultater
    with open('data/source_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    # Print sammendrag
    print("\n📊 SAMMENDRAG AF ANALYSE:")
    print("=" * 50)
    
    for source, result in results.items():
        print(f"\n{source.upper()}:")
        if result['status'] == 'success':
            print(f"  ✅ Status: {result['status']}")
            print(f"  📄 Artikler: {result['article_count']}")
            print(f"  📄 Pagination: {'Ja' if result['has_pagination'] else 'Nej'}")
            print(f"  🔗 URL: {result['url']}")
            if result['sample_titles']:
                print(f"  📝 Eksempel titler:")
                for title in result['sample_titles']:
                    print(f"    - {title}")
        else:
            print(f"  ❌ Status: {result['status']}")
            print(f"  ⚠️  Fejl: {result.get('error', 'Ukendt fejl')}")
    
    print(f"\n💾 Detaljeret analyse gemt i: data/source_analysis.json")

if __name__ == "__main__":
    main() 