const fs = require('fs');
const path = require('path');

// Funzione per contare i prodotti in un file HTML
function countProductsInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Conta card-title come metodo principale
    const cardTitleMatches = content.match(/card-title/g);
    if (cardTitleMatches && cardTitleMatches.length > 0) {
        return cardTitleMatches.length;
    }
    // Se non ci sono card-title, conta h3 class="h4 mb-3" (per site_13)
    const h4Matches = content.match(/h3 class="h4 mb-3"/g);
    return h4Matches ? h4Matches.length : 0;
}

// Funzione per aggiornare il file JSON
function updateJsonFile(counts) {
    const jsonPath = path.join(__dirname, 'product-counts.json');
    fs.writeFileSync(jsonPath, JSON.stringify(counts, null, 2));
    console.log('✅ File product-counts.json aggiornato');
}

// Funzione per aggiornare l'HTML dell'index.html
function updateIndexHtml(counts) {
    const indexPath = path.join(__dirname, 'index.html');
    let htmlContent = fs.readFileSync(indexPath, 'utf-8');
    
    // Mappa tra site_ e le descrizioni delle card per identificazione univoca
    const siteToDescription = {
        'site_1': 'Friggitrici ad aria, robot da cucina, macchine per caffè',
        'site_2': 'Luci smart, termostati intelligenti, telecamere di sicurezza',
        'site_3': 'Tutto l\'occorrente per un allenamento professionale',
        'site_4': 'Crea il tuo angolo verde anche in città',
        'site_5': 'Configura il tuo workspace per la massima efficienza',
        'site_6': 'Scatta foto professionali con il tuo smartphone',
        'site_7': 'I migliori accessori per il benessere dei tuoi amici a quattro zampe',
        'site_8': 'Le migliori macchine per caffè espresso',
        'site_9': 'Porta la tua esperienza di gioco al livello successivo',
        'site_10': 'Viaggi organizzati e pacchetti vacanza per destinazioni esclusive',
        'site_11': 'I migliori Kindle, audiolibri e accessori',
        'site_12': 'I migliori prodotti skincare, makeup e accessori',
        'site_13': 'Equipaggiamento per le tue avventure nella natura',
        'site_14': 'Oggetti per Casa & Decorazione - Quadri, Stampe',
        'site_15': 'I migliori zaini e bagagli per viaggi economici',
        'site_16': 'I migliori smartphone e accessori tech',
        'site_17': 'Magliette e accessori ispirati alle serie TV più amate',
        'site_18': 'I migliori capi di moda femminile lussuosa',
        'site_19': 'I migliori capi di moda maschile trendy',
        'site_20': 'I migliori accessori moda uomo e donna',
        'site_21': 'I migliori accessori moda uomo e donna a prezzi accessibili'
    };
    
    // Aggiorna ogni card con il conteggio corretto
    for (const [site, count] of Object.entries(counts)) {
        const description = siteToDescription[site];
        if (description) {
            // Cerca il pattern: <div class="stat-number">X</div> dopo la descrizione
            const pattern = new RegExp(
                `(${description.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?<div class="stat-number">)(\\d+)(</div>)`,
                'g'
            );
            
            htmlContent = htmlContent.replace(pattern, `$1${count}$3`);
            console.log(`✅ Aggiornato ${site}: ${count} prodotti`);
        }
    }
    
    fs.writeFileSync(indexPath, htmlContent);
    console.log('✅ File index.html aggiornato');
}

// Funzione principale
function main() {
    console.log('🔍 Inizio conteggio prodotti...\n');
    
    const counts = {};
    
    // Conta prodotti per ogni site_
    for (let i = 1; i <= 21; i++) {
        const siteName = `site_${i}`;
        const filePath = path.join(__dirname, siteName, 'index.html');
        
        if (fs.existsSync(filePath)) {
            const count = countProductsInFile(filePath);
            counts[siteName] = count;
            console.log(`📦 ${siteName}: ${count} prodotti`);
        }
    }
    
    console.log('\n📊 Totale prodotti:', Object.values(counts).reduce((a, b) => a + b, 0));
    
    // Aggiorna i file
    console.log('\n💾 Aggiornamento file...');
    updateJsonFile(counts);
    updateIndexHtml(counts);
    
    console.log('\n✨ Completato!');
}

// Esegui lo script
main();
