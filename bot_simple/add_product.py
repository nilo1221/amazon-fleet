from db import init_db, add_product

def main():
    """Script interattivo per aggiungere prodotti."""
    init_db()
    
    print("=== Aggiungi Prodotto al Monitoraggio ===\n")
    
    asin = input("ASIN del prodotto: ").strip()
    nome = input("Nome del prodotto: ").strip()
    link = input("Link Amazon affiliato: ").strip()
    
    if add_product(asin, nome, link):
        print(f"\n✅ Prodotto aggiunto con successo!")
    else:
        print(f"\n❌ Errore (ASIN già esistente?)")

if __name__ == "__main__":
    main()
