#!/usr/bin/env python3
"""
Debug script to examine Moneypenny and More's HTML structure
"""

import requests
from bs4 import BeautifulSoup
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def debug_moneypenny_structure():
    """Debug Moneypenny and More's HTML structure"""
    print("🔍 Debugging Moneypenny and More HTML structure...")
    
    try:
        # Get the blog page
        url = "https://moneypennyandmore.dk/blog"
        response = requests.get(url, verify=False, timeout=10)
        
        if response.status_code != 200:
            print(f"❌ Failed to get page: {response.status_code}")
            return
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print(f"✅ Got page: {url}")
        print(f"📄 Page title: {soup.title.string if soup.title else 'No title'}")
        
        # Look for all links
        all_links = soup.find_all('a', href=True)
        print(f"\n🔗 Found {len(all_links)} total links")
        
        # Look for blog-related links
        blog_links = []
        for link in all_links:
            href = link.get('href', '')
            if 'blog' in href.lower():
                blog_links.append({
                    'href': href,
                    'text': link.get_text(strip=True)[:50],
                    'class': link.get('class', []),
                    'id': link.get('id', '')
                })
        
        print(f"\n📝 Found {len(blog_links)} blog-related links:")
        for i, link in enumerate(blog_links[:10]):  # Show first 10
            print(f"   {i+1}. {link['href']}")
            print(f"      Text: {link['text']}")
            print(f"      Class: {link['class']}")
            print(f"      ID: {link['id']}")
            print()
        
        # Look for specific patterns
        print("🔍 Looking for specific patterns...")
        
        # Check for links with /blog/ in href
        blog_slash_links = soup.find_all('a', href=lambda x: x and '/blog/' in x)
        print(f"   Links with '/blog/': {len(blog_slash_links)}")
        
        # Check for links with 'blog' anywhere in href
        blog_anywhere_links = soup.find_all('a', href=lambda x: x and 'blog' in x.lower())
        print(f"   Links with 'blog' anywhere: {len(blog_anywhere_links)}")
        
        # Check for links in specific containers
        containers = ['article', '.blog', '.post', '.entry', '.content', '.main']
        for container in containers:
            elements = soup.select(container)
            print(f"   Elements matching '{container}': {len(elements)}")
            if elements:
                links_in_container = elements[0].find_all('a', href=True)
                print(f"     Links in first '{container}': {len(links_in_container)}")
        
        # Look for any divs or sections that might contain blog posts
        print("\n🏗️ Looking for potential blog containers...")
        potential_containers = soup.find_all(['div', 'section', 'article'], class_=True)
        for container in potential_containers[:5]:  # Check first 5
            classes = container.get('class', [])
            if any('blog' in cls.lower() or 'post' in cls.lower() or 'article' in cls.lower() for cls in classes):
                print(f"   Found container with classes: {classes}")
                links_in_container = container.find_all('a', href=True)
                print(f"     Links in container: {len(links_in_container)}")
                for link in links_in_container[:3]:
                    print(f"       - {link.get('href')} ({link.get_text(strip=True)[:30]})")
        
        # Check the page structure
        print("\n📋 Page structure analysis:")
        main_content = soup.find('main') or soup.find(class_='main') or soup.find(class_='content')
        if main_content:
            print("   Found main content area")
            main_links = main_content.find_all('a', href=True)
            print(f"   Links in main content: {len(main_links)}")
            blog_main_links = [link for link in main_links if 'blog' in link.get('href', '').lower()]
            print(f"   Blog links in main content: {len(blog_main_links)}")
        else:
            print("   No main content area found")
        
        # Look for any JavaScript that might load content dynamically
        scripts = soup.find_all('script')
        print(f"\n📜 Found {len(scripts)} script tags")
        
        # Check for any data attributes that might contain URLs
        data_links = soup.find_all(attrs={'data-url': True})
        print(f"   Elements with data-url: {len(data_links)}")
        
        data_href_links = soup.find_all(attrs={'data-href': True})
        print(f"   Elements with data-href: {len(data_href_links)}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_moneypenny_structure() 