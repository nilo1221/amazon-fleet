#!/usr/bin/env python3
"""
Script per verificare la disponibilità dei prodotti Amazon.
Controlla: 404, non disponibile, prezzo non disponibile.
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import os
from pathlib import Path
from urllib.parse import urlparse, parse_qs

# Configurazione
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
ACCEPT_LANGUAGE = 'it-IT,it;q=0.9'
BASE_URL = 'https://www.amazon.it/dp/'

# File paths
BASE_DIR = Path(__file__).parent.parent
SENT_PRODUCTS_FILE = BASE_DIR / 'data' / 'sent_products.json'
PUBLIC_DIR = BASE_DIR / 'public'
RESULTS_FILE = BASE_DIR / 'api' / 'availability_check_results.json'

def extract_asin_from_url(url):
    """Estrae ASIN da URL Amazon"""
    try:
        # URL format: https://www.amazon.it/dp/ASIN/...
        if '/dp/' in url:
            parts = url.split('/dp/')
            asin = parts[1].split('/')[0].split('?')[0]
            return asin
        # URL format: https://www.amazon.it/.../dp/ASIN
        elif 'dp=' in url:
            parsed = urlparse(url)
            params = parse_qs(parsed.query)
            if 'dp' in params:
                return params['dp'][0]
    except:
        pass
    return None

def extract_asins_from_html(html_file):
    """Estrae tutti gli ASIN dai link Amazon in un file HTML"""
    asins = set()
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
            soup = BeautifulSoup(content, 'html.parser')
            
            # Cerca tutti i link Amazon
            for link in soup.find_all('a', href=True):
                href = link['href']
                if 'amazon.it' in href:
                    asin = extract_asin_from_url(href)
                    if asin:
                        asins.add(asin)
    except Exception as e:
        print(f"Errore lettura {html_file}: {e}")
    
    return list(asins)

def get_all_asins_from_site():
    """Scansiona tutte le nicchie e estrae tutti gli ASIN"""
    all_asins = set()
    
    # Scansiona directory niches
    niches_dir = PUBLIC_DIR / 'niches'
    if niches_dir.exists():
        for niche_dir in niches_dir.iterdir():
            if niche_dir.is_dir():
                index_file = niche_dir / 'index.html'
                if index_file.exists():
                    print(f"Scansione: {niche_dir.name}")
                    asins = extract_asins_from_html(index_file)
                    all_asins.update(asins)
                    print(f"  Trovati {len(asins)} ASIN")
    
    return list(all_asins)

def check_product(asin):
    """Verifica un prodotto su Amazon"""
    url = f"{BASE_URL}{asin}"
    
    try:
        headers = {
            'User-Agent': USER_AGENT,
            'Accept-Language': ACCEPT_LANGUAGE
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 404:
            return {
                'asin': asin,
                'status': '404',
                'message': 'Prodotto non trovato (404)',
                'title': None,
                'price': None
            }
        
        if response.status_code != 200:
            return {
                'asin': asin,
                'status': 'ERROR',
                'message': f'HTTP {response.status_code}',
                'title': None,
                'price': None
            }
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Verifica disponibilità
        availability_selectors = [
            '#availability',
            '#availability span',
            '#centerCol .a-color-state',
            '#availability .a-declarative'
        ]
        
        availability = None
        for selector in availability_selectors:
            elem = soup.select_one(selector)
            if elem:
                availability = elem.get_text().strip().lower()
                break
        
        is_unavailable = False
        if availability:
            is_unavailable = any([
                'non disponibile' in availability,
                'currently unavailable' in availability,
                'non al momento' in availability,
                'non più disponibile' in availability
            ])
        
        # Estrai titolo
        title_elem = soup.select_one('#productTitle, #title')
        title = title_elem.get_text().strip() if title_elem else None
        
        # Verifica prezzo
        price_whole = soup.select_one('#priceblock_ourprice_row .a-price-whole, #priceblock_dealprice_row .a-price-whole, #centerCol .a-price .a-price-whole')
        price_fraction = soup.select_one('#priceblock_ourprice_row .a-price-fraction, #priceblock_dealprice_row .a-price-fraction, #centerCol .a-price .a-price-fraction')
        
        has_price = price_whole and price_fraction
        price = None
        if has_price:
            price = f"{price_whole.get_text().strip()},{price_fraction.get_text().strip()}€"
        
        if is_unavailable:
            return {
                'asin': asin,
                'status': 'UNAVAILABLE',
                'message': availability[:100] if availability else 'Non disponibile',
                'title': title[:60] if title else None,
                'price': price
            }
        
        if not has_price:
            return {
                'asin': asin,
                'status': 'NO_PRICE',
                'message': 'Prezzo non trovato',
                'title': title[:60] if title else None,
                'price': None
            }
        
        return {
            'asin': asin,
            'status': 'OK',
            'message': 'Disponibile con prezzo',
            'title': title[:60] if title else None,
            'price': price
        }
        
    except requests.exceptions.Timeout:
        return {
            'asin': asin,
            'status': 'TIMEOUT',
            'message': 'Timeout',
            'title': None,
            'price': None
        }
    except Exception as e:
        return {
            'asin': asin,
            'status': 'ERROR',
            'message': str(e),
            'title': None,
            'price': None
        }

def main():
    print("🔍 Verifica disponibilità prodotti Amazon\n")
    
    # Carica ASIN da sent_products.json
    sent_asins = []
    if SENT_PRODUCTS_FILE.exists():
        with open(SENT_PRODUCTS_FILE, 'r') as f:
            data = json.load(f)
            sent_asins = data.get('sent_asins', [])
        print(f"📋 ASIN da sent_products.json: {len(sent_asins)}")
    
    # Opzione: scansiona tutto il sito
    scan_site = input("\nScansionare tutto il sito per trovare tutti i prodotti? (s/n): ").lower().strip()
    
    if scan_site == 's':
        print("\n🔎 Scansione del sito in corso...")
        site_asins = get_all_asins_from_site()
        print(f"\n📊 Totale ASIN trovati sul sito: {len(site_asins)}")
        
        # Unisci con sent_asins
        all_asins = list(set(sent_asins + site_asins))
        print(f"📊 Totale ASIN unici da verificare: {len(all_asins)}")
    else:
        all_asins = sent_asins
        print(f"📋 Verifica di {len(all_asins)} ASIN da sent_products.json")
    
    if not all_asins:
        print("⚠️  Nessun ASIN da verificare.")
        return
    
    print(f"\n⏳ Inizio verifica...")
    
    results = []
    stats = {
        'OK': 0,
        'UNAVAILABLE': 0,
        'NO_PRICE': 0,
        '404': 0,
        'ERROR': 0,
        'TIMEOUT': 0
    }
    
    for i, asin in enumerate(all_asins, 1):
        print(f"\n[{i}/{len(all_asins)}] {asin}...", end=' ')
        result = check_product(asin)
        results.append(result)
        stats[result['status']] += 1
        
        icon = '✅' if result['status'] == 'OK' else '❌'
        print(f"{icon} {result['status']}")
        
        if result['title']:
            print(f"   Titolo: {result['title']}")
        if result['price']:
            print(f"   Prezzo: {result['price']}")
        
        # Pausa per evitare rate limiting
        time.sleep(2)
    
    # Riepilogo
    print("\n" + "="*50)
    print("📊 RIEPILOGO")
    print("="*50)
    for status, count in stats.items():
        if count > 0:
            icon = '✅' if status == 'OK' else '❌'
            print(f"{icon} {status}: {count}")
    
    # Salva risultati
    output = {
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'total_checked': len(all_asins),
        'statistics': stats,
        'results': results
    }
    
    with open(RESULTS_FILE, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n💾 Risultati salvati in: {RESULTS_FILE}")
    
    # Mostra prodotti problematici
    problematic = [r for r in results if r['status'] != 'OK']
    if problematic:
        print(f"\n⚠️  {len(problematic)} prodotti problematici:")
        for r in problematic:
            print(f"   - {r['asin']}: {r['status']} - {r['message']}")

if __name__ == '__main__':
    main()
