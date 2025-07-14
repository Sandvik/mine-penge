# Update_all_data.py - Analyse og Dokumentation

## Oversigt
`update_all_data.py` er det centrale batch-script der styrer hele MinePenge's data pipeline. Det kører alle scraper scripts i sekvens, behandler data, og genererer en samlet rapport over hele opdateringsprocessen.

## Arkitektur og Design

### Klasse: DataUpdater
Scriptet er organiseret omkring en `DataUpdater` klasse der håndterer alle aspekter af data opdateringen.

#### Initialisering
```python
def __init__(self):
    self.scraper_dir = os.path.dirname(__file__)
    self.data_dir = os.path.join(self.scraper_dir, "data")
    self.tagged_dir = os.path.join(self.scraper_dir, "data", "tagged")
    
    # Liste over alle scraper scripts i korrekt rækkefølge
    self.scraper_scripts = [
        "scraperMoneypenny.py",
        "scraperNordNet.py", 
        "scraperBudgetNoerd.py",
        "scraperUngMedPenge.py",
        "scraperMitteldorfDK.py",
        "scraperTaenk.py"
    ]
```

## Pipeline Proces

### 1. Scraper Kørsel (`run_all_scrapers()`)
**Formål**: Kører alle individuelle scraper scripts i sekvens

#### Scraper Scripts (i rækkefølge):
1. **scraperMoneypenny.py** - Moneypenny og More artikler
2. **scraperNordNet.py** - NordNet blog og artikler
3. **scraperBudgetNoerd.py** - Budget Nørd indhold
4. **scraperUngMedPenge.py** - Ung Med Penge artikler
5. **scraperMitteldorfDK.py** - Mitteldorf DK indhold
6. **scraperTaenk.py** - Forbrugerrådet Tænk privatøkonomi

#### Fejlhåndtering:
- Hver scraper kører uafhængigt
- Fejl i én scraper stopper ikke de andre
- Detaljeret logging af succes/fejl for hver scraper
- Returnerer `True` hvis mindst én scraper lykkedes

### 2. Dubletter Tjek (`check_for_duplicates()`)
**Formål**: Identificerer og rapporterer duplikerede artikler

#### Proces:
- Læser alle JSON filer i `data/` mappen
- Tjekker for duplikater baseret på URL
- Logger antal fundne dubletter
- Fortsætter uanset resultat (warning niveau)

### 3. Automatisk Tagging (`run_tagging()`)
**Formål**: Kører content tagging på alle scrapede artikler

#### Script: `tagging/content_tagger.py`
- Automatisk kategorisering af artikler
- Tilføjer relevante tags og metadata
- Forbedrer søgbarhed og organisering

### 4. Artikel Samling (`build_articles.py`)
**Formål**: Samler alle individuelle scraper resultater i én samlet `articles.json`

#### Proces:
- Læser alle scraper JSON filer
- Kombinerer artikler i ét datasæt
- Fjerner duplikater
- Genererer samlet indeks

### 5. Artikel Rydning (`run_article_cleaning()`)
**Formål**: Fjerner lavkvalitets og irrelevante artikler

#### Script: `clean_low_value_articles.py`
- Fjerner portfolio opdateringer
- Eliminerer duplikater
- Filtrerer baseret på kvalitetskriterier

### 6. Lavværdi Artikel Rensning (`run_low_value_cleaning()`)
**Formål**: Ekstra rensning af artikler med lav relevans

#### Kriterier:
- Kort indhold
- Irrelevante emner
- Automatisk genereret indhold
- Spam eller reklame

### 7. Rapport Generering (`generate_summary_report()`)
**Formål**: Opretter en samlet rapport over hele opdateringsprocessen

#### Rapport Indhold:
```json
{
  "timestamp": "2025-07-14T10:37:28.280",
  "total_articles": 1250,
  "files_updated": [
    {
      "filename": "moneypenny_blog_posts.json",
      "articles": 45,
      "source": "Moneypenny and More"
    }
  ],
  "tagged_files": ["tagged_articles.json"]
}
```

## Tekniske Detaljer

### Subprocess Håndtering
```python
def run_scraper(self, script_name):
    script_path = os.path.join(self.scraper_dir, "scrapers", script_name)
    
    try:
        result = subprocess.run([sys.executable, script_path], 
                              capture_output=True, text=True, check=True)
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ {script_name} fejlede: {e}")
        return False
```

### Fejlhåndtering Strategi
- **Graceful Degradation**: Fejl i én komponent stopper ikke hele pipeline
- **Detaljeret Logging**: Alle fejl logges med kontekst
- **Success Tracking**: Tæller succesfulde vs. fejlede operationer
- **Continue on Error**: Pipeline fortsætter selv ved delvise fejl

### Logging og Monitoring
```python
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(levelname)s - %(message)s')
```

#### Log Niveauer:
- **INFO**: Normal operation og status
- **WARNING**: Problemer der ikke stopper processen
- **ERROR**: Fejl der påvirker funktionalitet

## Kørsel og Brug

### Komplet Opdatering
```bash
python update_all_data.py
```

### Proces Flow:
1. **Initialisering**: Opretter nødvendige mapper
2. **Scraper Kørsel**: Kører alle 6 scraper scripts
3. **Data Validering**: Tjekker for dubletter
4. **Tagging**: Automatisk kategorisering
5. **Samling**: Kombinerer alle data
6. **Rensning**: Fjerner lavkvalitets indhold
7. **Rapport**: Genererer samlet rapport

### Output Filer:
- `data/articles.json` - Samlet artikel database
- `data/tagged/update_report.json` - Opdateringsrapport
- `data/tagged/tagged_articles.json` - Taggede artikler
- Individuelle scraper JSON filer

## Konfiguration og Tilpasning

### Tilføjelse af Nye Scrapers
1. Tilføj script til `self.scraper_scripts` liste
2. Placer script i `scrapers/` mappen
3. Sikre at script returnerer korrekt exit code
4. Test integration

### Ændring af Rækkefølge
Rediger rækkefølgen i `self.scraper_scripts` liste:
```python
self.scraper_scripts = [
    "scraperTaenk.py",        # Kør først
    "scraperMoneypenny.py",   # Kør andet
    # ... andre scrapers
]
```

### Tilpasning af Pipeline
Scriptet er modulært designet - du kan:
- Deaktivere specifikke trin
- Tilføje nye behandlingstrin
- Ændre fejlhåndtering
- Modificere rapport format

## Ydeevne og Optimering

### Parallelisering Muligheder
Scriptet kører scrapers sekventielt, men kan optimeres til:
- Parallel scraper kørsel
- Asynkron data behandling
- Batch processing af store datasæt

### Hukommelsesforbrug
- Stream-baseret fil behandling
- Automatisk garbage collection
- Effektiv JSON parsing

### Netværksoptimering
- Rate limiting i individuelle scrapers
- Connection pooling
- Retry logic med exponential backoff

## Fejlhåndtering og Recovery

### Scraper Fejl
- Individuelle scraper fejl isoleres
- Pipeline fortsætter med resterende scrapers
- Detaljeret fejlrapportering

### Data Korruption
- Validering af JSON filer
- Backup af eksisterende data
- Rollback muligheder

### Netværksproblemer
- Retry logic i scrapers
- Graceful timeout håndtering
- Offline mode muligheder

## Monitoring og Vedligeholdelse

### Log Analyse
Scriptet genererer detaljerede logs der kan bruges til:
- Performance monitoring
- Fejlanalyse
- Trend identificering
- Kapacitetsplanlægning

### Automatisering
Scriptet er designet til at køre:
- Via cron jobs
- Som scheduled task
- Via CI/CD pipeline
- Manuelt ved behov

### Backup Strategi
- Automatisk backup før opdatering
- Version control af data
- Recovery procedures

## Sikkerhed og Compliance

### Data Privatliv
- Kun offentligt tilgængeligt indhold
- Ingen personlige oplysninger
- Respekt for robots.txt

### System Sikkerhed
- Sikker subprocess execution
- Input validering
- Path traversal beskyttelse

### Compliance
- GDPR compliance
- Copyright respekt
- Etisk web scraping

## Fremtidige Forbedringer

### Mulige Udvidelser
1. **Real-time Monitoring**: Live dashboard over scraper status
2. **Machine Learning**: Automatisk kvalitetsbedømmelse af artikler
3. **API Integration**: Direkte integration med kildesystemer
4. **Distributed Processing**: Skalering over multiple servere
5. **Advanced Analytics**: Detaljerede insights om data kvalitet

### Skalerbarhed
- Containerization med Docker
- Cloud deployment
- Load balancing
- Database integration

## Konklusion

`update_all_data.py` er et robust og veldesignet batch-script der effektivt styrer hele MinePenge's data pipeline. Det kombinerer multiple datakilder, behandler data intelligent, og genererer højkvalitets output til platformen.

Scriptets modulære design, omfattende fejlhåndtering, og detaljerede logging gør det til et værdifuldt værktøj for vedligeholdelse og udvidelse af MinePenge's indholdsbase.

### Nøglefordele:
- **Pålidelighed**: Robust fejlhåndtering og recovery
- **Skalerbarhed**: Nem tilføjelse af nye datakilder
- **Transparens**: Detaljeret logging og rapportering
- **Vedligeholdelse**: Modulært design og god dokumentation
- **Integration**: Fuldt integreret i MinePenge's økosystem 