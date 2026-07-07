#!/usr/bin/env python3
import os
import re

niche_data = {
    "mare": {"title": "Mare & Spiaggia - Smart Choices Guide | Tende, Occhiali e Accessori", "desc": "Scopri i migliori prodotti per il mare: tende spiaggia, occhiali sole, tappetini sotto i 40€", "kw": "mare, spiaggia, tenda spiaggia, occhiali sole, tappetino spiaggia"},
    "viaggi-vacanze": {"title": "Viaggi & Vacanze - Smart Choices Guide | Zaini, Bagagli e Accessori", "desc": "Scopri i migliori prodotti per viaggi: zaini, valigie, organizer sotto i 40€", "kw": "viaggi, vacanze, zaino viaggio, valigia, bagaglio"},
    "outdoor-camping": {"title": "Outdoor & Camping - Smart Choices Guide | Tende, Zaini e Accessori", "desc": "Scopri i migliori prodotti per outdoor: tende, zaini, sacchi a pelo sotto i 40€", "kw": "outdoor, camping, tenda, zaino, sacco a pelo"},
    "giochi-tavolo": {"title": "Giochi da Tavolo - Smart Choices Guide | Giochi di Ruolo e di Società", "desc": "Scopri i migliori giochi da tavolo e giochi di ruolo sotto i 40€", "kw": "giochi da tavolo, giochi di ruolo, giochi di società, board games"},
    "manga-anime": {"title": "Manga & Anime - Smart Choices Guide | Collezionabili e Merchandise", "desc": "Scopri i migliori prodotti manga e anime sotto i 40€", "kw": "manga, anime, fumetti, merchandise, collezionabili"},
}

for root, dirs, files in os.walk("/home/lollo/amazon/public/niches"):
    for file in files:
        if file == "index.html":
            path = os.path.join(root, file)
            rel = os.path.relpath(path, "/home/lollo/amazon/public/niches")
            niche = rel.split("/")[0].replace("/", "-")
            
            if niche in niche_data:
                with open(path, 'r') as f:
                    content = f.read()
                
                old_title = re.search(r'<title>.*?</title>', content).group()
                new_title = f"<title>{niche_data[niche]['title']}</title>"
                content = content.replace(old_title, new_title)
                
                old_desc = re.search(r'<meta name="description".*?>', content).group()
                new_desc = f'<meta name="description" content="{niche_data[niche]["desc"]}">'
                content = content.replace(old_desc, new_desc)
                
                with open(path, 'w') as f:
                    f.write(content)
                print(f"✅ {niche}")

print("SEO aggiornato!")
