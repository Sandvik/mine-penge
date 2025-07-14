#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mine Penge Master Update Script - Real-time Version
Kører alle scrapeers og tagging i korrekt rækkefølge med real-time output
"""

import os
import sys
import subprocess
import json
import logging
from datetime import datetime
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DataUpdater:
    """Master script til at opdatere alt data i korrekt rækkefølge"""
    
    def __init__(self):
        self.data_dir = "data"
        self.tagged_dir = os.path.join(self.data_dir, "tagged")
        self.scrapers_dir = "scrapers"
        self.tagging_dir = "tagging"
        
        # Liste over alle scraper scripts i korrekt rækkefølge
        self.scraper_scripts = [
            "scraperMoneypenny.py",
            "scraperNordNet.py", 
            "scraperBudgetNoerd.py",
            "scraperUngMedPenge.py",
            "scraperMitteldorfDK.py"
        ]
        
        # Opret nødvendige mapper
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.tagged_dir, exist_ok=True)
    
    def run_scraper_realtime(self, script_name):
        """Kører en enkelt scraper script med real-time output"""
        script_path = os.path.join(self.scrapers_dir, script_name)
        
        if not os.path.exists(script_path):
            logger.error(f"Scraper script not found: {script_path}")
            return False
        
        print(f"\nStarting {script_name}...")
        print("=" * 50)
        
        try:
            # Kør script med real-time output
            process = subprocess.Popen(
                [sys.executable, script_path],
                stdout=None,  # Brug terminal stdout direkte
                stderr=None,  # Brug terminal stderr direkte
                cwd=os.getcwd()
            )
            
            # Vent på at processen er færdig
            return_code = process.wait()
            
            if return_code == 0:
                print(f"✅ {script_name} completed successfully")
                return True
            else:
                print(f"❌ {script_name} failed with exit code {return_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error running {script_name}: {e}")
            return False
    
    def run_all_scrapers(self):
        """Kører alle scraper scripts i rækkefølge"""
        print("🚀 Starting update of all blog data...")
        print("=" * 60)
        
        success_count = 0
        failed_scrapers = []
        
        for script in self.scraper_scripts:
            if self.run_scraper_realtime(script):
                success_count += 1
            else:
                failed_scrapers.append(script)
        
        print("=" * 60)
        print(f"📊 Scraping result: {success_count}/{len(self.scraper_scripts)} successful")
        
        if failed_scrapers:
            print(f"⚠️ Failed scrapers: {', '.join(failed_scrapers)}")
        
        return len(failed_scrapers) == 0
    
    def run_tagging_realtime(self):
        """Kører content tagging med real-time output"""
        print("\n🏷️ Starting automatic tagging...")
        print("=" * 50)
        
        tagging_script = os.path.join(self.tagging_dir, "content_tagger.py")
        
        if not os.path.exists(tagging_script):
            print(f"Tagging script not found: {tagging_script}")
            return False
        
        try:
            # Kør tagging script med real-time output
            process = subprocess.Popen(
                [sys.executable, tagging_script],
                stdout=None,  # Brug terminal stdout direkte
                stderr=None,  # Brug terminal stderr direkte
                cwd=os.getcwd()
            )
            
            # Vent på at processen er færdig
            return_code = process.wait()
            
            if return_code == 0:
                print("✅ Tagging completed successfully")
                return True
            else:
                print(f"❌ Tagging failed with exit code {return_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error running tagging: {e}")
            return False
    
    def check_for_duplicates(self):
        """Tjekker for dubletter i JSON filer"""
        print("\n🔍 Checking for duplicates...")
        
        duplicate_found = False
        
        for filename in os.listdir(self.data_dir):
            if filename.endswith('.json') and not filename.startswith('tagged_'):
                filepath = os.path.join(self.data_dir, filename)
                
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    
                    if 'blog_posts' in data:
                        urls = [post.get('url', '') for post in data['blog_posts']]
                        unique_urls = set(urls)
                        
                        if len(urls) != len(unique_urls):
                            duplicates = len(urls) - len(unique_urls)
                            print(f"⚠️ {filename}: {duplicates} duplicates found")
                            duplicate_found = True
                        else:
                            print(f"✅ {filename}: No duplicates")
                            
                except Exception as e:
                    print(f"❌ Error checking {filename}: {e}")
        
        return not duplicate_found
    
    def generate_summary_report(self):
        """Genererer en samlet rapport over opdateringen"""
        print("\n📊 Generating summary report...")
        
        report = {
            "update_timestamp": datetime.now().isoformat(),
            "scrapers_run": self.scraper_scripts,
            "files_updated": [],
            "tagged_files": [],
            "total_articles": 0
        }
        
        # Tæl artikler i rå JSON filer
        for filename in os.listdir(self.data_dir):
            if filename.endswith('.json') and not filename.startswith('tagged_'):
                filepath = os.path.join(self.data_dir, filename)
                
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    
                    if 'blog_posts' in data:
                        article_count = len(data['blog_posts'])
                        report["files_updated"].append({
                            "filename": filename,
                            "articles": article_count
                        })
                        report["total_articles"] += article_count
                        
                except Exception as e:
                    print(f"Error reading {filename}: {e}")
        
        # Tæl taggede filer
        for filename in os.listdir(self.tagged_dir):
            if filename.startswith('tagged_') and filename.endswith('.json'):
                report["tagged_files"].append(filename)
        
        # Gem rapport
        report_file = os.path.join(self.tagged_dir, "update_report.json")
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"📄 Report saved: {report_file}")
        return report
    
    def run_full_update(self):
        """Kører komplet opdatering af alt data"""
        print("🚀 MINE PENGE DATA UPDATER - REAL-TIME VERSION")
        print("=" * 60)
        print("This script will:")
        print("1. Run all scraper scripts in correct order")
        print("2. Check for duplicates in data")
        print("3. Run automatic tagging on all JSON files")
        print("4. Generate a summary report")
        print("=" * 60)
        
        # Trin 1: Kør alle scrapers
        if not self.run_all_scrapers():
            print("❌ Some scrapers failed - stopping update")
            return False
        
        # Trin 2: Tjek for dubletter
        if not self.check_for_duplicates():
            print("⚠️ Duplicates found - continuing anyway")
        
        # Trin 3: Kør tagging
        if not self.run_tagging_realtime():
            print("❌ Tagging failed")
            return False
        
        # Trin 4: Generer rapport
        report = self.generate_summary_report()
        
        # Print sammendrag
        print("\n✅ UPDATE COMPLETE!")
        print("=" * 60)
        print(f"📊 Total articles updated: {report['total_articles']}")
        print(f"📁 JSON files updated: {len(report['files_updated'])}")
        print(f"🏷️ Tagged files: {len(report['tagged_files'])}")
        print(f"📄 Report saved: data/tagged/update_report.json")
        
        print(f"\n📋 Details:")
        for file_info in report['files_updated']:
            print(f"  - {file_info['filename']}: {file_info['articles']} articles")
        
        return True

def main():
    """Hovedfunktion"""
    updater = DataUpdater()
    success = updater.run_full_update()
    
    if success:
        print("\n🎉 All data is now updated and ready for use!")
        
        # Kør build_articles.py for at samle alle artikler
        print("\n🔨 Running build_articles.py to compile all articles...")
        try:
            build_script = os.path.join(os.path.dirname(__file__), "build_articles.py")
            result = subprocess.run([sys.executable, build_script], check=True)
            print("✅ Compiled articles.json is now updated!")
        except subprocess.CalledProcessError as e:
            print(f"❌ Error running build_articles.py: {e}")
        except Exception as e:
            print(f"❌ Unexpected error during build: {e}")
    else:
        print("\n❌ Update failed - check logs above")
        sys.exit(1)

if __name__ == "__main__":
    main() 