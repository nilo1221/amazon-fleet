import time
import asyncio
from telegram import Bot, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.error import TelegramError
from config import (TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID, MIN_POST_INTERVAL_HOURS, 
                    WEBSITE_SCAN_INTERVAL_HOURS, LOG_FILE, TELEGRAM_PRICE_THRESHOLD,
                    CHECK_INTERVAL_HIGH_PRIORITY, CHECK_INTERVAL_MEDIUM_PRIORITY, CHECK_INTERVAL_LOW_PRIORITY)
from db import init_db, get_all_products, can_post, update_last_posted, add_product
from scraper import get_product_data
from extract_products import extract_products_from_html
from telegram_links_db import add_sent_link, init_telegram_links_db
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

async def auto_scan_website():
    """Scansiona automaticamente il sito web per nuovi prodotti."""
    base_path = '/home/lollo/amazon/public/niches'
    
    # Trova tutti i file HTML nelle nicchie
    html_files = []
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file == 'index.html':
                html_files.append(os.path.join(root, file))
    
    logger.info(f"🔍 Auto-scan: {len(html_files)} file HTML da scansionare")
    
    new_products_count = 0
    
    for html_file in html_files:
        try:
            products = extract_all_affiliate_links(html_file)  # Usa funzione con deduplicazione
            
            for product in products:
                if add_product(product['asin'], product['nome'], product['link']):
                    new_products_count += 1
                    logger.info(f"  ✅ Nuovo prodotto: {product['asin']}")
        except Exception as e:
            logger.error(f"  ❌ Errore scan {html_file}: {e}")
    
    if new_products_count > 0:
        logger.info(f"🎉 Auto-scan: {new_products_count} nuovi prodotti aggiunti!")
    else:
        logger.info(f"✅ Auto-scan: Nessun nuovo prodotto")

async def check_product(product, bot):
    """Controlla un singolo prodotto e invia su Telegram se sotto soglia (0-40€)."""
    logger.info(f"  ⏳ Controllo {product['asin']}...")
    price, img_url = get_product_data(product['link'])
    
    if price:
        logger.info(f"     💰 Prezzo: €{price:.2f}")
        
        # Invia su Telegram solo se sotto soglia (0-40€)
        if price <= TELEGRAM_PRICE_THRESHOLD:
            logger.info(f"     ✅ SOTTO SOGLIA TELEGRAM (€{TELEGRAM_PRICE_THRESHOLD})!")
            
            if can_post(product['id'], MIN_POST_INTERVAL_HOURS):
                # Formatta messaggio migliorato con escape Markdown
                safe_nome = escape_markdown(product['nome'])
                
                # Crea nome breve per il titolo (max 50 caratteri)
                nome_breve = safe_nome[:50] + "..." if len(safe_nome) > 50 else safe_nome
                
                msg = (
                    f"🔥 **SUPER OFFERTA DEL GIORNO**\n\n"
                    f"━━━━━━━━━━━━━━━━━━━━━━\n"
                    f"📦 *{nome_breve}*\n"
                    f"━━━━━━━━━━━━━━━━━━━━━━\n\n"
                    f"💰 **Prezzo:** *€{price:.2f}*\n"
                    f"⚡ **Sconto:** Sotto la soglia di €{TELEGRAM_PRICE_THRESHOLD}!\n\n"
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
                    if img_url:
                        await bot.send_photo(
                            chat_id=TELEGRAM_CHANNEL_ID,
                            photo=img_url,
                            caption=msg,
                            parse_mode='Markdown',
                            reply_markup=keyboard
                        )
                    else:
                        await bot.send_message(
                            chat_id=TELEGRAM_CHANNEL_ID,
                            text=msg,
                            parse_mode='Markdown',
                            reply_markup=keyboard
                        )
                    
                    update_last_posted(product['id'])
                    
                    # Traccia il link inviato nel database
                    message_type = 'photo' if img_url else 'text'
                    add_sent_link(
                        asin=product['asin'],
                        product_name=product['nome'],
                        affiliate_link=product['link'],
                        message_type=message_type,
                        channel_id=TELEGRAM_CHANNEL_ID,
                        price=price
                    )
                    
                    logger.info(f"     📤 Inviato su Telegram!")
                except TelegramError as e:
                    logger.error(f"     ❌ Errore invio: {e}")
                    # Fallback a testo semplice se Markdown fallisce
                    try:
                        nome_breve_plain = product['nome'][:50] + "..." if len(product['nome']) > 50 else product['nome']
                        msg_plain = (
                            f"🔥 SUPER OFFERTA DEL GIORNO\n\n"
                            f"━━━━━━━━━━━━━━━━━━━━━━\n"
                            f"📦 {nome_breve_plain}\n"
                            f"━━━━━━━━━━━━━━━━━━━━━━\n\n"
                            f"💰 Prezzo: €{price:.2f}\n"
                            f"⚡ Sconto: Sotto la soglia di €{TELEGRAM_PRICE_THRESHOLD}!\n\n"
                            f"━━━━━━━━━━━━━━━━━━━━━━\n"
                            f"🌐 Vuoi vedere più prodotti?\n"
                            f"👉 smart-choices-guide.vercel.app\n\n"
                            f"✅ Spedizione Prime Gratuita\n"
                            f"✅ Reso gratuito 30 giorni\n"
                            f"✅ Pagamenti sicuri\n"
                            f"━━━━━━━━━━━━━━━━━━━━━━\n\n"
                            f"📢 Smart Choices Guide partecipa al Programma Affiliati Amazon EU. Quando acquisti tramite i nostri link, paghi lo stesso prezzo senza costi aggiuntivi, e noi riceviamo una piccola commissione che ci aiuta a mantenere il sito operativo."
                        )
                        
                        # Crea pulsante inline per Amazon (fallback)
                        keyboard_plain = InlineKeyboardMarkup([
                            [InlineKeyboardButton("🛒 Vedi su Amazon", url=product['link'])]
                        ])
                        
                        if img_url:
                            await bot.send_photo(
                                chat_id=TELEGRAM_CHANNEL_ID,
                                photo=img_url,
                                caption=msg_plain,
                                reply_markup=keyboard_plain
                            )
                        else:
                            await bot.send_message(
                                chat_id=TELEGRAM_CHANNEL_ID,
                                text=msg_plain,
                                reply_markup=keyboard_plain
                            )
                        
                        update_last_posted(product['id'])
                        
                        # Traccia il link inviato nel database (fallback)
                        message_type = 'photo' if img_url else 'text'
                        add_sent_link(
                            asin=product['asin'],
                            product_name=product['nome'],
                            affiliate_link=product['link'],
                            message_type=message_type,
                            channel_id=TELEGRAM_CHANNEL_ID,
                            price=price
                        )
                        
                        logger.info(f"     📤 Inviato su Telegram (fallback)!")
                    except TelegramError as e2:
                        logger.error(f"     ❌ Errore invio fallback: {e2}")
            else:
                logger.info(f"     ⏸️ Già postato di recente (skip)")
        else:
            logger.info(f"     ❌ Sopra soglia Telegram (€{TELEGRAM_PRICE_THRESHOLD}) - skip")
    else:
        logger.info(f"     ❌ Prezzo non trovato (skip)")

async def run_bot():
    """Loop principale del bot con sistema di priorità."""
    # Inizializza database
    init_db()
    init_telegram_links_db()
    
    # Crea bot Telegram
    bot = Bot(token=TELEGRAM_BOT_TOKEN)
    
    logger.info("🚀 Bot avviato!")
    logger.info(f"📊 Monitoraggio prodotti con soglia Telegram: €{TELEGRAM_PRICE_THRESHOLD}")
    logger.info(f"⏰ Check alta priorità (0-20€): {CHECK_INTERVAL_HIGH_PRIORITY/60} minuti")
    logger.info(f"⏰ Check media priorità (20-40€): {CHECK_INTERVAL_MEDIUM_PRIORITY/60} minuti")
    logger.info(f"⏰ Check bassa priorità (>40€): {CHECK_INTERVAL_LOW_PRIORITY/60} minuti")
    logger.info(f"🛡️ Minimo tra post: {MIN_POST_INTERVAL_HOURS} ore")
    logger.info(f"🔄 Auto-scan sito: ogni {WEBSITE_SCAN_INTERVAL_HOURS} ore")
    
    # Auto-scan iniziale
    logger.info("\n🔄 Auto-scan iniziale del sito...")
    await auto_scan_website()
    
    # Variabili per tracciare ultimi check per priorità
    last_high_priority_check = 0
    last_medium_priority_check = 0
    last_low_priority_check = 0
    last_website_scan = time.time()
    website_scan_interval_seconds = WEBSITE_SCAN_INTERVAL_HOURS * 3600
    
    while True:
        try:
            current_time = time.time()
            
            # Controlla se è ora di scansionare il sito
            if current_time - last_website_scan >= website_scan_interval_seconds:
                logger.info(f"\n🔄 Auto-scan periodico del sito...")
                await auto_scan_website()
                last_website_scan = current_time
            
            products = get_all_products()
            
            # Dividi prodotti per priorità basata sul prezzo
            high_priority = []  # 0-20€
            medium_priority = []  # 20-40€
            low_priority = []  # >40€
            
            for p in products:
                price, _ = get_product_data(p['link'])
                if price:
                    if price <= 20:
                        high_priority.append(p)
                    elif price <= 40:
                        medium_priority.append(p)
                    else:
                        low_priority.append(p)
            
            # Check alta priorità (0-20€) - ogni 15 minuti
            if current_time - last_high_priority_check >= CHECK_INTERVAL_HIGH_PRIORITY:
                if high_priority:
                    logger.info(f"\n🔍 Check ALTA priorità (0-20€): {len(high_priority)} prodotti")
                    tasks = []
                    for p in high_priority:
                        task = check_product(p, bot)
                        tasks.append(task)
                        if len(tasks) >= 5:
                            await asyncio.gather(*tasks)
                            tasks = []
                    if tasks:
                        await asyncio.gather(*tasks)
                last_high_priority_check = current_time
            
            # Check media priorità (20-40€) - ogni 30 minuti
            if current_time - last_medium_priority_check >= CHECK_INTERVAL_MEDIUM_PRIORITY:
                if medium_priority:
                    logger.info(f"\n🔍 Check MEDIA priorità (20-40€): {len(medium_priority)} prodotti")
                    tasks = []
                    for p in medium_priority:
                        task = check_product(p, bot)
                        tasks.append(task)
                        if len(tasks) >= 5:
                            await asyncio.gather(*tasks)
                            tasks = []
                    if tasks:
                        await asyncio.gather(*tasks)
                last_medium_priority_check = current_time
            
            # Check bassa priorità (>40€) - ogni 2 ore
            if current_time - last_low_priority_check >= CHECK_INTERVAL_LOW_PRIORITY:
                if low_priority:
                    logger.info(f"\n🔍 Check BASSA priorità (>40€): {len(low_priority)} prodotti")
                    tasks = []
                    for p in low_priority:
                        task = check_product(p, bot)
                        tasks.append(task)
                        if len(tasks) >= 5:
                            await asyncio.gather(*tasks)
                            tasks = []
                    if tasks:
                        await asyncio.gather(*tasks)
                last_low_priority_check = current_time
            
            # Attendi prima del prossimo ciclo
            time.sleep(60)  # Controlla ogni minuto se è ora di fare check
            
        except KeyboardInterrupt:
            logger.info("\n👋 Arresto del bot...")
            break
        except Exception as e:
            logger.error(f"❌ Errore nel loop: {e}")
            time.sleep(60)  # Attenda 1 minuto prima di riprovare

if __name__ == "__main__":
    asyncio.run(run_bot())
