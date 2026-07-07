#!/usr/bin/env python3
import os
import re

niche_data = {
    "casa/arredamento-casa": {"title": "Arredamento Casa - Smart Choices Guide", "desc": "Scopri i migliori prodotti per arredamento casa sotto i 40€", "name": "Prodotti per Arredamento Casa"},
    "casa/cucina-elettrodomestici": {"title": "Cucina & Elettrodomestici - Smart Choices Guide", "desc": "Scopri i migliori elettrodomestici per la cucina sotto i 40€", "name": "Elettrodomestici Cucina"},
    "casa/climatizzazione": {"title": "Climatizzazione - Smart Choices Guide", "desc": "Scopri i migliori prodotti per climatizzazione sotto i 40€", "name": "Prodotti Climatizzazione"},
    "casa/caffe-capsule": {"title": "Caffè e Capsule - Smart Choices Guide", "desc": "Scopri i migliori prodotti per caffè sotto i 40€", "name": "Prodotti Caffè e Capsule"},
    "moda/abbigliamento-lavoro": {"title": "Abbigliamento da Lavoro - Smart Choices Guide", "desc": "Scopri i migliori prodotti per abbigliamento da lavoro sotto i 40€", "name": "Abbigliamento da Lavoro"},
    "moda/abbigliamento-uomo": {"title": "Abbigliamento Uomo - Smart Choices Guide", "desc": "Scopri i migliori prodotti per abbigliamento uomo sotto i 40€", "name": "Abbigliamento Uomo"},
    "moda/abbigliamento-donna": {"title": "Abbigliamento Donna - Smart Choices Guide", "desc": "Scopri i migliori prodotti per abbigliamento donna sotto i 40€", "name": "Abbigliamento Donna"},
    "moda/abbigliamento-bambino": {"title": "Abbigliamento Bambino - Smart Choices Guide", "desc": "Scopri i migliori prodotti per abbigliamento bambino sotto i 40€", "name": "Abbigliamento Bambino"},
    "moda/serie-tv-cinema": {"title": "Serie TV & Cinema - Smart Choices Guide", "desc": "Scopri i migliori prodotti per serie TV e cinema sotto i 40€", "name": "Prodotti Serie TV e Cinema"},
    "sport/abbigliamento-sportivo": {"title": "Abbigliamento Sportivo - Smart Choices Guide", "desc": "Scopri i migliori prodotti per sport sotto i 40€", "name": "Abbigliamento Sportivo"},
    "tech": {"title": "Tech & Elettronica - Smart Choices Guide", "desc": "Scopri i migliori prodotti tech sotto i 40€", "name": "Prodotti Tech e Elettronica"},
    "tech/elite-gaming-gear": {"title": "Elite Gaming Gear - Smart Choices Guide", "desc": "Scopri i migliori prodotti per gaming sotto i 40€", "name": "Gaming Gear Professionale"},
    "tech/smartphone-tech": {"title": "Smartphone & Tech - Smart Choices Guide", "desc": "Scopri i migliori accessori smartphone sotto i 40€", "name": "Accessori Smartphone"},
    "manga-anime": {"title": "Manga & Anime - Smart Choices Guide", "desc": "Scopri i migliori prodotti manga e anime sotto i 40€", "name": "Prodotti Manga e Anime"},
    "giochi-tavolo": {"title": "Giochi da Tavolo - Smart Choices Guide", "desc": "Scopri i migliori giochi da tavolo sotto i 40€", "name": "Giochi da Tavolo"},
    "outdoor-camping": {"title": "Outdoor & Camping - Smart Choices Guide", "desc": "Scopri i migliori prodotti per outdoor sotto i 40€", "name": "Prodotti Outdoor e Camping"},
    "viaggi-vacanze": {"title": "Viaggi & Vacanze - Smart Choices Guide", "desc": "Scopri i migliori prodotti per viaggi sotto i 40€", "name": "Prodotti per Viaggi e Vacanze"},
    "raccomandazioni": {"title": "Raccomandazioni - Smart Choices Guide", "desc": "Scopri le nostre raccomandazioni sotto i 40€", "name": "Prodotti Raccomandati"}
}

base_dir = "/home/lollo/amazon/public/niches"

for niche_path, data in niche_data.items():
    file_path = os.path.join(base_dir, niche_path, "index.html")
    
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    niche_slug = niche_path.replace('/', '-')
    canonical = f"https://smart-choices-guide.vercel.app/niches/{niche_path}/"
    
    # Schema markup JSON-LD
    schema_block = f'''
    <!-- Structured Data JSON-LD -->
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "{data['title']}",
        "description": "{data['desc']}",
        "url": "{canonical}",
        "inLanguage": "it-IT",
        "about": {{
            "@type": "Thing",
            "name": "{data['name']}"
        }}
    }}
    </script>
    '''
    
    # Rimuovi Schema esistente se presente
    content = re.sub(r'<!-- Structured Data JSON-LD -->.*?</script>.*?\n', '', content, flags=re.DOTALL)
    
    # Aggiungi nuovo Schema dopo Twitter Card
    if '<meta name="twitter:image"' in content:
        content = re.sub(
            r'(<meta name="twitter:image".*?>)',
            f'\1{schema_block}',
            content
        )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ {niche_path}")

print("\n🎉 Schema markup JSON-LD aggiunto!")
