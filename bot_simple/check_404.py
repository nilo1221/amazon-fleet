#!/usr/bin/env python3
import sqlite3
from scraper import get_product_data
from db import get_all_products

def check_and_remove_404():
    """Verifica tutti i prodotti e rimuove quelli che danno 404."""
    products = get_all_products()
    print(f"🔍 Controllo {len(products)} prodotti...")
    
    to_remove = []
    
    for i, product in enumerate(products):
        print(f"[{i+1}/{len(products)}] Controllo {product['asin']}...", end=' ')
        
        price, img_url = get_product_data(product['link'])
        
        if price is None and img_url is None:
            print("❌ 404 - DA RIMUOVERE")
            to_remove.append(product['id'])
        else:
            print("✅ OK")
    
    if to_remove:
        print(f"\n🗑️ Trovati {len(to_remove)} prodotti da rimuovere")
        
        conn = sqlite3.connect('data/bot_database.db')
        cursor = conn.cursor()
        
        for product_id in to_remove:
            cursor.execute('DELETE FROM monitored_products WHERE id = ?', (product_id,))
            print(f"   ❌ Rimosso ID {product_id}")
        
        conn.commit()
        conn.close()
        
        print(f"\n✅ Rimossi {len(to_remove)} prodotti dal database")
    else:
        print("\n✅ Nessun prodotto da rimuovere")

if __name__ == "__main__":
    check_and_remove_404()
