#!/usr/bin/env python3
import sys
import os

# Aggiungi la directory del bot al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from extract_products import extract_products_from_html
import os

base_path = '/home/lollo/amazon/public/niches'

print("🔍 Controllo prodotti in tutte le nicchie del sito...\n")

total_site_products = 0
niches_data = []

# Funzione ricorsiva per trovare tutti i file HTML
def find_html_files(directory):
    html_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file == 'index.html':
                html_files.append(os.path.join(root, file))
    return html_files

# Trova tutti i file HTML nelle nicchie
html_files = find_html_files(base_path)

for html_file in html_files:
    try:
        products = extract_products_from_html(html_file)
        count = len(products)
        total_site_products += count
        
        # Crea nome relativo per display
        relative_path = html_file.replace(base_path, '').replace('/index.html', '')
        niche_name = relative_path.strip('/')
        
        niches_data.append({
            'name': niche_name,
            'count': count,
            'products': products
        })
        print(f"📁 {niche_name}: {count} prodotti")
    except Exception as e:
        print(f"❌ Errore in {html_file}: {e}")

print(f"\n📊 TOTALE PRODOTTI SUL SITO: {total_site_products}")

# Confronta con database
from db import get_all_products
db_products = get_all_products()
print(f"📊 TOTALE PRODOTTI DATABASE: {len(db_products)}")

print(f"\n📊 DIFFERENZA: {total_site_products - len(db_products)} prodotti")

if total_site_products > len(db_products):
    print(f"⚠️ Ci sono {total_site_products - len(db_products)} prodotti sul sito non nel database")
elif total_site_products < len(db_products):
    print(f"⚠️ Ci sono {len(db_products) - total_site_products} prodotti nel database non sul sito")
else:
    print(f"✅ Database e sito sono sincronizzati")
