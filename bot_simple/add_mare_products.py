#!/usr/bin/env python3
import sys
import os

# Aggiungi la directory del bot al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db import add_product

print("🌊 Aggiunta prodotti Mare & Spiaggia al database del bot...\n")

# Prodotti da aggiungere
products = [
    {
        'asin': 'B0GCTQ1DW4',
        'nome': '🏖️ Tenda da Sole per Spiaggia - Protezione UV',
        'link': 'https://www.amazon.it/Tenda-Sole-Spiaggia-Protezione-Impermeabile/dp/B0GCTQ1DW4?th=1&linkCode=ll2&tag=l0c39-21&linkId=dc6a469c5fe20bf14dc02d57adddbddd&ref_=as_li_ss_tl'
    },
    {
        'asin': 'B09ZQL5VZC',
        'nome': '🕶️ LINVO Occhiali da Sole Polarizzati',
        'link': 'https://www.amazon.it/dp/B09ZQL5VZC?th=1&linkCode=ll2&tag=l0c39-21&linkId=90128537afab46b449bfcfd83ed2341b&ref_=as_li_ss_tl'
    },
    {
        'asin': 'B0BXT765VL',
        'nome': '🏖️ Henrycares Beach Blanket - Tappetino Spiaggia',
        'link': 'https://www.amazon.it/dp/B0BXT765VL?th=1&linkCode=ll2&tag=l0c39-21&linkId=8061ce195ea3accee2a78caed0238d7f&ref_=as_li_ss_tl'
    },
    {
        'asin': 'B094Y6FVSQ',
        'nome': '🏖️ FANSU Ocean Beach Towel - Telo Mare',
        'link': 'https://www.amazon.it/dp/B094Y6FVSQ?th=1&linkCode=ll2&tag=l0c39-21&linkId=4989274e56ff73add9a3061f477ae7ba&ref_=as_li_ss_tl'
    }
]

added = 0
duplicates = 0

for product in products:
    try:
        add_product(product['asin'], product['nome'], product['link'])
        print(f"✅ Prodotto aggiunto: {product['asin']}")
        added += 1
    except Exception as e:
        if "già esistente" in str(e):
            print(f"❌ Prodotto {product['asin']} già esistente")
            duplicates += 1
        else:
            print(f"❌ Errore aggiungendo {product['asin']}: {e}")

print(f"\n📊 RIEPILOGO:")
print(f"   ✅ Prodotti aggiunti: {added}")
print(f"   ⚠️ Prodotti duplicati: {duplicates}")
print(f"   📦 Totale processati: {len(products)}")
