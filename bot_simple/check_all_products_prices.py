#!/usr/bin/env python3
import sys
import os

# Aggiungi la directory del bot al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db import get_all_products
from scraper import get_product_data

print("🔍 Controllo prezzi di TUTTI i prodotti nel database...\n")
print("⚠️ ATTENZIONE: Questa operazione richiederà molto tempo")
print("   (308 prodotti × delay anti-ban = circa 15-30 minuti)\n")

products = get_all_products()
total = len(products)
under_40 = 0
over_40 = 0
price_errors = 0

print(f"📊 Totale prodotti da controllare: {total}\n")

for i, product in enumerate(products, 1):
    print(f"[{i}/{total}] 📦 {product['nome'][:50]}...")
    price, img = get_product_data(product['link'])
    
    if price:
        if price <= 40:
            under_40 += 1
            print(f"   💰 €{price:.2f} ✅ SOTTO SOGLIA (€40)")
        else:
            over_40 += 1
            print(f"   💰 €{price:.2f} ❌ SOPRA SOGLIA (€40)")
    else:
        price_errors += 1
        print(f"   ❌ Prezzo non trovato")
    print()

print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print(f"📊 RIEPILOGO:")
print(f"   Totale prodotti: {total}")
print(f"   ✅ Sotto soglia (€40): {under_40}")
print(f"   ❌ Sopra soglia (€40): {over_40}")
print(f"   ❌ Errore prezzo: {price_errors}")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

print(f"\n💡 PROSSIMO PASSO:")
print(f"   Vuoi rimuovere i {over_40 + price_errors} prodotti sopra soglia/con errore?")
print(f"   (rimarranno {under_40} prodotti nel database)")
