// Script per estrarre nomi reali dei prodotti dalle nicchie
const fs = require('fs');
const path = require('path');

const lavoroDir = '/home/lollo/amazon/lavoro';
const nicheProductsPath = path.join(lavoroDir, 'niche-products.json');

// Funzione per estrarre nome prodotto da HTML
function extractProductName(htmlContent, asin) {
    // Cerca il card-title o h5 vicino al link Amazon
    const regex = new RegExp(`<h5[^>]*>\\s*([^<]+)\\s*</h5>[\\s\\S]{0,500}${asin}`, 'i');
    const match = htmlContent.match(regex);
    if (match) {
        return match[1].trim();
    }
    
    // Fallback: cerca card-title vicino
    const cardTitleRegex = new RegExp(`card-title[^>]*>\\s*([^<]+)\\s*</[a-z]+>[\\s\\S]{0,300}${asin}`, 'i');
    const cardMatch = htmlContent.match(cardTitleRegex);
    if (cardMatch) {
        return cardMatch[1].trim();
    }
    
    return `Product ${asin}`;
}

// Funzione principale
function main() {
    console.log('Extracting real product names from niches...\n');
    
    const nicheProducts = JSON.parse(fs.readFileSync(nicheProductsPath, 'utf-8'));
    const productNames = {};
    
    for (const niche of Object.keys(nicheProducts)) {
        const nichePath = path.join(lavoroDir, niche, 'index.html');
        
        if (!fs.existsSync(nichePath)) {
            console.log(`Niche not found: ${niche}`);
            continue;
        }
        
        const htmlContent = fs.readFileSync(nichePath, 'utf-8');
        const asins = nicheProducts[niche];
        
        console.log(`Processing ${niche} (${asins.length} products)`);
        
        for (const asin of asins) {
            const name = extractProductName(htmlContent, asin);
            productNames[asin] = name;
            console.log(`  ${asin}: ${name}`);
        }
    }
    
    // Salva i nomi
    const outputPath = path.join(lavoroDir, 'product-names.json');
    fs.writeFileSync(outputPath, JSON.stringify(productNames, null, 2));
    
    console.log(`\nProduct names saved to: ${outputPath}`);
}

main();
