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
            logger.error(f"Scraper script ikke fundet: {script_path}")
            return False
        
        print(f"\n🔄 Kører {script_name}...")
        print("=" * 50)
        
        try:
            # Kør script med real-time output
            process = subprocess.Popen(
                [sys.executable, script_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True,
                cwd=os.getcwd()
            )
            
            # Print output i real-time
            while True:
                output = process.stdout.readline()
                if output == '' and process.poll() is not None:
                    break
                if output:
                    print(output.strip())
            
            # Vent på at processen er færdig
            return_code = process.poll()
            
            if return_code == 0:
                print(f"✅ {script_name} kørt succesfuldt")
                return True
            else:
                print(f"❌ {script_name} fejlede med exit code {return_code}")
                return False
                
        except Exception as e:
            print(f"❌ Fejl ved kørsel af {script_name}: {e}")
            return False
    
    def run_all_scrapers(self):
        """Kører alle scraper scripts i rækkefølge"""
        print("🚀 Starter opdatering af alle blog data...")
        print("=" * 60)
        
        success_count = 0
        failed_scrapers = []
        
        for script in self.scraper_scripts:
            if self.run_scraper_realtime(script):
                success_count += 1
            else:
                failed_scrapers.append(script)
        
        print("=" * 60)
        print(f"📊 Scraping resultat: {success_count}/{len(self.scraper_scripts)} succesfulde")
        
        if failed_scrapers:
            print(f"⚠️ Fejlede scrapers: {', '.join(failed_scrapers)}")
        
        return len(failed_scrapers) == 0
    
    def run_tagging_realtime(self):
        """Kører content tagging med real-time output"""
        print("\n🏷️ Starter automatisk tagging...")
        print("=" * 50)
        
        tagging_script = os.path.join(self.tagging_dir, "content_tagger.py")
        
        if not os.path.exists(tagging_script):
            print(f"Tagging script ikke fundet: {tagging_script}")
            return False
        
        try:
            # Kør tagging script med real-time output
            process = subprocess.Popen(
                [sys.executable, tagging_script],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True,
                cwd=os.getcwd()
            )
            
            # Print output i real-time
            while True:
                output = process.stdout.readline()
                if output == '' and process.poll() is not None:
                    break
                if output:
                    print(output.strip())
            
            # Vent på at processen er færdig
            return_code = process.poll()
            
            if return_code == 0:
                print("✅ Tagging kørt succesfuldt")
                return True
            else:
                print(f"❌ Tagging fejlede med exit code {return_code}")
                return False
                
        except Exception as e:
            print(f"❌ Fejl ved kørsel af tagging: {e}")
            return False
    
    def check_for_duplicates(self):
        """Tjekker for dubletter i JSON filer"""
        print("\n🔍 Tjekker for dubletter...")
        
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
                            print(f"⚠️ {filename}: {duplicates} dubletter fundet")
                            duplicate_found = True
                        else:
                            print(f"✅ {filename}: Ingen dubletter")
                            
                except Exception as e:
                    print(f"❌ Fejl ved tjek af {filename}: {e}")
        
        return not duplicate_found
    
    def generate_summary_report(self):
        """Genererer en samlet rapport over opdateringen"""
        print("\n📊 Genererer samlet rapport...")
        
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
                    print(f"Fejl ved læsning af {filename}: {e}")
        
        # Tæl taggede filer
        for filename in os.listdir(self.tagged_dir):
            if filename.startswith('tagged_') and filename.endswith('.json'):
                report["tagged_files"].append(filename)
        
        # Gem rapport
        report_file = os.path.join(self.tagged_dir, "update_report.json")
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"📄 Rapport gemt: {report_file}")
        return report
    
    def run_full_update(self):
        """Kører komplet opdatering af alt data"""
        print("🚀 MINE PENGE DATA UPDATER - REAL-TIME VERSION")
        print("=" * 60)
        print("Dette script vil:")
        print("1. Køre alle scraper scripts i korrekt rækkefølge")
        print("2. Tjekke for dubletter i data")
        print("3. Køre automatisk tagging på alle JSON filer")
        print("4. Generere en samlet rapport")
        print("=" * 60)
        
        # Trin 1: Kør alle scrapers
        if not self.run_all_scrapers():
            print("❌ Nogle scrapers fejlede - stopper opdatering")
            return False
        
        # Trin 2: Tjek for dubletter
        if not self.check_for_duplicates():
            print("⚠️ Dubletter fundet - fortsætter alligevel")
        
        # Trin 3: Kør tagging
        if not self.run_tagging_realtime():
            print("❌ Tagging fejlede")
            return False
        
        # Trin 4: Generer rapport
        report = self.generate_summary_report()
        
        # Print sammendrag
        print("\n✅ OPDATERING FÆRDIG!")
        print("=" * 60)
        print(f"📊 Total artikler opdateret: {report['total_articles']}")
        print(f"📁 JSON filer opdateret: {len(report['files_updated'])}")
        print(f"🏷️ Taggede filer: {len(report['tagged_files'])}")
        print(f"📄 Rapport gemt: data/tagged/update_report.json")
        
        print(f"\n📋 Detaljer:")
        for file_info in report['files_updated']:
            print(f"  - {file_info['filename']}: {file_info['articles']} artikler")
        
        return True

def main():
    """Hovedfunktion"""
    updater = DataUpdater()
    success = updater.run_full_update()
    
    if success:
        print("\n🎉 Alt data er nu opdateret og klar til brug!")
        
        # Kør build_articles.py for at samle alle artikler
        print("\n🔨 Kører build_articles.py for at samle alle artikler...")
        try:
            build_script = os.path.join(os.path.dirname(__file__), "build_articles.py")
            result = subprocess.run([sys.executable, build_script], check=True)
            print("✅ Samlet articles.json er nu opdateret!")
        except subprocess.CalledProcessError as e:
            print(f"❌ Fejl ved kørsel af build_articles.py: {e}")
        except Exception as e:
            print(f"❌ Uventet fejl ved build: {e}")
    else:
        print("\n❌ Opdatering fejlede - tjek loggene ovenfor")
        sys.exit(1)

if __name__ == "__main__":
    main() 