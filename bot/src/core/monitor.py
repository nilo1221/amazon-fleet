import asyncio
import logging
from typing import Dict
from datetime import datetime
import os
from dotenv import load_dotenv

from src.database.db_manager import DatabaseManager
from src.integrations.amazon_api import AmazonAPI
from src.integrations.telegram_bot import TelegramBot
from src.utils.backoff import exponential_backoff
from src.utils.logger import setup_logger

# Carica variabili d'ambiente
load_dotenv("config/.env")

logger = setup_logger("amazon_bot")

class PriceMonitor:
    """Sistema di monitoraggio prezzi Amazon."""
    
    def __init__(self):
        self.db = DatabaseManager(os.getenv("DB_PATH", "data/bot_database.db"))
        self.amazon_api = AmazonAPI(
            access_key=os.getenv("AMAZON_ACCESS_KEY"),
            secret_key=os.getenv("AMAZON_SECRET_KEY"),
            partner_tag=os.getenv("AMAZON_PARTNER_TAG", "l0c39-21"),
            marketplace=os.getenv("AMAZON_MARKETPLACE", "A1PA6795UKMFR9")
        )
        self.telegram_bot = TelegramBot(
            bot_token=os.getenv("TELEGRAM_BOT_TOKEN"),
            channel_id=os.getenv("TELEGRAM_CHANNEL_ID")
        )
        self.check_interval = int(os.getenv("CHECK_INTERVAL_MINUTES", "30"))
        self.price_threshold = float(os.getenv("PRICE_THRESHOLD", "20.00"))
    
    async def check_product(self, product: Dict) -> bool:
        """
        Controlla un singolo prodotto e invia alert se necessario.
        
        Args:
            product: Dizionario con dati del prodotto
            
        Returns:
            True se il controllo ha successo
        """
        asin = product["asin"]
        nome = product["nome"]
        soglia = product["soglia_prezzo"]
        
        try:
            # Recupera il prezzo con exponential backoff
            current_price = await exponential_backoff(
                lambda: self.amazon_api.get_product_price(asin),
                max_retries=3,
                initial_delay=2.0
            )
            
            if current_price is None:
                logger.warning(f"Impossibile recuperare il prezzo per {asin}")
                return False
            
            # Aggiorna il prezzo nel database
            self.db.update_product_price(asin, current_price)
            logger.info(f"{asin} - {nome}: €{current_price:.2f}")
            
            # Verifica se il prezzo è sotto la soglia
            if current_price <= soglia:
                # Verifica se un messaggio è già stato inviato oggi
                if not self.db.was_message_sent_today(asin):
                    # Genera link affiliato
                    affiliate_link = f"https://www.amazon.it/dp/{asin}?tag={self.amazon_api.partner_tag}"
                    
                    # Invia alert Telegram
                    success = await self.telegram_bot.send_price_alert(
                        product_name=nome,
                        asin=asin,
                        current_price=current_price,
                        threshold_price=soglia,
                        affiliate_link=affiliate_link
                    )
                    
                    if success:
                        # Segna il messaggio come inviato
                        self.db.mark_message_sent(asin)
                        logger.info(f"Alert inviato per {asin}")
                    else:
                        logger.error(f"Errore nell'invio dell'alert per {asin}")
                        return False
            else:
                logger.info(f"Prezzo sopra soglia per {asin}: €{current_price:.2f} > €{soglia:.2f}")
            
            return True
            
        except Exception as e:
            logger.error(f"Errore nel controllo di {asin}: {e}")
            return False
    
    async def monitor_loop(self):
        """Loop principale di monitoraggio."""
        logger.info("Avvio del loop di monitoraggio")
        
        while True:
            try:
                # Recupera tutti i prodotti attivi
                products = self.db.get_active_products()
                logger.info(f"Controllo di {len(products)} prodotti")
                
                # Controlla ogni prodotto
                for product in products:
                    await self.check_product(product)
                    # Piccola pausa tra i controlli per evitare rate limiting
                    await asyncio.sleep(1)
                
                logger.info(f"Ciclo completato. Prossimo controllo tra {self.check_interval} minuti")
                
                # Attendi l'intervallo configurato
                await asyncio.sleep(self.check_interval * 60)
                
            except Exception as e:
                logger.error(f"Errore nel loop di monitoraggio: {e}")
                # Attendi 5 minuti prima di riprovare in caso di errore
                await asyncio.sleep(300)
    
    async def start(self):
        """Avvia il sistema di monitoraggio."""
        logger.info("Avvio del sistema di monitoraggio prezzi Amazon")
        
        # Invia messaggio di test
        await self.telegram_bot.send_test_message()
        
        # Avvia il loop di monitoraggio
        await self.monitor_loop()
