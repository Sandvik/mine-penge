# MinePenge.dk – SaaS + Scraper + AI Feed Koncept

## 🎯 Overordnet Formål
Byg en SaaS-tjeneste der automatisk indsamler, klassificerer og præsenterer danske artikler om privatøkonomi. Fokus er på unge og børnefamilier, uden brug af budgetberegnere. Sitet skal være AI-drevet, personliggjort og let at bruge.

---

## 🧠 Ideer til SaaS-funktioner

### Koncept: "MinePenge Feed – din økonomi-startside"
- AI-sammenfatter danske artikler
- Klassificerer dem efter målgruppe og emne
- Filtrérbare feeds
- Ugens highlights med resumé
- Brugergemte favoritter
- Nyhedsbrev
- Monetarisering via freemium + affiliate

---

## 🔁 Scraper: Hvordan det fungerer

### Teknologier:
- `requests` + `BeautifulSoup`
- `langdetect` til sprog
- `newspaper3k` til artikler
- `re` til søgeord
- Cron-job til kørsel

### Eksempel: DR.dk søgning
```python
import requests
from bs4 import BeautifulSoup
from langdetect import detect

url = "https://www.dr.dk/sog?query=mine+penge"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")
links = soup.find_all("a", href=True)

for link in links:
    href = link["href"]
    text = link.get_text().lower()
    if any(keyword in text for keyword in ["mine penge", "økonomi", "opsparing", "su", "familieøkonomi"]):
        full_url = "https://www.dr.dk" + href if href.startswith("/") else href
        print(f"{text.strip()} -> {full_url}")
```

### Eksempel: Uddrag artikel med `newspaper3k`
```python
from newspaper import Article

def extract_article_data(url):
    try:
        article = Article(url, language='da')
        article.download()
        article.parse()
        if detect(article.text) != 'da':
            return None
        if any(keyword in article.text.lower() for keyword in ["mine penge", "økonomi", "opsparing", "budget", "gæld", "su", "børnepenge"]):
            return {
                "title": article.title,
                "url": url,
                "summary": article.text[:500]
            }
    except:
        return None
```

---

## ⏱️ Hvor tit skal scraperen køre?

| Kilde             | Frekvens      |
|------------------|---------------|
| Nyhedsmedier     | Hver 2-3 time |
| Blogs            | 1x dagligt    |
| Forums/sociale   | 1x dagligt    |

Brug `cron` eller job-runner. Eks. cronjob:
```cron
0 */3 * * * python scrape_minepenge.py
```

---

## 🧱 MVP Arkitektur

### Datakilder
- DR.dk, TV2.dk, Finans.dk, Bolius.dk
- Blogs: Pengepugeren, Unge Investorer, etc.

### Backend
- Scraper, deduplikering, queue (Celery)
- Article extraction og AI-pipeline

### AI-pipeline
- Resumé (GPT)
- Klassificering (målgruppe, emne, sværhedsgrad)
- Filter (nyttig vs reklame)

### Database
- Supabase / Firebase
- Felter: URL, titel, summary, tags, dato, hash

### Frontend (Next.js / React)
- Feed
- Filter
- Gem artikler
- Login

---

## 🤖 AI Prompts

### Artikelresumé
> Sammenfat følgende danske artikel i max 300 tegn. Fokuser på det vigtigste økonomiske råd eller læring.

### Klassificering
> Returnér:  
1. Emne (opsparing, SU, bolig...)  
2. Målgruppe (stud., familie...)  
3. Sværhedsgrad (begynder, øvet...)  
Svar i JSON.

### Filter
> Er artiklen nyttig, irrelevant eller reklame? Begræns svaret til én linje.

---

## 🧠 Navne & Slogans

### Navneforslag
- MinePenge Feed
- PengeRadar
- ØkonomiOverblik
- SparSammen.dk

### Slogans
- “Alle dine penge-råd. Ét sted.”
- “Find guldet i økonomi-junglen”
- “Mindre støj. Mere værdi.”

---

## 🖼️ UX og Skærme

### `/`
- Seneste artikler (kort m. titel + resume + tags)
- [❤ Gem] [Læs mere]

### `/tags/:emne`
- Filter efter emne, målgruppe, niveau

### `/minside`
- Gemte artikler
- Ugeopsummering

### `/ugehighlight`
- AI-genereret ugens vigtigste råd

---

## 📐 Roller i systemet

| Rolle             | Funktion                            |
|------------------|--------------------------------------|
| Scraper          | Henter artikler dagligt              |
| AI-pipeline      | Sammenfatter og klassificerer        |
| Backend API      | Tjener feed + login + favoritter     |
| Frontend         | Viser feed med filtre og login       |

---

## 💸 Monetarisering

- Gratis adgang: basisfeed
- Premium:
  - E-mail resumé
  - Personlige feeds
  - Gem/læs senere
- Affiliate-links
- Google Ads

---