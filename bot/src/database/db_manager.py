import sqlite3
import os
from datetime import datetime
from typing import Optional, List, Dict
import logging

logger = logging.getLogger(__name__)

class DatabaseManager:
    """Gestore del database SQLite per i prodotti da monitorare."""
    
    def __init__(self, db_path: str = "data/bot_database.db"):
        self.db_path = db_path
        self._ensure_db_directory()
        self._init_database()
    
    def _ensure_db_directory(self):
        """Assicura che la directory del database esista."""
        db_dir = os.path.dirname(self.db_path)
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir, exist_ok=True)
    
    def _init_database(self):
        """Inizializza il database e crea la tabella products se non esiste."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    asin TEXT UNIQUE NOT NULL,
                    nome TEXT NOT NULL,
                    soglia_prezzo REAL NOT NULL,
                    prezzo_attuale REAL,
                    ultimo_check TIMESTAMP,
                    messaggio_inviato_il DATE,
                    attivo BOOLEAN DEFAULT 1
                )
            """)
            conn.commit()
            logger.info("Database inizializzato con successo")
    
    def add_product(self, asin: str, nome: str, soglia_prezzo: float) -> bool:
        """
        Aggiunge un prodotto alla white-list.
        
        Args:
            asin: Amazon Standard Identification Number
            nome: Nome del prodotto
            soglia_prezzo: Soglia di prezzo per l'allarme
            
        Returns:
            True se l'inserimento ha successo, False altrimenti
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO products (asin, nome, soglia_prezzo, attivo)
                    VALUES (?, ?, ?, 1)
                """, (asin, nome, soglia_prezzo))
                conn.commit()
                logger.info(f"Prodotto aggiunto: {asin} - {nome}")
                return True
        except sqlite3.IntegrityError:
            logger.warning(f"Prodotto con ASIN {asin} già esistente")
            return False
        except Exception as e:
            logger.error(f"Errore nell'aggiungere il prodotto: {e}")
            return False
    
    def get_active_products(self) -> List[Dict]:
        """
        Recupera tutti i prodotti attivi dal database.
        
        Returns:
            Lista di dizionari con i dati dei prodotti
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT id, asin, nome, soglia_prezzo, prezzo_attuale, 
                           ultimo_check, messaggio_inviato_il, attivo
                    FROM products
                    WHERE attivo = 1
                """)
                return [dict(row) for row in cursor.fetchall()]
        except Exception as e:
            logger.error(f"Errore nel recuperare i prodotti: {e}")
            return []
    
    def update_product_price(self, asin: str, prezzo: float) -> bool:
        """
        Aggiorna il prezzo attuale di un prodotto.
        
        Args:
            asin: ASIN del prodotto
            prezzo: Nuovo prezzo
            
        Returns:
            True se l'aggiornamento ha successo
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    UPDATE products
                    SET prezzo_attuale = ?, ultimo_check = ?
                    WHERE asin = ?
                """, (prezzo, datetime.now(), asin))
                conn.commit()
                return True
        except Exception as e:
            logger.error(f"Errore nell'aggiornare il prezzo: {e}")
            return False
    
    def mark_message_sent(self, asin: str) -> bool:
        """
        Segna che un messaggio è stato inviato oggi per questo prodotto.
        
        Args:
            asin: ASIN del prodotto
            
        Returns:
            True se l'aggiornamento ha successo
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    UPDATE products
                    SET messaggio_inviato_il = ?
                    WHERE asin = ?
                """, (datetime.now().date(), asin))
                conn.commit()
                return True
        except Exception as e:
            logger.error(f"Errore nel segnare il messaggio inviato: {e}")
            return False
    
    def was_message_sent_today(self, asin: str) -> bool:
        """
        Verifica se un messaggio è già stato inviato oggi.
        
        Args:
            asin: ASIN del prodotto
            
        Returns:
            True se un messaggio è stato inviato oggi
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT messaggio_inviato_il
                    FROM products
                    WHERE asin = ?
                """, (asin,))
                result = cursor.fetchone()
                if result and result[0]:
                    message_date = datetime.strptime(result[0], '%Y-%m-%d').date()
                    return message_date == datetime.now().date()
                return False
        except Exception as e:
            logger.error(f"Errore nel verificare il messaggio: {e}")
            return False
    
    def deactivate_product(self, asin: str) -> bool:
        """
        Disattiva un prodotto dal monitoraggio.
        
        Args:
            asin: ASIN del prodotto
            
        Returns:
            True se la disattivazione ha successo
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    UPDATE products
                    SET attivo = 0
                    WHERE asin = ?
                """, (asin,))
                conn.commit()
                logger.info(f"Prodotto disattivato: {asin}")
                return True
        except Exception as e:
            logger.error(f"Errore nel disattivare il prodotto: {e}")
            return False
    
    def delete_product(self, asin: str) -> bool:
        """
        Elimina un prodotto dal database.
        
        Args:
            asin: ASIN del prodotto
            
        Returns:
            True se l'eliminazione ha successo
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("DELETE FROM products WHERE asin = ?", (asin,))
                conn.commit()
                logger.info(f"Prodotto eliminato: {asin}")
                return True
        except Exception as e:
            logger.error(f"Errore nell'eliminare il prodotto: {e}")
            return False
