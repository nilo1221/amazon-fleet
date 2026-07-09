const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Configurazione
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8912118097:AAE1JSOfr51ZA7NyBOMRAaocK74qSKaWZOI';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '@ilmigliorprezzo';
const SITE_URL = process.env.SITE_URL || 'https://smart-choices-guide.vercel.app';

// Configurazione personalizzazione per categoria
const CATEGORY_CONFIG = {
    'moda': {
        emoji: '👔',
        tone: 'professionale',
        prefix: '🔥 NUOVA COLLEZIONE',
        minPrice: 0,
        maxPrice: 40
    },
    'tech': {
        emoji: '📱',
        tone: 'entusiasta',
        prefix: '🚀 NUOVA TECNOLOGIA',
        minPrice: 0,
        maxPrice: 50
    },
    'casa': {
        emoji: '🏠',
        tone: 'accogliente',
        prefix: '🏡 PER LA TUA CASA',
        minPrice: 0,
        maxPrice: 40
    },
    'giochi': {
        emoji: '🎮',
        tone: 'divertente',
        prefix: '🎲 GIOCO NUOVO',
        minPrice: 0,
        maxPrice: 40
    },
    'manga': {
        emoji: '📚',
        tone: 'passionale',
        prefix: '📖 MANGA NUOVO',
        minPrice: 0,
        maxPrice: 40
    },
    'outdoor': {
        emoji: '⛺',
        tone: 'avventuroso',
        prefix: '🌲 AVVENTURA',
        minPrice: 0,
        maxPrice: 40
    },
    'sport': {
        emoji: '⚽',
        tone: 'energetico',
        prefix: '💪 SPORT',
        minPrice: 0,
        maxPrice: 40
    },
    'viaggi': {
        emoji: '✈️',
        tone: 'ispiratore',
        prefix: '🌍 VIAGGIO',
        minPrice: 0,
        maxPrice: 40
    },
    'mare': {
        emoji: '🏖️',
        tone: 'estivo',
        prefix: '🌊 MARE',
        minPrice: 0,
        maxPrice: 40
    },
    'default': {
        emoji: '🛍️',
        tone: 'neutro',
        prefix: '🔥 OFFERTA',
        minPrice: 0,
        maxPrice: 40
    }
};

// Ottiene configurazione categoria dal path della nicchia
function getCategoryConfig(nichePath) {
    const category = nichePath.split('/')[0];
    return CATEGORY_CONFIG[category] || CATEGORY_CONFIG['default'];
}

// Nicchie da controllare (solo nicchie esistenti)
const NICCHIE_DA_CONTROLLARE = [
    'moda/abbigliamento-lavoro',
    'moda/abbigliamento-bambino',
    'moda/abbigliamento-donna',
    'moda/abbigliamento-uomo',
    'moda/serie-tv-cinema',
    'tech/smartphone-tech',
    'tech/elite-gaming-gear',
    'casa/arredamento-casa',
    'casa/cucina-elettrodomestici',
    'casa/caffe-capsule',
    'casa/climatizzazione',
    'giochi-tavolo',
    'manga-anime',
    'outdoor-camping',
    'mare',
    'sport/abbigliamento-sportivo',
    'viaggi-vacanze'
];

// Percorsi dei file
const SENT_PRODUCTS_FILE = path.join(__dirname, '../data/sent_products.json');
const ANALYTICS_FILE = path.join(__dirname, '../data/analytics.json');
const PRICE_CACHE_FILE = path.join(__dirname, '../data/price_cache.json');
const QUEUE_FILE = path.join(__dirname, '../data/queue.json');
const PUBLIC_DIR = path.join(__dirname, '../public');

// Carica il registro dei prodotti già inviati
function loadSentProducts() {
    try {
        const data = fs.readFileSync(SENT_PRODUCTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { sent_asins: [], last_updated: null };
    }
}

// Salva il registro dei prodotti inviati
function saveSentProducts(data) {
    data.last_updated = new Date().toISOString();
    fs.writeFileSync(SENT_PRODUCTS_FILE, JSON.stringify(data, null, 2));
}

// Carica analytics
function loadAnalytics() {
    try {
        const data = fs.readFileSync(ANALYTICS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            total_sent: 0,
            by_category: {},
            by_date: {},
            last_updated: null
        };
    }
}

// Salva analytics
function saveAnalytics(data) {
    data.last_updated = new Date().toISOString();
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
}

// Registra evento analytics
function trackEvent(analytics, eventType, product, success = true) {
    const category = product.niche.split('/')[0];
    const today = new Date().toISOString().split('T')[0];
    
    // Incrementa totale
    if (success) {
        analytics.total_sent++;
    }
    
    // Per categoria
    if (!analytics.by_category[category]) {
        analytics.by_category[category] = { sent: 0, failed: 0 };
    }
    if (success) {
        analytics.by_category[category].sent++;
    } else {
        analytics.by_category[category].failed++;
    }
    
    // Per data
    if (!analytics.by_date[today]) {
        analytics.by_date[today] = { sent: 0, failed: 0 };
    }
    if (success) {
        analytics.by_date[today].sent++;
    } else {
        analytics.by_date[today].failed++;
    }
}

// Carica cache prezzi
function loadPriceCache() {
    try {
        const data = fs.readFileSync(PRICE_CACHE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

// Salva cache prezzi
function savePriceCache(cache) {
    fs.writeFileSync(PRICE_CACHE_FILE, JSON.stringify(cache, null, 2));
}

// Controlla se cache è valida (meno di 24h)
function isCacheValid(cacheEntry) {
    if (!cacheEntry || !cacheEntry.timestamp) return false;
    const cacheTime = new Date(cacheEntry.timestamp);
    const now = new Date();
    const hoursDiff = (now - cacheTime) / (1000 * 60 * 60);
    return hoursDiff < 24;
}

// Carica coda prodotti
function loadQueue() {
    try {
        const data = fs.readFileSync(QUEUE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { queue: [], last_updated: null };
    }
}

// Salva coda prodotti
function saveQueue(data) {
    data.last_updated = new Date().toISOString();
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(data, null, 2));
}

// Pulisce ASIN vecchi di 30 giorni dal registro
function cleanupOldASINs() {
    const sentData = loadSentProducts();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Se il registro è troppo grande (> 1000 ASIN), pulisci i vecchi
    if (sentData.sent_asins.length > 1000) {
        console.log(`🧹 Pulizia ASIN vecchi: ${sentData.sent_asins.length} → mantenendo ultimi 1000`);
        sentData.sent_asins = sentData.sent_asins.slice(-1000);
        saveSentProducts(sentData);
    }
}

// Estrae ASIN da un link Amazon
function extractASIN(url) {
    const match = url.match(/\/dp\/([A-Z0-9]{10})/i);
    return match ? match[1] : null;
}

// Estrae prezzo e immagine dalla pagina Amazon con cache
async function extractProductData(asin) {
    const priceCache = loadPriceCache();
    
    // Controlla cache
    if (priceCache[asin] && isCacheValid(priceCache[asin])) {
        console.log(`  💾 Cache hit per ${asin}`);
        return { 
            price: priceCache[asin].price, 
            image: priceCache[asin].image 
        };
    }
    
    try {
        const url = `https://www.amazon.it/dp/${asin}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7'
            },
            timeout: 3000 // 3 secondi timeout per evitare blocchi
        });
        
        const $ = cheerio.load(response.data);
        
        // Estrae prezzo con molteplici selettori
        let price = null;
        
        // Funzione helper per convertire prezzo italiano in numero
        function parseItalianPrice(priceStr) {
            if (!priceStr) return null;
            // Rimuovi spazi e caratteri non numerici eccetto . e ,
            const cleaned = priceStr.replace(/[^\d.,]/g, '');
            if (!cleaned) return null;
            
            // Formato italiano: 1.234,56 (punto migliaia, virgola decimali)
            // Converti in formato JavaScript: 1234.56
            const parts = cleaned.split(',');
            if (parts.length === 2) {
                // Ha decimali
                const whole = parts[0].replace(/\./g, ''); // Rimuovi punti migliaia
                const decimal = parts[1];
                return parseFloat(`${whole}.${decimal}`);
            } else {
                // Solo parte intera
                return parseFloat(cleaned.replace(/\./g, ''));
            }
        }
        
        // Metodo 1: Prezzo standard con parte intera e frazionaria
        const priceWhole = $('#priceblock_ourprice_row .a-price-whole, #priceblock_dealprice_row .a-price-whole').first().text().trim();
        const priceFraction = $('#priceblock_ourprice_row .a-price-fraction, #priceblock_dealprice_row .a-price-fraction').first().text().trim();
        
        if (priceWhole && priceFraction) {
            price = parseItalianPrice(`${priceWhole},${priceFraction}`);
        }
        
        // Metodo 2: Prezzo in formato offscreen (standard Amazon)
        if (!price) {
            const priceText = $('.a-price .a-offscreen').first().text().trim();
            price = parseItalianPrice(priceText);
        }
        
        // Metodo 3: Prezzo nel buybox
        if (!price) {
            const buyboxPrice = $('#price_inside_buybox, #buyBoxPrice').first().text().trim();
            price = parseItalianPrice(buyboxPrice);
        }
        
        // Metodo 4: Prezzo Kindle/eBook specifico
        if (!price) {
            const kindlePrice = $('#kindle-price, #kindle-price-row .a-price .a-offscreen, #ebookPriceBlock .a-price .a-offscreen').first().text().trim();
            if (kindlePrice) {
                price = parseItalianPrice(kindlePrice);
            }
        }
        
        // Metodo 5: Prezzo in formato testo generico
        if (!price) {
            const allText = $('body').text();
            const priceMatches = allText.match(/€\s*[\d.,]+/g);
            if (priceMatches && priceMatches.length > 0) {
                price = parseItalianPrice(priceMatches[0]);
            }
        }
        
        // Estrae immagine principale con molteplici selettori
        let image = null;
        const imgTag = $('#landingImage, #imgBlkFront, #main-image, .imgTagWrapper img').first();
        if (imgTag.length > 0) {
            image = imgTag.attr('data-old-hires') || imgTag.attr('src') || imgTag.attr('data-src');
        }
        
        // Fallback per immagine
        if (!image) {
            const anyImage = $('img').first();
            if (anyImage.length > 0) {
                image = anyImage.attr('src');
            }
        }
        
        // Salva in cache
        priceCache[asin] = {
            price,
            image,
            timestamp: new Date().toISOString()
        };
        savePriceCache(priceCache);
        
        return { price, image };
    } catch (error) {
        console.error(`Errore estrazione dati per ${asin}:`, error.message);
        return { price: null, image: null };
    }
}

// Estrae prodotti da un file HTML della nicchia
function extractProductsFromHTML(html, nichePath) {
    const $ = cheerio.load(html);
    const products = [];
    
    $('.product-card').each((index, element) => {
        const $card = $(element);
        const title = $card.find('.card-title').text().trim();
        const description = $card.find('.card-text').text().trim();
        const link = $card.find('a[href*="amazon"]').attr('href');
        const image = $card.find('.product-image').attr('src');
        
        if (link && title) {
            const asin = extractASIN(link);
            if (asin) {
                products.push({
                    asin,
                    title,
                    description,
                    link,
                    image,
                    niche: nichePath
                });
            }
        }
    });
    
    return products;
}

// Funzione helper per retry con exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, delays = [1000, 5000, 15000]) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const isLastAttempt = attempt === maxRetries - 1;
            
            if (isLastAttempt) {
                throw error;
            }
            
            const delay = delays[attempt] || delays[delays.length - 1];
            console.log(`  🔄 Retry ${attempt + 1}/${maxRetries} tra ${delay/1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Invia messaggio a Telegram con fallback multipli e retry
async function sendToTelegram(product) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.log('TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID non configurati');
        return false;
    }
    
    // Ottieni configurazione categoria
    const categoryConfig = getCategoryConfig(product.niche);
    
    // Crea caption con prezzo se disponibile e personalizzazione categoria
    const priceText = product.price ? `💰 Prezzo: ${product.price.toFixed(2)}€\n\n` : '';
    const caption = `${categoryConfig.prefix} ${categoryConfig.emoji}\n\n<b>${product.title}</b>\n\n${priceText}${product.description}\n\n📦 <b>Acquista ora su Amazon</b>`;
    
    // Inline keyboard per i pulsanti
    const reply_markup = {
        inline_keyboard: [
            [{ text: "🛒 Acquista su Amazon", url: product.link }],
            [{ text: "🌐 Vedi tutti i prodotti", url: `${SITE_URL}/niches/${product.niche}/index.html` }]
        ]
    };
    
    // Validazione URL immagine
    const isValidImageUrl = product.image && product.image.startsWith('http') && product.image.length > 10;
    
    console.log(`📤 [${categoryConfig.emoji} ${categoryConfig.tone}] Tentativo invio: ${product.title.substring(0, 50)}...`);
    
    try {
        // Fallback 1: Invia foto se URL immagine valido (con retry)
        if (isValidImageUrl) {
            try {
                console.log(`  → Metodo 1: sendPhoto con immagine`);
                await retryWithBackoff(async () => {
                    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                        chat_id: TELEGRAM_CHAT_ID,
                        photo: product.image,
                        caption: caption,
                        parse_mode: 'HTML',
                        reply_markup
                    });
                });
                console.log('✅ Messaggio inviato con successo (sendPhoto)');
                return true;
            } catch (photoError) {
                console.log(`  ⚠️ sendPhoto fallito dopo retry: ${photoError.response?.data?.description || photoError.message}`);
                console.log(`  → Fallback a sendMessage`);
            }
        }
        
        // Fallback 2: Invia messaggio testo con HTML (con retry)
        try {
            console.log(`  → Metodo 2: sendMessage con HTML`);
            await retryWithBackoff(async () => {
                await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    chat_id: TELEGRAM_CHAT_ID,
                    text: caption,
                    parse_mode: 'HTML',
                    disable_web_page_preview: false,
                    reply_markup
                });
            });
            console.log('✅ Messaggio inviato con successo (sendMessage HTML)');
            return true;
        } catch (htmlError) {
            console.log(`  ⚠️ sendMessage HTML fallito dopo retry: ${htmlError.response?.data?.description || htmlError.message}`);
            console.log(`  → Fallback a plain text`);
        }
        
        // Fallback 3: Invia messaggio testo plain (con retry)
        try {
            const plainText = `${product.title}\n\n${priceText}${product.description}\n\nAcquista su Amazon: ${product.link}\n\nVedi tutti i prodotti: ${SITE_URL}/niches/${product.niche}/index.html`;
            console.log(`  → Metodo 3: sendMessage plain text`);
            await retryWithBackoff(async () => {
                await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    chat_id: TELEGRAM_CHAT_ID,
                    text: plainText,
                    reply_markup
                });
            });
            console.log('✅ Messaggio inviato con successo (sendMessage plain)');
            return true;
        } catch (plainError) {
            console.log(`  ⚠️ sendMessage plain fallito dopo retry: ${plainError.response?.data?.description || plainError.message}`);
        }
        
        // Fallback 4: Ultimo tentativo senza inline keyboard (con retry)
        try {
            const simpleText = `${product.title}\n\n${product.link}`;
            console.log(`  → Metodo 4: sendMessage semplice senza pulsanti`);
            await retryWithBackoff(async () => {
                await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    chat_id: TELEGRAM_CHAT_ID,
                    text: simpleText
                });
            });
            console.log('✅ Messaggio inviato con successo (sendMessage semplice)');
            return true;
        } catch (finalError) {
            console.log(`  ❌ Tutti i metodi falliti dopo retry: ${finalError.response?.data?.description || finalError.message}`);
            console.error('❌ Errore finale invio Telegram:', finalError.response?.data || finalError.message);
            if (finalError.response?.data) {
                console.error('Dettagli errore:', JSON.stringify(finalError.response.data, null, 2));
            }
            return false;
        }
        
    } catch (error) {
        console.error('❌ Errore generale sendToTelegram:', error.response?.data || error.message);
        if (error.response?.data) {
            console.error('Dettagli errore:', JSON.stringify(error.response.data, null, 2));
        }
        return false;
    }
}

// Funzione 1: Accoda nuovi prodotti (Cron Job - < 1s)
async function enqueueProducts() {
    console.log('📋 Accodamento prodotti -', new Date().toISOString());
    
    const sentData = loadSentProducts();
    const sentAsins = new Set(sentData.sent_asins);
    const queueData = loadQueue();
    const existingQueueASINs = new Set(queueData.queue.map(p => p.asin));
    
    let newQueuedCount = 0;
    
    // Pulizia ASIN vecchi
    cleanupOldASINs();
    
    // Raccogli tutti i prodotti da accodare
    for (const niche of NICCHIE_DA_CONTROLLARE) {
        const nichePath = path.join(PUBLIC_DIR, 'niches', niche, 'index.html');
        
        try {
            const html = fs.readFileSync(nichePath, 'utf8');
            const products = extractProductsFromHTML(html, niche);
            
            for (const product of products) {
                // Solo se non già inviato e non già in coda
                if (!sentAsins.has(product.asin) && !existingQueueASINs.has(product.asin)) {
                    queueData.queue.push({
                        ...product,
                        enqueued_at: new Date().toISOString()
                    });
                    existingQueueASINs.add(product.asin);
                    newQueuedCount++;
                }
            }
        } catch (error) {
            console.error(`Errore lettura nicchia ${niche}:`, error.message);
        }
    }
    
    if (newQueuedCount > 0) {
        saveQueue(queueData);
        console.log(`✅ Accodati ${newQueuedCount} nuovi prodotti (totale coda: ${queueData.queue.length})`);
    } else {
        console.log('ℹ️ Nessun nuovo prodotto da accodare');
    }
    
    return { success: true, queued: newQueuedCount, total: queueData.queue.length };
}

// Funzione 2: Processa coda (Batch di 5 prodotti - < 10s)
async function processQueue() {
    console.log('⚙️ Processamento coda -', new Date().toISOString());
    
    const queueData = loadQueue();
    const sentData = loadSentProducts();
    const sentAsins = new Set(sentData.sent_asins);
    const analytics = loadAnalytics();
    
    if (queueData.queue.length === 0) {
        console.log('ℹ️ Coda vuota, nulla da processare');
        return { success: true, processed: 0, remaining: 0 };
    }
    
    // Processa max 5 prodotti per esecuzione (per evitare ban Telegram)
    const BATCH_SIZE = 5;
    const productsToProcess = queueData.queue.slice(0, BATCH_SIZE);
    let processedCount = 0;
    
    console.log(`📦 Processamento ${productsToProcess.length} prodotti (coda totale: ${queueData.queue.length})`);
    
    for (const product of productsToProcess) {
        console.log(`Processando: ${product.title.substring(0, 50)}... (${product.asin})`);
        
        // Estrae prezzo e immagine da Amazon
        console.log(`  → Estrazione dati da Amazon...`);
        const productData = await extractProductData(product.asin);
        
        // Aggiunge dati al prodotto
        product.price = productData.price;
        product.image = productData.image;
        
        // Filtra prodotti per range prezzo specifico categoria
        const categoryConfig = getCategoryConfig(product.niche);
        const minPrice = categoryConfig.minPrice;
        const maxPrice = categoryConfig.maxPrice;
        
        if (product.price && (product.price < minPrice || product.price > maxPrice)) {
            console.log(`  ⏭️  Prezzo ${product.price.toFixed(2)}€ fuori range ${minPrice}-${maxPrice}€ (${product.niche}), saltato`);
            // Rimuovi dalla coda senza inviare
            queueData.queue = queueData.queue.filter(p => p.asin !== product.asin);
            continue;
        }
        
        if (product.price) {
            console.log(`  💰 Prezzo: ${product.price.toFixed(2)}€`);
        } else {
            console.log(`  ⚠️  Prezzo non trovato, skip prodotto`);
            // Rimuovi dalla coda senza inviare
            queueData.queue = queueData.queue.filter(p => p.asin !== product.asin);
            continue;
        }
        
        const sent = await sendToTelegram(product);
        if (sent) {
            sentAsins.add(product.asin);
            processedCount++;
            
            // Registra analytics
            trackEvent(analytics, 'send', product, true);
            
            // Rimuovi dalla coda
            queueData.queue = queueData.queue.filter(p => p.asin !== product.asin);
        } else {
            // Registra analytics fallimento
            trackEvent(analytics, 'send', product, false);
            
            // Se fallito, rimuovi comunque dalla coda per evitare loop infiniti
            console.log(`  ⚠️ Invio fallito, rimozione dalla coda per evitare loop`);
            queueData.queue = queueData.queue.filter(p => p.asin !== product.asin);
        }
        
        // Pausa tra invii (2.5s per evitare ban Telegram)
        if (processedCount < productsToProcess.length) {
            console.log(`  ⏸️ Pausa 2.5s tra prodotti...`);
            await new Promise(resolve => setTimeout(resolve, 2500));
        }
    }
    
    // Salva stato aggiornato
    saveSentProducts({
        sent_asins: Array.from(sentAsins),
        last_updated: new Date().toISOString()
    });
    saveQueue(queueData);
    saveAnalytics(analytics);
    
    console.log(`✅ Processati ${processedCount} prodotti (rimanenti in coda: ${queueData.queue.length})`);
    console.log(`📊 Analytics: Totale inviati: ${analytics.total_sent}`);
    
    return { success: true, processed: processedCount, remaining: queueData.queue.length };
}

// Funzione principale legacy (per compatibilità)
async function main() {
    console.log('Bot avviato -', new Date().toISOString());
    
    const sentData = loadSentProducts();
    const sentAsins = new Set(sentData.sent_asins);
    const analytics = loadAnalytics();
    let newProductsCount = 0;
    
    // Configurazione rate limiting
    const BATCH_SIZE = 10;
    const DELAY_BETWEEN_MESSAGES = 2500; // 2.5 secondi
    const DELAY_BETWEEN_BATCHES = 5000; // 5 secondi
    const RATE_LIMIT_PAUSE = 60000; // 1 minuto pausa se 429
    
    let rateLimitHit = false;
    let productsToSend = [];
    
    // Raccogli tutti i prodotti da inviare
    for (const niche of NICCHIE_DA_CONTROLLARE) {
        const nichePath = path.join(PUBLIC_DIR, 'niches', niche, 'index.html');
        
        try {
            const html = fs.readFileSync(nichePath, 'utf8');
            const products = extractProductsFromHTML(html, niche);
            
            console.log(`Nicchia ${niche}: trovati ${products.length} prodotti`);
            
            for (const product of products) {
                if (!sentAsins.has(product.asin)) {
                    productsToSend.push(product);
                }
            }
        } catch (error) {
            console.error(`Errore lettura nicchia ${niche}:`, error.message);
        }
    }
    
    console.log(`📦 Totale prodotti da inviare: ${productsToSend.length}`);
    
    // Processa in batch
    for (let i = 0; i < productsToSend.length; i++) {
        const product = productsToSend[i];
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const positionInBatch = i % BATCH_SIZE;
        
        // Pausa tra batch
        if (positionInBatch === 0 && i > 0) {
            console.log(`⏸️ Pausa tra batch (${batchNumber})...`);
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
        
        // Pausa se rate limit hit
        if (rateLimitHit) {
            console.log(`⚠️ Rate limit hit, pausa di ${RATE_LIMIT_PAUSE/1000}s...`);
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_PAUSE));
            rateLimitHit = false;
        }
        
        console.log(`Nuovo prodotto: ${product.title} (${product.asin})`);
        
        // Estrae prezzo e immagine da Amazon
        console.log(`  → Estrazione dati da Amazon...`);
        const productData = await extractProductData(product.asin);
        
        // Aggiunge dati al prodotto
        product.price = productData.price;
        product.image = productData.image;
        
        // Filtra solo prodotti 0-40€
        if (product.price && (product.price < 0 || product.price > 40)) {
            console.log(`  ⏭️  Prezzo ${product.price.toFixed(2)}€ fuori range 0-40€, saltato`);
            continue;
        }
        
        if (product.price) {
            console.log(`  💰 Prezzo: ${product.price.toFixed(2)}€`);
        } else {
            console.log(`  ⚠️  Prezzo non trovato, invio comunque`);
        }
        
        const sent = await sendToTelegram(product);
        if (sent) {
            sentAsins.add(product.asin);
            newProductsCount++;
            
            // Registra analytics
            trackEvent(analytics, 'send', product, true);
            
            // Pausa tra messaggi (tranne ultimo del batch)
            if (positionInBatch < BATCH_SIZE - 1 && i < productsToSend.length - 1) {
                await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_MESSAGES));
            }
        } else {
            // Registra analytics fallimento
            trackEvent(analytics, 'send', product, false);
            
            // Controlla se è errore 429 (rate limit)
            const lastError = product.lastError;
            if (lastError && lastError.response?.data?.error_code === 429) {
                console.log(`🚨 Rate limit 429 rilevato!`);
                rateLimitHit = true;
            }
        }
    }
    
    // Salva il registro aggiornato
    if (newProductsCount > 0) {
        saveSentProducts({
            sent_asins: Array.from(sentAsins),
            last_updated: new Date().toISOString()
        });
        console.log(`✅ Inviati ${newProductsCount} nuovi prodotti`);
    } else {
        console.log('ℹ️ Nessun nuovo prodotto da inviare');
    }
    
    // Salva analytics
    saveAnalytics(analytics);
    console.log(`📊 Analytics: Totale inviati: ${analytics.total_sent}, Categorie: ${Object.keys(analytics.by_category).length}`);
}

// Export per Vercel con supporto operazioni separate
module.exports = async (req, res) => {
    try {
        const operation = req.query.op || 'main';
        
        if (operation === 'enqueue') {
            // Cron job: accoda nuovi prodotti (< 1s)
            const result = await enqueueProducts();
            res.status(200).json(result);
        } else if (operation === 'process') {
            // Cron job: processa coda (batch 5 prodotti < 10s)
            const result = await processQueue();
            res.status(200).json(result);
        } else {
            // Legacy: processamento completo (solo per locale/test)
            await main();
            res.status(200).json({ success: true, message: 'Bot eseguito con successo (legacy mode)' });
        }
    } catch (error) {
        console.error('Errore bot:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Per esecuzione locale
if (require.main === module) {
    const operation = process.argv[2] || 'main';
    
    if (operation === 'enqueue') {
        enqueueProducts();
    } else if (operation === 'process') {
        processQueue();
    } else {
        main();
    }
}
