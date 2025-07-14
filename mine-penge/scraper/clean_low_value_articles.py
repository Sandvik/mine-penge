#!/usr/bin/env python3
"""
Analyse og rensning af artikeldatasæt for lavværdi-indhold
Kør: 
  python clean_low_value_articles.py --analyze   # Analyse
  python clean_low_value_articles.py --clean     # Rensning
  python clean_low_value_articles.py --report    # Vis rapport
"""
import json
import re
import sys
import argparse
from typing import List, Dict, Any
from datetime import datetime
from collections import Counter

ARTICLES_PATH = '../src/data/articles.json'
REPORT_PATH = 'data/cleaning_report.json'

# --------- WHITELIST ---------
WHITELIST = [
    "Boganmeldelse: “Alt du skal vide om Børneopsparing”",
    "Alt du skal vide om skat på investering",
    "Saxo Bank vs. Nordnet: Hvilken aktieplatform er bedst i 2025?",
    "Degiro vs Nordnet – Hvilken platform bør du vælge? [2025]",
    "June vs Nordnet: Hvilken platform bør du vælge? [2025]"
]

def is_whitelisted(title: str) -> bool:
    return title.strip() in WHITELIST

# --------- DATA LOAD/SAVE ---------
def load_articles(file_path: str) -> List[Dict[str, Any]]:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data.get('articles', [])

def save_articles(articles: List[Dict[str, Any]], file_path: str):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump({'articles': articles}, f, ensure_ascii=False, indent=2)

# --------- ANALYSEFUNKTIONER ---------
def analyze_titles(articles: List[Dict[str, Any]]) -> Dict[str, Any]:
    titles = [article.get('title', '') for article in articles]
    low_value_patterns = {
        'portfolio_updates': [r'opdatering.*portefølje', r'portefølje.*opdatering'],
        'market_commentary': [r'marked.*kommentar', r'kommentar.*marked'],
        'generic_advice': [r'tips.*til', r'gode.*råd', r'guide.*til', r'alt.*om']
    }
    results = {}
    for pattern_type, patterns in low_value_patterns.items():
        matches = []
        for title in titles:
            for pattern in patterns:
                if re.search(pattern, title.lower()):
                    matches.append(title)
                    break
        results[pattern_type] = {'count': len(matches), 'examples': matches[:5]}
    return results

def analyze_content_quality(articles: List[Dict[str, Any]]) -> Dict[str, Any]:
    quality_metrics = {'short_summaries': 0, 'long_summaries': 0, 'no_summary': 0}
    for article in articles:
        summary = article.get('summary', '')
        if not summary:
            quality_metrics['no_summary'] += 1
        elif len(summary) < 100:
            quality_metrics['short_summaries'] += 1
        elif len(summary) > 300:
            quality_metrics['long_summaries'] += 1
    return quality_metrics

def find_repetitive_content(articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    title_groups = {}
    for article in articles:
        title = article.get('title', '').lower()
        base_pattern = re.sub(r'\d{4}', '[YEAR]', title)
        base_pattern = re.sub(r'\[.*?\]', '[DETAIL]', base_pattern)
        base_pattern = re.sub(r'\(.*?\)', '(DETAIL)', base_pattern)
        if base_pattern not in title_groups:
            title_groups[base_pattern] = []
        title_groups[base_pattern].append(article)
    repetitive_patterns = []
    for pattern, articles_list in title_groups.items():
        if len(articles_list) >= 3:
            repetitive_patterns.append({
                'pattern': pattern,
                'count': len(articles_list),
                'examples': [a.get('title', '') for a in articles_list[:3]]
            })
    return sorted(repetitive_patterns, key=lambda x: x['count'], reverse=True)

# --------- RENSNINGSFUNKTIONER ---------
def identify_low_value_articles(articles: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    categories = {
        'pagination_articles': [],
        'generic_guides': [],
        'product_comparisons': [],
        'year_specific_old': [],
        'quarterly_reports': [],
        'portfolio_updates': [],
        'very_short_summaries': [],
        'repetitive_patterns': []
    }
    for article in articles:
        title = article.get('title', '').strip()
        summary = article.get('summary', '')
        if is_whitelisted(title):
            continue
        if re.search(r'side.*\d+.*af.*\d+', title):
            categories['pagination_articles'].append(article)
            continue
        if any(pattern in title.lower() for pattern in ['alt du skal vide om', 'komplet guide til', 'alt om']):
            categories['generic_guides'].append(article)
            continue
        if 'vs' in title and any(word in title for word in ['nordnet', 'degiro', 'etoro', 'nordea', 'danske', 'saxo']):
            categories['product_comparisons'].append(article)
            continue
        if re.search(r'202[0-3]', title) or re.search(r'202[0-3]', summary):
            categories['year_specific_old'].append(article)
            continue
        if re.search(r'kvartalsopgørelse.*\d+\.\s*kvartal', title):
            categories['quarterly_reports'].append(article)
            continue
        if re.search(r'opdatering.*portefølje', title, re.IGNORECASE) or re.search(r'portefølje.*opdatering', title, re.IGNORECASE):
            categories['portfolio_updates'].append(article)
            continue
        if len(summary) < 50:
            categories['very_short_summaries'].append(article)
            continue
    return categories

def clean_repetitive_patterns(articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    pattern_groups = {}
    for article in articles:
        title = article.get('title', '').lower()
        base_pattern = re.sub(r'\d{4}', '[YEAR]', title)
        base_pattern = re.sub(r'\[.*?\]', '[DETAIL]', base_pattern)
        base_pattern = re.sub(r'\(.*?\)', '(DETAIL)', base_pattern)
        if base_pattern not in pattern_groups:
            pattern_groups[base_pattern] = []
        pattern_groups[base_pattern].append(article)
    articles_to_remove = []
    for pattern, articles_list in pattern_groups.items():
        if len(articles_list) >= 3:
            def extract_year(article):
                title = article.get('title', '')
                year_match = re.search(r'20\d{2}', title)
                return int(year_match.group()) if year_match else 0
            sorted_articles = sorted(articles_list, key=extract_year, reverse=True)
            articles_to_remove.extend(sorted_articles[1:])
    return articles_to_remove

def clean_articles(articles: List[Dict[str, Any]]) -> Dict[str, Any]:
    original_count = len(articles)
    low_value_categories = identify_low_value_articles(articles)
    repetitive_articles = clean_repetitive_patterns(articles)
    low_value_categories['repetitive_patterns'] = repetitive_articles
    articles_to_remove = []
    for category, articles_list in low_value_categories.items():
        articles_to_remove.extend(articles_list)
    unique_articles_to_remove = []
    seen_ids = set()
    for article in articles_to_remove:
        article_id = article.get('article_id')
        if article_id not in seen_ids:
            unique_articles_to_remove.append(article)
            seen_ids.add(article_id)
    cleaned_articles = []
    removed_ids = {article.get('article_id') for article in unique_articles_to_remove}
    for article in articles:
        if article.get('article_id') not in removed_ids:
            cleaned_articles.append(article)
    report = {
        'timestamp': datetime.now().isoformat(),
        'original_count': original_count,
        'cleaned_count': len(cleaned_articles),
        'removed_count': len(unique_articles_to_remove),
        'reduction_percentage': (len(unique_articles_to_remove) / original_count) * 100 if original_count else 0,
        'categories_removed': {
            category: len(articles_list) 
            for category, articles_list in low_value_categories.items() 
            if articles_list
        },
        'examples_removed': {
            category: [article.get('title', '') for article in articles_list[:3]]
            for category, articles_list in low_value_categories.items()
            if articles_list
        }
    }
    return {'cleaned_articles': cleaned_articles, 'report': report}

# --------- CLI ---------
def clean_text_for_console(text):
    """Clean text to avoid encoding issues on Windows console"""
    try:
        # Try to encode as ASCII, replacing problematic characters
        return text.encode('ascii', 'replace').decode('ascii')
    except:
        # Fallback: remove all non-ASCII characters
        return ''.join(char for char in text if ord(char) < 128)

def print_report(report):
    print(f"\nRAPPORT fra rensning/analyse:")
    print(f"Originalt antal artikler: {report['original_count']}")
    print(f"Fjernet: {report['removed_count']} ({report['reduction_percentage']:.1f}%)")
    print(f"Tilbage: {report['cleaned_count']}")
    print(f"\nFjernede kategorier:")
    for cat, count in report['categories_removed'].items():
        print(f"  {cat}: {count}")
    print(f"\nEksempler pa fjernede artikler:")
    for cat, examples in report['examples_removed'].items():
        print(f"  {cat}:")
        for ex in examples:
            clean_ex = clean_text_for_console(ex)
            print(f"    - {clean_ex}")

def main():
    parser = argparse.ArgumentParser(description="Analyse og rensning af artikeldatasæt")
    parser.add_argument('--analyze', action='store_true', help='Kør analyse af artikler')
    parser.add_argument('--clean', action='store_true', help='Rens lavværdi-artikler')
    parser.add_argument('--report', action='store_true', help='Vis rapport fra seneste rensning')
    args = parser.parse_args()

    if args.analyze:
        articles = load_articles(ARTICLES_PATH)
        print("\n--- Titelmønstre ---")
        print(json.dumps(analyze_titles(articles), indent=2, ensure_ascii=False))
        print("\n--- Kvalitetsanalyse ---")
        print(json.dumps(analyze_content_quality(articles), indent=2, ensure_ascii=False))
        print("\n--- Repetitive mønstre ---")
        for pattern in find_repetitive_content(articles)[:10]:
            clean_pattern = clean_text_for_console(pattern['pattern'])
            print(f"{clean_pattern} ({pattern['count']} artikler)")
            for ex in pattern['examples']:
                clean_ex = clean_text_for_console(ex)
                print(f"  - {clean_ex}")
    elif args.clean:
        articles = load_articles(ARTICLES_PATH)
        result = clean_articles(articles)
        save_articles(result['cleaned_articles'], ARTICLES_PATH)
        with open(REPORT_PATH, 'w', encoding='utf-8') as f:
            json.dump(result['report'], f, ensure_ascii=False, indent=2)
        print_report(result['report'])
    elif args.report:
        with open(REPORT_PATH, 'r', encoding='utf-8') as f:
            report = json.load(f)
        print_report(report)
    else:
        parser.print_help()

if __name__ == "__main__":
    main() 