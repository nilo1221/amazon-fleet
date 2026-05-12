#!/usr/bin/env python3
import os
import re
import json

# Mappatura site -> categoria
site_to_category = {
    'site_1': 'Cucina',
    'site_2': 'Smart Home',
    'site_3': 'Fitness',
    'site_4': 'Giardinaggio',
    'site_5': 'Ufficio',
    'site_6': 'Fotografia',
    'site_7': 'Pet Care',
    'site_8': 'Caffè',
    'site_9': 'Gaming',
    'site_10': 'Tech',
    'site_11': 'Libri',
    'site_12': 'Benessere',
    'site_13': 'Outdoor',
    'site_14': 'Casa',
    'site_15': 'Viaggi',
    'site_16': 'Smartphone',
    'site_17': 'Cinema & TV',
    'site_18': 'Moda Donna',
    'site_19': 'Benessere & Relax',
    'site_20': 'Moda Uomo',
    'site_21': 'Accessori',
    'site_22': 'DVD & Blu-ray'
}

# Parole chiave per riconoscere prodotti di abbigliamento
clothing_keywords = ['maglione', 'camicia', 'abito', 'blazer', 'pantaloni', 'gonna', 't-shirt', 'jeans', 'felpa', 'leggings', 'vestito', 'giacca', 'cappotto', 'soprabito', 'scarpe', 'borsa']

# Funzione per estrarre keywords dal titolo
def extract_keywords(title):
    # Rimuovi parole comuni e mantieni parole chiave
    stop_words = ['il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'una', 'uno', 'per', 'con', 'da', 'di', 'in', 'a', 'e', 'o', 'su', 'del', 'della', 'dei', 'delle']
    words = title.lower().replace(',', ' ').replace('-', ' ').split()
    keywords = [w for w in words if w not in stop_words and len(w) > 2]
    return ' '.join(keywords)

# Estrai prodotti da tutti i file
products = []

for site_dir in sorted(os.listdir('.')):
    if site_dir.startswith('site_') and os.path.isdir(site_dir):
        index_file = os.path.join(site_dir, 'index.html')
        if os.path.exists(index_file):
            with open(index_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Estrai tutti i titoli dei prodotti
            pattern = r'<h3 class="card-title[^>]*>(.*?)</h3>'
            matches = re.findall(pattern, content, re.DOTALL)
            
            for match in matches:
                # Rimuovi tag HTML
                title = re.sub(r'<[^>]+>', '', match).strip()
                title = re.sub(r'\s+', ' ', title)
                
                if title and title != 'Prodotto':  # Escludi titoli vuoti o generici
                    category = site_to_category.get(site_dir, 'Altro')
                    keywords = extract_keywords(title)
                    
                    # Riconoscimento intelligente della categoria per abbigliamento
                    title_lower = title.lower()
                    if any(keyword in title_lower for keyword in clothing_keywords):
                        if site_dir == 'site_18':
                            category = 'Moda Donna'
                        elif site_dir == 'site_20':
                            category = 'Moda Uomo'
                        elif site_dir == 'site_17':
                            category = 'Cinema & TV'
                        elif site_dir == 'site_19':
                            # Se è in site_19 ma è abbigliamento, assegna a Moda Donna
                            category = 'Moda Donna'
                    
                    products.append({
                        'title': title,
                        'category': category,
                        'site': site_dir,
                        'keywords': keywords
                    })

# Genera il file JavaScript
js_content = """// Indice centralizzato dei prodotti per la ricerca
// Generato automaticamente da tutti i site
const productsIndex = [
"""

for product in products:
    js_content += f"""    {{ title: "{product['title']}", category: "{product['category']}", site: "{product['site']}", keywords: "{product['keywords']}" }},
"""

js_content += """];

// Funzione per cercare prodotti
function searchProducts(query) {
    const lowerQuery = query.toLowerCase().trim();
    if (lowerQuery === '') return [];
    
    return productsIndex.filter(product => {
        const titleMatch = product.title.toLowerCase().includes(lowerQuery);
        const keywordsMatch = product.keywords.toLowerCase().includes(lowerQuery);
        const categoryMatch = product.category.toLowerCase().includes(lowerQuery);
        
        return titleMatch || keywordsMatch || categoryMatch;
    });
}
"""

# Scrivi il file
with open('products-index.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Generati {len(products)} prodotti nell'indice.")
print(f"Categorie trovate: {set([p['category'] for p in products])}")
