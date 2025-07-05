# Mine Penge Scraper Integration Guide

Denne guide forklarer hvordan Scraper projektet kan integreres i minepenge.dk projektet.

## 📁 Anbefalede Placeringer

### Mulighed 1: Separat mappe (Anbefalet)
```
minepenge/
├── scraper/                    # Hele Scraper mappen
│   ├── update_all_data.py
│   ├── update_all_data_realtime.py
│   ├── scrapers/
│   ├── tagging/
│   ├── data/
│   ├── requirements.txt
│   └── README.md
├── frontend/
├── backend/
└── ...
```

### Mulighed 2: Som backend komponent
```
minepenge/
├── backend/
│   ├── scraper/               # Scraper som backend komponent
│   ├── api/
│   ├── database/
│   └── ...
├── frontend/
└── ...
```

### Mulighed 3: Som tools mappe
```
minepenge/
├── tools/
│   └── scraper/               # Scraper som værktøj
├── frontend/
├── backend/
└── ...
```

## 🚀 Installation i minepenge projektet

### 1. Kopier Scraper mappen
```bash
# Fra minepenge rod
cp -r /path/to/Scraper ./scraper
```

### 2. Installer dependencies
```bash
cd scraper
pip install -r requirements.txt
```

### 3. Test installation
```bash
# Test en enkelt scraper
python scrapers/scraperMoneypenny.py

# Test master script
python update_all_data_realtime.py
```

## 🔗 Integration muligheder

### 1. Database Integration
```python
# Eksempel: Import tagged data til minepenge database
import json
from minepenge.database import Article, Tag

def import_tagged_articles():
    with open('data/tagged/tagged_mitteldorf_blog_posts.json', 'r') as f:
        data = json.load(f)
    
    for article_data in data['articles']:
        article = Article(
            title=article_data['title'],
            content=article_data['original_data']['content'],
            summary=article_data['summary'],
            source=article_data['source'],
            url=article_data['url'],
            complexity_level=article_data['complexity_level']
        )
        # Gem artikel og tags...
```

### 2. API Endpoints
```python
# Eksempel: API endpoint til at køre scrapers
@app.route('/api/scraper/run', methods=['POST'])
def run_scraper():
    import subprocess
    result = subprocess.run(['python', 'scraper/update_all_data_realtime.py'])
    return {'status': 'success' if result.returncode == 0 else 'error'}

@app.route('/api/scraper/status', methods=['GET'])
def scraper_status():
    # Returner status af seneste kørsel
    pass
```

### 3. Scheduled Jobs
```python
# Eksempel: Automatisk opdatering hver dag
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()
scheduler.add_job(
    func=run_daily_scrape,
    trigger="cron",
    hour=2,  # Kør kl 2 om natten
    id="daily_scraper"
)
scheduler.start()
```

## 📊 Data Flow

### Nuværende flow:
```
Blogs → Scrapers → Raw JSON → Tagging → Tagged JSON
```

### Integreret flow:
```
Blogs → Scrapers → Raw JSON → Tagging → Tagged JSON → Database → Frontend
```

## 🔧 Konfiguration

### Environment Variables
```bash
# Tilføj til minepenge .env fil
SCRAPER_DATA_PATH=./scraper/data
SCRAPER_TAGGED_PATH=./scraper/data/tagged
SCRAPER_LOG_LEVEL=INFO
```

### Database Schema
```sql
-- Eksempel på database tabel for artikler
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    article_id VARCHAR(50) UNIQUE,
    title TEXT NOT NULL,
    content TEXT,
    summary TEXT,
    source VARCHAR(100),
    url TEXT UNIQUE,
    complexity_level VARCHAR(20),
    target_audiences JSONB,
    minepenge_tags JSONB,
    confidence_scores JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing

### Test scripts individuelt
```bash
cd scraper
python tagging/test_tagger.py
python scrapers/scraperMoneypenny.py
```

### Test fuld integration
```bash
cd scraper
python update_all_data_realtime.py
```

### Test database import
```python
# Test script til at importere data
python -c "
from integration import import_tagged_articles
import_tagged_articles()
"
```

## 📈 Monitoring

### Logging
```python
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log'),
        logging.StreamHandler()
    ]
)
```

### Metrics
- Antal artikler scraped per dag
- Tagging accuracy
- Database import success rate
- Scraper performance

## 🔒 Sikkerhed

### Rate Limiting
- Alle scrapers har allerede delays mellem requests
- Respekterer robots.txt

### Error Handling
- Fallback metoder i alle scrapers
- Graceful error handling i master scripts

### Data Validation
- JSON schema validation
- Content quality checks
- Duplicate detection

## 🚀 Deployment

### Docker (Valgfrit)
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY scraper/ ./scraper/
RUN pip install -r scraper/requirements.txt

CMD ["python", "scraper/update_all_data_realtime.py"]
```

### Cron Jobs
```bash
# Kør dagligt kl 2:00
0 2 * * * cd /path/to/minepenge/scraper && python update_all_data_realtime.py
```

## 📞 Support

For spørgsmål om integration, kontakt udviklingsteamet på minepenge.dk 