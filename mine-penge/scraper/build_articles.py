import os
import json
from datetime import datetime
from glob import glob

TAGGED_DIR = os.path.join(os.path.dirname(__file__), 'data', 'tagged')
OUTPUT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'articles.json'))


def find_tagged_files():
    files = glob(os.path.join(TAGGED_DIR, 'tagged_*.json'))
    # Exclude report and test files
    return [f for f in files if 'report' not in f and 'test' not in f]


def load_articles_from_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if isinstance(data, list):
        return data
    elif isinstance(data, dict):
        if 'articles' in data and isinstance(data['articles'], list):
            return data['articles']
        elif 'data' in data and isinstance(data['data'], list):
            return data['data']
    print(f"⚠️  Unexpected data structure in {os.path.basename(filepath)}")
    return []


def remove_duplicates(articles):
    seen = set()
    unique = []
    for article in articles:
        key = article.get('url') or article.get('id') or article.get('title')
        if key and key not in seen:
            seen.add(key)
            unique.append(article)
    return unique


def sort_articles(articles):
    def get_date(a):
        for field in ['publishedAt', 'foundAt']:
            val = a.get(field)
            if val:
                try:
                    # Try ISO format first
                    return datetime.fromisoformat(val.replace('Z', '+00:00'))
                except Exception:
                    pass
        return datetime(1970, 1, 1)
    return sorted(articles, key=get_date, reverse=True)


def main():
    print('🚀 Starting Python article data build...')
    files = find_tagged_files()
    print(f'📂 Found {len(files)} tagged data files:')
    for f in files:
        print(f'   - {os.path.basename(f)}')

    all_articles = []
    source_stats = {}

    for f in files:
        source_name = os.path.basename(f).replace('tagged_', '').replace('_blog_posts.json', '')
        articles = load_articles_from_file(f)
        for article in articles:
            if 'source' not in article:
                article['source'] = source_name
        all_articles.extend(articles)
        source_stats[source_name] = len(articles)
        print(f'✅ Loaded {len(articles)} articles from {source_name}')

    unique_articles = remove_duplicates(all_articles)
    print(f'🔄 Removed {len(all_articles) - len(unique_articles)} duplicate articles')

    sorted_articles = sort_articles(unique_articles)

    # Build metadata
    metadata = {
        'totalArticles': len(sorted_articles),
        'lastUpdated': datetime.now().isoformat(),
        'sources': list(source_stats.keys()),
        'articlesPerSource': source_stats,
        'buildInfo': {
            'buildDate': datetime.now().isoformat(),
            'sourceFiles': [os.path.basename(f) for f in files],
            'totalSize': None  # Set after writing
        }
    }

    # Ensure output dir exists
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    # Write file
    consolidated = {
        'articles': sorted_articles,
        'metadata': metadata
    }
    json_str = json.dumps(consolidated, ensure_ascii=False, indent=2)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(json_str)
    size_mb = os.path.getsize(OUTPUT_PATH) / 1024 / 1024
    metadata['buildInfo']['totalSize'] = f"{size_mb:.2f} MB"

    print(f'✅ Successfully created: {OUTPUT_PATH}')
    print(f'📊 Total articles: {len(sorted_articles)}')
    print(f'📁 File size: {size_mb:.2f} MB')
    print('\n📈 Articles per source:')
    for source, count in source_stats.items():
        print(f'   {source}: {count} articles')

if __name__ == '__main__':
    main() 