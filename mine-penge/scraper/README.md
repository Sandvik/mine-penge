# Mine Penge Blog Scraper Suite

Dette projekt indeholder en samling af webscrapeers der automatisk henter og kategoriserer finansielt indhold fra danske økonomiblogger til brug på minepenge.dk.

## 📊 Oversigt

Projektet består af fire hovedkomponenter:
1. **Data indsamling** via webscrapeers
2. **Automatisk kategorisering** baseret på målgrupper og emnetags
3. **Intelligent tagging** med confidence scores og kompleksitetsanalyse
4. **Integration** til minepenge.dk website

## 🔧 Blog Scrapeers

Følgende scrapeers henter indhold fra top danske økonomiblogger:

### Aktive Scrapeers
- **Moneypenny** (`scrapers/scraperMoneypenny.py`) - Investering og privatøkonomi for kvinder
- **Nordnet** (`scrapers/scraperNordNet.py`) - Investeringsanalyser og finansnyheder  
- **Budgetnoerden** (`scrapers/scraperBudgetNoerd.py`) - Budget tips og økonomi
- **Ungmedpenge** (`scrapers/scraperUngMedPenge.py`) - Investering for unge
- **Mitteldorf** (`scrapers/scraperMitteldorfDK.py`) - FIRE, value investing og minimalisme

### JSON Output Format
Alle scrapeers producerer identisk JSON struktur:
```json
{
  "scraped_at": "timestamp",
  "source": "Blog navn",
  "total_posts": 123,
  "blog_posts": [
    {
      "url": "artikel URL",
      "title": "Artikel titel", 
      "summary": "Kort resume...",
      "content": "Fuldt indhold...",
      "author": "Forfatter navn",
      "categories": ["Kategori1", "Kategori2"],
      "date_published": "Udgivelsesdato",
      "scraped_at": "Scraping timestamp",
      "word_count": 1234,
      "source": "Blog navn"
    }
  ]
}
```

## 🏷️ Automatisk Kategorisering & Tagging System

Efter data indsamling behandles indholdet automatisk gennem vores avancerede kategoriserings- og taggingsystem.

### 🚀 Content Tagger Scripts

#### `content_tagger.py` - Hovedscript
Automatisk kategorisering og tagging af alle JSON-filer i `data/` mappen.

**Funktioner:**
- Analyserer artikelindhold for relevante nøgleord
- Tildeler målgrupper baseret på confidence scores
- Bestemmer kompleksitetsniveau (begynder/mellem/avanceret)
- Genererer unikke artikel-ID'er
- Opretter taggede filer i `data/tagged/` mappen
- Genererer detaljerede rapporter

#### `test_tagger.py` - Testscript
Tester tagging-systemet på en enkelt fil for validering.

#### `tag_config.json` - Konfigurationsfil
Konfigurerbar fil med alle tags, målgrupper og indstillinger.

### Målgrupper
- **Studerende** - Budget på SU, studielån, billige løsninger
- **Børnefamilier** - Børneopsparing, familiebudget, uddannelsesopsparing
- **Lavindkomstgrupper** - Grundlæggende budget, gældsrådgivning, besparelser
- **Nybegyndere i investering** - Grundlæggende aktie/fond viden, første investering
- **Økonomi/opsparing nybegyndere** - Budget basics, opsparingstyper, bankrelateret
- **Pensionister** - Pensionsplanlægning, aldersopsparing

### Tag-kategorier (minepenge.dk system)

#### **Bolig & Ejendom**
- `bolig`, `huskøb`, `lejebolig`, `ejendomsmægler`, `ejendom`, `boligmarked`, `husleje`

#### **Investering & Aktier** 
- `investering`, `fonde`, `aktiesparekonto`, `danske aktier`, `aktier`, `etf`, `reit`, `udbytte`, `portefølje`

#### **Pension**
- `pension`, `pensionstyper`, `aldersopsparing`, `ratepension`, `livrente`, `pensionsopsparing`

#### **SU & Studerende**
- `su`, `studielån`, `studerende`, `universitet`, `uddannelse`, `studie`, `stipendium`

#### **Gæld & Lån**
- `gæld`, `boliglån`, `forbrugslån`, `lån`, `rente`, `afdrag`, `gældsrådgivning`

#### **Opsparing**
- `opsparing`, `børneopsparing`, `spare`, `opsparingskonto`, `renteopsparing`

#### **Bank & Betaling**
- `bank`, `kort`, `mobilepay`, `netbank`, `betaling`, `overførsel`

#### **Skat & Fradrag**
- `skat`, `fradrag`, `skattefradrag`, `skattepligtig`, `skattefri`

#### **Rente**
- `renter`, `nationalbank`, `styrerente`, `rentesats`, `renteudvikling`

#### **Forbrug**
- `forbrug`, `sparertips`, `budget`, `forbrugsvarer`, `pris`

#### **Forsikring**
- `forsikring`, `forsikringstyper`, `ansvarsforsikring`, `ulykkesforsikring`

#### **Rådgivning**
- `rådgivning`, `budget`, `undervisning`, `tips`, `råd`, `guide`

#### **Familieøkonomi**
- `familieøkonomi`, `madspild`, `familie`, `børn`, `husholdning`

#### **Erhverv**
- `erhverv`, `løn`, `job`, `karriere`, `arbejde`, `indkomst`

#### **Krypto**
- `krypto`, `råvarer`, `bitcoin`, `blockchain`, `kryptovaluta`

#### **Pensionist**
- `pensionist`, `senior`, `ældre`, `pensionering`

#### **Problemer**
- `økonomisk kriminalitet`, `økonomiske problemer`, `gældsproblemer`, `økonomisk stress`

### Kategorisering Algoritme
Systemet analyserer artikel indhold og:
- **Identificerer nøgleord** der matcher tag-kategorierne
- **Vurdere kompleksitetsniveau** baseret på tekniske termer og sætningslængde
- **Beregner confidence scores** for hver målgruppe
- **Tildele relevante tags** fra de 17 hovedkategorier
- **Genererer unikke artikel-ID'er** baseret på URL og titel

### Tagged Output Format
```json
{
  "metadata": {
    "original_file": "mitteldorf_blog_posts.json",
    "total_articles": 214,
    "tagged_at": "2025-07-05T11:52:19.861792",
    "tag_categories_used": ["Bolig & Ejendom", "Investering & Aktier", ...],
    "target_audiences_used": ["studerende", "børnefamilier", ...]
  },
  "articles": [
    {
      "article_id": "ad6071c04c06",
      "title": "Året der gik: 2021",
      "source": "Mitteldorf Blog",
      "url": "https://mitteldorf.dk/blog/aaret-der-gik-2021/",
      "summary": "Vi ser tilbage på året der er gået og hvad 2022 vil bringe her på bloggen.",
      "target_audiences": ["lavindkomstgrupper", "økonomi_nybegynder", "studerende"],
      "complexity_level": "begynder",
      "minepenge_tags": ["udbytte", "afkast", "investering", "portefølje", "aktier"],
      "tag_categories": ["Bank & Betaling", "Investering & Aktier", "Pension"],
      "confidence_scores": {
        "studerende": 0.67,
        "børnefamilier": 0.29,
        "lavindkomstgrupper": 0.75,
        "nybegynder_investering": 0.57,
        "økonomi_nybegynder": 0.75,
        "pensionister": 0.57
      },
      "original_data": {
        "summary": "Vi ser tilbage på året der er gået...",
        "content": "Fuldt artikelindhold...",
        "author": "Christian Mitteldorf",
        "date_published": "31. december 2021",
        "word_count": 1861,
        "categories": ["Investering", "FIRE", "Økonomi"]
      },
      "tagged_at": "2025-07-05T11:52:19.489164"
    }
  ]
}
```

**Vigtige felter i taggede artikler:**

- **`summary`**: Artiklens sammendrag tilgængelig direkte på topplan (kopieret fra original data)
- **`article_id`**: Unikt ID genereret baseret på URL og titel
- **`target_audiences`**: Liste over relevante målgrupper
- **`complexity_level`**: Begynder/mellem/avanceret
- **`minepenge_tags`**: Relevante tags fra minepenge.dk systemet
- **`tag_categories`**: Overordnede kategorier baseret på tags
- **`confidence_scores`**: Numeriske scores for hver målgruppe (0.0-1.0)
- **`original_data`**: Bevarer alle oprindelige data for bagudkompatibilitet

## 🔄 Data Konsolidering

### `build_articles.py` - Hovedscript
Konsoliderer alle taggede artikler til en enkelt JSON-fil til brug i frontend.

**Funktioner:**
- Læser alle taggede JSON-filer fra `data/tagged/`
- Kombinerer artikler fra alle kilder
- Sorterer artikler efter dato (nyeste først)
- Fjerner duplikater baseret på URL
- Genererer `articles.json` til frontend brug
- Opretter detaljerede rapporter

### Output Format
```json
{
  "metadata": {
    "total_articles": 847,
    "sources": ["Moneypenny", "Nordnet", "Budgetnoerden", "Ungmedpenge", "Mitteldorf"],
    "date_range": "2020-01-01 to 2025-01-15",
    "built_at": "2025-01-15T10:30:00",
    "tag_categories": ["Bolig & Ejendom", "Investering & Aktier", ...],
    "target_audiences": ["studerende", "børnefamilier", ...]
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

## 🚀 Brug af Scraper Suite

### Komplet workflow
```bash
# 1. Installer dependencies
pip install -r requirements.txt

# 2. Kør alle scrapers
python update_all_data.py

# 3. Kategoriser artikler
python tagging/content_tagger.py

# 4. Konsolider data
python build_articles.py

# 5. Kopier til frontend (manuelt)
cp articles.json ../src/data/
```

### Individuelle scripts
```bash
# Kun kør scrapers
python update_all_data.py

# Kun kategoriser
python tagging/content_tagger.py

# Kun konsolider
python build_articles.py

# Test tagging på enkelt fil
python tagging/test_tagger.py
```

## 📊 Nuværende Status

### ✅ Implementeret
- **5 aktive blog scrapers** med stabil funktionalitet
- **AI-drevet kategorisering** med 17 tag-kategorier
- **Automatisk målgruppe-tildeling** med confidence scores
- **Kompleksitetsanalyse** (begynder/mellem/avanceret)
- **Data konsolidering** til frontend brug
- **Detaljerede rapporter** for kvalitetskontrol
- **Modulær arkitektur** for nem udvidelse

### 📈 Statistikker
- **5 blog kilder** aktivt scraped
- **17 tag-kategorier** for præcis kategorisering
- **6 målgrupper** for personlig indholdsvisning
- **3 kompleksitetsniveauer** for tilpasset indhold
- **~800+ artikler** i konsolideret database

### 🔧 Tekniske detaljer
- **Python 3.9+** kompatibilitet
- **JSON-baseret** data storage
- **Modulær scraper** arkitektur
- **Konfigurerbar tagging** via `tag_config.json`
- **Automatisk duplikat-fjernelse**
- **Dato-baseret sortering**

## 🌐 Integration til minepenge.dk

Den kategoriserede data integreres i minepenge.dk for at:
- **Personalisere indhold** baseret på brugerens profil og interesser
- **Anbefale relevante artikler** til forskellige målgrupper
- **Filtrere indhold** efter kompleksitetsniveau og tags
- **Oprette målgruppespecifikke sektioner** (fx "For studerende", "Investering for begyndere")

### Frontend Integration
- Data læses fra `src/data/articles.json`
- Søgning og filtrering sker client-side
- Pagination håndteres i React
- Dynamisk sidebar baseret på faktisk data

## 🔧 Udvikling

### Tilføj ny scraper
1. Opret ny fil i `scrapers/` mappen
2. Følg eksisterende struktur og output format
3. Tilføj til `update_all_data.py`
4. Test med `python update_all_data.py`

### Tilføj nye tags
1. Rediger `tagging/tag_config.json`
2. Tilføj nye nøgleord og kategorier
3. Test med `python tagging/test_tagger.py`

### Opdater kategorisering
1. Modificer `tagging/content_tagger.py`
2. Test på enkelt fil først
3. Kør på alle data

## 🐛 Fejlfinding

### Scraping problemer
- Tjek internetforbindelse
- Nogle sites kan blokere requests
- Prøv at ændre User-Agent i scrapers
- Verificer at HTML struktur ikke er ændret

### Tagging problemer
- Tjek `tag_config.json` syntax
- Verificer at input JSON-filer er korrekte
- Test på enkelt fil først med `test_tagger.py`

### Konsolidering problemer
- Sørg for at alle taggede filer eksisterer
- Tjek JSON syntax i alle filer
- Verificer at `articles.json` bliver genereret korrekt

## 📦 Deployment

### Produktionsmiljø
```bash
# Automatiseret workflow
python update_all_data.py
python tagging/content_tagger.py
python build_articles.py

# Kopier til frontend
cp articles.json ../src/data/
```

### Cron job eksempel
```bash
# Kør dagligt kl 06:00
0 6 * * * cd /path/to/scraper && python update_all_data.py && python tagging/content_tagger.py && python build_articles.py
```

## 🤝 Bidrag

1. Fork projektet
2. Opret feature branch
3. Test ændringer grundigt
4. Opdater dokumentation
5. Åbn Pull Request

## 📄 Licens

Dette projekt er under udvikling for minepenge.dk 