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

    // Tracking scroll depth
    function trackScrollDepth() {
        let maxScroll = 0;
        const scrollThresholds = [25, 50, 75, 90];
        const trackedThresholds = new Set();

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
            }

            scrollThresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
                    trackedThresholds.add(threshold);
                    gtag('event', 'scroll', {
                        percent_scrolled: threshold,
                        page_title: document.title,
                        page_location: window.location.href
                    });
                }
            });
        });
    }

    // Tracking tempo sulla pagina (engagement)
    function trackEngagementTime() {
        const timeThresholds = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
        const trackedTimes = new Set();
        let timeOnPage = 0;

        setInterval(() => {
            timeOnPage += 10; // Aggiorna ogni 10 secondi

            timeThresholds.forEach(threshold => {
                if (timeOnPage >= threshold && !trackedTimes.has(threshold)) {
                    trackedTimes.add(threshold);
                    gtag('event', 'engagement', {
                        time_on_page: threshold,
                        page_title: document.title,
                        page_location: window.location.href
                    });
                }
            });
        }, 10000);
    }

    // Tracking click su nicchie/categorie
    function trackNicheClick(event) {
        const link = event.currentTarget;
        const nicheName = link.textContent.trim() || link.getAttribute('data-niche') || 'Sconosciuta';
        
        gtag('event', 'niche_click', {
            niche_name: nicheName,
            page_title: document.title,
            page_location: window.location.href
        });
    }

    // Tracking click su menu di navigazione
    function trackNavClick(event) {
        const link = event.currentTarget;
        const navItem = link.textContent.trim() || link.getAttribute('aria-label') || 'Sconosciuto';
        
        gtag('event', 'navigation_click', {
            nav_item: navItem,
            page_title: document.title,
            page_location: window.location.href
        });
    }

    // Inizializza il tracking quando il DOM è caricato
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Aggiunge listener ai link Amazon
            const amazonLinks = document.querySelectorAll('a.btn-amazon, a[href*="amazon.it"]');
            amazonLinks.forEach(link => {
                link.addEventListener('click', trackAffiliateClick);
            });

            // Aggiunge listener ai link delle nicchie
            const nicheLinks = document.querySelectorAll('a[href*="niches"], a[href*="categorie"]');
            nicheLinks.forEach(link => {
                link.addEventListener('click', trackNicheClick);
            });

            // Aggiunge listener al menu di navigazione
            const navLinks = document.querySelectorAll('nav a, .navbar a, .nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', trackNavClick);
            });

            // Inizia il tracking delle impressioni
            trackProductImpressions();

            // Inizia il tracking dello scroll
            trackScrollDepth();

            // Inizia il tracking del tempo sulla pagina
            trackEngagementTime();
        });
    } else {
        // DOM già caricato
        const amazonLinks = document.querySelectorAll('a.btn-amazon, a[href*="amazon.it"]');
        amazonLinks.forEach(link => {
            link.addEventListener('click', trackAffiliateClick);
        });

        const nicheLinks = document.querySelectorAll('a[href*="niches"], a[href*="categorie"]');
        nicheLinks.forEach(link => {
            link.addEventListener('click', trackNicheClick);
        });

        const navLinks = document.querySelectorAll('nav a, .navbar a, .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', trackNavClick);
        });

        trackProductImpressions();
        trackScrollDepth();
        trackEngagementTime();
    }
})();
