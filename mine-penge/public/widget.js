// MinePenge.dk Widget for external sites
(function() {
  'use strict';

  // Widget configuration
  var config = {
    apiUrl: 'https://minepenge.dk/api',
    defaultTheme: 'all',
    defaultLimit: 3,
    defaultShowSource: true
  };

  // Widget class
  function MinePengeWidget() {
    this.init = function(options) {
      var settings = Object.assign({}, {
        container: 'minepenge-widget',
        theme: config.defaultTheme,
        limit: config.defaultLimit,
        showSource: config.defaultShowSource
      }, options);

      this.container = document.getElementById(settings.container);
      this.theme = settings.theme;
      this.limit = settings.limit;
      this.showSource = settings.showSource;

      if (!this.container) {
        console.error('MinePenge Widget: Container not found');
        return;
      }

      this.loadArticles();
    };

    this.loadArticles = function() {
      var self = this;
      
      // Show loading state
      this.container.innerHTML = '<div class="minepenge-widget"><div class="widget-header"><h3>MinePenge.dk</h3></div><div class="widget-content"><p>Indlæser artikler...</p></div></div>';

      // Fetch articles from API
      fetch(config.apiUrl + '/articles/relevant?min_score=3.0')
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          self.renderWidget(data.articles);
        })
        .catch(function(error) {
          console.error('MinePenge Widget: Error loading articles', error);
          self.container.innerHTML = '<div class="minepenge-widget"><div class="widget-header"><h3>MinePenge.dk</h3></div><div class="widget-content"><p>Kunne ikke indlæse artikler</p></div></div>';
        });
    };

    this.renderWidget = function(articles) {
      // Filter by theme if specified
      if (this.theme && this.theme !== 'all') {
        articles = articles.filter(function(article) {
          return article.tags && article.tags.some(function(tag) {
            return tag.toLowerCase().includes(this.theme.toLowerCase());
          }.bind(this));
        }.bind(this));
      }

      // Limit articles
      articles = articles.slice(0, this.limit);

      // Generate widget HTML
      var html = this.generateWidgetHTML(articles);
      this.container.innerHTML = html;
    };

    this.generateWidgetHTML = function(articles) {
      var themeTitle = this.getThemeTitle(this.theme);
      
      var html = '<div class="minepenge-widget">';
      html += '<div class="widget-header">';
      html += '<h3>MinePenge.dk - ' + themeTitle + '</h3>';
      html += '<a href="https://minepenge.dk" target="_blank" rel="noopener noreferrer">Se alle artikler →</a>';
      html += '</div>';
      
      html += '<div class="widget-content">';
      
      if (articles.length === 0) {
        html += '<p>Ingen artikler fundet for dette emne.</p>';
      } else {
        html += '<div class="widget-articles">';
        articles.forEach(function(article) {
          html += '<div class="widget-article">';
          html += '<h4 class="article-title">';
          html += '<a href="' + article.url + '" target="_blank" rel="noopener noreferrer">' + article.title + '</a>';
          html += '</h4>';
          html += '<p class="article-summary">' + article.summary + '</p>';
          html += '<div class="article-meta">';
          if (this.showSource) {
            html += '<span class="article-source">' + article.source + '</span>';
          }
          html += '<span class="article-date">' + article.publishedAt + '</span>';
          if (article.relevance_score) {
            html += '<span class="article-relevance">Relevans: ' + article.relevance_score + '</span>';
          }
          html += '</div>';
          html += '</div>';
        }.bind(this));
        html += '</div>';
      }
      
      html += '</div>';
      html += '<div class="widget-footer">';
      html += '<p>Powered by <a href="https://minepenge.dk" target="_blank" rel="noopener noreferrer">MinePenge.dk</a></p>';
      html += '</div>';
      html += '</div>';

      return html;
    };

    this.getThemeTitle = function(theme) {
      var themes = {
        'su': 'SU og Studerende',
        'opsparing': 'Opsparing',
        'bolig': 'Bolig og Huskøb',
        'investering': 'Investering',
        'gæld': 'Gæld og Lån',
        'pension': 'Pension',
        'budget': 'Budget',
        'all': 'Personlig Økonomi'
      };
      return themes[theme] || 'Personlig Økonomi';
    };
  }

  // Load CSS
  function loadCSS() {
    if (document.getElementById('minepenge-widget-css')) {
      return; // CSS already loaded
    }

    var link = document.createElement('link');
    link.id = 'minepenge-widget-css';
    link.rel = 'stylesheet';
    link.href = 'https://minepenge.dk/widget.css';
    document.head.appendChild(link);
  }

  // Initialize widget
  window.MinePengeWidget = new MinePengeWidget();
  
  // Load CSS when script loads
  loadCSS();

})(); 