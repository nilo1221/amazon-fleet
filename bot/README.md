# Amazon Price Monitor Bot

Bot Telegram asincrono per monitorare i prezzi dei prodotti Amazon e inviare alert quando scendono sotto una soglia definita.

## 🏗️ Architettura

```
bot/
├── src/
│   ├── core/
│   │   └── monitor.py          # Logica di controllo principale
│   ├── database/
│   │   └── db_manager.py       # Gestione SQLite
│   ├── integrations/
│   │   ├── amazon_api.py       # Amazon PA API client
│   │   └── telegram_bot.py     # Telegram Bot API client
│   └── utils/
│       ├── backoff.py          # Exponential backoff
│       └── logger.py           # Logging configuration
├── config/
│   ├── .env.example            # Template configurazione
│   └── .env                    # Credenziali reali (non in Git)
├── data/
│   └── bot_database.db         # Database SQLite
├── scripts/
│   ├── add_product.py          # Script per aggiungere prodotti
│   └── run_bot.py              # Script principale
├── requirements.txt
└── README.md
```

## 🔧 Installazione

1. **Clona il repository**
```bash
cd /home/lollo/amazon/bot
```

2. **Crea ambiente virtuale**
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows
```

3. **Installa le dipendenze**
```bash
pip install -r requirements.txt
```

4. **Configura le credenziali**
```bash
cp config/.env.example config/.env
# Modifica config/.env con le tue credenziali reali
```

## 🔑 Configurazione

Modifica `config/.env` con le tue credenziali:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHANNEL_ID=your_channel_id_here

# Amazon PA API Configuration
AMAZON_ACCESS_KEY=your_amazon_access_key_here
AMAZON_SECRET_KEY=your_amazon_secret_key_here
AMAZON_PARTNER_TAG=l0c39-21
AMAZON_MARKETPLACE=A1PA6795UKMFR9

# Bot Configuration
CHECK_INTERVAL_MINUTES=30
PRICE_THRESHOLD=20.00
DB_PATH=data/bot_database.db
```

### Come ottenere le credenziali:

**Telegram Bot Token:**
1. Cerca @BotFather su Telegram
2. Scrivi `/newbot`
3. Segui le istruzioni per creare il bot
4. Copia il token fornito

**Telegram Channel ID:**
1. Aggiungi il bot al tuo canale come amministratore
2. Invia un messaggio al canale
3. Usa `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` per vedere il chat_id

**Amazon PA API Credentials:**
1. Accedi al Programma Affiliazione Amazon
2. Vai alla tab "Product Advertising API"
3. Copia Access Key e Secret Key

## 🚀 Utilizzo

### Aggiungere prodotti alla white-list

```bash
python scripts/add_product.py
```

Segui le istruzioni per inserire:
- ASIN del prodotto
- Nome del prodotto
- Soglia di prezzo

### Avviare il bot

```bash
python scripts/run_bot.py
```

Il bot:
1. Controlla i prezzi ogni 30 minuti (configurabile)
2. Invia alert su Telegram quando il prezzo <= soglia
3. Evita duplicati nello stesso giorno
4. Usa exponential backoff per gestire errori API

## 📊 Database Schema

```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asin TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    soglia_prezzo REAL NOT NULL,
    prezzo_attuale REAL,
    ultimo_check TIMESTAMP,
    messaggio_inviato_il DATE,
    attivo BOOLEAN DEFAULT 1
);
```

## ⚙️ Funzionalità

- ✅ **White-list manuale**: Solo prodotti aggiunti manualmente
- ✅ **Monitoraggio asincrono**: Non blocca durante chiamate API
- ✅ **Exponential backoff**: Gestisce errori connessione
- ✅ **Prevenzione duplicati**: Un messaggio per prodotto al giorno
- ✅ **Logging completo**: Tracciamento di tutte le operazioni
- ✅ **Configurazione flessibile**: Variabili d'ambiente

## 🔒 Sicurezza

- `.env` escluso da Git (vedi `.gitignore`)
- Credenziali solo in variabili d'ambiente
- Database SQLite con permessi appropriati
- Nessun scraping automatico - solo white-list manuale

## 📝 Note Importanti

- Il bot NON cerca prodotti autonomamente
- Tutti i prodotti devono essere aggiunti manualmente
- Amazon PA API ha rate limiting basato su performance
- Telegram ha rate limiting (30 messaggi/secondo)
- Il database viene creato automaticamente alla prima esecuzione

## 🐛 Troubleshooting

**Errore Amazon API:**
- Verifica che le credenziali siano corrette
- Controlla il rate limiting PA API
- Assicurati che l'ASIN sia valido

**Errore Telegram:**
- Verifica che il bot token sia corretto
- Assicurati che il bot sia amministratore del canale
- Controlla che il channel_id sia corretto

**Database error:**
- Assicurati che la directory `data/` esista
- Verifica i permessi di scrittura
- Il database viene creato automaticamente se non esiste

## 📄 Licenza

Progetto privato per uso personale.
