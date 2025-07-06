# MinePenge.dk - AI-drevet økonomi platform

En moderne React app med Python backend der scraper og kuraterer danske økonomi-artikler.

## 🎯 Formål
MinePenge.dk er en AI-drevet aggregator, der samler, klassificerer og præsenterer danske artikler og indhold om privatøkonomi. Det skal være et selvkørende feed med fokus på unge og børnefamilier – som en slags "Google News for dine penge".

## 🚀 Kom i gang

### Frontend (React, statisk)
```bash
npm install
npm run dev
```
Åbn `http://localhost:5173`

### Backend (kun til scraping/dataopdatering)
```bash
cd scraper
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python update_all_data.py
python build_articles.py
```
Dette opdaterer JSON-datafilerne i `src/data/` og `scraper/data/tagged/`.

## 🏗️ System Arkitektur

```
Frontend (React) ←→ JSON-filer + localStorage
     ↓                    ↓
  Tailwind CSS      Data i src/data/
  React Hooks       Curation i browseren
```

### Data Flow
- **Artikler**: Læses fra statiske JSON-filer
- **Curation**: Gemmes i browserens localStorage (kun i debug mode)
- **Dataopdatering**: Python-scraper genererer nye JSON-filer

## 🧱 Teknologier

### Frontend
- **React 18** + Vite
- **Tailwind CSS** - Nordisk moderne styling
- **Lucide React** - Clean line icons
- **React Hooks** - State management

### Backend (Scraper Suite)
- **Python 3.9+** - Scraping og data processing
- **BeautifulSoup4** - HTML parsing
- **Requests** - HTTP requests
- **Content Tagger** - AI-drevet kategorisering

### Data Storage
- **JSON-filer** - Artikler, tags, metadata
- **localStorage** - Curation (kun i debug mode)

## 📰 Web Scraping

Systemet scraper automatisk artikler fra 5 danske økonomiblogger:

- **Moneypenny** - Investering og privatøkonomi for kvinder
- **Nordnet** - Investeringsanalyser og finansnyheder  
- **Budgetnoerden** - Budget tips og økonomi
- **Ungmedpenge** - Investering for unge
- **Mitteldorf** - FIRE, value investing og minimalisme

### 🤖 Automatisk Klassificering

Artikler klassificeres automatisk på:

**Målgruppe:**
- studerende - SU og studie-relateret
- børnefamilie - Familieøkonomi  
- Personer med beskedne økonomiske forhold - Grundlæggende budget og gældsrådgivning
- nybegynder_investering - Første investering
- økonomi_nybegynder - Budget basics
- pensionister - Pension og ældre

**Sværhedsgrad:**
- begynder - Korte, simple artikler
- mellem - Mellemlange artikler
- avanceret - Lange, detaljerede artikler

**Tags (17 kategorier):**
- bolig, investering, pension, su, gæld, opsparing, bank, skat, renter, forbrug, forsikring, rådgivning, familieøkonomi, erhverv, krypto, pensionist, problemer

## 📱 Funktioner

- ✅ **Feed med seneste artikler** - Automatisk opdateret
- ✅ **Filtrering** - Efter emne og målgruppe
- ✅ **Søgning** - I artikler og tags
- ✅ **Responsivt design** - Mobile + desktop
- ✅ **Nordisk design** - Moderne, rent interface
- [ ] **Login system** - Kommer senere
- [ ] **Ugens highlights** - Kommer senere
- [ ] **E-mail nyhedsbrev** - Kommer senere

## 📁 Projekt struktur

```
mine-penge/
├── src/                    # Frontend
│   ├── components/         # React komponenter
│   ├── data/              # Data filer (artikler, tags)
│   ├── services/          # Service lag (kun JSON/localStorage)
│   └── App.jsx           # Hoved app
├── scraper/               # Python scraper suite
│   ├── scrapers/         # Kildespecifikke scrapers
│   ├── tagging/          # AI tagging
│   └── data/             # Rå og taggede datafiler
├── public/                # Statisk public assets
├── database/              # (Reference, ikke i brug pt.)
└── README.md              # Hoved dokumentation
```

## 🎨 Design

- **Nordisk moderne UI** med minimalistisk æstetik
- **Farvepalette**: lyse grå, off-white, blå og grønne accenter
- **Typografi**: Inter font
- **Afrundede hjørner**, generøse mellemrum, subtile skygger
- **Fokus på læsbarhed** og brugervenlighed
- **Responsivt design** (mobile + desktop)
- **Clean line-icons** (Lucide)

## 🚀 Brug af systemet

### 1. Start frontend
```bash
npm install
npm run dev
```
Åbn `http://localhost:5173`

### 2. Opdater artikel data
```bash
cd scraper
python update_all_data.py
python build_articles.py
```
Dette opdaterer JSON-filerne i `src/data/`.

### 3. Filtrer og søg
- Brug filtrene i sidebar
- Søg i søgefeltet

## 🔧 Udvikling

### Tilføj ny kilde
1. Tilføj konfiguration i `scraper/scrapers/`
2. Test med `python scraperX.py`

## 📝 Noter
- **Database-support** er dokumenteret i `database/onecom-database-setup.md` hvis du vil aktivere det senere.
- **Alt kører statisk** – ingen backend/server nødvendig for frontend.
- **Curation** er kun tilgængelig i debug mode.
