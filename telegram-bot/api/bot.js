const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8912118097:AAE1JSOfr51ZA7NyBOMRAaocK74qSKaWZOI';
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1004386515041';
const PRODUCTS_JSON_PATH = path.join(__dirname, '../../public/products.json');
const MAX_PRICE = 40;
const PRODUCTS_PER_CYCLE = 5;

// Initialize bot
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

// Load products database
function loadProductsDatabase() {
    try {
        const data = fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Errore caricamento database:', error);
        return { products: [] };
    }
}

// Save products database
function saveProductsDatabase(database) {
    try {
        fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(database, null, 2));
        console.log('✅ Database salvato');
    } catch (error) {
        console.error('❌ Errore salvataggio database:', error);
    }
}

// Filter products by price and publication status
function filterProducts(database) {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return database.products.filter(product => {
        // Filter by price if available
        if (product.price !== null && product.price > MAX_PRICE) {
            return false;
        }
        
        // Filter already published products (keep unpublished or published > 24h ago)
        if (product.published) {
            const publishedDate = new Date(product.publishedAt);
            if (publishedDate > oneDayAgo) {
                return false;
            }
        }
        
        return true;
    });
}

// Select random products
function selectRandomProducts(products, count) {
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, products.length));
}

// Send product to Telegram
async function sendProductToTelegram(product) {
    const nameShort = product.name.length > 60 ? product.name.substring(0, 60) + '...' : product.name;
    
    // Build caption with available data
    let caption = `🔥 OFFERTA DEL GIORNO\n\n🏷 ${nameShort}`;
    
    if (product.price !== null && product.price > 0) {
        caption += `\n💰 Prezzo: €${product.price.toFixed(2)}`;
    }
    
    caption += `\n\n✅ Prime Gratuita\n✅ Reso 30 giorni`;
    
    const keyboard = {
        inline_keyboard: [
            [
                { text: '📦 Acquista su Amazon', url: product.link }
            ],
            [
                { text: '🌐 Vedi altre offerte sul sito', url: 'https://smart-choices-guide.vercel.app' }
            ]
        ]
    };
    
    console.log(`📤 Tentativo invio: ${product.asin} - ${nameShort}`);
    console.log(`   Prezzo: ${product.price}, Immagine: ${product.image ? 'Si' : 'No'}`);
    
    try {
        // Try to send photo if image is available
        if (product.image && product.image.startsWith('http')) {
            await bot.sendPhoto(TELEGRAM_CHANNEL_ID, product.image, {
                caption: caption,
                reply_markup: keyboard,
                parse_mode: 'HTML'
            });
            console.log(`✅ Inviato con foto: ${product.asin}`);
        } else {
            // Send text message if no image
            await bot.sendMessage(TELEGRAM_CHANNEL_ID, caption, {
                reply_markup: keyboard,
                parse_mode: 'HTML'
            });
            console.log(`✅ Inviato testo: ${product.asin}`);
        }
        return true;
    } catch (error) {
        console.error(`❌ Errore invio ${product.asin}:`, error.message);
        
        // Fallback to text message if photo fails
        if (product.image) {
            console.log(`   Fallback a messaggio testo...`);
            try {
                await bot.sendMessage(TELEGRAM_CHANNEL_ID, caption, {
                    reply_markup: keyboard,
                    parse_mode: 'HTML'
                });
                console.log(`✅ Fallback riuscito: ${product.asin}`);
                return true;
            } catch (fallbackError) {
                console.error(`❌ Fallback fallito:`, fallbackError.message);
            }
        }
        return false;
    }
}

// Mark products as published
function markProductsAsPublished(database, products) {
    const now = new Date().toISOString();
    
    products.forEach(product => {
        const dbProduct = database.products.find(p => p.asin === product.asin);
        if (dbProduct) {
            dbProduct.published = true;
            dbProduct.publishedAt = now;
        }
    });
    
    database.lastUpdated = now;
    saveProductsDatabase(database);
}

// Main bot function
async function runBot() {
    console.log('🚀 Bot Telegram avviato!');
    console.log(`📊 Filtro prezzo: 0-${MAX_PRICE}€`);
    console.log(`🎯 Prodotti per ciclo: ${PRODUCTS_PER_CYCLE}`);
    
    try {
        // Load database
        const database = loadProductsDatabase();
        console.log(`📦 Database caricato: ${database.products.length} prodotti totali`);
        
        // Filter products
        const availableProducts = filterProducts(database);
        console.log(`✅ Prodotti disponibili: ${availableProducts.length}`);
        
        if (availableProducts.length === 0) {
            console.log('⚠️ Nessun prodotto disponibile da inviare');
            return;
        }
        
        // Select random products
        const productsToSend = selectRandomProducts(availableProducts, PRODUCTS_PER_CYCLE);
        console.log(`🎯 Selezionati ${productsToSend.length} prodotti da inviare`);
        
        // Send products
        const sentProducts = [];
        for (const product of productsToSend) {
            const success = await sendProductToTelegram(product);
            if (success) {
                sentProducts.push(product);
            }
            
            // Random delay between messages (1-3 minutes)
            const delay = Math.floor(Math.random() * 120000) + 60000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        // Mark as published
        if (sentProducts.length > 0) {
            markProductsAsPublished(database, sentProducts);
            console.log(`✅ ${sentProducts.length} prodotti marcati come pubblicati`);
        }
        
    } catch (error) {
        console.error('❌ Errore bot:', error);
    }
}

// Vercel API handler
module.exports = async (req, res) => {
    // Only allow POST requests for cron jobs
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    console.log('🔄 Cron job triggered');
    
    try {
        await runBot();
        res.status(200).json({ success: true, message: 'Bot executed successfully' });
    } catch (error) {
        console.error('❌ Cron job error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
