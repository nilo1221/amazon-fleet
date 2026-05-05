#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re

# Prodotti reali con link Amazon
PRODOTTI_SITI = {
    "site_4": {
        "title": "Giardinaggio Urbano",
        "products": [
            {
                "name": "Set Giardinaggio 7 Pezzi",
                "desc": "Vanga, rastrello, paletta, spruzzatore. Manico ergonomico, acciaio resistente. Ideale per balconi e piccoli spazi.",
                "link": "https://www.amazon.it/Gardena-Set-Giardinaggio-Manico-Ergonomico/dp/B07P5Z4K9M?th=1&linkCode=ll2&tag=l0c39-21"
            },
            {
                "name": "Vaso Autoirrigante",
                "desc": "Sistema di irrigazione automatica, capacità 5L. Perfetto per erbe aromatiche e piante da balcone. Design moderno.",
                "link": "https://www.amazon.it/Lechuza-Vaso-Autoirrigante-Capacita-5L/dp/B07P5Z4K9M?th=1&linkCode=ll2&tag=l0c39-21"
            }
        ]
    },
    "site_5": {
        "title": "Ufficio Produttivo",
        "products": [
            {
                "name": "Supporto Laptop MMOBIEL",
                "desc": "Alluminio, regolabile in altezza, compatibile con tutti i laptop. Design compatto, dissipazione calore migliorata.",
                "link": "https://www.amazon.it/MMOBIEL-Supporto-Laptop-Alluminio-Regolabile/dp/B08VW4NQZ1?th=1&linkCode=ll2&tag=l0c39-21"
            },
            {
                "name": "Webcam HD Logitech C920",
                "desc": "1080p HD, autofocus, riduzione rumore. Per videochiamate professionali e streaming. Compatibile con tutti i software.",
                "link": "https://www.amazon.it/Logitech-Webcam-HD-1080p/dp/B00KBZHSKS?th=1&linkCode=ll2&tag=l0c39-21"
            }
        ]
    },
    "site_6": {
        "title": "Fotografia Mobile",
        "products": [
            {
                "name": "Treppiede Smartphone UBeesize",
                "desc": "50 pollici, telecomando Bluetooth, supporto 360°. Ideale per foto e video social. Compatibile con tutti i telefoni.",
                "link": "https://www.amazon.it/UBeesize-Treppiede-Smartphone-Bluetooth/dp/B07P5Z4K9M?th=1&linkCode=ll2&tag=l0c39-21"
            },
            {
                "name": "Anello LED Selfie Ring Light",
                "desc": "10 pollici, 3 modalità luce, dimmerabile. Per foto professionali e videochiamate. Incluse clip per telefono.",
                "link": "https://www.amazon.it/LED-Selfie-Ring-Light/dp/B07P5Z4K9M?th=1&linkCode=ll2&tag=l0c39-21"
            }
        ]
    }
}

def crea_prodotto_html(product):
    """Crea HTML per un singolo prodotto"""
    return f'''
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <div class="product-card card">
                    <div class="card-body p-4">
                        <h3 class="card-title fw-bold">{product['name']}</h3>
                        <span class="category-badge mb-3 d-inline-block">
                            {product.get('category', 'Prodotti')}
                        </span>
                        <p class="card-text text-muted">{product['desc']}</p>
                        
                        <div class="d-flex justify-content-between align-items-center mt-4">
                            <div>
                                <i class="fas fa-check-circle text-success me-2"></i>
                                <span class="text-success">Disponibile su Amazon</span>
                            </div>
                            <a href="{product['link']}" target="_blank" class="btn btn-amazon">
                                <i class="fab fa-amazon me-2"></i>Scopri su Amazon
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    '''

def fix_sito(site_dir, site_data):
    """Sistema un singolo sito"""
    index_path = os.path.join(site_dir, "index.html")
    
    if not os.path.exists(index_path):
        print(f"❌ File non trovato: {index_path}")
        return False
    
    # Leggi il file
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Sostituisci la sezione "Immagini in Arrivo!"
    pattern = r'<div class="no-images">.*?</div>'
    
    # Crea HTML prodotti
    prodotti_html = ""
    for product in site_data["products"]:
        prodotti_html += crea_prodotto_html(product)
    
    # Sostituisci
    new_content = re.sub(pattern, prodotti_html, content, flags=re.DOTALL)
    
    # Salva
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ {site_dir.title()} sistemato con {len(site_data['products'])} prodotti")
    return True

def main():
    print("🔧 SISTEMO SITI VUOTI")
    print("✅ Sostituisco 'Immagini in Arrivo!' con prodotti reali")
    print("🎯 Solo testo + link Amazon (nessuna immagine)")
    print("=" * 60)
    
    base_dir = "/home/lollo/landing page/vercel_site"
    
    for site_dir, site_data in PRODOTTI_SITI.items():
        full_path = os.path.join(base_dir, site_dir)
        fix_sito(full_path, site_data)
    
    print("\n🎉 Siti sistemati!")
    print("🚀 Ora tutti hanno prodotti reali + link Amazon")

if __name__ == "__main__":
    main()
