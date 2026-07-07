import time
import asyncio
import random
from telegram import Bot, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.error import TelegramError
from config import (TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID, MIN_POST_INTERVAL_HOURS, 
                    WEBSITE_SCAN_INTERVAL_HOURS, LOG_FILE, TELEGRAM_PRICE_THRESHOLD)
from telegram_links_db import add_sent_link, init_telegram_links_db, was_sent_recently
from extract_products import extract_all_affiliate_links
from scraper import get_product_price
import os
import logging
from datetime import datetime
import re

# Setup logging
os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def escape_markdown(text):
    """Escape caratteri speciali per Markdown."""
    escape_chars = r'_*[]()~`>#+-=|{}.!'
    return re.sub(f'([{re.escape(escape_chars)}])', r'\\\1', text)

def extract_products_from_website():
    """Estrae tutti i prodotti dal sito web."""
    base_path = '/home/lollo/amazon/public/niches'
    
    # Trova tutti i file HTML nelle nicchie
    html_files = []
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file == 'index.html':
                html_files.append(os.path.join(root, file))
    
    all_products = []
    
    for html_file in html_files:
        try:
            products = extract_all_affiliate_links(html_file)
            all_products.extend(products)
        except Exception as e:
            logger.error(f"❌ Errore estrazione {html_file}: {e}")
    
    return all_products

async def send_product_to_telegram(product, bot):
    """Invia un prodotto su Telegram se sotto soglia di prezzo (0-40€)."""
    logger.info(f"⏳ Controllo {product['asin']}...")
    
    # Controlla se già inviato (permanentemente)
    if was_sent_recently(product['asin']):
        logger.info(f"⏸️ Già inviato in passato (skip)")
        return
    
    # Controlla prezzo
    price = get_product_price(product['link'])
    
    if price is None:
        logger.info(f"❌ Prezzo non trovato (skip)")
        return
    
    logger.info(f"💰 Prezzo: €{price:.2f}")
    
    # Invia solo se sotto soglia (0-40€)
    if price > TELEGRAM_PRICE_THRESHOLD:
        logger.info(f"❌ Sopra soglia Telegram (€{TELEGRAM_PRICE_THRESHOLD}) - skip")
        return
    
    logger.info(f"✅ SOTTO SOGLIA TELEGRAM (€{TELEGRAM_PRICE_THRESHOLD})!")
    
    # Formatta messaggio con prezzo
    safe_nome = escape_markdown(product['nome'])
    nome_breve = safe_nome[:60] + "..." if len(safe_nome) > 60 else safe_nome
    
    msg = (
        f"🔥 **SUPER OFFERTA DEL GIORNO**\n\n"
        f"━━━━━━━━━━━━━━━━━━━━━━\n"
        f"📦 *{nome_breve}*\n"
        f"━━━━━━━━━━━━━━━━━━━━━━\n\n"
        f"💰 **Prezzo:** *€{price:.2f}*\n"
        f"⚡ **Sotto la soglia di €{TELEGRAM_PRICE_THRESHOLD}!*\n\n"
        f"━━━━━━━━━━━━━━━━━━━━━━\n"
        f"🌐 **Vuoi vedere più prodotti?**\n"
        f"👉 smart-choices-guide.vercel.app\n\n"
        f"✅ Spedizione Prime Gratuita\n"
        f"✅ Reso gratuito 30 giorni\n"
        f"✅ Pagamenti sicuri\n"
        f"━━━━━━━━━━━━━━━━━━━━━━\n\n"
        f"📢 *Smart Choices Guide partecipa al Programma Affiliati Amazon EU. Quando acquisti tramite i nostri link, paghi lo stesso prezzo senza costi aggiuntivi, e noi riceviamo una piccola commissione che ci aiuta a mantenere il sito operativo.*"
    )
    
    # Crea pulsante inline per Amazon
    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("🛒 Vedi su Amazon", url=product['link'])]
    ])
    
    try:
        await bot.send_message(
            chat_id=TELEGRAM_CHANNEL_ID,
            text=msg,
            parse_mode='Markdown',
            reply_markup=keyboard
        )
        
        # Traccia il link inviato nel database
        add_sent_link(
            asin=product['asin'],
            product_name=product['nome'],
            affiliate_link=product['link'],
            message_type='text',
            channel_id=TELEGRAM_CHANNEL_ID,
            price=price
        )
        
        logger.info(f"📤 Inviato su Telegram!")
    except TelegramError as e:
        logger.error(f"❌ Errore invio: {e}")
        # Fallback a testo semplice
        try:
            msg_plain = (
                f"🔥 SUPER OFFERTA DEL GIORNO\n\n"
                f"━━━━━━━━━━━━━━━━━━━━━━\n"
                f"📦 {nome_breve}\n"
                f"━━━━━━━━━━━━━━━━━━━━━━\n\n"
                f"💰 Prezzo: €{price:.2f}\n"
                f"⚡ Sotto la soglia di €{TELEGRAM_PRICE_THRESHOLD}!\n\n"
                f"━━━━━━━━━━━━━━━━━━━━━━\n"
                f"🌐 Vuoi vedere più prodotti?\n"
                f"👉 smart-choices-guide.vercel.app\n\n"
                f"✅ Spedizione Prime Gratuita\n"
                f"✅ Reso gratuito 30 giorni\n"
                f"✅ Pagamenti sicuri\n"
                f"━━━━━━━━━━━━━━━━━━━━━━\n\n"
                f"📢 Smart Choices Guide partecipa al Programma Affiliati Amazon EU. Quando acquisti tramite i nostri link, paghi lo stesso prezzo senza costi aggiuntivi, e noi riceviamo una piccola commissione che ci aiuta a mantenere il sito operativo."
            )
            
            await bot.send_message(
                chat_id=TELEGRAM_CHANNEL_ID,
                text=msg_plain,
                reply_markup=keyboard
            )
            
            add_sent_link(
                asin=product['asin'],
                product_name=product['nome'],
                affiliate_link=product['link'],
                message_type='text',
                channel_id=TELEGRAM_CHANNEL_ID,
                price=price
            )
            
            logger.info(f"📤 Inviato su Telegram (fallback)!")
        except TelegramError as e2:
            logger.error(f"❌ Errore invio fallback: {e2}")

async def run_bot():
    """Loop principale del bot - estrae link dal sito e invia su Telegram."""
    # Inizializza database
    init_telegram_links_db()
    
    # Crea bot Telegram
    bot = Bot(token=TELEGRAM_BOT_TOKEN)
    
    logger.info("🚀 Bot avviato!")
    logger.info(f"� Soglia prezzo Telegram: €{TELEGRAM_PRICE_THRESHOLD}")
    logger.info(f"��️ Minimo tra post: {MIN_POST_INTERVAL_HOURS} ore")
    logger.info(f"🔄 Estrazione prodotti dal sito: ogni {WEBSITE_SCAN_INTERVAL_HOURS} ore")
    logger.info(f"📊 Controllo duplicati: permanente (mai inviare stesso link)")
    
    last_website_scan = 0
    website_scan_interval_seconds = WEBSITE_SCAN_INTERVAL_HOURS * 3600
    
    while True:
        try:
            current_time = time.time()
            
            # Controlla se è ora di scansionare il sito
            if current_time - last_website_scan >= website_scan_interval_seconds:
                logger.info(f"\n🔄 Estrazione prodotti dal sito...")
                products = extract_products_from_website()
                logger.info(f"� Trovati {len(products)} prodotti totali")
                
                # Seleziona prodotti casuali da inviare (max 5 per ciclo)
                if products:
                    products_to_send = random.sample(products, min(5, len(products)))
                    logger.info(f"🎯 Selezionati {len(products_to_send)} prodotti da inviare")
                    
                    for product in products_to_send:
                        await send_product_to_telegram(product, bot)
                        time.sleep(random.uniform(30, 60))  # Delay casuale tra invii
                
                last_website_scan = current_time
            
            # Attendi prima del prossimo ciclo
            time.sleep(60)  # Controlla ogni minuto se è ora di fare scan
            
        except KeyboardInterrupt:
            logger.info("\n👋 Arresto del bot...")
            break
        except Exception as e:
            logger.error(f"❌ Errore nel loop: {e}")
            time.sleep(60)  # Attenda 1 minuto prima di riprovare

if __name__ == "__main__":
    asyncio.run(run_bot())
