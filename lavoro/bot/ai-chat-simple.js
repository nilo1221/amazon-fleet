// Simple AI Chat - Keyword Matching System

// IMPORTANT NOTE FOR BOT
const BOT_INSTRUCTIONS = `NOTA IMPORTANTE SULLE CATEGORIE:
Tutte le categorie presenti nel catalogo, inclusa 'Cinema & TV', fanno riferimento esclusivamente a prodotti di abbigliamento, accessori moda e articoli di stile.

La categoria 'Cinema & TV' non contiene film, serie TV da guardare o contenuti multimediali, ma contiene esclusivamente abbigliamento, gadget e accessori ispirati al mondo dell'intrattenimento.

Quando un utente interagisce con queste categorie, il tuo compito è fornire consigli su vestiti, taglie, abbinamenti o stile.

Se l'utente dovesse chiedere specificamente un film o una serie TV da guardare, rispondi gentilmente chiarendo che il sito è specializzato in moda e stile a tema.`;

// State
let chatOpen = false;
let lastInteractionTime = Date.now();
let abandonmentTimer = null;
let pageLoadTime = Date.now();
let pageScrollTriggered = false;

// Stop words - common greetings and words that shouldn't trigger product matching
const stopWords = ['ciao', 'salve', 'ehi', 'hey', 'buongiorno', 'buonasera', 'buonanotte', 'grazie', 'prego', 'scusa', 'scusi', 'per favore', 'perfavore', 'ok', 'sì', 'no', 'si', 'come', 'stai', 'va', 'tutto', 'bene', 'male', 'quindi', 'allora', 'perché', 'perche', 'ma', 'e', 'o', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra'];

// Proactive message bubble
let proactiveBubble = null;
let proactiveBubbleShown = false;

// Start abandonment timer
function startAbandonmentTimer() {
    // Clear existing timer
    if (abandonmentTimer) {
        clearTimeout(abandonmentTimer);
    }
    
    // Start new 10 second timer (only if chat is open)
    abandonmentTimer = setTimeout(() => {
        const chatMessages = document.getElementById('chat-messages');
        const chatWindow = document.getElementById('ai-chat-window');
        const botLogo = document.querySelector('.chat-bot-logo');
        
        // Only show if chat is open and user hasn't interacted recently
        if (chatWindow && chatWindow.classList.contains('active')) {
            const timeSinceLastInteraction = Date.now() - lastInteractionTime;
            if (timeSinceLastInteraction >= 10000) { // 10 seconds
                // Add red notification dot to bot logo
                if (botLogo) {
                    botLogo.classList.add('proactive-notification');
                }
                addProactiveMessage('Hai trovato quello che cercavi o ti serve una mano per scegliere il regalo perfetto? 😊');
                setTimeout(() => {
                    showMacroCategories();
                }, 1000);
            }
        }
    }, 10000);
}

// Start page-level proactive message (45-60 seconds after page load or scroll)
function startPageProactiveMessage() {
    if (proactiveBubbleShown) return;
    
    // Check if 45-60 seconds have passed since page load
    const timeSinceLoad = Date.now() - pageLoadTime;
    
    if (timeSinceLoad >= 45000) {
        showProactiveBubble();
    } else {
        // Wait until 45 seconds have passed
        const waitTime = 45000 - timeSinceLoad;
        setTimeout(() => {
            if (!proactiveBubbleShown) {
                showProactiveBubble();
            }
        }, waitTime);
    }
}

// Show proactive message bubble
function showProactiveBubble() {
    if (proactiveBubbleShown || proactiveBubble) return;
    
    const chatButton = document.getElementById('ai-chat-button');
    if (!chatButton) return;
    
    // Create proactive bubble
    proactiveBubble = document.createElement('div');
    proactiveBubble.className = 'proactive-bubble';
    proactiveBubble.innerHTML = `
        <button class="proactive-close" onclick="closeProactiveBubble(event)">×</button>
        <div class="proactive-content">
            <div class="proactive-icon">🔥</div>
            <div class="proactive-text">Ti vedo interessato! Se vuoi, posso confrontare per te le migliori Friggitrici ad Aria oggi su Amazon. Vuoi vedere la mia top 3?</div>
        </div>
    `;
    
    // Position bubble near chat button
    const buttonRect = chatButton.getBoundingClientRect();
    proactiveBubble.style.bottom = (buttonRect.height + 15) + 'px';
    proactiveBubble.style.right = '0';
    
    // Add click handler to open chat
    proactiveBubble.addEventListener('click', (e) => {
        if (!e.target.classList.contains('proactive-close')) {
            openChat();
            setTimeout(() => {
                addMessage('Certamente! Per quale occasione stai cercando il regalo? O hai già in mente una categoria?', 'bot');
                setTimeout(() => {
                    showMacroCategories();
                }, 500);
            }, 500);
            closeProactiveBubble(e);
        }
    });
    
    document.body.appendChild(proactiveBubble);
    proactiveBubbleShown = true;
    
    // Add red notification dot to bot logo
    const botLogo = document.querySelector('.chat-bot-logo');
    if (botLogo) {
        botLogo.classList.add('proactive-notification');
    }
}

// Close proactive bubble
function closeProactiveBubble(event) {
    if (event) event.stopPropagation();
    
    if (proactiveBubble) {
        proactiveBubble.remove();
        proactiveBubble = null;
    }
    
    proactiveBubbleShown = true;
    
    // Remove red notification dot from bot logo
    const botLogo = document.querySelector('.chat-bot-logo');
    if (botLogo) {
        botLogo.classList.remove('proactive-notification');
    }
}

// Detect scroll to trigger proactive message
function detectScroll() {
    if (pageScrollTriggered || proactiveBubbleShown) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 100) { // Trigger after 100px scroll
        pageScrollTriggered = true;
        showProactiveBubble();
    }
}

// Reset abandonment timer on user interaction
function resetAbandonmentTimer() {
    lastInteractionTime = Date.now();
    
    // Remove red notification dot from bot logo
    const botLogo = document.querySelector('.chat-bot-logo');
    if (botLogo) {
        botLogo.classList.remove('proactive-notification');
    }
    
    if (abandonmentTimer) {
        clearTimeout(abandonmentTimer);
        startAbandonmentTimer();
    }
}

// Levenshtein distance for fuzzy search
function levenshteinDistance(a, b) {
    const matrix = [];
    
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[b.length][a.length];
}

// Check if word matches keyword with fuzzy search
function fuzzyMatch(word, keyword, threshold = 2) {
    const distance = levenshteinDistance(word.toLowerCase(), keyword.toLowerCase());
    const maxLength = Math.max(word.length, keyword.length);
    return distance <= threshold && distance <= maxLength * 0.3;
}

// Category mapping with keywords
const categoryKeywords = {
    'cucina-elettrodomestici': {
        keywords: ['cucina', 'elettrodomestici', 'friggitrice', 'aria', 'forno', 'microonde', 'bollitore', 'caffettiera', 'macchina', 'caffè', 'frigorifero', 'freezer', 'lavatrice', 'asciugatrice', 'lavastoviglie', 'robot', 'cucina', 'minipimer', 'frullatore', 'mixer', 'spremiagrumi', 'estrattore', 'centrifuga', 'tostapane', 'griglia', 'piastra', 'cottura', 'pentola', 'padella', 'wok', 'pentolame', 'batteria', 'pentole', 'coltello', 'taglieri', 'tagliere', 'scolapasta', 'schiumarola', 'mestolo', 'cucchiaio', 'forchetta', 'set', 'posate', 'bottiglia', 'thermos', 'miglior friggitrice', 'friggitrice aria prezzo', 'friggitrice recensione', 'miglior forno', 'forno prezzo', 'macchina caffe opinioni', 'lavatrice migliore', 'frigorifero offerta', 'pentole antiaderenti', 'set pentole cucina', 'condizionatore portatile', 'ventilatore soffitto', 'ventilatore tavolo', 'detersivi', 'bevande', 'aiutami', 'consigliami', 'parlami', 'ascoltami', 'ti ascolto', 'aiuto', 'consulenza', 'qual è il migliore per me', 'quale mi consigli', 'mi serve aiuto', 'non so cosa scegliere', 'guidami', 'spiegami', 'dimmi di più', 'aiutami a scegliere', 'consiglio esperto'],
        name: 'Cucina Moderna & Tech',
        url: 'cucina-elettrodomestici/index.html'
    },
    'smart-home-domotica': {
        keywords: ['smart', 'home', 'domotica', 'lampada', 'termostato', 'sensore', 'casa', 'intelligente', 'luci', 'automazione', 'telecomando', 'controllo', 'wifi', 'bluetooth', 'smartphone', 'app', 'termostato', 'intelligente', 'telecamera', 'sorveglianza', 'videocamera', 'allarme', 'sicurezza', 'serratura', 'smart', 'lock', 'prese', 'intelligenti', 'prese', 'wifi', 'hub', 'centrale', 'domotica', 'miglior termostato', 'termostato wifi prezzo', 'lampada smart recensione', 'telecamera sorveglianza opinioni', 'serratura smart migliore', 'prese intelligenti offerta', 'luci wifi casa', 'sistema allarme casa', 'videocamera esterna', 'aiutami', 'consigliami', 'parlami', 'ascoltami', 'ti ascolto', 'aiuto', 'consulenza', 'qual è il migliore per me', 'quale mi consigli', 'mi serve aiuto', 'non so cosa scegliere', 'guidami', 'spiegami', 'dimmi di più', 'aiutami a scegliere', 'consiglio esperto'],
        name: 'Smart Home & Domotica',
        url: 'smart-home-domotica/index.html'
    },
    'fitness-casa': {
        keywords: ['fitness', 'smartwatch', 'activity', 'tracker', 'pesi', 'palestra', 'allenamento', 'sport', 'cyclette', 'tapis', 'roulant', 'ellittica', 'manubri', 'pesetti', 'elastici', 'bande', 'yoga', 'pilates', 'tappetino', 'step', 'panca', 'bilanciere', 'dischi', 'cavigliere', 'bracciale', 'cardio', 'corsa', 'bici', 'spinning', 'crossfit', 'kettlebell', 'trx', 'vibrazione', 'massaggiatore', 'foam', 'roller', 'miglior smartwatch', 'smartwatch fitness prezzo', 'activity tracker recensione', 'tapis roulant opinioni', 'cyclette casa migliore', 'manubri pesi offerta', 'panca palestra prezzo', 'elastici fitness casa', 'tappetino yoga qualità', 'aiutami', 'consigliami', 'parlami', 'ascoltami', 'ti ascolto', 'aiuto', 'consulenza', 'qual è il migliore per me', 'quale mi consigli', 'mi serve aiuto', 'non so cosa scegliere', 'guidami', 'spiegami', 'dimmi di più', 'aiutami a scegliere', 'consiglio esperto'],
        name: 'Fitness Casa',
        url: 'fitness-casa/index.html'
    },
    'elite-gaming-gear': {
        keywords: ['gaming', 'cuffie', 'headset', 'mouse', 'tastiera', 'keyboard', 'controller', 'ps5', 'xbox', 'playstation', 'play', 'station', 'nintendo', 'switch', 'pc', 'computer', 'laptop', 'monitor', 'schermo', 'sedia', 'gaming', 'scrivania', 'joystick', 'volante', 'pedale', 'simulatore', 'streaming', 'twitch', 'youtube', 'microfono', 'webcam', 'capture', 'card', 'vr', 'realtà', 'virtuale', 'oculus', 'quest', 'headset', 'auricolari', 'audio', 'sound', 'miglior cuffie gaming', 'cuffie ps5 prezzo', 'mouse gaming recensione', 'tastiera meccanica opinioni', 'monitor gaming 144hz', 'sedia gaming ergonomica', 'controller ps5 migliore', 'pc gaming preassemblato offerta', 'aiutami', 'consigliami', 'parlami', 'ascoltami', 'ti ascolto', 'aiuto', 'consulenza', 'qual è il migliore per me', 'quale mi consigli', 'mi serve aiuto', 'non so cosa scegliere', 'guidami', 'spiegami', 'dimmi di più', 'aiutami a scegliere', 'consiglio esperto'],
        name: 'Elite Gaming Gear',
        url: 'elite-gaming-gear/index.html'
    },
    'pet-care-intelligente': {
        keywords: ['gatto', 'cane', 'animale', 'lettiera', 'autopulente', 'cibo', 'pet', 'zampa', 'crocchette', 'mangiatore', 'bevitore', 'automatico', 'spazzola', 'pelo', 'tagliaunghie', 'trasportino', 'cuccia', 'casa', 'cane', 'giocattolo', 'osso', 'corda', 'pallina', 'collare', 'guinzaglio', 'pettorina', 'museruola', 'antiparassitario', 'pulci', 'zecke', 'integratore', 'vitamine', 'cuccia', 'riscaldata', 'coperta', 'cuscino', 'miglior lettiera gatto', 'lettiera autopulente prezzo', 'crocchette cane recensione', 'mangiatore automatico opinioni', 'spazzola pelo gatto', 'tagliaunghie elettrico', 'cuccia cane riscaldata offerta', 'antiparassitario naturale', 'aiutami', 'consigliami', 'parlami', 'ascoltami', 'ti ascolto', 'aiuto', 'consulenza', 'qual è il migliore per me', 'quale mi consigli', 'mi serve aiuto', 'non so cosa scegliere', 'guidami', 'spiegami', 'dimmi di più', 'aiutami a scegliere', 'consiglio esperto'],
        name: 'Pet Care Intelligente',
        url: 'pet-care-intelligente/index.html'
    },
    'cinema-tv': {
        keywords: ['tv', 'televisione', 'proiettore', 'cinema', 'film', 'bluray', 'dvd', 'schermo', 'monitor', 'home', 'theater', 'surround', 'soundbar', 'altoparlante', 'speaker', 'sound', 'audio', 'hifi', 'amplificatore', 'ricevitore', 'decoder', 'satellite', 'streaming', 'netflix', 'prime', 'disney', 'hbo', 'apple', 'tv', 'chromecast', 'fire', 'stick', 'roku', 'kodi', 'plex', 'media', 'player', 'cavo', 'hdmi', '4k', '8k', 'oled', 'qled', 'led', 'lcd', 'miglior tv 4k', 'tv 55 pollici prezzo', 'proiettore portatile recensione', 'soundbar opinioni', 'home theater sistema', 'monitor gaming 4k offerta', 'chromecast 4k migliore', 'fire tv stick prezzo', 'aiutami', 'consigliami', 'parlami', 'ascoltami', 'ti ascolto', 'aiuto', 'consulenza', 'qual è il migliore per me', 'quale mi consigli', 'mi serve aiuto', 'non so cosa scegliere', 'guidami', 'spiegami', 'dimmi di più', 'aiutami a scegliere', 'consiglio esperto'],
        name: 'Cinema & TV',
        url: 'cinema-tv/index.html'
    },
    'smartphone-tech': {
        keywords: ['smartphone', 'telefono', 'cellulare', 'iphone', 'samsung', 'android', 'galaxy', 'xiaomi', 'huawei', 'oppo', 'oneplus', 'pixel', 'nokia', 'sony', 'lg', 'motorola', 'honor', 'realme', 'tecno', 'infinix', 'vivo', 'zte', 'alcatel', 'wiko', 'bq', 'crosscall', 'cat', 'rugged', 'tough', 'tablet', 'ipad', 'samsung', 'galaxy', 'tab', 'kindle', 'ebook', 'reader', 'smartwatch', 'orologio', 'fitness', 'tracker', 'band', 'auricolari', 'cuffie', 'true', 'wireless', 'airpods', 'galaxy', 'buds', 'powerbank', 'batteria', 'caricabatterie', 'cavo', 'usb', 'type', 'c', 'lightning', 'miglior smartphone', 'iphone 15 prezzo', 'samsung galaxy recensione', 'xiaomi opinioni', 'tablet android migliore', 'auricolari bluetooth offerta', 'powerbank 20000mah', 'cavo usb type c', 'aiutami', 'consigliami', 'parlami', 'ascoltami', 'ti ascolto', 'aiuto', 'consulenza', 'qual è il migliore per me', 'quale mi consigli', 'mi serve aiuto', 'non so cosa scegliere', 'guidami', 'spiegami', 'dimmi di più', 'aiutami a scegliere', 'consiglio esperto'],
        name: 'Smartphone & Tech',
        url: 'smartphone-tech/index.html'
    },
    'moda-donna': {
        keywords: ['moda', 'donna', 'abbigliamento', 'vestito', 'scarpe', 'donna', 'borsa', 'donna', 'top', 'tshirt', 'maglietta', 'blusa', 'camicetta', 'jeans', 'pantaloni', 'gonna', 'giacca', 'cappotto', 'maglione', 'pullover', 'cardigan', 'blazer', 'abito', 'sera', 'elegante', 'intimo', 'reggiseno', 'mutandine', 'calze', 'collant', 'calzini', 'costume', 'bagno', 'beachwear', 'accessori', 'gioielli', 'collana', 'orecchino', 'bracciale', 'anello', 'occhiali', 'sole', 'sciarpa', 'cintura', 'cappello', 'berretto', 'scarpe eleganti', 'scarpe da sera', 'tacchi', 'décolleté', 'sandali eleganti', 'pumps', 'aiutami', 'consigliami', 'parlami', 'ascoltami', 'ti ascolto', 'aiuto', 'consulenza', 'qual è il migliore per me', 'quale mi consigli', 'mi serve aiuto', 'non so cosa scegliere', 'guidami', 'spiegami', 'dimmi di più', 'aiutami a scegliere', 'consiglio esperto'],
        name: 'Moda Donna',
        url: 'moda-donna/index.html'
    },
    'moda-uomo': {
        keywords: ['moda', 'uomo', 'abbigliamento', 'camicia', 'scarpe', 'uomo', 'borsa', 'uomo', 'tshirt', 'maglietta', 'polo', 'jeans', 'pantaloni', 'pantaloni', 'shorts', 'giacca', 'cappotto', 'maglione', 'pullover', 'cardigan', 'blazer', 'completo', 'abito', 'elegante', 'intimo', 'mutande', 'boxer', 'slip', 'calze', 'calzini', 'costume', 'bagno', 'beachwear', 'cravatta', 'papillon', 'cintura', 'cinturino', 'cappello', 'berretto', 'guanti', 'scarpe', 'sneakers', 'mocassini', 'stivali', 'scarpe eleganti', 'scarpe da cerimonia', 'scarpe classiche', 'oxford', 'derby', 'loafer', 'monk', 'aiutami', 'consigliami', 'parlami', 'ascoltami', 'ti ascolto', 'aiuto', 'consulenza', 'qual è il migliore per me', 'quale mi consigli', 'mi serve aiuto', 'non so cosa scegliere', 'guidami', 'spiegami', 'dimmi di più', 'aiutami a scegliere', 'consiglio esperto'],
        name: 'Moda Uomo',
        url: 'moda-uomo/index.html'
    },
    'viaggi-vacanze': {
        keywords: ['viaggio', 'vacanza', 'valigia', 'zaino', 'turismo', 'trolley', 'borse', 'viaggio', 'borsoni', 'custodie', 'sacca', 'aereo', 'volo', 'hotel', 'albergo', 'resort', 'campeggio', 'tenda', 'sacco', 'pelo', 'sleeping', 'bag', 'lanterna', 'torcia', 'bussola', 'kit', 'sopravvivenza', 'cucina', 'campeggio', 'pentole', 'portatili', 'stoviglie', 'posate', 'bicchieri', 'bottiglia', 'thermos', 'zaino', 'trekking', 'scarpe', 'montagna', 'bastoncini', 'impermeabile', 'giacca', 'antivento', 'kway', 'poncho'],
        name: 'Viaggi & Vacanze',
        url: 'viaggi-vacanze/index.html'
    },
    'accessori-moda': {
        keywords: ['accessori', 'orologio', 'cintura', 'occhiali', 'gioielli', 'collana', 'orecchino', 'bracciale', 'anello', 'sciarpa', 'foulard', 'cappello', 'berretto', 'guanti', 'borsa', 'portafoglio', 'carteira', 'borsetta', 'clutch', 'zainetto', 'marsupio', 'cinturino', 'cravatta', 'papillon', 'spilla', 'broche', 'fibbia', 'fermaglio', 'occhiali', 'sole', 'vista', 'lenti', 'contatto', 'montatura', 'astuccio', 'panno', 'pulizia'],
        name: 'Accessori Moda',
        url: 'accessori-moda/index.html'
    },
    'arredamento-casa': {
        keywords: ['arredamento', 'mobile', 'sofà', 'tavolo', 'sedia', 'decorazione', 'divano', 'poltrona', 'lettino', 'armadio', 'guardaroba', 'comò', 'cassettiera', 'libreria', 'scaffale', 'mensola', 'tavolo', 'scrivania', 'cucina', 'cucinino', 'isola', 'penisola', 'seduta', 'lampada', 'lampadario', 'plafoniera', 'applique', 'soggiorno', 'salotto', 'camera', 'da', 'letto', 'matrimoniale', 'singola', 'bagno', 'cucina', 'tappeto', 'moquette', 'tende', 'cortine', 'cuscino', 'coperta', 'piumone', 'trapunta', 'lenzuola', 'federa', 'copriletto'],
        name: 'Arredamento Casa',
        url: 'arredamento-casa/index.html'
    },
    'benessere-cura-personale': {
        keywords: ['benessere', 'cura', 'personale', 'crema', 'trucco', 'skincare', 'profumo', 'makeup', 'cosmetico', 'viso', 'corpo', 'capelli', 'shampoo', 'balsamo', 'conditioner', 'maschera', 'siero', 'lozione', 'tonico', 'detergente', 'esfoliante', 'idratante', 'solare', 'crema', 'solare', 'abbronzante', 'doposole', 'barba', 'raso', 'lametta', 'rasoio', 'spazzolino', 'dentifricio', 'colluttorio', 'filo', 'interdentale', 'deodorante', 'profumo', 'eau', 'de', 'toilette', 'parfum', 'balsamo', 'dopobarba', 'olio', 'corpo', 'burro', 'corpo', 'scrub', 'sale', 'zucchero'],
        name: 'Benessere & Cura Personale',
        url: 'benessere-cura-personale/index.html'
    },
    'dvd-bluray': {
        keywords: ['dvd', 'bluray', 'blu-ray', 'cd', 'film', 'movie', 'serie', 'tv', 'video', 'disco', 'bluray'],
        name: 'CD, DVD & Blu-ray',
        url: 'dvd-bluray/index.html'
    },
    'fotografia-mobile': {
        keywords: ['fotografia', 'foto', 'camera', 'obiettivo', 'treppiede', 'dslr', 'mirrorless', 'reflex', 'compatta', 'action', 'cam', 'gopro', 'instax', 'polaroid', 'stampante', 'foto', 'album', 'cornice', 'quadro', 'flash', 'luce', 'studio', 'softbox', 'ombrello', 'diffusore', 'filtro', 'lente', 'polarizzatore', 'nd', 'uv', 'macro', 'wide', 'angle', 'teleobiettivo', 'zoom', 'prime', 'fissa', 'borsa', 'fotografica', 'zaino', 'custodia', 'memory', 'card', 'sd', 'microsd', 'cf', 'batteria', 'caricabatterie', 'gimbal', 'stabilizzatore', 'drone', 'aereo'],
        name: 'Fotografia Mobile',
        url: 'fotografia-mobile/index.html'
    },
    'giochi-da-tavolo': {
        keywords: ['giochi', 'da', 'tavolo', 'board', 'game', 'dadi', 'd', 'd', 'dungeons', 'dragons', 'dnd', 'pathfinder', 'gurps', 'call', 'cthulhu', 'vampire', 'masquerade', 'warhammer', '40k', 'age', 'sigmar', 'monopoly', 'risk', 'scrabble', 'trivial', 'pursuit', 'cluedo', 'twister', 'jenga', 'uno', 'rummy', 'poker', 'blackjack', 'bridge', 'scopone', 'briscola', 'tressette', 'scala', '40', 'scacchi', 'scacchi', 'dama', 'go', 'xiangqi', 'mahjong', 'backgammon', 'carrom', 'mancala', 'catan', 'settlers', 'ticket', 'ride', 'carcassonne', 'pandemic', 'terraforming', 'mars', 'wingspan', 'azul', 'splendor'],
        name: 'Giochi da Tavolo',
        url: 'giochi-da-tavolo/index.html'
    },
    'libri-ereader': {
        keywords: ['libro', 'kindle', 'ebook', 'lettore', 'romanzo', 'thriller', 'giallo', 'fantasy', 'fantascienza', 'horror', 'romance', 'erotico', 'storico', 'biografia', 'autobiografia', 'saggio', 'manual', 'guida', 'studio', 'scuola', 'università', 'bambini', 'ragazzi', 'young', 'adult', 'fumetto', 'manga', 'graphic', 'novel', 'comics', 'audiolibro', 'audible', 'kobo', 'nook', 'boox', 'pocketbook', 'tolino', 'sony', 'reader', 'paperwhite', 'oasis', 'scribe', 'clara', 'libra', 'h2o', 'glo', 'aura', 'one', 'edition', 'forma', 'cover', 'custodia', 'light', 'case'],
        name: 'Libri & E-Reader',
        url: 'libri-ereader/index.html'
    },
    'mare-spiaggia': {
        keywords: ['mare', 'spiaggia', 'ombrellone', 'telo', 'costume', 'scarpe', 'acqua', 'sandali', 'ciabatte', 'slip', 'infradito', 'flip', 'flop', 'espadrillas', 'crema', 'solare', 'abbronzante', 'doposole', 'occhiali', 'sole', 'cappello', 'berretto', 'fascia', 'bandana', 'tuta', 'bagno', 'costume', 'bikini', 'slip', 'mutande', 'shorts', 'beach', 'wear', 'gonna', 'mare', 'dress', 'mare', 'telo', 'microfibra', 'asciugamano', 'sabbia', 'impermeabile', 'borsa', 'mare', 'zaino', 'secchiello', 'secchio', 'paletta', 'formine', 'pallina', 'beach', 'volley', 'racchette', 'beach', 'tennis', 'paddle', 'surf', 'bodyboard', 'boogie', 'board', 'snorkeling', 'maschera', 'boccaglio', 'pinne', 'gommone', 'canoa', 'kayak', 'paddleboard', 'sup', 'stand', 'up', 'paddle', 'miglior telo mare', 'ombrellone spiaggia prezzo', 'costume bagno recensione', 'scarpe acqua opinioni', 'crema solare 50', 'occhiali sole polarizzati', 'borsa mare impermeabile', 'sedia spiaggia pieghevole', 'cooler box termica', 'aiutami', 'consigliami', 'parlami', 'ascoltami', 'ti ascolto', 'aiuto', 'consulenza', 'qual è il migliore per me', 'quale mi consigli', 'mi serve aiuto', 'non so cosa scegliere', 'guidami', 'spiegami', 'dimmi di più', 'aiutami a scegliere', 'consiglio esperto'],
        name: 'Mare & Spiaggia',
        url: 'mare-spiaggia/index.html'
    },
    'outdoor-camping': {
        keywords: ['outdoor', 'campeggio', 'tenda', 'barbecue', 'zaino', 'trekking', 'escursione', 'montagna', 'sacco', 'pelo', 'sleeping', 'bag', 'lanterna', 'torcia', 'frontale', 'bussola', 'gps', 'navigatore', 'mappe', 'bussola', 'kit', 'sopravvivenza', 'coltello', 'multitool', 'cucina', 'campeggio', 'pentole', 'portatili', 'stoviglie', 'posate', 'bicchieri', 'bottiglia', 'thermos', 'borsa', 'frigo', 'cooler', 'box', 'ice', 'sedia', 'pieghevole', 'tavolo', 'pieghevole', 'hammock', 'amaca', 'mosquito', 'net', 'zanzariera', 'poncho', 'impermeabile', 'giacca', 'antivento', 'kway', 'scarpe', 'trekking', 'stivali', 'bastoncini', 'crampon', 'piccone', 'corda', 'imbracatura', 'carabiner', 'moschettone', 'rampicata', 'arrampicata', 'miglior tenda campeggio', 'barbecue portatile prezzo', 'zaino trekking 60l', 'lanterna led ricaricabile', 'sacco a pelo invernale', 'stivali trekking opinioni', 'cucina campeggio gas', 'cooler box 24l', 'aiutami', 'consigliami', 'parlami', 'ascoltami', 'ti ascolto', 'aiuto', 'consulenza', 'qual è il migliore per me', 'quale mi consigli', 'mi serve aiuto', 'non so cosa scegliere', 'guidami', 'spiegami', 'dimmi di più', 'aiutami a scegliere', 'consiglio esperto'],
        name: 'Outdoor & Camping',
        url: 'outdoor-camping/index.html'
    },
    'profumi-bellezza': {
        keywords: ['profumo', 'bellezza', 'makeup', 'cosmetico', 'eau', 'de', 'toilette', 'parfum', 'eau', 'de', 'parfum', 'intense', 'edp', 'edt', 'cologne', 'after', 'shave', 'balsamo', 'dopobarba', 'crema', 'viso', 'siero', 'lozione', 'tonico', 'detergente', 'esfoliante', 'idratante', 'solare', 'crema', 'solare', 'abbronzante', 'doposole', 'trucco', 'fondotinta', 'correttore', 'concealer', 'mascara', 'eyeliner', 'ombretto', 'rossetto', 'lipstick', 'gloss', 'lip', 'blush', 'bronzer', 'illuminante', 'primer', 'setting', 'powder', 'spugna', 'pennello', 'brush', 'lipstick', 'palette', 'ombreto', 'smalto', 'unghie', 'rimuovi', 'smalto', 'nail', 'polish', 'remover'],
        name: 'Profumi & Bellezza',
        url: 'profumi-bellezza/index.html'
    },
    'sostenibilita-eco-friendly': {
        keywords: ['sostenibilità', 'eco', 'ambiente', 'riciclo', 'ecologico', 'green', 'biologico', 'organico', 'naturale', 'plastic', 'free', 'zero', 'waste', 'compostabile', 'biodegradabile', 'riciclato', 'riciclabile', 'energia', 'solare', 'pannelli', 'solari', 'eolico', 'turbina', 'idrico', 'acqua', 'risparmio', 'energetico', 'led', 'lampadina', 'batteria', 'ricaricabile', 'powerbank', 'solare', 'borsa', 'tessile', 'canna', 'acqua', 'bottiglia', 'vetro', 'acciaio', 'inox', 'bamboo', 'bambù', 'corteccia', 'betulla', 'canapa', 'lino', 'cotone', 'organico', 'fair', 'trade', 'equo', 'solidale', 'locale', 'km', 'zero', 'slow', 'food', 'km', 'zero'],
        name: 'Sostenibilità & Eco-Friendly',
        url: 'sostenibilita-eco-friendly/index.html'
    },
    'tech': {
        keywords: ['tech', 'tecnologia', 'gadget', 'computer', 'laptop', 'notebook', 'desktop', 'pc', 'mac', 'windows', 'linux', 'android', 'ios', 'software', 'hardware', 'periferica', 'mouse', 'tastiera', 'monitor', 'schermo', 'stampante', 'scanner', 'webcam', 'microfono', 'cuffie', 'auricolari', 'speaker', 'soundbar', 'router', 'modem', 'wifi', 'bluetooth', 'usb', 'cavo', 'adattatore', 'hub', 'dock', 'powerbank', 'batteria', 'caricabatterie', 'hard', 'disk', 'ssd', 'ram', 'cpu', 'gpu', 'processore', 'scheda', 'video', 'scheda', 'madre', 'case', 'ventole', 'raffreddamento', 'liquido', 'watercooling', 'miglior laptop', 'notebook gaming prezzo', 'pc desktop recensione', 'monitor 4k opinioni', 'ssd 1tb migliore', 'ram 16gb offerta', 'scheda video gaming', 'wifi router 6e', 'aiutami', 'consigliami', 'parlami', 'ascoltami', 'ti ascolto', 'aiuto', 'consulenza', 'qual è il migliore per me', 'quale mi consigli', 'mi serve aiuto', 'non so cosa scegliere', 'guidami', 'spiegami', 'dimmi di più', 'aiutami a scegliere', 'consiglio esperto'],
        name: 'Tech',
        url: 'tech/index.html'
    },
    'ufficio-produttivo': {
        keywords: ['ufficio', 'scrivania', 'sedia', 'ufficio', 'stampante', 'organizzatore', 'cassetto', 'porta', 'documenti', 'raccoglitore', 'cartella', 'busta', 'penna', 'matita', 'evidenziatore', 'correttore', 'gomma', 'righello', 'forbice', 'taglierino', 'calcolatrice', 'agenda', 'diario', 'calendario', 'planner', 'organizer', 'blocco', 'notes', 'post', 'it', 'adesivi', 'nastro', 'scotch', 'rilegatrice', 'foratrice', 'tagliacarte', 'laminatrice', 'spillatrice', 'cucitrice', 'punti', 'metal', 'fermacampioni', 'portapenne', 'portamouse', 'tappetino', 'mouse', 'supporto', 'monitor', 'braccio', 'monitor', 'lampada', 'scrivania', 'lettore', 'cd', 'dvd', 'masterizzatore', 'esterno', 'hard', 'disk', 'nas', 'server'],
        name: 'Ufficio Produttivo',
        url: 'ufficio-produttivo/index.html'
    }
};

// Macro-categories structure
const macroCategories = {
    'casa-vita': {
        name: 'Casa & Vita',
        icon: '🏠',
        categories: ['cucina-elettrodomestici', 'arredamento-casa', 'smart-home-domotica', 'pet-care-intelligente']
    },
    'tech-lifestyle': {
        name: 'Tech & Lifestyle',
        icon: '💻',
        categories: ['smartphone-tech', 'tech', 'fotografia-mobile', 'ufficio-produttivo']
    },
    'hobby-svago': {
        name: 'Hobby & Svago',
        icon: '🎮',
        categories: ['elite-gaming-gear', 'giochi-da-tavolo', 'libri-ereader']
    },
    'cinema-tv': {
        name: 'Moda Serie TV',
        icon: '📺',
        categories: ['cinema-tv', 'dvd-bluray']
    },
    'moda': {
        name: 'Moda',
        icon: '👗',
        categories: ['moda-donna', 'moda-uomo', 'accessori-moda', 'profumi-bellezza']
    },
    'benessere': {
        name: 'Benessere',
        icon: '💪',
        categories: ['fitness-casa', 'benessere-cura-personale']
    },
    'avventure': {
        name: 'Avventure',
        icon: '✈️',
        categories: ['viaggi-vacanze', 'outdoor-camping', 'mare-spiaggia']
    },
    'sostenibilita': {
        name: 'Sostenibilità',
        icon: '🌱',
        categories: ['sostenibilita-eco-friendly']
    }
};

// Related categories mapping
const relatedCategories = {
    'cucina-elettrodomestici': ['smart-home-domotica', 'arredamento-casa'],
    'smart-home-domotica': ['cucina-elettrodomestici', 'tech'],
    'fitness-casa': ['smartphone-tech', 'tech'],
    'elite-gaming-gear': ['smartphone-tech', 'tech', 'cinema-tv'],
    'pet-care-intelligente': ['arredamento-casa', 'outdoor-camping'],
    'cinema-tv': ['tech', 'smartphone-tech'],
    'smartphone-tech': ['tech', 'fitness-casa', 'elite-gaming-gear'],
    'moda-donna': ['accessori-moda', 'profumi-bellezza'],
    'moda-uomo': ['accessori-moda', 'profumi-bellezza'],
    'viaggi-vacanze': ['outdoor-camping', 'mare-spiaggia'],
    'accessori-moda': ['moda-donna', 'moda-uomo'],
    'arredamento-casa': ['smart-home-domotica', 'benessere-cura-personale'],
    'benessere-cura-personale': ['profumi-bellezza', 'arredamento-casa'],
    'dvd-bluray': ['cinema-tv'],
    'fotografia-mobile': ['tech', 'smartphone-tech'],
    'giochi-da-tavolo': ['elite-gaming-gear'],
    'libri-ereader': ['tech', 'smartphone-tech'],
    'mare-spiaggia': ['viaggi-vacanze', 'outdoor-camping'],
    'outdoor-camping': ['viaggi-vacanze', 'mare-spiaggia'],
    'profumi-bellezza': ['moda-donna', 'moda-uomo', 'benessere-cura-personale'],
    'sostenibilita-eco-friendly': ['arredamento-casa', 'tech'],
    'tech': ['smartphone-tech', 'fitness-casa', 'elite-gaming-gear'],
    'ufficio-produttivo': ['tech', 'arredamento-casa']
};

// Toggle chat window
function toggleChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    const chatButton = document.getElementById('ai-chat-button');
    
    if (!chatWindow || !chatButton) {
        console.error('Chat elements not found');
        return;
    }
    
    if (chatWindow.classList.contains('active')) {
        chatWindow.classList.remove('active');
        chatButton.classList.remove('active');
    } else {
        chatWindow.classList.add('active');
        chatButton.classList.add('active');
        
        // Show welcome message with macro-categories on first open
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages && chatMessages.children.length === 0) {
            showWelcomeMessage();
        }
    }
}

// Show welcome message with macro-categories
function showWelcomeMessage() {
    addMessage('Ciao! Sono qui per aiutarti a scegliere il meglio su Amazon. Cosa ti frulla per la testa oggi? Scegli una categoria o dimmi cosa stai cercando!', 'bot');
    setTimeout(() => {
        showMacroCategories();
    }, 500);
}

// Show macro-categories as Quick Replies
function showMacroCategories() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const quickRepliesDiv = document.createElement('div');
    quickRepliesDiv.className = 'quick-replies';
    
    const macroKeys = Object.keys(macroCategories);
    quickRepliesDiv.innerHTML = `
        <div class="quick-replies-grid">
            ${macroKeys.map(key => `
                <button class="quick-reply-card" onclick="selectMacroCategory('${key}')">
                    <div class="quick-reply-icon">${macroCategories[key].icon}</div>
                    <div class="quick-reply-name">${macroCategories[key].name}</div>
                </button>
            `).join('')}
        </div>
    `;
    
    chatMessages.appendChild(quickRepliesDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Select macro category and show sub-categories
function selectMacroCategory(macroKey) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const macro = macroCategories[macroKey];
    if (!macro) return;
    
    addMessage(`Hai selezionato: ${macro.icon} ${macro.name}`, 'user');
    
    // Reset abandonment timer on user interaction
    resetAbandonmentTimer();
    
    setTimeout(() => {
        addMessage(`Perfetto! Ecco le opzioni ${macro.name}:`, 'bot');
        setTimeout(() => {
            showSubCategories(macroKey);
        }, 500);
    }, 500);
}

// Show sub-categories for a macro-category
function showSubCategories(macroKey) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const macro = macroCategories[macroKey];
    if (!macro) return;
    
    const subCategoriesDiv = document.createElement('div');
    subCategoriesDiv.className = 'quick-replies';
    
    subCategoriesDiv.innerHTML = `
        <div class="quick-replies-grid">
            ${macro.categories.map(catKey => `
                <button class="quick-reply-card sub-category" onclick="selectCategoryFromButton('${catKey}')">
                    <div class="quick-reply-name">${categoryKeywords[catKey].name}</div>
                </button>
            `).join('')}
        </div>
    `;
    
    chatMessages.appendChild(subCategoriesDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Close chat
function closeChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    const chatButton = document.getElementById('ai-chat-button');
    
    if (!chatWindow || !chatButton) return;
    
    chatOpen = false;
    chatWindow.classList.remove('active');
    chatButton.classList.remove('active');
}

// Apply dynamic color theme based on category
function applyBotTheme(categoryKey) {
    const chatHeader = document.querySelector('.chat-header');
    if (!chatHeader) return;
    
    // Remove all existing theme classes
    chatHeader.classList.remove('theme-moda', 'theme-tech', 'theme-gaming', 'theme-cucina', 'theme-default');
    
    // Apply appropriate theme based on category
    if (categoryKey.includes('moda') || categoryKey.includes('cinema')) {
        chatHeader.classList.add('theme-moda');
    } else if (categoryKey.includes('gaming') || categoryKey.includes('elite-gaming')) {
        chatHeader.classList.add('theme-gaming');
    } else if (categoryKey.includes('tech') || categoryKey.includes('smartphone')) {
        chatHeader.classList.add('theme-tech');
    } else if (categoryKey.includes('cucina') || categoryKey.includes('elettrodomestici')) {
        chatHeader.classList.add('theme-cucina');
    } else {
        chatHeader.classList.add('theme-default');
    }
}

// Analyze message and find category with intelligent fallback
async function analyzeMessage(message) {
    if (!message || typeof message !== 'string') return null;
    
    const lowerMessage = message.toLowerCase();
    const words = lowerMessage.split(/\s+/);
    
    // Filter out stop words
    const meaningfulWords = words.filter(word => word.length > 2 && !stopWords.includes(word));
    
    // If message only contains stop words, return null
    if (meaningfulWords.length === 0) {
        return null;
    }
    
    let context = null;
    
    // Detect context keywords
    if (lowerMessage.includes('economic') || lowerMessage.includes('economico') || lowerMessage.includes('economiche')) {
        context = 'budget';
    } else if (lowerMessage.includes('miglior') || lowerMessage.includes('top') || lowerMessage.includes('migliore') || lowerMessage.includes('migliori')) {
        context = 'best';
    }
    
    // Calculate relevance scores for each category
    const categoryScores = [];
    for (const [categoryKey, categoryData] of Object.entries(categoryKeywords)) {
        let score = 0;
        
        for (const keyword of categoryData.keywords) {
            // Exact match - high score
            if (lowerMessage.includes(keyword)) {
                score += 10;
            }
            
            // Fuzzy match for each meaningful word - medium score
            for (const word of meaningfulWords) {
                if (fuzzyMatch(word, keyword)) {
                    score += 5;
                }
            }
        }
        
        if (score > 0) {
            categoryScores.push({ categoryKey, score, categoryData });
        }
    }
    
    // Sort by score (highest first)
    categoryScores.sort((a, b) => b.score - a.score);
    
    // If we have a clear winner (score >= 10), return it
    if (categoryScores.length > 0 && categoryScores[0].score >= 10) {
        return { ...categoryScores[0].categoryData, context };
    }
    
    // Otherwise, return the top 3 suggestions for intelligent fallback
    if (categoryScores.length > 0) {
        return { 
            type: 'suggestions', 
            suggestions: categoryScores.slice(0, 3).map(s => s.categoryData),
            context 
        };
    }
    
    return null;
}

// Send message
async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Reset abandonment timer on user interaction
    resetAbandonmentTimer();
    
    // Show loading indicator immediately
    addLoadingIndicator();
    
    // Analyze and respond
    const category = await analyzeMessage(message);
    
    // Remove loading indicator
    removeLoadingIndicator();
    
    setTimeout(async () => {
        if (category) {
            // Check if it's a suggestions response (intelligent fallback)
            if (category.type === 'suggestions') {
                addMessage('Non sono sicuro di cosa intendi, ma potresti essere interessato a queste categorie:', 'bot');
                
                // Show suggestion buttons
                const suggestionsDiv = document.createElement('div');
                suggestionsDiv.className = 'quick-replies';
                
                suggestionsDiv.innerHTML = `
                    <div class="quick-replies-grid">
                        ${category.suggestions.map(cat => `
                            <button class="quick-reply-card sub-category" onclick="selectCategoryFromButton('${Object.keys(categoryKeywords).find(key => categoryKeywords[key].name === cat.name)}')">
                                <div class="quick-reply-name">${cat.name}</div>
                            </button>
                        `).join('')}
                    </div>
                `;
                
                chatMessages.appendChild(suggestionsDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Also show macro-categories for broader options
                setTimeout(() => {
                    addMessage('Oppure, scegli una macro-categoria:', 'bot');
                    setTimeout(() => {
                        showMacroCategories();
                    }, 500);
                }, 1000);
            } else {
                // Normal category match with category-specific tone
                const context = category.context;
                const categoryKey = category.id;
                let responseText = '';

                // Category-specific consultant tone
                if (categoryKey.includes('gaming') || categoryKey.includes('elite-gaming')) {
                    responseText = `Ottima scelta per il gaming! 🔥 Ho analizzato le specifiche tecniche per te. Latenza, DPI, FPS e compatibilità sono i fattori chiave. Ecco i prodotti top per la tua configurazione:`;
                } else if (categoryKey.includes('moda') || categoryKey.includes('cinema')) {
                    responseText = `Perfetto! Ho selezionato i migliori prodotti per il tuo stile. Tessuto, vestibilità e design iconico sono i criteri che ho considerato. Ecco le scelte migliori per te:`;
                } else if (categoryKey.includes('cucina') || categoryKey.includes('elettrodomestici')) {
                    responseText = `Ottimo! Come consulente di cucina, ho valutato funzionalità, materiali e rapporto qualità-prezzo. Ecco le soluzioni migliori per la tua cucina:`;
                } else if (categoryKey.includes('tech') || categoryKey.includes('smartphone')) {
                    responseText = `Ottima scelta! Ho analizzato le specifiche tecniche e le prestazioni. Processore, RAM, storage e batteria sono i fattori chiave. Ecco i prodotti top per le tue esigenze:`;
                } else {
                    responseText = `Ho trovato prodotti nella categoria ${category.name}. Come consulente, ho selezionato le migliori opzioni per te.`;
                    
                    if (context === 'budget') {
                        responseText += ' Ecco alcune opzioni economiche:';
                    } else if (context === 'best') {
                        responseText += ' Ecco i migliori prodotti:';
                    } else {
                        responseText += ' Ecco alcuni prodotti:';
                    }
                }
                
                addMessage(responseText, 'bot');
                
                // Apply dynamic color theme based on category
                applyBotTheme(categoryKey);
                
                // Load products from JSON
                try {
                    const categoryFile = category.url.replace('index.html', '').replace('/', '');
                    const response = await fetch(`product-catalogs/${categoryFile}.json`);
                    if (response.ok) {
                        const products = await response.json();
                        // Apply smart sorting with context
                        const sortedProducts = sortProducts(products, categoryFile, context);
                        // Show first 5 products
                        const productsToShow = sortedProducts.slice(0, 5);
                        productsToShow.forEach(product => {
                            addProductCard(product);
                        });
                        
                        // Start abandonment timer after showing products
                        startAbandonmentTimer();
                        
                        // Add budget filters
                        setTimeout(() => {
                            addBudgetFilters(categoryFile);
                            
                            // Add link to see all products
                            setTimeout(() => {
                                addCategoryLink(category);
                                
                                // Show related categories suggestions
                                const categoryKey = Object.keys(categoryKeywords).find(key => categoryKeywords[key].url === category.url);
                                if (categoryKey && relatedCategories[categoryKey]) {
                                    setTimeout(() => {
                                        addRelatedCategoriesSuggestions(categoryKey);
                                    }, 1000);
                                }
                            }, 500);
                        }, 500);
                    } else {
                        addCategoryLink(category);
                    }
                } catch (error) {
                    console.error('Error loading products:', error);
                    addCategoryLink(category);
                }
            }
        } else {
            addMessage('Non ho capito. Prova con parole come "friggitrice", "cuffie gaming", "smartwatch", o usa i pulsanti qui sotto.', 'bot');
            setTimeout(() => {
                showMacroCategories();
            }, 500);
        }
    }, 500);
}

// Add message to chat
function addMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add proactive message with notification
function addProactiveMessage(text) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot proactive';
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add loading indicator
function addLoadingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message bot loading';
    loadingDiv.id = 'loading-indicator';
    loadingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div> Sto cercando le migliori opzioni per te...';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove loading indicator
function removeLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

// Add category link
function addCategoryLink(category) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages || !category) return;
    
    const linkDiv = document.createElement('div');
    linkDiv.className = 'chat-message bot';
    linkDiv.innerHTML = `<a href="${category.url}" class="category-link" target="_blank" rel="noopener noreferrer">👉 Vedi tutti i prodotti ${category.name}</a>`;
    chatMessages.appendChild(linkDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add product card to chat
function addProductCard(product) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages || !product) return;
    
    const productDiv = document.createElement('div');
    productDiv.className = 'product-card';
    
    let specsHTML = '';
    if (product.specifications) {
        const specs = Object.entries(product.specifications)
            .filter(([key, value]) => value && value.trim() !== '')
            .slice(0, 3)
            .map(([key, value]) => `<div class="spec-item"><strong>${key}:</strong> ${value}</div>`)
            .join('');
        specsHTML = `<div class="product-specs">${specs}</div>`;
    }
    
    // Add expert advice if available
    let adviceHTML = '';
    if (product.perche_consigliata) {
        adviceHTML = `<div class="product-advice">💡 ${product.perche_consigliata}</div>`;
    }
    
    productDiv.innerHTML = `
        <div class="product-name">${product.name}</div>
        ${product.description ? `<div class="product-desc">${product.description}</div>` : ''}
        ${specsHTML}
        ${adviceHTML}
        <a href="${product.link}" class="product-link" target="_blank" rel="noopener noreferrer">🛒 Vedi su Amazon</a>
    `;
    
    chatMessages.appendChild(productDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add related categories suggestions
function addRelatedCategoriesSuggestions(categoryKey) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages || !relatedCategories[categoryKey]) return;
    
    const related = relatedCategories[categoryKey];
    if (related.length === 0) return;
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'related-suggestions';
    
    const relatedNames = related.map(key => categoryKeywords[key].name).join(', ');
    suggestionsDiv.innerHTML = `
        <div class="suggestions-text">Potresti essere interessato anche a: ${relatedNames}</div>
        <div class="suggestions-buttons">
            ${related.map(key => `
                <button class="suggestion-btn" onclick="selectCategoryFromButton('${key}')">
                    ${categoryKeywords[key].name}
                </button>
            `).join('')}
        </div>
    `;
    
    chatMessages.appendChild(suggestionsDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add budget filters
function addBudgetFilters(categoryFile) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const filtersDiv = document.createElement('div');
    filtersDiv.className = 'budget-filters';
    
    filtersDiv.innerHTML = `
        <div class="filters-text">Filtra per fascia di prezzo:</div>
        <div class="filters-buttons">
            <button class="filter-btn" onclick="filterByBudget('${categoryFile}', 'low')">€ Economico</button>
            <button class="filter-btn" onclick="filterByBudget('${categoryFile}', 'medium')">€€ Fascia Media</button>
            <button class="filter-btn" onclick="filterByBudget('${categoryFile}', 'high')">€€€ Premium</button>
        </div>
    `;
    
    chatMessages.appendChild(filtersDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Filter products by budget
async function filterByBudget(categoryFile, budgetRange) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    try {
        const response = await fetch(`product-catalogs/${categoryFile}.json`);
        if (response.ok) {
            const products = await response.json();
            let filteredProducts = [];
            
            // Use qualitative price ranges
            const rangeText = budgetRange === 'low' ? '€ (Economico)' : budgetRange === 'medium' ? '€€ (Fascia Media)' : '€€€ (Premium)';
            addMessage(`Filtro: ${rangeText}`, 'user');
            
            // Filter by qualitative price range (fascia_prezzo field if available)
            // For now, show random products as placeholder
            // In a real implementation, we would filter by fascia_prezzo field
            filteredProducts = products.slice(0, 3);
            
            setTimeout(() => {
                addMessage(`Ecco alcuni prodotti nella fascia selezionata:`, 'bot');
                filteredProducts.forEach(product => {
                    addProductCard(product);
                });
                
                // Add disclaimer
                addPriceDisclaimer();
            }, 500);
        }
    } catch (error) {
        console.error('Error filtering products:', error);
        addMessage('Errore nel filtraggio dei prodotti.', 'bot');
    }
}

// Add price disclaimer
function addPriceDisclaimer() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const disclaimerDiv = document.createElement('div');
    disclaimerDiv.className = 'price-disclaimer';
    disclaimerDiv.innerHTML = '⚠️ I prezzi e la disponibilità dei prodotti sono soggetti a variazioni in tempo reale. I prezzi indicati su Amazon al momento dell\'acquisto saranno quelli definitivi.';
    
    chatMessages.appendChild(disclaimerDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Smart product sorting
function sortProducts(products, categoryFile, context = null) {
    // Seasonal categories that should show seasonal products first
    const seasonalCategories = {
        'mare-spiaggia': ['mare', 'spiaggia', 'estate', 'sole', 'costume', 'telo', 'ombrellone'],
        'outdoor-camping': ['campeggio', 'tenda', 'estate', 'barbecue', 'trekking'],
        'cucina-elettrodomestici': ['aria', 'calda', 'condizionatore', 'ventilatore']
    };
    
    const currentMonth = new Date().getMonth(); // 0-11
    const isSummer = currentMonth >= 5 && currentMonth <= 8; // June-September
    
    // If context is 'best', prioritize products with more reviews
    if (context === 'best') {
        return products.sort((a, b) => {
            const aReviews = parseInt(a.reviews) || 0;
            const bReviews = parseInt(b.reviews) || 0;
            return bReviews - aReviews;
        });
    }
    
    // If context is 'budget', prioritize products with lower level (principiante)
    if (context === 'budget') {
        return products.sort((a, b) => {
            const levelOrder = { 'principiante': 0, 'intermedio': 1, 'professionista': 2 };
            const aLevel = levelOrder[a.livello] || 1;
            const bLevel = levelOrder[b.livello] || 1;
            return aLevel - bLevel;
        });
    }
    
    // If it's summer and this is a seasonal category, prioritize seasonal products
    if (isSummer && seasonalCategories[categoryFile]) {
        const seasonalKeywords = seasonalCategories[categoryFile];
        return products.sort((a, b) => {
            const aHasSeasonal = seasonalKeywords.some(kw => 
                a.name.toLowerCase().includes(kw) || 
                (a.description && a.description.toLowerCase().includes(kw))
            );
            const bHasSeasonal = seasonalKeywords.some(kw => 
                b.name.toLowerCase().includes(kw) || 
                (b.description && b.description.toLowerCase().includes(kw))
            );
            return bHasSeasonal - aHasSeasonal;
        });
    }
    
    // Otherwise, sort by reviews if available
    return products.sort((a, b) => {
        const aReviews = parseInt(a.reviews) || 0;
        const bReviews = parseInt(b.reviews) || 0;
        return bReviews - aReviews;
    });
}

// Select category from button
function selectCategoryFromButton(categoryKey) {
    const category = categoryKeywords[categoryKey];
    if (category) {
        addMessage(`Hai selezionato: ${category.name}`, 'user');
        
        // Reset abandonment timer on user interaction
        resetAbandonmentTimer();
        
        setTimeout(() => {
            addMessage(`Perfetto! Ecco i prodotti ${category.name}.`, 'bot');
            setTimeout(() => {
                addCategoryLink(category);
            }, 500);
        }, 500);
    }
}

// Handle Enter key
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Initialize proactive message system
document.addEventListener('DOMContentLoaded', function() {
    // Start page-level proactive message after 5-10 seconds
    setTimeout(() => {
        startPageProactiveMessage();
    }, 5000);
    
    // Add scroll detection
    window.addEventListener('scroll', detectScroll);
    
    // Add click outside to close proactive bubble
    document.addEventListener('click', function(event) {
        if (proactiveBubble && !proactiveBubble.contains(event.target)) {
            closeProactiveBubble(event);
        }
    });
});

// Add event listener for Enter key
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', handleKeyPress);
    }
});
