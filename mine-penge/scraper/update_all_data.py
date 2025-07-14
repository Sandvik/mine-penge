#!/usr/bin/env python3
"""
MinePenge Data Updater
Kører alle scraper scripts og samler data i articles.json
"""

import os
import sys
import json
import subprocess
import logging
from datetime import datetime
from pathlib import Path

# Opsætning af logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DataUpdater:
    """Håndterer opdatering af alt data for MinePenge platformen"""
    
    def __init__(self):
        self.scraper_dir = os.path.dirname(__file__)
        self.data_dir = os.path.join(self.scraper_dir, "data")
        self.tagged_dir = os.path.join(self.scraper_dir, "data", "tagged")
        
        # Liste over alle scraper scripts i korrekt rækkefølge
        self.scraper_scripts = [
            "scraperMoneypenny.py",
            "scraperNordNet.py", 
            "scraperBudgetNoerd.py",
            "scraperUngMedPenge.py",
            "scraperMitteldorfDK.py",
            "scraperTaenk.py"
        ]
        
        # Opret nødvendige mapper
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.tagged_dir, exist_ok=True)

    def run_scraper(self, script_name):
        """Kører et enkelt scraper script"""
        script_path = os.path.join(self.scraper_dir, "scrapers", script_name)
        
        if not os.path.exists(script_path):
            logger.error(f"Scraper script ikke fundet: {script_path}")
            return False
        
        logger.info(f"Kører {script_name}...")
        
        try:
            result = subprocess.run([sys.executable, script_path], 
                                  capture_output=True, text=True, check=True)
            logger.info(f"{script_name} gennemført succesfuldt")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"{script_name} fejlede: {e}")
            logger.error(f"STDOUT: {e.stdout}")
            logger.error(f"STDERR: {e.stderr}")
            return False
        except Exception as e:
            logger.error(f"Uventet fejl ved kørsel af {script_name}: {e}")
            return False

    def run_all_scrapers(self):
        """Kører alle scraper scripts i rækkefølge"""
        logger.info("Starter kørsel af alle scraper scripts...")
        
        success_count = 0
        total_scrapers = len(self.scraper_scripts)
        
        for script in self.scraper_scripts:
            if self.run_scraper(script):
                success_count += 1
            else:
                logger.warning(f"{script} fejlede - fortsætter med næste")
        
        logger.info(f"Scraping færdig: {success_count}/{total_scrapers} succesfulde")
        return success_count > 0  # Returner True hvis mindst én scraper lykkedes

    def run_tagging(self):
        """Kører automatisk tagging på alle JSON filer"""
        logger.info("Starter automatisk tagging...")
        
        try:
            tagging_script = os.path.join(self.scraper_dir, "tagging", "content_tagger.py")
            result = subprocess.run([sys.executable, tagging_script], check=True)
            logger.info("Tagging gennemført succesfuldt")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Tagging fejlede: {e}")
            return False
        except Exception as e:
            logger.error(f"Uventet fejl ved tagging: {e}")
            return False

    def check_for_duplicates(self):
        """Tjekker for dubletter i data"""
        logger.info("Tjekker for dubletter...")
        
        try:
            # Læs alle JSON filer i data mappen
            json_files = [f for f in os.listdir(self.data_dir) if f.endswith('.json')]
            
            all_articles = []
            for filename in json_files:
                filepath = os.path.join(self.data_dir, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        # Håndter forskellige JSON strukturer
                        articles = data.get('blog_posts', []) or data.get('articles', []) or data.get('posts', [])
                        if articles:
                            all_articles.extend(articles)
                except Exception as e:
                    logger.warning(f"Kunne ikke læse {filename}: {e}")
            
            # Tjek for dubletter baseret på URL
            urls = [article.get('url', '') for article in all_articles]
            duplicates = len(urls) - len(set(urls))
            
            if duplicates > 0:
                logger.warning(f"Fundet {duplicates} dubletter i data")
            else:
                logger.info("Ingen dubletter fundet")
            
            return True
        except Exception as e:
            logger.error(f"Fejl ved dubletter tjek: {e}")
            return False

    def run_article_cleaning(self):
        """Kører artikel rydning (fjern portfolio opdateringer, duplikater)"""
        logger.info("Kører artikel rydning...")
        
        try:
            cleaning_script = os.path.join(self.scraper_dir, "clean_low_value_articles.py")
            result = subprocess.run([sys.executable, cleaning_script, "--clean"], check=True)
            logger.info("Artikel rydning gennemført")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Artikel rydning fejlede: {e}")
            return False
        except Exception as e:
            logger.error(f"Uventet fejl ved artikel rydning: {e}")
            return False

    def run_low_value_cleaning(self):
        """Kører lavværdi artikel rensning"""
        logger.info("Kører lavværdi artikel rensning...")
        
        try:
            cleaning_script = os.path.join(self.scraper_dir, "clean_low_value_articles.py")
            result = subprocess.run([sys.executable, cleaning_script, "--clean"], check=True)
            logger.info("Lavværdi artikel rensning gennemført")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Lavværdi artikel rensning fejlede: {e}")
            return False
        except Exception as e:
            logger.error(f"Uventet fejl ved lavværdi artikel rensning: {e}")
            return False

    def generate_summary_report(self):
        """Genererer en samlet rapport over opdateringen"""
        logger.info("Genererer samlet rapport...")
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'total_articles': 0,
            'files_updated': [],
            'tagged_files': []
        }
        
        # Tæl artikler i alle JSON filer
        json_files = [f for f in os.listdir(self.data_dir) if f.endswith('.json')]
        
        for filename in json_files:
            filepath = os.path.join(self.data_dir, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    # Håndter forskellige JSON strukturer
                    articles = data.get('blog_posts', []) or data.get('articles', []) or data.get('posts', [])
                    article_count = len(articles)
                    report['total_articles'] += article_count
                    report['files_updated'].append({
                        'filename': filename,
                        'articles': article_count,
                        'source': data.get('source', 'Ukendt')
                    })
            except Exception as e:
                logger.warning(f"Kunne ikke læse {filename}: {e}")
        
        # Tæl tagged filer
        if os.path.exists(self.tagged_dir):
            tagged_files = [f for f in os.listdir(self.tagged_dir) if f.endswith('.json')]
            report['tagged_files'] = tagged_files
        
        # Gem rapport
        report_path = os.path.join(self.tagged_dir, "update_report.json")
        try:
            with open(report_path, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
            logger.info(f"Rapport gemt: {report_path}")
        except Exception as e:
            logger.error(f"Kunne ikke gemme rapport: {e}")
        
        return report
    
    def run_full_update(self):
        """Kører komplet opdatering af alt data"""
        print("MINE PENGE DATA UPDATER")
        print("=" * 60)
        print("Dette script vil:")
        print("1. Koere alle scraper scripts i korrekt raekkefoelge")
        print("2. Tjekke for dubletter i data")
        print("3. Koere automatisk tagging paa alle JSON filer")
        print("4. Samle alle artikler i articles.json")
        print("5. Rydde op i artikler (fjern portfolio opdateringer, dubletter)")
        print("6. Generere en samlet rapport")
        print("=" * 60)
        
        # Trin 1: Kør alle scrapers
        if not self.run_all_scrapers():
            logger.error("Nogle scrapers fejlede - stopper opdatering")
            return False
        
        # Trin 2: Tjek for dubletter
        if not self.check_for_duplicates():
            logger.warning("Dubletter fundet - fortsætter alligevel")
        
        # Trin 3: Kør tagging
        if not self.run_tagging():
            logger.error("Tagging fejlede")
            return False
        
        # Trin 4: Kør build_articles.py for at samle alle artikler
        print("\nKoerer build_articles.py for at samle alle artikler...")
        try:
            build_script = os.path.join(os.path.dirname(__file__), "build_articles.py")
            result = subprocess.run([sys.executable, build_script], check=True)
            print("Samlet articles.json er nu opdateret!")
        except subprocess.CalledProcessError as e:
            print(f"Fejl ved koersel af build_articles.py: {e}")
        except Exception as e:
            print(f"Uventet fejl ved build: {e}")
        
        # Trin 5: Kør artikel rydning
        print("\nKoerer artikel rydning...")
        if not self.run_article_cleaning():
            print("Artikel rydning fejlede - fortsætter alligevel")
        else:
            print("Artikel rydning gennemført!")

        # Trin 6: Kør lavværdi artikel rensning
        print("\nKoerer lavvaerdi artikel rensning...")
        if not self.run_low_value_cleaning():
            print("Lavvaerdi artikel rensning fejlede - fortsætter alligevel")
        else:
            print("Lavvaerdi artikel rensning gennemført!")
        
        # Trin 7: Kør build_articles.py igen for at samle alle artikler
        print("\nKoerer build_articles.py igen for at samle alle artikler...")
        try:
            build_script = os.path.join(os.path.dirname(__file__), "build_articles.py")
            result = subprocess.run([sys.executable, build_script], check=True)
            print("Samlet articles.json er nu opdateret!")
        except subprocess.CalledProcessError as e:
            print(f"Fejl ved koersel af build_articles.py: {e}")
        except Exception as e:
            print(f"Uventet fejl ved build: {e}")
        
        # Trin 8: Generer rapport
        report = self.generate_summary_report()
        
        # Print sammendrag
        print("\nOPDATERING FAERDIG!")
        print("=" * 60)
        print(f"Total artikler opdateret: {report['total_articles']}")
        print(f"JSON filer opdateret: {len(report['files_updated'])}")
        print(f"Taggede filer: {len(report['tagged_files'])}")
        print(f"Rapport gemt: data/tagged/update_report.json")
        
        print(f"\nDetaljer:")
        for file_info in report['files_updated']:
            print(f"  - {file_info['filename']}: {file_info['articles']} artikler")
        
        return True

def main():
    """Hovedfunktion"""
    updater = DataUpdater()
    success = updater.run_full_update()
    
    if success:
        print("\nAlt data er nu opdateret og klar til brug!")
    else:
        print("\nOpdatering fejlede - tjek loggene for detaljer")

if __name__ == "__main__":
    main()