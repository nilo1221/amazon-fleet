#!/usr/bin/env python3
import sqlite3
from datetime import datetime

DB_PATH = 'data/telegram_links.db'

def init_telegram_links_db():
    """Inizializza il database per tracciare i link inviati su Telegram."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sent_links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asin TEXT NOT NULL,
            product_name TEXT,
            affiliate_link TEXT NOT NULL,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            message_type TEXT,  -- 'photo' o 'text'
            channel_id TEXT,
            price REAL
        )
    ''')
    
    # Indici per query veloci
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_asin ON sent_links(asin)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_sent_at ON sent_links(sent_at)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_channel ON sent_links(channel_id)')
    
    conn.commit()
    conn.close()
    print("✅ Database telegram_links.db inizializzato")

def add_sent_link(asin, product_name, affiliate_link, message_type, channel_id, price=None):
    """Aggiunge un link inviato al database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO sent_links (asin, product_name, affiliate_link, message_type, channel_id, price)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (asin, product_name, affiliate_link, message_type, channel_id, price))
    
    conn.commit()
    conn.close()

def get_sent_links(asin=None, limit=100):
    """Ottiene i link inviati, opzionalmente filtrati per ASIN."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    if asin:
        cursor.execute('''
            SELECT asin, product_name, affiliate_link, sent_at, message_type, channel_id, price
            FROM sent_links
            WHERE asin = ?
            ORDER BY sent_at DESC
            LIMIT ?
        ''', (asin, limit))
    else:
        cursor.execute('''
            SELECT asin, product_name, affiliate_link, sent_at, message_type, channel_id, price
            FROM sent_links
            ORDER BY sent_at DESC
            LIMIT ?
        ''', (limit,))
    
    results = cursor.fetchall()
    conn.close()
    
    return [
        {
            'asin': row[0],
            'product_name': row[1],
            'affiliate_link': row[2],
            'sent_at': row[3],
            'message_type': row[4],
            'channel_id': row[5],
            'price': row[6]
        }
        for row in results
    ]

def get_link_count_last_hours(hours=24):
    """Ottiene il conteggio dei link inviati nelle ultime N ore."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT COUNT(*)
        FROM sent_links
        WHERE sent_at >= datetime('now', '-' || ? || ' hours')
    ''', (hours,))
    
    count = cursor.fetchone()[0]
    conn.close()
    
    return count

def get_most_sent_links(limit=10):
    """Ottiene i link più inviati."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT asin, product_name, COUNT(*) as count
        FROM sent_links
        GROUP BY asin
        ORDER BY count DESC
        LIMIT ?
    ''', (limit,))
    
    results = cursor.fetchall()
    conn.close()
    
    return [
        {
            'asin': row[0],
            'product_name': row[1],
            'count': row[2]
        }
        for row in results
    ]

def was_sent_recently(asin, hours=24):
    """Controlla se un link è stato inviato nelle ultime N ore."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT COUNT(*)
        FROM sent_links
        WHERE asin = ? AND sent_at >= datetime('now', '-' || ? || ' hours')
    ''', (asin, hours))
    
    count = cursor.fetchone()[0]
    conn.close()
    
    return count > 0

if __name__ == "__main__":
    init_telegram_links_db()
