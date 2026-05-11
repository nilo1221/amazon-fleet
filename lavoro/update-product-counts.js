// Script per aggiornare automaticamente i numeri dei prodotti nelle card
async function updateProductCounts() {
    try {
        // Carica il file JSON con i conteggi
        const response = await fetch('product-counts.json');
        const counts = await response.json();
        
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
            'site_11': 'card-12', // card 11 è site_17
            'site_12': 'card-13',
            'site_13': 'card-14',
            'site_14': 'card-19',
            'site_15': 'card-20',
            'site_16': 'card-21',
            'site_17': 'card-11',
            'site_18': 'card-15',
            'site_19': 'card-16',
            'site_20': 'card-17',
            'site_21': 'card-18'
        };
        
        // Aggiorna ogni card con il conteggio corretto
        for (const [site, count] of Object.entries(counts)) {
            const cardId = siteToCard[site];
            if (cardId) {
                const card = document.getElementById(cardId);
                if (card) {
                    const statNumber = card.closest('.site-card').querySelector('.stat-number');
                    if (statNumber) {
                        statNumber.textContent = count;
                    }
                }
            }
        }
        
        console.log('Numeri prodotti aggiornati con successo!');
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dei numeri prodotti:', error);
    }
}

// Esegui quando il DOM è caricato
document.addEventListener('DOMContentLoaded', updateProductCounts);
