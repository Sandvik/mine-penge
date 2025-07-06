# One.com Database Setup (MariaDB/MySQL)

## Database Host
- Format: `[ditdomæne].mysql`
- Eksempel: `minepenge.nu.mysql`

## Database Navn og Bruger
- Ofte det samme på one.com
- Eksempel: `minepenge_nu`

## Database Password
- Sættes i one.com kontrolpanel ved oprettelse

## Port
- Standard: `3306`

## Charset
- WordPress bruger: `utf8`
- Kan også bruge: `utf8mb4` (hvis du ønsker full Unicode support)

## Eksempel på miljøvariabler (.env)
```env
USE_DATABASE=true
DB_HOST=minepenge.nu.mysql
DB_USER=minepenge_nu
DB_PASSWORD=dit_password
DB_NAME=minepenge_nu
DB_PORT=3306
```

## Database Schema
- Se `database/schema.sql` for anbefalet struktur til artikler, tags, curation osv.

## Oprettelse af database på one.com
1. Log ind på one.com Control Panel
2. Gå til "PHP & Database" → "MariaDB"
3. Opret database og bruger
4. Notér credentials

## Kørsel af schema
1. Log ind i phpMyAdmin
2. Vælg din database
3. Gå til "SQL" og indsæt indholdet fra `database/schema.sql`

## WordPress Reference
- WordPress bruger samme setup:
  - Host: `[domæne].mysql`
  - Charset: `utf8`
  - Port: `3306`
  - Prefix: `wp_` (kun relevant for WordPress)

## Fordele ved database på one.com
- Skalerbarhed, sikkerhed, multi-user, avanceret søgning, backup

## Ulemper
- Kræver backend/serverkode
- Mere kompleks end statiske JSON-filer

---
**Denne fil kan bruges som reference, hvis du senere vil aktivere database-support igen.** 