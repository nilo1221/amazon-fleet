#!/usr/bin/env python3
"""
Script per aggiungere i link Amazon categorizzati alle nicchie in amazon-fleet-main.
"""

import re
from pathlib import Path

# Percorsi
categorization_file = Path('/home/lollo/amazon-fleet-main/categorization_results.txt')
sites_dir = Path('/home/lollo/amazon-fleet-main/sites')

def parse_categorization_file(file_path):
    """Parso il file di categorizzazione e restituisce un dict con nicchia -> lista link."""
    categorized = {}
    current_niche = None
    
    with open(file_path, 'r') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            
            # Controlla se è una riga con il nome della nicchia
            if line.startswith('site_'):
                # Formato: "site_X: N link"
                niche = line.split(':')[0]
                categorized[niche] = []
                current_niche = niche
            elif current_niche and line.startswith('https://'):
                # È un link
                categorized[current_niche].append(line)
    
    return categorized

def extract_product_name(url):
    """Estrae il nome del prodotto dall'URL Amazon."""
    # L'URL Amazon ha formato: https://www.amazon.it/Nome-Produto/dp/...
    match = re.search(r'amazon\.it/([^/]+)/dp/', url)
    if match:
        return match.group(1).replace('-', ' ').title()
    return "Prodotto Amazon"

def generate_product_card(link):
    """Genera una card HTML per un prodotto."""
    product_name = extract_product_name(link)
    
    html = f'''                <!-- Nuovo Prodotto -->
                <div class="product-card card mb-4">
                    <div class="card-body p-4">
                        <div class="text-center mb-4">
                            <i class="fas fa-box fa-4x text-primary"></i>
                        </div>
                        <span class="category-badge mb-3 d-inline-block">
                            Prodotto Amazon
                        </span>
                        <h3 class="card-title fw-bold mb-3">{product_name}</h3>
                        
                        <div class="row mb-4">
                            <div class="col-md-6">
                            </div>
                            <div class="col-md-6 text-end">
                                <div class="mb-2">
                                    <i class="fas fa-star-half-alt text-warning"></i>
                                </div>
                            </div>
                        </div>
                        
                        <p class="card-text text-muted mb-4"><strong>Prodotto di qualità selezionato.</strong> Prodotto disponibile su Amazon con spedizione Prime. Acquista con fiducia dalla piattaforma più affidabile per lo shopping online.</p>
                        
                        <div class="mb-4">
                            <h5 class="fw-bold mb-3">Caratteristiche Principali:</h5>
                            <ul class="list-unstyled">
                                <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i><strong>Qualità:</strong> Prodotti selezionati</li>
                                <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i><strong>Spedizione:</strong> Prime disponibile</li>
                                <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i><strong>Garanzia:</strong> Amazon</li>
                                <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i><strong>Reso:</strong> 30 giorni</li>
                            </ul>
                        </div>
                        
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-shipping-fast text-success me-2"></i>
                                    <span>Spedizione Gratuita Prime</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-shield-alt text-success me-2"></i>
                                    <span>Garanzia Amazon</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-undo text-success me-2"></i>
                                    <span>Reso gratuito 30 giorni</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-credit-card text-success me-2"></i>
                                    <span>Pagamenti sicuri</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <i class="fas fa-check-circle text-success me-2"></i>
                                <span class="text-success fw-bold">Disponibile su Amazon</span>
                            </div>
                            <a href="{link}" target="_blank" class="btn btn-amazon">
                                <i class="fab fa-amazon me-2"></i>Vedi su Amazon
                            </a>
                        </div>
                    </div>
                </div>
'''
    return html

def add_products_to_niche(niche, links):
    """Aggiunge i prodotti al file HTML della nicchia."""
    niche_file = sites_dir / niche / 'index.html'
    
    if not niche_file.exists():
        print(f"File {niche_file} non trovato, skip.")
        return False
    
    # Legge il file HTML
    with open(niche_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Genera le card HTML per i nuovi prodotti
    new_products = '\n'
    for link in links:
        new_products += generate_product_card(link)
    
    # Trova dove inserire i nuovi prodotti (alla fine della sezione prodotti)
    # Cerca la chiusura della sezione products
    if '</section>' in content:
        # Inserisce prima della chiusura della sezione
        content = content.replace('</section>', new_products + '</section>', 1)
    
    # Salva il file aggiornato
    with open(niche_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Aggiunti {len(links)} prodotti a {niche}")
    return True

def main():
    # Legge la categorizzazione
    categorized = parse_categorization_file(categorization_file)
    
    print(f"Totale nicchie: {len(categorized)}")
    
    # Nicchie da espandere con numero di prodotti
    niches_to_expand = {
        'site_3': 2,
        'site_4': 2,
        'site_5': 2,
        'site_6': 2,
        'site_7': 2,
        'site_8': 2,
        'site_9': 2,
        'site_11': 3,
        'site_12': 2,
        'site_13': 2,
        'site_15': 2,
        'site_16': 2
    }
    
    # Per ogni nicchia da espandere, aggiunge solo i primi N prodotti
    for niche, max_products in niches_to_expand.items():
        if niche in categorized and categorized[niche]:
            links_to_add = categorized[niche][:max_products]
            print(f"\nElaborando {niche} con {len(links_to_add)} link (su {len(categorized[niche])} totali)...")
            add_products_to_niche(niche, links_to_add)
    
    print("\nCompletato!")

if __name__ == '__main__':
    main()
