import openai
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

class NewsletterGenerator:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
    def load_articles(self) -> List[Dict[str, Any]]:
        """Load articles from JSON file"""
        try:
            with open("../src/data/articles.json", "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("articles", [])
        except FileNotFoundError:
            return []
    
    def get_best_articles(self, limit: int = 3) -> List[Dict[str, Any]]:
        """Get the best articles based on relevance score and recency"""
        articles = self.load_articles()
        
        # Sort by relevance score and found date
        articles.sort(key=lambda x: (x.get('relevance_score', 0), x.get('foundAt', '')), reverse=True)
        
        return articles[:limit]
    
    def generate_newsletter_content(self, articles: List[Dict[str, Any]]) -> str:
        """Generate newsletter content using AI"""
        
        # Prepare articles for AI
        articles_text = ""
        for i, article in enumerate(articles, 1):
            articles_text += f"""
Artikel {i}: {article.get('title', 'Ingen titel')}
Kilde: {article.get('source', 'Ukendt')}
Resumé: {article.get('summary', '')}
Relevans: {article.get('relevance_score', 0)}
Tags: {', '.join(article.get('tags', []))}
"""
        
        prompt = f"""
Du er en ekspert på personlig økonomi og skal skrive et ugentligt nyhedsbrev for MinePenge.dk.

Her er de 3 bedste artikler fra denne uge:

{articles_text}

Skriv et engagerende nyhedsbrev på dansk med følgende struktur:

1. Kort introduktion (2-3 sætninger)
2. "Ugens 3 bedste råd" - hvor hver artikel får en sektion med:
   - Overskrift
   - Kort resumé (2-3 sætninger)
   - Praktisk tip
   - Call-to-action til at læse mere
3. Afslutning med opfordring til at abonnere

Tone: Venlig, professionel, dansk
Længde: 300-400 ord
"""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "Du er en ekspert på personlig økonomi og skriver engagerende nyhedsbreve på dansk."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error generating newsletter: {e}")
            return self.generate_fallback_newsletter(articles)
    
    def generate_fallback_newsletter(self, articles: List[Dict[str, Any]]) -> str:
        """Generate a fallback newsletter without AI"""
        newsletter = f"""
# MinePenge.dk - Ugens Bedste Råd

Hej!

Her er ugens 3 bedste artikler om personlig økonomi:

"""
        
        for i, article in enumerate(articles, 1):
            newsletter += f"""
## {i}. {article.get('title', 'Ingen titel')}

{article.get('summary', '')}

**Praktisk tip:** Læs den fulde artikel for at få alle detaljerne.

[Læs mere]({article.get('url', '#')})

"""
        
        newsletter += """
---

Tilføjet til MinePenge.dk for at hjælpe dig med at få styr på din økonomi.

Med venlig hilsen,
MinePenge.dk teamet
"""
        
        return newsletter
    
    def generate_html_newsletter(self, content: str) -> str:
        """Convert markdown content to HTML newsletter"""
        
        # Simple markdown to HTML conversion
        html = content.replace('\n\n', '</p><p>')
        html = html.replace('\n', '<br>')
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MinePenge.dk - Ugens Bedste Råd</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #1e40af; color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 20px; }}
        .footer {{ background-color: #f3f4f6; padding: 20px; text-align: center; }}
        a {{ color: #1e40af; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MinePenge.dk</h1>
            <p>Ugens Bedste Råd</p>
        </div>
        <div class="content">
            {html}
        </div>
        <div class="footer">
            <p>© 2024 MinePenge.dk - Din guide til personlig økonomi</p>
        </div>
    </div>
</body>
</html>
"""
        
        return html
    
    def save_newsletter(self, content: str, html_content: str):
        """Save newsletter to files"""
        timestamp = datetime.now().strftime("%Y-%m-%d")
        
        # Save markdown version
        with open(f"newsletters/newsletter_{timestamp}.md", "w", encoding="utf-8") as f:
            f.write(content)
        
        # Save HTML version
        with open(f"newsletters/newsletter_{timestamp}.html", "w", encoding="utf-8") as f:
            f.write(html_content)
        
        print(f"Newsletter saved: newsletter_{timestamp}")
    
    def generate_weekly_newsletter(self):
        """Generate and save weekly newsletter"""
        print("Generating weekly newsletter...")
        
        # Get best articles
        articles = self.get_best_articles(3)
        
        if not articles:
            print("No articles found for newsletter")
            return
        
        # Generate content
        content = self.generate_newsletter_content(articles)
        
        # Generate HTML
        html_content = self.generate_html_newsletter(content)
        
        # Save newsletter
        self.save_newsletter(content, html_content)
        
        print(f"Newsletter generated with {len(articles)} articles")
        return content

if __name__ == "__main__":
    # Create newsletters directory if it doesn't exist
    os.makedirs("newsletters", exist_ok=True)
    
    generator = NewsletterGenerator()
    generator.generate_weekly_newsletter() 