#!/usr/bin/env python3
import sys
import os

# Aggiungi la directory del bot al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db import get_all_products

products = get_all_products()
print(f"📊 Totale prodotti nel database: {len(products)}")
print(f"\n📦 Lista prodotti:")
for i, product in enumerate(products, 1):
    print(f"{i}. ASIN: {product['asin']}")
    print(f"   Nome: {product['nome'][:60]}...")
    print()
