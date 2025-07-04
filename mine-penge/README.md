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

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
API kører på `http://localhost:8000`

## 🏗️ System Arkitektur

```
Frontend (React) ←→ Backend API (FastAPI) ←→ Web Scrapers
     ↓                    ↓                      ↓
  Tailwind CSS      Python Scrapers        Danske Sites
  React Hooks       JSON Storage           (DR, TV2, etc.)
```

## 🧱 Teknologier

### Frontend
- **React 18** + Vite
- **Tailwind CSS** - Nordisk moderne styling
- **Lucide React** - Clean line icons
- **React Hooks** - State management

### Backend
- **FastAPI** - REST API
- **BeautifulSoup4** - HTML parsing
- **Newspaper3k** - Article extraction
- **Langdetect** - Dansk sprog detektion

## 📰 Web Scraping

Systemet scraper automatisk artikler fra:

- **DR.dk** - Danmarks Radio
- **TV2.dk** - TV2 Nyheder
- **Finans.dk** - Finansnyheder  
- **Bolius.dk** - Bolig og økonomi

### 🔍 Søgeord
- økonomi, penge, opsparing, investering
- su, bolig, gæld, pension, budget
- madspild, studerende, familieøkonomi

### 🤖 Automatisk Klassificering

Artikler klassificeres automatisk på:

**Målgruppe:**
- studerende - SU og studie-relateret
- børnefamilie - Familieøkonomi  
- pensionist - Pension og ældre
- bred - Generelle artikler

**Sværhedsgrad:**
- begynder - Korte, simple artikler
- øvet - Mellemlange artikler
- avanceret - Lange, detaljerede artikler

**Tags:**
- opsparing, su, bolig, investering, gæld, pension

## 📱 Funktioner

- ✅ **Feed med seneste artikler** - Automatisk opdateret
- ✅ **Filtrering** - Efter emne og målgruppe
- ✅ **Søgning** - I artikler og tags
- ✅ **Favoritter** - Gem dine foretrukne artikler
- ✅ **Responsivt design** - Mobile + desktop
- ✅ **Nordisk design** - Moderne, rent interface
- [ ] **Login system** - Kommer senere
- [ ] **Ugens highlights** - Kommer senere
- [ ] **E-mail nyhedsbrev** - Kommer senere

## 🔧 API Endpoints

### Frontend → Backend
- `GET /api/articles` - Hent alle artikler
- `POST /api/scrape` - Start scraper
- `GET /api/scraper/status` - Scraper status
- `GET /api/statistics` - Artikel statistikker

## 📁 Projekt struktur

```
mine-penge/
├── src/                    # Frontend
│   ├── components/         # React komponenter
│   │   ├── ArticleCard.jsx
│   │   ├── FilterBar.jsx
│   │   ├── Navigation.jsx
│   │   └── Sidebar.jsx
│   ├── data/              # Data filer
│   │   └── articles.json
│   ├── services/          # Service lag
│   │   └── articleService.js
│   └── App.jsx           # Hoved app
├── backend/               # Python backend
│   ├── main.py           # FastAPI server
│   ├── scraper.py        # Web scraper
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend dokumentation
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

### 1. Start begge servere
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend  
cd backend
python main.py
```

### 2. Scrape artikler
- Klik "Start Scraper" knappen i frontend
- Eller kald API'et direkte: `POST /api/scrape`

### 3. Filtrer og søg
- Brug filtrene i sidebar
- Søg i søgefeltet
- Gem favoritter

## 🔧 Udvikling

### Tilføj ny kilde
1. Tilføj konfiguration i `backend/scraper.py`
2. Test med `python scraper.py`

### Tilføj nye søgeord
Rediger `danish_keywords` i `ArticleScraper.__init__()`

### Tilføj nye filtre
Opdater `FilterBar.jsx` og `App.jsx`

## ⚙️ Miljøvariabler

Opret `.env` fil i root:
```
VITE_API_URL=http://localhost:8000
```

**Bemærk**: Vite bruger `VITE_` prefix i stedet for `REACT_APP_`.

## 🐛 Fejlfinding

### CORS fejl
Sørg for at backend kører og CORS er konfigureret

### Scraping fejl  
- Tjek internetforbindelse
- Nogle sites kan blokere requests
- Prøv at ændre User-Agent

### Frontend kan ikke forbinde
- Tjek at backend kører på port 8000
- Tjek CORS konfiguration

## 📦 Deployment

### Frontend
```bash
npm run build
# Deploy dist/ mappen
```

### Backend
```bash
# Deploy til server med Python 3.8+
pip install -r requirements.txt
python main.py
```

## 📄 Licens

Privat projekt
