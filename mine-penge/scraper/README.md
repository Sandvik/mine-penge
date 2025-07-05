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

## 🌐 Integration til minepenge.dk

Den kategoriserede data integreres i minepenge.dk for at:
- **Personalisere indhold** baseret på brugerens profil og interesser
- **Anbefale relevante artikler** til forskellige målgrupper
- **Filtrere indhold** efter kompleksitetsniveau og tags
- **Oprette målgruppespecifikke sektioner** (fx "For studerende", "Investering for begyndere")
- **Tag-baseret navigation** gennem de 17 hovedkategorier

### Content Mapping Eksempler

| Blog Indhold | Detekterede Tags | Målgruppe | Kompleksitet |
|--------------|------------------|-----------|--------------|
| "Aktiesparekonto for begyndere" | `investering`, `aktiesparekonto` | Nybegynder investering | Begynder |
| "Budget på SU" | `su`, `budget`, `studielån` | Studerende | Begynder |
| "Børneopsparing og skat" | `børneopsparing`, `skat`, `familieøkonomi` | Børnefamilier | Begynder |
| "Pensionstyper guide" | `pension`, `pensionstyper` | Pensionist, Voksne | Mellem |
| "Boliglån tips" | `boliglån`, `gæld`, `bolig` | Voksne, Familier | Begynder |

### Workflow
```
Blogs → Scrapeers → Raw JSON → Content Tagger → Tagged JSON → minepenge.dk API → Website
```

## 📁 Projekt Struktur

```
/
├── update_all_data.py            # Master script - opdaterer alt data (standard)
├── update_all_data_realtime.py   # Master script - opdaterer alt data (real-time)
├── scrapers/                     # Blog scraper scripts
│   ├── scraperMoneypenny.py      # Moneypenny blog scraper
│   ├── scraperNordNet.py         # Nordnet blog scraper
│   ├── scraperBudgetNoerd.py     # Budgetnoerden blog scraper
│   ├── scraperUngMedPenge.py     # Ungmedpenge blog scraper
│   └── scraperMitteldorfDK.py    # Mitteldorf blog scraper
├── tagging/                      # Tagging scripts og konfiguration
│   ├── content_tagger.py         # Automatisk kategorisering og tagging
│   ├── test_tagger.py            # Test script for tagging system
│   └── tag_config.json           # Konfiguration for tagging system
├── data/                         # Scraped data output
│   ├── moneypenny_blog_posts.json
│   ├── nordnet_blog_posts.json
│   ├── budgetnoerden_blog_posts.json
│   ├── ungmedpenge_blog_posts.json
│   ├── mitteldorf_blog_posts.json
│   └── articles.json
├── data/tagged/                  # Tagged data output
│   ├── tagged_moneypenny_blog_posts.json
│   ├── tagged_nordnet_blog_posts.json
│   ├── tagged_budgetnoerden_blog_posts.json
│   ├── tagged_ungmedpenge_blog_posts.json
│   ├── tagged_mitteldorf_blog_posts.json
│   ├── tagging_report.json       # Detaljeret rapport over tagging
│   ├── update_report.json        # Rapport over data opdatering
│   └── test_result.json          # Test resultat
└── README.md
```

## 🚀 Installation og Brug

### Krav
```bash
pip install requests beautifulsoup4 lxml pandas scikit-learn nltk newspaper3k dateparser langdetect lxml_html_clean
```

## 🔄 Opdatering af Alt Data

### Automatisk Opdatering (Anbefalet)
Kør dette ene script for at opdatere alt data i korrekt rækkefølge:

#### Real-time Version (Anbefalet)
```bash
python update_all_data_realtime.py
```
- Viser output fra alle scrapers mens de kører
- Du kan følge processen i real-time
- Ingen "hængende" følelse - du ser alt output

#### Standard Version
```bash
python update_all_data.py
```
- Kører alle scripts i baggrunden
- Viser kun status når hver scraper er færdig

### Hvad Master Scriptet Gør
**Begge scripts vil automatisk:**
1. ✅ Køre alle scraper scripts i korrekt rækkefølge:
   - Moneypenny → Nordnet → Budgetnoerden → Ungmedpenge → Mitteldorf
2. 🔍 Tjekke for dubletter i alle JSON filer
3. 🏷️ Køre automatisk tagging på alle opdaterede filer
4. 📊 Generere en samlet rapport med statistikker
5. 📄 Gemme rapport i `data/tagged/update_report.json`

### Eksempel Output
```
🚀 MINE PENGE DATA UPDATER - REAL-TIME VERSION
============================================================
📊 Scraping resultat: 5/5 succesfulde
🔍 Tjekker for dubletter...
✅ Ingen dubletter fundet
🏷️ Starter automatisk tagging...
✅ Tagging kørt succesfuldt
📊 Total artikler opdateret: 706
🎉 Alt data er nu opdateret og klar til brug!
```

### Manuel Opdatering
Hvis du vil køre scripts individuelt:

#### Kør Scrapeers
```bash
# Hent data fra alle blogger (kør i denne rækkefølge)
python scrapers/scraperMoneypenny.py
python scrapers/scraperNordNet.py
python scrapers/scraperBudgetNoerd.py
python scrapers/scraperUngMedPenge.py
python scrapers/scraperMitteldorfDK.py
```

#### Kør Content Tagger
```bash
# Test tagging system på en enkelt fil
python tagging/test_tagger.py

# Kør automatisk tagging på alle JSON-filer
python tagging/content_tagger.py
```

### Output og Rapporter

#### Raw JSON-filer
Gemmes i `data/` mappen:
- `data/moneypenny_blog_posts.json`
- `data/nordnet_blog_posts.json`
- `data/budgetnoerden_blog_posts.json`
- `data/ungmedpenge_blog_posts.json`
- `data/mitteldorf_blog_posts.json`

#### Taggede JSON-filer
Gemmes i `data/tagged/` mappen:
- `data/tagged/tagged_moneypenny_blog_posts.json`
- `data/tagged/tagged_nordnet_blog_posts.json`
- `data/tagged/tagged_budgetnoerden_blog_posts.json`
- `data/tagged/tagged_ungmedpenge_blog_posts.json`
- `data/tagged/tagged_mitteldorf_blog_posts.json`

#### Automatisk Genererede Rapporter
- `data/tagged/tagging_report.json` - Detaljeret rapport over tagging processen
- `data/tagged/update_report.json` - Samlet rapport over data opdatering
- `data/tagged/test_result.json` - Test resultat fra test_tagger.py

### Rapport Indhold

#### `update_report.json` - Master Opdateringsrapport
```json
{
  "update_timestamp": "2025-07-05T16:10:36.273",
  "scrapers_run": ["scraperMoneypenny.py", "scraperNordNet.py", ...],
  "files_updated": [
    {"filename": "mitteldorf_blog_posts.json", "articles": 214},
    {"filename": "moneypenny_blog_posts.json", "articles": 103}
  ],
  "tagged_files": ["tagged_mitteldorf_blog_posts.json", ...],
  "total_articles": 706
}
```

#### `tagging_report.json` - Detaljeret Tagging Rapport
```json
{
  "tagged_at": "2025-07-05T16:10:36.273",
  "total_articles_processed": 706,
  "complexity_distribution": {
    "begynder": 634,
    "mellem": 69,
    "avanceret": 3
  },
  "top_target_audiences": {
    "studerende": 412,
    "nybegynder_investering": 353
  },
  "top_tags": {
    "investering": 581,
    "aktier": 431
  }
}
```

## 📊 Tagging Statistikker

### Seneste Kørsel (706 artikler behandlet)
- **Kompleksitetsfordeling:**
  - Begynder: 634 artikler (90%)
  - Mellem: 69 artikler (10%)
  - Avanceret: 3 artikler (<1%)

- **Top målgrupper:**
  - Studerende: 412 artikler
  - Nybegynder investering: 353 artikler
  - Lavindkomstgrupper: 346 artikler
  - Økonomi nybegynder: 298 artikler

- **Top tags:**
  - Investering: 581 artikler
  - Aktier: 431 artikler
  - SU: 411 artikler
  - Afkast: 313 artikler
  - Bank: 300 artikler

## 🔧 Konfiguration

### tag_config.json
Konfigurerbar fil med alle tags, målgrupper og indstillinger:

```json
{
  "tag_categories": {
    "Bolig & Ejendom": ["bolig", "huskøb", "lejebolig", ...],
    "Investering & Aktier": ["investering", "fonde", "aktiesparekonto", ...]
  },
  "target_audiences": {
    "studerende": ["su", "studielån", "studerende", ...],
    "børnefamilier": ["børn", "familie", "børneopsparing", ...]
  },
  "settings": {
    "confidence_threshold": 0.3,
    "max_tags_per_article": 10,
    "max_audiences_per_article": 3,
    "min_word_count": 50
  }
}
```

## 📈 Tag Mapping Eksempler

### Blog → Tag Mapping

**Moneypenny artikel: "Sådan får du månedligt udbytte med REITs"**
- **Tags**: `investering`, `fonde`, `danske aktier`, `udbytte`
- **Kategori**: Investering & Aktier
- **Målgruppe**: Nybegynder investering
- **Kompleksitet**: Begynder

**Budgetnoerden artikel: "Zero-based budget guide"**
- **Tags**: `budget`, `rådgivning`, `sparertips`
- **Kategori**: Rådgivning, Forbrug
- **Målgruppe**: Økonomi nybegyndere
- **Kompleksitet**: Begynder

**Ungmedpenge artikel: "Budget for studerende"**
- **Tags**: `su`, `budget`, `studielån`
- **Kategori**: SU & Studerende, Rådgivning
- **Målgruppe**: Studerende
- **Kompleksitet**: Begynder

## 🔄 Fremtidige Udvidelser

- Integration af flere danske økonomiblogger
- Machine learning forbedring af tag-kategorisering
- Real-time indholdsanbefaling baseret på bruger-tags
- Automatisk opdatering af tag-konfidence scores
- A/B testing af tag-relevans for forskellige målgrupper
- API integration til minepenge.dk
- Avanceret NLP-analyse for bedre tag-identifikation
- Automatisk kvalitetsvurdering af artikler
- Integration med sociale medier for trending emner

## 📞 Support

For spørgsmål om projektet eller tag-integration, kontakt udviklingsteamet på minepenge.dk

## ⚠️ Vigtige Noter

- Alle scrapeers respekterer robots.txt og bruger forsigtige delays mellem requests
- Data gemmes automatisk i `data/` mappen
- Taggede data gemmes i `data/tagged/` mappen
- Scrapeers inkluderer fallback-metoder for robust data-ekstraktion
- Alle scripts er konfigureret til dansk sprog og danske finansblogs
- Content tagger bevarer oprindelige JSON-filer og opretter nye taggede versioner
- Konfiguration kan nemt tilpasses via `tag_config.json`

## 🔍 Dublet-Prevention

Systemet inkluderer automatisk dublet-detektering:

### Hvordan det virker:
- **URL-baseret tjek**: Systemet tjekker for identiske URLs i hver JSON fil
- **Automatisk advarsel**: Dubletter rapporteres i loggene under opdatering
- **Ingen automatisk fjernelse**: Dubletter fjernes ikke automatisk for at bevare data integritet
- **Manuel håndtering**: Dubletter skal fjernes manuelt hvis nødvendigt

### Dublet-rapportering:
```
🔍 Tjekker for dubletter...
✅ moneypenny_blog_posts.json: Ingen dubletter
⚠️ mitteldorf_blog_posts.json: 3 dubletter fundet
✅ nordnet_blog_posts.json: Ingen dubletter
```

### Håndtering af dubletter:
1. **Identificer kilden**: Tjek hvilken scraper der skaber dubletter
2. **Analyser årsagen**: Ofte skyldes dubletter i scraper-logikken
3. **Fix scraper**: Opdater scraper scriptet for at undgå dubletter
4. **Kør igen**: Kør `update_all_data.py` igen efter rettelse 

## 🗂️ Mappestruktur og filplacering

Projektet er organiseret i følgende mapper for at gøre det let at finde og vedligeholde de forskellige komponenter:

- **scrapers/**
  - Indeholder alle scraper-scripts, ét for hver blog.
  - Eksempel: `scrapers/scraperMoneypenny.py`, `scrapers/scraperNordNet.py` osv.
  - Formål: Alt der henter/indsamler data fra eksterne kilder.

- **tagging/**
  - Indeholder scripts og konfiguration til automatisk kategorisering og tagging.
  - Eksempel: `tagging/content_tagger.py`, `tagging/test_tagger.py`, `tagging/tag_config.json`
  - Formål: Alt der har med analyse, kategorisering og tagging af data at gøre.

- **data/**
  - Indeholder alle outputdata fra scrapers og tagging.
  - Rå JSON-data fra scrapers gemmes direkte i denne mappe.
  - Taggede JSON-filer og rapporter gemmes i `data/tagged/`.
  - Formål: Al outputdata, både rå og taggede versioner.

- **Rodmappen**
  - Indeholder kun dokumentation og evt. overordnet projektstyring.
  - Eksempel: `README.md`

Denne struktur sikrer, at kode, konfiguration og data er adskilt og let at navigere for både udviklere og brugere af projektet.

## 📝 Om tag_config.json

`tag_config.json` er en central konfigurationsfil, der styrer hvordan det automatiske tagging- og kategoriseringssystem arbejder. Den gør det nemt at tilpasse og udvide systemet uden at ændre i selve Python-koden.

### Struktur og felter

**1. "tag_categories"**
- Definerer alle de tags, der kan tildeles artikler, grupperet i overordnede kategorier.
- Eksempel:
  ```json
  "tag_categories": {
    "Investering & Aktier": ["investering", "aktier", "etf", "udbytte"],
    "Bolig & Ejendom": ["bolig", "huskøb", "lejebolig"]
  }
  ```
- Brug: Når en artikel indeholder et af ordene fra listen, tildeles det relevante tag og kategori.

**2. "target_audiences"**
- Definerer de målgrupper, som artikler kan være relevante for, samt nøgleord der indikerer relevans.
- Eksempel:
  ```json
  "target_audiences": {
    "studerende": ["su", "studielån", "universitet"],
    "børnefamilier": ["børn", "familie", "børneopsparing"]
  }
  ```
- Brug: Systemet beregner en "confidence score" for hver målgruppe baseret på hvor mange af nøgleordene der optræder i artiklen.

**3. "complexity_indicators"** (valgfri)
- Bruges til at vurdere om en artikel er for begyndere eller avancerede brugere, baseret på ordvalg.
- Eksempel:
  ```json
  "complexity_indicators": {
    "begynder": ["grundlæggende", "let", "guide"],
    "avanceret": ["avanceret", "ekspert", "tekniske termer"]
  }
  ```

**4. "technical_terms"** (valgfri)
- Liste over tekniske termer, der bruges til at vurdere kompleksitet.

**5. "settings"**
- Styrer hvordan tagging-algoritmen arbejder.
- Felter:
  - `confidence_threshold`: Minimum score for at en målgruppe tildeles.
  - `max_tags_per_article`: Maksimalt antal tags pr. artikel.
  - `max_audiences_per_article`: Maksimalt antal målgrupper pr. artikel.
  - `min_word_count`: Minimum antal ord for at en artikel behandles.
- Eksempel:
  ```json
  "settings": {
    "confidence_threshold": 0.3,
    "max_tags_per_article": 10,
    "max_audiences_per_article": 3,
    "min_word_count": 50
  }
  ```

### Hvordan bruges filen?
Når du kører tagging-systemet, indlæses `tag_config.json` automatisk. Du kan:
- Tilføje nye tags eller kategorier
- Justere hvilke ord der matcher hvilke målgrupper
- Finjustere hvor mange tags/målgrupper der må tildeles
- Tilpasse hvor "strengt" systemet skal være

**Fordel:**
Du kan ændre tagging-logikken uden at røre Python-koden – kun ved at redigere denne ene fil!

**Kort sagt:**
`tag_config.json` er hjernen bag det fleksible og automatiske tagging-system. Den gør det nemt at tilpasse, udvide og styre hvordan artikler kategoriseres og tagges i hele projektet. 