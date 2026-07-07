#!/usr/bin/env python3
"""
Script per aggiungere manualmente prodotti alla white-list del bot.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.database.db_manager import DatabaseManager
from src.utils.logger import setup_logger

logger = setup_logger("add_product")

def main():
    """Funzione principale per aggiungere prodotti."""
    db = DatabaseManager("data/bot_database.db")
    
    print("=== Aggiunta Prodotto alla White-List ===\n")
    
    asin = input("ASIN del prodotto: ").strip()
    nome = input("Nome del prodotto: ").strip()
    soglia = float(input("Soglia di prezzo (€): ").strip())
    
    if db.add_product(asin, nome, soglia):
        print(f"\n✅ Prodotto aggiunto con successo!")
        print(f"ASIN: {asin}")
        print(f"Nome: {nome}")
        print(f"Soglia: €{soglia:.2f}")
    else:
        print(f"\n❌ Errore nell'aggiungere il prodotto (ASIN già esistente?)")

if __name__ == "__main__":
    main()
