# Mine Penge Scraper Integration Guide

Denne guide forklarer hvordan Scraper projektet integreres i minepenge.dk projektet.

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
├── src/                        # Frontend React app
├── public/                     # Statiske filer
└── ...
```

### Mulighed 2: Som tools mappe
```
minepenge/
├── tools/
│   └── scraper/               # Scraper som værktøj
├── src/
├── public/
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

## 🔗 Integration med Frontend

### 1. Data Flow
```
Blogs → Scrapers → Raw JSON → Tagging → Tagged JSON → articles.json → Frontend
```

### 2. Frontend Integration
```javascript
// src/services/articleService.js
import articlesData from '../data/articles.json';

export const getArticles = () => {
  return articlesData.articles;
};

export const getArticlesByTag = (tag) => {
  return articlesData.articles.filter(article => 
    article.minepenge_tags.includes(tag)
  );
};
```

### 3. Automatisk Data Opdatering
```bash
# Workflow til at opdatere frontend data
cd scraper
python update_all_data_realtime.py
python tagging/content_tagger.py
python build_articles.py

# Kopier til frontend
cp articles.json ../src/data/
```

## 🔧 Konfiguration

### Environment Variables
```bash
# Tilføj til minepenge .env fil (valgfrit)
SCRAPER_DATA_PATH=./scraper/data
SCRAPER_TAGGED_PATH=./scraper/data/tagged
SCRAPER_LOG_LEVEL=INFO
```

### Frontend Data Struktur
```json
{
  "metadata": {
    "total_articles": 847,
    "sources": ["Moneypenny", "Nordnet", "Budgetnoerden", "Ungmedpenge", "Mitteldorf"],
    "date_range": "2020-01-01 to 2025-01-15",
    "built_at": "2025-01-15T10:30:00"
  },
  "articles": [
    {
      "article_id": "unique_id",
      "title": "Artikel titel",
      "source": "Blog navn",
      "url": "artikel URL",
      "summary": "Kort resume...",
      "target_audiences": ["målgruppe1", "målgruppe2"],
      "complexity_level": "begynder",
      "minepenge_tags": ["tag1", "tag2"],
      "tag_categories": ["Kategori1", "Kategori2"],
      "date_published": "2025-01-15",
      "word_count": 1234
    }
  ]
}
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

### Test frontend integration
```bash
# Start frontend efter data opdatering
npm run dev
# Tjek at artikler vises korrekt
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
- Frontend data opdatering success rate
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

### Automatiseret Workflow
```bash
# Script til at køre hele workflow
#!/bin/bash
cd scraper
python update_all_data_realtime.py
python tagging/content_tagger.py
python build_articles.py
cp articles.json ../src/data/
echo "Data opdateret: $(date)"
```

### Cron Jobs
```bash
# Kør dagligt kl 2:00
0 2 * * * cd /path/to/minepenge/scraper && python update_all_data_realtime.py && python tagging/content_tagger.py && python build_articles.py && cp articles.json ../src/data/
```

### GitHub Actions (Valgfrit)
```yaml
# .github/workflows/update-data.yml
name: Update Article Data
on:
  schedule:
    - cron: '0 2 * * *'  # Dagligt kl 2:00
  workflow_dispatch:     # Manuelt trigger

jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: |
          cd scraper
          pip install -r requirements.txt
      - name: Update data
        run: |
          cd scraper
          python update_all_data_realtime.py
          python tagging/content_tagger.py
          python build_articles.py
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add src/data/articles.json
          git commit -m "Update article data" || exit 0
          git push
```

## 📊 Frontend Integration Eksempler

### Søgning og Filtrering
```javascript
// src/components/FilterBar.jsx
export const FilterBar = ({ onFilterChange }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState('');
  
  const handleFilter = () => {
    onFilterChange({
      tags: selectedTags,
      audience: selectedAudience
    });
  };
  
  return (
    <div className="filter-bar">
      {/* Filter UI */}
    </div>
  );
};
```

### Artikel Visning
```javascript
// src/components/ArticleCard.jsx
export const ArticleCard = ({ article }) => {
  return (
    <div className="article-card">
      <h3>{article.title}</h3>
      <p>{article.summary}</p>
      <div className="tags">
        {article.minepenge_tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
      <div className="audience">
        {article.target_audiences.map(audience => (
          <span key={audience} className="audience-tag">{audience}</span>
        ))}
      </div>
    </div>
  );
};
```

## 📞 Support

For spørgsmål om scraper integration, kontakt udviklingsteamet på minepenge.dk

---

*Opdateret: Januar 2025 - Fjernet database referencer, fokuseret på JSON-baseret integration* 