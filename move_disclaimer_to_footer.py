#!/usr/bin/env python3
import os
import re

# Pattern del disclaimer da rimuovere (sopra navbar)
DISCLAIMER_REMOVE_PATTERN = r'''    <!-- Amazon Affiliate Disclaimer Banner -->
    <div class="amazon-disclaimer bg-dark bg-opacity-50 p-3 rounded border border-secondary">
        <p class="mb-2 text-warning fw-bold"><i class="fab fa-amazon me-2"></i>Disclaimer Amazon Associates</p>
        <p class="text-white-50 mb-0">In qualità di Associato Amazon, guadagniamo da acquisti idonei. I prezzi e la disponibilità dei prodotti sono accurati alla data/ora indicata e sono soggetti a modifiche. Qualsiasi prezzo e informazioni sulla disponibilità visualizzati sul sito Amazon al momento dell'acquisto si applicheranno all'acquisto di questo prodotto. Questo sito è partecipante al Programma Affiliazione Amazon EU, un programma di affiliazione che permette ai siti di percepire una commissione pubblicitaria pubblicizzando e fornendo link al sito Amazon.</p>
    </div>

'''

# Nuovo disclaimer da aggiungere nel footer (dentro container text-center)
DISCLAIMER_FOOTER = '''            
            <!-- Amazon Affiliate Disclaimer -->
            <div class="mt-3">
                <div class="amazon-disclaimer bg-dark bg-opacity-50 p-3 rounded border border-secondary">
                    <p class="mb-2 text-warning fw-bold"><i class="fab fa-amazon me-2"></i>Disclaimer Amazon Associates</p>
                    <p class="text-white-50 mb-0">In qualità di Associato Amazon, guadagniamo da acquisti idonei. I prezzi e la disponibilità dei prodotti sono accurati alla data/ora indicata e sono soggetti a modifiche. Qualsiasi prezzo e informazioni sulla disponibilità visualizzati sul sito Amazon al momento dell'acquisto si applicheranno all'acquisto di questo prodotto. Questo sito è partecipante al Programma Affiliazione Amazon EU, un programma di affiliazione che permette ai siti di percepire una commissione pubblicitaria pubblicizzando e fornendo link al sito Amazon.</p>
                </div>
            </div>'''

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

def move_disclaimer_to_footer(file_path):
    """Sposta il disclaimer Amazon da sopra navbar al footer"""
    if not os.path.exists(file_path):
        print(f"File non trovato: {file_path}")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Rimuovi sempre il disclaimer sopra navbar se presente
    if re.search(DISCLAIMER_REMOVE_PATTERN, content, re.DOTALL):
        content = re.sub(DISCLAIMER_REMOVE_PATTERN, '', content, flags=re.DOTALL)
        print(f"Disclaimer rimosso da sopra navbar in: {file_path}")
    else:
        print(f"Nessun disclaimer sopra navbar trovato in: {file_path}")
    
    # Verifica se il disclaimer è già nel footer nella posizione corretta
    if 'Amazon Affiliate Disclaimer' in content and '</footer>' in content:
        # Controlla se il disclaimer è già prima di </footer>
        if 'Amazon Affiliate Disclaimer' in content.split('</footer>')[0]:
            print(f"Disclaimer già nel footer in: {file_path}")
            return True
    
    # Aggiungi il disclaimer nel footer (dentro container text-center, prima di </div> del container)
    # Cerca il pattern del footer con container text-center
    footer_pattern = r'(<footer[^>]*>.*?<div class="container text-center">.*?)(</div>\s*</footer>)'
    if re.search(footer_pattern, content, re.DOTALL):
        content = re.sub(footer_pattern, r'\1' + DISCLAIMER_FOOTER + r'\2', content, flags=re.DOTALL)
        print(f"Disclaimer aggiunto nel footer in: {file_path}")
    elif '</footer>' in content:
        # Fallback: inserisci prima di </footer>
        content = content.replace('</footer>', DISCLAIMER_FOOTER + '\n    </footer>')
        print(f"Disclaimer aggiunto nel footer (fallback) in: {file_path}")
    else:
        print(f"Nessun footer trovato in: {file_path}")
        return False
    
    # Scrivi il file modificato
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Completato: {file_path}")
    return True

def main():
    print("Inizio spostamento disclaimer Amazon nel footer...")
    
    for file in FILES:
        file_path = os.path.join(BASE_DIR, file)
        print(f"\nElaborazione: {file}")
        move_disclaimer_to_footer(file_path)
    
    print("\nScript completato.")

if __name__ == "__main__":
    main()
