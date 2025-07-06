import subprocess
import os

if __name__ == "__main__":
    # ... eksisterende kode ...
    scraper_dir = os.path.dirname(os.path.abspath(__file__))
    build_script = os.path.join(scraper_dir, "build_articles.py")
    print("\nKører build_articles.py for at samle alle artikler...")
    subprocess.run(["python3", build_script], check=True)
    print("Samlet articles.json er nu opdateret!") 