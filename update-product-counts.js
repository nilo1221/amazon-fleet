// Script per aggiornare automaticamente i numeri dei prodotti nelle card
async function updateProductCounts() {
    try {
        // Pulisci cache forzatamente per assicurare dati aggiornati
        localStorage.removeItem('productCountsCache');
        
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
            'cucina-elettrodomestici': 'card-1',
            'smart-home-domotica': 'card-2',
            'fitness-casa': 'card-3',
            'giardinaggio-urbano': 'card-4',
            'ufficio-produttivo': 'card-5',
            'fotografia-mobile': 'card-6',
            'pet-care-intelligente': 'card-7',
            'cura-macchina-caffe': 'card-8',
            'elite-gaming-gear': 'card-9',
            'tech': 'card-10',
            'libri-ereader': 'card-11',
            'bellezza-skincare': 'card-12',
            'outdoor-camping': 'card-13',
            'arredamento-casa': 'card-14',
            'viaggi-vacanze': 'card-15',
            'smartphone-tech': 'card-16',
            'cinema-tv': 'card-17',
            'moda-donna': 'card-18',
            'benessere-personale': 'card-19',
            'moda-uomo': 'card-20',
            'accessori-moda': 'card-21',
            'dvd-bluray': 'card-22',
            'mare-spiaggia': 'card-23',
            'profumi-bellezza': 'card-24',
            'sostenibilita-eco-friendly': 'card-25'
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
