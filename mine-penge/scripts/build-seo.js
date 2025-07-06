#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting SEO-optimized build...');

// 1. Build the React app
console.log('📦 Building React app...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ React app built successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// 2. Copy robots.txt to dist
console.log('🤖 Copying robots.txt...');
const robotsSource = path.join(__dirname, '../public/robots.txt');
const robotsDest = path.join(__dirname, '../dist/robots.txt');

if (fs.existsSync(robotsSource)) {
  fs.copyFileSync(robotsSource, robotsDest);
  console.log('✅ robots.txt copied');
} else {
  console.log('⚠️  robots.txt not found in public folder');
}

// 3. Generate sitemap
console.log('🗺️  Generating sitemap...');
try {
  // This would need to be run in a Node.js environment that can import ES modules
  // For now, we'll create a basic sitemap
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
            <loc>https://minepenge.nu/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
            <loc>https://minepenge.nu/opsparing</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
            <loc>https://minepenge.nu/investering</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
            <loc>https://minepenge.nu/budget</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
            <loc>https://minepenge.nu/gæld</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
            <loc>https://minepenge.nu/pension</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
            <loc>https://minepenge.nu/bolig</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
            <loc>https://minepenge.nu/studerende</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
            <loc>https://minepenge.nu/familieøkonomi</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  const sitemapPath = path.join(__dirname, '../dist/sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log('✅ sitemap.xml generated');
} catch (error) {
  console.error('❌ Failed to generate sitemap:', error.message);
}

// 4. Create .htaccess for Apache (if needed)
console.log('⚙️  Creating .htaccess...');
const htaccessContent = `# SEO and Performance Optimizations
RewriteEngine On

# Redirect www to non-www
RewriteCond %{HTTP_HOST} ^www\.minepenge\.dk [NC]
RewriteRule ^(.*)$ https://minepenge.nu/$1 [L,R=301]

# Redirect HTTP to HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Gzip compression
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

# Security headers
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options nosniff
  Header always set X-Frame-Options DENY
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>`;

const htaccessPath = path.join(__dirname, '../dist/.htaccess');
fs.writeFileSync(htaccessPath, htaccessContent);
console.log('✅ .htaccess created');

// 5. Create netlify.toml for Netlify deployment
console.log('🌐 Creating netlify.toml...');
const netlifyContent = `[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[redirects]]
  from = "/sitemap.xml"
  to = "/sitemap.xml"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`;

const netlifyPath = path.join(__dirname, '../netlify.toml');
fs.writeFileSync(netlifyPath, netlifyContent);
console.log('✅ netlify.toml created');

console.log('🎉 SEO-optimized build completed successfully!');
console.log('📁 Files are ready in the dist/ folder');
console.log('🚀 Ready for deployment to your hosting provider'); 