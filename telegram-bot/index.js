const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Configuration
const TELEGRAM_BOT_TOKEN = '8912118097:AAE1JSOfr51ZA7NyBOMRAaocK74qSKaWZOI';
const TELEGRAM_CHANNEL_ID = '-1004386515041';
const PRODUCTS_JSON_PATH = path.join(__dirname, '../public/products.json');
const MAX_PRICE = 40;
const PRODUCTS_PER_CYCLE = 15;

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
        if (product.published && product.publishedAt) {
            const publishedDate = new Date(product.publishedAt);
            if (publishedDate > oneDayAgo) {
                return false;
            }
        }
        
        return true;
    });
}

// Select smart products with scoring
function selectSmartProducts(products, count) {
    // Score each product
    const scoredProducts = products.map(product => {
        let score = 0;
        
        // Prefer products with images
        if (product.image) score += 10;
        
        // Prefer products with lower prices (better deals)
        if (product.price !== null) {
            score += Math.max(0, 40 - product.price) / 2; // More points for lower prices
        }
        
        // Prefer products that haven't been published recently
        if (!product.published) score += 5;
        
        return { ...product, score };
    });
    
    // Sort by score (highest first)
    scoredProducts.sort((a, b) => b.score - a.score);
    
    // Select top products with niche diversity
    const selected = [];
    const usedNiches = new Set();
    
    for (const product of scoredProducts) {
        if (selected.length >= count) break;
        
        // Prefer products from different niches
        if (!usedNiches.has(product.niche) || selected.length < count - 1) {
            selected.push(product);
            usedNiches.add(product.niche);
        }
    }
    
    // If we need more products, add from remaining
    if (selected.length < count) {
        const remaining = scoredProducts.filter(p => !selected.includes(p));
        const needed = count - selected.length;
        selected.push(...remaining.slice(0, needed));
    }
    
    return selected;
}

// Message templates for variety
const messageTemplates = [
    (name, price) => `🔥 OFFERTA DEL GIORNO\n\n🏷 ${name}\n${price ? `💰 Prezzo: €${price.toFixed(2)}` : ''}\n\n✅ Prime Gratuita\n✅ Reso 30 giorni`,
    (name, price) => `⚡ SUPER OFFERTA\n\n📦 ${name}\n${price ? `💵 Solo €${price.toFixed(2)}` : ''}\n\n🚀 Spedizione Gratuita\n🔄 Reso facile`,
    (name, price) => `🎯 DEAL DEL MOMENTO\n\n🏷 ${name}\n${price ? `💰 Prezzo: €${price.toFixed(2)}` : ''}\n\n✅ Prime\n✅ 30 giorni reso`,
    (name, price) => `💎 SCONTO ESCLUSIVO\n\n📦 ${name}\n${price ? `💵 €${price.toFixed(2)}` : ''}\n\n🚀 Prime Gratis\n🔄 Reso 30gg`
];

// Send product to Telegram
async function sendProductToTelegram(product) {
    const nameShort = product.name.length > 60 ? product.name.substring(0, 60) + '...' : product.name;
    
    // Random message template
    const templateIndex = Math.floor(Math.random() * messageTemplates.length);
    const caption = messageTemplates[templateIndex](nameShort, product.price);
    
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
        
        // Select smart products
        const productsToSend = selectSmartProducts(availableProducts, PRODUCTS_PER_CYCLE);
        console.log(`🎯 Selezionati ${productsToSend.length} prodotti da inviare (smart selection)`);
        
        // Send products
        const sentProducts = [];
        for (const product of productsToSend) {
            const success = await sendProductToTelegram(product);
            if (success) {
                sentProducts.push(product);
            }
            
            // Random delay between messages (30-60 seconds)
            const delay = Math.floor(Math.random() * 30000) + 30000;
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

// Export for Vercel
module.exports = { runBot };

// Run locally
if (require.main === module) {
    runBot();
}
