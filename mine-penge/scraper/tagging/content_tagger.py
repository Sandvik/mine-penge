#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mine Penge Content Tagger
Automatisk kategorisering og tagging af danske økonomiblog artikler
"""

import json
import os
import re
from datetime import datetime
from collections import Counter
import hashlib
from typing import Dict, List, Tuple, Any
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ContentTagger:
    """Automatisk kategorisering og tagging af økonomiblog artikler"""
    
    def __init__(self, config_file: str = "tag_config.json"):
        """Initialiserer tagger med konfiguration fra fil"""
        self.config_file = config_file
        self.config = self.load_config()
        
    def load_config(self):
        """Indlæser konfiguration fra JSON fil"""
        try:
            with open(self.config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            self.tag_categories = config.get('tag_categories', {})
            self.target_audiences = config.get('target_audiences', {})
            self.complexity_indicators = config.get('complexity_indicators', {})
            self.technical_terms = config.get('technical_terms', [])
            self.settings = config.get('settings', {})
            
            logger.info(f"Konfiguration indlæst fra {self.config_file}")
            
        except FileNotFoundError:
            logger.warning(f"Konfigurationsfil {self.config_file} ikke fundet, bruger standardindstillinger")
            self._load_default_config()
        except Exception as e:
            logger.error(f"Fejl ved indlæsning af konfiguration: {e}")
            self._load_default_config()
    
    def _load_default_config(self):
        """Indlæser standardkonfiguration hvis fil ikke findes"""
        self.tag_categories = {
            "Bolig & Ejendom": ["bolig", "huskøb", "lejebolig", "ejendomsmægler", "ejendom", "boligmarked", "husleje"],
            "Investering & Aktier": ["investering", "fonde", "aktiesparekonto", "danske aktier", "aktier", "etf", "reit", "udbytte", "portefølje"],
            "Pension": ["pension", "pensionstyper", "aldersopsparing", "ratepension", "livrente", "pensionsopsparing"],
            "SU & Studerende": ["su", "studielån", "studerende", "universitet", "uddannelse", "studie", "stipendium"],
            "Gæld & Lån": ["gæld", "boliglån", "forbrugslån", "lån", "rente", "afdrag", "gældsrådgivning"],
            "Opsparing": ["opsparing", "børneopsparing", "spare", "opsparingskonto", "renteopsparing"],
            "Bank & Betaling": ["bank", "kort", "mobilepay", "netbank", "betaling", "overførsel"],
            "Skat & Fradrag": ["skat", "fradrag", "skattefradrag", "skattepligtig", "skattefri"],
            "Rente": ["renter", "nationalbank", "styrerente", "rentesats", "renteudvikling"],
            "Forbrug": ["forbrug", "sparertips", "budget", "forbrugsvarer", "pris"],
            "Forsikring": ["forsikring", "forsikringstyper", "ansvarsforsikring", "ulykkesforsikring"],
            "Rådgivning": ["rådgivning", "budget", "undervisning", "tips", "råd", "guide"],
            "Familieøkonomi": ["familieøkonomi", "madspild", "familie", "børn", "husholdning"],
            "Erhverv": ["erhverv", "løn", "job", "karriere", "arbejde", "indkomst"],
            "Krypto": ["krypto", "råvarer", "bitcoin", "blockchain", "kryptovaluta"],
            "Pensionist": ["pensionist", "senior", "ældre", "pensionering"],
            "Problemer": ["økonomisk kriminalitet", "økonomiske problemer", "gældsproblemer", "økonomisk stress"]
        }
        
        self.target_audiences = {
            "studerende": ["su", "studielån", "studerende", "universitet", "billig", "spare", "budget"],
            "børnefamilier": ["børn", "familie", "børneopsparing", "familieøkonomi", "husholdning"],
            "budgetbevidste": ["billig", "spare", "budget", "gæld", "rådgivning", "grundlæggende"],
            "nybegynder_investering": ["begynder", "første gang", "grundlæggende", "investering", "aktiesparekonto", "etf"],
            "økonomi_nybegynder": ["budget", "opsparing", "grundlæggende", "tips", "guide", "råd"],
            "pensionister": ["pension", "pensionist", "senior", "aldersopsparing", "livrente"]
        }
        
        self.complexity_indicators = {
            "begynder": ["grundlæggende", "første gang", "begynder", "simpel", "let", "guide", "tips"],
            "avanceret": ["avanceret", "kompleks", "ekspert", "professionel", "sophistikeret", "tekniske termer"]
        }
        
        self.technical_terms = ["volatilitet", "diversificering", "korrelation", "beta", "alfa", "sharpe ratio", 
                               "derivater", "optioner", "futures", "arbitrage", "hedging"]
        
        self.settings = {
            "confidence_threshold": 0.3,
            "max_tags_per_article": 10,
            "max_audiences_per_article": 3,
            "min_word_count": 50
        }

    def generate_article_id(self, url: str, title: str) -> str:
        """Genererer unikt ID for artikel"""
        content = f"{url}{title}"
        return hashlib.md5(content.encode()).hexdigest()[:12]

    def analyze_text_complexity(self, text: str) -> str:
        """Analyserer tekst kompleksitet"""
        text_lower = text.lower()
        
        # Tæl tekniske termer og komplekse ord
        technical_count = sum(1 for term in self.technical_terms if term in text_lower)
        
        # Tæl sætninger og ord
        sentences = len(re.split(r'[.!?]+', text))
        words = len(text.split())
        
        if sentences > 0:
            avg_words_per_sentence = words / sentences
        else:
            avg_words_per_sentence = 0
        
        # Vurder kompleksitet
        if technical_count > 3 or avg_words_per_sentence > 25:
            return "avanceret"
        elif technical_count > 1 or avg_words_per_sentence > 20:
            return "mellem"
        else:
            return "begynder"

    def find_matching_tags(self, text: str) -> List[str]:
        """Finder matchende tags baseret på tekstindhold"""
        text_lower = text.lower()
        matched_tags = []
        
        for category, tags in self.tag_categories.items():
            for tag in tags:
                if tag.lower() in text_lower:
                    matched_tags.append(tag)
        
        # Fjern duplikater og begræns antal tags
        unique_tags = list(set(matched_tags))
        max_tags = self.settings.get("max_tags_per_article", 10)
        
        if len(unique_tags) > max_tags:
            # Prioriter tags baseret på frekvens i teksten
            tag_counts = {}
            for tag in unique_tags:
                tag_counts[tag] = text_lower.count(tag.lower())
            
            # Sorter efter frekvens og tag de mest frekvente
            sorted_tags = sorted(unique_tags, key=lambda x: tag_counts[x], reverse=True)
            unique_tags = sorted_tags[:max_tags]
        
        return unique_tags

    def get_tag_categories(self, tags: List[str]) -> List[str]:
        """Mapper tags til deres kategorier"""
        categories = []
        for tag in tags:
            for category, category_tags in self.tag_categories.items():
                if tag in category_tags:
                    categories.append(category)
        return list(set(categories))

    def calculate_audience_confidence(self, text: str) -> Dict[str, float]:
        """Beregner confidence scores for forskellige målgrupper"""
        text_lower = text.lower()
        confidence_scores = {}
        
        for audience, keywords in self.target_audiences.items():
            matches = sum(1 for keyword in keywords if keyword.lower() in text_lower)
            # Normaliser score baseret på antal keywords i kategorien
            confidence = min(1.0, matches / len(keywords) * 2)  # Skaler op for bedre scores
            confidence_scores[audience] = round(confidence, 2)
        
        return confidence_scores

    def determine_target_audiences(self, confidence_scores: Dict[str, float], threshold: float = None) -> List[str]:
        """Bestemmer målgrupper baseret på confidence scores"""
        if threshold is None:
            threshold = self.settings.get("confidence_threshold", 0.3)
        
        audiences = []
        for audience, score in confidence_scores.items():
            if score >= threshold:
                audiences.append(audience)
        
        # Begræns antal målgrupper
        max_audiences = self.settings.get("max_audiences_per_article", 3)
        if len(audiences) > max_audiences:
            # Vælg de målgrupper med højeste scores
            sorted_audiences = sorted(audiences, key=lambda x: confidence_scores[x], reverse=True)
            audiences = sorted_audiences[:max_audiences]
        
        return audiences

    def tag_article(self, article: Dict[str, Any]) -> Dict[str, Any]:
        """Tagger en enkelt artikel"""
        # Kombiner titel, summary og content til analyse
        full_text = f"{article.get('title', '')} {article.get('summary', '')} {article.get('content', '')}"
        
        # Generer artikel ID
        article_id = self.generate_article_id(article.get('url', ''), article.get('title', ''))
        
        # Find matchende tags
        minepenge_tags = self.find_matching_tags(full_text)
        
        # Bestem tag kategorier
        tag_categories = self.get_tag_categories(minepenge_tags)
        
        # Analyser kompleksitet
        complexity_level = self.analyze_text_complexity(full_text)
        
        # Beregn audience confidence scores
        confidence_scores = self.calculate_audience_confidence(full_text)
        
        # Bestem målgrupper
        target_audiences = self.determine_target_audiences(confidence_scores)
        
        # Opret tagged artikel
        tagged_article = {
            "article_id": article_id,
            "title": article.get('title', ''),
            "source": article.get('source', ''),
            "url": article.get('url', ''),
            "summary": article.get('summary', ''),
            "target_audiences": target_audiences,
            "complexity_level": complexity_level,
            "minepenge_tags": minepenge_tags,
            "tag_categories": tag_categories,
            "confidence_scores": confidence_scores,
            "original_data": {
                "summary": article.get('summary', ''),
                "content": article.get('content', ''),
                "author": article.get('author', ''),
                "date_published": article.get('date_published', ''),
                "word_count": article.get('word_count', 0),
                "categories": article.get('categories', [])
            },
            "tagged_at": datetime.now().isoformat()
        }
        
        return tagged_article

    def process_json_file(self, filepath: str) -> str:
        """Behandler en JSON fil og returnerer sti til den taggede fil"""
        logger.info(f"Behandler {filepath}")
        
        # Læs original JSON fil
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Tag alle artikler - håndter forskellige JSON strukturer
        tagged_articles = []
        
        # Prøv forskellige mulige nøgler for artikler
        articles = data.get('blog_posts', []) or data.get('articles', []) or data.get('posts', [])
        total_articles = len(articles)
        
        logger.info(f"Fandt {total_articles} artikler i {filepath}")
        if total_articles == 0:
            logger.warning(f"Ingen artikler fundet i {filepath}. Tilgængelige nøgler: {list(data.keys())}")
        
        for i, article in enumerate(articles, 1):
            logger.info(f"Tagger artikel {i}/{total_articles}: {article.get('title', '')[:50]}...")
            tagged_article = self.tag_article(article)
            tagged_articles.append(tagged_article)
        
        # Opret ny struktur
        tagged_data = {
            "metadata": {
                "original_file": os.path.basename(filepath),
                "total_articles": len(tagged_articles),
                "tagged_at": datetime.now().isoformat(),
                "tag_categories_used": list(self.tag_categories.keys()),
                "target_audiences_used": list(self.target_audiences.keys()),
                "articles_found": total_articles
            },
            "articles": tagged_articles
        }
        
        # Gem tagged fil
        filename = os.path.basename(filepath)
        tagged_filename = f"tagged_{filename}"
        tagged_filepath = os.path.join("data", "tagged", tagged_filename)
        
        # Opret tagged mappe hvis den ikke findes
        os.makedirs(os.path.dirname(tagged_filepath), exist_ok=True)
        
        with open(tagged_filepath, 'w', encoding='utf-8') as f:
            json.dump(tagged_data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Tagged fil gemt: {tagged_filepath}")
        return tagged_filepath

    def process_all_files(self) -> List[str]:
        """Behandler alle JSON filer i data mappen"""
        data_dir = "data"
        json_files = []
        
        # Find alle JSON filer (undtagen dem i tagged mappen)
        for filename in os.listdir(data_dir):
            if filename.endswith('.json') and not filename.startswith('tagged_'):
                filepath = os.path.join(data_dir, filename)
                json_files.append(filepath)
        
        logger.info(f"Fandt {len(json_files)} JSON filer at behandle")
        
        tagged_files = []
        for filepath in json_files:
            try:
                tagged_file = self.process_json_file(filepath)
                tagged_files.append(tagged_file)
            except Exception as e:
                logger.error(f"Fejl ved behandling af {filepath}: {e}")
        
        return tagged_files

    def generate_summary_report(self, tagged_files: List[str]) -> Dict[str, Any]:
        """Genererer en samlet rapport over tagging processen"""
        total_articles = 0
        tag_statistics = Counter()
        audience_statistics = Counter()
        complexity_statistics = Counter()
        
        for tagged_file in tagged_files:
            with open(tagged_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            total_articles += len(data.get('articles', []))
            
            for article in data.get('articles', []):
                # Tæl tags
                for tag in article.get('minepenge_tags', []):
                    tag_statistics[tag] += 1
                
                # Tæl målgrupper
                for audience in article.get('target_audiences', []):
                    audience_statistics[audience] += 1
                
                # Tæl kompleksitetsniveauer
                complexity = article.get('complexity_level', 'ukendt')
                complexity_statistics[complexity] += 1
        
        return {
            "summary": {
                "total_files_processed": len(tagged_files),
                "total_articles_tagged": total_articles,
                "processing_date": datetime.now().isoformat()
            },
            "tag_statistics": dict(tag_statistics.most_common(20)),
            "audience_statistics": dict(audience_statistics),
            "complexity_statistics": dict(complexity_statistics),
            "tagged_files": tagged_files
        }

def main():
    """Hovedfunktion"""
    print("Starter Mine Penge Content Tagger")
    print("=" * 50)
    
    tagger = ContentTagger()
    
    # Behandl alle filer
    tagged_files = tagger.process_all_files()
    
    if tagged_files:
        # Generer rapport
        report = tagger.generate_summary_report(tagged_files)
        
        # Gem rapport
        report_filepath = os.path.join("data", "tagged", "tagging_report.json")
        with open(report_filepath, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        # Print sammendrag
        print("\nTAGGING FÆRDIG!")
        print("=" * 50)
        print(f"Behandlet filer: {report['summary']['total_files_processed']}")
        print(f"Taggede artikler: {report['summary']['total_articles_tagged']}")
        print(f"Taggede filer gemt i: data/tagged/")
        print(f"Rapport gemt: {report_filepath}")
        
        print(f"\nKompleksitetsfordeling:")
        for level, count in report['complexity_statistics'].items():
            print(f"  - {level}: {count} artikler")
        
        print(f"\nTop målgrupper:")
        for audience, count in report['audience_statistics'].items():
            print(f"  - {audience}: {count} artikler")
        
        print(f"\nTop tags:")
        for tag, count in list(report['tag_statistics'].items())[:10]:
            print(f"  - {tag}: {count} artikler")
        
    else:
        print("Ingen filer blev behandlet!")

if __name__ == "__main__":
    main() 