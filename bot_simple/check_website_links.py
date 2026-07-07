#!/usr/bin/env python3
import os
import re
from pathlib import Path
import sqlite3

def check_website_links():
    """Controlla tutti i link affiliati nel sito web."""
    public_dir = Path('/home/lollo/amazon/public')
    
    issues = {
        'missing_tag': [],
        'invalid_linkid': [],
        'non_amazon': [],
        'broken_links': []
    }
    
    # Trova tutti i file HTML
    html_files = list(public_dir.rglob('*.html'))
    print(f"🔍 Controllo {len(html_files)} file HTML nel sito web...\n")
    
    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Trova tutti i link Amazon
            amazon_links = re.findall(r'https?://[^\s<>"]+amazon[^\s<>"]*', content)
            
            for link in amazon_links:
                # 1. Controlla tag affiliato
                if 'tag=l0c39-21' not in link:
                    issues['missing_tag'].append(f"{html_file.name}: {link[:80]}")
                
                # 2. Controlla linkId non standard
                if 'linkId=' in link:
                    link_id = link.split('linkId=')[-1].split('&')[0]
                    if len(link_id) != 32 or not all(c in '0123456789abcdef' for c in link_id.lower()):
                        issues['invalid_linkid'].append(f"{html_file.name}: LinkId={link_id}")
                
                # 3. Controlla link non-Amazon
                if 'amazon.it' not in link and 'amazon.com' not in link:
                    issues['non_amazon'].append(f"{html_file.name}: {link[:80]}")
        
        except Exception as e:
            print(f"⚠️ Errore leggendo {html_file}: {e}")
    
    # Report
    print("📊 RISULTATO SITO WEB:\n")
    
    if issues['missing_tag']:
        print(f"❌ Tag affiliato mancante: {len(issues['missing_tag'])}")
        for issue in issues['missing_tag'][:5]:
            print(f"   {issue}")
        if len(issues['missing_tag']) > 5:
            print(f"   ... e altri {len(issues['missing_tag']) - 5}")
    
    if issues['invalid_linkid']:
        print(f"\n❌ LinkId non standard: {len(issues['invalid_linkid'])}")
        for issue in issues['invalid_linkid'][:5]:
            print(f"   {issue}")
        if len(issues['invalid_linkid']) > 5:
            print(f"   ... e altri {len(issues['invalid_linkid']) - 5}")
    
    if issues['non_amazon']:
        print(f"\n❌ Link non-Amazon: {len(issues['non_amazon'])}")
        for issue in issues['non_amazon'][:5]:
            print(f"   {issue}")
        if len(issues['non_amazon']) > 5:
            print(f"   ... e altri {len(issues['non_amazon']) - 5}")
    
    total_issues = sum(len(v) for v in issues.values())
    
    if total_issues == 0:
        print("✅ Nessun problema trovato nel sito web!")
    else:
        print(f"\n⚠️ Totale problemi nel sito web: {total_issues}")
    
    return total_issues == 0

if __name__ == "__main__":
    check_website_links()
