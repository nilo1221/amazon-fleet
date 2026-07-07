#!/usr/bin/env python3
import sqlite3
import re
from db import get_all_products

def verify_all_links():
    """Verifica tutti i link nel database per problemi di configurazione."""
    products = get_all_products()
    print(f"🔍 Verifica {len(products)} prodotti nel database...\n")
    
    issues = {
        'invalid_linkid': [],
        'missing_tag': [],
        'search_links': [],
        'non_amazon': [],
        'duplicates': []
    }
    
    seen_asins = set()
    
    for p in products:
        link = p['link']
        asin = p['asin']
        
        # 1. Controlla linkId non standard
        if 'linkId=' in link:
            link_id = link.split('linkId=')[-1].split('&')[0]
            if len(link_id) != 32 or not all(c in '0123456789abcdef' for c in link_id.lower()):
                issues['invalid_linkid'].append(f"ASIN {asin[:15]} - LinkId: {link_id}")
        
        # 2. Controlla tag affiliato mancante
        if 'tag=l0c39-21' not in link:
            issues['missing_tag'].append(f"ASIN {asin[:15]}")
        
        # 3. Controlla link a pagine di ricerca
        if '/s?' in link or '/gp/search' in link:
            issues['search_links'].append(f"ASIN {asin[:15]}")
        
        # 4. Controlla link non-Amazon
        if 'amazon.it' not in link and 'amazon.com' not in link:
            issues['non_amazon'].append(f"ASIN {asin[:15]} - Link: {link[:50]}")
        
        # 5. Controlla duplicati
        if asin in seen_asins:
            issues['duplicates'].append(f"ASIN {asin[:15]}")
        seen_asins.add(asin)
    
    # Report
    print("📊 RISULTATO VERIFICA:\n")
    
    if issues['invalid_linkid']:
        print(f"❌ LinkId non standard: {len(issues['invalid_linkid'])}")
        for issue in issues['invalid_linkid']:
            print(f"   {issue}")
    
    if issues['missing_tag']:
        print(f"\n❌ Tag affiliato mancante: {len(issues['missing_tag'])}")
        for issue in issues['missing_tag']:
            print(f"   {issue}")
    
    if issues['search_links']:
        print(f"\n❌ Link a pagine di ricerca: {len(issues['search_links'])}")
        for issue in issues['search_links']:
            print(f"   {issue}")
    
    if issues['non_amazon']:
        print(f"\n❌ Link non-Amazon: {len(issues['non_amazon'])}")
        for issue in issues['non_amazon']:
            print(f"   {issue}")
    
    if issues['duplicates']:
        print(f"\n❌ ASIN duplicati: {len(issues['duplicates'])}")
        for issue in issues['duplicates']:
            print(f"   {issue}")
    
    total_issues = sum(len(v) for v in issues.values())
    
    if total_issues == 0:
        print("✅ Nessun problema trovato! Tutti i link sono configurati correttamente.")
    else:
        print(f"\n⚠️ Totale problemi trovati: {total_issues}")
        
        # Chiedi se rimuovere i prodotti con problemi
        response = input("\nVuoi rimuovere i prodotti con problemi? (s/n): ")
        if response.lower() == 's':
            conn = sqlite3.connect('data/bot_database.db')
            cursor = conn.cursor()
            
            # Rimuovi prodotti con problemi
            all_problem_asins = set()
            for issue_list in issues.values():
                for issue in issue_list:
                    asin = issue.split(' - ')[0].replace('ASIN ', '').strip()
                    all_problem_asins.add(asin)
            
            removed_count = 0
            for asin in all_problem_asins:
                cursor.execute('DELETE FROM monitored_products WHERE asin = ?', (asin,))
                if cursor.rowcount > 0:
                    removed_count += cursor.rowcount
                    print(f"   ❌ Rimosso ASIN {asin}")
            
            conn.commit()
            conn.close()
            print(f"\n✅ Rimossi {removed_count} prodotti con problemi")

if __name__ == "__main__":
    verify_all_links()
