// Script per aggiornare automaticamente le combo dai prodotti delle nicchie
const fs = require('fs');
const path = require('path');

const lavoroDir = '/home/lollo/amazon/lavoro';
const comboDatabasePath = path.join(lavoroDir, 'bot', 'combo-database.js');

// Lista delle nicchie
const niches = [
    'abbigliamento-ciclismo',
    'abbigliamento-lavoro',
    'abbigliamento-serie-tv-film',
    'accessori-moda',
    'arredamento-casa',
    'benessere-cura-personale',
    'biciclette-mobilita',
    'calcio',
    'cucina-elettrodomestici',
    'dvd-bluray',
    'elite-gaming-gear',
    'fai-da-te',
    'fitness-casa',
    'giochi-da-tavolo',
    'libri-ereader',
    'manga-anime',
    'mare-spiaggia',
    'moda-donna',
    'moda-uomo',
    'musica-vinili',
    'outdoor-camping',
    'parrucchiere-barbiere',
    'pet-care-intelligente',
    'profumi-bellezza',
    'pugilato',
    'smart-home-domotica',
    'smartphone-tech',
    'snack-bevande',
    'softair',
    'sostenibilita-eco-friendly',
    'sport-estivi',
    'studio-fotografico',
    'tech',
    'ufficio-produttivo',
    'viaggi-vacanze'
];

// Funzione per estrarre prodotti Amazon da un file HTML
function extractAmazonProducts(htmlContent) {
    const products = [];
    const regex = /amazon\.it\/dp\/([A-Z0-9]+)/g;
    let match;
    
    while ((match = regex.exec(htmlContent)) !== null) {
        const asin = match[1];
        if (!products.includes(asin)) {
            products.push(asin);
        }
    }
    
    return products;
}

// Funzione per leggere una nicchia
function readNiche(nicheName) {
    const nichePath = path.join(lavoroDir, nicheName, 'index.html');
    
    if (!fs.existsSync(nichePath)) {
        console.log(`Niche not found: ${nicheName}`);
        return [];
    }
    
    const htmlContent = fs.readFileSync(nichePath, 'utf-8');
    return extractAmazonProducts(htmlContent);
}

// Funzione principale
function main() {
    console.log('Starting combo update from niches...\n');
    
    const nicheProducts = {};
    
    // Leggi tutte le nicchie
    for (const niche of niches) {
        console.log(`Reading niche: ${niche}`);
        const products = readNiche(niche);
        nicheProducts[niche] = products;
        console.log(`  Found ${products.length} products\n`);
    }
    
    // Salva i risultati
    const outputPath = path.join(lavoroDir, 'niche-products.json');
    fs.writeFileSync(outputPath, JSON.stringify(nicheProducts, null, 2));
    
    console.log(`\nResults saved to: ${outputPath}`);
    console.log('\nSummary:');
    Object.entries(nicheProducts).forEach(([niche, products]) => {
        console.log(`${niche}: ${products.length} products`);
    });
}

main();
