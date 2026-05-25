const fs = require('fs');
const path = require('path');

// Lista delle nicchie da scansionare
const niches = [
    'cucina-elettrodomestici',
    'smart-home-domotica',
    'fitness-casa',
    'giardinaggio-urbano',
    'ufficio-produttivo',
    'fotografia-mobile',
    'pet-care-intelligente',
    'cura-macchina-caffe',
    'elite-gaming-gear',
    'tech',
    'libri-ereader',
    'bellezza-skincare',
    'outdoor-camping',
    'arredamento-casa',
    'viaggi-vacanze',
    'smartphone-tech',
    'merchandise-serie-tv',
    'moda-donna',
    'benessere-personale',
    'moda-uomo',
    'accessori-moda',
    'neonati-bambini'
];

// Mappa delle icone per categoria
const categoryIcons = {
    'Cucina': 'fa-cookie',
    'Benessere Personale': 'fa-cut',
    'Benessere': 'fa-spa',
    'Fitness': 'fa-dumbbell',
    'Tech': 'fa-microchip',
    'Gaming': 'fa-gamepad',
    'Pet Care': 'fa-paw',
    'Smart Home': 'fa-home',
    'Fotografia': 'fa-camera',
    'Ufficio': 'fa-briefcase',
    'Giardinaggio': 'fa-leaf',
    'Caffè': 'fa-mug-hot',
    'Libri': 'fa-book',
    'Outdoor': 'fa-mountain',
    'Casa': 'fa-couch',
    'Viaggi': 'fa-plane',
    'Smartphone': 'fa-mobile-alt',
    'Cinema': 'fa-film',
    'Moda Donna': 'fa-female',
    'Moda Uomo': 'fa-male',
    'Accessori': 'fa-glasses',
    'Neonati': 'fa-baby'
};

// Funzione per estrarre prodotti da un file HTML
function extractProductsFromHtml(html, categoryName) {
    const products = [];
    
    // Pattern per trovare i prodotti nelle card
    const productPattern = /<h3[^>]*class="[^"]*card-title[^"]*"[^>]*>(.*?)<\/h3>/gs;
    const linkPattern = /<a[^>]*href="(https:\/\/www\.amazon\.it\/[^"]*tag=l0c39-21[^"]*)"[^>]*>/gs;
    
    const titles = [...html.matchAll(productPattern)];
    const links = [...html.matchAll(linkPattern)];
    
    // Combina titoli e link
    for (let i = 0; i < titles.length && i < links.length; i++) {
        const title = titles[i][1].replace(/<[^>]*>/g, '').trim();
        const link = links[i][1];
        
        if (title && link) {
            products.push({
                name: title,
                category: categoryName,
                link: link,
                icon: categoryIcons[categoryName] || 'fa-box'
            });
        }
    }
    
    return products;
}

// Funzione per caricare products.json esistente
function loadExistingProducts() {
    const productsPath = path.join(__dirname, 'products.json');
    if (fs.existsSync(productsPath)) {
        const content = fs.readFileSync(productsPath, 'utf-8');
        return JSON.parse(content);
    }
    return [];
}

// Funzione per salvare products.json
function saveProducts(products) {
    const productsPath = path.join(__dirname, 'products.json');
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    console.log('✅ products.json aggiornato con', products.length, 'prodotti');
}

// Funzione principale
function main() {
    console.log('🔍 Inizio scansione nicchie...\n');
    
    const existingProducts = loadExistingProducts();
    const existingLinks = new Set(existingProducts.map(p => p.link));
    const newProducts = [];
    
    niches.forEach(niche => {
        const nichePath = path.join(__dirname, niche, 'index.html');
        
        if (fs.existsSync(nichePath)) {
            const html = fs.readFileSync(nichePath, 'utf-8');
            
            // Determina il nome della categoria
            const categoryName = niche.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            
            const products = extractProductsFromHtml(html, categoryName);
            
            products.forEach(product => {
                if (!existingLinks.has(product.link)) {
                    newProducts.push(product);
                    console.log(`➕ Nuovo prodotto: ${product.name} (${categoryName})`);
                }
            });
        }
    });
    
    if (newProducts.length > 0) {
        console.log(`\n📦 Trovati ${newProducts.length} nuovi prodotti`);
        const updatedProducts = [...existingProducts, ...newProducts];
        saveProducts(updatedProducts);
    } else {
        console.log('✨ Nessun nuovo prodotto trovato');
    }
}

// Esegui lo script
main();
