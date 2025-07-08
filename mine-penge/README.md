# MinePenge.dk - AI-drevet økonomi platform

En moderne React app der samler og kuraterer danske økonomi-artikler med Python scraper backend.

## 🎯 Formål
AI-drevet aggregator der samler, klassificerer og præsenterer danske artikler om privatøkonomi - som en "Google News for dine penge" med fokus på unge og børnefamilier.

## 🚀 Kom i gang

### Frontend (React)
```bash
npm install
npm run dev
```
Åbn `http://localhost:5173`

### Data opdatering (Python scraper)
```bash
cd scraper
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python update_all_data_realtime.py
```

## 🏗️ Arkitektur

**Frontend**: React + Tailwind CSS + JSON-filer  
**Backend**: Python scraper suite (kun til dataopdatering)  
**Data**: Statiske JSON-filer + localStorage (curation)

## 📰 Kilder

Systemet scraper automatisk fra 5 danske økonomiblogger:

- **Moneypenny** - Investering og privatøkonomi for kvinder
- **Nordnet** - Investeringsanalyser og finansnyheder  
- **Budgetnoerden** - Budget tips og økonomi
- **Ungmedpenge** - Investering for unge
- **Mitteldorf** - FIRE, value investing og minimalisme

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

## 📁 Projekt struktur

```
mine-penge/
├── src/                    # Frontend (React)
│   ├── components/         # React komponenter
│   ├── data/              # Data filer (artikler, tags)
│   └── services/          # Service lag
├── scraper/               # Python scraper suite
│   ├── scrapers/         # Kildespecifikke scrapers
│   ├── tagging/          # AI tagging
│   └── data/             # Rå og taggede datafiler
└── public/                # Statisk assets
```

## 🎨 Design

- **Nordisk moderne UI** med minimalistisk æstetik
- **Farvepalette**: lyse grå, off-white, blå og grønne accenter
- **Typografi**: Inter font
- **Responsivt design** (mobile + desktop)
- **Clean line-icons** (Lucide)

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

## 📝 Noter

- **Statisk app** - Ingen backend/server nødvendig for frontend
- **Curation** kun tilgængelig i debug mode
- **Database-support** dokumenteret i `database/` hvis nødvendigt senere
