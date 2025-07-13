# Deployment Guide - MinePenge.dk

Denne guide forklarer hvordan MinePenge.dk deployes på one.com hosting.

## 🚀 One.com Deployment

### 1. Forberedelse
```bash
# Build projektet
npm run build

# Tjek at dist/ mappen er oprettet
ls dist/
```

### 2. Upload til one.com
1. **Log ind på one.com Control Panel**
2. **Gå til File Manager**
3. **Naviger til din web root** (typisk `public_html/`)
4. **Upload hele `dist/` mappen** til web root

### 3. Konfigurer .htaccess
Sørg for at `.htaccess` filen er uploadet i web root:

```apache
# .htaccess for React Router
RewriteEngine On
RewriteBase /

# Hvis filen ikke eksisterer, send til index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# Gzip komprimering
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

## 📊 SEO Optimering

### 1. Sitemap
Sørg for at `sitemap.xml` er uploadet til web root.

### 2. Robots.txt
Sørg for at `robots.txt` er uploadet til web root.

### 3. Meta Tags
Alle sider har automatisk genererede meta tags via `SEOHead.jsx`.

## 🔄 Automatiseret Deployment

### GitHub Actions (Anbefalet)
```yaml
# .github/workflows/deploy.yml
name: Deploy to One.com
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build project
        run: npm run build
        
      - name: Deploy to One.com
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          SOURCE: "dist/"
          TARGET: "/public_html/"
```

### Manuelt Script
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying MinePenge.dk..."

# Build projektet
npm run build

# Upload til one.com (via FTP/SSH)
# Dette kræver konfiguration af FTP credentials

echo "✅ Deployment completed!"
```

## 🔧 Troubleshooting

### 404 Fejl på Routes
- Tjek at `.htaccess` filen er uploadet korrekt
- Verificer at `RewriteEngine On` er aktiveret
- Test at `index.html` er i web root

### Performance Problemer
- Aktiver Gzip komprimering i `.htaccess`
- Tjek browser caching headers
- Optimér billeder og assets

### SSL/HTTPS
- Aktiver SSL certifikat i one.com Control Panel
- Sørg for at alle links bruger HTTPS
- Test at redirects fungerer korrekt

## 📈 Monitoring

### Google Analytics
1. Opret Google Analytics 4 property
2. Tilføj tracking kode til `index.html`
3. Konfigurer goals og events

### Google Search Console
1. Verificer ejerskab af domænet
2. Submit sitemap.xml
3. Monitor Core Web Vitals

### Uptime Monitoring
- Brug one.com's indbyggede monitoring
- Overvej eksterne uptime services
- Sæt op alerts for nedetid

## 🔒 Sikkerhed

### HTTPS
- Aktiver SSL certifikat
- Force HTTPS redirects
- Opdater alle interne links

### Headers
```apache
# Sikkerhedsheaders i .htaccess
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

### Backup
- Download regelmæssige backups af `dist/` mappen
- Gem source code på GitHub
- Dokumenter alle konfigurationer

## 📞 Support

For problemer med deployment:
1. Tjek one.com's dokumentation
2. Kontakt one.com support
3. Se troubleshooting sektion ovenfor

---

*Opdateret: Januar 2025* 