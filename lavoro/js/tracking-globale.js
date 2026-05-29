// Tracking Globale GA4 per Amazon Affiliate Links
// Questo script aggiunge automaticamente tracking GA4 a tutti i link Amazon con tag affiliate

(function() {
    // Verifica che gtag sia disponibile
    if (typeof gtag === 'undefined') {
        console.warn('GA4 gtag non disponibile');
        return;
    }

    // Trova tutti i link Amazon con tag affiliate
    const amazonLinks = document.querySelectorAll('a[href*="amazon.it"][href*="tag=l0c39-21"]');
    
    // Ottieni la pagina corrente per il contesto
    const currentPath = window.location.pathname;
    const currentUrl = window.location.href;
    
    // Determina la nicchia dall'URL
    let niche = 'generale';
    if (currentPath.includes('/veicoli/')) niche = 'veicoli';
    else if (currentPath.includes('/manga-anime/')) niche = 'manga-anime';
    else if (currentPath.includes('/parrucchiere-barbiere/')) niche = 'parrucchiere-barbiere';
    else if (currentPath.includes('/benessere-cura-personale/')) niche = 'benessere-cura-personale';
    else if (currentPath.includes('/cucina-elettrodomestici/')) niche = 'cucina-elettrodomestici';
    else if (currentPath.includes('/tech/')) niche = 'tech';
    else if (currentPath.includes('/mare-spiaggia/')) niche = 'mare-spiaggia';
    else if (currentPath.includes('/fitness-casa/')) niche = 'fitness-casa';
    else if (currentPath.includes('/moda-donna/')) niche = 'moda-donna';
    else if (currentPath.includes('/moda-uomo/')) niche = 'moda-uomo';
    else if (currentPath.includes('/profumi-bellezza/')) niche = 'profumi-bellezza';
    else if (currentPath.includes('/smart-home-domotica/')) niche = 'smart-home-domotica';
    else if (currentPath.includes('/snack-bevande/')) niche = 'snack-bevande';
    else if (currentPath.includes('/arredamento-casa/')) niche = 'arredamento-casa';
    else if (currentPath.includes('/accessori-moda/')) niche = 'accessori-moda';
    else if (currentPath.includes('/smartphone-tech/')) niche = 'smartphone-tech';
    else if (currentPath.includes('/viaggi-vacanze/')) niche = 'viaggi-vacanze';
    else if (currentPath.includes('/musica-vinili/')) niche = 'musica-vinili';
    else if (currentPath.includes('/abbigliamento-serie-tv-film/')) niche = 'abbigliamento-serie-tv-film';
    else if (currentPath.includes('/gaming/')) niche = 'gaming';
    else if (currentPath.includes('/baby/')) niche = 'baby';
    else if (currentPath.includes('/outdoor/')) niche = 'outdoor';
    else if (currentPath.includes('/ufficio-scuola/')) niche = 'ufficio-scuola';
    else if (currentPath === '/index.html' || currentPath === '/') niche = 'homepage';

    // Aggiunge tracking a ogni link Amazon
    amazonLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        
        // Estrai il nome del prodotto dal testo del link o dall'elemento parent
        let productName = 'Prodotto Amazon';
        const cardBody = link.closest('.card-body');
        if (cardBody) {
            const titleElement = cardBody.querySelector('.card-title, h3');
            if (titleElement) {
                productName = titleElement.textContent.trim();
            }
        }
        
        // Estrai l'ASIN dall'URL (per identificazione univoca)
        const asinMatch = href.match(/\/dp\/([A-Z0-9]{10})/);
        const productId = asinMatch ? asinMatch[1] : `product_${index}`;

        // Event: view_item (quando il prodotto viene visualizzato)
        gtag('event', 'view_item', {
            item_id: productId,
            item_name: productName,
            category: niche,
            page_location: currentUrl
        });

        // Event: select_item (quando l'utente clicca sul prodotto)
        link.addEventListener('click', function(e) {
            gtag('event', 'select_item', {
                item_id: productId,
                item_name: productName,
                category: niche,
                page_location: currentUrl
            });
        });

        // Event: affiliate_click (quando clicca sul link Amazon)
        link.addEventListener('click', function(e) {
            gtag('event', 'affiliate_click', {
                item_id: productId,
                item_name: productName,
                category: niche,
                affiliate_tag: 'l0c39-21',
                destination_url: href,
                page_location: currentUrl
            });
        });
    });

    console.log(`Tracking GA4 attivato per ${amazonLinks.length} link Amazon nella nicchia: ${niche}`);
})();
