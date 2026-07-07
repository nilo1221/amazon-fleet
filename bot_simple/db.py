import sqlite3
from datetime import datetime, timedelta
import os

def init_db():
    """Inizializza il database con la tabella monitored_products."""
    os.makedirs(os.path.dirname("data/"), exist_ok=True)
    
    conn = sqlite3.connect('data/bot_database.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS monitored_products (
                        id INTEGER PRIMARY KEY,
                        asin TEXT UNIQUE,
                        nome TEXT,
                        link TEXT,
                        last_posted TIMESTAMP)''')
    conn.commit()
    conn.close()

def add_product(asin, nome, link):
    """Aggiunge un prodotto alla lista di monitoraggio."""
    conn = sqlite3.connect('data/bot_database.db')
    cursor = conn.cursor()
    try:
        cursor.execute('''INSERT INTO monitored_products (asin, nome, link) 
                        VALUES (?, ?, ?)''', (asin, nome, link))
        conn.commit()
        print(f"✅ Prodotto aggiunto: {asin}")
        return True
    except sqlite3.IntegrityError:
        print(f"❌ Prodotto {asin} già esistente")
        return False
    finally:
        conn.close()

def get_all_products():
    """Recupera tutti i prodotti monitorati."""
    conn = sqlite3.connect('data/bot_database.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM monitored_products')
    products = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return products

def can_post(product_id, min_hours=6):
    """Verifica se può postare (minimo X ore dall'ultimo post)."""
    conn = sqlite3.connect('data/bot_database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT last_posted FROM monitored_products WHERE id = ?', (product_id,))
    result = cursor.fetchone()
    conn.close()
    
    if not result or not result[0]:
        return True
    
    last_posted = datetime.fromisoformat(result[0].replace('Z', '+00:00'))
    return datetime.now() - last_posted > timedelta(hours=min_hours)

def update_last_posted(product_id):
    """Aggiorna il timestamp dell'ultimo post."""
    conn = sqlite3.connect('data/bot_database.db')
    cursor = conn.cursor()
    cursor.execute('UPDATE monitored_products SET last_posted = ? WHERE id = ?', 
                   (datetime.now().isoformat(), product_id))
    conn.commit()
    conn.close()
