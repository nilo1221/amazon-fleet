// GA4 Product Tracking Script
// Questo script gestisce il tracking degli eventi GA4 per i prodotti

(function() {
    // Verifica che gtag sia disponibile
    if (typeof gtag === 'undefined') {
        console.warn('GA4 gtag non disponibile');
        return;
    }

    // Funzione per estrarre il nome del prodotto dal DOM
    function getProductName(element) {
        // Cerca il nome del prodotto nel card parent
        const card = element.closest('.product-card');
        if (card) {
            const titleElement = card.querySelector('.card-title, h3, h4');
            if (titleElement) {
                return titleElement.textContent.trim();
            }
        }
        return 'Prodotto Sconosciuto';
    }

    // Funzione per estrarre la categoria dalla pagina
    function getCategory() {
        // Cerca la categoria dal title della pagina
        const title = document.title;
        if (title.includes('-')) {
            return title.split('-')[0].trim();
        }
        return 'Sconosciuta';
    }

    // Funzione per estrarre il prezzo (se disponibile)
    function getPrice(element) {
        const card = element.closest('.product-card');
        if (card) {
            const priceElement = card.querySelector('[class*="price"], .price, .prezzo');
            if (priceElement) {
                const priceText = priceElement.textContent.replace(/[€£$]/g, '').trim();
                const price = parseFloat(priceText.replace(',', '.'));
                return isNaN(price) ? null : price;
            }
        }
        return null;
    }

    // Tracking click su link Amazon (affiliate_click)
    function trackAffiliateClick(event) {
        const link = event.currentTarget;
        const productName = getProductName(link);
        const category = getCategory();
        const price = getPrice(link);

        gtag('event', 'affiliate_click', {
            item_name: productName,
            item_category: category,
            price: price,
            link_url: link.href
        });

        gtag('event', 'select_item', {
            item_list_name: category,
            items: [{
                item_name: productName,
                item_category: category,
                price: price
            }]
        });
    }

    // Tracking view_item quando i prodotti sono visibili (Intersection Observer)
    function trackProductImpressions() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const titleElement = card.querySelector('.card-title, h3, h4');
                    if (titleElement && !card.dataset.tracked) {
                        const productName = titleElement.textContent.trim();
                        const category = getCategory();
                        const price = getPrice(card);

                        gtag('event', 'view_item', {
                            item_name: productName,
                            item_category: category,
                            price: price
                        });

                        // Marca come tracciato per evitare duplicati
                        card.dataset.tracked = 'true';
                    }
                }
            });
        }, {
            threshold: 0.5 // Il prodotto deve essere visibile almeno al 50%
        });

        // Osserva tutte le card prodotto
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => observer.observe(card));
    }

    // Inizializza il tracking quando il DOM è caricato
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Aggiunge listener ai link Amazon
            const amazonLinks = document.querySelectorAll('a.btn-amazon, a[href*="amazon.it"]');
            amazonLinks.forEach(link => {
                link.addEventListener('click', trackAffiliateClick);
            });

            // Inizia il tracking delle impressioni
            trackProductImpressions();
        });
    } else {
        // DOM già caricato
        const amazonLinks = document.querySelectorAll('a.btn-amazon, a[href*="amazon.it"]');
        amazonLinks.forEach(link => {
            link.addEventListener('click', trackAffiliateClick);
        });

        trackProductImpressions();
    }
})();
