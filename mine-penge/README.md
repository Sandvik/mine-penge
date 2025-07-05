# MinePenge.dk - AI-drevet økonomi platform

En moderne React app med Python backend der scraper og kuraterer danske økonomi-artikler.

## 🎯 Formål
MinePenge.dk er en AI-drevet aggregator, der samler, klassificerer og præsenterer danske artikler og indhold om privatøkonomi. Det skal være et selvkørende feed med fokus på unge og børnefamilier – som en slags "Google News for dine penge".

## 🚀 Kom i gang

### Frontend
```bash
npm install
npm run dev
```
Åbn `http://localhost:5173`

### Backend (Scraper)
```bash
cd scraper
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python update_all_data.py  # Kør alle scrapers
```

## 🏗️ System Arkitektur

```
Frontend (React) ←→ Article Service ←→ Consolidated Data
     ↓                    ↓                      ↓
  Tailwind CSS      Local JSON Files      Scraper Suite
  React Hooks       Search & Filter       (5 Blog Sources)
```

## 🧱 Teknologier

### Frontend
- **React 18** + Vite
- **Tailwind CSS** - Nordisk moderne styling
- **Lucide React** - Clean line icons
- **React Hooks** - State management
- **React Router** - Navigation

### Backend (Scraper Suite)
- **Python 3.9+** - Scraping og data processing
- **BeautifulSoup4** - HTML parsing
- **Requests** - HTTP requests
- **JSON** - Data storage
- **Content Tagger** - AI-drevet kategorisering

## 📰 Web Scraping

Systemet scraper automatisk artikler fra 5 danske økonomiblogger:

### Aktive Scrapeers
- **Moneypenny** - Investering og privatøkonomi for kvinder
- **Nordnet** - Investeringsanalyser og finansnyheder  
- **Budgetnoerden** - Budget tips og økonomi
- **Ungmedpenge** - Investering for unge
- **Mitteldorf** - FIRE, value investing og minimalisme

### 🤖 Automatisk Klassificering

Artikler klassificeres automatisk på:

**Målgruppe:**
- studerende - SU og studie-relateret
- børnefamilier - Familieøkonomi  
- lavindkomstgrupper - Grundlæggende budget og gældsrådgivning
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
- ✅ **Avanceret filtrering** - Efter emne, målgruppe og kompleksitet
- ✅ **Præcis søgning** - I titler, sammendrag og tags
- ✅ **Pagination** - Effektiv navigation gennem artikler
- ✅ **Dynamisk sidebar** - Tags baseret på faktisk data
- ✅ **Responsivt design** - Mobile + desktop
- ✅ **Nordisk design** - Moderne, rent interface
- ✅ **Artikel sortering** - Nyeste først, varieret kilder
- ✅ **SearchBar komponent** - Dedikeret søgefunktionalitet
- [ ] **Login system** - Kommer senere
- [ ] **Ugens highlights** - Kommer senere
- [ ] **E-mail nyhedsbrev** - Kommer senere

## 🔧 Data Flow

### 1. Scraping
```bash
cd scraper
python update_all_data.py
```

### 2. Kategorisering
```bash
python tagging/content_tagger.py
```

### 3. Konsolidering
```bash
python build_articles.py
```

### 4. Frontend Integration
- Data læses fra `src/data/articles.json`
- Søgning og filtrering sker client-side
- Pagination håndteres i React

## 📁 Projekt struktur

```
mine-penge/
├── src/                    # Frontend
│   ├── components/         # React komponenter
│   │   ├── ArticleCard.jsx
│   │   ├── SearchBar.jsx   # Dedikeret søgekomponent
│   │   ├── FilterBar.jsx
│   │   ├── Navigation.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Footer.jsx
│   │   ├── UserFeedback.jsx
│   │   ├── EmbeddableWidget.jsx
│   │   └── ScrollToTopButton.jsx
│   ├── pages/             # Side komponenter
│   │   ├── SEODashboard.jsx
│   │   ├── EmbedWidget.jsx
│   │   ├── LandingPageGenerator.jsx
│   │   ├── QAFeedGenerator.jsx
│   │   └── InternalLinkStructure.jsx
│   ├── data/              # Data filer
│   │   ├── articles.json  # Konsolideret artikel data
│   │   └── test_articles.json
│   ├── services/          # Service lag
│   │   └── articleService.js
│   └── App.jsx           # Hoved app
├── scraper/               # Python scraper suite
│   ├── scrapers/         # Individuelle scrapers
│   │   ├── scraperMoneypenny.py
│   │   ├── scraperNordNet.py
│   │   ├── scraperBudgetNoerd.py
│   │   ├── scraperUngMedPenge.py
│   │   └── scraperMitteldorfDK.py
│   ├── data/             # Scraped data
│   │   ├── *.json        # Raw scraped data
│   │   └── tagged/       # Kategoriseret data
│   ├── tagging/          # AI kategorisering
│   │   ├── content_tagger.py
│   │   ├── test_tagger.py
│   │   └── tag_config.json
│   ├── build_articles.py # Data konsolidering
│   ├── update_all_data.py
│   ├── requirements.txt
│   └── README.md
├── public/               # Statiske filer
│   ├── widget.css
│   ├── widget.js
│   └── index.html
└── README.md             # Hoved dokumentation
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
npm run dev
```
Åbn `http://localhost:5173`

### 2. Opdater artikel data
```bash
cd scraper
python update_all_data.py
python build_articles.py
```

### 3. Filtrer og søg
- Brug filtrene i sidebar
- Søg i søgefeltet (Enter eller søgeknap)
- Naviger med pagination

## 🔧 Udvikling

### Tilføj ny kilde
1. Opret ny scraper i `scraper/scrapers/`
2. Tilføj til `update_all_data.py`
3. Test med `python update_all_data.py`

### Tilføj nye tags
Rediger `scraper/tagging/tag_config.json`

### Tilføj nye filtre
Opdater `src/components/Sidebar.jsx` og `src/App.jsx`

## ⚙️ Miljøvariabler

Opret `.env` fil i root:
```
VITE_API_URL=http://localhost:8000
```

**Bemærk**: Vite bruger `VITE_` prefix i stedet for `REACT_APP_`.

## 🐛 Fejlfinding

### Frontend problemer
- Tjek at `src/data/articles.json` eksisterer
- Verificer at alle dependencies er installeret
- Tjek browser console for fejl

### Scraping problemer
- Tjek internetforbindelse
- Nogle sites kan blokere requests
- Prøv at ændre User-Agent i scrapers

### Søgeproblemer
- Søgning aktiveres med Enter eller søgeknap
- Tjek at artikler har korrekt data struktur

## 📦 Deployment

### Frontend
```bash
npm run build
# Deploy dist/ mappen
```

### Data opdatering
```bash
cd scraper
python update_all_data.py
python build_articles.py
# Kopier articles.json til src/data/
```

## 📊 Nuværende Status

### ✅ Implementeret
- 5 aktive blog scrapers
- AI-drevet kategorisering med 17 tag-kategorier
- Avanceret søgefunktionalitet
- Pagination og filtrering
- Responsivt design
- Data konsolidering
- Modulær komponent struktur

### 🚧 I udvikling
- Login system
- Brugerprofiler
- Personaliserede feeds
- E-mail nyhedsbrev

### 📈 Statistikker
- **5 blog kilder** aktivt scraped
- **17 tag-kategorier** for præcis kategorisering
- **6 målgrupper** for personlig indholdsvisning
- **3 kompleksitetsniveauer** for tilpasset indhold

## 🤝 Bidrag

1. Fork projektet
2. Opret feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit ændringer (`git commit -m 'Add some AmazingFeature'`)
4. Push til branch (`git push origin feature/AmazingFeature`)
5. Åbn Pull Request

## 📄 Licens

Dette projekt er under udvikling for minepenge.dk
