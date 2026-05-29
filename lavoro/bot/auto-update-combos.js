// Script per aggiornare automaticamente le combo dai prodotti delle nicchie
const fs = require('fs');
const path = require('path');

const lavoroDir = '/home/lollo/amazon/lavoro';
const comboDatabasePath = path.join(lavoroDir, 'bot', 'combo-database.js');
const nicheProductsPath = path.join(lavoroDir, 'niche-products.json');

// Mapping nicchie -> chiavi combo
const nicheToComboKey = {
    'abbigliamento-ciclismo': 'abbigliamento-ciclismo',
    'abbigliamento-lavoro': 'abbigliamento-lavoro',
    'abbigliamento-serie-tv-film': 'abbigliamento-serie-tv-film',
    'accessori-moda': 'moda',
    'arredamento-casa': 'arredamento-casa',
    'benessere-cura-personale': 'benessere',
    'veicoli': 'biciclette',
    'calcio': 'calcio',
    'cucina-elettrodomestici': 'cucina',
    'dvd-bluray': 'cinema',
    'elite-gaming-gear': 'pc',
    'fai-da-te': 'fai-da-te',
    'fitness-casa': 'fitness',
    'giochi-da-tavolo': 'giochi-da-tavolo',
    'libri-ereader': 'libri',
    'manga-anime': 'manga-anime',
    'mare-spiaggia': 'mare',
    'moda-donna': 'moda',
    'moda-uomo': 'moda',
    'musica-vinili': 'musica-vinili',
    'outdoor-camping': 'outdoor',
    'parrucchiere-barbiere': 'parrucchiere-barbiere',
    'pet-care-intelligente': 'pet-care',
    'profumi-bellezza': 'profumi',
    'pugilato': 'pugilato',
    'smart-home-domotica': 'smart-home',
    'smartphone-tech': 'smartphone',
    'snack-bevande': 'bibite-bevande',
    'softair': 'softair',
    'sostenibilita-eco-friendly': 'sostenibilita',
    'sport-estivi': 'sport-estivi',
    'studio-fotografico': 'fotografia',
    'tech': 'pc',
    'ufficio-produttivo': 'ufficio',
    'viaggi-vacanze': 'viaggi'
};

// Coca-Cola Zero fallback
const cocaColaZero = {
    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
};

// Funzione per estrarre ASIN da link Amazon
function extractASIN(link) {
    const match = link.match(/\/dp\/([A-Z0-9]+)/);
    return match ? match[1] : null;
}

// Funzione principale
function main() {
    console.log('Starting automatic combo update...\n');
    
    // Leggi prodotti delle nicchie
    const nicheProducts = JSON.parse(fs.readFileSync(nicheProductsPath, 'utf-8'));
    
    // Leggi combo database
    const comboContent = fs.readFileSync(comboDatabasePath, 'utf-8');
    
    // Analizza combo esistenti
    const existingCombos = {};
    const comboRegex = /"([^"]+)":\s*\{\s*name:\s*"([^"]+)"/g;
    let match;
    
    while ((match = comboRegex.exec(comboContent)) !== null) {
        existingCombos[match[1]] = match[2];
    }
    
    console.log('Existing combo keys:', Object.keys(existingCombos).length);
    console.log('Niche products keys:', Object.keys(nicheProducts).length);
    
    // Trova nicchie senza combo
    const nichesWithoutCombo = [];
    for (const niche of Object.keys(nicheProducts)) {
        const comboKey = nicheToComboKey[niche] || niche;
        if (!existingCombos[comboKey]) {
            nichesWithoutCombo.push({ niche, comboKey, products: nicheProducts[niche] });
        }
    }
    
    console.log('\nNiches without combo:', nichesWithoutCombo.length);
    nichesWithoutCombo.forEach(({ niche, comboKey, products }) => {
        console.log(`  ${niche} -> ${comboKey} (${products.length} products)`);
    });
    
    // Genera nuove combo per nicchie senza combo
    const newCombos = [];
    
    for (const { niche, comboKey, products } of nichesWithoutCombo) {
        if (products.length === 0) {
            console.log(`  Skipping ${niche}: no products`);
            continue;
        }
        
        // Usa il primo prodotto + Coca-Cola Zero
        const firstASIN = products[0];
        const firstProduct = {
            name: `Product ${firstASIN}`,
            link: `https://www.amazon.it/dp/${firstASIN}?&linkCode=ll2&tag=l0c39-21&linkId=auto&ref=_as_li_ss_tl`
        };
        
        newCombos.push({
            key: comboKey,
            name: niche.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            product1: firstProduct,
            product2: cocaColaZero,
            message: `Scopri i migliori prodotti per ${niche.replace(/-/g, ' ')}! Ecco la combo perfetta.`
        });
    }
    
    console.log('\nNew combos to add:', newCombos.length);
    newCombos.forEach(combo => {
        console.log(`  ${combo.key}: ${combo.name}`);
    });
    
    // Salva le nuove combo
    if (newCombos.length > 0) {
        const outputPath = path.join(lavoroDir, 'new-combos.json');
        fs.writeFileSync(outputPath, JSON.stringify(newCombos, null, 2));
        console.log(`\nNew combos saved to: ${outputPath}`);
    }
}

main();
