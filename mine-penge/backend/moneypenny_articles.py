#!/usr/bin/env python3
"""
Known Moneypenny and More blog article URLs
This serves as a fallback when dynamic content loading fails
"""

KNOWN_MONEYPENNY_ARTICLES = [
    "https://moneypennyandmore.dk/blog/de-naeste-skridt-de-forste-penge-pa-nordnet",
    "https://moneypennyandmore.dk/blog/investering-for-unge-del-1",
    "https://moneypennyandmore.dk/blog/budgetskabelon",
    "https://moneypennyandmore.dk/blog/aktiesparekonto",
    "https://moneypennyandmore.dk/blog/pensionsopsparing",
    "https://moneypennyandmore.dk/blog/boligkøb",
    "https://moneypennyandmore.dk/blog/opsparing",
    "https://moneypennyandmore.dk/blog/investering",
    "https://moneypennyandmore.dk/blog/privatoekonomi",
    "https://moneypennyandmore.dk/blog/økonomisk-frihed",
    "https://moneypennyandmore.dk/blog/start-med-investering",
    "https://moneypennyandmore.dk/blog/aktier-for-begyndere",
    "https://moneypennyandmore.dk/blog/fonde",
    "https://moneypennyandmore.dk/blog/renters-rente",
    "https://moneypennyandmore.dk/blog/økonomisk-mentalitet",
    "https://moneypennyandmore.dk/blog/spar-penge",
    "https://moneypennyandmore.dk/blog/investeringsstrategi",
    "https://moneypennyandmore.dk/blog/risiko-og-afkast",
    "https://moneypennyandmore.dk/blog/portefølje",
    "https://moneypennyandmore.dk/blog/økonomisk-planlægning"
]

def get_known_moneypenny_articles():
    """Return list of known Moneypenny blog article URLs"""
    return KNOWN_MONEYPENNY_ARTICLES.copy()

def add_known_articles_to_links(links, base_url):
    """Add known articles to links list if no blog links were found"""
    if not links and 'moneypennyandmore.dk' in base_url:
        print("Adding known Moneypenny articles as fallback...")
        for article_url in KNOWN_MONEYPENNY_ARTICLES:
            if article_url not in links:
                links.append(article_url)
                print(f"Added known Moneypenny article: {article_url}")
    return links 