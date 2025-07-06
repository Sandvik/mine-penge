# Database Setup (Reference)

**Bemærk:** Database er ikke i brug i nuværende version af MinePenge. Alt data håndteres via JSON-filer og localStorage.

Denne fil og `schema.sql` bevares som reference, hvis du senere vil aktivere database-support (fx på one.com).

## Hvis du vil aktivere database senere
- Se `onecom-database-setup.md` for detaljer om opsætning på one.com
- Kør `schema.sql` i din database
- Opdater `.env` og kodebasen til at bruge database

## Fordele ved database (hvis du vælger det senere)
- Skalerbarhed, multi-user, avanceret søgning, backup

## Ulemper
- Mere kompleks end statiske JSON-filer
- Kræver backend/serverkode

---
**Alt fungerer pt. uden database!**

## 🗄️ Database Setup på one.com

### 1. Opret Database i one.com Control Panel

1. Log ind på one.com Control Panel
2. Gå til "PHP & Database" → "MariaDB"
3. Opret en ny database:
   - **Database navn**: `minepenge_db`
   - **Bruger**: Opret en ny database bruger
   - **Password**: Gem password'et sikkert

### 2. Kør Database Schema

1. Åbn PhpMyAdmin fra one.com Control Panel
2. Vælg din nye database
3. Gå til "SQL" tab
4. Kopier og kør indholdet fra `database/schema.sql`

### 3. Konfigurer Environment Variables

Opret en `.env` fil i projektets rod med følgende indhold:

```env
# Database Configuration
USE_DATABASE=true

# MariaDB/MySQL Database Settings (for one.com hosting)
DB_HOST=minepenge.nu.mysql
DB_USER=din_database_bruger
DB_PASSWORD=dit_database_password
DB_NAME=minepenge_db
DB_PORT=3306

# Development Settings
NODE_ENV=production
VITE_DEBUG_MODE=false
```

### 4. Installer Dependencies

```bash
npm install
```

### 5. Migrer Data fra JSON til Database

```bash
node scripts/migrate-to-database.js
```

## 🔄 Migration Process

### Før Migration
- Alle artikler er gemt i JSON filer
- Curation data gemmes i localStorage

### Efter Migration
- Alle artikler er gemt i MariaDB database
- Curation data gemmes i database
- App'en kan skifte mellem JSON og database mode

## 🚀 Deployment på one.com

### Frontend Deployment
1. Build projektet: `npm run build`
2. Upload `dist/` mappen til din web hosting
3. Sørg for at `.env` filen er uploadet

### Backend API (Valgfrit)
Hvis du vil have en dedikeret backend API:

1. Opret en `api/` mappe på din hosting
2. Upload Node.js backend filer
3. Konfigurer API endpoints for database operationer

## 🔧 Troubleshooting

### Database Connection Issues
- Tjek at host, user, password og database navn er korrekte
- Verificer at database brugeren har de nødvendige rettigheder
- Tjek at port 3306 er åben

### Migration Issues
- Sørg for at database schema er kørt først
- Tjek at alle JSON filer eksisterer
- Verificer at database brugeren har INSERT/UPDATE rettigheder

### Performance Issues
- Database queries er optimeret med indexes
- Pagination er implementeret for store datasets
- Connection pooling er konfigureret

## 📊 Database Schema Oversigt

### Hovedtabeller
- **articles**: Hovedartikel data
- **tags**: Alle tilgængelige tags
- **article_tags**: Many-to-many relation mellem artikler og tags
- **target_audiences**: Målgrupper
- **article_audiences**: Many-to-many relation mellem artikler og målgrupper

### Curation Tabeller
- **blacklisted_articles**: Blacklistede artikler
- **user_favorites**: Bruger favoritter

### Support Tabeller
- **sources**: Kilder
- **statistics**: Cached statistikker

## 🔒 Sikkerhed

- Database credentials gemmes i environment variables
- SQL injection beskyttelse via parameterized queries
- Connection pooling for bedre performance
- Error handling med graceful fallbacks

## 📈 Skalering

- Database kan håndtere 1000+ artikler effektivt
- Indexes på alle søgefelter
- Pagination for store resultater
- Caching af statistikker

## 🔄 Fallback System

Hvis database ikke er tilgængelig:
1. App'en falder automatisk tilbage til JSON mode
2. Curation data gemmes i localStorage
3. Alle funktioner forbliver tilgængelige
4. Ingen data tab

## 📝 Noter

- Database mode kræver Node.js backend eller server-side rendering
- JSON mode fungerer som statisk website
- Begge modes understøtter alle app funktioner
- Migration kan køres flere gange (upsert logic) 