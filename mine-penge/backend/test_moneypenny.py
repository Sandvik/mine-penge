#!/usr/bin/env python3
"""
Test script for Moneypenny and More scraper configuration
"""

import asyncio
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scraper import ArticleScraper

async def test_moneypenny_scraper():
    """Test the Moneypenny and More scraper configuration"""
    print("🧪 Testing Moneypenny and More scraper configuration...")
    
    scraper = ArticleScraper()
    
    # Check if moneypennyandmore.dk is in sources
    if 'moneypennyandmore.dk' not in scraper.sources:
        print("❌ moneypennyandmore.dk not found in sources!")
        return False
    
    print(f"✅ moneypennyandmore.dk found in sources")
    print(f"📋 Configuration: {scraper.sources['moneypennyandmore.dk']}")
    
    # Test URL extraction
    print("\n🔍 Testing URL extraction...")
    try:
        import requests
        from bs4 import BeautifulSoup
        
        # Get the blog page
        url = "https://moneypennyandmore.dk/blog"
        response = requests.get(url, verify=False, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract links using our configuration
        links = scraper.extract_article_links(soup, scraper.sources['moneypennyandmore.dk'])
        
        print(f"📊 Found {len(links)} potential article links")
        
        # Filter for actual blog article links
        blog_links = [link for link in links if '/blog/' in link and 'moneypennyandmore.dk' in link]
        print(f"📝 Found {len(blog_links)} blog article links")
        
        if blog_links:
            print("✅ Blog links found:")
            for i, link in enumerate(blog_links[:5]):  # Show first 5
                print(f"   {i+1}. {link}")
            if len(blog_links) > 5:
                print(f"   ... and {len(blog_links) - 5} more")
        else:
            print("❌ No blog links found")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Error testing URL extraction: {e}")
        return False

async def test_article_processing():
    """Test processing a single Moneypenny article"""
    print("\n📄 Testing article processing...")
    
    scraper = ArticleScraper()
    
    # Test with a known article URL
    test_url = "https://moneypennyandmore.dk/blog/de-naeste-skridt-de-forste-penge-pa-nordnet"
    
    try:
        article_data = await scraper.process_article(test_url, 'moneypennyandmore.dk')
        
        if article_data:
            print("✅ Article processed successfully!")
            print(f"📰 Title: {article_data.get('title', 'N/A')}")
            print(f"🏷️ Tags: {article_data.get('tags', [])}")
            print(f"📊 Relevance score: {article_data.get('relevance_score', 0)}")
            print(f"👥 Audience: {article_data.get('audience', 'N/A')}")
            print(f"📈 Difficulty: {article_data.get('difficulty', 'N/A')}")
            return True
        else:
            print("❌ Article processing failed")
            return False
            
    except Exception as e:
        print(f"❌ Error processing article: {e}")
        return False

async def main():
    """Run all tests"""
    print("🚀 Starting Moneypenny and More scraper tests...\n")
    
    # Test 1: Configuration
    config_ok = await test_moneypenny_scraper()
    
    # Test 2: Article processing
    processing_ok = await test_article_processing()
    
    print("\n" + "="*50)
    print("📋 TEST RESULTS:")
    print(f"Configuration: {'✅ PASS' if config_ok else '❌ FAIL'}")
    print(f"Article Processing: {'✅ PASS' if processing_ok else '❌ FAIL'}")
    
    if config_ok and processing_ok:
        print("\n🎉 All tests passed! Moneypenny scraper should work correctly.")
    else:
        print("\n⚠️ Some tests failed. Check the configuration.")

if __name__ == "__main__":
    asyncio.run(main()) 