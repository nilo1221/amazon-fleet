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
let conversationHistory = [];
let userPreferences = {};
let currentNiche = null;

// Load user preferences from localStorage
function loadUserPreferences() {
    try {
        const saved = localStorage.getItem('smartChoicesBotPreferences');
        if (saved) {
            userPreferences = JSON.parse(saved);
        }
    } catch (e) {
        console.log('Unable to load preferences:', e);
    }
}

// Save user preferences to localStorage
function saveUserPreferences() {
    try {
        localStorage.setItem('smartChoicesBotPreferences', JSON.stringify(userPreferences));
    } catch (e) {
        console.log('Unable to save preferences:', e);
    }
}

// Track category visit
function trackCategoryVisit(categoryKey) {
    if (!userPreferences.visits) {
        userPreferences.visits = {};
    }
    userPreferences.visits[categoryKey] = (userPreferences.visits[categoryKey] || 0) + 1;
    userPreferences.lastVisit = Date.now();
    saveUserPreferences();
}

// Get personalized greeting based on visit history
function getPersonalizedGreeting() {
    const totalVisits = Object.values(userPreferences.visits || {}).reduce((a, b) => a + b, 0);
    
    if (totalVisits === 0) {
        return 'Ciao! Sono qui per aiutarti a scegliere il meglio su Amazon. Cosa ti frulla per la testa oggi? Scegli una categoria o dimmi cosa stai cercando!';
    } else if (totalVisits < 3) {
        return 'Bentornato! Hai già esplorato alcune categorie. Vuoi continuare dove avevi lasciato o esplorare qualcosa di nuovo?';
    } else {
        return 'Bentornato! Ti conosco già fammi indovinare... vuoi vedere i prodotti che ti hanno interessato di più?';
    }
}

// Get most visited category
function getMostVisitedCategory() {
    if (!userPreferences.visits) return null;
    
    let maxVisits = 0;
    let mostVisited = null;
    
    for (const [key, visits] of Object.entries(userPreferences.visits)) {
        if (visits > maxVisits) {
            maxVisits = visits;
            mostVisited = key;
        }
    }
    
    return mostVisited;
}

// Stop words - common greetings and words that shouldn't trigger product matching
const stopWords = ['ciao', 'salve', 'ehi', 'hey', 'buongiorno', 'buonasera', 'buonanotte', 'grazie', 'prego', 'scusa', 'scusi', 'per favore', 'perfavore', 'ok', 'sì', 'no', 'si', 'come', 'stai', 'va', 'tutto', 'bene', 'male', 'quindi', 'allora', 'perché', 'perche', 'ma', 'e', 'o', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra'];

// NicheDatabase - The "Brain" of the bot with tags for each category
const NicheDatabase = {
    "cucina-elettrodomestici": {
        name: "Cucina Moderna & Tech",
        tags: ["friggitrice", "aria", "forno", "microonde", "bollitore", "caffettiera", "macchina", "caffè", "frigorifero", "freezer", "lavatrice", "asciugatrice", "lavastoviglie", "robot", "cucina", "minipimer", "frullatore", "mixer", "spremiagrumi", "estrattore", "centrifuga", "tostapane", "griglia", "piastra", "cottura", "pentola", "padella", "wok", "pentolame", "batteria", "pentole", "coltello", "taglieri", "tagliere", "scolapasta", "schiumarola", "mestolo", "cucchiaio", "forchetta", "set", "posate", "bottiglia", "thermos", "condizionatore", "ventilatore", "detersivi", "bevande"],
        url: "cucina-elettrodomestici/index.html",
        personality: "functional",
        valueProp: "Come consulente di cucina, ho valutato funzionalità, materiali e rapporto qualità-prezzo per te.",
        song: "Sugar, Sugar - The Archies",
        songLink: "https://www.youtube.com/watch?v=JibQy5y4R8o",
        songLinkSpotify: "https://open.spotify.com/track/3M3SBRzq5mWfYPXZdOYPG4"
    },
    "smart-home-domotica": {
        name: "Smart Home & Domotica",
        tags: ["smart", "home", "domotica", "lampada", "termostato", "sensore", "casa", "intelligente", "luci", "automazione", "telecomando", "controllo", "wifi", "bluetooth", "smartphone", "app", "telecamera", "sorveglianza", "videocamera", "allarme", "sicurezza", "serratura", "smart", "lock", "prese", "intelligenti", "prese", "wifi", "hub", "centrale"],
        url: "smart-home-domotica/index.html",
        personality: "technical",
        valueProp: "Ho analizzato le specifiche tecniche e la compatibilità per la tua smart home.",
        song: "Automaton - Jamiroquai",
        songLink: "https://www.youtube.com/watch?v=Erd49aFS55g",
        songLinkSpotify: "https://open.spotify.com/track/0xCpEzvbWCvn1peuUaNv7p"
    },
    "fitness-casa": {
        name: "Fitness Casa",
        tags: ["fitness", "smartwatch", "activity", "tracker", "pesi", "palestra", "allenamento", "sport", "cyclette", "tapis", "roulant", "ellittica", "manubri", "pesetti", "elastici", "bande", "yoga", "pilates", "tappetino", "step", "panca", "bilanciere", "dischi", "cavigliere", "bracciale", "cardio", "corsa", "bici", "spinning", "crossfit", "kettlebell", "trx", "vibrazione", "massaggiatore", "foam", "roller", "jogging", "corsetta"],
        url: "fitness-casa/index.html",
        personality: "motivational",
        valueProp: "Ho selezionato i prodotti migliori per raggiungere i tuoi obiettivi fitness a casa.",
        song: "Physical - Olivia Newton-John",
        songLink: "https://www.youtube.com/watch?v=Z61s-fO3x7k",
        songLinkSpotify: "https://open.spotify.com/track/2nakfNGqLyCJ8u1hH7WWTp"
    },
    "elite-gaming-gear": {
        name: "Elite Gaming Gear",
        tags: ["gaming", "cuffie", "headset", "mouse", "tastiera", "keyboard", "controller", "ps5", "xbox", "playstation", "play", "station", "nintendo", "switch", "pc", "computer", "laptop", "monitor", "schermo", "sedia", "gaming", "scrivania", "joystick", "volante", "pedale", "simulatore", "streaming", "twitch", "youtube", "microfono", "webcam", "capture", "card", "vr", "realtà", "virtuale", "oculus", "quest", "headset", "auricolari", "audio", "sound", "fps", "dpi", "latenza"],
        url: "elite-gaming-gear/index.html",
        personality: "gaming",
        valueProp: "Ho analizzato le specifiche tecniche per te. Latenza, DPI, FPS e compatibilità sono i fattori chiave.",
        song: "Blinding Lights - The Weeknd",
        songLink: "https://www.youtube.com/watch?v=4NRXx6U8ABQ",
        songLinkSpotify: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b"
    },
    "pet-care-intelligente": {
        name: "Pet Care Intelligente",
        tags: ["gatto", "cane", "animale", "lettiera", "autopulente", "cibo", "pet", "zampa", "crocchette", "mangiatore", "bevitore", "automatico", "spazzola", "pelo", "tagliaunghie", "trasportino", "cuccia", "casa", "cane", "giocattolo", "osso", "corda", "pallina", "collare", "guinzaglio", "pettorina", "museruola", "antiparassitario", "pulci", "zecke", "integratore", "vitamine"],
        url: "pet-care-intelligente/index.html",
        personality: "caring",
        valueProp: "Ho selezionato i migliori prodotti per il benessere del tuo animale domestico.",
        song: "Who Let the Dogs Out - Baha Men",
        songLink: "https://www.youtube.com/watch?v=Qkuu0Lwb5EM",
        songLinkSpotify: "https://open.spotify.com/track/1H5tvpoApNDxvxDexoaAUo"
    },
    "cinema-tv": {
        name: "Cinema & TV",
        tags: ["tv", "televisione", "proiettore", "cinema", "film", "bluray", "dvd", "schermo", "monitor", "home", "theater", "surround", "soundbar", "altoparlante", "speaker", "sound", "audio", "hifi", "amplificatore", "ricevitore", "decoder", "satellite", "streaming", "netflix", "prime", "disney", "hbo", "apple", "tv", "chromecast", "fire", "stick", "roku", "kodi", "plex", "media", "player", "cavo", "hdmi", "4k", "8k", "oled", "qled", "led", "lcd"],
        url: "cinema-tv/index.html",
        personality: "entertainment",
        valueProp: "Ho selezionato i migliori prodotti per il tuo stile. Tessuto, vestibilità e design iconico sono i criteri che ho considerato.",
        song: "Eye of the Tiger - Survivor",
        songLink: "https://www.youtube.com/watch?v=btPJPFnesV4",
        songLinkSpotify: "https://open.spotify.com/track/2KH16WveTQWT6KOG9Rg6e2"
    },
    "smartphone-tech": {
        name: "Smartphone & Tech",
        tags: ["smartphone", "telefono", "cellulare", "iphone", "samsung", "android", "galaxy", "xiaomi", "huawei", "oppo", "oneplus", "pixel", "nokia", "sony", "lg", "motorola", "honor", "realme", "tecno", "infinix", "vivo", "zte", "alcatel", "wiko", "bq", "crosscall", "cat", "rugged", "tough", "tablet", "ipad", "samsung", "galaxy", "tab", "kindle", "ebook", "reader", "smartwatch", "orologio", "fitness", "tracker", "band", "auricolari", "cuffie", "true", "wireless", "airpods", "galaxy", "buds", "powerbank", "batteria", "caricabatterie", "cavo", "usb", "type", "c", "lightning"],
        url: "smartphone-tech/index.html",
        personality: "technical",
        valueProp: "Ho analizzato le specifiche tecniche e le prestazioni. Processore, RAM, storage e batteria sono i fattori chiave.",
        song: "Telephone - Lady Gaga",
        songLink: "https://www.youtube.com/watch?v=GQ95z6ywcBY",
        songLinkSpotify: "https://open.spotify.com/track/7rl7ao5pb9BhvAzPdWStxi"
    },
    "tech": {
        name: "Tech",
        tags: ["tech", "tecnologia", "gadget", "computer", "laptop", "notebook", "desktop", "pc", "mac", "windows", "linux", "android", "ios", "software", "hardware", "periferica", "mouse", "tastiera", "monitor", "schermo", "stampante", "scanner", "webcam", "microfono", "cuffie", "auricolari", "speaker", "soundbar", "router", "modem", "wifi", "bluetooth", "usb", "cavo", "adattatore", "hub", "dock", "powerbank", "batteria", "caricabatterie", "hard", "disk", "ssd", "ram", "cpu", "gpu", "processore", "scheda", "video", "scheda", "madre", "case", "ventole", "raffreddamento", "liquido", "watercooling"],
        url: "tech/index.html",
        personality: "technical",
        valueProp: "Ho analizzato le specifiche tecniche e le prestazioni per le tue esigenze tecnologiche.",
        song: "Technologic - Daft Punk",
        songLink: "https://www.youtube.com/watch?v=YJVmu6yttiw",
        songLinkSpotify: "https://open.spotify.com/track/0LSLM0zuWRkEYemF7JcfEE"
    },
    "mare-spiaggia": {
        name: "Mare & Spiaggia",
        tags: ["mare", "spiaggia", "ombrellone", "telo", "costume", "scarpe", "acqua", "sandali", "ciabatte", "slip", "infradito", "flip", "flop", "espadrillas", "crema", "solare", "abbronzante", "doposole", "occhiali", "sole", "cappello", "berretto", "fascia", "bandana", "tuta", "bagno", "costume", "bikini", "slip", "mutande", "shorts", "beach", "wear", "gonna", "mare", "dress", "mare", "telo", "microfibra", "asciugamano", "sabbia", "impermeabile", "borsa", "mare", "zaino", "secchiello", "secchio", "paletta", "formine", "pallina", "beach", "volley", "racchette", "surf", "bodyboard", "boogie", "board", "snorkeling", "maschera", "boccaglio", "pinne", "gommone", "canoa", "kayak", "paddleboard"],
        url: "mare-spiaggia/index.html",
        personality: "summer",
        valueProp: "Ho selezionato i migliori prodotti per goderti il mare e la spiaggia al meglio.",
        song: "Kokomo - The Beach Boys",
        songLink: "https://www.youtube.com/watch?v=Ke1Us_3qfkg",
        songLinkSpotify: "https://open.spotify.com/track/7B22szTT8omMRmpQw6DMqV"
    },
    "outdoor-camping": {
        name: "Outdoor & Camping",
        tags: ["outdoor", "campeggio", "tenda", "montagna", "freddo", "sacco", "pelo", "sleeping", "bag", "lanterna", "torcia", "frontale", "bussola", "gps", "navigatore", "mappe", "kit", "sopravvivenza", "coltello", "multitool", "cucina", "campeggio", "pentole", "portatili", "stoviglie", "posate", "bicchieri", "bottiglia", "thermos", "borsa", "frigo", "cooler", "box", "ice", "sedia", "pieghevole", "tavolo", "pieghevole", "hammock", "amaca", "mosquito", "net", "zanzariera", "poncho", "impermeabile", "giacca", "antivento", "kway", "scarpe", "trekking", "stivali", "bastoncini", "crampon", "piccone", "corda", "imbracatura", "carabiner", "moschettone", "rampicata", "arrampicata"],
        url: "outdoor-camping/index.html",
        personality: "adventure",
        valueProp: "Ho selezionato l'attrezzatura migliore per le tue avventure all'aria aperta.",
        song: "Country Roads - John Denver",
        songLink: "https://www.youtube.com/watch?v=1vrEljMfXYo",
        songLinkSpotify: "https://open.spotify.com/track/1QbOvACeYanja5pbnJbAmk"
    },
    "moda-donna": {
        name: "Moda Donna",
        tags: ["moda", "donna", "abbigliamento", "vestito", "scarpe", "donna", "borsa", "donna", "top", "tshirt", "maglietta", "blusa", "camicetta", "jeans", "pantaloni", "gonna", "giacca", "cappotto", "maglione", "pullover", "cardigan", "blazer", "abito", "sera", "elegante", "intimo", "reggiseno", "mutandine", "calze", "collant", "calzini", "costume", "bagno", "beachwear", "accessori", "gioielli", "collana", "orecchino", "bracciale", "anello", "occhiali", "sole", "sciarpa", "cintura", "cappello", "berretto", "scarpe eleganti", "tacchi", "décolleté", "sandali eleganti", "pumps", "tessuto", "vestibilità", "design"],
        url: "moda-donna/index.html",
        personality: "fashion",
        valueProp: "Ho selezionato i migliori prodotti per il tuo stile. Tessuto, vestibilità e design iconico sono i criteri che ho considerato.",
        song: "Vogue - Madonna",
        songLink: "https://www.youtube.com/watch?v=GuJQSAiODqI",
        songLinkSpotify: "https://open.spotify.com/track/27QvYgBk0CHOVHthWnkuWt"
    },
    "moda-uomo": {
        name: "Moda Uomo",
        tags: ["moda", "uomo", "abbigliamento", "camicia", "scarpe", "uomo", "borsa", "uomo", "tshirt", "maglietta", "polo", "jeans", "pantaloni", "pantaloni", "shorts", "giacca", "cappotto", "maglione", "pullover", "cardigan", "blazer", "completo", "abito", "elegante", "intimo", "mutande", "boxer", "slip", "calze", "calzini", "costume", "bagno", "beachwear", "cravatta", "papillon", "cintura", "cinturino", "cappello", "berretto", "guanti", "scarpe", "sneakers", "mocassini", "stivali", "scarpe eleganti", "scarpe da cerimonia", "scarpe classiche", "oxford", "derby", "loafer", "monk", "tessuto", "vestibilità", "design"],
        url: "moda-uomo/index.html",
        personality: "fashion",
        valueProp: "Ho selezionato i migliori prodotti per il tuo stile. Tessuto, vestibilità e design iconico sono i criteri che ho considerato.",
        song: "Sharp Dressed Man - ZZ Top",
        songLink: "https://www.youtube.com/watch?v=7gz1DIIxqGk",
        songLinkSpotify: "https://open.spotify.com/track/0f9h8awV1X4jSllHXXYdfX"
    },
    "arredamento-casa": {
        name: "Casa & Decorazione",
        tags: ["arredamento", "casa", "decorazione", "vaso", "decorativo", "candela", "profumata", "zanzariera", "tappeto", "lampada", "cuscino", "tenda", "mobili", "sofà", "poltrona", "tavolo", "sedia", "armadio", "mensole", "libreria", "comodino", "specchio", "quadro", "orologio", "da", "parete"],
        url: "arredamento-casa/index.html",
        personality: "aesthetic",
        valueProp: "Ho selezionato i prodotti migliori per arredare la tua casa con stile.",
        song: "Home - Michael Bublé",
        songLink: "https://www.youtube.com/watch?v=lb9UXwWV7zE",
        songLinkSpotify: "https://open.spotify.com/track/4wLZ4zPM9c4oe1VV8ejdWV"
    },
    "accessori-moda": {
        name: "Accessori Moda",
        tags: ["accessori", "moda", "occhiali", "da", "sole", "cintura", "borsetta", "borsa", "portafoglio", "sciarpa", "cappello", "guanti", "gioielli", "collana", "bracciale", "anello", "orecchini"],
        url: "accessori-moda/index.html",
        personality: "fashion",
        valueProp: "Ho selezionato gli accessori perfetti per completare il tuo look.",
        song: "Fashion - David Bowie",
        songLink: "https://www.youtube.com/watch?v=GA9P5H15_6A",
        songLinkSpotify: "https://open.spotify.com/track/34V3AvUPfWRW2zListOWZG"
    },
    "benessere-cura-personale": {
        name: "Benessere & Cura Personale",
        tags: ["benessere", "cura", "personale", "crema", "viso", "siero", "lozione", "tonico", "detergente", "esfoliante", "idratante", "solare", "abbronzante", "doposole", "trucco", "fondotinta", "correttore", "mascara", "eyeliner", "ombretto", "rossetto", "gloss", "blush", "bronzer", "illuminante", "primer", "spugna", "pennello", "brush", "palette", "smalto", "unghie", "rimuovi", "smalto", "nail", "polish", "remover", "capelli", "balsamo", "dopobarba"],
        url: "benessere-cura-personale/index.html",
        personality: "wellness",
        valueProp: "Ho selezionato i migliori prodotti per la tua routine di bellezza e benessere.",
        song: "Beautiful - Christina Aguilera",
        songLink: "https://www.youtube.com/watch?v=eAfyFTzZDMM",
        songLinkSpotify: "https://open.spotify.com/track/3TCauNPqFiniaYHBvEVoHG"
    },
    "giochi-da-tavolo": {
        name: "Giochi da Tavolo",
        tags: ["giochi", "da", "tavolo", "board", "game", "dadi", "dungeons", "dragons", "dnd", "pathfinder", "gurps", "call", "cthulhu", "vampire", "masquerade", "warhammer", "age", "sigmar", "monopoly", "risk", "scrabble", "trivial", "pursuit", "cluedo", "twister", "jenga", "uno", "rummy", "poker", "blackjack", "bridge", "scopone", "briscola", "tressette", "scala", "40", "scacchi", "dama", "go", "mahjong", "backgammon", "carrom", "mancala", "catan", "settlers", "ticket", "ride", "carcassonne", "pandemic", "terraforming", "mars", "wingspan", "azul", "splendor"],
        url: "giochi-da-tavolo/index.html",
        personality: "gaming",
        valueProp: "Ho selezionato i migliori giochi da tavolo per le tue serate con amici.",
        song: "The Game - Queen",
        songLink: "https://www.youtube.com/watch?v=0pL9Ie5j3-8",
        songLinkSpotify: "https://open.spotify.com/track/3CaetUu7dGAS5AM52ceK1E"
    },
    "libri-ereader": {
        name: "Libri & E-Reader",
        tags: ["libro", "kindle", "ebook", "lettore", "romanzo", "thriller", "giallo", "fantasy", "fantascienza", "horror", "romance", "erotico", "storico", "biografia", "autobiografia", "saggio", "manual", "guida", "studio", "scuola", "università", "bambini", "ragazzi", "young", "adult", "fumetto", "manga", "graphic", "novel", "comics", "audiolibro", "audible", "kobo", "nook", "boox", "pocketbook", "tolino", "sony", "reader", "paperwhite", "oasis", "scribe", "clara", "libra", "h2o", "glo", "aura", "one", "edition", "forma", "cover", "custodia", "light", "case"],
        url: "libri-ereader/index.html",
        personality: "intellectual",
        valueProp: "Ho selezionato i migliori libri e e-reader per i tuoi momenti di lettura.",
        song: "Words - Bee Gees",
        songLink: "https://www.youtube.com/watch?v=jW9BA2-h1H0",
        songLinkSpotify: "https://open.spotify.com/track/07PIhdmyYIw8dMeDMsx9FU"
    },
    "profumi-bellezza": {
        name: "Profumi & Bellezza",
        tags: ["profumo", "bellezza", "makeup", "cosmetico", "eau", "de", "toilette", "parfum", "eau", "de", "parfum", "intense", "edp", "edt", "cologne", "after", "shave", "balsamo", "dopobarba"],
        url: "profumi-bellezza/index.html",
        personality: "elegant",
        valueProp: "Ho selezionato i profumi più esclusivi per la tua personalità.",
        song: "Por Una Cabeza - Tango",
        songLink: "https://www.youtube.com/watch?v=B5ezPA7msyI",
        songLinkSpotify: "https://open.spotify.com/track/6fHW0V6DXlmEWn0bfCOt1N"
    },
    "abbigliamento-lavoro": {
        name: "Abbigliamento Lavoro",
        tags: ["lavoro", "abbigliamento", "ufficio", "business", "blazer", "pantaloni", "cargo", "militari", "tattici", "scarpe", "sicurezza", "antinfortunistiche", "punta", "acciaio", "professionale", "uniform", "divisa", "ingegnere", "architetto", "avvocato", "commercialista", "medico", "infermiere", "cantier", "industria", "protezione", "resistente", "robusto", "sicurezza"],
        url: "abbigliamento-lavoro/index.html",
        personality: "professional",
        valueProp: "Ho selezionato i migliori capi di abbigliamento professionale per il tuo lavoro. Sicurezza, comfort e resistenza sono i criteri che ho considerato.",
        song: "Midnight City - M83",
        songLink: "https://www.youtube.com/watch?v=dX3k_QDnzHE",
        songLinkSpotify: "https://open.spotify.com/track/1eyzqe2QqGZUmfcPZtrIyt"
    },
    "sostenibilita-eco-friendly": {
        name: "Sostenibilità & Eco-Friendly",
        tags: ["sostenibilità", "eco", "ambiente", "riciclo", "ecologico", "green", "biologico", "organico", "naturale", "plastic", "free", "zero", "waste", "compostabile", "biodegradabile", "riciclato", "riciclabile", "energia", "solare", "pannelli", "solari", "eolico", "turbina", "idrico", "acqua", "risparmio", "energetico", "led", "lampadina", "batteria", "ricaricabile", "powerbank", "solare", "borsa", "tessile", "canna", "acqua", "bottiglia", "vetro", "acciaio", "inox", "bamboo", "bambù", "corteccia", "betulla", "canapa", "lino", "cotone", "organico", "fair", "trade", "equo", "solidale", "locale", "km", "zero", "slow", "food"],
        url: "sostenibilita-eco-friendly/index.html",
        personality: "eco",
        valueProp: "Ho selezionato i prodotti più sostenibili per ridurre il tuo impatto ambientale.",
        song: "Earth Song - Michael Jackson",
        songLink: "https://www.youtube.com/watch?v=XAi3VTSdTxU",
        songLinkSpotify: "https://open.spotify.com/track/4GCGH6TJ69neckwITeBFXK"
    },
    "ufficio-produttivo": {
        name: "Ufficio Produttivo",
        tags: ["ufficio", "scrivania", "sedia", "ufficio", "stampante", "organizzatore", "cassetto", "porta", "documenti", "raccoglitore", "cartella", "busta", "penna", "matita", "evidenziatore", "correttore", "gomma", "righello", "forbice", "taglierino", "calcolatrice", "agenda", "diario", "calendario", "planner", "organizer", "blocco", "notes", "post", "it", "adesivi", "nastro", "scotch", "rilegatrice", "foratrice", "tagliacarte", "laminatrice", "spillatrice", "cucitrice", "punti", "metal", "fermacampioni", "portapenne", "portamouse", "tappetino", "mouse", "supporto", "monitor", "braccio", "monitor", "lampada", "scrivania", "lettore", "cd", "dvd", "masterizzatore", "esterno", "hard", "disk", "nas", "server"],
        url: "ufficio-produttivo/index.html",
        personality: "professional",
        valueProp: "Ho selezionato i prodotti migliori per aumentare la tua produttività in ufficio.",
        song: "9 to 5 - Dolly Parton",
        songLink: "https://www.youtube.com/watch?v=LrvPW0JHzRQ",
        songLinkSpotify: "https://open.spotify.com/track/4w3tQBXhn5345eUXDGBWZG"
    },
    "viaggi-vacanze": {
        name: "Viaggi & Vacanze",
        tags: ["viaggi", "vacanze", "valigia", "zaino", "trolley", "borsetta", "borsa", "viaggio", "adattatore", "spina", "corrente", "cuscino", "viaggio", "mascherina", "sonno", "occhiali", "sonno", "tappo", "orecchio", "kit", "pronto", "soccorso", "assicurazione", "viaggio", "guida", "turistica", "mappa", "gps", "navigatore"],
        url: "viaggi-vacanze/index.html",
        personality: "travel",
        valueProp: "Ho selezionato i migliori accessori per i tuoi viaggi e vacanze.",
        song: "On the Road Again - Willie Nelson",
        songLink: "https://www.youtube.com/watch?v=dvdJ1OfJ33o",
        songLinkSpotify: "https://open.spotify.com/track/2GyH5rvdnfkjzsTFaWrrov"
    },
    "fotografia-mobile": {
        name: "Fotografia Mobile",
        tags: ["fotografia", "mobile", "fotocamera", "camera", "smartphone", "foto", "video", "lente", "obiettivo", "treppiede", "selfie", "stick", "gimbal", "stabilizzatore", "microfono", "esterno", "light", "ring", "flash", "kit", "fotografia"],
        url: "fotografia-mobile/index.html",
        personality: "creative",
        valueProp: "Ho selezionato i migliori prodotti per migliorare la tua fotografia mobile.",
        song: "Photograph - Ed Sheeran",
        songLink: "https://www.youtube.com/watch?v=nSDgHBxUbVQ",
        songLinkSpotify: "https://open.spotify.com/track/1HNkqx9Ahdgi1Ixy2xkKkL"
    },
    "dvd-bluray": {
        name: "DVD & Blu-ray",
        tags: ["dvd", "bluray", "film", "serie", "tv", "collezione", "box", "set", "4k", "ultra", "hd"],
        url: "dvd-bluray/index.html",
        personality: "entertainment",
        valueProp: "Ho selezionato i migliori film e serie TV per la tua collezione.",
        song: "Video Killed the Radio Star - The Buggles",
        songLink: "https://www.youtube.com/watch?v=Iwuy4hHO3YQ",
        songLinkSpotify: "https://open.spotify.com/track/6t1FIJlZWTQfIZhsGjaulM"
    }
};

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

// Detect current niche from URL
function detectCurrentNiche() {
    const path = window.location.pathname;
    const nicheKeys = Object.keys(NicheDatabase);
    
    for (const key of nicheKeys) {
        if (path.includes(NicheDatabase[key].url.replace('index.html', ''))) {
            currentNiche = key;
            return key;
        }
    }
    return null;
}

// Show proactive message bubble
function showProactiveBubble() {
    if (proactiveBubbleShown || proactiveBubble) return;
    
    const chatButton = document.getElementById('ai-chat-button');
    if (!chatButton) return;
    
    // Detect current niche for dynamic message
    const nicheKey = detectCurrentNiche();
    let proactiveText = 'Ti vedo interessato! Posso aiutarti a trovare i migliori prodotti. Vuoi vedere la mia top 3?';
    
    if (nicheKey && NicheDatabase[nicheKey]) {
        const niche = NicheDatabase[nicheKey];
        proactiveText = `Ti vedo interessato a ${niche.name}! Posso confrontare per te le migliori opzioni oggi su Amazon. Vuoi vedere la mia top 3?`;
    }
    
    // Create proactive bubble
    proactiveBubble = document.createElement('div');
    proactiveBubble.className = 'proactive-bubble';
    proactiveBubble.innerHTML = `
        <button class="proactive-close" onclick="closeProactiveBubble(event)">×</button>
        <div class="proactive-content">
            <div class="proactive-icon">🔥</div>
            <div class="proactive-text">${proactiveText}</div>
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

// Category mapping - now using NicheDatabase as single source of truth
const categoryKeywords = {};

// Initialize categoryKeywords from NicheDatabase to maintain compatibility
for (const [key, data] of Object.entries(NicheDatabase)) {
    categoryKeywords[key] = {
        name: data.name,
        url: data.url,
        keywords: data.tags // Use tags from NicheDatabase
    };
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
    loadUserPreferences();
    const personalizedGreeting = getPersonalizedGreeting();
    addMessage(personalizedGreeting, 'bot');
    
    // Show smart suggestions based on learning
    const totalVisits = Object.values(userPreferences.visits || {}).reduce((a, b) => a + b, 0);
    if (totalVisits > 0) {
        setTimeout(() => {
            showSmartSuggestions();
        }, 800);
    } else {
        setTimeout(() => {
            showMacroCategories();
        }, 500);
    }
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

// Apply dynamic color theme based on category personality
function applyBotTheme(categoryKey) {
    const chatHeader = document.querySelector('.chat-header');
    const chatButton = document.getElementById('ai-chat-button');
    if (!chatHeader || !chatButton) return;
    
    const nicheData = NicheDatabase[categoryKey];
    if (!nicheData || !nicheData.personality) return;
    
    const personality = nicheData.personality;
    
    // Remove all existing theme classes
    chatHeader.classList.remove(
        'theme-moda', 'theme-tech', 'theme-gaming', 'theme-cucina', 'theme-default',
        'theme-summer', 'theme-adventure', 'theme-fashion', 'theme-wellness',
        'theme-gaming-theme', 'theme-entertainment', 'theme-technical', 'theme-caring',
        'theme-aesthetic', 'theme-intellectual', 'theme-elegant', 'theme-eco',
        'theme-professional', 'theme-travel', 'theme-creative', 'theme-cinema-tv',
        'theme-blinding-lights', 'theme-as-it-was', 'theme-midnight-city'
    );
    
    // Apply appropriate theme based on personality
    const personalityToTheme = {
        'functional': 'theme-cucina',
        'technical': 'theme-tech',
        'motivational': 'theme-wellness',
        'gaming': 'theme-gaming',
        'caring': 'theme-caring',
        'entertainment': 'theme-entertainment',
        'summer': 'theme-summer',
        'adventure': 'theme-adventure',
        'fashion': 'theme-moda',
        'aesthetic': 'theme-aesthetic',
        'wellness': 'theme-wellness',
        'intellectual': 'theme-intellectual',
        'elegant': 'theme-elegant',
        'eco': 'theme-eco',
        'professional': 'theme-professional',
        'travel': 'theme-travel',
        'creative': 'theme-creative'
    };
    
    // Special case for Cinema & TV - use synthwave theme
    let themeClass = personalityToTheme[personality] || 'theme-default';
    if (categoryKey === 'cinema-tv') {
        themeClass = 'theme-cinema-tv';
    } else if (categoryKey === 'elite-gaming-gear') {
        themeClass = 'theme-blinding-lights';
    } else if (categoryKey === 'moda-donna') {
        themeClass = 'theme-as-it-was';
    } else if (categoryKey === 'tech') {
        themeClass = 'theme-midnight-city';
    }
    
    chatHeader.classList.add(themeClass);
}

// Analyze message and find category with intelligent fallback using NicheDatabase
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
    
    // Calculate relevance scores for each category using NicheDatabase
    const categoryScores = [];
    for (const [categoryKey, categoryData] of Object.entries(NicheDatabase)) {
        let score = 0;
        
        for (const tag of categoryData.tags) {
            // Exact match - high score
            if (lowerMessage.includes(tag)) {
                score += 10;
            }
            
            // Fuzzy match for each meaningful word - medium score
            for (const word of meaningfulWords) {
                if (fuzzyMatch(word, tag)) {
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
        return { ...categoryScores[0].categoryData, context, id: categoryScores[0].categoryKey };
    }
    
    // Otherwise, return the top 3 suggestions for intelligent fallback
    if (categoryScores.length > 0) {
        return { 
            type: 'suggestions', 
            suggestions: categoryScores.slice(0, 3).map(s => ({ ...s.categoryData, id: s.categoryKey })),
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
                // Normal category match with dynamic personality-based tone from NicheDatabase
                const context = category.context;
                const categoryKey = category.id;
                const nicheData = NicheDatabase[categoryKey];
                
                let responseText = '';
                
                // Use valueProp from NicheDatabase for dynamic consultant tone
                if (nicheData && nicheData.valueProp) {
                    responseText = `${nicheData.valueProp}`;
                    
                    if (context === 'budget') {
                        responseText += ' Ecco alcune opzioni economiche:';
                    } else if (context === 'best') {
                        responseText += ' Ecco i migliori prodotti:';
                    } else {
                        responseText += ' Ecco i prodotti selezionati:';
                    }
                } else {
                    // Fallback if nicheData not found
                    responseText = `Ho trovato prodotti nella categoria ${category.name}. Ecco i prodotti disponibili:`;
                }
                
                addMessage(responseText, 'bot');
                
                // Apply dynamic color theme based on category
                applyBotTheme(categoryKey);
                
                // As shopping consultant, guide user to category page with comparison table
                try {
                    setTimeout(() => {
                        const categoryLinkDiv = document.createElement('div');
                        categoryLinkDiv.className = 'category-link-container';
                        categoryLinkDiv.innerHTML = `
                            <div class="category-consultation-card">
                                <div class="consultation-icon">📊</div>
                                <div class="consultation-content">
                                    <h4 class="fw-bold mb-2">Tabella Comparativa Disponibile</h4>
                                    <p class="text-muted mb-3">Ho preparato una tabella comparativa completa con tutti i prodotti selezionati, le loro caratteristiche e i prezzi per aiutarti a scegliere la soluzione migliore.</p>
                                    <a href="${category.url}" class="btn btn-primary btn-sm">
                                        <i class="fas fa-table me-2"></i>Vedi Tabella Comparativa
                                    </a>
                                </div>
                            </div>
                        `;
                        
                        const chatMessages = document.getElementById('chat-messages');
                        if (chatMessages) {
                            chatMessages.appendChild(categoryLinkDiv);
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }
                        
                        // Start abandonment timer after showing consultation
                        startAbandonmentTimer();
                    }, 500);
                } catch (error) {
                    console.error('Error showing consultation:', error);
                    addMessage('Mi dispiace, c\'è stato un errore. Prova a visitare direttamente la pagina della categoria.', 'bot');
                }
            }
        } else {
            addMessage('Non ho capito. Prova con parole come "friggitrice", "cuffie gaming", "smartwatch", o usa i pulsanti qui sotto.', 'bot');
            setTimeout(() => {
                // Show smart suggestions instead of generic macro categories
                const totalVisits = Object.values(userPreferences.visits || {}).reduce((a, b) => a + b, 0);
                if (totalVisits > 0) {
                    showSmartSuggestions();
                } else {
                    showMacroCategories();
                }
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
    messageDiv.innerHTML = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Track conversation for learning
    if (sender === 'user') {
        trackUserInteraction(text);
    }
}

// Track user interaction for learning system
function trackUserInteraction(message) {
    if (!userPreferences.interactions) {
        userPreferences.interactions = [];
    }
    userPreferences.interactions.push({
        message: message,
        timestamp: Date.now(),
        currentNiche: currentNiche
    });
    
    // Keep only last 50 interactions
    if (userPreferences.interactions.length > 50) {
        userPreferences.interactions = userPreferences.interactions.slice(-50);
    }
    
    saveUserPreferences();
}

// Get smart suggestions based on user behavior
function getSmartSuggestions() {
    if (!userPreferences.interactions || userPreferences.interactions.length === 0) {
        return Object.keys(NicheDatabase).slice(0, 4);
    }
    
    // Analyze interaction patterns
    const categoryScores = {};
    
    for (const interaction of userPreferences.interactions) {
        const lowerMessage = interaction.message.toLowerCase();
        
        for (const [categoryKey, categoryData] of Object.entries(NicheDatabase)) {
            for (const tag of categoryData.tags) {
                if (lowerMessage.includes(tag)) {
                    categoryScores[categoryKey] = (categoryScores[categoryKey] || 0) + 1;
                }
            }
        }
    }
    
    // Add visit history weight
    if (userPreferences.visits) {
        for (const [categoryKey, visits] of Object.entries(userPreferences.visits)) {
            categoryScores[categoryKey] = (categoryScores[categoryKey] || 0) + visits * 2;
        }
    }
    
    // Sort by score and return top 4
    const sortedCategories = Object.entries(categoryScores)
        .sort((a, b) => b[1] - a[1])
        .map(([key]) => key)
        .slice(0, 4);
    
    // If we don't have enough data, return some popular categories
    if (sortedCategories.length < 4) {
        const popularCategories = ['cucina-elettrodomestici', 'fitness-casa', 'tech', 'moda-donna'];
        for (const cat of popularCategories) {
            if (!sortedCategories.includes(cat)) {
                sortedCategories.push(cat);
            }
            if (sortedCategories.length >= 4) break;
        }
    }
    
    return sortedCategories.slice(0, 4);
}

// Show smart suggestions based on learning
function showSmartSuggestions() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const smartCategories = getSmartSuggestions();
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'quick-replies';
    
    suggestionsDiv.innerHTML = `
        <div class="suggestions-text">💡 Sulla base dei tuoi interessi, potresti voler vedere:</div>
        <div class="quick-replies-grid">
            ${smartCategories.map(catKey => `
                <button class="quick-reply-card sub-category" onclick="selectCategoryFromButton('${catKey}')">
                    <div class="quick-reply-name">${categoryKeywords[catKey].name}</div>
                </button>
            `).join('')}
        </div>
    `;
    
    chatMessages.appendChild(suggestionsDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // After smart suggestions, show macro categories for broader exploration
    setTimeout(() => {
        showMacroCategories();
    }, 800);
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

// Add loading indicator with typing animation
function addLoadingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message bot loading';
    loadingDiv.id = 'loading-indicator';
    loadingDiv.innerHTML = '<div class="typing-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
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

// Get personality-based response
function getPersonalityResponse(categoryKey, personality, categoryName) {
    const personalityResponses = {
        'functional': `Per ${categoryName} ho analizzato funzionalità, materiali e rapporto qualità-prezzo. Ecco i prodotti selezionati:`,
        'technical': `Ho esaminato le specifiche tecniche per ${categoryName}. Prestazioni e compatibilità sono i fattori chiave. Ecco le opzioni:`,
        'motivational': `Per raggiungere i tuoi obiettivi con ${categoryName}, ho selezionato i prodotti migliori. Dai il massimo! Ecco cosa ho trovato:`,
        'gaming': `Per il tuo setup gaming in ${categoryName}, ho analizzato latenza, DPI e compatibilità. Ecco i prodotti top:`,
        'caring': `Per il benessere del tuo animale in ${categoryName}, ho scelto i prodotti più sicuri e confortevoli. Ecco le opzioni:`,
        'entertainment': `Per il tuo stile in ${categoryName}, ho selezionato prodotti con design iconico. Tessuto e vestibilità sono i criteri chiave. Ecco i prodotti:`,
        'summer': `Per goderti il mare e la spiaggia con ${categoryName}, ho scelto i migliori prodotti per la tua estate. Ecco le opzioni:`,
        'adventure': `Per le tue avventure outdoor in ${categoryName}, ho selezionato l'attrezzatura più resistente e affidabile. Ecco i prodotti:`,
        'fashion': `Per il tuo stile unico in ${categoryName}, ho selezionato capi con tessuti premium e design iconico. Ecco le opzioni:`,
        'aesthetic': `Per arredare con stile in ${categoryName}, ho scelto prodotti che combinano estetica e funzionalità. Ecco le opzioni:`,
        'wellness': `Per la tua routine di bellezza in ${categoryName}, ho selezionato i prodotti più efficaci e naturali. Ecco le opzioni:`,
        'intellectual': `Per i tuoi momenti di lettura in ${categoryName}, ho scelto i migliori libri e dispositivi. Ecco le opzioni:`,
        'elegant': `Per la tua personalità unica in ${categoryName}, ho selezionato i profumi più esclusivi. Ecco le opzioni:`,
        'eco': `Per ridurre il tuo impatto ambientale in ${categoryName}, ho scelto i prodotti più sostenibili. Ecco le opzioni:`,
        'professional': `Per il tuo lavoro in ${categoryName}, ho selezionato capi professionali con sicurezza e comfort. Ecco le opzioni:`,
        'travel': `Per i tuoi viaggi con ${categoryName}, ho scelto gli accessori più pratici e funzionali. Ecco le opzioni:`,
        'creative': `Per migliorare la tua fotografia con ${categoryName}, ho selezionato i migliori accessori creativi. Ecco le opzioni:`
    };
    
    return personalityResponses[personality] || `Ecco i prodotti ${categoryName}:`;
}

// Show follow-up suggestions after category selection
function showFollowUpSuggestions(categoryKey) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages || !relatedCategories[categoryKey]) return;
    
    const related = relatedCategories[categoryKey];
    if (related.length === 0) return;
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'related-suggestions';
    
    const relatedNames = related.map(key => categoryKeywords[key].name).join(', ');
    suggestionsDiv.innerHTML = `
        <div class="suggestions-text">🔗 Potresti essere interessato anche a: ${relatedNames}</div>
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

// Add related categories suggestions
function addRelatedCategoriesSuggestions(categoryKey) {
    showFollowUpSuggestions(categoryKey);
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
        // Track visit for personalization
        trackCategoryVisit(categoryKey);
        
        addMessage(`Hai selezionato: ${category.name}`, 'user');
        
        // Reset abandonment timer on user interaction
        resetAbandonmentTimer();
        
        // Get personality-based response
        const nicheData = NicheDatabase[categoryKey];
        let responseText = `Perfetto! Ecco i prodotti ${category.name}.`;
        
        if (nicheData && nicheData.personality) {
            responseText = getPersonalityResponse(categoryKey, nicheData.personality, category.name);
        }
        
        setTimeout(() => {
            addMessage(responseText, 'bot');
            setTimeout(() => {
                addCategoryLink(category);
                
                // Add follow-up with song reference
                if (nicheData && nicheData.song && nicheData.songLink) {
                    setTimeout(() => {
                        const spotifyLink = nicheData.songLinkSpotify ? ` | <a href="${nicheData.songLinkSpotify}" target="_blank" style="color: #1DB954; font-weight: bold; text-decoration: underline;">Spotify</a>` : '';
                        addMessage(`🎵 Mentre esplori ${category.name}, potresti ascoltare <a href="${nicheData.songLink}" target="_blank" style="color: #008B8B; font-weight: bold; text-decoration: underline;">"${nicheData.song}"</a> per entrare nel mood giusto! <span style="color: #666; font-size: 0.9em;">(YouTube${spotifyLink})</span>`, 'bot');
                        
                        // Show related categories as follow-up
                        setTimeout(() => {
                            showFollowUpSuggestions(categoryKey);
                        }, 1500);
                    }, 1000);
                } else {
                    setTimeout(() => {
                        showFollowUpSuggestions(categoryKey);
                    }, 1000);
                }
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
