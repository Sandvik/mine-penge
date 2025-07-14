#!/usr/bin/env python3
"""
Scraper for Bolius.dk artikler (forside)
Gemmer titler, links, kategorier og billeder i JSON
"""
import requests
from bs4 import BeautifulSoup
import json
from urllib.parse import urljoin

BASE_URL = "https://www.bolius.dk"
OUTPUT_FILE = "data/bolius_articles.json"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def scrape_bolius_frontpage():
    print("🔍 Henter artikler fra Bolius.dk forsiden...")
    response = requests.get(BASE_URL, headers=headers, timeout=10)
    soup = BeautifulSoup(response.content, 'html.parser')
    articles = []
    article_elements = soup.find_all('article', class_='product card')
    print(f"📊 Fundet {len(article_elements)} artikler på forsiden")
    for element in article_elements:
        article = {}
        # Titel
        title_elem = element.find('h2', class_='card-title')
        if title_elem:
            article['title'] = title_elem.get_text(strip=True)
        # Link
        link_elem = element.find('a')
        if link_elem:
            article['url'] = urljoin(BASE_URL, link_elem.get('href', ''))
        # Kategori
        category_elem = element.find('p', class_='category')
        if category_elem:
            article['category'] = category_elem.get_text(strip=True)
        # Billede alt-tekst
        img_elem = element.find('img')
        if img_elem:
            article['image_alt'] = img_elem.get('alt', '')
        if article:
            articles.append(article)
    return articles

def main():
    articles = scrape_bolius_frontpage()
    print(f"💾 Gemmer {len(articles)} artikler i {OUTPUT_FILE}")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump({'articles': articles}, f, ensure_ascii=False, indent=2)
    # Print eksempler
    print("\nEksempler:")
    for art in articles[:5]:
        print(f"- {art['title']} ({art.get('category', '-')}) -> {art['url']}")

if __name__ == "__main__":
    main() 