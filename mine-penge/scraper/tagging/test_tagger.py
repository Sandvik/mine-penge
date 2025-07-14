#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test script for Mine Penge Content Tagger
Tester tagging systemet på en enkelt fil
"""

import json
import os
from content_tagger import ContentTagger

def test_single_file():
    """Test tagging på en enkelt fil"""
    print("Tester Mine Penge Content Tagger")
    print("=" * 40)
    
    # Find første JSON fil i data mappen
    data_dir = "data"
    json_files = []
    
    for filename in os.listdir(data_dir):
        if filename.endswith('.json') and not filename.startswith('tagged_'):
            filepath = os.path.join(data_dir, filename)
            json_files.append(filepath)
    
    if not json_files:
        print("Ingen JSON filer fundet i data/ mappen!")
        return
    
    # Test på første fil
    test_file = json_files[0]
    print(f"Tester på: {os.path.basename(test_file)}")
    
    # Opret tagger
    tagger = ContentTagger()
    
    # Læs original fil
    with open(test_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Tag første artikel som eksempel
    if data.get('blog_posts'):
        first_article = data['blog_posts'][0]
        print(f"\nTagger artikel: {first_article.get('title', '')[:60]}...")
        
        tagged_article = tagger.tag_article(first_article)
        
        # Vis resultater
        print(f"\nTAGGING RESULTATER:")
        print(f"Article ID: {tagged_article['article_id']}")
        print(f"Kompleksitet: {tagged_article['complexity_level']}")
        print(f"Målgrupper: {', '.join(tagged_article['target_audiences'])}")
        print(f"Tags: {', '.join(tagged_article['minepenge_tags'])}")
        print(f"Kategorier: {', '.join(tagged_article['tag_categories'])}")
        
        print(f"\nConfidence Scores:")
        for audience, score in tagged_article['confidence_scores'].items():
            if score > 0.1:  # Vis kun relevante scores
                print(f"  - {audience}: {score}")
        
        # Gem test resultat
        test_output = {
            "test_info": {
                "original_file": os.path.basename(test_file),
                "test_date": "2025-07-04T21:15:00",
                "article_title": first_article.get('title', '')
            },
            "tagged_article": tagged_article
        }
        
        test_filepath = os.path.join("data", "tagged", "test_result.json")
        os.makedirs(os.path.dirname(test_filepath), exist_ok=True)
        
        with open(test_filepath, 'w', encoding='utf-8') as f:
            json.dump(test_output, f, ensure_ascii=False, indent=2)
        
        print(f"\nTest resultat gemt: {test_filepath}")
        
    else:
        print("Ingen artikler fundet i filen!")

if __name__ == "__main__":
    test_single_file() 