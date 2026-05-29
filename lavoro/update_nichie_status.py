#!/usr/bin/env python3
"""
Script per la gestione del ciclo di vita delle nicchie.
Aggiorna automaticamente lo stato delle nicchie da LIVE a STANDARD dopo 24 ore.
"""

import json
from datetime import datetime, timezone, timedelta
from pathlib import Path

# Configurazione
NICHIE_DATA_FILE = Path(__file__).parent / "nichie-data.json"
LIVE_DURATION_HOURS = 24

def load_nichie_data():
    """Carica i dati delle nicchie dal file JSON."""
    try:
        with open(NICHIE_DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Errore: File {NICHIE_DATA_FILE} non trovato.")
        return None
    except json.JSONDecodeError as e:
        print(f"Errore nel parsing JSON: {e}")
        return None

def save_nichie_data(data):
    """Salva i dati delle nicchie nel file JSON."""
    try:
        with open(NICHIE_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("Dati salvati con successo.")
        return True
    except Exception as e:
        print(f"Errore nel salvataggio: {e}")
        return False

def update_nichie_status():
    """Aggiorna lo stato delle nicchie basandosi sulla data di creazione."""
    data = load_nichie_data()
    if not data:
        return False
    
    updated = False
    now = datetime.now(timezone.utc)
    live_threshold = timedelta(hours=LIVE_DURATION_HOURS)
    
    for nicchia in data['nichie']:
        if nicchia['stato'] == 'LIVE':
            # Parse data_creazione
            try:
                creation_date = datetime.fromisoformat(nicchia['data_creazione'].replace('Z', '+00:00'))
                if creation_date.tzinfo is None:
                    creation_date = creation_date.replace(tzinfo=timezone.utc)
                
                # Calcola differenza
                time_since_creation = now - creation_date
                
                # Se più vecchia di 24 ore, aggiorna stato
                if time_since_creation > live_threshold:
                    nicchia['stato'] = 'STANDARD'
                    nicchia['is_featured'] = False
                    print(f"Aggiornato: {nicchia['nome_nicchia']} da LIVE a STANDARD")
                    updated = True
                else:
                    hours_remaining = (live_threshold - time_since_creation).total_seconds() / 3600
                    print(f"{nicchia['nome_nicchia']}: LIVE - {hours_remaining:.1f} ore rimanenti")
                    
            except Exception as e:
                print(f"Errore nel parsing data per {nicchia['nome_nicchia']}: {e}")
    
    if updated:
        return save_nichie_data(data)
    else:
        print("Nessun aggiornamento necessario.")
        return True

def main():
    """Funzione principale."""
    print("=== Aggiornamento stato nicchie ===")
    print(f"Durata LIVE: {LIVE_DURATION_HOURS} ore")
    print(f"Data/ora corrente: {datetime.now(timezone.utc).isoformat()}")
    print()
    
    success = update_nichie_status()
    
    if success:
        print("\n✓ Aggiornamento completato con successo")
    else:
        print("\n✗ Aggiornamento fallito")
        exit(1)

if __name__ == "__main__":
    main()
