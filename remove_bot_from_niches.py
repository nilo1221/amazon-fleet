#!/usr/bin/env python3
import os
import re

# Array di file da modificare
FILES = [
    "abbigliamento-lavoro/index.html",
    "abbigliamento-serie-tv-film/index.html",
    "accessori-moda/index.html",
    "arredamento-casa/index.html",
    "benessere-cura-personale/index.html",
    "benessere-cura-personale/benessere-spa/index.html",
    "benessere-cura-personale/capelli/index.html",
    "benessere-cura-personale/integratori/index.html",
    "benessere-cura-personale/skincare/index.html",
    "biciclette-mobilita/index.html",
    "dvd-bluray/index.html",
    "elite-gaming-gear/index.html",
    "fitness-casa/index.html",
    "fotografia-mobile/index.html",
    "giochi-da-tavolo/index.html",
    "libri-ereader/index.html",
    "manga-anime/index.html",
    "mare-spiaggia/index.html",
    "moda-donna/index.html",
    "moda-uomo/index.html",
    "musica-vinili/index.html",
    "outdoor-camping/index.html",
    "parrucchiere-barbiere/index.html",
    "snack-bevande/index.html",
    "ufficio-produttivo/index.html",
    "privacy.html",
    "disclaimer.html",
    "contact.html",
]

# Directory base
BASE_DIR = "/home/lollo/amazon/lavoro"

def remove_bot_from_file(file_path):
    """Rimuove il bot da un file HTML"""
    if not os.path.exists(file_path):
        print(f"File non trovato: {file_path}")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Rimuovi link CSS del bot
    content = re.sub(r'<link rel="stylesheet" href="../bot/ai-chat-simple\.css">\n', '', content)
    content = re.sub(r'<link rel="stylesheet" href="../bot/ai-chat-simple\.css">', '', content)
    
    # Rimuovi script del bot
    content = re.sub(r'\s*<!-- Bot AI Script.*?-->\s*<script src="../bot/combo-database\.js"></script>\s*<script src="../bot/ai-chat-simple\.js"></script>\s*', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*<script src="../bot/combo-database\.js"></script>\s*<script src="../bot/ai-chat-simple\.js"></script>\s*', '', content, flags=re.DOTALL)
    
    # Rimuovi AI Chat Button
    content = re.sub(r'\s*<!-- AI Chat Button -->\s*<div id="ai-chat-button"[^>]*>.*?</div>\s*', '', content, flags=re.DOTALL)
    
    # Rimuovi AI Chat Window
    content = re.sub(r'\s*<!-- AI Chat Window -->\s*<div id="ai-chat-window">.*?</div>\s*', '', content, flags=re.DOTALL)
    
    # Rimuovi commento Bot AI CSS
    content = re.sub(r'\s*<!-- Bot AI CSS -->\s*', '', content)
    
    if content == original_content:
        print(f"Nessuna modifica necessaria in: {file_path}")
        return True
    
    # Scrivi il file modificato
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Bot rimosso da: {file_path}")
    return True

def main():
    print("Inizio rimozione bot dalle nicchie...")
    
    for file in FILES:
        file_path = os.path.join(BASE_DIR, file)
        print(f"\nElaborazione: {file}")
        remove_bot_from_file(file_path)
    
    print("\nScript completato.")

if __name__ == "__main__":
    main()
