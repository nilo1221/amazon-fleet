// Script per aggiornare automaticamente i numeri dei prodotti nelle card
async function updateProductCounts() {
    try {
        // Cache dei conteggi (salva in localStorage)
        const cacheKey = 'productCountsCache';
        const cacheTime = 5 * 60 * 1000; // 5 minuti
        const cachedData = localStorage.getItem(cacheKey);
        
        if (cachedData) {
            const { timestamp, counts } = JSON.parse(cachedData);
            if (Date.now() - timestamp < cacheTime) {
                // Usa cache se ancora valida
                updateCards(counts);
                console.log('Numeri prodotti caricati dalla cache');
                return;
            }
        }
        
        // Mappa tra site_ e l'ID della card corrispondente
        const siteToCard = {
            'site_1': 'card-1',
            'site_2': 'card-2',
            'site_3': 'card-3',
            'site_4': 'card-4',
            'site_5': 'card-5',
            'site_6': 'card-6',
            'site_7': 'card-7',
            'site_8': 'card-8',
            'site_9': 'card-9',
            'site_10': 'card-10',
            'site_11': 'card-11',
            'site_12': 'card-12',
            'site_13': 'card-13',
            'site_14': 'card-14',
            'site_15': 'card-15',
            'site_16': 'card-16',
            'site_17': 'card-17',
            'site_18': 'card-18',
            'site_19': 'card-19',
            'site_20': 'card-20',
            'site_21': 'card-21',
            'site_22': 'card-22',
            'site_23': 'card-23',
            'site_24': 'card-24'
        };
        
        // Mostra loading visivo
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(el => el.textContent = '...');
        
        // Carica tutti i siti in parallelo
        const promises = Object.entries(siteToCard).map(async ([site, cardId]) => {
            try {
                const response = await fetch(`${site}/index.html`);
                const html = await response.text();
                
                // Conta i prodotti con link Amazon nel HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const amazonLinks = doc.querySelectorAll('a[href*="amazon.it"]');
                const count = amazonLinks.length;
                
                return { cardId, count };
            } catch (error) {
                console.error(`Errore durante il caricamento di ${site}:`, error);
                return { cardId, count: 0 };
            }
        });
        
        // Attendi tutti i caricamenti in parallelo
        const results = await Promise.all(promises);
        
        // Converti risultati in oggetto
        const counts = {};
        results.forEach(({ cardId, count }) => {
            counts[cardId] = count;
        });
        
        // Aggiorna le card
        updateCards(counts);
        
        // Salva in cache
        localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            counts
        }));
        
        console.log('Numeri prodotti aggiornati con successo!');
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dei numeri prodotti:', error);
    }
}

// Funzione per aggiornare le card con i conteggi
function updateCards(counts) {
    for (const [cardId, count] of Object.entries(counts)) {
        const card = document.getElementById(cardId);
        if (card) {
            const statNumber = card.closest('.site-card').querySelector('.stat-number');
            if (statNumber) {
                statNumber.textContent = count;
            }
        }
    }
}

// Esegui quando il DOM è caricato
document.addEventListener('DOMContentLoaded', updateProductCounts);
