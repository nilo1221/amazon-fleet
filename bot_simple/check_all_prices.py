#!/usr/bin/env python3
import sys
import os

# Aggiungi la directory del bot al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db import get_all_products
from scraper import get_product_data

print("🔍 Controllo prezzi di TUTTI i prodotti nel database...\n")

products = get_all_products()
total = len(products)
under_threshold = 0
over_threshold = 0
price_errors = 0

print(f"📊 Totale prodotti nel database: {total}\n")

for i, product in enumerate(products, 1):
    print(f"[{i}/{total}] 📦 {product['nome'][:60]}...")
    price, img = get_product_data(product['link'])
    
    if price:
        if price <= 40:
            under_threshold += 1
            print(f"   💰 €{price:.2f} ✅ SOTTO SOGLIA (€40)")
        else:
            over_threshold += 1
            print(f"   💰 €{price:.2f} ❌ SOPRA SOGLIA (€40)")
    else:
        price_errors += 1
        print(f"   ❌ Prezzo non trovato")
    print()

print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print(f"📊 RIEPILOGO:")
print(f"   Totale prodotti: {total}")
print(f"   ✅ Sotto soglia (€40): {under_threshold}")
print(f"   ❌ Sopra soglia (€40): {over_threshold}")
print(f"   ❌ Errore prezzo: {price_errors}")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
