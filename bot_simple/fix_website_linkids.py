#!/usr/bin/env python3
import re
from pathlib import Path

def fix_invalid_linkids():
    """Rimuove prodotti con linkId non standard dal sito web."""
    public_dir = Path('/home/lollo/amazon/public')
    
    # Pattern per linkId non standard
    invalid_linkid_pattern = re.compile(r'linkId=(jkl012|mno345|pqr678|abc123|ticwatch|smartwatch[0-9]*)')
    
    # Trova tutti i file HTML
    html_files = list(public_dir.rglob('*.html'))
    print(f"🔍 Controllo {len(html_files)} file HTML per linkId non standard...\n")
    
    fixed_files = []
    removed_products = []
    
    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Trova e rimuovi prodotti con linkId non standard
            # Cerca il pattern completo del prodotto card
            product_pattern = re.compile(
                r'<div[^>]*class="[^"]*product-card[^"]*"[^>]*>.*?'
                r'linkId=(jkl012|mno345|pqr678|abc123|ticwatch|smartwatch[0-9]*).*?'
                r'</div>\s*</div>\s*</div>',
                re.DOTALL | re.IGNORECASE
            )
            
            matches = product_pattern.findall(content)
            if matches:
                # Rimuovi i prodotti con linkId non standard
                content = product_pattern.sub('', content)
                removed_products.extend([(html_file.name, match) for match in matches])
            
            if content != original_content:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                fixed_files.append(html_file.name)
        
        except Exception as e:
            print(f"⚠️ Errore processando {html_file}: {e}")
    
    print(f"📊 RISULTATO:\n")
    print(f"✅ File modificati: {len(fixed_files)}")
    for filename in fixed_files:
        print(f"   {filename}")
    
    print(f"\n❌ Prodotti rimossi: {len(removed_products)}")
    for filename, linkid in removed_products[:10]:
        print(f"   {filename}: LinkId={linkid}")
    if len(removed_products) > 10:
        print(f"   ... e altri {len(removed_products) - 10}")
    
    return len(fixed_files) > 0

if __name__ == "__main__":
    fix_invalid_linkids()
