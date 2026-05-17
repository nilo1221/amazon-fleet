const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Icon mapping per categorie
const iconMapping = {
    'Cucina': 'fa-cookie',
    'Smart Home': 'fa-plug',
    'Fitness': 'fa-dumbbell',
    'Giardinaggio': 'fa-tree',
    'Ufficio': 'fa-plug',
    'Fotografia': 'fa-camera',
    'Pet Care': 'fa-paw',
    'Caffè': 'fa-coffee',
    'Gaming': 'fa-gamepad',
    'Tech': 'fa-suitcase',
    'Libri': 'fa-book',
    'Benessere': 'fa-spa',
    'Outdoor': 'fa-mountain',
    'Casa': 'fa-tv',
    'Viaggi': 'fa-hiking',
    'Smartphone': 'fa-mobile-alt',
    'Cinema': 'fa-film',
    'Moda': 'fa-female',
    'DVD': 'fa-film',
    'Mare': 'fa-water',
    'Profumi': 'fa-spray-can'
};

// Categorie per site
const siteCategories = {
    'site_1': 'Cucina',
    'site_2': 'Smart Home',
    'site_3': 'Fitness',
    'site_4': 'Giardinaggio',
    'site_5': 'Ufficio',
    'site_6': 'Fotografia',
    'site_7': 'Pet Care',
    'site_8': 'Caffè',
    'site_9': 'Gaming',
    'site_10': 'Tech',
    'site_11': 'Libri',
    'site_12': 'Benessere',
    'site_13': 'Outdoor',
    'site_14': 'Casa',
    'site_15': 'Viaggi',
    'site_16': 'Smartphone',
    'site_17': 'Cinema',
    'site_18': 'Moda Donna',
    'site_19': 'Benessere',
    'site_20': 'Moda Uomo',
    'site_21': 'Accessori',
    'site_22': 'Tech',
    'site_23': 'Altro',
    'site_24': 'Altro'
};

// Funzione per estrarre prodotti da un file HTML usando cheerio
function extractProductsFromHTML(html, siteNum) {
    const products = [];
    const $ = cheerio.load(html);
    
    // Trova tutti i link Amazon con tag affiliate
    $('a[href*="tag=l0c39-21"]').each((i, element) => {
        const link = $(element).attr('href');
        
        // Cerca il nome prodotto cercando nell'elemento parent
        let name = '';
        const parent = $(element).closest('.card, .product-card, .col-md-4, .col-md-6');
        
        if (parent.length > 0) {
            // Cerca h3, h4, h5, h6 nel parent
            const heading = parent.find('h3, h4, h5, h6').first();
            if (heading.length > 0) {
                name = heading.text().trim();
            }
        }
        
        // Se non trova nel parent, cerca nel fratello precedente
        if (!name) {
            const prevSibling = $(element).parent().prev().find('h3, h4, h5, h6').first();
            if (prevSibling.length > 0) {
                name = prevSibling.text().trim();
            }
        }
        
        // Se ancora non trova, cerca in tutta la struttura
        if (!name) {
            const allHeadings = $(element).parentsUntil('body').find('h3, h4, h5, h6');
            if (allHeadings.length > 0) {
                name = allHeadings.first().text().trim();
            }
        }
        
        if (name && link) {
            const category = siteCategories[siteNum] || 'Altro';
            
            // Determina l'icona basata sulla categoria
            let icon = 'fa-box';
            for (const [key, value] of Object.entries(iconMapping)) {
                if (category.includes(key)) {
                    icon = value;
                    break;
                }
            }
            
            // Verifica che il prodotto non sia duplicato
            const isDuplicate = products.some(p => 
                p.name === name || p.link === link
            );
            
            if (!isDuplicate) {
                products.push({
                    name: name,
                    category: category,
                    link: link,
                    icon: icon
                });
            }
        }
    });
    
    return products;
}

// Funzione principale
function updateProductsJSON() {
    const lavoroDir = __dirname;
    const allProducts = [];
    
    // Trova tutte le directory site_XX
    const siteDirs = fs.readdirSync(lavoroDir)
        .filter(dir => dir.startsWith('site_') && fs.statSync(path.join(lavoroDir, dir)).isDirectory())
        .sort((a, b) => parseInt(a.replace('site_', '')) - parseInt(b.replace('site_', '')));
    
    console.log(`Trovate ${siteDirs.length} directory site_XX`);
    
    // Estrai prodotti da ogni site
    for (const siteDir of siteDirs) {
        const indexPath = path.join(lavoroDir, siteDir, 'index.html');
        
        if (fs.existsSync(indexPath)) {
            const html = fs.readFileSync(indexPath, 'utf-8');
            const products = extractProductsFromHTML(html, siteDir);
            
            console.log(`${siteDir}: ${products.length} prodotti trovati`);
            allProducts.push(...products);
        }
    }
    
    // Rimuovi duplicati
    const uniqueProducts = [];
    const seenLinks = new Set();
    
    for (const product of allProducts) {
        if (!seenLinks.has(product.link)) {
            seenLinks.add(product.link);
            uniqueProducts.push(product);
        }
    }
    
    console.log(`\nTotale prodotti unici: ${uniqueProducts.length}`);
    
    // Scrivi il file products.json
    const outputPath = path.join(lavoroDir, 'products.json');
    fs.writeFileSync(outputPath, JSON.stringify(uniqueProducts, null, 4), 'utf-8');
    
    console.log(`✅ File products.json aggiornato con ${uniqueProducts.length} prodotti`);
    console.log(`📁 Percorso: ${outputPath}`);
}

// Esegui
updateProductsJSON();
