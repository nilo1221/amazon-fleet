#!/usr/bin/env python3
import os
import re

niche_data = {
    "casa/arredamento-casa": {
        "title": "Arredamento Casa - Smart Choices Guide | Mobili e Decor per la Tua Casa",
        "desc": "Scopri i migliori prodotti per arredamento casa: mobili, decor, illuminazione, tappeti. Trasforma i tuoi spazi con prodotti di qualità sotto i 40€ con recensioni Amazon.",
        "kw": "arredamento casa, mobili, decor casa, illuminazione, tappeti, home decor, furniture, interior design"
    },
    "casa/cucina-elettrodomestici": {
        "title": "Cucina & Elettrodomestici - Smart Choices Guide | Robot, Frullatori e Accessori",
        "desc": "Scopri i migliori elettrodomestici per la cucina: robot da cucina, frullatori, tostapane, accessori. Cucina come uno chef sotto i 40€ con recensioni Amazon.",
        "kw": "cucina, elettrodomestici, robot cucina, frullatore, tostapane, accessori cucina, kitchen appliances"
    },
    "casa/climatizzazione": {
        "title": "Climatizzazione - Smart Choices Guide | Ventilatori e Umidificatori",
        "desc": "Scopri i migliori prodotti per climatizzazione: ventilatori, umidificatori, deumidificatori. Comfort ideale per la tua casa sotto i 40€ con recensioni Amazon.",
        "kw": "climatizzazione, ventilatore, umidificatore, deumidificatore, aria condizionata, climate control"
    },
    "casa/caffe-capsule": {
        "title": "Caffè e Capsule - Smart Choices Guide | Macchine Caffè e Accessori Barista",
        "desc": "Scopri i migliori prodotti per caffè: macchine caffè, capsule compatibili, accessori barista. Prepara il caffè perfetto sotto i 40€ con recensioni Amazon.",
        "kw": "caffè, capsule, macchina caffè, capsule compatibili, accessori barista, coffee maker, espresso"
    },
    "moda/abbigliamento-lavoro": {
        "title": "Abbigliamento da Lavoro - Smart Choices Guide | Tute e Scarpe di Sicurezza",
        "desc": "Scopri i migliori prodotti per abbigliamento da lavoro: tute, scarpe di sicurezza, guanti, caschi. Protezione professionale sotto i 40€ con recensioni Amazon.",
        "kw": "abbigliamento lavoro, tute lavoro, scarpe sicurezza, guanti lavoro, casco, workwear, safety shoes"
    },
    "moda/abbigliamento-uomo": {
        "title": "Abbigliamento Uomo - Smart Choices Guide | Camicie, Pantaloni e Casual",
        "desc": "Scopri i migliori prodotti per abbigliamento uomo: camicie, pantaloni, jeans, casual. Stile e qualità sotto i 40€ con recensioni Amazon.",
        "kw": "abbigliamento uomo, camicie uomo, pantaloni uomo, jeans uomo, casual uomo, men's fashion"
    },
    "moda/abbigliamento-donna": {
        "title": "Abbigliamento Donna - Smart Choices Guide | Vestiti, Bluse e Moda",
        "desc": "Scopri i migliori prodotti per abbigliamento donna: vestiti, bluse, pantaloni, moda. Eleganza e stile sotto i 40€ con recensioni Amazon.",
        "kw": "abbigliamento donna, vestiti donna, bluse donna, pantaloni donna, moda donna, women's fashion"
    },
    "moda/abbigliamento-bambino": {
        "title": "Abbigliamento Bambino - Smart Choices Guide | Vestiti e Scarpe per Bambini",
        "desc": "Scopri i migliori prodotti per abbigliamento bambino: vestiti, scarpe, accessori. Comfort e qualità sotto i 40€ con recensioni Amazon.",
        "kw": "abbigliamento bambino, vestiti bambini, scarpe bambini, abbigliamento neonato, kids fashion"
    },
    "moda/serie-tv-cinema": {
        "title": "Serie TV & Cinema - Smart Choices Guide | Merchandise e Funko Pop",
        "desc": "Scopri i migliori prodotti per serie TV e cinema: merchandise, costumi, Funko Pop. I tuoi personaggi preferiti sotto i 40€ con recensioni Amazon.",
        "kw": "serie tv, cinema, merchandise, costumi, funko pop, collezionabili, tv shows, movies"
    },
    "sport/abbigliamento-sportivo": {
        "title": "Abbigliamento Sportivo - Smart Choices Guide | Grigie Ciclismo e Running",
        "desc": "Scopri i migliori prodotti per sport: grigie ciclismo, running, fitness, abbigliamento tecnico. Performance al top sotto i 40€ con recensioni Amazon.",
        "kw": "abbigliamento sportivo, grigie ciclismo, running, fitness, abbigliamento tecnico, sportswear, cycling"
    },
    "tech": {
        "title": "Tech & Elettronica - Smart Choices Guide | Accessori e Gadget",
        "desc": "Scopri i migliori prodotti tech: accessori smartphone, power bank, gadget. Tecnologia mobile sotto i 40€ con recensioni Amazon.",
        "kw": "tech, elettronica, accessori smartphone, power bank, gadget, tecnologia mobile, phone accessories"
    },
    "tech/elite-gaming-gear": {
        "title": "Elite Gaming Gear - Smart Choices Guide | Cuffie, Tastiere e Mouse Gaming",
        "desc": "Scopri i migliori prodotti per gaming: cuffie gaming, tastiere, mouse, accessori. Hardware professionale sotto i 40€ con recensioni Amazon.",
        "kw": "gaming, gaming gear, cuffie gaming, tastiera gaming, mouse gaming, esports, gaming hardware"
    },
    "tech/smartphone-tech": {
        "title": "Smartphone & Tech - Smart Choices Guide | Accessori e Custodie",
        "desc": "Scopri i migliori accessori smartphone: custodie, power bank, caricabatterie. Proteggi il tuo telefono sotto i 40€ con recensioni Amazon.",
        "kw": "smartphone, accessori smartphone, custodia, power bank, caricabatterie, phone accessories, mobile tech"
    },
    "manga-anime": {
        "title": "Manga & Anime - Smart Choices Guide | Fumetti e Merchandise",
        "desc": "Scopri i migliori prodotti manga e anime: fumetti, merchandise, collezionabili. Per appassionati sotto i 40€ con recensioni Amazon.",
        "kw": "manga, anime, fumetti, merchandise, collezionabili, action figure, anime merchandise"
    },
    "giochi-tavolo": {
        "title": "Giochi da Tavolo - Smart Choices Guide | Giochi di Ruolo e di Società",
        "desc": "Scopri i migliori giochi da tavolo, giochi di ruolo e di società. Divertimento garantito sotto i 40€ con recensioni Amazon.",
        "kw": "giochi da tavolo, giochi di ruolo, giochi di società, board games, rpg, giochi famiglia"
    },
    "outdoor-camping": {
        "title": "Outdoor & Camping - Smart Choices Guide | Tende, Zaini e Accessori",
        "desc": "Scopri i migliori prodotti per outdoor: tende, zaini, sacchi a pelo. Avventure all'aperto sotto i 40€ con recensioni Amazon.",
        "kw": "outdoor, camping, tenda, zaino, sacco a pelo, escursioni, trekking, camping gear"
    },
    "viaggi-vacanze": {
        "title": "Viaggi & Vacanze - Smart Choices Guide | Zaini, Valigie e Accessori",
        "desc": "Scopri i migliori prodotti per viaggi: zaini, valigie, organizer. Viaggia con stile sotto i 40€ con recensioni Amazon.",
        "kw": "viaggi, vacanze, zaino viaggio, valigia, bagaglio, organizer viaggi, travel, backpack"
    },
    "raccomandazioni": {
        "title": "Raccomandazioni - Smart Choices Guide | I Migliori Prodotti Selezionati",
        "desc": "Scopri le nostre raccomandazioni: i migliori prodotti selezionati dai nostri esperti. Qualità garantita sotto i 40€ con recensioni Amazon.",
        "kw": "raccomandazioni, migliori prodotti, selezione esperti, consigli acquisto, best products"
    }
}

base_dir = "/home/lollo/amazon/public/niches"

for niche_path, data in niche_data.items():
    file_path = os.path.join(base_dir, niche_path, "index.html")
    
    if not os.path.exists(file_path):
        print(f"⚠️  File non trovato: {file_path}")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Aggiorna title
    content = re.sub(r'<title>.*?</title>', f"<title>{data['title']}</title>", content)
    
    # Aggiorna description
    content = re.sub(r'<meta name="description".*?>', f'<meta name="description" content="{data["desc"]}">', content)
    
    # Aggiungi keywords se non esiste
    if '<meta name="keywords"' not in content:
        content = re.sub(
            r'(<meta name="description".*?>)',
            f'\1\n    <meta name="keywords" content="{data["kw"]}">',
            content
        )
    else:
        content = re.sub(r'<meta name="keywords".*?>', f'<meta name="keywords" content="{data["kw"]}">', content)
    
    # Aggiungi altri meta se non esistono
    meta_to_add = [
        ('<meta name="author"', '<meta name="author" content="Smart Choices Guide">'),
        ('<meta name="robots"', '<meta name="robots" content="index, follow">'),
        ('<meta name="googlebot"', '<meta name="googlebot" content="index, follow">'),
        ('<meta name="language"', '<meta name="language" content="Italian">'),
        ('<meta name="geo.region"', '<meta name="geo.region" content="IT">'),
        ('<meta name="geo.placename"', '<meta name="geo.placename" content="Italia">'),
    ]
    
    for meta_check, meta_add in meta_to_add:
        if meta_check not in content:
            content = re.sub(
                r'(<meta name="keywords".*?>)',
                f'\1\n    {meta_add}',
                content
            )
    
    # Aggiungi canonical URL
    niche_slug = niche_path.replace('/', '-')
    canonical = f"https://smart-choices-guide.vercel.app/niches/{niche_path}/"
    if '<link rel="canonical"' not in content:
        content = re.sub(
            r'(<meta name="geo.placename".*?>)',
            f'\1\n    <link rel="canonical" href="{canonical}">',
            content
        )
    else:
        content = re.sub(r'<link rel="canonical".*?>', f'<link rel="canonical" href="{canonical}">', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ {niche_path}")

print("\n🎉 SEO aggiornato per tutte le nicchie!")
