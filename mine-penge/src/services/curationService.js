// Kurateringsservice for MinePenge
// Håndterer blacklist over artikler der ikke skal vises
// Bruger localStorage for browser-kompatibilitet

class CurationService {
  constructor() {
    this.blacklistKey = 'minepenge_article_blacklist';
    this.blacklist = this.loadBlacklist();
  }

  // Indlæs blacklist fra localStorage
  loadBlacklist() {
    try {
      const stored = localStorage.getItem(this.blacklistKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Fejl ved indlæsning af blacklist:', error);
      return [];
    }
  }

  // Gem blacklist til localStorage
  saveBlacklist() {
    try {
      localStorage.setItem(this.blacklistKey, JSON.stringify(this.blacklist));
    } catch (error) {
      console.error('Fejl ved gemning af blacklist:', error);
    }
  }

  // Tilføj artikel til blacklist
  addToBlacklist(articleId, reason = '') {
    if (!this.blacklist.includes(articleId)) {
      this.blacklist.push(articleId);
      this.saveBlacklist();
      console.log(`Artikel ${articleId} tilføjet til blacklist. Grund: ${reason}`);
    }
  }

  // Fjern artikel fra blacklist
  removeFromBlacklist(articleId) {
    const index = this.blacklist.indexOf(articleId);
    if (index > -1) {
      this.blacklist.splice(index, 1);
      this.saveBlacklist();
      console.log(`Artikel ${articleId} fjernet fra blacklist`);
    }
  }

  // Tjek om artikel er på blacklist
  isBlacklisted(articleId) {
    return this.blacklist.includes(articleId);
  }

  // Hent alle blacklistede artikler
  getBlacklistedArticles() {
    return [...this.blacklist];
  }

  // Ryd blacklist
  clearBlacklist() {
    this.blacklist = [];
    this.saveBlacklist();
    console.log('Blacklist ryddet');
  }

  // Filtrer artikler - fjern blacklistede
  filterArticles(articles) {
    return articles.filter(article => !this.isBlacklisted(article.article_id));
  }

  // Eksporter blacklist til fil
  exportBlacklist() {
    const data = {
      blacklisted_articles: this.blacklist,
      export_date: new Date().toISOString(),
      total_count: this.blacklist.length
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minepenge_blacklist_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Importer blacklist fra fil
  async importBlacklist(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.blacklisted_articles && Array.isArray(data.blacklisted_articles)) {
        this.blacklist = [...new Set([...this.blacklist, ...data.blacklisted_articles])];
        this.saveBlacklist();
        console.log(`Importeret ${data.blacklisted_articles.length} artikler til blacklist`);
        return true;
      }
    } catch (error) {
      console.error('Fejl ved import af blacklist:', error);
      return false;
    }
  }
}

// Opret singleton instance
const curationService = new CurationService();

export default curationService; 