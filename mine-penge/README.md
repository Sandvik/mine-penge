# MinePenge.nu - AI-drevet økonomi platform

En moderne React app der samler og kuraterer danske økonomi-artikler med Python scraper backend og interaktive guides.

## 📚 Dokumentation

Se [docs/](docs/) mappen for detaljeret dokumentation:
- [AI Chat System](docs/AI-CHAT-SYSTEM.md) - Komplet AI chat strategi og implementering
- [SEO Checklist](docs/SEO_CHECKLIST.md)
- [Scraper Guide](docs/scraper-guide.md)
- [Integration Guide](docs/integration-guide.md)
- [Deployment Guide](docs/deployment-guide.md)

## 🎯 Formål
AI-drevet aggregator der samler, klassificerer og præsenterer danske artikler om privatøkonomi - som en "Google News for dine penge" med fokus på unge og børnefamilier. Inkluderer interaktive guides med værktøjer og beregnere.

## 🚀 Kom i gang

### Frontend (React)
```bash
npm install
npm run dev
```
Åbn `http://localhost:5173`

### Produktions build
```bash
npm run build
```
Output i `dist/` mappen - klar til deployment på one.com

### Data opdatering (Python scraper)
```bash
cd scraper
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python update_all_data_realtime.py
```

## 🏗️ Arkitektur

**Frontend**: React + Tailwind CSS + Vite  
**Backend**: Python scraper suite (kun til dataopdatering)  
**Data**: Statiske JSON-filer + localStorage (curation)  
**Hosting**: one.com med .htaccess for React Router

## 📰 Kilder

Systemet scraper automatisk fra 5 danske økonomiblogger:

- **Moneypenny** - Investering og privatøkonomi for kvinder
- **Nordnet** - Investeringsanalyser og finansnyheder  
- **Budgetnoerden** - Budget tips og økonomi
- **Ungmedpenge** - Investering for unge
- **Mitteldorf** - FIRE, value investing og minimalisme

## 🎓 Interaktive Guides

### Studieinvestering Guide (`/student-investment-guide`)
- **Artikel**: Komplet guide til investering for studerende
- **Beregner**: Investeringsberegner med compound interest
- **Template**: Download budget template for studerende
- **Platforms**: Sammenligning af Nordnet, Saxo Bank, Lunar
- **Quiz**: Test din viden om investering

### Familieøkonomi Guide (`/family-finance-guide`)
- **Artikel**: Økonomisk planlægning for familier med børn
- **Beregner**: Børneopsparing beregner med skattefordele
- **Template**: Familie budget template
- **Forsikringer**: Sammenligning af forsikringer for familier
- **Quiz**: Familieøkonomi quiz

### Investering Guide (`/investering-guide`)
- **Artikler**: 4 originale artikler om investering
- **Beregner**: Avanceret investeringsberegner
- **Portefølje**: Portefølje balance og diversificering
- **Quiz**: Investeringsquiz

### Bolig & Hus Guide (`/bolig-hus-guide`)
- **Artikler**: 4 originale artikler om boligkøb
- **Beregner**: Boliglånsberegner
- **Sammenligning**: Ejendomssammenligning
- **Quiz**: Boligkøbsquiz

## 📊 Artikel Sortering

Artikler sorteres efter **publiceringsdato** (nyeste først) med intelligent dato-udledning:

### Sorteringslogik
1. **ISO datoer** (Moneypenny): `"2020-08-05T10:36:00+00:00"`
2. **Danske datoer med år** (Mitteldorf): `"5. juni 2024"`
3. **Danske datoer uden år** (Budget Nørden): `"16. jun."` → antages som 2023
4. **Fallback**: `scrape_date` eller `last_updated`

**Sekundær sortering**: Alfabetisk efter kilde ved samme dato.

### Automatisk Klassificering

**Målgruppe**: studerende, børnefamilie, nybegynder_investering, økonomi_nybegynder, pensionister  
**Sværhedsgrad**: begynder, mellem, avanceret  
**Tags**: 17 kategorier (bolig, investering, pension, su, gæld, osv.)

## 📱 Funktioner

- ✅ **Feed med seneste artikler** - Automatisk opdateret
- ✅ **Filtrering** - Efter emne og målgruppe
- ✅ **Søgning** - I artikler og tags
- ✅ **Responsivt design** - Mobile + desktop
- ✅ **Nordisk design** - Moderne, rent interface
- ✅ **Interaktive guides** - 4 komplette guides med værktøjer
- ✅ **Beregnere** - Investering, boliglån, børneopsparing
- ✅ **Quizzer** - Test din viden
- ✅ **Templates** - Download budget templates
- ✅ **SEO optimeret** - Fuldt optimeret til søgemaskiner

## 🔍 SEO Optimering

### Implementeret
- ✅ **Meta tags** - Title, description, keywords
- ✅ **Open Graph** - Facebook/LinkedIn sharing
- ✅ **Twitter Cards** - Twitter sharing
- ✅ **Strukturerede data** - JSON-LD schema markup
- ✅ **Sitemap.xml** - Automatisk genereret
- ✅ **Robots.txt** - Søgemaskine instruktioner
- ✅ **Canonical URLs** - Undgå duplikat indhold
- ✅ **Breadcrumbs** - Navigation og SEO
- ✅ **Dansk locale** - da_DK meta tags

### Hosting
- **one.com** - Apache server med .htaccess
- **React Router** - Client-side routing
- **SPA fallback** - Alle routes fungerer

## 📁 Projekt struktur

```
mine-penge/
├── src/                    # Frontend (React)
│   ├── components/         # React komponenter
│   ├── pages/             # Guide sider og andre sider
│   ├── data/              # Data filer (artikler, tags)
│   ├── services/          # Service lag
│   └── utils/             # Utility funktioner
├── scraper/               # Python scraper suite
│   ├── scrapers/         # Kildespecifikke scrapers
│   ├── tagging/          # AI tagging
│   └── data/             # Rå og taggede datafiler
├── public/                # Statisk assets
│   ├── .htaccess         # one.com hosting config
│   └── sitemap.xml       # SEO sitemap
└── dist/                  # Produktions build
```

## 🎨 Design

- **Nordisk moderne UI** med minimalistisk æstetik
- **Farvepalette**: lyse grå, off-white, blå og grønne accenter
- **Typografi**: Inter font
- **Responsivt design** (mobile + desktop)
- **Clean line-icons** (Lucide)
- **Tab navigation** - I guide sider
- **Breadcrumb navigation** - Konsistent navigation

## 🔧 Udvikling

### Tilføj ny kilde
1. Opret ny scraper i `scraper/scrapers/`
2. Test med `python scraperX.py`
3. Tilføj til `update_all_data_realtime.py`

### Data opdatering
```bash
cd scraper
python update_all_data_realtime.py  # Scraper alle kilder
python build_articles.py            # Samler artikler
```

### SEO opdatering
```bash
npm run build  # Genererer sitemap.xml og optimeret build
```

## 🚀 Deployment

### one.com Hosting
1. Kør `npm run build`
2. Upload hele `dist/` mappe til one.com
3. `.htaccess` fil håndterer React Router automatisk

### Andre hosting platforms
- **Netlify**: `_redirects` fil inkluderet
- **Vercel**: `vercel.json` konfiguration inkluderet
- **Firebase**: `firebase.json` konfiguration inkluderet

## 📝 Noter

- **Statisk app** - Ingen backend/server nødvendig for frontend
- **Curation** kun tilgængelig i debug mode
- **Interaktive værktøjer** - Alle beregnere og quizzer fungerer offline
- **SEO optimeret** - Fuldt optimeret til Google og andre søgemaskiner
- **Mobile-first** - Responsivt design på alle enheder

## 🎯 Målgrupper

- **Studerende** - Investering og budget guides
- **Børnefamilier** - Familieøkonomi og børneopsparing
- **Nybegyndere** - Grundlæggende økonomi og investering
- **Boligkøbere** - Boligkøb og boliglån guides

## 📊 Statistik

- **700+ artikler** fra 5 danske kilder
- **4 interaktive guides** med værktøjer
- **17 kategorier** af økonomiske emner
- **Fuldt SEO optimeret** til danske søgeord
