const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');

const BASE_PATH = '/home/lollo/amazon/public/niches';
const OUTPUT_FILE = '/home/lollo/amazon/public/products.json';

// Funzione per ottenere link pulito senza tag affiliate
function getCleanAmazonLink(affiliateLink) {
    return affiliateLink.split('?')[0] + '?th=1';
}

// Funzione per scraping Amazon senza click falsi
async function scrapeAmazonProductData(asin) {
    try {
        const cleanLink = `https://www.amazon.it/dp/${asin}?th=1`;
        const response = await axios.get(cleanLink, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'it-IT,it;q=0.8,en-US;q=0.5,en;q=0.3'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        
        // Estrai prezzo - più selettori per coprire diverse strutture Amazon
        let price = null;
        const priceSelectors = [
            '#priceblock_ourprice',
            '#priceblock_dealprice', 
            '.a-price .a-offscreen',
            '#price_inside_buybox',
            '#priceblock_ourprice_row',
            '#priceblock_saleprice',
            '.a-price-whole',
            '#tmmSwatches .a-price .a-offscreen',
            '#buyBoxSection .a-price .a-offscreen',
            '#newBuyBoxPrice .a-offscreen',
            '#usedPrice .a-offscreen',
            '.a-price .a-offscreen'
        ];
        
        for (const selector of priceSelectors) {
            const priceElement = $(selector).first();
            if (priceElement.length > 0) {
                const priceText = priceElement.text().trim();
                // Try multiple price patterns
                const patterns = [
                    /€\s*([\d,]+(?:\.\d+)?)/,  // €29,99 or €29.99
                    /([\d,]+(?:\.\d+)?)\s*€/,  // 29,99€ or 29.99€
                    /([\d,]+(?:\.\d+)?)/      // Just numbers (fallback)
                ];
                
                for (const pattern of patterns) {
                    const priceMatch = priceText.match(pattern);
                    if (priceMatch) {
                        price = parseFloat(priceMatch[1].replace(',', '.'));
                        if (price > 0 && price < 10000) { // Sanity check
                            break;
                        }
                    }
                }
                if (price) break;
            }
        }
        
        // Estrai immagine
        let image = null;
        const imgSelectors = ['#landingImage', '#imgBlkFront', '.a-dynamic-image', '#altImages img'];
        for (const selector of imgSelectors) {
            const imgElement = $(selector).first();
            if (imgElement.length > 0) {
                image = imgElement.attr('src') || imgElement.attr('data-src');
                if (image) break;
            }
        }
        
        return { price, image };
        
    } catch (error) {
        console.log(`⚠️ Errore scraping ${asin}: ${error.message}`);
        return { price: null, image: null };
    }
}

function extractProductsFromHTML(htmlFile) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    const $ = cheerio.load(html);
    const products = [];
    
    // Trova card prodotto
    $('.card, .product-card, .col-md-3, .col-lg-3').each((index, element) => {
        const $card = $(element);
        const link = $card.find('a[href*="amazon.it"]').first();
        
        if (link.length > 0) {
            const href = link.attr('href');
            const asinMatch = href.match(/\/dp\/([A-Z0-9]{10})/);
            
            if (asinMatch) {
                const asin = asinMatch[1];
                
                // Estrai nome prodotto
                let name = $card.find('h3, h4, h5, .card-title, .product-title').first().text().trim();
                if (!name || name.length < 5) {
                    name = $card.find('.card-body').text().trim();
                }
                
                if (name && name.length > 5 && name !== 'Acquista su Amazon') {
                    products.push({
                        asin: asin,
                        name: name.substring(0, 100),
                        link: href, // Link con tag affiliate per il bot
                        published: false,
                        publishedAt: null,
                        price: null, // Sarà popolato dallo scraping
                        image: null, // Sarà popolato dallo scraping
                        niche: htmlFile.split('/').slice(-2)[0]
                    });
                }
            }
        }
    });
    
    return products;
}

function scanAllNiches() {
    const allProducts = [];
    const seenAsins = new Set();
    
    function scanDirectory(dir) {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                scanDirectory(filePath);
            } else if (file === 'index.html') {
                const products = extractProductsFromHTML(filePath);
                products.forEach(product => {
                    if (!seenAsins.has(product.asin)) {
                        seenAsins.add(product.asin);
                        allProducts.push(product);
                    }
                });
            }
        });
    }
    
    scanDirectory(BASE_PATH);
    return allProducts;
}

async function main() {
    console.log('🔍 Scansione prodotti dal sito...');
    const products = scanAllNiches();
    console.log(`📦 Trovati ${products.length} prodotti`);
    
    // Scraping Amazon per prezzi e immagini (senza click falsi)
    console.log('🔄 Scraping Amazon per prezzi e immagini...');
    const batchSize = 10; // Processa 10 prodotti alla volta per evitare rate limiting
    
    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        const promises = batch.map(async (product) => {
            const { price, image } = await scrapeAmazonProductData(product.asin);
            product.price = price;
            product.image = image;
            console.log(`   ${product.asin}: Prezzo=${price}, Immagine=${image ? 'Si' : 'No'}`);
        });
        
        await Promise.all(promises);
        
        // Pausa tra batch per evitare rate limiting
        if (i + batchSize < products.length) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 secondi pausa
        }
    }
    
    const database = {
        lastUpdated: new Date().toISOString(),
        totalProducts: products.length,
        products: products
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(database, null, 2));
    console.log(`✅ Database creato: ${products.length} prodotti salvati in ${OUTPUT_FILE}`);
}

main();
