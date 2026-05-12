// Indice centralizzato dei prodotti per la ricerca
const productsIndex = [
    // Cucina (site_1)
    { title: "Amazon Basics 14-Piece Knife Block Set", category: "Cucina", site: "site_1", keywords: "coltelli coltello cucina taglio" },
    { title: "MITSUMOTO SAKARI Affilacoltelli Professionale", category: "Cucina", site: "site_1", keywords: "affilacoltelli affila coltelli cucina" },
    { title: "Hecef Coltelli da Cucina Professionali 5 Pezzi", category: "Cucina", site: "site_1", keywords: "coltelli cucina professionale" },
    { title: "Frullatore Immersione Multifunzione", category: "Cucina", site: "site_1", keywords: "frullatore immersione mixer cucina" },
    { title: "Bosch Frullatore Immersione MSM24100", category: "Cucina", site: "site_1", keywords: "frullatore immersione bosch mixer" },
    { title: "Moulinex DD4521 Frullatore Immersione", category: "Cucina", site: "site_1", keywords: "frullatore immersione moulinex mixer" },
    { title: "DUNSOO Portaspezie Frigorifero", category: "Cucina", site: "site_1", keywords: "spezie frigorifero organizzazione cucina" },
    { title: "Inkbird Bluetooth Termometro Temperatura", category: "Cucina", site: "site_1", keywords: "termometro bluetooth temperatura cottura" },
    { title: "COSORI Turbo Tower Pro Smart Friggitrice ad Aria", category: "Cucina", site: "site_1", keywords: "friggitrice aria cosori fritture" },
    { title: "COSORI Turbo Blaze Friggitrice ad Aria 6L", category: "Cucina", site: "site_1", keywords: "friggitrice aria cosori" },
    { title: "Ninja Foodi Dual Zone AF300EU", category: "Cucina", site: "site_1", keywords: "friggitrice aria ninja foodi" },
    { title: "Mova FD10 Pro 6L", category: "Cucina", site: "site_1", keywords: "friggitrice aria mova" },
    { title: "Moulinex Easy Fry Precision 4.2L", category: "Cucina", site: "site_1", keywords: "friggitrice aria moulinex" },
    { title: "Bosch MultiTalent 8 Robot Multifunzione", category: "Cucina", site: "site_1", keywords: "robot cucina bosch multifunzione" },
    { title: "DeLonghi Magnifica S Macchina per il Caffè", category: "Cucina", site: "site_1", keywords: "caffè macchina delonghi espresso" },
    
    // Smart Home (site_2)
    { title: "Philips Hue", category: "Smart Home", site: "site_2", keywords: "luci smart illuminazione philips hue" },
    { title: "TP-Link Smart Bulb", category: "Smart Home", site: "site_2", keywords: "luci smart tp-link illuminazione" },
    { title: "Ring Video Doorbell", category: "Smart Home", site: "site_2", keywords: "campanello ring video sicurezza" },
    { title: "Termostato Intelligente", category: "Smart Home", site: "site_2", keywords: "termostato smart temperatura casa" },
    
    // Fitness Casa (site_3)
    { title: "Tapis Roulant", category: "Fitness", site: "site_3", keywords: "tapis roulant corsa cardio" },
    { title: "Bicicletta Ellittica", category: "Fitness", site: "site_3", keywords: "ellittica bicicletta fitness" },
    { title: "Manubri Pesi", category: "Fitness", site: "site_3", keywords: "manubri pesi palestra" },
    
    // Fotografia Mobile (site_6)
    { title: "RISEOFLE Treppiede Smartphone con Telecomando", category: "Fotografia", site: "site_6", keywords: "treppiede smartphone telecomando foto video" },
    { title: "Treppiede Smartphone Cavalletto con Telecomando", category: "Fotografia", site: "site_6", keywords: "treppiede cavalletto smartphone" },
    { title: "Lamicall Treppiede Smartphone Flessibile con Telecomando", category: "Fotografia", site: "site_6", keywords: "treppiede flessibile smartphone" },
    { title: "AURIVEE Montatura Posteriore Smartphone con Luminosità Regolabile", category: "Fotografia", site: "site_6", keywords: "montatura smartphone luce video" },
    { title: "Teleprompter con Treppiede e Telecomando per Smartphone", category: "Fotografia", site: "site_6", keywords: "teleprompter smartphone video" },
    { title: "Insta360 Snap Schermo Selfie con Luce Integrata", category: "Fotografia", site: "site_6", keywords: "selfie luce smartphone schermo" },
    { title: "Barra LED Ring Light", category: "Fotografia", site: "site_6", keywords: "ring light led illuminazione foto video" },
    { title: "Luce Magnetica per Fotocamera", category: "Fotografia", site: "site_6", keywords: "luce magnetica fotocamera illuminazione" },
    
    // Pet Care (site_7)
    { title: "PETKIT Pura Max 2 Lettiera Gatto Autopulente", category: "Pet Care", site: "site_7", keywords: "lettiera gatto autopulente automatica" },
    { title: "Fockety Mangiatoia Automatica per Gatti", category: "Pet Care", site: "site_7", keywords: "mangiatoia automatica gatto cibo" },
    { title: "PORTENTUM Spazzola Togli Peli", category: "Pet Care", site: "site_7", keywords: "spazzola peli gatto cane" },
    { title: "maxxipaws maxxiflex+ Integratore", category: "Pet Care", site: "site_7", keywords: "integratore articolazioni cane gatto" },
    { title: "IREDOON Tagliaunghie Elettrico", category: "Pet Care", site: "site_7", keywords: "tagliaunghie elettrico cane gatto" },
    { title: "ACE2ACE Spazzola Togli Peli", category: "Pet Care", site: "site_7", keywords: "spazzola peli cane gatto" },
    
    // Gaming (site_9)
    { title: "ASUS ROG Gaming Laptop", category: "Gaming", site: "site_9", keywords: "laptop gaming asus rog pc" },
    { title: "NVIDIA GeForce RTX 4090", category: "Gaming", site: "site_9", keywords: "scheda video nvidia rtx gaming" },
    { title: "Logitech G Pro Wireless Mouse", category: "Gaming", site: "site_9", keywords: "mouse gaming logitech wireless" },
    
    // Cinema & TV (site_17)
    { title: "The Last of Us Firefly T-Shirt", category: "Moda", site: "site_17", keywords: "t-shirt last of us serie tv" },
    { title: "Squid Game Logo Maglietta", category: "Moda", site: "site_17", keywords: "maglietta squid game serie tv" },
    { title: "Squid Game Player 456 T-Shirt", category: "Moda", site: "site_17", keywords: "t-shirt squid game serie tv" },
    { title: "The Witcher Silhouette T-Shirt", category: "Moda", site: "site_17", keywords: "t-shirt witcher serie tv" },
    { title: "Wednesday Nevermore Academy Maglietta", category: "Moda", site: "site_17", keywords: "maglietta wednesday serie tv" },
    { title: "Wednesday Addams Merchandise Maglietta", category: "Moda", site: "site_17", keywords: "maglietta wednesday addams" },
    { title: "The Boys T-Shirt Uomo", category: "Moda", site: "site_17", keywords: "t-shirt the boys serie tv" },
    { title: "The Boys Sette Fumetti Maglietta", category: "Moda", site: "site_17", keywords: "maglietta the boys fumetti" },
    { title: "The Boys Show Logo Maglietta", category: "Moda", site: "site_17", keywords: "maglietta the boys logo" }
];

// Funzione per cercare prodotti
function searchProducts(query) {
    const lowerQuery = query.toLowerCase().trim();
    if (lowerQuery === '') return [];
    
    return productsIndex.filter(product => {
        const titleMatch = product.title.toLowerCase().includes(lowerQuery);
        const keywordsMatch = product.keywords.toLowerCase().includes(lowerQuery);
        const categoryMatch = product.category.toLowerCase().includes(lowerQuery);
        
        return titleMatch || keywordsMatch || categoryMatch;
    });
}
