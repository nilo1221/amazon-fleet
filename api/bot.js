const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Configurazione
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8912118097:AAE1JSOfr51ZA7NyBOMRAaocK74qSKaWZOI';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '@ilmigliorprezzo';
const SITE_URL = process.env.SITE_URL || 'https://iltuosito.it';

// Nicchie da controllare (solo quelle specificate)
const NICCHIE_DA_CONTROLLARE = [
    'moda/abbigliamento-lavoro',
    'moda/abbigliamento-bambino',
    'tech/smartphone-tech'
];

// Percorsi dei file
const SENT_PRODUCTS_FILE = path.join(__dirname, '../data/sent_products.json');
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

// Estrae ASIN da un link Amazon
function extractASIN(url) {
    const match = url.match(/\/dp\/([A-Z0-9]{10})/i);
    return match ? match[1] : null;
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

// Invia messaggio a Telegram
async function sendToTelegram(product) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.log('TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID non configurati');
        return false;
    }
    
    const caption = `🔥 <b>${product.title}</b>\n\n💰 <i>${product.description}</i>\n\n📦 <b>Acquista ora su Amazon</b>`;
    
    try {
        if (product.image) {
            await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                chat_id: TELEGRAM_CHAT_ID,
                photo: product.image,
                caption: caption,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🛒 Acquista su Amazon", url: product.link }],
                        [{ text: "🌐 Vedi tutti i prodotti", url: `${SITE_URL}/niches/${product.niche}/index.html` }]
                    ]
                }
            });
        } else {
            await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: TELEGRAM_CHAT_ID,
                text: caption,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🛒 Acquista su Amazon", url: product.link }],
                        [{ text: "🌐 Vedi tutti i prodotti", url: `${SITE_URL}/niches/${product.niche}/index.html` }]
                    ]
                }
            });
        }
        return true;
    } catch (error) {
        console.error('Errore invio Telegram:', error.message);
        return false;
    }
}

// Funzione principale
async function main() {
    console.log('Bot avviato -', new Date().toISOString());
    
    const sentData = loadSentProducts();
    const sentAsins = new Set(sentData.sent_asins);
    let newProductsCount = 0;
    
    for (const niche of NICCHIE_DA_CONTROLLARE) {
        const nichePath = path.join(PUBLIC_DIR, 'niches', niche, 'index.html');
        
        try {
            const html = fs.readFileSync(nichePath, 'utf8');
            const products = extractProductsFromHTML(html, niche);
            
            console.log(`Nicchia ${niche}: trovati ${products.length} prodotti`);
            
            for (const product of products) {
                if (!sentAsins.has(product.asin)) {
                    console.log(`Nuovo prodotto: ${product.title} (${product.asin})`);
                    
                    const sent = await sendToTelegram(product);
                    if (sent) {
                        sentAsins.add(product.asin);
                        newProductsCount++;
                        
                        // Pausa tra invii per evitare rate limiting
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
            }
        } catch (error) {
            console.error(`Errore lettura nicchia ${niche}:`, error.message);
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
}

// Export per Vercel
module.exports = async (req, res) => {
    try {
        await main();
        res.status(200).json({ success: true, message: 'Bot eseguito con successo' });
    } catch (error) {
        console.error('Errore bot:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Per esecuzione locale
if (require.main === module) {
    main();
}
