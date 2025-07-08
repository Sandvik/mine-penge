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

## 📊 Artikel Sortering

Artiklerne sorteres intelligent efter **publiceringsdato** med de nyeste først, og bruger en avanceret dato-udledning:

### 🎯 **Sorteringslogik**

1. **ISO Datoer** (f.eks. Moneypenny)
   ```
   "2020-08-05T10:36:00+00:00" → 5. august 2020
   "2022-07-25T14:04:16+00:00" → 25. juli 2022
   ```

2. **Danske datoer med år** (f.eks. Mitteldorf)
   ```
   "5. juni 2024" → 5. juni 2024
   "16. juli 2023" → 16. juli 2023
   ```

3. **Danske datoer uden år** (f.eks. Budget Nørden)
   ```
   "16. jun." → 16. juni 2023 (antages som gammel artikel)
   "5. maj" → 5. maj 2023 (antages som gammel artikel)
   ```

4. **Fallback datoer**
   ```
   "INGEN DATO FUNDET" → scrape_date eller last_updated
   Ingen dato → 1. januar 2020 (meget gammel)
   ```

### 🔄 **Sekundær sortering**
Hvis to artikler har samme dato, sorteres de alfabetisk efter **kilde** for at give variation.

### 📋 **Praktisk eksempel**
1. **Nyeste artikel** fra Mitteldorf (5. juni 2024) → Først
2. **Nyeste artikel** fra Moneypenny (25. juli 2022) → Andet  
3. **Gammel artikel** fra Budget Nørden (16. juni 2023) → Tredje
4. **Endnu ældre** fra Ung Med Penge (2021) → Fjerde

Dette sikrer at brugerne altid ser de **nyeste og mest relevante artikler** først, uanset kilde.

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
