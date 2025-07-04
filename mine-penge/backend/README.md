# MinePenge Backend - Python Scraper API

Dette er backend API'et til MinePenge.dk som håndterer web scraping af danske økonomi-artikler.

## Funktioner

- **Web Scraping**: Scraper artikler fra danske nyhedssites
- **AI Klassificering**: Automatisk tagging og klassificering af artikler
- **REST API**: FastAPI backend med CORS support
- **Deduplicering**: Fjerner duplikerede artikler
- **Dansk Sprog Detektion**: Kun danske artikler

## Installation

1. **Opret virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # På Windows: venv\Scripts\activate
```

2. **Installer dependencies:**
```bash
pip install -r requirements.txt
```

3. **Start serveren:**
```bash
python main.py
```

Serveren kører på `http://localhost:8000`

## API Endpoints

### GET `/api/articles`
Hent alle artikler

### POST `/api/scrape`
Start scraper processen
```json
{
  "sources": ["dr.dk", "tv2.dk", "finans.dk"],
  "keywords": ["økonomi", "opsparing", "su"]
}
```

### GET `/api/scraper/status`
Hent scraper status

### GET `/api/statistics`
Hent artikel statistikker

## Scraper Konfiguration

Scraperen er konfigureret til at arbejde med følgende danske sites:

- **DR.dk** - Danmarks Radio
- **TV2.dk** - TV2 Nyheder  
- **Finans.dk** - Finansnyheder
- **Bolius.dk** - Bolig og økonomi

### Søgeord
Scraperen bruger disse danske søgeord:
- økonomi, penge, opsparing, investering
- su, bolig, gæld, pension, budget
- madspild, studerende, familieøkonomi

## Automatisk Klassificering

Artikler klassificeres automatisk på:

### Målgruppe
- **studerende** - SU og studie-relateret
- **børnefamilie** - Familieøkonomi
- **pensionist** - Pension og ældre
- **bred** - Generelle artikler

### Sværhedsgrad
- **begynder** - Korte, simple artikler
- **øvet** - Mellemlange artikler
- **avanceret** - Lange, detaljerede artikler

### Tags
- opsparing, su, bolig, investering, gæld, pension

## Udvikling

### Tilføj ny kilde
1. Tilføj konfiguration i `scraper.py` under `self.sources`
2. Test med `python scraper.py`

### Tilføj nye søgeord
Rediger `danish_keywords` listen i `ArticleScraper.__init__()`

### Kør scraper manuelt
```python
from scraper import ArticleScraper
import asyncio

scraper = ArticleScraper()
articles = asyncio.run(scraper.scrape_articles(['dr.dk'], ['økonomi']))
```

## Miljøvariabler

Frontend `.env` fil:
```
VITE_API_URL=http://localhost:8000
```

**Bemærk**: Vite bruger `VITE_` prefix i stedet for `REACT_APP_`.

## Fejlfinding

### CORS fejl
Sørg for at frontend URL er tilføjet i CORS middleware

### Scraping fejl
- Tjek internetforbindelse
- Nogle sites kan blokere requests
- Prøv at ændre User-Agent

### Database fejl
Artikler gemmes i JSON fil. Tjek filrettigheder.

## Licens

MIT License 