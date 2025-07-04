from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime
from scraper import ArticleScraper

app = FastAPI(title="MinePenge Scraper API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize scraper
scraper = ArticleScraper()

# Data models
class Article(BaseModel):
    id: int
    title: str
    summary: str
    tags: List[str]
    source: str
    publishedAt: str
    audience: str
    difficulty: str
    url: str

class ScrapeRequest(BaseModel):
    sources: List[str] = ["dr.dk", "tv2.dk", "finans.dk", "bolius.dk", "moneymum.dk", "pengepugeren.dk"]
    keywords: List[str] = []  # Not used anymore, but kept for compatibility

class ScraperStatus(BaseModel):
    is_running: bool
    last_run: Optional[str]
    articles_found: int
    sources_scraped: List[str]

class UserFeedback(BaseModel):
    articleId: int
    rating: str  # 'positive' or 'negative'
    comment: str = ""
    timestamp: str

# Load articles from JSON file
def load_articles():
    try:
        with open("../src/data/articles.json", "r", encoding="utf-8") as f:
            data = json.load(f)
            return data["articles"]
    except FileNotFoundError:
        return []

# Save articles to JSON file
def save_articles(articles):
    data = {
        "articles": articles,
        "metadata": {
            "totalArticles": len(articles),
            "lastUpdated": datetime.now().isoformat(),
            "sources": list(set(article["source"] for article in articles)),
            "topics": list(set(tag for article in articles for tag in article["tags"])),
            "audiences": list(set(article["audience"] for article in articles)),
            "difficulties": list(set(article["difficulty"] for article in articles))
        }
    }
    
    with open("../src/data/articles.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.get("/")
async def root():
    return {"message": "MinePenge Scraper API", "version": "1.0.0"}

@app.get("/api/articles")
async def get_articles():
    """Get all articles"""
    articles = load_articles()
    # Sort by relevance score first, then by found date (newest first)
    articles.sort(key=lambda x: (x.get('relevance_score', 0), x.get('foundAt', '')), reverse=True)
    return {"articles": articles}

@app.get("/api/articles/source/{source}")
async def get_articles_by_source(source: str):
    """Get articles from specific source"""
    articles = load_articles()
    filtered = [article for article in articles if article["source"].lower() == source.lower()]
    # Sort by relevance score first, then by found date (newest first)
    filtered.sort(key=lambda x: (x.get('relevance_score', 0), x.get('foundAt', '')), reverse=True)
    return {"articles": filtered}

@app.get("/api/articles/relevant")
async def get_relevant_articles(min_score: float = 3.0):
    """Get articles with minimum relevance score"""
    articles = load_articles()
    relevant = [article for article in articles if article.get('relevance_score', 0) >= min_score]
    # Sort by relevance score first, then by found date (newest first)
    relevant.sort(key=lambda x: (x.get('relevance_score', 0), x.get('foundAt', '')), reverse=True)
    return {"articles": relevant, "min_score": min_score}

@app.get("/api/articles/latest")
async def get_latest_articles():
    """Get articles sorted by found date (newest first)"""
    articles = load_articles()
    # Sort by found date (newest first)
    articles.sort(key=lambda x: x.get('foundAt', ''), reverse=True)
    return {"articles": articles}

@app.post("/api/articles/date-range")
async def get_articles_by_date_range(request: dict):
    """Get articles within date range"""
    articles = load_articles()
    # Implementation for date filtering
    return {"articles": articles}

@app.post("/api/scrape")
async def trigger_scraper(request: ScrapeRequest):
    """Trigger the scraper to fetch new articles"""
    try:
        print(f"Starting scraper with sources: {request.sources}")
        
        # Run scraper (keywords not used anymore)
        new_articles = await scraper.scrape_articles(request.sources)
        
        # Load existing articles
        existing_articles = load_articles()
        
        # Merge and deduplicate
        all_articles = existing_articles + new_articles
        unique_articles = scraper.deduplicate_articles(all_articles)
        
        # Save updated articles
        save_articles(unique_articles)
        
        return {
            "message": "Scraping completed",
            "new_articles": len(new_articles),
            "total_articles": len(unique_articles)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/scraper/status")
async def get_scraper_status():
    """Get scraper status"""
    return ScraperStatus(
        is_running=False,
        last_run=datetime.now().isoformat(),
        articles_found=len(load_articles()),
        sources_scraped=["dr.dk", "tv2.dk", "finans.dk", "bolius.dk", "moneymum.dk", "pengepugeren.dk"]
    )

@app.get("/api/statistics")
async def get_statistics():
    """Get article statistics"""
    articles = load_articles()
    
    stats = {
        "total_articles": len(articles),
        "sources": list(set(article["source"] for article in articles)),
        "topics": list(set(tag for article in articles for tag in article["tags"])),
        "audiences": list(set(article["audience"] for article in articles)),
        "difficulties": list(set(article["difficulty"] for article in articles)),
        "recent_articles": len([a for a in articles if "dag" in a["publishedAt"] or "time" in a["publishedAt"]])
    }
    
    return stats

@app.post("/api/feedback")
async def submit_feedback(feedback: UserFeedback):
    """Submit user feedback for articles"""
    try:
        # Load existing feedback
        feedback_file = "feedback.json"
        try:
            with open(feedback_file, "r", encoding="utf-8") as f:
                feedback_data = json.load(f)
        except FileNotFoundError:
            feedback_data = {"feedback": []}
        
        # Add new feedback
        feedback_data["feedback"].append({
            "articleId": feedback.articleId,
            "rating": feedback.rating,
            "comment": feedback.comment,
            "timestamp": feedback.timestamp
        })
        
        # Save feedback
        with open(feedback_file, "w", encoding="utf-8") as f:
            json.dump(feedback_data, f, ensure_ascii=False, indent=2)
        
        return {"message": "Feedback submitted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/feedback/statistics")
async def get_feedback_statistics():
    """Get feedback statistics"""
    try:
        feedback_file = "feedback.json"
        try:
            with open(feedback_file, "r", encoding="utf-8") as f:
                feedback_data = json.load(f)
        except FileNotFoundError:
            return {"total_feedback": 0, "positive_ratio": 0, "recent_feedback": 0}
        
        feedback_list = feedback_data.get("feedback", [])
        total_feedback = len(feedback_list)
        
        if total_feedback == 0:
            return {"total_feedback": 0, "positive_ratio": 0, "recent_feedback": 0}
        
        positive_count = len([f for f in feedback_list if f["rating"] == "positive"])
        positive_ratio = (positive_count / total_feedback) * 100
        
        # Recent feedback (last 7 days)
        week_ago = (datetime.now() - timedelta(days=7)).isoformat()
        recent_feedback = len([f for f in feedback_list if f["timestamp"] > week_ago])
        
        return {
            "total_feedback": total_feedback,
            "positive_ratio": round(positive_ratio, 1),
            "recent_feedback": recent_feedback
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 