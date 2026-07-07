import os
import re
from bs4 import BeautifulSoup
from db import init_db, add_product

def extract_asin_from_url(url):
    """Estrae ASIN da URL Amazon."""
    match = re.search(r'/dp/([A-Z0-9]{10})', url)
    return match.group(1) if match else None

def extract_all_affiliate_links(html_file):
    """Estrae TUTTI i link affiliati da un file HTML."""
    products = []
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
    
    # Trova tutti i link con tag affiliato
    all_links = soup.find_all('a', href=re.compile(r'tag=l0c39-21'))
    
    for a_tag in all_links:
        link = a_tag.get('href', '')
        asin = extract_asin_from_url(link)
        
        # Se non c'è ASIN, usa l'URL come identificatore
        identifier = asin if asin else link[:100]
        
        # Cerca nome vicino al link (h3, h4, h5, title, alt)
        nome = None
        
        # Cerca in elementi vicini
        parent = a_tag.parent
        if parent:
            h3 = parent.find('h3')
            h4 = parent.find('h4')
            h5 = parent.find('h5')
            title = parent.find(class_=re.compile(r'title|name'))
            
            if h3:
                nome = h3.get_text(strip=True)
            elif h4:
                nome = h4.get_text(strip=True)
            elif h5:
                nome = h5.get_text(strip=True)
            elif title:
                nome = title.get_text(strip=True)
        
        # Se non trova nome, usa testo del link
        if not nome:
            nome = a_tag.get_text(strip=True)
        
        # Se ancora vuoto, usa nome generico
        if not nome:
            nome = f"Prodotto {identifier}"
        
        if link:
            products.append({
                'asin': identifier,
                'nome': nome[:200],  # Limita lunghezza nome
                'link': link
            })
    
    return products

def extract_products_from_html(html_file):
    """Estrae prodotti da un file HTML (metodo legacy)."""
    products = []
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
    
    # Trova tutte le card prodotto
    product_cards = soup.find_all('div', class_='product-card')
    
    for card in product_cards:
        # Estrai nome
        h5 = card.find('h5')
        if h5:
            nome = h5.get_text(strip=True)
        else:
            continue
        
        # Estrai link Amazon
        a_tag = card.find('a', href=re.compile(r'amazon\.it/dp/'))
        if a_tag:
            link = a_tag.get('href', '')
            asin = extract_asin_from_url(link)
            
            if asin and link:
                products.append({
                    'asin': asin,
                    'nome': nome,
                    'link': link
                })
    
    return products

def main():
    """Funzione principale - estrae TUTTI i link affiliati."""
    init_db()
    
    # Percorso base del sito
    base_path = '/home/lollo/amazon/public/niches'
    
    # Trova tutti i file HTML nelle nicchie
    html_files = []
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file == 'index.html':
                html_files.append(os.path.join(root, file))
    
    print(f"🔍 Trovati {len(html_files)} file HTML nelle nicchie")
    
    total_products = 0
    added_products = 0
    duplicate_products = 0
    
    for html_file in html_files:
        print(f"\n📁 Elaborazione: {html_file}")
        products = extract_all_affiliate_links(html_file)
        print(f"   📦 Trovati {len(products)} link affiliati")
        
        for product in products:
            total_products += 1
            if add_product(product['asin'], product['nome'], product['link']):
                added_products += 1
            else:
                duplicate_products += 1
    
    print(f"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"📊 RIEPILOGO:")
    print(f"   Totale link affiliati trovati: {total_products}")
    print(f"   ✅ Prodotti aggiunti: {added_products}")
    print(f"   ⚠️ Prodotti duplicati: {duplicate_products}")
    print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

if __name__ == "__main__":
    main()
