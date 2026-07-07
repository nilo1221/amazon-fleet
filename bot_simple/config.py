# Configurazione Bot Amazon
TELEGRAM_BOT_TOKEN = "8912118097:AAE1JSOfr51ZA7NyBOMRAaocK74qSKaWZOI"
TELEGRAM_CHANNEL_ID = "-1004386515041"
DB_PATH = "data/bot_database.db"
MIN_POST_INTERVAL_HOURS = 6  # Minimo 6 ore tra post
WEBSITE_SCAN_INTERVAL_HOURS = 6  # Ogni quanto scansionare il sito per nuovi prodotti
ANTI_BAN_DELAY = 1.0  # Secondi di delay tra richieste (anti-ban)
MAX_RETRIES = 3  # Numero massimo di retry per scraping
LOG_FILE = "logs/bot.log"  # File di log

# Sistema di priorità per range di prezzo
TELEGRAM_PRICE_THRESHOLD = 40.00  # Soglia massima per Telegram (0-40€)

# Intervalli di check per priorità (in secondi)
CHECK_INTERVAL_HIGH_PRIORITY = 900  # 15 minuti (prodotti 0-20€)
CHECK_INTERVAL_MEDIUM_PRIORITY = 1800  # 30 minuti (prodotti 20-40€)
CHECK_INTERVAL_LOW_PRIORITY = 7200  # 2 ore (prodotti >40€)
