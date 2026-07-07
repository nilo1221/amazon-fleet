from telegram import Bot
from telegram.error import TelegramError
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class TelegramBot:
    """Client per il bot Telegram."""
    
    def __init__(self, bot_token: str, channel_id: str):
        self.bot = Bot(token=bot_token)
        self.channel_id = channel_id
    
    async def send_price_alert(
        self,
        product_name: str,
        asin: str,
        current_price: float,
        threshold_price: float,
        affiliate_link: str
    ) -> bool:
        """
        Invia un alert di prezzo sul canale Telegram.
        
        Args:
            product_name: Nome del prodotto
            asin: ASIN del prodotto
            current_price: Prezzo attuale
            threshold_price: Soglia di prezzo
            affiliate_link: Link affiliato Amazon
            
        Returns:
            True se l'invio ha successo
        """
        try:
            message = (
                f"🚨 *ALERT PREZZO* 🚨\n\n"
                f"📦 *{product_name}*\n"
                f"💰 Prezzo attuale: *€{current_price:.2f}*\n"
                f"🎯 Soglia: €{threshold_price:.2f}\n"
                f"📉 Risparmio: *€{threshold_price - current_price:.2f}*\n\n"
                f"🔗 [Acquista su Amazon]({affiliate_link})\n\n"
                f"ASIN: {asin}"
            )
            
            await self.bot.send_message(
                chat_id=self.channel_id,
                text=message,
                parse_mode='Markdown',
                disable_web_page_preview=False
            )
            
            logger.info(f"Messaggio inviato per {asin}: {product_name}")
            return True
            
        except TelegramError as e:
            logger.error(f"Errore Telegram: {e}")
            return False
        except Exception as e:
            logger.error(f"Errore nell'invio del messaggio: {e}")
            return False
    
    async def send_test_message(self) -> bool:
        """
        Invia un messaggio di test per verificare la connessione.
        
        Returns:
            True se l'invio ha successo
        """
        try:
            message = "🤖 Bot Amazon Price Monitor attivo e funzionante!"
            await self.bot.send_message(
                chat_id=self.channel_id,
                text=message
            )
            logger.info("Messaggio di test inviato con successo")
            return True
        except Exception as e:
            logger.error(f"Errore nel messaggio di test: {e}")
            return False
    
    async def send_error_notification(self, error_message: str) -> bool:
        """
        Invia una notifica di errore.
        
        Args:
            error_message: Messaggio di errore
            
        Returns:
            True se l'invio ha successo
        """
        try:
            message = f"⚠️ *ERRORE BOT* ⚠️\n\n{error_message}"
            await self.bot.send_message(
                chat_id=self.channel_id,
                text=message,
                parse_mode='Markdown'
            )
            return True
        except Exception as e:
            logger.error(f"Errore nell'invio della notifica errore: {e}")
            return False
