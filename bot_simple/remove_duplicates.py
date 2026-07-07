import sqlite3

def remove_duplicates():
    """Rimuove i prodotti duplicati dal database."""
    conn = sqlite3.connect('data/bot_database.db')
    cursor = conn.cursor()
    
    # Trova duplicati
    cursor.execute('''
        SELECT asin, COUNT(*) as count
        FROM monitored_products
        GROUP BY asin
        HAVING count > 1
    ''')
    
    duplicates = cursor.fetchall()
    
    if not duplicates:
        print("Nessun duplicato trovato")
        conn.close()
        return
    
    print(f"Trovati {len(duplicates)} ASIN duplicati:")
    for asin, count in duplicates:
        print(f"  {asin}: {count} occorrenze")
    
    # Rimuovi duplicati (mantieni la prima occorrenza con id minore)
    for asin, count in duplicates:
        cursor.execute('''
            DELETE FROM monitored_products
            WHERE asin = ? AND id NOT IN (
                SELECT MIN(id) FROM monitored_products WHERE asin = ?
            )
        ''', (asin, asin))
        
        deleted = cursor.rowcount
        print(f"  Rimossi {deleted} duplicati per {asin}")
    
    conn.commit()
    
    # Verifica finale
    cursor.execute('SELECT COUNT(*) FROM monitored_products')
    total = cursor.fetchone()[0]
    print(f"\nTotale prodotti nel database: {total}")
    
    conn.close()
    print("✅ Duplicati rimossi con successo")

if __name__ == "__main__":
    remove_duplicates()
