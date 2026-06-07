/* ========== SMART CHOICES AI ASSISTANT - JS ISOLATO ========== */
/* Namespace: SmartChoicesAI */
/* Version: 2.0.0 - Bottone Flottante */
/* Last Updated: 2024-06-07 */

// ========== NAMESPACE ISOLATO ==========
(function() {
    'use strict';
    
    // Verifica che il namespace non esista già
    if (window.SmartChoicesAI) {
        console.warn('SmartChoicesAI già caricato - versione:', window.SmartChoicesAI.version);
        return;
    }
    
    // Creazione namespace isolato
    window.SmartChoicesAI = {
        version: '2.0.0',
        lastUpdated: '2024-06-07',
        isInitialized: false,
        
        // Configurazione
        config: {
            cssPrefix: 'sc-ai-',
            debugMode: false
        },
        
        // Stato interno
        state: {
            modalOpen: false,
            nichesData: null,
            combosData: null,
            pathDepth: 0,
            currentPageProducts: []
        },
        
        // ========== FUNZIONE DI INIZIALIZZAZIONE ==========
        init: function() {
            try {
                if (this.isInitialized) {
                    this.log('Già inizializzato');
                    return;
                }
                
                this.log('Inizializzazione SmartChoicesAI v' + this.version);
                
                // Calcola profondità directory corrente
                this.calculatePathDepth();
                
                // Inizializza tracking Analytics
                this.initAnalytics();
                
                // Carica prodotti dalla pagina corrente
                this.loadPageProducts();
                
                // Crea bottone flottante
                this.createFloatButton();
                
                // Crea modal
                this.createModal();
                
                // Crea toast
                this.createToast();
                
                // Mostra toast dopo 3 secondi
                setTimeout(() => {
                    this.showToast();
                }, 3000);
                
                // Carica dati
                this.loadNiches();
                this.loadCombos();
                
                // Inizializza event listeners
                this.initEventListeners();
                
                this.isInitialized = true;
                this.log('Inizializzazione completata');
                
            } catch (error) {
                this.error('Errore inizializzazione:', error);
                this.hideAllComponents();
            }
        },
        
        // ========== CALCOLA PROFONDITÀ PERCORSO ==========
        calculatePathDepth: function() {
            let path = window.location.pathname;
            
            // Rimuovi filename se presente (es. /lifestyle/viaggi-vacanze/index.html)
            if (path.includes('.html')) {
                path = path.substring(0, path.lastIndexOf('/'));
            }
            
            // Assicurati che il percorso finisca con /
            if (!path.endsWith('/')) {
                path += '/';
            }
            
            // Conta gli slash (es. /lifestyle/viaggi-vacanze/ = 3 slash → depth 2)
            const depth = (path.match(/\//g) || []).length - 1;
            this.state.pathDepth = depth;
            this.log('Percorso:', path, 'Profondità:', depth);
        },
        
        // ========== GET PERCORSO RELATIVO ALLA ROOT ==========
        getRootPath: function() {
            if (this.state.pathDepth === 0) {
                return ''; // Root
            } else if (this.state.pathDepth === 1) {
                return '../'; // 1 livello (es. tech/)
            } else if (this.state.pathDepth === 2) {
                return '../../'; // 2 livelli (es. benessere/fitness-casa/)
            } else {
                return Array(this.state.pathDepth).fill('../').join('');
            }
        },
        
        // ========== INIZIALIZZA ANALYTICS ==========
        initAnalytics: function() {
            // Verifica se gtag è disponibile (caricato dalle pagine)
            if (typeof gtag === 'function') {
                this.log('Google Analytics disponibile');
                this.state.analyticsEnabled = true;
                
                // Traccia inizializzazione bot
                this.trackEvent('bot_initialized', {
                    page: window.location.pathname,
                    version: this.version
                });
            } else {
                this.log('Google Analytics non disponibile');
                this.state.analyticsEnabled = false;
            }
        },
        
        // ========== TRACCIA EVENTO ANALYTICS ==========
        trackEvent: function(eventName, parameters) {
            if (this.state.analyticsEnabled && typeof gtag === 'function') {
                try {
                    gtag('event', eventName, parameters);
                    this.log('Analytics event:', eventName, parameters);
                } catch (error) {
                    this.error('Errore tracking evento:', error);
                }
            }
        },
        
        // ========== TRACCIA CLICK NICCHIA ==========
        trackNicheClick: function(nicheId, nicheName, nicheUrl) {
            // Traccia evento
            this.trackEvent('bot_niche_clicked', {
                niche_id: nicheId,
                niche_name: nicheName,
                page: window.location.pathname
            });
            
            // Naviga alla nicchia
            window.location.href = nicheUrl;
        },
        
        // ========== CREAZIONE BOTTONE FLOTTANTE ==========
        createFloatButton: function() {
            const button = document.createElement('button');
            button.className = this.config.cssPrefix + 'float-button';
            button.setAttribute('aria-label', 'Apri assistente IA');
            button.innerHTML = '<i class="fas fa-fire ' + this.config.cssPrefix + 'float-icon"></i>';
            document.body.appendChild(button);
            
            this.state.floatButton = button;
        },
        
        // ========== CREAZIONE MODAL ==========
        createModal: function() {
            const modal = document.createElement('div');
            modal.className = this.config.cssPrefix + 'modal-container';
            const rootPath = this.getRootPath();
            modal.innerHTML = `
                <div class="${this.config.cssPrefix}modal-content">
                    <div class="${this.config.cssPrefix}modal-header">
                        <span class="${this.config.cssPrefix}modal-title">
                            <div class="${this.config.cssPrefix}phoenix-logo">
                                <img src="${rootPath}images/logo.png" alt="Smart Choices Logo">
                            </div>
                            Smart Choices AI
                        </span>
                        <button class="${this.config.cssPrefix}close-button" aria-label="Chiudi">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="${this.config.cssPrefix}modal-body">
                        <div class="${this.config.cssPrefix}loading">
                            <div class="${this.config.cssPrefix}spinner"></div>
                            Caricamento...
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            this.state.modal = modal;
        },
        
        // ========== CREAZIONE TOAST ==========
        createToast: function() {
            const toast = document.createElement('div');
            toast.className = this.config.cssPrefix + 'toast';
            toast.innerHTML = `
                <i class="fas fa-fire ${this.config.cssPrefix}toast-icon"></i>
                <div class="${this.config.cssPrefix}toast-content">
                    <div class="${this.config.cssPrefix}toast-title">Ciao!</div>
                    <div class="${this.config.cssPrefix}toast-message">Ti posso aiutare?</div>
                </div>
                <button class="${this.config.cssPrefix}toast-close" aria-label="Chiudi">
                    <i class="fas fa-times"></i>
                </button>
            `;
            document.body.appendChild(toast);
            
            this.state.toast = toast;
        },
        
        // ========== CARICAMENTO DATI NICCHIE ==========
        loadNiches: function() {
            try {
                fetch('data/categories.json')
                    .then(response => response.json())
                    .then(data => {
                        this.state.nichesData = data.categories;
                        this.log('Nicchie caricate:', this.state.nichesData.length);
                    })
                    .catch(error => {
                        this.error('Errore caricamento nicchie:', error);
                        this.state.nichesData = this.getDefaultNiches();
                    });
            } catch (error) {
                this.error('Errore fetch nicchie:', error);
                this.state.nichesData = this.getDefaultNiches();
            }
        },
        
        // ========== CARICAMENTO DATI COMBO ==========
        loadCombos: function() {
            try {
                fetch('ai-assistant/product-combos.json')
                    .then(response => response.json())
                    .then(data => {
                        // Salva le combo dalla nuova struttura
                        this.state.combosData = data.combos || data;
                        this.log('Combo caricate:', Object.keys(this.state.combosData).length);
                        
                        // Log metadata se disponibili
                        if (data._metadata) {
                            this.log('Combo metadata:', data._metadata);
                        }
                    })
                    .catch(error => {
                        this.error('Errore caricamento combo:', error);
                        this.state.combosData = this.getDefaultCombos();
                    });
            } catch (error) {
                this.error('Errore fetch combo:', error);
                this.state.combosData = this.getDefaultCombos();
            }
        },
        
        // ========== CARICAMENTO PRODOTTI DALLA PAGINA ==========
        loadPageProducts: function() {
            try {
                // Cerca tutti i link Amazon nella pagina
                const amazonLinks = document.querySelectorAll('a[href*="amazon.it"]');
                const products = [];
                
                amazonLinks.forEach(link => {
                    const linkText = link.textContent.trim();
                    // Evita link vuoti o duplicati
                    if (linkText && linkText !== 'Vedi su Amazon' && linkText !== 'Acquista su Amazon') {
                        // Estrai il nome del prodotto dal testo vicino al link
                        const card = link.closest('.product-card, .guida-scelta-product');
                        if (card) {
                            const titleElement = card.querySelector('h3, h4, h5, .product-title, .guida-scelta-product-title');
                            if (titleElement) {
                                const productName = titleElement.textContent.trim();
                                const href = link.href;
                                
                                // Verifica che il link abbia il tag affiliate
                                if (href.includes('tag=l0c39-21')) {
                                    products.push({
                                        name: productName,
                                        link: href
                                    });
                                }
                            }
                        }
                    }
                });
                
                this.state.currentPageProducts = products;
                this.log('Prodotti caricati dalla pagina:', products.length);
                
            } catch (error) {
                this.error('Errore caricamento prodotti pagina:', error);
                this.state.currentPageProducts = [];
            }
        },
        
        // ========== EVENT LISTENERS ==========
        initEventListeners: function() {
            try {
                // Click bottone flottante
                this.state.floatButton.addEventListener('click', () => {
                    this.openModal();
                });
                
                // Click close button
                this.state.modal.querySelector('.' + this.config.cssPrefix + 'close-button').addEventListener('click', () => {
                    this.closeModal();
                });
                
                // Click toast per aprire modal
                this.state.toast.addEventListener('click', () => {
                    this.hideToast();
                    this.openModal();
                });
                
                // Click toast close
                this.state.toast.querySelector('.' + this.config.cssPrefix + 'toast-close').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.hideToast();
                });
                
                // ESC per chiudere
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.state.modalOpen) {
                        this.closeModal();
                    }
                });
                
                this.log('Event listeners inizializzati');
            } catch (error) {
                this.error('Errore inizializzazione event listeners:', error);
            }
        },
        
        // ========== APERTURA MODAL ==========
        openModal: function() {
            try {
                this.state.modalOpen = true;
                this.state.modal.classList.add(this.config.cssPrefix + 'open');
                
                // Nascondi toast se aperto
                this.hideToast();
                
                // Traccia apertura modal
                this.trackEvent('bot_modal_opened', {
                    page: window.location.pathname
                });
                
                // Genera contenuto
                this.generateModalContent();
                
            } catch (error) {
                this.error('Errore apertura modal:', error);
            }
        },
        
        // ========== CHIUSURA MODAL ==========
        closeModal: function() {
            try {
                this.state.modalOpen = false;
                this.state.modal.classList.remove(this.config.cssPrefix + 'open');
                
                // Traccia chiusura modal
                this.trackEvent('bot_modal_closed', {
                    page: window.location.pathname
                });
            } catch (error) {
                this.error('Errore chiusura modal:', error);
            }
        },
        
        // ========== MOSTRA TOAST ==========
        showToast: function() {
            try {
                this.state.toast.classList.add(this.config.cssPrefix + 'show');
            } catch (error) {
                this.error('Errore mostra toast:', error);
            }
        },
        
        // ========== NASCONDI TOAST ==========
        hideToast: function() {
            try {
                this.state.toast.classList.remove(this.config.cssPrefix + 'show');
            } catch (error) {
                this.error('Errore nascondi toast:', error);
            }
        },
        
        // ========== GENERAZIONE CONTENUTO MODAL ==========
        generateModalContent: function() {
            try {
                const body = this.state.modal.querySelector('.' + this.config.cssPrefix + 'modal-body');
                
                // Mostra loading
                body.innerHTML = `
                    <div class="${this.config.cssPrefix}loading">
                        <div class="${this.config.cssPrefix}spinner"></div>
                        Caricamento...
                    </div>
                `;
                
                // Simula caricamento
                setTimeout(() => {
                    const greeting = this.getGreeting();
                    const niches = this.getSuggestedNiches();
                    const combo = this.getRandomCombo();
                    
                    body.innerHTML = `
                        ${greeting}
                        ${niches}
                        ${combo}
                        ${this.getMusicLinks()}
                        ${this.getBountyLink()}
                    `;
                }, 500);
                
            } catch (error) {
                this.error('Errore generazione contenuto:', error);
                this.showError('Errore nel caricamento del contenuto');
            }
        },
        
        // ========== SALUTO ORARIO ==========
        getGreeting: function() {
            const hour = new Date().getHours();
            let greeting = '';
            
            if (hour >= 5 && hour < 12) {
                greeting = 'Buongiorno! ☀️';
            } else if (hour >= 12 && hour < 18) {
                greeting = 'Buon pomeriggio! 🌤️';
            } else if (hour >= 18 && hour < 22) {
                greeting = 'Buonasera! 🌙';
            } else {
                greeting = 'Buonanotte! 🌃';
            }
            
            return `
                <div class="${this.config.cssPrefix}greeting">
                    <strong>${greeting}</strong><br>
                    Sono la tua IA Smart Choices. Posso aiutarti a trovare i prodotti perfetti per te!
                </div>
            `;
        },
        
        // ========== SUGGERIMENTO NICCHIE ==========
        getSuggestedNiches: function() {
            if (!this.state.nichesData || this.state.nichesData.length === 0) {
                return '';
            }
            
            const rootPath = this.getRootPath();
            
            // Seleziona 3 nicchie casuali
            const shuffled = [...this.state.nichesData].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);
            
            const nichesHTML = selected.map(niche => {
                // Se siamo alla root, usa l'URL come-is
                // Se siamo a profondità > 0, prependi ../ per ogni livello
                const fullPath = this.state.pathDepth === 0 ? niche.url : rootPath + niche.url;
                return `
                <div class="${this.config.cssPrefix}niche-card" onclick="SmartChoicesAI.trackNicheClick('${niche.id}', '${niche.name}', '${fullPath}')">
                    <div class="${this.config.cssPrefix}niche-name">
                        <i class="fas ${niche.icon}"></i>
                        ${niche.name}
                    </div>
                    <div class="${this.config.cssPrefix}niche-description">${niche.description}</div>
                </div>
            `}).join('');
            
            return `
                <div class="${this.config.cssPrefix}niches-section">
                    <div class="${this.config.cssPrefix}section-title">
                        <i class="fas fa-star"></i>
                        Nicchie Consigliate
                    </div>
                    ${nichesHTML}
                </div>
            `;
        },
        
        // ========== COMBO DINAMICA DAI PRODOTTI DELLA PAGINA ==========
        getRandomCombo: function() {
            // Usa i prodotti caricati dalla pagina corrente
            if (!this.state.currentPageProducts || this.state.currentPageProducts.length === 0) {
                return '';
            }
            
            // Seleziona 3 prodotti casuali dalla pagina
            const shuffled = [...this.state.currentPageProducts].sort(() => 0.5 - Math.random());
            const selectedProducts = shuffled.slice(0, Math.min(3, shuffled.length));
            
            if (selectedProducts.length === 0) {
                return '';
            }
            
            // Aggiungi jolly (bevanda o snack)
            const jollies = [
                { name: 'Acqua', icon: 'fa-tint' },
                { name: 'Tè', icon: 'fa-mug-hot' },
                { name: 'Caffè', icon: 'fa-coffee' },
                { name: 'Snack', icon: 'fa-cookie' },
                { name: 'Frutta', icon: 'fa-apple-alt' }
            ];
            const jolly = jollies[Math.floor(Math.random() * jollies.length)];
            
            // Genera HTML per i prodotti selezionati
            const itemsHTML = selectedProducts.map(product => `
                <span class="${this.config.cssPrefix}combo-item">
                    <i class="fas fa-box"></i>
                    ${product.name}
                </span>
            `).join('');
            
            const jollyHTML = `
                <span class="${this.config.cssPrefix}combo-item jolly">
                    <i class="fas ${jolly.icon}"></i>
                    ${jolly.name} (Jolly)
                </span>
            `;
            
            return `
                <div class="${this.config.cssPrefix}combo-section">
                    <div class="${this.config.cssPrefix}combo-card">
                        <div class="${this.config.cssPrefix}combo-title">
                            <i class="fas fa-boxes"></i>
                            Combo del Momento
                        </div>
                        <div class="${this.config.cssPrefix}combo-items">
                            ${itemsHTML}
                            ${jollyHTML}
                        </div>
                    </div>
                </div>
            `;
        },
        
        // ========== LINK MUSICA ==========
        getMusicLinks: function() {
            return `
                <div class="${this.config.cssPrefix}music-section">
                    <div class="${this.config.cssPrefix}section-title">
                        <i class="fas fa-music"></i>
                        Ascolta mentre acquisti
                    </div>
                    <div class="${this.config.cssPrefix}music-links">
                        <a href="https://open.spotify.com" target="_blank" class="${this.config.cssPrefix}music-link spotify">
                            <i class="fab fa-spotify"></i>
                            Spotify
                        </a>
                        <a href="https://music.amazon.it" target="_blank" class="${this.config.cssPrefix}music-link amazon-music">
                            <i class="fab fa-amazon"></i>
                            Amazon Music
                        </a>
                    </div>
                </div>
            `;
        },
        
        // ========== LINK BOUNTY ==========
        getBountyLink: function() {
            return `
                <div class="${this.config.cssPrefix}bounty-section">
                    <a href="bounty.html" class="${this.config.cssPrefix}bounty-link" target="_blank">
                        <i class="fas fa-gift"></i>
                        Scopri i Servizi Amazon
                    </a>
                </div>
            `;
        },
        
        // ========== SHOW ERROR ==========
        showError: function(message) {
            const body = this.state.modal.querySelector('.' + this.config.cssPrefix + 'modal-body');
            if (body) {
                body.innerHTML = `
                    <div class="${this.config.cssPrefix}error">
                        <i class="fas fa-exclamation-triangle"></i>
                        ${message}
                    </div>
                `;
            }
        },
        
        // ========== HIDE ALL COMPONENTS ==========
        hideAllComponents: function() {
            if (this.state.floatButton) this.state.floatButton.style.display = 'none';
            if (this.state.modal) this.state.modal.style.display = 'none';
            if (this.state.toast) this.state.toast.style.display = 'none';
        },
        
        // ========== DEFAULT NICHES ==========
        getDefaultNiches: function() {
            return [
                { name: 'Fitness Casa', icon: 'fa-dumbbell', description: 'Allenati a casa', url: 'benessere/fitness-casa/index.html' },
                { name: 'Cucina Moderna', icon: 'fa-fire-burner', description: 'Elettrodomestici smart', url: 'casa/cucina-elettrodomestici/index.html' },
                { name: 'Tech Gadgets', icon: 'fa-microchip', description: 'Ultima tecnologia', url: 'tech/gadget-tech/index.html' }
            ];
        },
        
        // ========== DEFAULT COMBOS ==========
        getDefaultCombos: function() {
            return {
                'default': {
                    products: [
                        { name: 'Prodotto 1', icon: 'fa-box' },
                        { name: 'Prodotto 2', icon: 'fa-box' }
                    ]
                }
            };
        },
        
        // ========== LOG ==========
        log: function(message, data) {
            if (this.config.debugMode) {
                console.log('[SmartChoicesAI]', message, data || '');
            }
        },
        
        // ========== ERROR ==========
        error: function(message, error) {
            console.error('[SmartChoicesAI ERROR]', message, error);
        }
    };
    
    // Auto-inizializzazione quando DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.SmartChoicesAI.init();
        });
    } else {
        window.SmartChoicesAI.init();
    }
    
})();
