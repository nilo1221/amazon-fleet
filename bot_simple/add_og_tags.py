#!/usr/bin/env python3
import os
import re

niche_data = {
    "casa/arredamento-casa": {"title": "Arredamento Casa - Smart Choices Guide | Mobili e Decor", "desc": "Scopri i migliori prodotti per arredamento casa sotto i 40€"},
    "casa/cucina-elettrodomestici": {"title": "Cucina & Elettrodomestici - Smart Choices Guide", "desc": "Scopri i migliori elettrodomestici per la cucina sotto i 40€"},
    "casa/climatizzazione": {"title": "Climatizzazione - Smart Choices Guide", "desc": "Scopri i migliori prodotti per climatizzazione sotto i 40€"},
    "casa/caffe-capsule": {"title": "Caffè e Capsule - Smart Choices Guide", "desc": "Scopri i migliori prodotti per caffè sotto i 40€"},
    "moda/abbigliamento-lavoro": {"title": "Abbigliamento da Lavoro - Smart Choices Guide", "desc": "Scopri i migliori prodotti per abbigliamento da lavoro sotto i 40€"},
    "moda/abbigliamento-uomo": {"title": "Abbigliamento Uomo - Smart Choices Guide", "desc": "Scopri i migliori prodotti per abbigliamento uomo sotto i 40€"},
    "moda/abbigliamento-donna": {"title": "Abbigliamento Donna - Smart Choices Guide", "desc": "Scopri i migliori prodotti per abbigliamento donna sotto i 40€"},
    "moda/abbigliamento-bambino": {"title": "Abbigliamento Bambino - Smart Choices Guide", "desc": "Scopri i migliori prodotti per abbigliamento bambino sotto i 40€"},
    "moda/serie-tv-cinema": {"title": "Serie TV & Cinema - Smart Choices Guide", "desc": "Scopri i migliori prodotti per serie TV e cinema sotto i 40€"},
    "sport/abbigliamento-sportivo": {"title": "Abbigliamento Sportivo - Smart Choices Guide", "desc": "Scopri i migliori prodotti per sport sotto i 40€"},
    "tech": {"title": "Tech & Elettronica - Smart Choices Guide", "desc": "Scopri i migliori prodotti tech sotto i 40€"},
    "tech/elite-gaming-gear": {"title": "Elite Gaming Gear - Smart Choices Guide", "desc": "Scopri i migliori prodotti per gaming sotto i 40€"},
    "tech/smartphone-tech": {"title": "Smartphone & Tech - Smart Choices Guide", "desc": "Scopri i migliori accessori smartphone sotto i 40€"},
    "manga-anime": {"title": "Manga & Anime - Smart Choices Guide", "desc": "Scopri i migliori prodotti manga e anime sotto i 40€"},
    "giochi-tavolo": {"title": "Giochi da Tavolo - Smart Choices Guide", "desc": "Scopri i migliori giochi da tavolo sotto i 40€"},
    "outdoor-camping": {"title": "Outdoor & Camping - Smart Choices Guide", "desc": "Scopri i migliori prodotti per outdoor sotto i 40€"},
    "viaggi-vacanze": {"title": "Viaggi & Vacanze - Smart Choices Guide", "desc": "Scopri i migliori prodotti per viaggi sotto i 40€"},
    "raccomandazioni": {"title": "Raccomandazioni - Smart Choices Guide", "desc": "Scopri le nostre raccomandazioni sotto i 40€"}
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
    
    # Open Graph tags
    og_block = f'''
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="{data['title']}">
    <meta property="og:description" content="{data['desc']}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{canonical}">
    <meta property="og:image" content="https://smart-choices-guide.vercel.app/assets/images/og-{niche_slug}.jpg">
    <meta property="og:locale" content="it_IT">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{data['title']}">
    <meta name="twitter:description" content="{data['desc']}">
    <meta name="twitter:image" content="https://smart-choices-guide.vercel.app/assets/images/og-{niche_slug}.jpg">
    '''
    
    # Rimuovi Open Graph esistente se presente
    content = re.sub(r'<!-- Open Graph Meta Tags -->.*?<!-- Twitter Card Meta Tags -->.*?-->.*?\n', '', content, flags=re.DOTALL)
    
    # Aggiungi nuovo Open Graph dopo canonical
    if '<link rel="canonical"' in content:
        content = re.sub(
            r'(<link rel="canonical".*?>)',
            f'\1{og_block}',
            content
        )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ {niche_path}")

print("\n🎉 Open Graph e Twitter Card aggiunti!")
