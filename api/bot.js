const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Configurazione
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8912118097:AAE1JSOfr51ZA7NyBOMRAaocK74qSKaWZOI';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '@ilmigliorprezzo';
const SITE_URL = process.env.SITE_URL || 'https://iltuosito.it';

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
    'sport/abbigliamento-sportivo',
    'viaggi-vacanze'
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

// Estrae prezzo e immagine dalla pagina Amazon
async function extractProductData(asin) {
    try {
        const url = `https://www.amazon.it/dp/${asin}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7'
            }
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
        
        // Metodo 4: Prezzo in formato testo generico
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

// Invia messaggio a Telegram
async function sendToTelegram(product) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.log('TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID non configurati');
        return false;
    }
    
    // Crea caption con prezzo se disponibile
    const priceText = product.price ? `💰 Prezzo: ${product.price.toFixed(2)}€\n\n` : '';
    const caption = `🔥 <b>${product.title}</b>\n\n${priceText}${product.description}\n\n📦 <b>Acquista ora su Amazon</b>`;
    
    try {
        // Se c'è immagine, invia foto
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
            // Altrimenti invia solo testo
            await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: TELEGRAM_CHAT_ID,
                text: caption,
                parse_mode: 'HTML',
                disable_web_page_preview: false,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🛒 Acquista su Amazon", url: product.link }],
                        [{ text: "🌐 Vedi tutti i prodotti", url: `${SITE_URL}/niches/${product.niche}/index.html` }]
                    ]
                }
            });
        }
        
        console.log('✅ Messaggio inviato con successo');
        return true;
    } catch (error) {
        console.error('❌ Errore invio Telegram:', error.response?.data || error.message);
        if (error.response?.data) {
            console.error('Dettagli errore:', JSON.stringify(error.response.data, null, 2));
        }
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
                        
                        // Pausa tra invii per evitare rate limiting
                        await new Promise(resolve => setTimeout(resolve, 3000));
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
