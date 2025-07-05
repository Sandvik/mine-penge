# MinePenge Financial News Aggregator - Complete Project Specification

## Project Overview

MinePenge is a Danish financial news aggregator that scrapes, processes, and displays financial articles from various Danish sources. The project consists of a FastAPI backend for scraping and data management, and a React frontend for displaying articles and providing an embeddable widget.

## System Architecture

### Backend (FastAPI + Python)
- **Framework**: FastAPI
- **Database**: JSON file-based storage (`articles.json`)
- **Scraping**: Custom scraper using newspaper3k, BeautifulSoup, and requests
- **Task Queue**: Celery with Redis for background scraping
- **Virtual Environment**: Python 3.9 with venv

### Frontend (React)
- **Framework**: React 18 with Vite
- **Styling**: CSS modules and custom CSS
- **Components**: Modular component architecture
- **Widget**: Embeddable iframe widget for external sites

## Data Structures

### Article JSON Structure
```json
{
  "id": "unique_article_id",
  "title": "Article Title",
  "summary": "Article summary or excerpt",
  "content": "Full article content (optional)",
  "url": "https://source.com/article-url",
  "source": "source_name",
  "source_url": "https://source.com",
  "published_date": "2024-01-15T10:30:00Z",
  "scraped_date": "2024-01-15T11:00:00Z",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "investment|savings|budgeting|etc",
  "read_time": 5,
  "image_url": "https://source.com/image.jpg",
  "author": "Author Name",
  "language": "da",
  "country": "DK"
}
```

### Source Configuration Structure
```yaml
sources:
  - name: "source_name"
    url: "https://source.com"
    type: "news|blog|bank|consumer_org"
    category: "primary|secondary"
    frequency: "daily|weekly|monthly"
    quality_score: 8.5
    focus_areas: ["investment", "savings", "budgeting"]
    selectors:
      article_links: "a[href*='/article/']"
      title: "h1, h2"
      summary: ".summary, .excerpt"
      content: ".content, .article-body"
      date: ".date, time"
      author: ".author"
    validation:
      min_title_length: 10
      min_summary_length: 50
      required_fields: ["title", "url", "source"]
```

## Danish Financial Sources

### Primary Sources (High Quality, Daily Updates)
1. **Finans.dk** - https://finans.dk
   - Focus: Investment, markets, personal finance
   - Quality: 9.0/10
   - Frequency: Daily

2. **Børsen** - https://borsen.dk
   - Focus: Business news, stock market, economy
   - Quality: 9.5/10
   - Frequency: Daily

3. **Berlingske Business** - https://berlingske.dk/business
   - Focus: Business, economy, financial markets
   - Quality: 9.0/10
   - Frequency: Daily

4. **Jyllands-Posten Økonomi** - https://jyllands-posten.dk/erhverv
   - Focus: Business, economy, personal finance
   - Quality: 8.5/10
   - Frequency: Daily

### Secondary Sources (Specialized Content)
5. **Penge.dk** - https://penge.dk
   - Focus: Personal finance, savings, budgeting
   - Quality: 8.0/10
   - Frequency: Daily

6. **Moneypennyandmore.dk** - https://moneypennyandmore.dk
   - Focus: Personal finance, investment tips
   - Quality: 7.5/10
   - Frequency: Weekly

7. **Pengesnak.dk** - https://pengesnak.dk
   - Focus: Personal finance, savings strategies
   - Quality: 7.5/10
   - Frequency: Weekly

8. **Millionærklubben.com** - https://millionærklubben.com
   - Focus: Investment, wealth building
   - Quality: 7.0/10
   - Frequency: Weekly

9. **Ung og Rig** - https://ungogrig.dk
   - Focus: Young investors, early retirement
   - Quality: 7.0/10
   - Frequency: Weekly

10. **Nordnetbloggen** - https://blog.nordnet.dk
    - Focus: Investment, trading, market analysis
    - Quality: 8.0/10
    - Frequency: Daily

### Consumer Organizations
11. **Forbrugerrådet Tænk** - https://taenk.dk
    - Focus: Consumer rights, financial advice
    - Quality: 8.5/10
    - Frequency: Weekly

12. **Finansrådet** - https://finansraadet.dk
    - Focus: Financial regulation, consumer protection
    - Quality: 8.0/10
    - Frequency: Weekly

### Bank Sources
13. **Danske Bank Insights** - https://danskebank.dk/insights
    - Focus: Market analysis, investment advice
    - Quality: 8.0/10
    - Frequency: Daily

14. **Nordea Markets** - https://nordea.com/markets
    - Focus: Market research, economic outlook
    - Quality: 8.0/10
    - Frequency: Daily

15. **Jyske Bank Research** - https://jyskebank.dk/research
    - Focus: Investment research, market analysis
    - Quality: 7.5/10
    - Frequency: Daily

### Additional Sources
16. **Økonomisk Ugebrev** - https://okonomiskugebrev.dk
    - Focus: Economic analysis, market trends
    - Quality: 8.5/10
    - Frequency: Weekly

17. **FinansWatch** - https://finanswatch.dk
    - Focus: Financial news, market updates
    - Quality: 7.5/10
    - Frequency: Daily

18. **KapitalWatch** - https://kapitalwatch.dk
    - Focus: Investment, market analysis
    - Quality: 7.0/10
    - Frequency: Weekly

19. **Investor.dk** - https://investor.dk
    - Focus: Investment strategies, market insights
    - Quality: 7.5/10
    - Frequency: Daily

20. **Finanshuset** - https://finanshuset.dk
    - Focus: Personal finance, investment advice
    - Quality: 7.0/10
    - Frequency: Weekly

## Core Functionality Requirements

### 1. Article Scraping & Processing
- **Multi-source scraping**: Support for 20+ Danish financial sources
- **Content extraction**: Title, summary, content, date, author, tags
- **Image handling**: Extract and store article images
- **Duplicate detection**: Prevent duplicate articles across sources
- **Content validation**: Ensure minimum quality standards
- **Language detection**: Focus on Danish content (da)
- **Date parsing**: Handle various date formats

### 2. Data Management
- **JSON storage**: Primary data storage in `articles.json`
- **Article deduplication**: Based on URL and content similarity
- **Tag management**: Automatic and manual tagging system
- **Category classification**: Investment, savings, budgeting, etc.
- **Source tracking**: Maintain source metadata and quality scores

### 3. API Endpoints
```python
# Required FastAPI endpoints
GET /articles - List all articles with pagination
GET /articles/{article_id} - Get specific article
GET /articles/source/{source_name} - Get articles by source
GET /articles/category/{category} - Get articles by category
GET /articles/search - Search articles by keyword
GET /sources - List all sources and their status
GET /sources/{source_name}/status - Get source scraping status
POST /scrape/{source_name} - Trigger manual scraping
POST /scrape/all - Trigger scraping for all sources
GET /stats - Get scraping statistics
```

### 4. Frontend Features
- **Article listing**: Responsive grid layout
- **Article cards**: Title, summary, source, date, tags
- **Search functionality**: Real-time search across articles
- **Filtering**: By source, category, date range
- **Embeddable widget**: Iframe-based widget for external sites
- **Responsive design**: Mobile-first approach
- **Dark/light mode**: Theme switching capability

### 5. Widget System
- **Embeddable iframe**: Self-contained widget
- **Customizable styling**: CSS variables for theming
- **Article display**: Configurable number of articles
- **Source filtering**: Show articles from specific sources
- **Auto-refresh**: Periodic content updates
- **Analytics tracking**: Usage statistics

## Technical Requirements

### Backend Performance
- **Concurrent scraping**: Handle multiple sources simultaneously
- **Rate limiting**: Respect source website rate limits
- **Caching**: Cache scraped content to reduce load
- **Error handling**: Graceful failure handling
- **Logging**: Comprehensive logging system
- **Monitoring**: Health checks and performance metrics

### Data Quality
- **Content validation**: Minimum length requirements
- **Source verification**: Validate article URLs
- **Image validation**: Check image availability
- **Date accuracy**: Ensure correct publication dates
- **Tag relevance**: Automatic tag generation and validation

### Security
- **Input validation**: Sanitize all inputs
- **Rate limiting**: Prevent abuse
- **CORS configuration**: Proper cross-origin settings
- **Error handling**: Don't expose sensitive information

## File Structure

```
mine-penge/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── scraper.py             # Article scraping logic
│   ├── articles.json          # Article database
│   ├── sources.yaml           # Source configuration
│   ├── requirements.txt       # Python dependencies
│   └── venv/                  # Virtual environment
├── src/
│   ├── App.jsx               # Main React component
│   ├── components/
│   │   ├── ArticleCard.jsx   # Article display component
│   │   ├── EmbeddableWidget.jsx # Widget component
│   │   └── ...
│   ├── pages/
│   │   ├── LandingPageGenerator.jsx
│   │   └── ...
│   └── services/
│       └── articleService.js # API service layer
├── public/
│   ├── widget.css            # Widget styles
│   └── widget.js             # Widget script
└── package.json              # Node.js dependencies
```

## Configuration Files

### sources.yaml
```yaml
sources:
  - name: "finans"
    url: "https://finans.dk"
    type: "news"
    category: "primary"
    frequency: "daily"
    quality_score: 9.0
    focus_areas: ["investment", "markets", "personal_finance"]
    selectors:
      article_links: "a[href*='/artikel/']"
      title: "h1, h2"
      summary: ".summary, .excerpt"
      content: ".content, .article-body"
      date: ".date, time"
      author: ".author"
    validation:
      min_title_length: 10
      min_summary_length: 50
      required_fields: ["title", "url", "source"]
```

### articles.json Structure
```json
{
  "articles": [
    {
      "id": "unique_id",
      "title": "Article Title",
      "summary": "Article summary",
      "url": "https://source.com/article",
      "source": "source_name",
      "source_url": "https://source.com",
      "published_date": "2024-01-15T10:30:00Z",
      "scraped_date": "2024-01-15T11:00:00Z",
      "tags": ["investment", "savings"],
      "category": "investment",
      "read_time": 5,
      "image_url": "https://source.com/image.jpg",
      "author": "Author Name",
      "language": "da",
      "country": "DK"
    }
  ],
  "metadata": {
    "last_updated": "2024-01-15T12:00:00Z",
    "total_articles": 1500,
    "sources_count": 20,
    "scraping_stats": {
      "successful_scrapes": 95,
      "failed_scrapes": 5,
      "last_scrape": "2024-01-15T11:00:00Z"
    }
  }
}
```

## Development Guidelines

### Code Quality
- **Type hints**: Use Python type hints throughout
- **Documentation**: Comprehensive docstrings
- **Error handling**: Proper exception handling
- **Testing**: Unit tests for core functionality
- **Logging**: Structured logging with different levels

### Performance Optimization
- **Async operations**: Use async/await for I/O operations
- **Connection pooling**: Reuse HTTP connections
- **Memory management**: Efficient data structures
- **Caching**: Cache frequently accessed data

### Maintenance
- **Regular updates**: Keep dependencies updated
- **Monitoring**: Track scraping success rates
- **Backup**: Regular data backups
- **Documentation**: Keep documentation current

## Deployment Requirements

### Environment Setup
```bash
# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ..
npm install
npm run dev
```

### Dependencies
```txt
# requirements.txt
fastapi==0.104.1
uvicorn==0.24.0
newspaper3k==0.2.8
beautifulsoup4==4.12.2
requests==2.31.0
python-dotenv==1.0.0
celery==5.3.4
redis==5.0.1
psycopg2-binary==2.9.9
sqlalchemy==2.0.23
pydantic==2.5.0
schedule==1.2.0
```

## Success Metrics

### Content Quality
- **Article count**: 1000+ articles from 20+ sources
- **Update frequency**: Daily updates from primary sources
- **Content freshness**: Articles no older than 7 days
- **Source diversity**: Coverage across all source types

### Technical Performance
- **Scraping success rate**: >90% success rate
- **Response time**: <500ms for API endpoints
- **Uptime**: >99% availability
- **Error rate**: <5% error rate

### User Experience
- **Widget load time**: <2 seconds
- **Search performance**: <1 second response time
- **Mobile responsiveness**: Perfect mobile experience
- **Cross-browser compatibility**: All major browsers

## Future Enhancements

### Phase 2 Features
- **User accounts**: Personalization and favorites
- **Email newsletters**: Daily/weekly digest
- **Push notifications**: Breaking news alerts
- **Social sharing**: Share articles on social media
- **Comment system**: User discussions
- **Advanced analytics**: Detailed usage statistics

### Phase 3 Features
- **AI-powered recommendations**: Personalized content
- **Sentiment analysis**: Article sentiment scoring
- **Market data integration**: Real-time market data
- **Portfolio tracking**: Investment portfolio integration
- **Financial calculators**: Built-in financial tools
- **Multi-language support**: English and other languages

## Contact & Support

This specification should provide a complete understanding of the MinePenge project requirements. For any questions or clarifications, refer to the existing codebase and documentation.

**Key Files to Review:**
- `backend/main.py` - FastAPI application structure
- `backend/scraper.py` - Scraping logic and implementation
- `src/App.jsx` - Frontend main component
- `src/components/EmbeddableWidget.jsx` - Widget implementation
- `articles.json` - Current article database structure 