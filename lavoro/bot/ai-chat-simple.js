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
let urgencyTimerStarted = false;

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

// Get category name from context
function getCategoryNameFromContext() {
    const context = getContesto();
    
    // Map context codes to category names
    const contextNames = {
        'homepage': 'Smart Choices Guide',
        'mare': 'Mare & Spiaggia',
        'pc': 'Elite Gaming Gear',
        'fitness': 'Fitness Casa',
        'smart-home': 'Smart Home & Domotica',
        'pet-care': 'Pet Care Intelligente',
        'parrucchiere-barbiere': 'Parrucchiere & Barbiere',
        'abbigliamento-serie-tv-film': 'Cinema & TV',
        'abbigliamento-ciclismo': 'Abbigliamento Ciclismo',
        'biciclette-mobilita': 'Biciclette & Mobilità',
        'smartphone': 'Smartphone & Tech',
        'tech': 'Tech',
        'moda-donna': 'Moda Donna',
        'moda-uomo': 'Moda Uomo',
        'arredamento': 'Arredamento Casa',
        'accessori': 'Accessori Moda',
        'benessere': 'Benessere & Cura Personale',
        'cucina': 'Cucina Moderna & Tech',
        'libri': 'Libri & E-Reader',
        'outdoor': 'Outdoor & Camping',
        'ufficio': 'Ufficio Produttivo',
        'viaggi': 'Viaggi & Vacanze',
        'sport-estivi': 'Sport Estivi',
        'giochi': 'Giochi da Tavolo',
        'profumi': 'Profumi & Bellezza',
        'sostenibilita': 'Sostenibilità & Eco-Friendly',
        'dvd': 'DVD & Blu-ray'
    };
    
    return contextNames[context] || 'questa categoria';
}

// Get personalized greeting based on visit history
function getPersonalizedGreeting() {
    const totalVisits = Object.values(userPreferences.visits || {}).reduce((a, b) => a + b, 0);
    const categoryName = getCategoryNameFromContext();
    
    if (totalVisits === 0) {
        return `Ciao! Sei qui per approfondire ${categoryName}? Posso mostrarti il kit che stanno scegliendo tutti oggi. Vuoi dare un'occhiata?`;
    } else if (totalVisits < 3) {
        return `Ciao bentornato! Sei qui per approfondire ${categoryName}? Posso mostrarti il kit che stanno scegliendo tutti oggi. Vuoi dare un'occhiata?`;
    } else {
        return `Ciao bentornato! Sei qui per approfondire ${categoryName}? Posso mostrarti il kit che stanno scegliendo tutti oggi. Vuoi dare un'occhiata?`;
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
        url: "/cucina-elettrodomestici/index.html",
        personality: "functional",
        valueProp: "Come consulente di cucina, ho valutato funzionalità, materiali e rapporto qualità-prezzo per te.",
        song: "Sugar, Sugar - The Archies",
        songLinkSpotify: "https://open.spotify.com/track/3M3SBRzq5mWfYPXZdOYPG4",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
        topProducts: [
            {
                name: "COSORI Turbo Blaze Friggitrice ad Aria 6L",
                description: "Friggitrice ad aria professionale con tecnologia rapida",
                icon: "fa-fire-burner",
                link: "https://www.amazon.it/dp/B0F9TRBWPD?th=1&linkCode=ll2&tag=l0c39-21&linkId=e4eba26a535c983c4e07840efa208f84&ref=_as_li_ss_tl"
            },
            {
                name: "Ninja Foodi Dual Zone AF300EU",
                description: "Doppia zona di cottura per pasti completi",
                icon: "fa-fire-burner",
                link: "https://www.amazon.it/Ninja-Friggitrice-Antiaderente-Croccantezza-AF300EU/dp/B08GC1QZ5W?ie=UTF8&hvadid=722187028311&hvpos=&hvexid=&hvnetw=g&hvrand=5851704191900702564&hvpone=&hvptwo=&hvqmt=&hvdev=c&adgrpid=170593183899&hvdvcmdl=&hvlocint=&hvlocphy=9190900&hvtargid=dsa-1599129282449&hydadcr=&mcid=&gad_source=1&th=1&linkCode=ll2&tag=l0c39-21&linkId=249b95bd5fc47a61d3403272535940ac&ref=_as_li_ss_tl"
            },
            {
                name: "Bosch MultiTalent 8 Robot Multifunzione",
                description: "Robot da cucina completo con 8 accessori",
                icon: "fa-blender",
                link: "https://www.amazon.it/Bosch-MC812M844-Cucina-Multifunzione-Alluminio/dp/B07HPRQJL1?th=1&linkCode=ll2&tag=l0c39-21&linkId=2acaa6b678bac18747a2cdac25e75848&ref=_as_li_ss_tl"
            },
            {
                name: "DeLonghi Magnifica S Macchina per il Caffè",
                description: "Macchina per caffè automatica con macinino",
                icon: "fa-mug-hot",
                link: "https://www.amazon.it/DeLonghi-ECAM-22-110-B-superautomatica-cappuccinatore/dp/B00400OMU0?th=1&linkCode=ll2&tag=l0c39-21&linkId=c4c63beb2b7eb467e265380304081467&ref=_as_li_ss_tl"
            },
            {
                name: "KASANOVA Evolution 6-Piece Cookware Set",
                description: "Set pentole antiaderenti professionali",
                icon: "fa-utensils",
                link: "https://www.amazon.it/dp/B0DB5F1TSC?th=1&linkCode=ll2&tag=l0c39-21&linkId=6bb20f44951b8ba0c585777641d7a799&ref=_as_li_ss_tl"
            },
            {
                name: "Condizionatore Portatile 3-in-1",
                description: "Raffreddamento, ventilazione e umidificazione",
                icon: "fa-snowflake",
                link: "https://www.amazon.it/dp/B0D3PP64JS?ie=UTF8&psc=1&pd_rd_plhdr=t&aref=HPJ8v9XaEK&linkCode=ll2&tag=l0c39-21&linkId=9f8aac727b8af31fe8eb8ae08e38ba65&ref=_as_li_ss_tl"
            },
            {
                name: "PRESTIGE Set di 9 Padelle Antiaderenti",
                description: "Set completo da 9 padelle a induzione, resistenti ai graffi",
                icon: "fa-utensils",
                link: "https://www.amazon.it/Prestige-antiaderenti-resistenti-induzione-impugnare/dp/B0C49TJKJ5?th=1&linkCode=ll2&tag=l0c39-21&linkId=1334e0ede6f625ea3ce52d4ef9a163fb&ref=_as_li_ss_tl"
            },
            {
                name: "MAGEFESA Jordan Set di Padelle",
                description: "Set di padelle in acciaio vetrificato, design elegante",
                icon: "fa-utensils",
                link: "https://www.amazon.it/Magefesa-Jordan-padelle-Acciaio-vetrificato/dp/B07DP4L6NT?&linkCode=ll2&tag=l0c39-21&linkId=6d538f31dbc2d0705703cc94dcc2ebd4&ref=_as_li_ss_tl"
            },
            {
                name: "SET 3 PADELLE WOOD&STONE (Excelsa)",
                description: "Set di 3 padelle con finitura legno-pietra elegante",
                icon: "fa-utensils",
                link: "https://www.amazon.it/SET-3-PADELLE-WOOD-STONE/dp/B07S1VRNG6?&linkCode=ll2&tag=l0c39-21&linkId=73df7c30a54f668e5084df48bb9712eb&ref=_as_li_ss_tl"
            }
        ]
    },
    "smart-home-domotica": {
        name: "Smart Home & Domotica",
        tags: ["smart", "home", "domotica", "lampada", "termostato", "sensore", "casa", "intelligente", "luci", "automazione", "telecomando", "controllo", "wifi", "bluetooth", "smartphone", "app", "telecamera", "sorveglianza", "videocamera", "allarme", "sicurezza", "serratura", "smart", "lock", "prese", "intelligenti", "prese", "wifi", "hub", "centrale"],
        url: "/smart-home-domotica/index.html",
        personality: "technical",
        valueProp: "Ho analizzato le specifiche tecniche e la compatibilità per la tua smart home.",
        song: "Automaton - Jamiroquai",
        songLinkSpotify: "https://open.spotify.com/track/0xCpEzvbWCvn1peuUaNv7p",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
        topProducts: [
            {
                name: "ANRAN 5MP FHD Videocamera Sorveglianza Esterno",
                description: "Videocamera di sorveglianza senza fili con pannello solare e visione notturna a colori",
                icon: "fa-video",
                link: "https://www.amazon.it/ANRAN-Videocamera-Sorveglianza-Intelligenti-Compatibilit%C3%A0/dp/B0C7VGQ3YW?dib=eyJ2IjoiMSJ9.1DUtNeB5dKg1MFjjbicm4Genxymh0OwyTHq69p2-7PfVknts_EmuJFw7YYROSpVfhV3S5EgXnLLAn4ayZTIg-0UzszZuVWVg31XBuHtxCfBaVlBBc0CZjPIy_JBk0i_E2SVgPIN7eeklQFVuq0qqhe_E8NjWtz-wHMrzMUDgK5f10TDTQ8wJT7kvh2I6X_Zc3pCwV6sNC6phPDbcKM3fKy-w7IEfdJH0nYHhmiRrg_VMM8zPndZha4pmNN-fIrcawVITY_wK_2gxDw9InrfANhZZuCZZ3gCN7-1wwPsVZ3g.m4DTWSrxaL_8GV7uyixPw-WjHQcOH3a7OzWzmJ1cOq4&dib_tag=se&keywords=telecamera%2Bsicurezza%2Bpannello%2Bsolare&qid=1779588652&sr=8-1-spons&aref=zZdHsKk8ct&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=l0c39-21&linkId=fd1c29cb470679df5eeedc3e8aa0f0ff&ref=_as_li_ss_tl"
            }
        ]
    },
    "fitness-casa": {
        name: "Fitness Casa",
        tags: ["fitness", "smartwatch", "activity", "tracker", "pesi", "palestra", "allenamento", "sport", "cyclette", "tapis", "roulant", "ellittica", "manubri", "pesetti", "elastici", "bande", "yoga", "pilates", "tappetino", "step", "panca", "bilanciere", "dischi", "cavigliere", "bracciale", "cardio", "corsa", "bici", "spinning", "crossfit", "kettlebell", "trx", "vibrazione", "massaggiatore", "foam", "roller", "jogging", "corsetta"],
        url: "/fitness-casa/index.html",
        personality: "motivational",
        valueProp: "Ho selezionato i prodotti migliori per raggiungere i tuoi obiettivi fitness a casa.",
        song: "Physical - Olivia Newton-John",
        songLinkSpotify: "https://open.spotify.com/track/2nakfNGqLyCJ8u1hH7WWTp",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "elite-gaming-gear": {
        name: "Elite Gaming Gear",
        tags: ["gaming", "cuffie", "headset", "mouse", "tastiera", "keyboard", "controller", "ps5", "xbox", "playstation", "play", "station", "nintendo", "switch", "pc", "computer", "laptop", "monitor", "schermo", "sedia", "gaming", "scrivania", "joystick", "volante", "pedale", "simulatore", "streaming", "twitch", "youtube", "microfono", "webcam", "capture", "card", "vr", "realtà", "virtuale", "oculus", "quest", "headset", "auricolari", "audio", "sound", "fps", "dpi", "latenza"],
        url: "/elite-gaming-gear/index.html",
        personality: "gaming",
        valueProp: "Ho analizzato le specifiche tecniche per te. Latenza, DPI, FPS e compatibilità sono i fattori chiave.",
        song: "Blinding Lights - The Weeknd",
        songLinkSpotify: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
        topProducts: [
            {
                name: "EMPIRE GAMING - Armor RF800 Kit Wireless Tastiera e Mouse QWERTY(Italiana-Layout)",
                description: "Set completo wireless per gaming con tastiera e mouse RGB, tappetino incluso",
                icon: "fa-keyboard",
                link: "https://www.amazon.it/EMPIRE-GAMING-Ricaricabile-Italiana-Layout-Mac-Blanco/dp/B0C1GW8GLV?dib=eyJ2IjoiMSJ9.H41HIU37m21CAZuT26axiA1EVEWY2bXYhStFJR3IDqBv0aeUCnBMJj0OkxJH0eloLNz42CrbMX7PKpHa9ZCRX8Iciue4SVdKof1U0YEZ8L6CCcEmdqVrV41vYfiW2zsA5vncJTKgHBVJ7HdzKEwMri8BgPFhaCYAMKFEUeahS4nGmVZOaFnjUWQltgrByPhu_wzjwT2D-6KnpVkB_8x3lB3kFrtno6-nOXw4TBHygB9JtAfFK0s03ajebceBiEuKZu8qfYAVJ9JnPu-rlIiW6oalD5DKgpAL00tkXB3seZw.XV8nzpkNKqBh3_gQSmb6q43E7-yTom-r3TLm30rMuGg&dib_tag=se&keywords=set%2Bda%2Bpc&qid=1779677707&sr=8-12&th=1&linkCode=ll2&tag=l0c39-21&linkId=946d21e02eb0c1a8012cd3fb9af3a85e&ref=_as_li_ss_tl"
            },
            {
                name: "Empire Gaming - Armor RF800 Wireless Gaming Tastatur und Maus QWERTZ (Deutsche Layout)",
                description: "Set wireless gaming con tastiera tedesca QWERTZ, mouse ergonomico e tappetino",
                icon: "fa-keyboard",
                link: "https://www.amazon.it/EMPIRE-GAMING-Layout-Kabellose-Ergonomische/dp/B0BN8ZHQ95?dib=eyJ2IjoiMSJ9.H41HIU37m21CAZuT26axiA1EVEWY2bXYhStFJR3IDqBv0aeUCnBMJj0OkxJH0eloLNz42CrbMX7PKpHa9ZCRX8Iciue4SVdKof1U0YEZ8L6CCcEmdqVrV41vYfiW2zsA5vncJTKgHBVJ7HdzKEwMri8BgPFhaCYAMKFEUeahS4nGmVZOaFnjUWQltgrByPhu_wzjwT2D-6KnpVkB_8x3lB3kFrtno6-nOXw4TBHygB9JtAfFK0s03ajebceBiEuKZu8qfYAVJ9JnPu-rlIiW6oalD5DKgpAL00tkXB3seZw.XV8nzpkNKqBh3_gQSmb6q43E7-yTom-r3TLm30rMuGg&dib_tag=se&keywords=set+da+pc&qid=1779677707&sr=8-22&linkCode=ll2&tag=l0c39-21&linkId=f005831de4564cf1e48104fd044e6041&ref=_as_li_ss_tl"
            },
            {
                name: "EMPIRE GAMING - Hellhounds PC Gaming Pack English",
                description: "Set gaming completo con tastiera, mouse e tappetino, software programmabile e illuminazione RGB",
                icon: "fa-keyboard",
                link: "https://www.amazon.it/EMPIRE-GAMING-Hellhounds-programmable-backlighting/dp/B07PFL1N1H?dib=eyJ2IjoiMSJ9.H41HIU37m21CAZuT26axiA1EVEWY2bXYhStFJR3IDqBv0aeUCnBMJj0OkxJH0eloLNz42CrbMX7PKpHa9ZCRX8Iciue4SVdKof1U0YEZ8L6CCcEmdqVrV41vYfiW2zsA5vncJTKgHBVJ7HdzKEwMri8BgPFhaCYAMKFEUeahS4nGmVZOaFnjUWQltgrByPhu_wzjwT2D-6KnpVkB_8x3lB3kFrtno6-nOXw4TBHygB9JtAfFK0s03ajebceBiEuKZu8qfYAVJ9JnPu-rlIiW6oalD5DKgpAL00tkXB3seZw.XV8nzpkNKqBh3_gQSmb6q43E7-yTom-r3TLm30rMuGg&dib_tag=se&keywords=set+da+pc&qid=1779677707&sr=8-56&linkCode=ll2&tag=l0c39-21&linkId=7017561edf10d81b7a5f10cc520ded52&ref=_as_li_ss_tl"
            }
        ]
    },
       "manga-anime": {
        name: "Manga & Anime",
        tags: ["manga", "anime", "fumetto", "giapponese", "one piece", "dragon ball", "naruto", "demon slayer", "kimetsu", "shonen", "shojo", "seinen", "josei", "kodomo", "gekiga", "manhwa", "manhua", "scanlation", "fansub", "cosplay", "otaku", "akiba", "tokyo", "ghibli", "studio", "kurosawa", "miyazaki", "tezuka", "oda", "kishimoto", "toriyama", "isayama", "gotouge", "horikoshi", "tabata", "kubo", "obata", "akatsuki", "attack on titan", "my hero academia", "black clover", "jujutsu kaisen", "chainsaw man", "spy x family", "tokyo revengers", "jujutsu kaisen", "hunter x hunter", "fullmetal alchemist", "death note", "bleach", "one punch man", "mob psycho 100", "tokyo ghoul", "sword art online", "fairy tail", "hunter x hunter", "dragon ball super", "boruto", "black clover", "my hero academia", "demon slayer", "one piece", "naruto", "dragon ball", "pokemon", "yugioh", "digimon", "sailor moon", "cardcaptor sakura", "naruto shippuden", "dragon ball z", "dragon ball gt", "dragon ball kai", "attack on titan", "aot", "mha", "bnha", "jjk", "csm", "sxf", "tr", "hxh", "fma", "fmab", "dn", "opm", "mp100", "tg", "sao", "ft", "mha", "bnha", "jjk", "csm", "sxf", "tr", "hxh", "fma", "fmab", "dn", "opm", "mp100", "tg", "sao", "ft", "shonen jump", "weekly shonen jump", "jump square", "shonen magazine", "shonen sunday", "v jump", "shonen gangan", "young jump", "big comic", "morning", "afternoon", "evening", "weekly young magazine", "weekly young jump", "bessatsu shonen magazine", "shonen ace", "shonen gangan", "coro coro", "pokemon adventures", "digimon adventure", "yugioh", "bakugan", "bayblade", "medabots", "zatch bell", "konjiki no gash bell", "shaman king", "yu yu hakusho", "flame of recca", "rurouni kenshin", "samurai x", "inuyasha", "ranma 1/2", "urusei yatsura", "maison ikkoku", "mermaid saga", "lum", "rumiko takahashi", "akira toriyama", "eiichiro oda", "masashi kishimoto", "kishimoto masashi", "tite kubo", "kubo tite", "hirohiko araki", "jojo", "jojo's bizarre adventure", "steel ball run", "stone ocean", "vento aureo", "diamond is unbreakable", "stardust crusaders", "phantom blood", "battle tendency", "jjba", "araki", "hirohiko", "kentaro miura", "berserk", "guts", "griffith", "casca", "eclipse", "fantasia", "midland", "kushan", "god hand", "apostle", "band of the hawk", "hawks", "struggler", "black swordsman", "conviction", "golden age", "fantasia arc", "claymore", "teresa", "clare", "priscilla", "rigaldo", "isley", "awakened being", "yoma", "organization", "noriko wakamoto"],
        url: "/manga-anime/index.html",
        personality: "enthusiastic",
        valueProp: "Ho selezionato i manga e anime più amati e iconici per te. Storie epiche, personaggi indimenticabili e arte straordinaria ti aspettano.",
        kindleLink: "https://www.amazon.it/kindle-dbs/ku/?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref=_as_li_ss_tl",
        song: "Gurenge - LiSA",
        songLinkSpotify: "https://open.spotify.com/track/23DbzwNJSLo7nkSWjODMvY",
        primaryColor: "#9400D3",
        accentColor: "#DC143C",
        secondaryColor: "#FF6600",
        topProducts: [
            {
                name: "One piece (Vol. 1)",
                description: "ONE PIECE è una delle opere più longeve e amate dai lettori di tutto il mondo",
                icon: "fa-book",
                link: "https://www.amazon.it/One-piece-1-Eiichiro-Oda/dp/8864201793?&linkCode=ll2&tag=l0c39-21&linkId=e72c284460a4ab716a6c562758b2c330&ref=_as_li_ss_tl"
            },
            {
                name: "Dragon Ball 1 (Dragon Ball Evergreen Edition) eBook",
                description: "DRAGON BALL, uno dei manga più celebri e amati di sempre",
                icon: "fa-tablet-alt",
                link: "https://www.amazon.it/Dragon-Ball-Evergreen-ebook/dp/B07M5HTBFL?&linkCode=ll2&tag=l0c39-21&linkId=b0f9292e84b16cf9298cb1026150d642&ref=_as_li_ss_tl"
            },
            {
                name: "Naruto 1 eBook",
                description: "Naruto è uno dei manga più influenti e amati di sempre",
                icon: "fa-tablet-alt",
                link: "https://www.amazon.it/Naruto-1-Masashi-Kishimoto-ebook/dp/B0BWCVY8PS?&linkCode=ll2&tag=l0c39-21&linkId=469bd1c492b998b84a0a2ca7915d22dc&ref=_as_li_ss_tl"
            },
            {
                name: "Fire Punch Complete Box",
                description: "Edizione completa della serie acclamata dalla critica di Tatsuki Fujimoto",
                icon: "fa-box",
                link: "https://www.amazon.it/Fire-punch-Complete-Tatsuki-Fujimoto/dp/8822626656?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=WSAAQSKTOWJ&dib=eyJ2IjoiMSJ9.R3TQEJ-TKD2eCa47iSUOUT0FZDxCgIdEWGSgLTMK9RcZ6Nf-gPEuaBgi0-bJSnKXcr48-ATkLYz_U-t5_xZczCx-pO3j2xbp5FDtKguSD061snnOeUoRSGIwsERaPtSRPsL7Z7VjHAsXUt5SlO-LFXhIRtpnpPrJRAWgGzM7az_mdqLvSvAInVM8l2bgcOYSKUetDzOd44thZPYYHh4WbS8k7rWCNhRutbVNrJuAtBw.xKmVT_y4Zjh4S2eOZSh_s1wzSu7AIc4z1zDe4BCIZxo&dib_tag=se&keywords=box&qid=1779861347&s=books&sprefix=box%2Cstripbooks%2C161&sr=1-2-ufe=app_do%3Aamzn1.fos.8a1562af-dabe-4f1d-8eb5-1ded1ace4ef7&linkCode=ll2&tag=l0c39-21&linkId=b9db34d67b703d5f2797b6c0c79a7b0a&ref=_as_li_ss_tl"
            },
            {
                name: "Suzume Complete Box",
                description: "Edizione completa del manga acclamato di Makoto Shinkai",
                icon: "fa-box",
                link: "https://www.amazon.it/Suzume-Complete-box-Makoto-Shinkai/dp/882264896X?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=WSAAQSKTOWJ&dib=eyJ2IjoiMSJ9.FwUc2l1f7JvDSyF0IpLxVXi-xEVohdrAkWozVq5tEBMZ6Nf-gPEuaBgi0-bJSnKXoRHJbk9Sq60N9y1ubzhHHGw43KxH8S9g_oZ8ripBw_z0zpmFutLCLV7NbvFM2OfVGGOT8Jk0-F1akLwjOeOQiLXQPIP076VzEdZyASG776CKadOEe9-51SPFEFUcSiqrSJwxjkORGjc5gjT36QtBHWjHuk4-DDRGgQPG7Tle4vc.f5WzoLFZvE4DkHMKzt18IEtTh7-kspFZamSufV8ReSw&dib_tag=se&keywords=box&qid=1779861402&s=books&sprefix=box%2Cstripbooks%2C161&sr=1-6-ufe=app_do%3Aamzn1.fos.8a1562af-dabe-4f1d-8eb5-1ded1ace4ef7&linkCode=ll2&tag=l0c39-21&linkId=a92b6706e6de73c53c15e8c3b9422571&ref=_as_li_ss_tl"
            },
            {
                name: "Tex 75. Box legno. Con shopper in tela, cartolina",
                description: "Edizione premium del fumetto western italiano in box legno",
                icon: "fa-box",
                link: "https://www.amazon.it/Tex-legno-shopper-tela-cartolina/dp/8869618862?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=WSAAQSKTOWJ&dib=eyJ2IjoiMSJ9.FwUc2l1f7JvDSyF0IpLxVXi-xEVohdrAkWozVq5tEBMZ6Nf-gPEuaBgi0-bJSnKXoRHJbk9Sq60N9y1ubzhHHGw43KxH8S9g_oZ8ripBw_z0zpmFutLCLV7NbvFM2OfVGGOT8Jk0-F1akLwjOeOQiLXQPIP076VzEdZyASG776CKadOEe9-51SPFEFUcSiqrSJwxjkORGjc5gjT36QtBHWjHuk4-DDRGgQPG7Tle4vc.f5WzoLFZvE4DkHMKzt18IEtTh7-kspFZamSufV8ReSw&dib_tag=se&keywords=box&qid=1779861402&s=books&sprefix=box%2Cstripbooks%2C161&sr=1-8-ufe=app_do%3Aamzn1.fos.8a1562af-dabe-4f1d-8eb5-1ded1ace4ef7&linkCode=ll2&tag=l0c39-21&linkId=1f8c36f87dbc7dbe6949b07e8214364b&ref=_as_li_ss_tl"
            },
            {
                name: "Demon Slayer - Kimetsu no yaiba 1: Digital Edition eBook",
                description: "Demon Slayer è una delle serie più amate dai lettori di ogni età",
                icon: "fa-tablet-alt",
                link: "https://www.amazon.it/Demon-Slayer-Kimetsu-yaiba-Digital-ebook/dp/B088Z1P21C?&linkCode=ll2&tag=l0c39-21&linkId=f8ad4b971ceeec377887c6e6da92d926&ref=_as_li_ss_tl"
            }
        ]
    },
    "musica-vinili": {
        name: "Musica & Vinili",
        tags: ["vinile", "vinili", "disco", "record", "giradischi", "turntable", "music", "musica", "audio", "hifi", "stereo", "amplificatore", "cuffie", "speaker", "altoparlante", "analogico", "analog", "lp", "ep", "single", "album", "collection", "collezione", "vinyl", "vinyls", "dj", "mixer", "crossfader", "beat", "rhythm", "jazz", "rock", "pop", "classical", "classica", "electronic", "elettronica", "hip hop", "rap", "reggae", "blues", "soul", "funk", "disco", "punk", "metal", "indie", "alternative", "folk", "country", "r&b", "rnb", "techno", "house", "trance", "ambient", "dub", "dubstep", "drum", "bass", "edm", "synth", "synthesizer", "keyboard", "piano", "guitar", "chitarra", "bass", "basso", "drums", "batteria", "vocals", "voce", "singer", "cantante", "band", "gruppo", "artist", "artista", "concert", "concerto", "live", "studio", "recording", "registrazione", "mastering", "mixing", "mixaggio", "production", "produzione", "sound", "suono", "quality", "qualità", "fidelity", "fedeltà", "warmth", "calore", "analog", "nostalgia", "retro", "vintage", "classic", "classico", "collectible", "da collezione", "rare", "raro", "limited", "limitato", "edition", "edizione", "box", "set", "collector", "collezionista", "audiophile", "audiofilo", "music lover", "amante della musica", "vinyl lover", "amante dei vinili", "record store", "negozio di dischi", "music store", "negozio di musica", "turntable", "giradischi", "tonearm", "braccio", "cartridge", "testina", "stylus", "puntina", "needle", "ago", "platter", "piatto", "motor", "motore", "belt", "cinghia", "direct drive", "azionamento diretto", "belt drive", "azionamento a cinghia", "speed", "velocità", "rpm", "33", "45", "78", "vinyl record", "disco in vinile", "lp record", "disco lp", "12 inch", "12 pollici", "7 inch", "7 pollici", "gatefold", "copertina apribile", "picture disc", "disco picture", "colored vinyl", "vinile colorato", "transparent vinyl", "vinile trasparente", "heavy vinyl", "vinile pesante", "180 gram", "200 gram", "audiophile vinyl", "vinile audiofilo", "master tape", "nastro master", "original recording", "registrazione originale", "remastered", "rimasterizzato", "reissue", "riedizione", "first press", "prima stampa", "original press", "stampa originale"],
        url: "/musica-vinili/index.html",
        personality: "creative",
        valueProp: "Ho selezionato i migliori giradischi e vinili per un'esperienza audio autentica e nostalgica.",
        song: "Bohemian Rhapsody - Queen",
        songLinkSpotify: "https://open.spotify.com/track/7tFiyTwD0nx5a1eklYtX2J",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref=_as_li_ss_tl",
        primaryColor: "#1a1a2e",
        accentColor: "#e94560",
        secondaryColor: "#16213e",
        topProducts: [
            {
                name: "Oasis - Complete Studio Album Collection (Gold Vinyl Box Set)",
                description: "Cofanetto completo degli album in studio degli Oasis in vinile oro",
                icon: "fa-compact-disc",
                link: "https://www.amazon.it/Complete-Studio-Collection-Amazon-Exclusive/dp/B0F99ZJ52F?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1K93EB4BTG8WC&dib=eyJ2IjoiMSJ9.C9GVKYRm83lJx9uzztSc3ygtd1JzfEuDNhxkR3_u1vuD-t3kdzfqHOj3ZokReYGfRfOEIO6dv0bSfYt_DPYk-dBk2ikg_tziCHOWDX-hgRFFp7OkGPIYmyzSDaeISgd1UFThXQNZuR3YB1t5VXjW5gxOQn6yL9_5FoKgnGsJILUguAVDWDpKUcSuzzfrVB6CPZGc9cXY9H2d6nYE09rvJFaS4UxOWtoniZN3l4t8mwy-wVYI0lYex3qLLbzyqr-D9vjLjx79uEgcSRydaMWZBxpgEscqj703IPmMtUen6GU.X5ujq0h5Kax9Af7hBNutpxroTLJMJ0R0eqHYbr_nVwc&dib_tag=se&keywords=set+vinili&qid=1779683180&sprefix=set+vinili%2Caps%2C131&sr=8-4&ufe=app_do%3Aamzn1.fos.fca66a76-6518-40f2-959f-2dca30e9c5d1&linkCode=ll2&tag=l0c39-21&linkId=14945c94044fd23f187315fd3cd6ad00&ref=_as_li_ss_tl"
            },
            {
                name: "Metallica - The Black Album (30Th Anniversary Ltd)",
                description: "Edizione 30° anniversario del Black Album dei Metallica in vinile",
                icon: "fa-bluetooth-b",
                link: "https://www.amazon.it/Black-Album-30Th-Anniversary-Libro/dp/B097NP5HXH?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1K93EB4BTG8WC&dib=eyJ2IjoiMSJ9.C9GVKYRm83lJx9uzztSc3ygtd1JzfEuDNhxkR3_u1vuD-t3kdzfqHOj3ZokReYGfRfOEIO6dv0bSfYt_DPYk-dBk2ikg_tziCHOWDX-hgRFFp7OkGPIYmyzSDaeISgd1UFThXQNZuR3YB1t5VXjW5gxOQn6yL9_5FoKgnGsJILUguAVDWDpKUcSuzzfrVB6CPZGc9cXY9H2d6nYE09rvJFaS4UxOWtoniZN3l4t8mwy-wVYI0lYex3qLLbzyqr-D9vjLjx79uEgcSRydaMWZBxpgEscqj703IPmMtUen6GU.X5ujq0h5Kax9Af7hBNutpxroTLJMJ0R0eqHYbr_nVwc&dib_tag=se&keywords=set+vinili&qid=1779683227&sprefix=set+vinili%2Caps%2C131&sr=8-9&ufe=app_do%3Aamzn1.fos.fca66a76-6518-40f2-959f-2dca30e9c5d1&linkCode=ll2&tag=l0c39-21&linkId=a091a665e57f1afbdd3aa256f99c69a3&ref=_as_li_ss_tl"
            },
            {
                name: "Pietra Da Massaggio 16Pcs SPA Hot Stone Set",
                description: "Kit pietre massaggio naturali basalto caldo per SPA",
                icon: "fa-spa",
                link: "https://www.amazon.it/Massaggio-Massage-Professionale-Naturali-Basalto/dp/B07KQCQ6Q1?&linkCode=ll2&tag=l0c39-21&linkId=4d4b3ae17b9dbd9d191bee219ffffc02&ref=_as_li_ss_tl"
            },
            {
                name: "Pantene Pro-V Lisci Effetto Seta Shampoo 3 in 1",
                description: "Shampoo 3 in 1 per capelli crespi e opachi, 6x300 ml",
                icon: "fa-bottle-droplet",
                link: "https://www.amazon.it/dp/B08F7C5XQS?aref=oH1CAlqNnZ&sp_csd=d2lkZ2V0TmFtZT1zcF9ocXBfc2hhcmVk&th=1&linkCode=ll2&tag=l0c39-21&linkId=b358d6404d44081d9d50fe256ec4f8dd&ref=_as_li_ss_tl"
            }
        ]
    },
 "pet-care-intelligente": {
        name: "Pet Care Intelligente",
        tags: ["gatto", "cane", "animale", "lettiera", "autopulente", "cibo", "pet", "zampa", "crocchette", "mangiatore", "bevitore", "automatico", "spazzola", "pelo", "tagliaunghie", "trasportino", "cuccia", "casa", "cane", "giocattolo", "osso", "corda", "pallina", "collare", "guinzaglio", "pettorina", "museruola", "antiparassitario", "pulci", "zecke", "integratore", "vitamine"],
        url: "/pet-care-intelligente/index.html",
        personality: "caring",
        valueProp: "Ho selezionato i migliori prodotti per il benessere del tuo animale domestico.",
        song: "Who Let the Dogs Out - Baha Men",
        songLinkSpotify: "https://open.spotify.com/track/1H5tvpoApNDxvxDexoaAUo",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
        topProducts: [
            {
                name: "Furbo Mini Videocamera + Pacchetto Sicurezza Casa",
                description: "Videocamera intelligente con visione notturna a colori e audio a due vie",
                icon: "fa-video",
                link: "https://www.amazon.it/Furbo-Videocamera-Pacchetto-Sicurezza-ABBONAMENTO/dp/B0CTKXQNPX?dib=eyJ2IjoiMSJ9.Gk2kpCjiWG0_Ucds2IowQnNhVjUE088sj3J0k5Sv5CDbazBy7_tQa30-9h09fLMCOITyU0KOeBd7ia_6T5AczMQYgOcQ-PkjsZANeD7DEy5-ilz9f8HY2LubVJZ7gmWqEudtXsZFil32JCUOPyNEL0Z-fZPr5MY6P2T9j_fgxM6fSg9YVPCDfbOHF7i1Gd0rjdigGzkshK1enCbB6vNB_HwUUK0qkI2coK3sXIz3i0pGmeK6nJb_T5OeE-xxfLvgevOxuxANded0-cm0GltgP4c5g52ojijDD0y-Mqo9-74.k7v8wBq2u7wpSD5VPS7ybdIHxqaM5o9ZVPSryRjlUa0&dib_tag=se&keywords=videocamera%2Bgatti%2Bcane&qid=1779588573&sr=8-5-spons&aref=GGf8pUZJR4&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=l0c39-21&linkId=98aa9371f60229eab0df58596f2b631c&ref=_as_li_ss_tl"
            }
        ]
    },
    "abbigliamento-serie-tv-film": {
        name: "Abbigliamento Serie TV & Film",
        tags: ["abbigliamento", "serie", "tv", "film", "televisione", "outfit", "maglietta", "felpa", "camicia", "berretto", "accessori", "gioielli", "collana", "bracciale", "cosplay", "costume", "peaky", "blinders", "stranger", "things", "wednesday", "witcher", "fallout", "shogun", "bridgerton", "money", "heist", "crown", "house", "dragon", "sanem", "can", "divit", "leyla", "emre", "le", "ali", "del", "sogno"],
        url: "/abbigliamento-serie-tv-film/index.html",
        personality: "entertainment",
        valueProp: "Ho selezionato i migliori merchandise ufficiali e outfit ispirati alle serie TV. Tessuto, vestibilità e design iconico sono i criteri che ho considerato.",
        song: "Eye of the Tiger - Survivor",
        songLinkSpotify: "https://open.spotify.com/track/2KH16WveTQWT6KOG9Rg6e2",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "abbigliamento-ciclismo": {
        name: "Abbigliamento Ciclismo",
        tags: ["ciclismo", "bici", "bicicletta", "mtb", "mountain", "bike", "abbigliamento", "tuta", "pantaloncini", "salopette", "maglietta", "guanti", "occhiali", "casco", "impermeabile", "antipioggia", "antivento", "giacca", "pantalone", "traspirante", "gel", "imbottito", "bretelle", "estivo", "invernale", "strada", "corsa", "pedalare", "sport", "outdoor"],
        url: "/abbigliamento-ciclismo/index.html",
        personality: "athletic",
        valueProp: "Ho selezionato i migliori abbigliamenti e accessori per il ciclismo. Comfort, traspirabilità e protezione sono i criteri che ho considerato.",
        song: "Bicycle Race - Queen",
        songLinkSpotify: "https://open.spotify.com/track/1B2V4Q5uG7S8Y9Z0A1B2C3",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref=_as_li_ss_tl",
        primaryColor: "#00ff88",
        accentColor: "#ffcc00",
        secondaryColor: "#1a1a2e",
        topProducts: [
            {
                name: "HOMTOL Abbigliamento Ciclismo Set Manica Corta Tuta Completa",
                description: "Tuta completa per il ciclismo estivo con pantaloncini imbottiti in gel traspirante",
                icon: "fa-bicycle",
                link: "https://www.amazon.it/HOMTOL-Abbigliamento-Pantaloncini-Traspirante-Asciugatura/dp/B09WTTT4DB?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=ZNOVEVMB306U&dib=eyJ2IjoiMSJ9.DtEoGTp22XMwHden81oPKLL5ABd9xsOrq0-ctEV2ovNEpDFyv_WF4DwsqFQXxhgXPoqQbGainaKM-soXe57_MMGWVNTiTs6HJDkIR9gETXYkwdbXUewEXm1qfj8xJizHYhW6B3Q_Xs7szLeq0zeWSd4fy8J_fYczUdU7mXEyn0TAgrelqXuj5BYVKseZUXKy8RnofGm678Q5faQApoiImWtDJWbpfdY0IpzbwsbXA_DDBNTNp-bbdhW3rSUocLUmqO4_vtA9PN9z75RoC-i4nDbDnsgg9WxgG5UzroQ9Z3Q.WuUz05jsmLgCtg2TECUNeLSTwMcK_1uZTtU35DtBj8A&dib_tag=se&keywords=bici%2Bset&qid=1779867487&sprefix=bici%2Bdet%2Caps%2C173&sr=8-8&th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=a9e628388e8936065229065d0a285e1d&ref=_as_li_ss_tl"
            },
            {
                name: "Tuta Ciclismo Completa Set+Pantaloncini 9D Gel Imbottito con Guanti e Occhiali",
                description: "Set completo con tuta, pantaloncini imbottiti 9D gel, guanti e occhiali",
                icon: "fa-bicycle",
                link: "https://www.amazon.it/Abbigliamento-Ciclismo-Pantaloncini-imbottito-MTB%EF%BC%8BGuanti/dp/B0CTDGVJ3L?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=ZNOVEVMB306U&dib=eyJ2IjoiMSJ9.DtEoGTp22XMwHden81oPKLL5ABd9xsOrq0-ctEV2ovNEpDFyv_WF4DwsqFQXxhgXPoqQbGainaKM-soXe57_MMGWVNTiTs6HJDkIR9gETXYkwdbXUewEXm1qfj8xJizHYhW6B3Q_Xs7szLeq0zeWSd4fy8J_fYczUdU7mXEyn0TAgrelqXuj5BYVKseZUXKy8RnofGm678Q5faQApoiImWtDJWbpfdY0IpzbwsbXA_DDBNTNp-bbdhW3rSUocLUmqO4_vtA9PN9z75RoC-i4nDbDnsgg9WxgG5UzroQ9Z3Q.WuUz05jsmLgCtg2TECUNeLSTwMcK_1uZTtU35DtBj8A&dib_tag=se&keywords=bici%2Bset&qid=1779867487&sprefix=bici%2Bdet%2Caps%2C173&sr=8-12&th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=c6e353cbe213e027be887cb9aab1aef8&ref=_as_li_ss_tl"
            },
            {
                name: "X-TIGER Ciclismo Uomo 5D Gel Salopette Pantaloncini Corti Imbottiti",
                description: "Salopette con imbottitura 5D gel premium per massimo comfort",
                icon: "fa-bicycle",
                link: "https://www.amazon.it/dp/B08TBD3TDJ?pd_rd_i=B08TBD3TDJ&pd_rd_w=aglq3&content-id=amzn1.sym.1eb9f79a-a1f0-4047-9d3a-2c918f58aed5&pf_rd_p=1eb9f79a-a1f0-4047-9d3a-2c918f58aed5&pf_rd_r=XTV7YVW7B28ED089QK7Q&pd_rd_wg=FvYuM&pd_rd_r=1358c35d-d9ef-4322-91ed-17f27df3c651&aref=O7aTTOb90U&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWw&th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=c6ab1ef2b3389860a033474173b56b3f&ref=_as_li_ss_tl"
            },
            {
                name: "Tuta Impermeabile Antipioggia Antivento - Set Giacca e Pantalone",
                description: "Protezione completa dalla pioggia per moto e bicicletta",
                icon: "fa-cloud-rain",
                link: "https://www.amazon.it/Auto-Accessori-Lupex-Impermeabile-Antipioggia/dp/B0BF5MXH19?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=ZNOVEVMB306U&dib=eyJ2IjoiMSJ9.DtEoGTp22XMwHden81oPKLL5ABd9xsOrq0-ctEV2ovNEpDFyv_WF4DwsqFQXxhgXPoqQbGainaKM-soXe57_MMGWVNTiTs6HJDkIR9gETXYkwdbXUewEXm1qfj8xJizHYhW6B3Q_Xs7szLeq0zeWSd4fy8J_fYczUdU7mXEyn0TAgrelqXuj5BYVKseZUXKy8RnofGm678Q5faQApoiImWtDJWbpfdY0IpzbwsbXA_DDBNTNp-bbdhW3rSUocLUmqO4_vtA9PN9z75RoC-i4nDbDnsgg9WxgG5UzroQ9Z3Q.WuUz05jsmLgCtg2TECUNeLSTwMcK_1uZTtU35DtBj8A&dib_tag=se&keywords=bici%2Bset&qid=1779867487&sprefix=bici%2Bdet%2Caps%2C173&sr=8-47&th=1&linkCode=ll2&tag=l0c39-21&linkId=739862a3e171c23c5193803bc66f1de4&ref=_as_li_ss_tl"
            }
        ]
    },
    "sport-estivi": {
        name: "Sport Estivi",
        tags: ["sport", "estivo", "estate", "tennis", "padel", "running", "jogging", "surf", "windsurf", "vela", "canoa", "kayak", "nuoto", "piscina", "immersioni", "subacquea", "beach", "volleyball", "arrampicata", "climbing", "skate", "skateboard", "yoga", "nordic", "walking", "all'aperto", "outdoor", "attività", "fisica", "allenamento", "competizione", "gioco", "divertimento"],
        url: "/sport-estivi/index.html",
        personality: "energetic",
        valueProp: "Ho selezionato i migliori sport estivi per goderti l'aria aperta. Tennis, padel, running, surf e molto altro per una estate attiva.",
        song: "Summer of '69 - Bryan Adams",
        songLinkSpotify: "https://open.spotify.com/track/1B2V4Q5uG7S8Y9Z0A1B2C3",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref=_as_li_ss_tl",
        primaryColor: "#667eea",
        accentColor: "#764ba2",
        secondaryColor: "#f093fb"
    },
    "snack-bevande": {
        name: "Snack & Bevande",
        tags: ["bibita", "bevanda", "coca", "cola", "pepsi", "fanta", "sprite", "acqua", "gassata", "analcolica", "birra", "vino", "succo", "frizzante", "tonica", "ginger", "zenzero", "limonata", "aranciata", "drenante", "integratore", "energy", "drink", "red", "bull", "monster", "caffe", "tè", "the", "tisana", "infuso", "latte", "soda", "soft", "drink", "lattina", "bottiglia", "scorta", "multipack", "confezione", "famiglia"],
        url: "/snack-bevande/index.html",
        personality: "refreshing",
        valueProp: "Ho selezionato le bibite e bevande migliori per rinfrescarti. Gusto, qualità e convenienza sono i fattori chiave.",
        song: "Summer Vibes Deep House Mix",
        songLinkSpotify: "https://open.spotify.com/playlist/53FHC0FredNfhyXUVl2mb8",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref=_as_li_ss_tl",
        primaryColor: "#00CED1",
        accentColor: "#FF6B35",
        secondaryColor: "#FF1493",
        topProducts: [
            {
                name: "Powerade Orange Sport Drink – 12 Bottiglie da 500 ml",
                description: "Bevanda isotonica con carboidrati ed elettroliti - Ideale per sportivi e montagna",
                icon: "fa-running",
                link: "https://www.amazon.it/dp/B00Y8D9P6K?pd_rd_i=B00Y8D9P6K&pd_rd_w=hD6VB&content-id=amzn1.sym.1eb9f79a-a1f0-4047-9d3a-2c918f58aed5&pf_rd_p=1eb9f79a-a1f0-4047-9d3a-2c918f58aed5&pf_rd_r=Z6CWD9336NKK428RK0M9&pd_rd_wg=KZQgL&pd_rd_r=abccc0cc-88f2-4383-986f-4d5f7ccb08ea&aref=hfNoBhuot5&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWw&th=1&linkCode=ll2&tag=l0c39-21&linkId=e8af102093795fae01900556a8432f07&ref=_as_li_ss_tl"
            },
            {
                name: "ALPRO SENZA ZUCCHERI, Bevanda alla MANDORLA",
                description: "Alternativa vegetale al latte senza zuccheri con vitamine B2, B12, D2, E",
                icon: "fa-leaf",
                link: "https://www.amazon.it/ZUCCHERI-MANDORLA-vegetale-vitamine-confezioni/dp/B0DTYZX9NJ?psc=1&linkCode=ll2&tag=l0c39-21&linkId=06cd1283271cb70c174cc9964578baa7&ref=_as_li_ss_tl"
            },
            {
                name: "AMACX Turbo Energy Gel per Atleti di Resistenza",
                description: "Gel energetico con caffeina e 40g di carboidrati per sport di resistenza",
                icon: "fa-running",
                link: "https://www.amazon.it/dp/B0C9R21RSR?ie=UTF8&pd_rd_plhdr=t&aref=g0wHB7AZJ6&th=1&linkCode=ll2&tag=l0c39-21&linkId=bd15f3474e308a5e387baacb32264287&ref=_as_li_ss_tl"
            },
            {
                name: "Lemonsoda Energy | Icy Breeze - 12 Lattine da 50 cl",
                description: "Energy drink zero zuccheri con taurina e guaranà - Rinfrescante per sportivi",
                icon: "fa-bolt",
                link: "https://www.amazon.it/dp/B0CX6F2P4Y?aref=p0phC4nHB2&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWxfcmlnaHRfc2hhcmVk&th=1&linkCode=ll2&tag=l0c39-21&linkId=21631174d53fa4717497d9a40abd9ad5&ref=_as_li_ss_tl"
            }
        ]
    },
    "smartphone-tech": {
        name: "Smartphone & Tech",
        tags: ["smartphone", "telefono", "cellulare", "iphone", "samsung", "android", "galaxy", "xiaomi", "huawei", "oppo", "oneplus", "pixel", "nokia", "sony", "lg", "motorola", "honor", "realme", "tecno", "infinix", "vivo", "zte", "alcatel", "wiko", "bq", "crosscall", "cat", "rugged", "tough", "tablet", "ipad", "samsung", "galaxy", "tab", "kindle", "ebook", "reader", "smartwatch", "orologio", "fitness", "tracker", "band", "auricolari", "cuffie", "true", "wireless", "airpods", "galaxy", "buds", "powerbank", "batteria", "caricabatterie", "cavo", "usb", "type", "c", "lightning"],
        url: "/smartphone-tech/index.html",
        personality: "technical",
        valueProp: "Ho analizzato le specifiche tecniche e le prestazioni. Processore, RAM, storage e batteria sono i fattori chiave.",
        song: "Telephone - Lady Gaga",
        songLinkSpotify: "https://open.spotify.com/track/7rl7ao5pb9BhvAzPdWStxi",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "tech": {
        name: "Tech",
        tags: ["tech", "tecnologia", "gadget", "computer", "laptop", "notebook", "desktop", "pc", "mac", "windows", "linux", "android", "ios", "software", "hardware", "periferica", "mouse", "tastiera", "monitor", "schermo", "stampante", "scanner", "webcam", "microfono", "cuffie", "auricolari", "speaker", "soundbar", "router", "modem", "wifi", "bluetooth", "usb", "cavo", "adattatore", "hub", "dock", "powerbank", "batteria", "caricabatterie", "hard", "disk", "ssd", "ram", "cpu", "gpu", "processore", "scheda", "video", "scheda", "madre", "case", "ventole", "raffreddamento", "liquido", "watercooling"],
        url: "/tech/index.html",
        personality: "technical",
        valueProp: "Ho analizzato le specifiche tecniche e le prestazioni per le tue esigenze tecnologiche.",
        song: "Technologic - Daft Punk",
        songLinkSpotify: "https://open.spotify.com/track/0LSLM0zuWRkEYemF7JcfEE",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "mare-spiaggia": {
        name: "Mare & Spiaggia",
        tags: ["mare", "spiaggia", "ombrellone", "telo", "costume", "scarpe", "acqua", "sandali", "ciabatte", "slip", "infradito", "flip", "flop", "espadrillas", "crema", "solare", "abbronzante", "doposole", "occhiali", "sole", "cappello", "berretto", "fascia", "bandana", "tuta", "bagno", "costume", "bikini", "slip", "mutande", "shorts", "beach", "wear", "gonna", "mare", "dress", "mare", "telo", "microfibra", "asciugamano", "sabbia", "impermeabile", "borsa", "mare", "zaino", "secchiello", "secchio", "paletta", "formine", "pallina", "beach", "volley", "racchette", "surf", "bodyboard", "boogie", "board", "snorkeling", "maschera", "boccaglio", "pinne", "gommone", "canoa", "kayak", "paddleboard"],
        url: "/mare-spiaggia/index.html",
        personality: "summer",
        valueProp: "Ho selezionato i migliori prodotti per goderti il mare e la spiaggia al meglio.",
        song: "Kokomo - The Beach Boys",
        songLinkSpotify: "https://open.spotify.com/track/7B22szTT8omMRmpQw6DMqV",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "outdoor-camping": {
        name: "Outdoor & Camping",
        tags: ["outdoor", "campeggio", "tenda", "montagna", "freddo", "sacco", "pelo", "sleeping", "bag", "lanterna", "torcia", "frontale", "bussola", "gps", "navigatore", "mappe", "kit", "sopravvivenza", "coltello", "multitool", "cucina", "campeggio", "pentole", "portatili", "stoviglie", "posate", "bicchieri", "bottiglia", "thermos", "borsa", "frigo", "cooler", "box", "ice", "sedia", "pieghevole", "tavolo", "pieghevole", "hammock", "amaca", "mosquito", "net", "zanzariera", "poncho", "impermeabile", "giacca", "antivento", "kway", "scarpe", "trekking", "stivali", "bastoncini", "crampon", "piccone", "corda", "imbracatura", "carabiner", "moschettone", "rampicata", "arrampicata"],
        url: "/outdoor-camping/index.html",
        personality: "adventure",
        valueProp: "Ho selezionato l'attrezzatura migliore per le tue avventure all'aria aperta.",
        song: "Country Roads - John Denver",
        songLinkSpotify: "https://open.spotify.com/track/1QbOvACeYanja5pbnJbAmk",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref=_as_li_ss_tl",
        topProducts: [
            {
                name: "Columbia Crestwood Mid Waterproof Scarponi da Trekking Uomo",
                description: "Scarponi da trekking ed escursionismo impermeabili a vita media uomo",
                icon: "fa-hiking",
                link: "https://www.amazon.it/Columbia-Crestwood-Waterproof-Trekking-Escursionismo/dp/B084N51S2C?m=a2b7wb2xmx2l4v&ascsubtag=srctok-37a5530180b0b50b&btn_ref=srctok-37a5530180b0b50b&th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=cb14b4ba2df67d1525e569160a66ef41&ref=_as_li_ss_tl"
            },
            {
                name: "The North Face Scarpe Impermeabili Litewave Fastpack II da Donna",
                description: "Scarpe impermeabili da donna con altezza caviglia media per trekking e outdoor",
                icon: "fa-hiking",
                link: "https://www.amazon.it/dp/B084N51S2C?m=a2b7wb2xmx2l4v&ascsubtag=srctok-37a5530180b0b50b&btn_ref=srctok-37a5530180b0b50b&th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=cb14b4ba2df67d1525e569160a66ef41&ref=_as_li_ss_tl"
            },
            {
                name: "FE Active Tenda Campeggio con Zanzariera",
                description: "Tenda da campeggio con zanzariera integrata, impermeabile e resistente",
                icon: "fa-campground",
                link: "https://www.amazon.it/FE-Active-zanzariera-Impermeabile-Escursionismo/dp/B07QV3MQTT?&linkCode=ll2&tag=l0c39-21&linkId=aab7aeba98e2fe34f5bbfd458b27fb66&ref=_as_li_ss_tl"
            }
        ]
    },
    "moda-donna": {
        name: "Moda Donna",
        tags: ["moda", "donna", "abbigliamento", "vestito", "scarpe", "donna", "borsa", "donna", "top", "tshirt", "maglietta", "blusa", "camicetta", "jeans", "pantaloni", "gonna", "giacca", "cappotto", "maglione", "pullover", "cardigan", "blazer", "abito", "sera", "elegante", "intimo", "reggiseno", "mutandine", "calze", "collant", "calzini", "costume", "bagno", "beachwear", "accessori", "gioielli", "collana", "orecchino", "bracciale", "anello", "occhiali", "sole", "sciarpa", "cintura", "cappello", "berretto", "scarpe eleganti", "tacchi", "décolleté", "sandali eleganti", "pumps", "tessuto", "vestibilità", "design"],
        url: "/moda-donna/index.html",
        personality: "fashion",
        valueProp: "Ho selezionato i migliori prodotti per il tuo stile. Tessuto, vestibilità e design iconico sono i criteri che ho considerato.",
        song: "Vogue - Madonna",
        songLinkSpotify: "https://open.spotify.com/track/27QvYgBk0CHOVHthWnkuWt",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "moda-uomo": {
        name: "Moda Uomo",
        tags: ["moda", "uomo", "abbigliamento", "camicia", "scarpe", "uomo", "borsa", "uomo", "tshirt", "maglietta", "polo", "jeans", "pantaloni", "pantaloni", "shorts", "giacca", "cappotto", "maglione", "pullover", "cardigan", "blazer", "completo", "abito", "elegante", "intimo", "mutande", "boxer", "slip", "calze", "calzini", "costume", "bagno", "beachwear", "cravatta", "papillon", "cintura", "cinturino", "cappello", "berretto", "guanti", "scarpe", "sneakers", "mocassini", "stivali", "scarpe eleganti", "scarpe da cerimonia", "scarpe classiche", "oxford", "derby", "loafer", "monk", "tessuto", "vestibilità", "design"],
        url: "/moda-uomo/index.html",
        personality: "fashion",
        valueProp: "Ho selezionato i migliori prodotti per il tuo stile. Tessuto, vestibilità e design iconico sono i criteri che ho considerato.",
        song: "Sharp Dressed Man - ZZ Top",
        songLinkSpotify: "https://open.spotify.com/track/0f9h8awV1X4jSllHXXYdfX",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "arredamento-casa": {
        name: "Casa & Decorazione",
        tags: ["arredamento", "casa", "decorazione", "vaso", "decorativo", "candela", "profumata", "zanzariera", "tappeto", "lampada", "cuscino", "tenda", "mobili", "sofà", "poltrona", "tavolo", "sedia", "armadio", "mensole", "libreria", "comodino", "specchio", "quadro", "orologio", "da", "parete"],
        url: "/arredamento-casa/index.html",
        personality: "aesthetic",
        valueProp: "Ho selezionato i prodotti migliori per arredare la tua casa con stile.",
        song: "Home - Michael Bublé",
        songLinkSpotify: "https://open.spotify.com/track/4wLZ4zPM9c4oe1VV8ejdWV",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "accessori-moda": {
        name: "Accessori Moda",
        tags: ["accessori", "moda", "occhiali", "da", "sole", "cintura", "borsetta", "borsa", "portafoglio", "sciarpa", "cappello", "guanti", "gioielli", "collana", "bracciale", "anello", "orecchini"],
        url: "/accessori-moda/index.html",
        personality: "fashion",
        valueProp: "Ho selezionato gli accessori perfetti per completare il tuo look.",
        song: "Fashion - David Bowie",
        songLinkSpotify: "https://open.spotify.com/track/34V3AvUPfWRW2zListOWZG",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "benessere-cura-personale": {
        name: "Benessere & Cura Personale",
        tags: ["benessere", "cura", "personale", "crema", "viso", "siero", "lozione", "tonico", "detergente", "esfoliante", "idratante", "solare", "abbronzante", "doposole", "trucco", "fondotinta", "correttore", "mascara", "eyeliner", "ombretto", "rossetto", "gloss", "blush", "bronzer", "illuminante", "primer", "spugna", "pennello", "brush", "palette", "smalto", "unghie", "rimuovi", "smalto", "nail", "polish", "remover", "capelli", "balsamo", "dopobarba"],
        url: "/benessere-cura-personale/index.html",
        personality: "wellness",
        valueProp: "Ho selezionato i migliori prodotti per la tua routine di bellezza e benessere.",
        song: "Beautiful - Christina Aguilera",
        songLinkSpotify: "https://open.spotify.com/track/3TCauNPqFiniaYHBvEVoHG",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "giochi-da-tavolo": {
        name: "Giochi da Tavolo",
        tags: ["giochi", "da", "tavolo", "board", "game", "dadi", "dungeons", "dragons", "dnd", "pathfinder", "gurps", "call", "cthulhu", "vampire", "masquerade", "warhammer", "age", "sigmar", "monopoly", "risk", "scrabble", "trivial", "pursuit", "cluedo", "twister", "jenga", "uno", "rummy", "poker", "blackjack", "bridge", "scopone", "briscola", "tressette", "scala", "40", "scacchi", "dama", "go", "mahjong", "backgammon", "carrom", "mancala", "catan", "settlers", "ticket", "ride", "carcassonne", "pandemic", "terraforming", "mars", "wingspan", "azul", "splendor"],
        url: "/giochi-da-tavolo/index.html",
        personality: "gaming",
        valueProp: "Ho selezionato i migliori giochi da tavolo per le tue serate con amici.",
        song: "The Game - Queen",
        songLinkSpotify: "https://open.spotify.com/track/3CaetUu7dGAS5AM52ceK1E",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "libri-ereader": {
        name: "Libri & E-Reader",
        tags: ["libro", "kindle", "ebook", "lettore", "romanzo", "thriller", "giallo", "fantasy", "fantascienza", "horror", "romance", "erotico", "storico", "biografia", "autobiografia", "saggio", "manual", "guida", "studio", "scuola", "università", "bambini", "ragazzi", "young", "adult", "fumetto", "manga", "graphic", "novel", "comics", "audiolibro", "audible", "kobo", "nook", "boox", "pocketbook", "tolino", "sony", "reader", "paperwhite", "oasis", "scribe", "clara", "libra", "h2o", "glo", "aura", "one", "edition", "forma", "cover", "custodia", "light", "case"],
        url: "/libri-ereader/index.html",
        personality: "intellectual",
        valueProp: "Ho selezionato i migliori libri e e-reader per i tuoi momenti di lettura.",
        kindleLink: "https://www.amazon.it/kindle-dbs/ku/?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref=_as_li_ss_tl",
        song: "Brown Eyed Girl - Van Morrison",
        songLinkSpotify: "https://open.spotify.com/track/3yrSvpt2l1xhsV9Em88Pul",
    },
    "parrucchiere-barbiere": {
        name: "Parrucchiere & Barbiere",
        tags: ["parrucchiere", "barbiere", "forbici", "rasoio", "taglio", "capelli", "barba", "pettine", "spazzola", "phon", "piastra", "arricciacapelli", "taglieri", "carrello", "sedia", "lavabo", "attrezzatura", "strumenti", "professionale", "salone", "barber", "shop", "grooming", "cura", "personal", "style", "look", "hair", "cut", "shave", "beard", "mustache", "trimmer", "clipper"],
        url: "/parrucchiere-barbiere/index.html",
        personality: "professional",
        valueProp: "Ho selezionato le attrezzature professionali più affidabili per il tuo salone.",
        song: "Smooth Operator - Sade",
        songLinkSpotify: "https://open.spotify.com/track/0f9h8awV1X4jSllHXXYdfX",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref=_as_li_ss_tl",
        primaryColor: "#1a1a2e",
        accentColor: "#D4AF37",
        secondaryColor: "#f8f9fa",
        topProducts: [
            {
                name: "SCHWERTKRONE Rasoio a Mano Libera con Manico Prezioso",
                description: "Rasoio tradizionale premium con 100 lame Derby incluse",
                icon: "fa-cut",
                link: "https://www.amazon.it/SCHWERTKRONE-Prezioso-Barbiere-Rasatura-Definizione/dp/B0957WPKP4?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=RQP9HXDEGOPJ&dib=eyJ2IjoiMSJ9.IwyQJKyxav7f_BtY-qgKtdA0Qjy3QG-_VqotbIsliD9YCqAFHYs1MQ0VABI67aULcmLXsqJ66_hek_moI5a3t4pVyFjeBKsnwg6Krm3nTzvgA6zyj9qUgU4_1OO8XNOij7ZOMLJHbGZLYSpFe6J9qzF8L4_1KRIEdIIlyayLo7vtG6FayOB5_PoV9CckaQCXaVKX4oa-tU748iGudJ0y8q0BVk5DT4BkYnaFYEhLYcyQD1N0Vd0F_2Kq0U7dvnE1vZWtLtu8w3wNgMFGqpTnyYc1CMC74_KwiuNb7bRhjHI.l65c0gl0YKMurbg4eQhS4Cd0ILCPC0SIWuJPlzrbVwU&dib_tag=se&keywords=parrucchiere&qid=1779681422&sprefix=parrucchiere%2Caps%2C164&sr=8-3-spons&aref=6byR8fHsbO&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=l0c39-21&linkId=7ba67fb8d666610e44040abf78006017&ref=_as_li_ss_tl"
            },
            {
                name: "OCBA Forbici Parrucchiere Professionali 6 Pollici",
                description: "Forbici capelli in acciaio inossidabile con design ergonomico",
                icon: "fa-cut",
                link: "https://www.amazon.it/Parrucchiere-Professionali-6Pollici-Inossidabile-Barbiere/dp/B088BCF6NP?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=RQP9HXDEGOPJ&dib=eyJ2IjoiMSJ9.IwyQJKyxav7f_BtY-qgKtdA0Qjy3QG-_VqotbIsliD9YCqAFHYs1MQ0VABI67aULcmLXsqJ66_hek_moI5a3t4pVyFjeBKsnwg6Krm3nTzvgA6zyj9qUgU4_1OO8XNOij7ZOMLJHbGZLYSpFe6J9qzF8L4_1KRIEdIIlyayLo7vtG6FayOB5_PoV9CckaQCXaVKX4oa-tU748iGudJ0y8q0BVk5DT4BkYnaFYEhLYcyQD1N0Vd0F_2Kq0U7dvnE1vZWtLtu8w3wNgMFGqpTnyYc1CMC74_KwiuNb7bRhjHI.l65c0gl0YKMurbg4eQhS4Cd0ILCPC0SIWuJPlzrbVwU&dib_tag=se&keywords=parrucchiere&qid=1779681422&sprefix=parrucchiere%2Caps%2C164&sr=8-4-spons&aref=c8jD8vrstC&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=l0c39-21&linkId=8fb2796e9175ae201e4e22f53eb542b7&ref=_as_li_ss_tl"
            },
            {
                name: "CIICII Forbici Parrucchiere Professionali",
                description: "Forbici parrucchiere professionali 440C, 6,7 pollici",
                icon: "fa-cut",
                link: "https://www.amazon.it/CIICII-C1319-6-Forbici-Parrucchiere-Professionali/dp/B0FQV6JZZY?crid=3OUPM4KL1KJGO&dib=eyJ2IjoiMSJ9.W_rgOTjrbSSZ2REPUkmIq9aClGtBGKq2BhHxba8AHiTIH6JnVMDVtWm86VA99I4f8QXyFpPwy0jgtKjJl0n3wQXwVAsOv96OkBl55eAVv72GG9prpChoSETI3ydCiEClWGe2dyjY7gfUn1sZrkWDbfWmJKzb9PIEluZg3HeW-5BB0Zytjb3plPupcvgdUMB5M5eunqzNpg2eyDc8nfbgWU6GXwleSemzN5t65Oy83JjU4UXzgFhR_DR0uq4flegNinBTA9mhpDtFJNJ5V0fVcoEOoJAIw9tH_FqohZsBFhE.UZtAhm4dSesV84mcpzneQq0dYtH_b6J10QGG70mBKGM&dib_tag=se&keywords=forbici+parrucchiere+professionali+yasaka&qid=1779864365&sprefix=yasaka+forbici%2Caps%2C116&sr=8-5-spons&aref=iktUgBTaXG&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1&linkCode=ll2&tag=l0c39-21&linkId=0ee9f8c9b07f4ea2e14092a71418b440&ref=_as_li_ss_tl"
            },
            {
                name: "Carrello Parrucchiere Professionale Cassetti Estraibili",
                description: "Carrello professionale con cassetti estraibili per attrezzature",
                icon: "fa-suitcase",
                link: "https://www.amazon.it/Carrello-Parrucchiere-Professionale-Cassetti-Estraibili/dp/B0F1NBTJ2X?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=RQP9HXDEGOPJ&dib=eyJ2IjoiMSJ9.IwyQJKyxav7f_BtY-qgKtdA0Qjy3QG-_VqotbIsliD9YCqAFHYs1MQ0VABI67aULcmLXsqJ66_hek_moI5a3t4pVyFjeBKsnwg6Krm3nTzvgA6zyj9qUgU4_1OO8XNOij7ZOMLJHbGZLYSpFe6J9qzF8L4_1KRIEdIIlyayLo7vtG6FayOB5_PoV9CckaQCXaVKX4oa-tU748iGudJ0y8q0BVk5DT4BkYnaFYEhLYcyQD1N0Vd0F_2Kq0U7dvnE1vZWtLtu8w3wNgMFGqpTnyYc1CMC74_KwiuNb7bRhjHI.l65c0gl0YKMurbg4eQhS4Cd0ILCPC0SIWuJPlzrbVwU&dib_tag=se&keywords=parrucchiere&qid=1779681422&sprefix=parrucchiere%2Caps%2C164&sr=8-12&linkCode=ll2&tag=l0c39-21&linkId=a2dd234ef654842976675e9c91e2df12&ref=_as_li_ss_tl"
            }
        ]
    },
    "profumi-bellezza": {
        name: "Profumi & Bellezza",
        tags: ["profumo", "bellezza", "makeup", "cosmetico", "eau", "de", "toilette", "parfum", "eau", "de", "parfum", "intense", "edp", "edt", "cologne", "after", "shave", "balsamo", "dopobarba"],
        url: "/profumi-bellezza/index.html",
        personality: "elegant",
        valueProp: "Ho selezionato i profumi più esclusivi per la tua personalità.",
        song: "Por Una Cabeza - Tango",
        songLinkSpotify: "https://open.spotify.com/track/6fHW0V6DXlmEWn0bfCOt1N",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "abbigliamento-lavoro": {
        name: "Abbigliamento Lavoro",
        tags: ["lavoro", "abbigliamento", "ufficio", "business", "blazer", "pantaloni", "cargo", "militari", "tattici", "scarpe", "sicurezza", "antinfortunistiche", "punta", "acciaio", "professionale", "uniform", "divisa", "ingegnere", "architetto", "avvocato", "commercialista", "medico", "infermiere", "cantier", "industria", "protezione", "resistente", "robusto", "sicurezza"],
        url: "/abbigliamento-lavoro/index.html",
        personality: "professional",
        valueProp: "Ho selezionato i migliori capi di abbigliamento professionale per il tuo lavoro. Sicurezza, comfort e resistenza sono i criteri che ho considerato.",
        song: "Midnight City - M83",
        songLinkSpotify: "https://open.spotify.com/track/1eyzqe2QqGZUmfcPZtrIyt",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "sostenibilita-eco-friendly": {
        name: "Sostenibilità & Eco-Friendly",
        tags: ["sostenibilità", "eco", "ambiente", "riciclo", "ecologico", "green", "biologico", "organico", "naturale", "plastic", "free", "zero", "waste", "compostabile", "biodegradabile", "riciclato", "riciclabile", "energia", "solare", "pannelli", "solari", "eolico", "turbina", "idrico", "acqua", "risparmio", "energetico", "led", "lampadina", "batteria", "ricaricabile", "powerbank", "solare", "borsa", "tessile", "canna", "acqua", "bottiglia", "vetro", "acciaio", "inox", "bamboo", "bambù", "corteccia", "betulla", "canapa", "lino", "cotone", "organico", "fair", "trade", "equo", "solidale", "locale", "km", "zero", "slow", "food"],
        url: "/sostenibilita-eco-friendly/index.html",
        personality: "eco",
        valueProp: "Ho selezionato i prodotti più sostenibili per ridurre il tuo impatto ambientale.",
        song: "Earth Song - Michael Jackson",
        songLinkSpotify: "https://open.spotify.com/track/4GCGH6TJ69neckwITeBFXK",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "ufficio-produttivo": {
        name: "Ufficio Produttivo",
        tags: ["ufficio", "scrivania", "sedia", "ufficio", "stampante", "organizzatore", "cassetto", "porta", "documenti", "raccoglitore", "cartella", "busta", "penna", "matita", "evidenziatore", "correttore", "gomma", "righello", "forbice", "taglierino", "calcolatrice", "agenda", "diario", "calendario", "planner", "organizer", "blocco", "notes", "post", "it", "adesivi", "nastro", "scotch", "rilegatrice", "foratrice", "tagliacarte", "laminatrice", "spillatrice", "cucitrice", "punti", "metal", "fermacampioni", "portapenne", "portamouse", "tappetino", "mouse", "supporto", "monitor", "braccio", "monitor", "lampada", "scrivania", "lettore", "cd", "dvd", "masterizzatore", "esterno", "hard", "disk", "nas", "server"],
        url: "/ufficio-produttivo/index.html",
        personality: "professional",
        valueProp: "Ho selezionato i prodotti migliori per aumentare la tua produttività in ufficio.",
        song: "9 to 5 - Dolly Parton",
        songLinkSpotify: "https://open.spotify.com/track/4w3tQBXhn5345eUXDGBWZG",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "viaggi-vacanze": {
        name: "Viaggi & Vacanze",
        tags: ["viaggi", "vacanze", "valigia", "zaino", "trolley", "borsetta", "borsa", "viaggio", "adattatore", "spina", "corrente", "cuscino", "viaggio", "mascherina", "sonno", "occhiali", "sonno", "tappo", "orecchio", "kit", "pronto", "soccorso", "assicurazione", "viaggio", "guida", "turistica", "mappa", "gps", "navigatore"],
        url: "/viaggi-vacanze/index.html",
        personality: "travel",
        valueProp: "Ho selezionato i migliori accessori per i tuoi viaggi e vacanze.",
        song: "On the Road Again - Willie Nelson",
        songLinkSpotify: "https://open.spotify.com/track/2GyH5rvdnfkjzsTFaWrrov",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
        topProducts: [
            {
                name: "Valigia + Zaino Bagaglio a Mano Rigida 55x24x33",
                description: "Set completo valigia rigida + zaino con USB-C ricarica e supporto smartphone",
                icon: "fa-suitcase-rolling",
                link: "https://www.amazon.it/Bagaglio-55x24x33-Lucchetto-Borraccia-Smartphone/dp/B0GXZG4X6Y?&linkCode=ll2&tag=l0c39-21&linkId=9e2aa91a1c8d3bcbaef8d22ed1555743&ref=_as_li_ss_tl"
            }
        ]
    },
    "studio-fotografico": {
        name: "Studio Fotografico",
        tags: ["fotografia", "mobile", "fotocamera", "camera", "smartphone", "foto", "video", "lente", "obiettivo", "treppiede", "selfie", "stick", "gimbal", "stabilizzatore", "microfono", "esterno", "light", "ring", "flash", "kit", "fotografia", "studio", "illuminazione", "softbox", "luce", "rgb", "continua"],
        url: "/studio-fotografico/index.html",
        personality: "creative",
        valueProp: "Ho selezionato i migliori prodotti per il tuo studio fotografico, dall'illuminazione agli accessori.",
        song: "Photograph - Ed Sheeran",
        songLinkSpotify: "https://open.spotify.com/track/1HNkqx9Ahdgi1Ixy2xkKkL",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
        topProducts: [
            {
                name: "Obiettivo Macro Evil Eye Con Luce Di Riempimento",
                description: "Lente macro professionale con luce di riempimento integrata per smartphone",
                icon: "fa-camera",
                link: "https://www.amazon.it/Evil-Riempimento-Smartphone-Professionale-HB100U/dp/B0FGDCC3T6?dib=eyJ2IjoiMSJ9.tSOJNnarIf8aiWBIYE09tkBO-ZyfEhf3FwHomH1WQ94p1_klYId3eto_BTlh2AnA6DFkI_jb2UdbBcjTH5dIYwX9_ux85T3xoPf3mAMw59DbZIKr-rf-EkAJI-bWRTPPMHO3hPKYPBDWEZa5O66019nGSYko8bRXlAleIUM2VyYwuA7jTDZisaNeuC58HhY8k7FPKZMxRuOS3CwaaXzUXbI0pgy4OpokPnoiA0adSKZJFtFzXjrPFrFtWcgNiKot_Yw1Kd2R0YAYM0i2hLZqpxAWGemo-e1cwbtMY-kFe-w.JXTQM30lH9wi0aM5-6FmOrAxtZWn5ekOQuXjdinmEwY&dib_tag=se&keywords=lente+macro+smartphone&qid=1779588926&sr=8-3-spons&aref=ynynWAvq12&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1&linkCode=ll2&tag=l0c39-21&linkId=32b53ec2d46d82783e04960af02a2a11&ref=_as_li_ss_tl"
            },
            {
                name: "K&F CONCEPT Valigetta Fotografica Outdoor (IP67 Impermeabile)",
                description: "Valigetta fotografica impermeabile IP67 con schiuma pretagliata a griglia",
                icon: "fa-suitcase",
                link: "https://www.amazon.it/CONCEPT-Fotografica-Pretagliata-Impermeabile-34-5x29x13-5cm/dp/B0GHLV5ZJZ?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&aref=G9fj9vwxVf&content-id=amzn1.sym.dfdb39a7-e98b-4667-8017-e39a2a492092%3Aamzn1.sym.dfdb39a7-e98b-4667-8017-e39a2a492092&crid=1WV8WGITIH1UU&cv_ct_cx=film%2Bbox&keywords=film%2Bbox&pd_rd_i=B0GHLV5ZJZ&pd_rd_r=57e5801d-b00b-4bc4-9b56-42635dd3bc0f&pd_rd_w=3iitb&pd_rd_wg=DcJn1&pf_rd_p=dfdb39a7-e98b-4667-8017-e39a2a492092&pf_rd_r=4MJTNHYNR4J21YK0JKMM&qid=1779683958&s=music&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sprefix=film%2Bbox%2Cpopular%2C120&sr=1-1-07652b71-81e3-41f8-9097-e46726928fb7&th=1&linkCode=ll2&tag=l0c39-21&linkId=7d17fb4083863c75bdd08800596a9914&ref=_as_li_ss_tl"
            }
        ]
    },
    "dvd-bluray": {
        name: "DVD & Blu-ray",
        tags: ["dvd", "bluray", "film", "serie", "tv", "collezione", "box", "set", "4k", "ultra", "hd"],
        url: "/dvd-bluray/index.html",
        personality: "entertainment",
        valueProp: "Ho selezionato i migliori film e serie TV per la tua collezione.",
        song: "Video Killed the Radio Star - The Buggles",
        songLinkSpotify: "https://open.spotify.com/track/6t1FIJlZWTQfIZhsGjaulM",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "biciclette-mobilita": {
        name: "Biciclette & Mobilità",
        tags: ["bicicletta", "bici", "bicycle", "bike", "mtb", "mountain", "bike", "e-bike", "ebike", "elettrica", "elettrico", "pendolare", "urbano", "mobilità", "mobilita", "ciclismo", "ciclista", "corsa", "spinning", "trail", "off-road", "offroad", "alluminio", "freni", "disco", "idraulico", "cambio", "velocità", "velocita", "batteria", "autonomia", "ricaricabile", "impermeabile", "sospensioni", "ammortizzata", "biammortizzata", "ruote", "pneumatici", "sellino", "manubrio", "pedali", "casco", "luci", "campanello", "portapacchi", "borraccia"],
        url: "/biciclette-mobilita/index.html",
        personality: "adventure",
        valueProp: "Ho analizzato le specifiche tecniche per te. Telaio, batteria, autonomia e freni sono i fattori chiave per la tua mobilità.",
        song: "Bicycle Race - Queen",
        songLinkSpotify: "https://open.spotify.com/track/1g9sK0mV7zHlXhJz8m5W8m",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref=_as_li_ss_tl",
        topProducts: [
            {
                name: "IBK Bicicletta Bici MTB 26\" Mountain Bike BIAMMORTIZZATA",
                description: "Mountain bike biammortizzata con cambio 21 velocità e freni a disco",
                icon: "fa-bicycle",
                link: "https://www.amazon.it/IBK-Bicicletta-Mountain-Biammortizzata-Velocit%C3%A0/dp/B0F5BSJJVL?dib=eyJ2IjoiMSJ9.qDw6yrJXU1txWqQl1ewOnWLXIasRXObMGYNw4OLmadyFuZBqskI6X3xnEoMd80oT2RpkWO5IN_fIk0Hn5OEREkXDIw4jhCEeLObcZLlEIybXRjt06fitE7vByulRW82xT1N9YHSl-kpJPE6TEJi0nwcF_Y2vQK8F-1Ht7iMIuYxXE1cagiKEKcDxyaQolowqpnV20GtPo57I77oqju7VC8qO1ikICc2lOXH8alnfe0Mp80jT0U5oxcgQ8Xbih1hn5l0Zf-C1-77mr4gK9bjrNrSmTnWjZuxr2OrW1nC3XD8.bdKRfArYhgK-HAkPkG85J-yv4Xr3WSZIG9QuiyiKB_w&dib_tag=se&keywords=bici&qid=1779723129&sr=8-4&ufe=app_do%3Aamzn1.fos.fca66a76-6518-40f2-959f-2dca30e9c5d1&th=1&linkCode=ll2&tag=l0c39-21&linkId=d8d4d864e4cd81828b0bd4134d792c12&ref=_as_li_ss_tl"
            },
            {
                name: "HillMiles Bici Elettrica Per Adulti Da 26\"",
                description: "E-bike con batteria 36V 13Ah rimovibile, autonomia 80-100km",
                icon: "fa-bolt",
                link: "https://www.amazon.it/Elettrica-Bicicletta-Rimovibile-Autonomia-impermeabile/dp/B0G395GHT5?dib=eyJ2IjoiMSJ9.qDw6yrJXU1txWqQl1ewOnWLXIasRXObMGYNw4OLmadyFuZBqskI6X3xnEoMd80oT2RpkWO5IN_fIk0Hn5OEREkXDIw4jhCEeLObcZLlEIybXRjt06fitE7vByulRW82xT1N9YHSl-kpJPE6TEJi0nwcF_Y2vQK8F-1Ht7iMIuYxXE1cagiKEKcDxyaQolowqpnV20GtPo57I77oqju7VC8qO1ikICc2lOXH8alnfe0Mp80jT0U5oxcgQ8Xbih1hn5l0Zf-C1-77mr4gK9bjrNrSmTnWjZuxr2OrW1nC3XD8.bdKRfArYhgK-HAkPkG85J-yv4Xr3WSZIG9QuiyiKB_w&dib_tag=se&keywords=bici&qid=1779723129&sr=8-6&ufe=app_do%3Aamzn1.fos.fca66a76-6518-40f2-959f-2dca30e9c5d1&th=1&linkCode=ll2&tag=l0c39-21&linkId=2e9e593bbb0f4099e2247e7807be74ac&ref=_as_li_ss_tl"
            },
            {
                name: "IBK Bicicletta TXC MTB 29\" Pollici Mountain Bike",
                description: "Mountain bike 29 pollici in alluminio con freni a disco idraulici",
                icon: "fa-mountain",
                link: "https://www.amazon.it/IBK-Bicicletta-Mountain-Alluminio-Ammortizzata/dp/B08HWGW7SG?dib=eyJ2IjoiMSJ9.qDw6yrJXU1txWqQl1ewOnWLXIasRXObMGYNw4OLmadyFuZBqskI6X3xnEoMd80oT2RpkWO5IN_fIk0Hn5OEREkXDIw4jhCEeLObcZLlEIybXRjt06fitE7vByulRW82xT1N9YHSl-kpJPE6TEJi0nwcF_Y2vQK8F-1Ht7iMIuYxXE1cagiKEKcDxyaQolowqpnV20GtPo57I77oqju7VC8qO1ikICc2lOXH8alnfe0Mp80jT0U5oxcgQ8Xbih1hn5l0Zf-C1-77mr4gK9bjrNrSmTnWjZuxr2OrW1nC3XD8.bdKRfArYhgK-HAkPkG85J-yv4Xr3WSZIG9QuiyiKB_w&dib_tag=se&keywords=bici&qid=1779723129&sr=8-1-spons&ufe=app_do%3Aamzn1.fos.fca66a76-6518-40f2-959f-2dca30e9c5d1&aref=OaqTfWA1fP&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=l0c39-21&linkId=59626a720eeaee58a3db43e048bbaaea&ref=_as_li_ss_tl"
            }
        ]
    }
};

// Funzione per ottenere i dati delle combo con fallback
function getComboData(category) {
    // 1. Prova a leggere dal database modulare (la tua fonte primaria)
    if (typeof ComboDatabase !== 'undefined' && ComboDatabase[category]) {
        return ComboDatabase[category];
    }
    
    // 2. Fallback: se il DB non è caricato o manca la categoria, usa un oggetto di sicurezza
    console.warn("Database non trovato o categoria assente, uso fallback.");
    return {
        name: "Generico",
        combos: [{ message: "Scopri le nostre offerte migliori!" }]
    };
}

// catalogoProdotti - Archivio prodotti per consigli attivi del bot
// Questo catalogo contiene i prodotti che il bot consiglia attivamente in base al contesto
// product-catalogs/*.json rimane per i prodotti mostrati nelle pagine
const catalogoProdotti = {
    // MARE & SPIAGIA
    "maschera_snorkeling": {
        nome: "SEAC AMICA Maschera Snorkeling",
        categoria: "mare",
        descrizione: "Maschera snorkeling di qualità per esplorare il fondo marino.",
        link: "https://www.amazon.it/dp/B0CTTXVDR4?th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=9ba3aa7428a5fffd241eadd36ac7c20b&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai al mare! 🌊 Non so tu, ma quando vado alla spiaggia amo fare snorkeling. Io uso questa maschera e mi trovo benissimo. Se ti va te la passo:"
    },
    "ombrellone_mare": {
        nome: "Joy Summer Ombrellone Spiaggia Cabina Ø 200 BLU",
        categoria: "mare",
        descrizione: "Ombrellone cabina perfetto per il mare, ti protegge dal sole con stile.",
        link: "https://www.amazon.it/Joy-Summer-Ombrellone-Spiaggia-Cabina/dp/B00W1KAQWY?&linkCode=ll2&tag=l0c39-21&linkId=94666e812e9a7fa1ccb012eb0fd999cc&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai al mare! 🌊 Non so tu, ma quando vado alla spiaggia voglio stare all'ombra senza problemi. Io uso questo ombrellone e mi trovo benissimo. Se ti va te lo passo:"
    },
    "ombrellone_bakaji": {
        nome: "BAKAJI Ombrellone da Mare Spiaggia Giardino 210 cm",
        categoria: "mare",
        descrizione: "Ombrellone robusto in alluminio, perfetto per mare e giardino.",
        link: "https://www.amazon.it/BAKAJI-Ombrellone-Spiaggia-Alluminio-Rivestimento/dp/B07N3Z9S2J?th=1&linkCode=ll2&tag=l0c39-21&linkId=366952ed004011d96d82936721059d2a&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai al mare! 🌊 Non so tu, ma quando vado alla spiaggia voglio stare all'ombra senza problemi. Io uso questo ombrellone e mi trovo benissimo. Se ti va te lo passo:"
    },
    "ombrellone_inclinabile": {
        nome: "Ombrellone da Spiaggia Inclinabile & Altezza Regolabile",
        categoria: "mare",
        descrizione: "Ombrellone inclinabile con altezza regolabile, massima protezione solare.",
        link: "https://www.amazon.it/Ombrellone-Inclinabile-Regolabile-Protezione-Traspirante/dp/B09BKWTXYV?th=1&linkCode=ll2&tag=l0c39-21&linkId=4e755d1cc26cecdb3f762174a95f670a&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai al mare! 🌊 Non so tu, ma quando vado alla spiaggia voglio stare all'ombra senza problemi. Io uso questo ombrellone e mi trovo benissimo. Se ti va te lo passo:"
    },
    "telo_mare_fitflip": {
        nome: "Fit-Flip Telo Mare Microfibra Marino Bianco",
        categoria: "mare",
        descrizione: "Telo mare in microfibra, asciuga velocemente e non trattiene sabbia.",
        link: "https://www.amazon.it/Fit-Flip-Telo-Mare-microfibra-marino-bianco/dp/B09KNMTKPS?th=1&linkCode=ll2&tag=l0c39-21&linkId=b2c56b41c9500ff261d9cde21e931b3f&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai al mare! 🌊 Non so tu, ma quando vado alla spiaggia voglio un telo che asciuga in fretta. Io uso questo e mi trovo benissimo. Se ti va te lo passo:"
    },
    "telo_mare_lumisyne": {
        nome: "LumiSyne UPF50+ Microfibre Beach Towel",
        categoria: "mare",
        descrizione: "Telo mare UPF50+ in microfibra reversibile, protezione solare massima.",
        link: "https://www.amazon.it/LumiSyne-Microfibra-Reversibile-Asciugamano-Asciugatura/dp/B0B6FF14YK?th=1&linkCode=ll2&tag=l0c39-21&linkId=791f763589045a9d2044c05162e4f69e&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai al mare! 🌊 Non so tu, ma quando vado alla spiaggia voglio un telo che asciuga in fretta. Io uso questo e mi trovo benissimo. Se ti va te lo passo:"
    },
    "telo_mare_sandproof": {
        nome: "Microfibre Beach Towel Sand Proof",
        categoria: "mare",
        descrizione: "Telo mare antisabbia in microfibra, ultraleggero e asciuga subito.",
        link: "https://www.amazon.it/Microfibra-Antisabbia-Asciugatura-Ultraleggero-Asciugamano/dp/B0C3GWH7QV?&linkCode=ll2&tag=l0c39-21&linkId=1305caaaed850ca077a8c6bd6c86890e&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai al mare! 🌊 Non so tu, ma quando vado alla spiaggia voglio un telo che asciuga in fretta. Io uso questo e mi trovo benissimo. Se ti va te lo passo:"
    },
    "scarpe_acqua_water": {
        nome: "Water Shoes Beach Barefoot Aqua Sneakers Quick-Dry",
        categoria: "mare",
        descrizione: "Scarpe acqua barefoot, asciugano veloce e proteggono i piedi.",
        link: "https://www.amazon.it/Spiaggia-Escursione-Quick-Dry-Camminare-Arrampicare/dp/B0C5BZV1DC?th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=2cc1af0df4347a31aa8e6851691157bd&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai al mare! 🌊 Non so tu, ma quando vado alla spiaggia voglio scarpe comode per camminare sugli scogli. Io uso queste e mi trovo benissimo. Se ti va te le passo:"
    },
    "scarpe_acqua_cressi": {
        nome: "Cressi Water Shoes Scarpette Acquatiche",
        categoria: "mare",
        descrizione: "Scarpette acquatiche Cressi, perfette per spiaggia e piscina.",
        link: "https://www.amazon.it/Cressi-Scarpette-Acquatici-Bambini-Transparente/dp/B000O6AJNI?th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=c9803e478a795e32eb84c529bfd188c2&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai al mare! 🌊 Non so tu, ma quando vado alla spiaggia voglio scarpe comode per camminare sugli scogli. Io uso queste e mi trovo benissimo. Se ti va te le passo:"
    },
    "scarpe_acqua_seac": {
        nome: "Seac Reef Water Shoes Scarpe da Scoglio",
        categoria: "mare",
        descrizione: "Scarpe da scoglio Seac, asciugatura rapida per spiaggia e piscina.",
        link: "https://www.amazon.it/Scoglio-Bambini-Asciugatura-Spiaggia-Piscina/dp/B0G24PM5CT?th=1&linkCode=ll2&tag=l0c39-21&linkId=ba6a2b18969424bda9c4c44f9219f4d5&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai al mare! 🌊 Non so tu, ma quando vado alla spiaggia voglio scarpe comode per camminare sugli scogli. Io uso queste e mi trovo benissimo. Se ti va te le passo:"
    },
    "speaker_waterproof": {
        nome: "HAISSKY Bluetooth Waterproof Shower Speaker",
        categoria: "mare",
        descrizione: "Speaker Bluetooth impermeabile, perfetto per doccia e spiaggia.",
        link: "https://www.amazon.it/Altoparlante-Impermeabile-Doccia-Wireless-vivavoce-portatile-Compatabile/dp/B01MCUMFQ5?&linkCode=ll2&tag=l0c39-21&linkId=2bf3e3490b4bdd952365c8ea0d77529a&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai al mare! 🌊 Non so tu, ma quando vado alla spiaggia voglio musica senza preoccuparmi dell'acqua. Io uso questo speaker e mi trovo benissimo. Se ti va te lo passo:"
    },
    "cooler_bag_cool": {
        nome: "Cool Factory 240355 Uniflame Cooler Bag 22 Litres",
        categoria: "mare",
        descrizione: "Borsa termica 22 litri, mantiene le bevande fresche tutto il giorno.",
        link: "https://www.amazon.it/Borsa-factory-240355-uniflame-termica/dp/B07QL72X6M?&linkCode=ll2&tag=l0c39-21&linkId=c3ac151db98d04af5bc6874c774243f0&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai al mare! 🌊 Non so tu, ma quando vado alla spiaggia voglio le bevande fredde. Io uso questa borsa termica e mi trovo benissimo. Se ti va te la passo:"
    },
    "cooler_bag_lifewit": {
        nome: "Lifewit Thermal Backpack 24L Cooler Bag",
        categoria: "mare",
        descrizione: "Zaino termico 24L, perfetto per mantenere cibo e bevande fresche.",
        link: "https://www.amazon.it/Lifewit-Isoterma-Mantenere-Allaperto-Campeggio/dp/B07B8GRWMC?th=1&linkCode=ll2&tag=l0c39-21&linkId=6da080a3ea1160b13fb9fa05a8927e7d&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai al mare! 🌊 Non so tu, ma quando vado alla spiaggia voglio le bevande fredde. Io uso questo zaino termico e mi trovo benissimo. Se ti va te lo passo:"
    },
    "borsa_impermeabile": {
        nome: "LEMESO Borsa Impermeabile Mare",
        categoria: "mare",
        descrizione: "Borsa impermeabile per mare, protegge telefono e portafoglio.",
        link: "https://www.amazon.it/LEMESO-Impermeabile-Protezione-portafoglio-Canottaggio/dp/B0B36Y9X1D?&linkCode=ll2&tag=l0c39-21&linkId=45f185ea5a7992c2d208e7f435dcfac3&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai al mare! 🌊 Non so tu, ma quando vado alla spiaggia voglio proteggere il telefono dall'acqua. Io uso questa borsa e mi trovo benissimo. Se ti va te la passo:"
    },
    // BIBITE - PRODOTTI ANCORA PER TUTTE LE COMBO (rotazione)
    "coca_cola_zero": {
        nome: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
        categoria: ["mare", "pc", "outdoor", "caldo", "fitness"],
        tag: ["senza zucchero", "rinfrescante", "classica", "analcolica"],
        descrizione: "Rinfrescante senza zuccheri, perfetta per idratarsi in ogni situazione.",
        link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl",
        messaggio: "Tipo che giornata calda, ci vorrebbe proprio una bevanda fresca. E poi io uso la Coca-Cola Zero per rinfrescarmi, se le vuoi ti do il link."
    },
    "pepsi_max": {
        nome: "Pepsi Max",
        categoria: ["mare", "pc", "outdoor", "caldo", "fitness"],
        tag: ["senza zucchero", "rinfrescante", "classica", "analcolica"],
        descrizione: "Rinfrescante senza zuccheri, perfetta per idratarsi in ogni situazione.",
        link: "https://www.amazon.it/Pepsi-Max-Bevanda-Analcolica-Zucchero/dp/B08VVTS94X?&linkCode=ll2&tag=l0c39-21&linkId=3b6054372f292480c97d501dcdb834b6&ref=_as_li_ss_tl",
        messaggio: "Tipo che giornata calda, ci vorrebbe proprio una bevanda fresca. E poi io uso la Pepsi Max per rinfrescarmi, se le vuoi ti do il link."
    },
    "oransoda_zero": {
        nome: "Oransoda Zero",
        categoria: ["mare", "pc", "outdoor", "caldo", "fitness"],
        tag: ["senza zucchero", "rinfrescante", "aranciata", "analcolica"],
        descrizione: "Bevanda gassata all'arancia senza zuccheri, con succo di arance siciliane e senza coloranti.",
        link: "https://www.amazon.it/allArancia-Loriginale-Aranciata-Siciliane-Coloranti/dp/B0CX6RN9NL?pd_rd_w=2yHUJ&content-id=amzn1.sym.bebcaae8-85b9-4944-951b-8428874a124f&pf_rd_p=bebcaae8-85b9-4944-951b-8428874a124f&pf_rd_r=PFFA4DDBKXSVN2FC1H25&pd_rd_wg=D1XOt&pd_rd_r=50121f40-c47e-4f48-985d-f0021d428a7e&pd_rd_i=B0CX6HFND3&th=1&linkCode=ll2&tag=l0c39-21&linkId=d713fc75412235936992a0b962276211&ref=_as_li_ss_tl",
        messaggio: "Tipo che giornata calda, ci vorrebbe proprio un'aranciata fresca. E poi io uso la Oransoda Zero per rinfrescarmi, è l'originale aranciata italiana con succo di arance siciliane, se la vuoi ti do il link."
    },
    "estathe_limone": {
        nome: "Estathé Limone",
        categoria: ["mare", "pc", "outdoor", "caldo", "fitness"],
        tag: ["rinfrescante", "the freddo", "senza glutine", "analcolica"],
        descrizione: "The freddo con vero infuso di foglie di the e succo di limone, bevanda analcolica senza glutine.",
        link: "https://www.amazon.it/Estath%C3%A9-Limone-Bevanda-Analcolica-Bottiglie/dp/B01FSBKG86?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2M2BPCA8TOUV7&dib=eyJ2IjoiMSJ9.FiNkIUSC2dwiAjBv-vwb_T3iFcvkm0npGXqMDbFNVPHWAcA1wkohMXDWHejOQDZWyh70zaxkQ2MOcFmC69W-fBS02NXayRXQ0e05HcnY1lpndp8Km8d3wjj_r1RbAbSGRRuvelDnV5XzWh4HerpW2finqRUXql6XNIlDWxMLwqzfUSODU8Zl8pXJeDp-q552nnxXc7RRrEi9cyMbCbaBAeacsaEavHwkOVnYwOPF5CgR1xrsXM8MgbIythzF2UHCbEK6EsPn8hFo9C3Jd5vp6Ozy04zf2QYV2oljYBBrr-4.EwmWYge8TR116AjrwsL1YWZOEEZvDZqtRxDEMg5qWZs&dib_tag=se&keywords=bevande&qid=1779666721&rdc=1&sprefix=bevande%2Caps%2C191&sr=8-6&th=1&linkCode=ll2&tag=l0c39-21&linkId=d38ff5ede0fca7fc29fe28063906cdf9&ref=_as_li_ss_tl",
        messaggio: "Tipo che giornata calda, ci vorrebbe proprio un the freddo. E poi io uso la Estathé Limone, è il the freddo con vero infuso di foglie di the e succo di limone, se lo vuoi ti do il link."
    },
    "hipro_drink": {
        nome: "HiPRO Drink Liquido",
        categoria: ["fitness"],
        tag: ["proteica", "sportiva", "senza zuccheri", "analcolica"],
        descrizione: "Bevanda proteica liquida con 25g di proteine al gusto fragola e lampone, senza lattosio e senza zuccheri aggiunti.",
        link: "https://www.amazon.it/dp/B07Z42P2RG?ie=UTF8&psc=1&pf_rd_p=79495992-24b1-4ab4-b453-790923215720&pf_rd_r=KZBA5VTTAYAD8EHRAXN5&pd_rd_wg=CdEOt&pd_rd_w=8BYvX&pd_rd_r=32878f6d-474d-43e9-99c1-9a4d9f2163bd&fpw=alm&almBrandId=QW1hem9uIEZyZXNo&aref=D92tQNMbIG&linkCode=ll2&tag=l0c39-21&linkId=11a56cb96b04f077bf5b107363f96f01&ref=_as_li_ss_tl",
        messaggio: "Tipo che ti alleni forte! 💪 Hai bisogno di proteine per il recupero. E poi io uso la HiPRO Drink Liquido, ha 25g di proteine al gusto fragola e lampone, senza zuccheri, se la vuoi ti do il link."
    },
    "red_bull": {
        nome: "Red Bull Energy Drink, 250 ml (24 Lattine)",
        categoria: ["fitness"],
        tag: ["energetica", "sportiva", "caffeina", "analcolica"],
        descrizione: "Bevanda energetica per sportivi, perfetta per allenamenti intensi.",
        link: "https://www.amazon.it/Red-Bull-Energy-Cartone-Lattine/dp/B01G7F3UGC?th=1&linkCode=ll2&tag=l0c39-21&linkId=5d2abd95aeb04ce933f0f60e9aeab00f&ref=_as_li_ss_tl",
        messaggio: "Tipo che ti alleni forte! 💪 Non so tu, ma quando faccio sport ho bisogno di energia. Io uso Red Bull per avere la carica giusta, se la vuoi ti do il link."
    },
    "enervit_isotonic": {
        nome: "Enervit Isotonic Drink Limone",
        categoria: ["fitness"],
        tag: ["isotonica", "sportiva", "sali minerali", "analcolica"],
        descrizione: "Bevanda isotonica con sali minerali, ideale per idratazione durante sport.",
        link: "https://www.amazon.it/Enervit-Spa-Isotonic-Drink-Limone/dp/B07DTBVP4T?th=1&linkCode=ll2&tag=l0c39-21&linkId=70e15dc5129cb5e69e8fb461ec37e8b6&ref=_as_li_ss_tl",
        messaggio: "Tipo che ti alleni forte! 💪 Non so tu, ma quando faccio sport ho bisogno di idratarmi bene. Io uso Enervit Isotonic per i sali minerali, se la vuoi ti do il link."
    },
    "powerbar_isoactive": {
        nome: "PowerBar Isoactive Red Fruit",
        categoria: ["fitness"],
        tag: ["isotonica", "sportiva", "elettroliti", "analcolica"],
        descrizione: "Bevanda isotonica con 5 elettroliti, perfetta per allenamenti intensi.",
        link: "https://www.amazon.it/PowerBar-Boisson-IsoActive-Fruit-Punch/dp/B078K1VM3M?th=1&linkCode=ll2&tag=l0c39-21&linkId=0e28cc439dc7186dd0fccfa8ef38c2c2&ref=_as_li_ss_tl",
        messaggio: "Tipo che ti alleni forte! 💪 Non so tu, ma quando faccio sport ho bisogno di elettroliti. Io uso PowerBar Isoactive per il recupero, se la vuoi ti do il link."
    },
    "gomo_energy": {
        nome: "GoMo ENERGY Isotonic Sport Drink",
        categoria: ["fitness"],
        tag: ["isotonica", "senza zucchero", "sportiva", "analcolica"],
        descrizione: "Bevanda isotonica senza zucchero, ideale per idratazione sportiva.",
        link: "https://www.amazon.it/GoMo-ENERGY%C2%AE-Isotonic-Sport-Drink/dp/B072KSBLR6?th=1&linkCode=ll2&tag=l0c39-21&linkId=7ff99045649298642b63799c295ddf41&ref=_as_li_ss_tl",
        messaggio: "Tipo che ti alleni forte! 💪 Non so tu, ma quando faccio sport voglio una bevanda leggera. Io uso GoMo ENERGY senza zucchero, se la vuoi ti do il link."
    },
    "gatorade_sport": {
        nome: "Gatorade Sport Drink",
        categoria: ["fitness"],
        tag: ["sportiva", "elettroliti", "idratazione", "analcolica"],
        descrizione: "Bevanda sportiva con elettroliti, perfetta per idratazione durante allenamento.",
        link: "https://www.amazon.it/dp/B0D2Y3PZTR?ie=UTF8&pf_rd_p=79495992-24b1-4ab4-b453-790923215720&pf_rd_r=HAB68W7XNMNKX1NHE4AT&pd_rd_wg=avtw4&pd_rd_w=z072w&pd_rd_r=c153241b-2ce3-4a61-8ded-8bc8f3e2bed6&aref=Xu76ZS3xYo&th=1&linkCode=ll2&tag=l0c39-21&linkId=4821d146bb6000dae4f6f957628343ea&ref=_as_li_ss_tl",
        messaggio: "Tipo che ti alleni forte! 💪 Non so tu, ma quando faccio sport ho bisogno di elettroliti. Io uso Gatorade per l'idratazione, se la vuoi ti do il link."
    },
    "fanta_original": {
        nome: "Fanta Original",
        categoria: ["mare", "pc", "outdoor", "caldo", "fitness"],
        tag: ["rinfrescante", "frizzante", "classica", "analcolica"],
        descrizione: "Rinfrescante con conservanti riciclabili, perfetta per idratarsi.",
        link: "https://www.amazon.it/Fanta-Original-Conservanti-riciclabile-Rinfrescante/dp/B0F94MN626?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1HR7JN29WYCBX&dib=eyJ2IjoiMSJ9.ket8bDGPzYBVQ0VBune4Cmai9z_JdmDC0eSOFhL9VO-7sgCUeaslCtLfuKvyo7fno3YeMbEZJmY10LFSWBnJJyJVzvDcltSVpj6-Y2UlsYMzb89ySIeACW709mMjlx5PtN6tJTIDeISGt_8tYa3GS-890-Tu0SyPGcJltnYdFVgBHsg17aunaKJft4cPG19uLsLUW8VqqW2Ew75rUZER1fL4wdYd-2viAbj8aFztI9ejczJ5iLbvkjZEeKNsag5JmMzJWgQsVSpe_zLN4ghWHtU7zy8ElbF0Fnj6CIel_mg.FcwOWAqJqxLwbDhxDkb2drp-4cqdADSo0au0eZyobQs&dib_tag=se&keywords=bibite%2Bpacchi&qid=1779582795&rdc=1&sprefix=bibite%2Bpacchi%2Caps%2C139&sr=8-4-spons&aref=7rIRpk3FXE&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=l0c39-21&linkId=5caf24d3ef7761336f39c4485f57268b&ref=_as_li_ss_tl",
        messaggio: "Tipo che giornata calda, ci vorrebbe proprio una bevanda fresca. E poi io uso la Fanta Original per rinfrescarmi, se le vuoi ti do il link."
    },
    "l_angelica_waterstick": {
        nome: "L'Angelica Waterstick Drenante",
        categoria: ["mare", "pc", "outdoor", "caldo", "fitness"],
        tag: ["drenante", "naturale", "detox", "analcolica"],
        descrizione: "Waterstick drenante contro stanchezza e affaticamento.",
        link: "https://www.amazon.it/LAngelica-Waterstick-Drenante-Stanchezza-Affaticamento/dp/B0D46F19MB?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1HR7JN29WYCBX&dib=eyJ2IjoiMSJ9.ket8bDGPzYBVQ0VBune4Cmai9z_JdmDC0eSOFhL9VO-7sgCUeaslCtLfuKvyo7fno3YeMbEZJmY10LFSWBnJJyJVzvDcltSVpj6-Y2UlsYMzb89ySIeACW709mMjlx5PtN6tJTIDeISGt_8tYa3GS-890-Tu0SyPGcJltnYdFVgBHsg17aunaKJft4cPG19uLsLUW8VqqW2Ew75rUZER1fL4wdYd-2viAbj8aFztI9ejczJ5iLbvkjZEeKNsag5JmMzJWgQsVSpe_zLN4ghWHtU7zy8ElbF0Fnj6CIel_mg.FcwOWAqJqxLwbDhxDkb2drp-4cqdADSo0au0eZyobQs&dib_tag=se&keywords=bibite%2Bpacchi&qid=1779582795&rdc=1&sprefix=bibite%2Bpacchi%2Caps%2C139&sr=8-8&th=1&linkCode=ll2&tag=l0c39-21&linkId=96869b71eb53e48236d136535ae799a8&ref=_as_li_ss_tl",
        messaggio: "Tipo che giornata calda, ci vorrebbe proprio una bevanda fresca. E poi io uso l'Angelica Waterstick per rinfrescarmi, se le vuoi ti do il link."
    },
    "jamaica_zenzero": {
        nome: "Jamaica Bibita Analcolica Zenzero",
        categoria: ["mare", "pc", "outdoor", "caldo", "fitness"],
        tag: ["naturale", "zenzero", "analcolica", "rinfrescante"],
        descrizione: "Bibita analcolica allo zenzero, rinfrescante e naturale.",
        link: "https://www.amazon.it/Jamaica-Bibita-analcolica-zenzero-lattine/dp/B006R638VY?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1HR7JN29WYCBX&dib=eyJ2IjoiMSJ9.ket8bDGPzYBVQ0VBune4Cmai9z_JdmDC0eSOFhL9VO-7sgCUeaslCtLfuKvyo7fno3YeMbEZJmY10LFSWBnJJyJVzvDcltSVpj6-Y2UlsYMzb89ySIeACW709mMjlx5PtN6tJTIDeISGt_8tYa3GS-890-Tu0SyPGcJltnYdFVgBHsg17aunaKJft4cPG19uLsLUW8VqqW2Ew75rUZER1fL4wdYd-2viAbj8aFztI9ejczJ5iLbvkjZEeKNsag5JmMzJWgQsVSpe_zLN4ghWHtU7zy8ElbF0Fnj6CIel_mg.FcwOWAqJqxLwbDhxDkb2drp-4cqdADSo0au0eZyobQs&dib_tag=se&keywords=bibite+pacchi&qid=1779582795&sprefix=bibite+pacchi%2Caps%2C139&sr=8-9&linkCode=ll2&tag=l0c39-21&linkId=c08e0e25f8bb7282d7653fdca0c2e473&ref=_as_li_ss_tl",
        messaggio: "Tipo che giornata calda, ci vorrebbe proprio una bevanda fresca. E poi io uso la Jamaica allo zenzero per rinfrescarmi, se le vuoi ti do il link."
    },
    // FITNESS CASA
    "namedsport_proteinbar": {
        nome: "NAMEDSPORT Proteinbar",
        categoria: "fitness",
        descrizione: "Barretta energetica con 35% di proteine, ideale come spuntino o post workout.",
        link: "https://www.amazon.it/dp/B088CBGH2Y?ascsubtag=srctok-03e71a251493ad36&btn_ref=srctok-03e71a251493ad36&th=1&linkCode=ll2&tag=l0c39-21&linkId=e182e40481fe0812ca7512c0fde7f20b&ref=_as_li_ss_tl",
        messaggio: "Barretta proteica di alta qualità per il tuo allenamento."
    },
    "optimum_creatina": {
        nome: "Optimum Nutrition Creatina Monoidrata",
        categoria: "fitness",
        descrizione: "Creatina micronizzata al 100% per migliorare forza e performance muscolare.",
        link: "https://www.amazon.it/dp/B00T7L20AQ?th=1&linkCode=ll2&tag=l0c39-21&linkId=425913cbbff678f4faae0baf8f6c7bb4&ref=_as_li_ss_tl",
        messaggio: "Creatina pura per massimizzare forza e recupero muscolare."
    },
    "optimum_preworkout": {
        nome: "Optimum Nutrition Gold Standard Pre-Workout",
        categoria: "fitness",
        tag: ["pre-workout", "energetica", "caffeina", "fitness"],
        descrizione: "Pre-workout con creatina e caffeina per massimizzare performance e forza.",
        link: "https://www.amazon.it/Optimum-Nutrition-Standard-allenamento-ingredienti/dp/B00TFB0YTM?th=1&linkCode=ll2&tag=l0c39-21&linkId=0d889a2ab529400f6f01a4e005947cae&ref=_as_li_ss_tl",
        messaggio: "Pre-workout per avere energia e carica prima dell'allenamento."
    },
    "gg4lab_preworkout": {
        nome: "GG4Lab Preworkout con Creatina, Citrullina, Beta Alanine",
        categoria: "fitness",
        tag: ["pre-workout", "creatina", "citrullina", "fitness"],
        descrizione: "Pre-workout con creatina, citrullina e beta alanine per carica istantanea.",
        link: "https://www.amazon.it/GG4Lab-Preworkout-Muscolare-Creatina-Citrullina/dp/B0DQ1WMP29?&linkCode=ll2&tag=l0c39-21&linkId=270653c4a896968edcccf97deff3762b&ref=_as_li_ss_tl",
        messaggio: "Pre-workout completo per spingere l'allenamento al limite."
    },
    "bandini_creatina": {
        nome: "Bandini Creatine Monohydrate 100% Pure",
        categoria: "fitness",
        tag: ["creatina", "fitness", "pura", "vegan"],
        descrizione: "Creatina monoidrata 100% pura per training e sport, con dosatore incluso.",
        link: "https://www.amazon.it/Creatina-Micronizzata-Monoidrata-Polvere-grammi/dp/B09X5YJQLV?&linkCode=ll2&tag=l0c39-21&linkId=3f36198678a2403420afda6fd31a2007&ref=_as_li_ss_tl",
        messaggio: "Creatina pura per migliorare performance in allenamenti intensi."
    },
    // SMART HOME DOMOTICA
    "philips_hue": {
        nome: "Philips Hue White & Color Ambiance Starter Kit 2 Lampadine",
        categoria: "smart-home",
        descrizione: "Kit illuminazione intelligente con 2 lampadine Smart, Hue Bridge e telecomando Smart Button inclusi, Bluetooth.",
        link: "https://www.amazon.it/Lampadina-Lampadine-Telecomando-Dimmerabili-Bluetooth/dp/B099NRLRG3?th=1&linkCode=ll2&tag=l0c39-21&linkId=219c8455668c9752a083f2fba067000b&ref=_as_li_ss_tl",
        messaggio: "Illuminazione smart per la tua casa."
    },
    "tapo_presa_smart": {
        nome: "Tapo Presa Smart con Monitoraggio Consumo",
        categoria: "smart-home",
        descrizione: "Presa intelligente WiFi compatibile con Alexa e Google Home. Controllo remoto, programmazione oraria, monitoraggio consumo.",
        link: "https://www.amazon.it/Tapo-Monitoraggio-Intelligente-Compatibile-Preselezione/dp/B0CHFJ7V3J?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2OJTEON8O297M&dib=eyJ2IjoiMSJ9.dWtkMjCLn9aCjl0wCvqQXgrHNqmwuu1ikYJCky2J2kdM1V_OJiW8EWQ3ceEBY1MC1S7EWkMx6UdbKc6MpdoYxs7IYVfYKTBgJ5v9i-DTzlUFu3njz0ZNHz9wm1oatuNN4WETv5ath3X0JxkjtuFrwfTOD2ldbI3_aaT35Rqjur7UYf4kB22ONLfXaK6UjDyJtulRvvt4tipYSPj3VAfcDnpGuc5BrL_ZnC5lpGClQ44mLoDxA7X68wEKQWZ6b3vQhKw12cLH3WZmY7AaUYlPLZN4YdGjMCYCUtH-2AZaGAA.-AB66Zbc9avjnlaPJy3eTR-q7yLclHOBAgq3YpyeBbA&dib_tag=se&keywords=smart&qid=1777897538&sprefix=smart%2B%2Caps%2C166&sr=8-6&th=1&linkCode=ll2&tag=l0c39-21&linkId=c150503bd157e5c4f2b5b32caf1e9058&ref=_as_li_ss_tl",
        messaggio: "Presa smart per controllo remoto e monitoraggio consumo."
    },
    "amazon_basics_presa": {
        nome: "Amazon Basics Presa Intelligente Singola",
        categoria: "smart-home",
        descrizione: "Presa smart WiFi per Alexa senza hub. Ingombro limitato, controllo remoto, routine giornaliere.",
        link: "https://www.amazon.it/Amazon-Basics-intelligente-singola-confezione/dp/B0CMXNWCVP?mcid=9e2aa91a1c8d3bcbaef8d22ed1555743&hvadid=705743448845&hvpos=&hvnetw=g&hvrand=3521815141531840554&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9190900&hvtargid=pla-2347766460617&hvocijid=3521815141531840554-B0CMXNWCVP-&hvexpln=0&th=1&linkCode=ll2&tag=l0c39-21&linkId=e9d8c1168729535c8e5f367cfbc39448&ref=_as_li_ss_tl",
        messaggio: "Presa smart Amazon Basics compatibile Alexa."
    },
    "tp_link_p105": {
        nome: "TP-Link Tapo P105 Presa Smart Italiana",
        categoria: "smart-home",
        descrizione: "Presa WiFi intelligente compatibile Google Home e Amazon Alexa. Modalità assenza, timer programmazione.",
        link: "https://www.amazon.it/TP-Link-Intelligente-Compatibile-Controllo-tramite/dp/B07Z5JD3T4?pd_rd_w=e2dzD&content-id=amzn1.sym.1f3c1772-ccf5-4aa2-abc0-5bb5851fb447&pf_rd_p=1f3c1772-ccf5-4aa2-abc0-5bb5851fb447&pf_rd_r=F4ATCRT21RHMY22PYNGP&pd_rd_wg=zWCfO&pd_rd_r=6b4f6f0e-40f4-4bc2-ae48-0d834bc5e132&pd_rd_i=B07Z5JD3T4&th=1&linkCode=ll2&tag=l0c39-21&linkId=e4dd22dc612200b8b487d3965d6fb599&ref=_as_li_ss_tl",
        messaggio: "Presa smart TP-Link compatibile tutte le spine italiane."
    },
    "echo_dot_max": {
        nome: "Echo Dot Max Alexa",
        categoria: "smart-home",
        descrizione: "Altoparlante intelligente con assistente vocale Alexa. Audio premium, hub casa intelligente integrato.",
        link: "https://www.amazon.it/echo-dot-max/dp/B0DKLDMHYB?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=VGVLPWDE291C&dib=eyJ2IjoiMSJ9.zYeRUCSdJcAUhnVXvl4Poxnjo4taik9-sEWyw5aw3gBoMG-HoGA6vqR7pBWK_5FdZw2hBzxSrolbrS9VW-XaHdXxN9l0Zv6wFdQyXdlrbj2D6AC2NzrwV_Xhfooioc_kYDZKBWC1MtunEV7a2lXifq9SeAkvSCSNtM-17EIAqtN8odNJ4K5HT5VJoP-uvxxyGLECMo5c8a1idko1GzcEbSIMvvB98cVIiXbWiN3ka1Jb6d8hjsOTkrULiJGl13Rpj0H57D0sJb9M1qtTW_uqFDi669VgMKQ-8HMA89bk8oY.QiN_0D7vxwblphZpC_HwFr7q1Gfg4cFicZIShfXPxKI&dib_tag=se&keywords=alexa&qid=1777897593&sprefix=alexa%2Caps%2C155&sr=8-11&ufe=app_do%3Aamzn1.fos.7cf526d8-b33c-4cc8-8e05-b9df5480d46b&th=1&linkCode=ll2&tag=l0c39-21&linkId=8dfeb0081aa8558b0fb4e680bad53dde&ref=_as_li_ss_tl",
        messaggio: "Echo Dot con Alexa per controllo vocale e musica."
    },
    "broadlink_telecomando": {
        nome: "Broadlink Telecomando Universale Infrarossi",
        categoria: "smart-home",
        descrizione: "Telecomando universale per TV, ventilatori. Controllo vocale Alexa/Google, compatibile 80.000+ dispositivi.",
        link: "https://www.amazon.it/Broadlink-Telecomando-Universale-Infrarossi-Ventilatori/dp/B0F8Q9MRHM?dib=eyJ2IjoiMSJ9.Dx7C1e0JYqrvymxrTkk1DdPXopxEbaELZWfriTBEhJX39rfM3be8-Y63a0sjxrzTxYXt-XN52ylfn-vu_U4FUFG9f27CGQ52VeNVwCzR6yoGAiJC5xRaTPsGCvgMo6SemRoEm5VOIthUcsZKrBDFZhtf73LYrMD_VIDGF_9p0ISb2XIqjnB7FmPQyMCaqgSJ4jdd-5uZAlcT40ZdC-sImnhCj7KVaQpoQoPVL-LdTV4FmKyL2lUWq9DpVRs-SQpR5xIbBTArOD8DqnaN46XnM06M5Ts1FHihKayXJkGKf3g.ltB2Oe3U9hcN12g3Nj5pc9tFdB8Q52CB4QLY5u8T_QI&dib_tag=se&keywords=smart%2Bhome&qid=1778008692&sr=8-2-spons&aref=sl8qYRQp9L&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=l0c39-21&linkId=9ba47a905d8237d3baa2483ebf79d805&ref=_as_li_ss_tl",
        messaggio: "Telecomando universale per controllo dispositivi IR."
    },
    "telecomando_condizionatore": {
        nome: "Telecomando Universale Infrarossi Condizionatore",
        categoria: "smart-home",
        descrizione: "Telecomando universale per condizionatori. Compatibile tutte le marche, controllo vocale app.",
        link: "https://www.amazon.it/Telecomando-Universale-Infrarossi-Condizionatore-Utilizzando/dp/B0CW1NHM2W?dib=eyJ2IjoiMSJ9.Dx7C1e0JYqrvymxrTkk1DdPXopxEbaELZWfriTBEhJX39rfM3be8-Y63a0sjxrzTxYXt-XN52ylfn-vu_U4FUFG9f27CGQ52VeNVwCzR6yoGAiJC5xRaTPsGCvgMo6SemRoEm5VOIthUcsZKrBDFZhtf73LYrMD_VIDGF_9p0ISb2XIqjnB7FmPQyMCaqgSJ4jdd-5uZAlcT40ZdC-sImnhCj7KVaQpoQoPVL-LdTV4FmKyL2lUWq9DpVRs-SQpR5xIbBTArOD8DqnaN46XnM06M5Ts1FHihKayXJkGKf3g.ltB2Oe3U9hcN12g3Nj5pc9tFdB8Q52CB4QLY5u8T_QI&dib_tag=se&keywords=smart+home&qid=1778008692&sr=8-4-spons&aref=xNvPc26oEh&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1&linkCode=ll2&tag=l0c39-21&linkId=1c50041c3d94a94ab36563340b658a09&ref=_as_li_ss_tl",
        messaggio: "Telecomando universale per condizionatori."
    },
    // PET CARE INTELLIGENTE
    "petkit_pura": {
        nome: "PETKIT Pura Max 2 Lettiera Gatto Autopulente",
        categoria: "pet-care",
        descrizione: "Lettiera autopulente con controllo app e design moderno.",
        link: "https://www.amazon.it/PETKIT-Autopulente-Automatica-Antiodore-Controllo/dp/B0D9QJZ7FG?&linkCode=ll2&tag=l0c39-21&linkId=2db071e67a1cd179da498fe5a20b50a3&ref=_as_li_ss_tl",
        messaggio: "Lettiera autopulente per il comfort del tuo gatto."
    },
    "fockety_mangiatoia": {
        nome: "Fockety Mangiatoia Automatica per Gatti",
        categoria: "pet-care",
        descrizione: "Mangiatoia automatica con timer per alimentazione programmata.",
        link: "https://www.amazon.it/dp/B0D6WBXY8M?&linkCode=ll2&tag=l0c39-21&linkId=7ebc2a8ea2ea3e0228163422202800a8&ref=_as_li_ss_tl",
        messaggio: "Mangiatoia automatica per l'alimentazione regolare."
    },
    // CINEMA TV
    "samsung_qled": {
        nome: "Proiettore Videoproiettore TOPTRO Smartphone Correzione",
        categoria: "cinema",
        descrizione: "Proiettore 4K con correzione keystone e compatibilità smartphone.",
        link: "https://www.amazon.it/Proiettore-Videoproiettore-TOPTRO-Smartphone-Correzione/dp/B0CKRPTF4L?&linkCode=ll2&tag=l0c39-21&linkId=f77e39ffd9666af65f40632c408f8e8f&ref=_as_li_ss_tl",
        messaggio: "Proiettore 4K per la migliore esperienza home cinema."
    },
    // SMARTPHONE TECH
    "iphone_15": {
        nome: "Cofanetto Orologio gioielli Collana Anello Orecchini",
        categoria: "cinema",
        descrizione: "Cofanetto gioielli elegante con collana, anello e orecchini.",
        link: "https://www.amazon.it/Cofanetto-Orologio-gioielli-Collana-Anello-Orecchini/dp/B07795PQDW?&linkCode=ll2&tag=l0c39-21&linkId=d7b42d25253d1f8f15e6f5ac077c9b2b&ref=_as_li_ss_tl",
        messaggio: "Cofanetto gioielli per completare il tuo stile."
    },
    // TECH
    "airpods_pro": {
        nome: "HyperX Cloud Cuffie Gaming",
        categoria: "tech",
        descrizione: "Cuffie gaming wireless con cancellazione rumore attiva.",
        link: "https://www.amazon.it/HyperX-Cloud-Cuffie-Gaming-Mobile/dp/B00SAYCVTQ?mcid=c659dba90f523f5ca09a82b25c56a3e6&hvadid=700813659493&hvpos=&hvnetw=g&hvrand=12981572348516290815&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9190900&hvtargid=pla-381707145357&hvocijid=12981572348516290815-B00SAYCXWG-&hvexpln=0&th=1&linkCode=ll2&tag=l0c39-21&linkId=4e8af65a5e14abb66fa2f74389a0d44c&ref=_as_li_ss_tl",
        messaggio: "Cuffie gaming premium per audio di qualità."
    },
    // MODA DONNA
    "borsa_michael_kors": {
        nome: "Tods Donna Mocassino Platform Mascherina",
        categoria: "moda-donna",
        descrizione: "Mocassino elegante con platform e mascherina.",
        link: "https://www.amazon.it/Tods-Donna-Mocassino-Platform-Mascherina/dp/B0C3VZRYSG?th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=d51d2c599eb07e84ba1c51057afbfd9b&ref=_as_li_ss_tl",
        messaggio: "Mocassino elegante per completare il tuo look."
    },
    // MODA UOMO
    "cintura_hugo_boss": {
        nome: "Smanicato Invernale Pullover Maglione Autunnale",
        categoria: "moda-uomo",
        descrizione: "Smanicato invernale in pile per la stagione fredda.",
        link: "https://www.amazon.it/Smanicato-Invernale-Pullover-Maglione-Autunnale/dp/B0FNX784MK?&linkCode=ll2&tag=l0c39-21&linkId=048b7f63ab1f4a17764d337ef7f27e89&ref=_as_li_ss_tl",
        messaggio: "Smanicato elegante per lo stile maschile."
    },
    // ARREDAMENTO CASA
    "tavolo_extensible": {
        nome: "Nobleza Acquario Illuminazione Filtraggio Integrato",
        categoria: "pet-care",
        descrizione: "Acquario completo con illuminazione e filtraggio integrato.",
        link: "https://www.amazon.it/Nobleza-Acquario-Illuminazione-Filtraggio-Integrato/dp/B0BQBRP9C1?th=1&linkCode=ll2&tag=l0c39-21&linkId=d54870a7ff8f4cebfa5d37d47b4c955a&ref=_as_li_ss_tl",
        messaggio: "Acquario elegante per il tuo animale domestico."
    },
    // ACCESSORI MODA
    "occhiali_da_sole": {
        nome: "House Dragon Logo Maglietta",
        categoria: "accessori",
        descrizione: "Maglietta con logo House of the Dragon.",
        link: "https://www.amazon.it/House-Dragon-Logo-Maglietta/dp/B0B8BKK2Y5?customId=B07536XX75&customizationToken=MC_Assembly_1%23B07536XX75&th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=2ac7e3075294df95cc459e2e771892c8&ref=_as_li_ss_tl",
        messaggio: "Maglietta iconica per proteggere gli occhi."
    },
    // BENESSERE CURA PERSONALE
    "spazzola_elettrica": {
        nome: "Panathletic Elastici Fitness Set Bande",
        categoria: "fitness",
        descrizione: "Set di elastici fitness per allenamento a casa.",
        link: "https://www.amazon.it/Panathletic-Elastici-Fitness-Set-Bande/dp/B016A9IUWY?th=1&linkCode=ll2&tag=l0c39-21&linkId=6dbdcb8523b4ed784a7fc3eb1c446af1&ref=_as_li_ss_tl",
        messaggio: "Elastici fitness per allenamento a casa."
    },
    // GIOCHI DA TAVOLO
    "monopoly": {
        nome: "2024 Player's Handbook (Dungeons & Dragons Core Rulebook)",
        categoria: "giochi",
        descrizione: "Manuale del giocatore per Dungeons & Dragons 2024.",
        link: "https://www.amazon.it/Players-Handbook-Dungeons-Rulebook-Versione/dp/0786969512?&linkCode=ll2&tag=l0c39-21&linkId=a8d3cd623c05cc0d58f98cff434b4032&ref=_as_li_ss_tl",
        messaggio: "Player's Handbook per sessioni D&D epiche."
    },
    // LIBRI EREADER
    "kindle_paperwhite": {
        nome: "Daydreamer ali del sogno Aa Vv",
        categoria: "libri",
        descrizione: "Romanzo bestseller italiano.",
        link: "https://www.amazon.it/Daydreamer-ali-del-sogno-Aa-Vv/dp/8804736178?crid=3TY5QGE8F68AR&dib=eyJ2IjoiMSJ9.cXKxgSe7W5q94BO5HgbZtidoyLEM8uNIWo3jVoXlhXbs9nPD9XofsxXLYUJl3UVP.Ak-bbQQ0ptrC57kwQWUouMCFpXxRoI_87EZGljBiaZI&dib_tag=se&keywords=libri+daydreamer+le+ali+del+sogno&qid=1778003739&sprefix=libri+le+ali++%2Caps%2C141&sr=8-1&linkCode=ll2&tag=l0c39-21&linkId=58bf6a65290c6dde0cda8cfa27d163e1&ref=_as_li_ss_tl",
        messaggio: "Romanzo bestseller per leggere ovunque."
    },
    // PROFUMI BELLEZZA
    "dior_sauvage": {
        nome: "Money Heist Bella Ciao Maglietta",
        categoria: "cinema",
        descrizione: "Maglietta con scritta Bella Ciao da La Casa di Carta.",
        link: "https://www.amazon.it/Money-Heist-Bella-Ciao-Maglietta/dp/B082GP349M?&linkCode=ll2&tag=l0c39-21&linkId=c7687ca429ed6f36a502f2362589f246&ref=_as_li_ss_tl",
        messaggio: "Maglietta iconica per fan de La Casa di Carta."
    },
    // ABBIGLIAMENTO LAVORO
    "scarpe_antinfortunistiche": {
        nome: "Joma Nobel Allenamento Unisex Adulto",
        categoria: "fitness",
        descrizione: "Scarpe da allenamento per fitness e sport.",
        link: "https://www.amazon.it/Joma-Nobel-Allenamento-Unisex-Adulto/dp/B00IXMBTKC?th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=67de91ddab09a654c237fb9f253e9dfc&ref=_as_li_ss_tl",
        messaggio: "Scarpe da allenamento sicure e confortevoli."
    },
    "beta_scarpe_antinfortunistiche": {
        nome: "BETA 7352A Scarpe Antinfortunistiche",
        categoria: "lavoro",
        descrizione: "Scarpe antinfortunistiche con tessuto mesh ad alta traspirazione, punta in acciaio.",
        link: "https://www.amazon.it/BETA-7352A-Antinfortunistiche-Tessuto-Mesh-Alta-Traspirazione/dp/B084J5FKMC?th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=4def01942ae31959c75d370229a008f4&ref=_as_li_ss_tl",
        messaggio: "Scarpe antinfortunistiche leggere e traspiranti."
    },
    "casco_ventilato_sicurezza": {
        nome: "Casco Protettivo Ventilato Sicurezza Industriale",
        categoria: "lavoro",
        descrizione: "Casco di sicurezza ventilato per lavori edili e industriali, con visiera.",
        link: "https://www.amazon.it/protettivo-ventilato-sicurezza-industriale-costruzione/dp/B0C4PBDGTL?th=1&linkCode=ll2&tag=l0c39-21&linkId=5cd8e28c76d56c640992ccb2c820dc43&ref=_as_li_ss_tl",
        messaggio: "Casco di sicurezza ventilato per lavori industriali."
    },
    "casco_universale_sicurezza": {
        nome: "Casco Protettivo Sicurezza Universale",
        categoria: "lavoro",
        descrizione: "Casco di sicurezza universale per ponteggi e lavori commerciali, materiale ABS resistente.",
        link: "https://www.amazon.it/protettivo-sicurezza-universale-ponteggi-commercianti/dp/B0CDBH4K61?th=1&linkCode=ll2&tag=l0c39-21&linkId=081330ca1e10c747973f0d4f71357c14&ref=_as_li_ss_tl",
        messaggio: "Casco di sicurezza universale per ponteggi."
    },
    "guanti_lavoro_sicurezza": {
        nome: "Guanti da Lavoro Sicurezza",
        categoria: "lavoro",
        descrizione: "Guanti da lavoro per sicurezza e protezione.",
        link: "https://www.amazon.it/dp/B079D8H1FW?ie=UTF8&pd_rd_plhdr=t&aref=ZYukvHlh3A&th=1&linkCode=ll2&tag=l0c39-21&linkId=5e337ad376b801c0bb460f88aacd49de&ref=_as_li_ss_tl",
        messaggio: "Guanti da lavoro per protezione sicura."
    },
    "gilet_alta_visibilita": {
        nome: "Gilet Alta Visibilità Sicurezza",
        categoria: "lavoro",
        descrizione: "Gilet ad alta visibilità per sicurezza sul lavoro.",
        link: "https://www.amazon.it/dp/B09CD49XP2?ie=UTF8&pd_rd_plhdr=t&aref=spmAm7G9kJ&th=1&linkCode=ll2&tag=l0c39-21&linkId=df5a6ee1b4bba2bf87fffc3bf7f9b751&ref=_as_li_ss_tl",
        messaggio: "Gilet alta visibilità per sicurezza sul lavoro."
    },
    "pantaloni_cargo_tattici": {
        nome: "Pantaloni Cargo Tattici da Lavoro",
        categoria: "lavoro",
        descrizione: "Pantaloni cargo tattici da lavoro con tasche multiple per strumenti.",
        link: "https://www.amazon.it/dp/B0FQ69B1ZT?th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=9008b58b98302d63fda3f36d48d509e8&ref=_as_li_ss_tl",
        messaggio: "Pantaloni cargo tattici con tasche multiple."
    },
    "pantaloni_cargo_multiuso": {
        nome: "Pantaloni Cargo Multiuso",
        categoria: "lavoro",
        descrizione: "Pantaloni cargo multiuso per lavoro e outdoor, tasche multiple.",
        link: "https://www.amazon.it/dp/B09V1C6JM1?ie=UTF8&psc=1&pd_rd_plhdr=t&aref=qYkLSxXBJw&linkCode=ll2&tag=l0c39-21&linkId=f0fcaa3dd347facf30b8f44d5ba84555&ref=_as_li_ss_tl",
        messaggio: "Pantaloni cargo multiuso per lavoro e outdoor."
    },
    "pantaloni_cargo_ginocchiere": {
        nome: "BLACK HAMMER Pantaloni Cargo con Ginocchiere",
        categoria: "lavoro",
        descrizione: "Pantaloni cargo con ginocchiere rinforzate per lavori pesanti.",
        link: "https://www.amazon.it/BLACK-HAMMER-Rinforzati-Ginocchiere-Abbigliamento/dp/B08KPKLG7G?th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=faf5f6b5109f10e849aad33441f4cbed&ref=_as_li_ss_tl",
        messaggio: "Pantaloni cargo con ginocchiere rinforzate."
    },
    "pantaloni_cargo_elasticizzati": {
        nome: "Pantaloni Cargo Elasticizzati",
        categoria: "lavoro",
        descrizione: "Pantaloni cargo elasticizzati con tasche multiple, comfort elevato.",
        link: "https://www.amazon.it/Yekdmxop-Pantaloni-vestibilit%C3%A0-Pantalone-Elasticizzati/dp/B0DXPQZMWF?th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=e326dcb854df59a2d73610fa2304b169&ref=_as_li_ss_tl",
        messaggio: "Pantaloni cargo elasticizzati per comfort."
    },
    // SOSTENIBILITA ECO FRIENDLY
    "borsa_ecologica": {
        nome: "Borsa Ecologica Riutilizzabile",
        categoria: "sostenibilita",
        descrizione: "Borsa in cotone organico per la spesa sostenibile.",
        link: "https://www.amazon.it/dp/B08X3Z4Y5W?th=1&linkCode=ll2&tag=l0c39-21&linkId=mno890pqr901&ref=_as_li_ss_tl",
        messaggio: "Borsa ecologica per ridurre l'impatto ambientale."
    },
    // UFFICIO PRODUTTIVO
    "sedia_ufficio": {
        nome: "Sedia da Ufficio Ergonomica",
        categoria: "ufficio",
        descrizione: "Sedia ergonomica con supporto lombare regolabile.",
        link: "https://www.amazon.it/dp/B08X4Y5Z6W?th=1&linkCode=ll2&tag=l0c39-21&linkId=pqr901stu012&ref=_as_li_ss_tl",
        messaggio: "Sedia ergonomica per lavorare in comfort."
    },
    // VIAGGI VACANZE
    "valigia_rigida": {
        nome: "Samsonite Valigia Rigida",
        categoria: "viaggi",
        descrizione: "Valigia rigida con ruote e lucchetto TSA.",
        link: "https://www.amazon.it/dp/B07Z9Y0X1W?th=1&linkCode=ll2&tag=l0c39-21&linkId=stu012vwx123&ref=_as_li_ss_tl",
        messaggio: "Valigia robusta per i tuoi viaggi."
    },
    // FOTOGRAFIA MOBILE
    "obiettivo_macro": {
        nome: "Obiettivo Macro per Smartphone",
        categoria: "fotografia",
        descrizione: "Lente macro per fotografia ravvicinata con smartphone.",
        link: "https://www.amazon.it/dp/B08X5Z6Y7W?th=1&linkCode=ll2&tag=l0c39-21&linkId=vwx123yzd234&ref=_as_li_ss_tl",
        messaggio: "Obiettivo macro per foto dettagliate."
    },
    // DVD BLURAY
    "box_office": {
        nome: "Box Office Film Collection",
        categoria: "dvd",
        descrizione: "Collezione di film classici in Blu-ray.",
        link: "https://www.amazon.it/dp/B08X6Y7Z8W?th=1&linkCode=ll2&tag=l0c39-21&linkId=yzd234abc345&ref=_as_li_ss_tl",
        messaggio: "Collezione di film per serate cinema a casa."
    },
    // PC GAMING
    "monitor_msi": {
        nome: "MSI Monitor Gaming G255F",
        categoria: "pc",
        descrizione: "Monitor gaming 24.5\" Full HD 170Hz, perfetto per gaming competitivo.",
        link: "https://www.amazon.it/MSI-G255F-1920x1080-Adaptive-Anti-flickr/dp/B0CPM45WF7?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=35WKNR5X9VQ1C&dib=eyJ2IjoiMSJ9.CEYKvsqfqUt9qe9oCFHNWJchYnc0IwRFWfZLLfZ2gHBvIbGFx2NwJ_hFy7My9Tb91cLLE7E_3wwp3pzRc3MW7QyLxslJK_mwNRWD4L4E7GlU0vnoxREvdFy59QUytBf1XwEBRXjG4XqC4ZubUi_zPa8VcHdWssrcXLEyYfApJ8tyFSgJR7MROTAMjGCMb7wakqHSvd2qK7kjod3vZ4_ONOBmIuugeKI4O3ChiZpGKPuNyLX6z4BPu2A3WVyVHLry_GQxpm1qZdPDP2gHxC9vtOIQf4slRG0s5KSAtYNh6ek.zVySrRolhqMb3_WkXh4zVPEc_eAVd72whNXgE3fnjlM&dib_tag=se&keywords=gaming+pc&qid=1777897756&sprefix=gaming+pc%2Caps%2C268&sr=8-58&linkCode=ll2&tag=l0c39-21&linkId=a0070679f86d991fd56e052f851d04a8&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming serio ho bisogno di un buon monitor. Io uso questo MSI e mi trovo benissimo. Se ti va te lo lascio qui:"
    },
    "pc_vibox": {
        nome: "Vibox Gaming PC Ryzen",
        categoria: "pc",
        descrizione: "PC gaming Ryzen con scheda grafica dedicata, 16GB RAM, SSD veloce.",
        link: "https://www.amazon.it/Vibox-Gaming-Ryzen-Windows-Bianco/dp/B0F3JFPYPB?content-id=amzn1.sym.7b21bc1e-c34e-4c30-a298-61b1155df26d%3Aamzn1.sym.7b21bc1e-c34e-4c30-a298-61b1155df26d&dib=eyJ2IjoiMSJ9.zFPQtsCUu7oCCVyk1KsqdLRngA3qVib1W2CQ2-MpbVSumCQtpC87coe-lcOXvvAiffYwoPXX1sZhQ02tYYv-DVGgCS4nzntlgH3jAiFmU5T9D7JT_M47TZi3FzlxPv-iyQy-YVRlsn9iXXbQFzoaRAvlxt3e-Fj054fXRhsf1V2varqou8p7M5OAwSPh-m5J7kSpwFY9XeAs30lWy2_hVqvcYCw6QEhz51neZYuQGrLa5aXLIDVo85dpeKXxedlAZ3j91LjA_a-Dv0Kb_RuRjNjMUZK0jyMyI1RgriGfKk0.0xVLX__vDuxsLOLQZJfGY0mUzPn3XjSmlCvu50NCQQE&dib_tag=se&keywords=pc%2Bgaming&pd_rd_r=ac71ae8d-2abd-4022-b553-4a3c50b71c69&pd_rd_w=bTnhQ&pd_rd_wg=rEwcg&qid=1777897860&sr=8-9&ufe=app_do%3Aamzn1.fos.49a700e5-ae68-4d96-966a-89ca65497504&th=1&linkCode=ll2&tag=l0c39-21&linkId=a7b5e3e24dc98972d68cdfc5f1367040&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming serio ho bisogno di un PC potente. Io uso questo Vibox e mi trovo benissimo. Se ti va te lo lascio qui:"
    },
    "cuffie_ozeino_wireless": {
        nome: "Ozeino Cuffie Gaming Wireless",
        categoria: "pc",
        descrizione: "Cuffie gaming wireless con microfono, perfette per lunghe sessioni.",
        link: "https://www.amazon.it/Wireless-Bluetooth-Microfono-Qualit%C3%A0-Perdita/dp/B0CSFRYL7C?dib=eyJ2IjoiMSJ9.k9jJjxr_TPUcBmjILmStmDH4T8rG90mV2aSuIbaOLMvoWpEW080Nd5Rgi8ABbQd9p6ysELQqCH08c92aW_ImbMVSOCX3uNi8bTWCRhgqsk_RuXud4iCWnhm3_wnxX_k1GRVHk5s4MdbOf-PpNoAQ_q1aIqLwJH6Zm0Z9qecs5WewlsA61_ObpmLLL1bE_fsOuVcuJ6eWh2MyE-Z-YeZARaciPmgVCO1BULWtBvTdnbo.Mish9DdDxXRDJstKkaw5y8tiYmstvSKLHnn_9kXYY64&dib_tag=se&qid=1778017759&refinements=p_36%3A490263031&s=videogames&sr=1-1&th=1&linkCode=ll2&tag=l0c39-21&linkId=bc120fc3245b3ea6114aed01a4b15b3f&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming serio ho bisogno di cuffie wireless. Io uso queste Ozeino e mi trovo benissimo. Se ti va te le lascio qui:"
    },
    "cuffie_ozeino_rgb": {
        nome: "Ozeino Cuffie Gaming RGB",
        categoria: "pc",
        descrizione: "Cuffie gaming RGB con microfono stereo, audio cristallino.",
        link: "https://www.amazon.it/Cuffie-Gaming-Microfono-Stereo-Controllo/dp/B09L89MBVV?dib=eyJ2IjoiMSJ9.k9jJjxr_TPUcBmjILmStmDH4T8rG90mV2aSuIbaOLMvoWpEW080Nd5Rgi8ABbQd9p6ysELQqCH08c92aW_ImbMVSOCX3uNi8bTWCRhgqsk_RuXud4iCWnhm3_wnxX_k1GRVHk5s4MdbOf-PpNoAQ_q1aIqLwJH6Zm0Z9qecs5WewlsA61_ObpmLLL1bE_fsOuVcuJ6eWh2MyE-Z-YeZARaciPmgVCO1BULWtBvTdnbo.Mish9DdDxXRDJstKkaw5y8tiYmstvSKLHnn_9kXYY64&dib_tag=se&qid=1778017759&refinements=p_36%3A490263031&s=videogames&sr=1-6&th=1&linkCode=ll2&tag=l0c39-21&linkId=b6e4d29462633e65a533cfe51233d157&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming serio ho bisogno di cuffie RGB. Io uso queste Ozeino e mi trovo benissimo. Se ti va te le lascio qui:"
    },
    "cuffie_hyperx": {
        nome: "HyperX Cloud Cuffie Gaming",
        categoria: "pc",
        descrizione: "Cuffie gaming comode con audio cristallino, perfette per lunghe sessioni.",
        link: "https://www.amazon.it/HyperX-Cloud-Cuffie-Gaming-Mobile/dp/B00SAYCVTQ?mcid=c659dba90f523f5ca09a82b25c56a3e6&hvadid=700813659493&hvpos=&hvnetw=g&hvrand=12981572348516290815&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9190900&hvtargid=pla-381707145357&hvocijid=12981572348516290815-B00SAYCXWG-&hvexpln=0&th=1&linkCode=ll2&tag=l0c39-21&linkId=4e8af65a5e14abb66fa2f74389a0d44c&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma io odio fermarmi a cercare bar o macchinette quando sono in concentrazione. Per questo mi porto dietro le cuffie HyperX Cloud: con queste ho risolto il problema concentrazione. Se ti va te le lascio qui:"
    },
    "cuffie_hyperx_ii": {
        nome: "HyperX Cloud II",
        categoria: "pc",
        descrizione: "Cuffie gaming 7.1 surround, audio cristallino, microfono rimovibile.",
        link: "https://www.amazon.it/HyperX-Cloud-Cuffie-Gaming-Mobile/dp/B00SAYCVTQ?mcid=c659dba90f523f5ca09a82b25c56a3e6&hvadid=700813659493&hvpos=&hvnetw=g&hvrand=12981572348516290815&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9190900&hvtargid=pla-381707145357&hvocijid=12981572348516290815-B00SAYCXWG-&hvexpln=0&th=1&linkCode=ll2&tag=l0c39-21&linkId=4e8af65a5e14abb66fa2f74389a0d44c&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming serio ho bisogno di cuffie 7.1 surround. Io uso queste HyperX Cloud II e mi trovo benissimo. Se ti va te le lascio qui:"
    },
    "cuffie_razer_kraken": {
        nome: "Razer Kraken",
        categoria: "pc",
        descrizione: "Cuffie gaming 7.1 surround, audio potente, microfono cardioide.",
        link: "https://www.amazon.it/Razer-Kraken-microfono-cardioide-pieghevole/dp/B07RMSM477?th=1&linkCode=ll2&tag=l0c39-21&linkId=f02d101053afc051b80846a206ae3efd&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming serio ho bisogno di cuffie potenti. Io uso queste Razer Kraken e mi trovo benissimo. Se ti va te le lascio qui:"
    },
    "tastiera_logitech_g213": {
        nome: "Logitech G213 Prodigy Gaming",
        categoria: "pc",
        descrizione: "Tastiera gaming RGB impermeabile, perfetta per sessioni intense.",
        link: "https://www.amazon.it/Logitech-G213-Prodigy-Gaming-Keyboard/dp/B07W6GVS5C?dib=eyJ2IjoiMSJ9.P33rwpHtFStYlAmcuq8ohun-ifDR614PvwSIDIBQh0oAgru1yKp0Y4ZeLT0XvsiPQ8P0cX7o_6qWrVGgiDNnYWBzviSh0VAOnh4-JzWaNoZKw2iuoeZQTSAhK4uVjeH8nUlyVepU037eJKT-F2aRfcq_Xjrvek-MIaiGBQsBiYfqVmewz7FwpLcwa-hdKZjDXsi7adEsvJJi0N7-AogDKggo0z65WzIFrZQgOJ3M7I4.vvKiLH37KeEnrNxQv--zsVwioSFq2UVmqzvwau-htSc&dib_tag=se&qid=1778017873&refinements=p_36%3A490263031&s=videogames&sr=1-1&th=1&linkCode=ll2&tag=l0c39-21&linkId=99d86bc1745391ffca7e2205753338ef&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming serio ho bisogno di una tastiera RGB. Io uso questa Logitech G213 e mi trovo benissimo. Se ti va te la lascio qui:"
    },
    "tastiera_gxtrust": {
        nome: "GXTrust 871 Zora Meccanica",
        categoria: "pc",
        descrizione: "Tastiera meccanica gaming, retroilluminata e anti-ghosting.",
        link: "https://www.amazon.it/Trust-Tastiera-Meccanica-Retroilluminata-Anti-Ghosting/dp/B0DQVHP2WH?dib=eyJ2IjoiMSJ9.P33rwpHtFStYlAmcuq8ohun-ifDR614PvwSIDIBQh0oAgru1yKp0Y4ZeLT0XvsiPQ8P0cX7o_6qWrVGgiDNnYWBzviSh0VAOnh4-JzWaNoZKw2iuoeZQTSAhK4uVjeH8nUlyVepU037eJKT-F2aRfcq_Xjrvek-MIaiGBQsBiYfqVmewz7FwpLcwa-hdKZjDXsi7adEsvJJi0N7-AogDKggo0z65WzIFrZQgOJ3M7I4.vvKiLH37KeEnrNxQv--zsVwioSFq2UVmqzvwau-htSc&dib_tag=se&qid=1778017873&refinements=p_36%3A490263031&s=videogames&sr=1-3&th=1&linkCode=ll2&tag=l0c39-21&linkId=5a23551f7f06e758fe81a2f48323b9c2&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming serio ho bisogno di una tastiera meccanica. Io uso questa GXTrust e mi trovo benissimo. Se ti va te la lascio qui:"
    },
    "mouse_logitech_g502": {
        nome: "Logitech G502 Lightspeed Wireless",
        categoria: "pc",
        descrizione: "Mouse gaming wireless HERO 25K, 25.600 DPI, 11 pulsanti.",
        link: "https://www.amazon.it/Logitech-G502-Lightspeed-Wireless-Lightsync/dp/B07QKC4WWD?mcid=9805ea97ad553d298b869eafe699dd3d&hvadid=700813659358&hvpos=&hvnetw=g&hvrand=17366854546323660876&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9190900&hvtargid=pla-749874961600&hvocijid=17366854546323660876-B07QKC4WWD-&hvexpln=0&th=1&linkCode=ll2&tag=l0c39-21&linkId=53bc5a82916d77f9c8f0f70b400cbf3d&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming serio ho bisogno di un mouse wireless preciso. Io uso questo Logitech G502 e mi trovo benissimo. Se ti va te lo lascio qui:"
    },
    "mouse_razer_deathadder": {
        nome: "Razer DeathAdder Essential",
        categoria: "pc",
        descrizione: "Mouse gaming 6.400 DPI, 5 pulsanti, ergonomico e preciso.",
        link: "https://www.amazon.it/Razer-DeathAdder-Essential-essenziale-sensore/dp/B092R5MCB3?mcid=b339f1fa54c632069402bc15331fe6e4&hvadid=700790378073&hvpos=&hvnetw=g&hvrand=17152808515394588193&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9190900&hvtargid=pla-1363770907123&hvocijid=17152808515394588193-B092R5MCB3-&hvexpln=0&th=1&linkCode=ll2&tag=l0c39-21&linkId=1b32d94d6fc3b1cc750a1b8b4d8f4ca1&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming serio ho bisogno di un mouse ergonomico. Io uso questo Razer DeathAdder e mi trovo benissimo. Se ti va te lo lascio qui:"
    },
    "ssd_samsung": {
        nome: "Samsung 970 EVO Plus SSD 1TB NVMe M.2",
        categoria: "pc",
        descrizione: "SSD NVMe 1TB, velocità 3.500 MB/s lettura, perfetto per gaming.",
        link: "https://www.amazon.it/Samsung-MZ-V7S1T0BW-Unit%C3%A0-PLUS-Arancione/dp/B07MBQPQ62?th=1&linkCode=ll2&tag=l0c39-21&linkId=b763f6eb809741631bebb537d1af0782&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming serio ho bisogno di un SSD veloce. Io uso questo Samsung 970 EVO e mi trovo benissimo. Se ti va te lo lascio qui:"
    },
    "ssd_wd_black": {
        nome: "WD Black SN850X SSD 1TB NVMe M.2",
        categoria: "pc",
        descrizione: "SSD NVMe Gen 4 1TB, 7.300 MB/s lettura, per PS5 e PC gaming.",
        link: "https://www.amazon.it/WD_BLACK-Interno-velocit%C3%A0-scrittura-Prestazioni/dp/B0B7CKVCCV?mcid=888d8b4ce8b03986ab3849d66f1062e7&hvadid=700902625141&hvpos=&hvnetw=g&hvrand=10457417852729816499&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9190900&hvtargid=pla-1729729168453&hvocijid=10457417852729816499-B0B7CKVCCV-&hvexpln=0&th=1&linkCode=ll2&tag=l0c39-21&linkId=345694116578e5d6a86f5071dafa4eff&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming serio ho bisogno di un SSD ultra veloce. Io uso questo WD Black SN850X e mi trovo benissimo. Se ti va te lo lascio qui:"
    },
    "router_asus": {
        nome: "ASUS GT-AXE11000",
        categoria: "pc",
        descrizione: "Router gaming tri-band 11000 Mbps, WiFi 6E, senza lag.",
        link: "https://www.amazon.it/ASUS-GT-AXE11000-Ethernet-Sicurezza-Dispositivi/dp/B09Q67CYMC?mcid=621c1ee6a4033ed5bb2b31db55a5e9ba&hvadid=700813659490&hvpos=&hvnetw=g&hvrand=3222656381519133428&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9190900&hvtargid=pla-1627260007868&hvocijid=3222656381519133428-B09Q67CYMC-&hvexpln=0&th=1&linkCode=ll2&tag=l0c39-21&linkId=9e0f061013ba7c4c032be94ad458d3d1&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming serio ho bisogno di un router senza lag. Io uso questo ASUS GT-AXE11000 e mi trovo benissimo. Se ti va te lo lascio qui:"
    },
    "monitor_asus_freesync": {
        nome: "ASUS FreeSync",
        categoria: "pc",
        descrizione: "Monitor 27\" 1440p 240Hz, FreeSync Premium, per gaming competitivo.",
        link: "https://www.amazon.it/ASUS-FreeSync-Overdrive-variabile-DisplayHDR/dp/B0BXY85B9F?th=1&linkCode=ll2&tag=l0c39-21&linkId=5dcd7bed07961bba92290e9f07ada8d2&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming competitivo ho bisogno di un monitor 240Hz. Io uso questo ASUS FreeSync e mi trovo benissimo. Se ti va te lo lascio qui:"
    },
    "monitor_lg_ultagear": {
        nome: "LG UltraGear",
        categoria: "pc",
        descrizione: "Monitor 27\" 1440p 165Hz, G-Sync Compatible, IPS perfetto.",
        link: "https://www.amazon.it/LG-UltraGear-2560x1440-Compatible-FreeSync/dp/B0CZ3KVP23?mcid=acf44f5271d63fb68c4a82171d39808c&hvadid=700813659487&hvpos=&hvnetw=g&hvrand=7332863540818994681&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9190900&hvtargid=pla-2362347970506&hvocijid=7332863540818994681-B0CZ3KVP23-&hvexpln=0&th=1&linkCode=ll2&tag=l0c39-21&linkId=f715360a17aa11adfadda1ccbf2ac3f4&ref=_as_li_ss_tl",
        messaggio: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma per gaming serio ho bisogno di un monitor IPS. Io uso questo LG UltraGear e mi trovo benissimo. Se ti va te lo lascio qui:"
    },
    // OUTDOOR
    "power_bank_nestout": {
        nome: "NESTOUT Portable Charger - Power Bank Outdoor",
        categoria: "outdoor",
        descrizione: "Power bank outdoor waterproof e shockproof, perfetto per avventure.",
        link: "https://www.amazon.it/NESTOUT-Portable-Charging-Waterproof-Shockproof/dp/B0CVN9Y1BF?crid=27OTJENPHN7S1&dib=eyJ2IjoiMSJ9.2Ko-s3mEQFXxZLkNpOB--f2j4GJNKhavBVb1i0-xpi9Aj5kiJVbcIH3GVzZvUlw_t8ziUz5ECm0yYAw8cl9PXnRr-7iCY-ZZJvQTUWPkYOZ3XcypoL8HmROz3re_m4gESN-SG2an3YJoeoTZJ5siMmhcVhW_9E02T4YiYDGBlzc79VnJLpOikOo_NrFJBNmsg9EXOoD8aL4tz9P2kVjjQIXl9sYDw0SbAJQaHXqYKXbCb5r8QYfW39u2DZksg2YP7muRg-dvZJw9hQnrVJNMvECfqRpYqRXokBwr5l1_nQM.V_ZKxZgZQAYezySRzfxL-_RDZBC937cofno97LCKNug&dib_tag=se&keywords=outdoor&qid=1777984536&sprefix=outdo%2Caps%2C331&sr=8-3-spons&aref=WtJzpiaozM&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=l0c39-21&linkId=95f4519ecc67b60cf166ac6e1a0ed1ce&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai in campeggio! 🌲 Non so tu, ma quando vado in natura voglio avere sempre batteria. Io uso questo power bank e mi trovo benissimo. Se ti va te lo lascio qui:"
    },
    "gilet_multitasca": {
        nome: "Cexiakong Gilett da Uomo Multitasca",
        categoria: "outdoor",
        descrizione: "Gilet multitasca traspirante, perfetto per attività all'aperto.",
        link: "https://www.amazon.it/Cexiakong-attivit%C3%A0-allaperto-traspirante-multi-tasca/dp/B0DKBLPWM2?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2KRSG8RTIX75I&dib=eyJ2IjoiMSJ9.hlx1tAzqG-EBtszNA8zKT5W31Mi_GxzyZkEY6vlCTi3uXfcsQlJj5IAAqbaq6k0JA9HoPvm3poY6SY5_B8vTxRlV1uYePg0efO3dgV6afXHIuzupA0CQQU3WMlsbBqYz1Gy3v8IlwXG46EQeeMdpm8fBtVs-WLtyydQ9QK4uve1Dt43mm3uCw12y0Fz-FWczA9GUwyhlzzyIaECa1QpU10ruVWPwPWgzxBtDfw_1tMm0j-AsdWeRxxq2vt4RXx5HAdzklPaFtQucESvXPaX3tpF468OshrJa4PB_wfo3aMg.TwuT6qKsuzwQGEuD7T03KQ51w_K-M_jGo4BJPH7jfEU&dib_tag=se&keywords=Il%2BGilet%2BMultitasche%2Belegante&qid=1778012360&sprefix=il%2Bgilet%2Bmultitasche%2Belegante%2Caps%2C129&sr=8-27&th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=3761583359212b50ac2b9b721b655189&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai in campeggio! 🌲 Non so tu, ma quando vado in natura voglio avere tutto a portata di mano. Io uso questo gilet e mi trovo benissimo. Se ti va te lo lascio qui:"
    },
    "antizanzare": {
        nome: "Antizanzare Elettrica per Uccisione",
        categoria: "outdoor",
        descrizione: "Antizanzare elettrica, elimina zanzare senza prodotti chimici.",
        link: "https://www.amazon.it/Antizanzare-Elettrica-Uccisione-Repellente-repellente/dp/B0GS5CVTLK?pd_rd_w=JvxwP&content-id=amzn1.sym.bf16da9e-571e-4ac0-b567-e688486f9ff2&pf_rd_p=bf16da9e-571e-4ac0-b567-e688486f9ff2&pf_rd_r=SYPDDR78EZ01RZK482XP&pd_rd_wg=MgY5W&pd_rd_r=bf979260-1ed0-44e0-980e-667fc4259a47&pd_rd_i=B0GS5CVTLK&psc=1&linkCode=ll2&tag=l0c39-21&linkId=dacaa8bb5da82c4ddfc776b580a06fe4&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai in campeggio! 🌲 Non so tu, ma quando vado in natura odio le zanzare. Io uso questo antizanzare e mi trovo benissimo. Se ti va te lo lascio qui:"
    },
    "tenda_fe_active": {
        nome: "FE Active Tenda Campeggio con Zanzariera",
        categoria: "outdoor",
        descrizione: "Tenda campeggio con zanzariera, impermeabile e resistente.",
        link: "https://www.amazon.it/FE-Active-zanzariera-Impermeabile-Escursionismo/dp/B07QV3MQTT?&linkCode=ll2&tag=l0c39-21&linkId=aab7aeba98e2fe34f5bbfd458b27fb66&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai in campeggio! 🌲 Non so tu, ma quando vado in natura voglio dormire senza zanzare. Io uso questa tenda e mi trovo benissimo. Se ti va te la lascio qui:"
    },
    "tenda_outsunny": {
        nome: "Outsunny Tenda Campeggio Impermeabile",
        categoria: "outdoor",
        descrizione: "Tenda campeggio impermeabile 100x100x185cm, ingresso poliestere.",
        link: "https://www.amazon.it/Outsunny-Impermeabile-Ingresso-Poliestere-100x100x185/dp/B0DZ5PWRJC?dib=eyJ2IjoiMSJ9.eJXW-mMKMgt9Dz0AtNkpAHiP5C6H5var-kkGjzsXf0CBwupWgqCKnSQ6GTdAV-9sDZflnoWnwUuW0pHRSHvgezX8-CSt1IL5g18kT8hoOHpMBVnxSX2lnoyKrUunZfRb-t3ZJp9GEA27ag7p0pmHUvdjeatzzdSUQUyl8ygDQpiPmyNUQDppvvHXbOSOLv6hmq6tbC8SQbxdmLgrVBcUsgc_6IRBy8MhMoaQ-ChkhxUaMtOTzw3XZdh3MOe4xjlz6QZMczle07BDlLftj0bveZqHcPiM9ZqDa8fXaYZ4ZWs.a4Fofu3z5Rz4g2SB1oUX0ersit5nAvMZiqtTjSnX6rE&dib_tag=se&qid=1778016285&refinements=p_36%3A490263031&s=sports&sr=1-4&th=1&linkCode=ll2&tag=l0c39-21&linkId=19a5b5c1001c7f4e7d11da63bb29cf14&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai in campeggio! 🌲 Non so tu, ma quando vado in natura voglio una tenda impermeabile. Io uso questa tenda e mi trovo benissimo. Se ti va te la lascio qui:"
    },
    "tenda_trizand": {
        nome: "TRIZAND Tenda Spiaggia Impermeabile",
        categoria: "outdoor",
        descrizione: "Tenda spiaggia impermeabile, facile trasporto e montaggio.",
        link: "https://www.amazon.it/TRIZAND-spiaggia-trasporto-impermeabile-23492/dp/B0CTPTR99X?pd_rd_w=metuQ&content-id=amzn1.sym.3a84fb8b-d4d6-4483-8fd7-0000cb59ea5a&pf_rd_p=3a84fb8b-d4d6-4483-8fd7-0000cb59ea5a&pf_rd_r=GGEPG1FNR1KN3JY8PSWJ&pd_rd_wg=I3y7l&pd_rd_r=22330237-b6e0-4094-8318-91b0a5a9328f&pd_rd_i=B0CTPTR99X&linkCode=ll2&tag=l0c39-21&linkId=4940199de276b89a5b47db92baef10dd&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai in campeggio! 🌲 Non so tu, ma quando vado in natura voglio una tenda facile da montare. Io uso questa tenda e mi trovo benissimo. Se ti va te la lascio qui:"
    },
    "tenda_doccia": {
        nome: "Tenda Doccia Solare Portatile",
        categoria: "outdoor",
        descrizione: "Tenda doccia solare portatile, impermeabile e antivento.",
        link: "https://www.amazon.it/portatile-impermeabile-antivento-resistente-giardino/dp/B0G4VNFR3B?pd_rd_w=metuQ&content-id=amzn1.sym.3a84fb8b-d4d6-4483-8fd7-0000cb59ea5a&pf_rd_p=3a84fb8b-d4d6-4483-8fd7-0000cb59ea5a&pf_rd_r=GGEPG1FNR1KN3JY8PSWJ&pd_rd_wg=I3y7l&pd_rd_r=22330237-b6e0-4094-8318-91b0a5a9328f&pd_rd_i=B0G4VNFR3B&linkCode=ll2&tag=l0c39-21&linkId=dcc9659e50ea29cef8af6c01833e8f22&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai in campeggio! 🌲 Non so tu, ma quando vado in natura voglio privacy per la doccia. Io uso questa tenda e mi trovo benissimo. Se ti va te la lascio qui:"
    },
    "tenda_camping": {
        nome: "Brunner Tenda Campeggio 3000",
        categoria: "outdoor",
        descrizione: "Tenda robusta per il campeggio, resiste a ogni avventura.",
        link: "https://www.amazon.it/Brunner-Tenda-adatta-Camping-3000/dp/B07NZSV33G?pd_rd_w=SrERZ&content-id=amzn1.sym.424a711c-7818-425a-9fb0-9a3d8996ff54&pf_rd_p=424a711c-7818-425a-9fb0-9a3d8996ff54&pf_rd_r=GGEPG1FNR1KN3JY8PSWJ&pd_rd_wg=I3y7l&pd_rd_r=22330237-b6e0-4094-8318-91b0a5a9328f&pd_rd_i=B07NZSV33G&linkCode=ll2&tag=l0c39-21&linkId=e8c40ee5fe6fd040865a21fd39e20126&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai in campeggio! 🌲 Non so tu, ma quando vado in natura voglio avere tutto pronto. Io uso questa tenda Brunner e mi trovo benissimo. Se ti va te la lascio qui:"
    },
    "scarponi_columbia": {
        nome: "Columbia Crestwood Mid Waterproof Scarponi da Trekking Uomo",
        categoria: "outdoor",
        descrizione: "Scarponi trekking waterproof Columbia, suola aderente per terreni difficili.",
        link: "https://www.amazon.it/dp/B0CLW1SNHJ?th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=f2a6c60efc871ba73272061aa2dd784c&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai in campeggio! 🌲 Non so tu, ma quando vado in natura voglio scarpe resistenti. Io uso questi scarponi e mi trovo benissimo. Se ti va te li lascio qui:"
    },
    "tenda_fe_beach": {
        nome: "FE Active Beach Tent Family Beach Parasol",
        categoria: "outdoor",
        descrizione: "Tenda spiaggia family con zanzariera, perfetta per la spiaggia.",
        link: "https://www.amazon.it/FE-Active-zanzariera-Impermeabile-Escursionismo/dp/B084TR7CGR?th=1&linkCode=ll2&tag=l0c39-21&linkId=70ef843e99c19a5acc6b77aed0e3f833&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai in campeggio! 🌲 Non so tu, ma quando vado in natura voglio protezione dal sole. Io uso questa tenda e mi trovo benissimo. Se ti va te la lascio qui:"
    },
    "barbecue_auauraintt": {
        nome: "Auauraintt Portable Charcoal BBQ Folding",
        categoria: "outdoor",
        descrizione: "Barbecue portatile pieghevole, perfetto per campeggio.",
        link: "https://www.amazon.it/Auauraintt-Barbecue-Portatile-pieghevole-campeggio/dp/B0D5CM7NR8?&linkCode=ll2&tag=l0c39-21&linkId=5642e8c53d343f3cfa433e868b6cbe3b&ref=_as_li_ss_tl",
        messaggio: "Che bello, vai in campeggio! 🌲 Non so tu, ma quando vado in natura voglio cucinare all'aperto. Io uso questo barbecue e mi trovo benissimo. Se ti va te lo lascio qui:"
    },
    // CALDO (Condizionatori e Ventilatori)
    "condizionatore_portatile": {
        nome: "Condizionatore Portatile 3-in-1",
        categoria: "caldo",
        descrizione: "Condizionatore portatile 3-in-1 con raffreddamento, ventilatore e umidificatore.",
        link: "https://www.amazon.it/dp/B0D3PP64JS?ie=UTF8&psc=1&pd_rd_plhdr=t&aref=HPJ8v9XaEK&linkCode=ll2&tag=l0c39-21&linkId=9f8aac727b8af31fe8eb8ae08e38ba65&ref=_as_li_ss_tl",
        messaggio: "Che giornata calda! ❄️ Non so tu, ma io odio sudare quando è così caldo. Per questo uso il condizionatore portatile 3-in-1: con questo ho risolto il problema temperatura. Se ti va te lo lascio qui, è una vera salvezza in questi giorni."
    },
    "condizionatore_evaporativo": {
        nome: "Condizionatore Portatile Evaporativo 4-in-1",
        categoria: "caldo",
        descrizione: "Condizionatore portatile evaporativo 4-in-1 con raffreddamento a ghiaccio.",
        link: "https://www.amazon.it/dp/B0D2GPMDTL?psc=1&aref=XLhMSgF8DX&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWxfcmlnaHRfc2hhcmVk&linkCode=ll2&tag=l0c39-21&linkId=55fd5b24fbbdba1151431f468264766f&ref=_as_li_ss_tl",
        messaggio: "Che giornata calda! ❄️ Non so tu, ma io odio sudare quando è così caldo. Per questo uso il condizionatore evaporativo: con questo ho risolto il problema temperatura. Se ti va te lo lascio qui, è una vera salvezza in questi giorni."
    },
    "ventilatore_tavolo_silenzioso": {
        nome: "Ventilatore da Tavolo Silenzioso Ricaricabile",
        categoria: "caldo",
        descrizione: "Ventilatore da tavolo silenzioso ricaricabile, pieghevole con telecomando.",
        link: "https://www.amazon.it/Ventilatore-Silenzioso-Ricaricabile-Pieghevole-Telecomando/dp/B0DZ5ZB59N?th=1&linkCode=ll2&tag=l0c39-21&linkId=e5e746f4698bf8950b8c872ed5e18a5f&ref=_as_li_ss_tl",
        messaggio: "Che giornata calda! ❄️ Non so tu, ma io odio sudare quando è così caldo. Per questo uso questo ventilatore silenzioso: con questo ho risolto il problema temperatura. Se ti va te lo lascio qui, è una vera salvezza in questi giorni."
    },
    "ventilatore_tavolo_4vel": {
        nome: "Ventilatore da Tavolo 4 Velocità Rotazione 330°",
        categoria: "caldo",
        descrizione: "Ventilatore da tavolo 4 velocità con rotazione 330°, ricaricabile.",
        link: "https://www.amazon.it/Ventilator-Silenzioso-Ventilatori-Ricaricabile-Rotazione/dp/B0CP27G3V5?th=1&linkCode=ll2&tag=l0c39-21&linkId=d36fd176303a9&ref=_as_li_ss_tl",
        messaggio: "Che giornata calda! ❄️ Non so tu, ma io odio sudare quando è così caldo. Per questo uso questo ventilatore 4 velocità: con questo ho risolto il problema temperatura. Se ti va te lo lascio qui, è una vera salvezza in questi giorni."
    },
    "ventilatore_tavolo_ocoopa": {
        nome: "Ventilatore da Tavolo OCOOPA USB",
        categoria: "caldo",
        descrizione: "Ventilatore da tavolo OCOOPA USB, silenzioso con rotazione automatica.",
        link: "https://www.amazon.it/Ventilator-silenzioso-ventilatore-regolabile-automatica/dp/B0BTGXCQ2Y?&linkCode=ll2&tag=l0c39-21&linkId=f3332b76d1e8539b8d1563ac8609d0b4&ref=_as_li_ss_tl",
        messaggio: "Che giornata calda! ❄️ Non so tu, ma io odio sudare quando è così caldo. Per questo uso questo ventilatore USB: con questo ho risolto il problema temperatura. Se ti va te lo lascio qui, è una vera salvezza in questi giorni."
    }
};

// comboMessages - Array di messaggi per ogni contesto con placeholder
const comboMessages = {
    "mare": [
        "Ehi, vedo che ti stai preparando per la spiaggia! 🌊 Guarda, se passi una giornata al mare come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per godermi il relax e una scorta di {prodottoAncora} per non dover correre al bar. Ti lascio qui i link a entrambi, ti assicuro che è una bella comodità!",
        "Che bella giornata per il mare! 🏖️ Guarda, se vai al mare come me, non puoi fare a meno di due cose: un {prodottoNicchia} per il comfort e una {prodottoAncora} per rinfrescarti. Ecco i link, fidati!",
        "Ti piace il mare? 🌊 Guarda, per una giornata perfetta al mare servono due cose: un {prodottoNicchia} e una {prodottoAncora}. Ti lascio i link, è fantastico!"
    ],
    "pc": [
        "Ehi, ma ti stai preparando per lavorare? 🔥 Guarda, se passi lunghe sessioni come me, non posso fare a meno di due cose: delle {prodottoNicchia} per concentrarmi e una scorta di {prodottoAncora} per non dover fermarmi quando ho sete. Ti lascio qui i link a entrambi, ti assicuro che è una bella comodità!",
        "Lavori al computer? 💻 Guarda, per sessioni produttive servono due cose: {prodottoNicchia} e {prodottoAncora}. Ecco i link, ti assicuro che è essenziale!",
        "Ti serve energia per il lavoro? ⚡ Guarda, io uso {prodottoNicchia} e {prodottoAncora} per rimanere concentrato. Ti lascio i link!"
    ],
    "outdoor": [
        "Che bello, vai in campeggio! 🌲 Guarda, se vai in natura come me, non posso fare a meno di due cose: una buona {prodottoNicchia} per dormire bene e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è una bella comodità!",
        "Ami l'outdoor? 🏕️ Guarda, per avventure all'aria aperta servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è perfetto!",
        "Ti piace la natura? 🌿 Guarda, io porto sempre {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "caldo": [
        "Che giornata calda! ❄️ Guarda, se anche tu soffri il caldo come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per rinfrescarmi e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è una vera salvezza in questi giorni!",
        "Fa caldo oggi? 🥵 Guarda, per sopravvivere al caldo servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è una salvezza!",
        "Ti serve rinfrescarsi? ❄️ Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "fitness": [
        "Ehi, vedo che ti alleni! 💪 Guarda, se ti alleni come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per l'allenamento e una scorta di {prodottoAncora} per idratarmi durante l'workout. Ti lascio qui i link a entrambi, ti assicuro che è fondamentale per i risultati!",
        "Ti alleni? 🏋️ Guarda, per workout perfetti servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è fondamentale!",
        "Vuoi risultati? 💪 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "smart-home": [
        "Ehi, rendi la tua casa intelligente! 🏠 Guarda, se vuoi automatizzare la casa come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per il controllo smart e una scorta di {prodottoAncora} per rilassarmi. Ti lascio qui i link a entrambi, ti assicuro che è fantastico!",
        "Ami la domotica? 🏠 Guarda, per una casa smart servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è fantastico!",
        "Vuoi automatizzare la casa? 🤖 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "parrucchiere-barbiere": [
        "Ehi, vuoi attrezzature professionali! 💇 Guarda, se hai un salone come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per il taglio perfetto e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è fondamentale!",
        "Sei un parrucchiere? ✂️ Guarda, per il tuo salone servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è essenziale!",
        "Vuoi strumenti professionali? 💈 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "manga-anime": [
        "Sei un otaku? 🎌 Guarda, se ami i manga come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per la collezione e una scorta di {prodottoAncora} per le maratone di lettura. Ti lascio qui i link a entrambi, ti assicuro che è imperdibile!",
        "Ti piace il manga? 📚 Guarda, per la collezione perfetta servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è imperdibile!",
        "Vuoi collezionare? 🎌 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "snack-bevande": [
        "Vuoi rinfrescarti? 🥤 Guarda, se vuoi bevande come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per l'energia e una scorta di {prodottoAncora} per la leggerezza. Ti lascio qui i link a entrambi, ti assicuro che è la combo ideale!",
        "Ti piace le bevande? 🍹 Guarda, per la scorta perfetta servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è ideale!",
        "Vuoi idratarti? 💧 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "pet-care": [
        "Ehi, ti prendi cura del tuo pet! 🐾 Guarda, se ami i tuoi animali come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per il loro comfort e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è fondamentale!",
        "Hai animali? 🐱 Guarda, per il loro comfort servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è fondamentale!",
        "Ti prendi cura del tuo pet? 🐕 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "cinema": [
        "Ehi, vuoi goderti un film a casa! 🎬 Guarda, se ami il cinema come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per la migliore esperienza e una scorta di {prodottoAncora} per lo snack perfetto. Ti lascio qui i link a entrambi, ti assicuro che è fantastico!",
        "Ami i film? 🎥 Guarda, per l'esperienza perfetta servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è fantastico!",
        "Vuoi guardare un film? 🎬 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "smartphone": [
        "Ehi, sei sempre connesso! 📱 Guarda, se usi il telefono come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per migliorare l'esperienza e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è essenziale!",
        "Usi sempre il telefono? 📲 Guarda, per la migliore esperienza servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è essenziale!",
        "Vuoi migliorare il tuo telefono? 📱 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "tech": [
        "Ehi, ami la tecnologia! 🔧 Guarda, se usi gadget come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per il mio setup e una scorta di {prodottoAncora} per non fermarmi. Ti lascio qui i link a entrambi, ti assicuro che è comodissimo!",
        "Ami la tecnologia? 💻 Guarda, per il setup perfetto servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è comodissimo!",
        "Vuoi gadget tech? 🔧 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "moda-donna": [
        "Ehi, vuoi essere alla moda! 👗 Guarda, se curi il tuo stile come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per completare il look e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è perfetto!",
        "Vuoi essere elegante? 👠 Guarda, per il look perfetto servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è perfetto!",
        "Ti piace la moda? 💃 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "moda-uomo": [
        "Ehi, vuoi uno stile unico! 👔 Guarda, se curi il tuo look come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per distinguerti e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è essenziale!",
        "Vuoi stile maschile? 🤵 Guarda, per distinguerti servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è essenziale!",
        "Ti piace lo stile? 👔 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "arredamento": [
        "Ehi, arredi la tua casa! 🏡 Guarda, se vuoi una casa bella come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per lo stile e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è perfetto!",
        "Vuoi arredare casa? 🛋️ Guarda, per lo stile perfetto servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è perfetto!",
        "Ti piace l'arredamento? 🏠 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "accessori": [
        "Ehi, completi il tuo look! 👜 Guarda, se ami gli accessori come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per il dettaglio perfetto e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è fondamentale!",
        "Vuoi accessori? 👒 Guarda, per il dettaglio perfetto servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è fondamentale!",
        "Ti piace gli accessori? 💼 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "benessere": [
        "Ehi, ti prendi cura di te! 💆 Guarda, se curi il tuo benessere come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per la routine e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è essenziale!",
        "Vuoi benessere? 🧴 Guarda, per la routine perfetta servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è essenziale!",
        "Ti piace la cura personale? 💆 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "giochi": [
        "Ehi, vuoi divertirti! 🎲 Guarda, se ami i giochi come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per serate divertenti e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è perfetto!",
        "Ami i giochi? 🎮 Guarda, per serate divertenti servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è perfetto!",
        "Vuoi divertirti? 🎲 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "libri": [
        "Ehi, ami leggere! 📚 Guarda, se leggi come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per leggere ovunque e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è fantastico!",
        "Ami leggere? 📖 Guarda, per leggere ovunque servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è fantastico!",
        "Vuoi leggere? 📚 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "profumi": [
        "Ehi, vuoi lasciare un'impressione! 🌸 Guarda, se curi il tuo profumo come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per il tuo stile e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è perfetto!",
        "Vuoi profumi? 💐 Guarda, per il tuo stile servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è perfetto!",
        "Ti piace il profumo? 🌸 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "lavoro": [
        "Ehi, lavori con stile! 👷 Guarda, se curi il tuo abbigliamento da lavoro come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per la sicurezza e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è fondamentale!",
        "Lavori? 👔 Guarda, per la sicurezza servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è fondamentale!",
        "Vuoi sicurezza al lavoro? 👷 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "sostenibilita": [
        "Ehi, vuoi essere eco-friendly! 🌱 Guarda, se curi l'ambiente come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per ridurre l'impatto e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è importante!",
        "Vuoi essere eco-friendly? ♻️ Guarda, per ridurre l'impatto servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è importante!",
        "Ti piace l'ambiente? 🌱 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "ufficio": [
        "Ehi, lavori in ufficio! 💼 Guarda, se vuoi produttività come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per lavorare meglio e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è essenziale!",
        "Lavori in ufficio? 🖥️ Guarda, per la produttività servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è essenziale!",
        "Vuoi produttività? 💼 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "viaggi": [
        "Ehi, vuoi viaggiare! ✈️ Guarda, se ami viaggiare come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per il viaggio e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è comodissimo!",
        "Ami viaggiare? 🧳 Guarda, per viaggiare servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è comodissimo!",
        "Vuoi viaggiare? ✈️ Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "fotografia": [
        "Ehi, ami la fotografia! 📷 Guarda, se scatti foto come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per scatti migliori e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è perfetto!",
        "Ami la fotografia? 📸 Guarda, per scatti migliori servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è perfetto!",
        "Vuoi scattare foto? 📷 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "dvd": [
        "Ehi, vuoi guardare film! 🎞️ Guarda, se ami il cinema come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per la collezione e una scorta di {prodottoAncora} per lo snack. Ti lascio qui i link a entrambi, ti assicuro che è fantastico!",
        "Ami i DVD? 📀 Guarda, per la collezione servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è fantastico!",
        "Vuoi collezionare? 🎞️ Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "parrucchiere-barbiere": [
        "Ehi, vuoi attrezzature professionali! 💇 Guarda, se hai un salone come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per il taglio perfetto e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è fondamentale!",
        "Sei parrucchiere o barbiere? ✂️ Guarda, per il salone perfetto servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è fondamentale!",
        "Vuoi strumenti professionali? 💇 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!",
        "Sei pronto per il salone perfetto? 💈 Guarda, per un lavoro di qualità ti servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, i tuoi clienti ti ringrazieranno!",
        "Vuoi diventare un barbiere di elite? 🎩 Guarda, con {prodottoNicchia} e {prodottoAncora} hai tutto il necessario. Ti lascio i link, è l'investimento giusto!",
        "Sei appassionato di hair styling? ✨ Guarda, io uso {prodottoNicchia} e {prodottoAncora} per risultati professionali. Ti lascio i link!"
    ],
    "musica-vinili": [
        "Ehi, ami la musica analogica! 🎵 Guarda, se ascolti vinili come me, non posso fare a meno di due cose: un {prodottoNicchia} per la migliore qualità audio e una scorta di {prodottoAncora} per la mia collezione. Ti lascio qui i link a entrambi, ti assicuro che è un'esperienza unica!",
        "Ami i vinili? 🎶 Guarda, per una collezione da collezionista servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è pura magia!",
        "Vuoi il suono perfetto? 🎧 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "manga-anime": [
        "Ehi, ami manga e anime! 📖 Guarda, se leggi come me, non posso fare a meno di due cose: un {prodottoNicchia} per la mia collezione e una scorta di {prodottoAncora} per non fermarmi. Ti lascio qui i link a entrambi, ti assicuro che è fantastico!",
        "Sei un otaku? 🎌 Guarda, per la collezione perfetta servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è imperdibile!",
        "Vuoi storie epiche? ⚔️ Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ],
    "biciclette-mobilita": [
        "Ehi, ami le biciclette! 🚲 Guarda, se pedali come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per il mio giro e una scorta di {prodottoAncora} per la manutenzione. Ti lascio qui i link a entrambi, ti assicuro che è fondamentale!",
        "Ti piace andare in bici? 🚴 Guarda, per la mobilità perfetta servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è essenziale!",
        "Vuoi muoverti in libertà? 🌳 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ]
    ,
    "abbigliamento-ciclismo": [
        "Ehi, ami il ciclismo! 🚴 Guarda, se pedali come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per il mio giro e una scorta di {prodottoAncora} per la manutenzione. Ti lascio qui i link a entrambi, ti assicuro che è fondamentale!",
        "Ti piace andare in bici? 🚲 Guarda, per il ciclismo perfetto servono {prodottoNicchia} e {prodottoAncora}. Ecco i link, è essenziale!",
        "Vuoi pedalare in libertà? 🌳 Guarda, io uso {prodottoNicchia} e {prodottoAncora}. Ti lascio i link!"
    ]
};

// Funzione per ottenere prodotti dal catalogo in base alla categoria
function getProdottiByCategoria(categoria) {
    const prodotti = [];
    for (const [id, prodotto] of Object.entries(catalogoProdotti)) {
        const categorieProdotto = Array.isArray(prodotto.categoria) ? prodotto.categoria : [prodotto.categoria];
        if (categorieProdotto.includes(categoria)) {
            prodotti.push({ id, ...prodotto });
        }
    }
    return prodotti;
}

// Funzione per rilevare il contesto dell'utente
function getContesto() {
    const currentPath = window.location.pathname;
    const currentUrl = window.location.href.toLowerCase();
    
    // Homepage
    if (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/index.html')) {
        return 'homepage';
    }
    
    // Controlla se siamo in una pagina specifica
    if (currentPath.includes('mare-spiaggia') || currentUrl.includes('mare') || currentUrl.includes('spiaggia')) {
        return 'mare';
    }
    if (currentPath.includes('elite-gaming-gear') || currentPath.includes('tech') || currentUrl.includes('pc') || currentUrl.includes('gaming')) {
        return 'pc';
    }
    if (currentPath.includes('fitness-casa') || currentUrl.includes('fitness') || currentUrl.includes('palestra') || currentUrl.includes('allenamento')) {
        return 'fitness';
    }
    if (currentPath.includes('smart-home-domotica') || currentUrl.includes('smart') || currentUrl.includes('domotica') || currentUrl.includes('home')) {
        return 'smart-home';
    }
    if (currentPath.includes('pet-care-intelligente') || currentUrl.includes('pet') || currentUrl.includes('animali') || currentUrl.includes('gatto') || currentUrl.includes('cane')) {
        return 'pet-care';
    }
    if (currentPath.includes('parrucchiere-barbiere') || currentUrl.includes('parrucchiere') || currentUrl.includes('barbiere') || currentUrl.includes('forbici') || currentUrl.includes('rasoio')) {
        return 'parrucchiere-barbiere';
    }
    if (currentPath.includes('abbigliamento-serie-tv-film') || currentUrl.includes('abbigliamento') || currentUrl.includes('serie') || currentUrl.includes('tv') || currentUrl.includes('film')) {
        return 'abbigliamento-serie-tv-film';
    if (currentPath.includes('abbigliamento-ciclismo') || currentUrl.includes('ciclismo') || currentUrl.includes('bici') || currentUrl.includes('bicicletta') || currentUrl.includes('mtb') || currentUrl.includes('mountain') || currentUrl.includes('bike') || currentUrl.includes('abbigliamento') || currentUrl.includes('tuta') || currentUrl.includes('pantaloncini') || currentUrl.includes('salopette')) {
        return 'abbigliamento-ciclismo';
    }
    }
    if (currentPath.includes('biciclette-mobilita') || currentUrl.includes('bicicletta') || currentUrl.includes('bici') || currentUrl.includes('bike') || currentUrl.includes('mtb') || currentUrl.includes('e-bike') || currentUrl.includes('ebike') || currentUrl.includes('mobilita') || currentUrl.includes('mobilità')) {
        return 'biciclette-mobilita';
    }
    if (currentPath.includes('smartphone-tech') || currentUrl.includes('smartphone') || currentUrl.includes('telefono') || currentUrl.includes('mobile')) {
        return 'smartphone';
    }
    if (currentPath.includes('tech') || currentUrl.includes('tecnologia') || currentUrl.includes('gadget')) {
        return 'tech';
    }
    if (currentPath.includes('moda-donna') || currentUrl.includes('moda') || currentUrl.includes('donna') || currentUrl.includes('femminile')) {
        return 'moda-donna';
    }
    if (currentPath.includes('moda-uomo') || currentUrl.includes('uomo') || currentUrl.includes('maschile')) {
        return 'moda-uomo';
    }
    if (currentPath.includes('arredamento-casa') || currentUrl.includes('arredamento') || currentUrl.includes('casa') || currentUrl.includes('mobili')) {
        return 'arredamento';
    }
    if (currentPath.includes('accessori-moda') || currentUrl.includes('accessori') || currentUrl.includes('borse') || currentUrl.includes('scarpe')) {
        return 'accessori';
    }
    if (currentPath.includes('benessere-cura-personale') || currentUrl.includes('benessere') || currentUrl.includes('cura') || currentUrl.includes('persona')) {
        return 'benessere';
    }
    if (currentPath.includes('giochi-da-tavolo') || currentUrl.includes('giochi') || currentUrl.includes('tavolo') || currentUrl.includes('board')) {
        return 'giochi';
    }
    if (currentPath.includes('libri-ereader') || currentUrl.includes('libri') || currentUrl.includes('ereader') || currentUrl.includes('lettura')) {
        return 'libri';
    }
    if (currentPath.includes('profumi-bellezza') || currentUrl.includes('profumi') || currentUrl.includes('bellezza') || currentUrl.includes('cosmetici')) {
        return 'profumi';
    }
    if (currentPath.includes('abbigliamento-lavoro') || currentUrl.includes('lavoro') || currentUrl.includes('abbigliamento') || currentUrl.includes('uniformi')) {
        return 'lavoro';
    }
    if (currentPath.includes('sostenibilita-eco-friendly') || currentUrl.includes('sostenibilita') || currentUrl.includes('eco') || currentUrl.includes('ambiente')) {
        return 'sostenibilita';
    }
    if (currentPath.includes('ufficio-produttivo') || currentUrl.includes('ufficio') || currentUrl.includes('produttivo') || currentUrl.includes('desk')) {
        return 'ufficio';
    }
    if (currentPath.includes('viaggi-vacanze') || currentUrl.includes('viaggi') || currentUrl.includes('vacanze') || currentUrl.includes('valigie')) {
        return 'viaggi';
    }
    if (currentPath.includes('studio-fotografico') || currentUrl.includes('fotografia') || currentUrl.includes('foto') || currentUrl.includes('camera')) {
        return 'fotografia';
    }
    if (currentPath.includes('dvd-bluray') || currentUrl.includes('dvd') || currentUrl.includes('bluray') || currentUrl.includes('film')) {
        return 'dvd';
    }
    if (currentPath.includes('outdoor-camping') || currentUrl.includes('outdoor') || currentUrl.includes('campeggio')) {
        return 'outdoor';
    }
    if (currentPath.includes('cucina-elettrodomestici') || currentUrl.includes('condizionatore') || currentUrl.includes('ventilatore')) {
        return 'caldo';
    }
    // Bibite & Bevande - ora ha proprio database entry
    if (currentPath.includes('snack-bevande') || currentUrl.includes('bibite') || currentUrl.includes('bevande')) {
        return 'snack-bevande';
    }
    
    // Default: homepage o contesto non identificato
    return null;
}

// Funzione per mostrare il messaggio di urgenza con combo
function showUrgencyComboMessage(context) {
    console.log('showUrgencyComboMessage called with context:', context);
    
    // Prima prova a usare le combo del database modulare
    const comboData = getComboData(context);
    
    if (comboData && comboData.combos && comboData.combos.length > 0) {
        // Usa le combo del database
        const randomCombo = comboData.combos[Math.floor(Math.random() * comboData.combos.length)];
        
        const message = `
            <div class="urgency-combo-message">
                <p style="margin-bottom: 12px; font-size: 15px; line-height: 1.5;">${randomCombo.message}</p>
                <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 15px; border-radius: 10px; margin-top: 15px; border: 1px solid #dee2e6;">
                    <div style="margin-bottom: 12px;">
                        <strong>📦 Combo consigliata:</strong>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <a href="${randomCombo.product1.link}" target="_blank" onclick="trackComboClick('${context}', 1)" style="color: #032B44; text-decoration: none; font-weight: bold; display: block; padding: 8px; background: white; border-radius: 6px; border: 1px solid #ced4da; margin-bottom: 8px;">
                            1. ${randomCombo.product1.name}
                        </a>
                        <a href="${randomCombo.product2.link}" target="_blank" onclick="trackComboClick('${context}', 2)" style="color: #032B44; text-decoration: none; font-weight: bold; display: block; padding: 8px; background: white; border-radius: 6px; border: 1px solid #ced4da;">
                            2. ${randomCombo.product2.name}
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        console.log('Calling addMessage with combo message from database');
        addMessage(message, 'bot');
        return;
    }
    
    // Fallback: usa il sistema vecchio con catalogoProdotti
    console.log('No combo data found, using fallback with catalogoProdotti');
    
    // 80% prodotti della nicchia corrente, 20% bibite/bevande
    const random = Math.random();
    let prodotti;
    let useBibite = false;
    
    if (random < 0.8) {
        // 80%: usa prodotti della nicchia corrente
        prodotti = getProdottiByCategoria(context);
        console.log('80%: usando prodotti della nicchia', context);
    } else {
        // 20%: usa bibite/bevande
        prodotti = getProdottiByCategoria('snack-bevande');
        useBibite = true;
        console.log('20%: usando bibite/bevande');
    }
    
    if (!prodotti || prodotti.length === 0) {
        console.error('No products found');
        return;
    }
    
    // Se stiamo usando bibite, non filtrare le bibite
    const idBibite = ['coca_cola_zero', 'pepsi_max', 'fanta_original', 'l_angelica_waterstick', 'jamaica_zenzero'];
    const prodottiFiltrati = useBibite ? prodotti : prodotti.filter(p => !idBibite.includes(p.id));
    
    // Se non ci sono prodotti filtrati, usa tutti i prodotti
    const prodottiDaUsare = prodottiFiltrati.length > 0 ? prodottiFiltrati : prodotti;
    
    // Seleziona un prodotto a caso per la rotazione
    const indiceCasuale = Math.floor(Math.random() * prodottiDaUsare.length);
    const prodottoPrincipale = prodottiDaUsare[indiceCasuale];
    console.log('Prodotto principale selezionato a caso:', prodottoPrincipale);
    
    // Seleziona il secondo prodotto per la combo
    let prodottoAncora;
    if (useBibite) {
        // Se il principale è bibita, il secondo è della nicchia corrente
        const prodottiNiche = getProdottiByCategoria(context);
        const prodottiNicheFiltrati = prodottiNiche.filter(p => !idBibite.includes(p.id));
        const prodottiNicheDaUsare = prodottiNicheFiltrati.length > 0 ? prodottiNicheFiltrati : prodottiNiche;
        const indiceNiche = Math.floor(Math.random() * prodottiNicheDaUsare.length);
        prodottoAncora = prodottiNicheDaUsare[indiceNiche];
        console.log('Prodotto della nicchia selezionato:', prodottoAncora);
    } else {
        // Se il principale è della nicchia, il secondo è bibita
        let idBibitaScelta;
        if (context === 'fitness') {
            // Per fitness usa solo bevande sportive
            const idBevandeSportive = ['red_bull', 'enervit_isotonic', 'powerbar_isoactive', 'gomo_energy', 'gatorade_sport'];
            const indiceBevandaSportiva = Math.floor(Math.random() * idBevandeSportive.length);
            idBibitaScelta = idBevandeSportive[indiceBevandaSportiva];
        } else {
            // Per altri contesti usa le bibite normali
            const indiceBibita = Math.floor(Math.random() * idBibite.length);
            idBibitaScelta = idBibite[indiceBibita];
        }
        prodottoAncora = catalogoProdotti[idBibitaScelta];
        console.log('Bibita selezionata a caso:', prodottoAncora);
    }
    
    // Controllo di sicurezza: verifica che i prodotti abbiano i nomi definiti
    if (!prodottoPrincipale || !prodottoPrincipale.nome || !prodottoAncora || !prodottoAncora.nome) {
        console.error('Prodotti senza nome definiti, uso messaggio di fallback');
        // Usa messaggio di benvenuto standard come fallback
        addMessage(getPersonalizedGreeting(), 'bot');
        return;
    }
    
    // Prendi il messaggio combo per il contesto (seleziona random dall'array)
    const messagesArray = comboMessages[context] || comboMessages['mare'];
    const messaggioTemplate = Array.isArray(messagesArray) 
        ? messagesArray[Math.floor(Math.random() * messagesArray.length)]
        : messagesArray;
    
    // Sostituisci i placeholder
    const messaggioPersonalizzato = messaggioTemplate
        .replace('{prodottoNicchia}', prodottoPrincipale.nome)
        .replace('{prodottoAncora}', prodottoAncora.nome);
    
    const message = `
        <div class="urgency-combo-message">
            <p style="margin-bottom: 12px; font-size: 15px; line-height: 1.5;">${messaggioPersonalizzato}</p>
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 15px; border-radius: 10px; margin-top: 15px; border: 1px solid #dee2e6;">
                <div style="margin-bottom: 12px;">
                    <strong>📦 Combo consigliata:</strong>
                </div>
                <div style="margin-bottom: 10px;">
                    <a href="${prodottoPrincipale.link}" target="_blank" onclick="trackComboClick('${context}', 1)" style="color: #032B44; text-decoration: none; font-weight: bold; display: block; padding: 8px; background: white; border-radius: 6px; border: 1px solid #ced4da; margin-bottom: 8px;">
                        1. ${prodottoPrincipale.nome}
                    </a>
                    <a href="${prodottoAncora.link}" target="_blank" onclick="trackComboClick('${context}', 2)" style="color: #032B44; text-decoration: none; font-weight: bold; display: block; padding: 8px; background: white; border-radius: 6px; border: 1px solid #ced4da;">
                        2. ${prodottoAncora.nome}
                    </a>
                </div>
            </div>
        </div>
    `;
    
    console.log('Calling addMessage with combo message');
    addMessage(message, 'bot');
}

// Funzione per tracciare i click sulle combos
function trackComboClick(context, productNumber) {
    if (!userPreferences.comboClicks) {
        userPreferences.comboClicks = {};
    }
    if (!userPreferences.comboClicks[context]) {
        userPreferences.comboClicks[context] = { product1: 0, product2: 0 };
    }
    userPreferences.comboClicks[context][`product${productNumber}`]++;
    saveUserPreferences();
    
    // Track combo click in GA4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'combo_click', {
            'context': context,
            'product_number': productNumber,
            'event_category': 'bot_interaction',
            'event_label': `combo_${context}_product${productNumber}`
        });
    }
    
    console.log(`Combo click tracked: ${context} - product ${productNumber}`);
}

// Funzione per avviare il timer di urgenza (70-120 minuti)
function startUrgencyTimer() {
    // Controlla se il timer è già stato avviato in questa sessione
    const urgencyShown = sessionStorage.getItem('urgencyComboShown');
    if (urgencyShown === 'true') {
        return;
    }
    
    // Controlla se il timer è già stato avviato
    if (urgencyTimerStarted) {
        return;
    }
    
    urgencyTimerStarted = true;
    
    // Calcola tempo casuale tra 1 e 10 minuti (in millisecondi)
    const minTime = 1 * 60 * 1000; // 1 minuto
    const maxTime = 10 * 60 * 1000; // 10 minuti
    const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
    
    console.log(`Urgency timer set for ${randomTime / 60000} minutes`);
    
    setTimeout(() => {
        const context = getContesto();
        const prodotti = getProdottiByCategoria(context);
        if (context && prodotti && prodotti.length > 0) {
            // Apri il chat se non è aperto
            if (!chatOpen) {
                toggleChat();
            }
            
            // Pulisci il chat e mostra il messaggio di combo
            setTimeout(() => {
                const chatMessages = document.getElementById('chat-messages');
                if (chatMessages) {
                    chatMessages.innerHTML = ''; // Pulisci tutti i messaggi
                }
                showUrgencyComboMessage(context);
                sessionStorage.setItem('urgencyComboShown', 'true');
            }, 1500);
        }
    }, randomTime);
}

// Funzione di test per attivare immediatamente il messaggio di combo
function testUrgencyCombo() {
    console.log('Testing urgency combo...');
    const context = getContesto();
    
    // Se non viene rilevato un contesto, usa 'mare' come default per il test
    const testContext = context || 'mare';
    
    console.log(`Test context: ${testContext}`);
    
    // Apri il chat se non è aperto
    if (!chatOpen) {
        toggleChat();
    }
    
    // Pulisci il chat e mostra il messaggio di combo
    setTimeout(() => {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = ''; // Pulisci tutti i messaggi
        }
        showUrgencyComboMessage(testContext);
    }, 1500);
}

// Proactive message bubble
let proactiveBubble = null;
let proactiveBubbleShown = false;

// Sales timeline timers
let engagementTimer = null;
let valueTimer = null;
let closingTimer = null;
let salesTimersStarted = false;

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

// Start sales timeline timers (1, 2, 3 minutes) - proportional to music duration
function startSalesTimers() {
    if (salesTimersStarted) return;
    salesTimersStarted = true;
    
    const nicheKey = detectCurrentNiche();
    const nicheName = nicheKey && NicheDatabase[nicheKey] ? NicheDatabase[nicheKey].name : 'questa categoria';
    
    // Se siamo in homepage, non fare nulla (bot normale)
    if (!nicheKey) {
        return;
    }
    
    // NOTA: Non nascondiamo più il pulsante nelle nicchie per permettere le combos di urgenza
    // Il pulsante deve essere sempre visibile
    // const chatButton = document.getElementById('ai-chat-button');
    // if (chatButton) {
    //     chatButton.style.display = 'none';
    // }
    
    // Rimossi messaggi generici (minuto 1, 2, 3) nelle nicchie - ridondanti
    // L'utente è già nella pagina, non ha senso linkare alla stessa pagina
    // Il sistema combo (70-120 minuti) è più intelligente e pertinente
}

// Show Amazon Killer Button (CTA grafico) - Step 3: Navigazione Guidata
function showAmazonKillerButton(phase) {
    const nicheKey = detectCurrentNiche();
    const niche = nicheKey && NicheDatabase[nicheKey] ? NicheDatabase[nicheKey] : null;
    const trackingTag = `tag=l0c39-21-${phase}`;
    
    let buttonHTML = '';
    
    if (niche && niche.topProducts && niche.topProducts.length > 0) {
        // Mostra i 6 prodotti TOP della categoria con link diretti
        buttonHTML = `
            <div class="amazon-killer-container">
                <div class="top-products-header">
                    <i class="fas fa-trophy text-warning"></i>
                    <strong>TOP 6 Prodotti ${niche.name}</strong>
                </div>
                <div class="top-products-list">
        `;
        
        niche.topProducts.forEach((product, index) => {
            // Aggiunge tracking tag al link esistente
            const productLink = product.link.includes('?') 
                ? `${product.link}&phase=${phase}`
                : `${product.link}?phase=${phase}`;
            
            buttonHTML += `
                <div class="top-product-item">
                    <span class="product-rank">${index + 1}</span>
                    <i class="fas ${product.icon} product-icon"></i>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-desc">${product.description}</div>
                    </div>
                    <a href="${productLink}" class="btn-product-view" target="_blank" rel="noopener">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            `;
        });
        
        // Use absolute path from root
        const nicheUrlAbsolute = niche.url.startsWith('/') ? niche.url : '/' + niche.url;
        buttonHTML += `
                </div>
                <a href="${nicheUrlAbsolute}?${trackingTag}" class="btn-amazon-killer" target="_blank" rel="noopener" onclick="trackAmazonKillerClick('${categoryKey}', 'all_products')">
                    <i class="fab fa-amazon"></i> Vedi Tutti i Prodotti
                </a>
            </div>
        `;
    } else {
        // Fallback: link generico alla categoria
        const nicheUrl = niche ? (niche.url.startsWith('/') ? niche.url : '/' + niche.url) : '#';
        buttonHTML = `
            <div class="amazon-killer-container">
                <a href="${nicheUrl}?${trackingTag}" class="btn-amazon-killer" target="_blank" rel="noopener" onclick="trackAmazonKillerClick('${categoryKey}', 'top_products')">
                    <i class="fab fa-amazon"></i> Vedi Top 5 Prodotti
                </a>
            </div>
        `;
    }
    
    addMessage(buttonHTML, 'bot', true);
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

// Apply theme to chat elements based on current niche
function applyThemeOnLoad() {
    const categoryKey = detectCurrentNiche();
    if (!categoryKey) return;
    
    const chatHeader = document.querySelector('.chat-header');
    const chatButton = document.getElementById('ai-chat-button');
    if (!chatHeader || !chatButton) return;
    
    const nicheData = NicheDatabase[categoryKey];
    if (!nicheData || !nicheData.personality) return;
    
    const personality = nicheData.personality;
    
    // Remove all existing theme classes from both header and button
    const themeClasses = [
        'theme-moda', 'theme-tech', 'theme-gaming', 'theme-cucina', 'theme-default',
        'theme-summer', 'theme-adventure', 'theme-fashion', 'theme-wellness',
        'theme-gaming-theme', 'theme-entertainment', 'theme-technical', 'theme-caring',
        'theme-aesthetic', 'theme-intellectual', 'theme-elegant', 'theme-eco',
        'theme-professional', 'theme-travel', 'theme-creative', 'theme-abbigliamento-serie-tv-film',
        'theme-blinding-lights', 'theme-as-it-was', 'theme-midnight-city', 'theme-parrucchiere',
        'theme-biciclette'
    ];
    
    themeClasses.forEach(themeClass => {
        chatHeader.classList.remove(themeClass);
        chatButton.classList.remove(themeClass);
    });
    
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
    
    // Special case for Merchandise Serie TV - use synthwave theme
    let themeClass = personalityToTheme[personality] || 'theme-default';
    if (categoryKey === 'abbigliamento-serie-tv-film') {
        themeClass = 'theme-abbigliamento-serie-tv-film';
    } else if (categoryKey === 'elite-gaming-gear') {
        themeClass = 'theme-blinding-lights';
    } else if (categoryKey === 'moda-donna') {
        themeClass = 'theme-as-it-was';
    } else if (categoryKey === 'biciclette-mobilita') {
        themeClass = 'theme-biciclette';
    } else if (categoryKey === 'parrucchiere-barbiere') {
        themeClass = 'theme-parrucchiere';
    } else if (categoryKey === 'tech') {
        themeClass = 'theme-midnight-city';
    }
    
    // Apply theme to both header and button
    chatHeader.classList.add(themeClass);
    chatButton.classList.add(themeClass);
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

// Related niches mapping for 80/20 strategy
const relatedNiches = {
    'mare': ['outdoor', 'viaggi', 'caldo'],
    'pc': ['tech', 'smartphone', 'cinema'],
    'outdoor': ['mare', 'viaggi', 'fitness'],
    'caldo': ['mare', 'outdoor', 'fitness'],
    'fitness': ['outdoor', 'smartphone', 'tech'],
    'smart-home': ['tech', 'arredamento', 'pet-care'],
    'pet-care': ['arredamento', 'outdoor', 'smart-home'],
    'cinema': ['tech', 'smartphone', 'pc'],
    'smartphone': ['tech', 'pc', 'cinema'],
    'tech': ['pc', 'smartphone', 'smart-home'],
    'moda-donna': ['accessori', 'profumi', 'moda-uomo'],
    'moda-uomo': ['accessori', 'profumi', 'moda-donna'],
    'arredamento': ['smart-home', 'benessere', 'pet-care'],
    'accessori': ['moda-donna', 'moda-uomo', 'profumi'],
    'benessere': ['arredamento', 'profumi', 'pet-care'],
    'giochi': ['pc', 'tech', 'cinema'],
    'libri': ['tech', 'smartphone', 'benessere'],
    'profumi': ['moda-donna', 'moda-uomo', 'accessori'],
    'lavoro': ['ufficio', 'tech', 'arredamento'],
    'sostenibilita': ['arredamento', 'benessere', 'outdoor'],
    'ufficio': ['lavoro', 'tech', 'arredamento'],
    'viaggi': ['mare', 'outdoor', 'caldo'],
    'fotografia': ['smartphone', 'tech', 'cinema'],
    'dvd': ['cinema', 'tech', 'pc']
};

// Detect scroll to trigger combo message at 50%
let comboTimerStarted = false;
let comboInterval = null;
let nicheIndex = 0;
let lastShownProducts = [];
const allNiches = ['mare', 'pc', 'outdoor', 'caldo', 'fitness', 'smart-home', 'pet-care', 'cinema', 'smartphone', 'tech', 'moda-donna', 'moda-uomo', 'arredamento', 'accessori', 'benessere', 'giochi', 'libri', 'profumi', 'lavoro', 'sostenibilita', 'ufficio', 'viaggi', 'fotografia', 'dvd'];

function detectComboScroll() {
    if (comboTimerStarted) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    if (scrollPercentage >= 50) {
        comboTimerStarted = true;
        
        // Mostra il messaggio combo subito al 50%
        showComboMessage();
        
        // Poi mostra ogni 30 secondi
        comboInterval = setInterval(() => {
            showComboMessage();
        }, 30000); // 30 secondi
    }
}

function showComboMessage() {
    // Ottieni il contesto corrente
    let context = getContesto();
    
    // Fallback: se contesto è null, usa 'mare' come default
    if (!context) {
        context = 'mare';
    }
    
    // Prima prova a usare le combo del database modulare
    const comboData = getComboData(context);
    
    if (comboData && comboData.combos && comboData.combos.length > 0) {
        // Usa le combo del database
        const randomCombo = comboData.combos[Math.floor(Math.random() * comboData.combos.length)];
        
        // Verifica che product1 e product2 esistano
        if (!randomCombo.product1 || !randomCombo.product2 || !randomCombo.product1.link || !randomCombo.product2.link) {
            console.log('Invalid combo data - missing products or links, using fallback');
        } else {
            const message = `
                <div class="urgency-combo-message">
                    <p>${randomCombo.message}</p>
                    <div class="combo-container">
                        <div class="combo-title">📦 Combo consigliata:</div>
                        <div>
                            <a href="${randomCombo.product1.link}" target="_blank" onclick="trackComboClick('${context}', 1)" class="combo-link">
                                1. ${randomCombo.product1.name}
                            </a>
                            <a href="${randomCombo.product2.link}" target="_blank" onclick="trackComboClick('${context}', 2)" class="combo-link">
                                2. ${randomCombo.product2.name}
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            addMessage(message, 'bot');
            return;
        }
    }
    
    // Fallback: usa il sistema vecchio con catalogoProdotti
    console.log('No combo data found, using fallback with catalogoProdotti');
    
    // 80% prodotti della nicchia corrente, 20% bibite/bevande
    const random = Math.random();
    let prodotti;
    let useBibite = false;
    
    if (random < 0.8) {
        // 80%: usa prodotti della nicchia corrente
        prodotti = getProdottiByCategoria(context);
        console.log('80%: usando prodotti della nicchia', context);
    } else {
        // 20%: usa bibite/bevande
        prodotti = getProdottiByCategoria('snack-bevande');
        useBibite = true;
        console.log('20%: usando bibite/bevande');
    }
    
    // Fallback: se non ci sono prodotti, usa prodotti da 'mare'
    if (!prodotti || prodotti.length === 0) {
        const prodottiMare = getProdottiByCategoria('mare');
        if (prodottiMare && prodottiMare.length > 0) {
            prodotti = prodottiMare;
            context = 'mare';
            useBibite = false;
        } else {
            return;
        }
    }
    
    if (context && prodotti && prodotti.length > 0) {
        // Se stiamo usando bibite, non filtrare le bibite
        const idBibite = ['coca_cola_zero', 'pepsi_max', 'fanta_original', 'l_angelica_waterstick', 'jamaica_zenzero'];
        const prodottiFiltrati = useBibite ? prodotti : prodotti.filter(p => !idBibite.includes(p.id));
        
        // Se non ci sono prodotti filtrati, usa tutti i prodotti
        const prodottiFinali = prodottiFiltrati.length > 0 ? prodottiFiltrati : prodotti;
        
        // Filtra prodotti per evitare ripetizioni consecutive
        const prodottiNonRipetuti = prodottiFinali.filter(p => !lastShownProducts.includes(p.id));
        
        // Se tutti i prodotti sono stati mostrati recentemente, resetta
        const prodottiDaUsare = prodottiNonRipetuti.length > 0 ? prodottiNonRipetuti : prodottiFinali;
        
        // Seleziona un prodotto a caso
        const indiceCasuale = Math.floor(Math.random() * prodottiDaUsare.length);
        const prodottoPrincipale = prodottiDaUsare[indiceCasuale];
        
        // Aggiungi ai prodotti mostrati recentemente (max 10)
        lastShownProducts.push(prodottoPrincipale.id);
        if (lastShownProducts.length > 10) {
            lastShownProducts.shift();
        }
        
        // Seleziona il secondo prodotto per la combo
        let prodottoAncora;
        if (useBibite) {
            // Se il principale è bibita, il secondo è della nicchia corrente
            const prodottiNiche = getProdottiByCategoria(context);
            const prodottiNicheFiltrati = prodottiNiche.filter(p => !idBibite.includes(p.id));
            const prodottiNicheDaUsare = prodottiNicheFiltrati.length > 0 ? prodottiNicheFiltrati : prodottiNiche;
            const indiceNiche = Math.floor(Math.random() * prodottiNicheDaUsare.length);
            prodottoAncora = prodottiNicheDaUsare[indiceNiche];
            console.log('Prodotto della nicchia selezionato:', prodottoAncora);
        } else {
            // Se il principale è della nicchia, il secondo è bibita
            let idBibitaScelta;
            if (context === 'fitness') {
                // Per fitness usa bevande con tag sportivi
                const tagSportivi = ['sportiva', 'energetica', 'isotonica', 'pre-workout'];
                const bevandeSportive = Object.keys(catalogoProdotti).filter(id => {
                    const prodotto = catalogoProdotti[id];
                    return prodotto.tag && prodotto.tag.some(tag => tagSportivi.includes(tag));
                });
                if (bevandeSportive.length > 0) {
                    const indiceBevanda = Math.floor(Math.random() * bevandeSportive.length);
                    idBibitaScelta = bevandeSportive[indiceBevanda];
                } else {
                    idBibitaScelta = 'red_bull';
                }
            } else {
                // Per altri contesti usa bevande con tag rinfrescanti
                const tagRinfrescanti = ['rinfrescante', 'senza zucchero', 'classica', 'analcolica', 'drenante', 'naturale'];
                const bevandeRinfrescanti = Object.keys(catalogoProdotti).filter(id => {
                    const prodotto = catalogoProdotti[id];
                    return prodotto.tag && prodotto.tag.some(tag => tagRinfrescanti.includes(tag));
                });
                if (bevandeRinfrescanti.length > 0) {
                    const indiceBevanda = Math.floor(Math.random() * bevandeRinfrescanti.length);
                    idBibitaScelta = bevandeRinfrescanti[indiceBevanda];
                } else {
                    idBibitaScelta = 'coca_cola_zero';
                }
            }
            prodottoAncora = catalogoProdotti[idBibitaScelta];
            console.log('Bibita selezionata a caso:', prodottoAncora);
        }
        
        // Controllo di sicurezza: verifica che i prodotti abbiano i nomi definiti
        if (!prodottoPrincipale || !prodottoPrincipale.nome || !prodottoAncora || !prodottoAncora.nome) {
            return;
        }
        
        // Prendi il messaggio combo per il contesto (seleziona random dall'array)
        const messagesArray = comboMessages[context] || comboMessages['mare'];
        const messaggioTemplate = Array.isArray(messagesArray) 
            ? messagesArray[Math.floor(Math.random() * messagesArray.length)]
            : messagesArray;
        
        // Sostituisci i placeholder
        const messaggioPersonalizzato = messaggioTemplate
            .replace('{prodottoNicchia}', prodottoPrincipale.nome)
            .replace('{prodottoAncora}', prodottoAncora.nome);
        
        const message = `
            <div class="urgency-combo-message">
                <p>${messaggioPersonalizzato}</p>
                <div class="combo-container">
                    <div class="combo-title">📦 Combo consigliata:</div>
                    <div>
                        <a href="${prodottoPrincipale.link}" target="_blank" onclick="trackComboClick('${context}', 1)" class="combo-link">
                            1. ${prodottoPrincipale.nome}
                        </a>
                        <a href="${prodottoAncora.link}" target="_blank" onclick="trackComboClick('${context}', 2)" class="combo-link">
                            2. ${prodottoAncora.nome}
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Apri il chat se non è aperto
        if (!chatOpen) {
            toggleChat();
        }
        
        // Pulisci il chat e mostra il messaggio di combo
        setTimeout(() => {
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) {
                chatMessages.innerHTML = ''; // Pulisci tutti i messaggi
            }
            addMessage(message, 'bot');
        }, 500);
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
        categories: ['smartphone-tech', 'tech', 'studio-fotografico', 'ufficio-produttivo']
    },
    'hobby-svago': {
        name: 'Hobby & Svago',
        icon: '🎮',
        categories: ['elite-gaming-gear', 'giochi-da-tavolo', 'libri-ereader']
    },
    'abbigliamento-serie-tv-film': {
        name: 'Abbigliamento Serie TV & Film',
        icon: '📺',
        categories: ['abbigliamento-serie-tv-film', 'dvd-bluray']
    },
    'moda': {
        name: 'Moda',
        icon: '👗',
        categories: ['moda-donna', 'moda-uomo', 'accessori-moda', 'profumi-bellezza']
    },
    'benessere': {
        name: 'Benessere',
        icon: '💪',
        categories: ['fitness-casa', 'benessere-cura-personale', 'parrucchiere-barbiere']
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
    'cucina-elettrodomestici': ['smart-home-domotica', 'arredamento-casa', 'snack-bevande'],
    'smart-home-domotica': ['cucina-elettrodomestici', 'tech', 'snack-bevande'],
    'fitness-casa': ['smartphone-tech', 'tech', 'snack-bevande'],
    'elite-gaming-gear': ['smartphone-tech', 'tech', 'abbigliamento-serie-tv-film', 'snack-bevande', 'manga-anime'],
    'pet-care-intelligente': ['arredamento-casa', 'outdoor-camping', 'snack-bevande'],
    'abbigliamento-serie-tv-film': ['tech', 'smartphone-tech', 'snack-bevande', 'manga-anime', 'musica-vinili'],
    'snack-bevande': ['fitness-casa', 'mare-spiaggia', 'outdoor-camping', 'caldo-rinfrescamento'],
    'smartphone-tech': ['tech', 'fitness-casa', 'elite-gaming-gear', 'snack-bevande'],
    'moda-donna': ['accessori-moda', 'profumi-bellezza', 'manga-anime', 'parrucchiere-barbiere', 'snack-bevande'],
    'moda-uomo': ['accessori-moda', 'profumi-bellezza', 'manga-anime', 'parrucchiere-barbiere', 'snack-bevande'],
    'viaggi-vacanze': ['outdoor-camping', 'mare-spiaggia', 'snack-bevande'],
    'accessori-moda': ['moda-donna', 'moda-uomo', 'parrucchiere-barbiere', 'snack-bevande'],
    'arredamento-casa': ['smart-home-domotica', 'benessere-cura-personale', 'snack-bevande'],
    'benessere-cura-personale': ['profumi-bellezza', 'arredamento-casa', 'parrucchiere-barbiere', 'snack-bevande'],
    'dvd-bluray': ['abbigliamento-serie-tv-film', 'snack-bevande'],
    'studio-fotografico': ['tech', 'smartphone-tech', 'snack-bevande'],
    'giochi-da-tavolo': ['elite-gaming-gear', 'snack-bevande'],
    'libri-ereader': ['tech', 'smartphone-tech', 'manga-anime', 'snack-bevande'],
    'mare-spiaggia': ['viaggi-vacanze', 'outdoor-camping', 'snack-bevande'],
    'outdoor-camping': ['viaggi-vacanze', 'mare-spiaggia', 'snack-bevande'],
    'biciclette-mobilita': ['fitness-casa', 'outdoor-camping', 'tech', 'snack-bevande'],
    'parrucchiere-barbiere': ['benessere-cura-personale', 'moda-donna', 'moda-uomo', 'accessori-moda', 'snack-bevande'],
    'manga-anime': ['abbigliamento-serie-tv-film', 'libri-ereader', 'moda-donna', 'moda-uomo', 'elite-gaming-gear', 'snack-bevande'],
    'musica-vinili': ['abbigliamento-serie-tv-film', 'tech', 'benessere-cura-personale', 'snack-bevande'],
    'profumi-bellezza': ['moda-donna', 'moda-uomo', 'benessere-cura-personale', 'parrucchiere-barbiere', 'snack-bevande'],
    'sostenibilita-eco-friendly': ['arredamento-casa', 'tech', 'snack-bevande'],
    'tech': ['smartphone-tech', 'fitness-casa', 'elite-gaming-gear', 'musica-vinili', 'snack-bevande'],
    'ufficio-produttivo': ['tech', 'arredamento-casa', 'snack-bevande'],
    'caldo-rinfrescamento': ['snack-bevande', 'fitness-casa']
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
        // Show feedback question when closing
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            addMessage("Hai trovato le specifiche tecniche che cercavi? Rispondi 'sì' o 'no' per aiutarci a migliorare.", 'bot');
            // Close chat after showing feedback question
            setTimeout(() => {
                chatWindow.classList.remove('active');
                chatButton.classList.remove('active');
                chatOpen = false;
            }, 3000);
        } else {
            chatWindow.classList.remove('active');
            chatButton.classList.remove('active');
            chatOpen = false;
        }
    } else {
        chatWindow.classList.add('active');
        chatButton.classList.add('active');
        chatOpen = true;

        // Track bot opening in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'bot_open', {
                'event_category': 'bot_interaction',
                'event_label': 'chat_opened'
            });
        }

        // Show welcome message with macro-categories on first open
        const chatMessages = document.getElementById('chat-messages');
        
        // Always show welcome message when chat is opened
        if (chatMessages) {
            showWelcomeMessage();
        }
    }
}

// Get current special occasion based on date (seasonal only, no personal occasions)
function getCurrentOccasion() {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();
    
    // Christmas (December 20-31)
    if (month === 12 && day >= 20) {
        return 'christmas';
    }
    
    // Valentine's Day (February 10-15)
    if (month === 2 && day >= 10 && day <= 15) {
        return 'valentine';
    }
    
    // Halloween (October 25-31)
    if (month === 10 && day >= 25) {
        return 'halloween';
    }
    
    // Easter (variable, approximate for March-April)
    if (month === 3 || (month === 4 && day <= 15)) {
        return 'easter';
    }
    
    // Summer (June 15 - September 15)
    if ((month === 6 && day >= 15) || month === 7 || month === 8 || (month === 9 && day <= 15)) {
        return 'summer';
    }
    
    // Back to school (August 25 - September 15)
    if ((month === 8 && day >= 25) || (month === 9 && day <= 15)) {
        return 'back_to_school';
    }
    
    // Winter (December 1 - February 28)
    if (month === 12 || month === 1 || (month === 2 && day <= 28)) {
        return 'winter';
    }
    
    return null;
}

// Show welcome message with macro-categories
function showWelcomeMessage() {
    loadUserPreferences();
    const personalizedGreeting = getPersonalizedGreeting();
    addMessage(personalizedGreeting, 'bot');
    
    // Show "Pausa Ristoro 🥤" immediately after welcome (Strategy: break the ice with low-cost impulse purchase)
    setTimeout(() => {
        addMessage("<div style='padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);'><strong style='font-size: 1.1em; display: block; margin-bottom: 8px;'>✨ Pausa Smart</strong><p style='margin: 0; font-size: 0.95em; line-height: 1.5;'>Mentre esplori, i nostri clienti più fedeli scelgono questi must-have per ricaricare le energie:</p><div style='margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap;'><a href='https://www.amazon.it/dp/B00Y8D9P6K?&linkCode=ll2&tag=l0c39-21&linkId=e8af102093795fae01900556a8432f07&ref=_as_li_ss_tl' target='_blank' style='background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; color: white; text-decoration: none; font-weight: 500; border: 1px solid rgba(255,255,255,0.3); transition: all 0.3s;'>⚡ Powerade</a><a href='https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl' target='_blank' style='background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; color: white; text-decoration: none; font-weight: 500; border: 1px solid rgba(255,255,255,0.3); transition: all 0.3s;'>🥤 Pepsi Max</a></div></div>", 'bot');
    }, 400);
    
    // Check for seasonal occasion (no personal occasions like birthdays)
    const currentOccasion = getCurrentOccasion();
    if (currentOccasion) {
        setTimeout(() => {
            addMessage(getSpecialOccasionMessage(currentOccasion), 'bot');
        }, 700);
    }
    
    // Show smart suggestions based on learning
    const totalVisits = Object.values(userPreferences.visits || {}).reduce((a, b) => a + b, 0);
    if (totalVisits > 0) {
        setTimeout(() => {
            showSmartSuggestions();
        }, 1200);
    } else {
        setTimeout(() => {
            showMacroCategories();
        }, 900);
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
    
    // Track macro category selection in GA4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'bot_macro_category_selected', {
            'macro_category': macro.name,
            'macro_key': macroKey,
            'event_category': 'bot_interaction',
            'event_label': 'macro_selection'
        });
    }
    
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
    
    // Track chat close in GA4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'bot_close', {
            'event_category': 'bot_interaction',
            'event_label': 'chat_closed'
        });
    }
}

// Show Spotify player in chat
function showSpotifyPlayer(spotifyUrl, songName) {
    // Track Spotify play in Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'spotify_play', {
            'event_category': 'music_interaction',
            'event_label': songName
        });
    }
    
    const playerMessage = `
        <div style="margin: 10px 0;">
            <p style="margin-bottom: 8px;">🎵 Now playing: ${songName}</p>
            <iframe style="border-radius:12px; border:0; width: 100%; height: 152px;" 
                src="${spotifyUrl.replace('open.spotify.com/track', 'open.spotify.com/embed/track')}" 
                width="100%" height="152" 
                frameBorder="0" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
            </iframe>
        </div>
    `;
    addMessage(playerMessage, 'bot');
}

// Track Amazon Music click in Google Analytics
function trackAmazonMusicClick() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'amazon_music_click', {
            'event_category': 'music_interaction',
            'event_label': 'amazon_music_unlimited'
        });
    }
}

// Track Kindle Unlimited click in Google Analytics
function trackKindleClick() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'kindle_unlimited_click', {
            'event_category': 'reading_interaction',
            'event_label': 'Kindle Unlimited'
        });
    }
}

// Apply dynamic color theme based on category personality
function applyBotTheme(categoryKey) {
    const chatHeader = document.querySelector('.chat-header');
    const chatButton = document.getElementById('ai-chat-button');
    if (!chatHeader || !chatButton) return;
    
    const nicheData = NicheDatabase[categoryKey];
    if (!nicheData || !nicheData.personality) return;
    
    const personality = nicheData.personality;
    
    // Remove all existing theme classes from both header and button
    const themeClasses = [
        'theme-moda', 'theme-tech', 'theme-gaming', 'theme-cucina', 'theme-default',
        'theme-summer', 'theme-adventure', 'theme-fashion', 'theme-wellness',
        'theme-gaming-theme', 'theme-entertainment', 'theme-technical', 'theme-caring',
        'theme-aesthetic', 'theme-intellectual', 'theme-elegant', 'theme-eco',
        'theme-professional', 'theme-travel', 'theme-creative', 'theme-abbigliamento-serie-tv-film',
        'theme-blinding-lights', 'theme-as-it-was', 'theme-midnight-city', 'theme-parrucchiere',
        'theme-biciclette'
    ];
    
    themeClasses.forEach(themeClass => {
        chatHeader.classList.remove(themeClass);
        chatButton.classList.remove(themeClass);
    });
    
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
    
    // Special case for Merchandise Serie TV - use synthwave theme
    let themeClass = personalityToTheme[personality] || 'theme-default';
    if (categoryKey === 'abbigliamento-serie-tv-film') {
        themeClass = 'theme-abbigliamento-serie-tv-film';
    } else if (categoryKey === 'elite-gaming-gear') {
        themeClass = 'theme-blinding-lights';
    } else if (categoryKey === 'moda-donna') {
        themeClass = 'theme-as-it-was';
    } else if (categoryKey === 'biciclette-mobilita') {
        themeClass = 'theme-biciclette';
    } else if (categoryKey === 'parrucchiere-barbiere') {
        themeClass = 'theme-parrucchiere';
    } else if (categoryKey === 'tech') {
        themeClass = 'theme-midnight-city';
    }
    
    // Apply theme to both header and button
    chatHeader.classList.add(themeClass);
    chatButton.classList.add(themeClass);
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
    
    const message = chatInput.value.trim().toLowerCase();
    if (!message) return;
    
    // Check for feedback responses
    if (message === 'sì' || message === 'si' || message === 'yes') {
        addMessage(message, 'user');
        chatInput.value = '';
        addMessage("Grazie per il feedback! Ci aiuta a migliorare le nostre selezioni tecniche.", 'bot');
        return;
    }
    
    if (message === 'no') {
        addMessage(message, 'user');
        chatInput.value = '';
        addMessage("Ci dispiace. Cosa stavi cercando specificamente? Ti aiuteremo a trovarlo.", 'bot');
        return;
    }
    
    // Track user message in GA4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'bot_message_sent', {
            'message_length': message.length,
            'event_category': 'bot_interaction',
            'event_label': 'user_message'
        });
    }
    
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Reset abandonment timer on user interaction
    resetAbandonmentTimer();
    
    // Show loading indicator immediately
    addLoadingIndicator();
    
    // Analyze and respond
    const category = await analyzeMessage(message);
    
    // Remove loading indicator
    removeLoadingIndicator();
    
    // Hide typing indicator
    hideTypingIndicator();
    
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
                        // Use absolute path from root
                        const finalUrl = category.url.startsWith('/') ? category.url : '/' + category.url;
                        categoryLinkDiv.innerHTML = `
                            <div class="category-consultation-card">
                                <div class="consultation-icon">📊</div>
                                <div class="consultation-content">
                                    <h4 class="fw-bold mb-2">Tabella Comparativa Disponibile</h4>
                                    <p class="text-muted mb-3">Ho preparato una tabella comparativa completa con tutti i prodotti selezionati, le loro caratteristiche e i prezzi per aiutarti a scegliere la soluzione migliore.</p>
                                    <a href="${finalUrl}" class="btn btn-primary btn-sm">
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

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot loading';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<div class="typing-indicator"><span style="animation: typing 0.6s infinite">●</span><span style="animation: typing 0.6s 0.2s infinite">●</span><span style="animation: typing 0.6s 0.4s infinite">●</span></div>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
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
    
    // Use absolute path from root - works on both Vercel and local server
    const finalUrl = category.url.startsWith('/') ? category.url : '/' + category.url;
    
    const linkDiv = document.createElement('div');
    linkDiv.className = 'chat-message bot';
    linkDiv.innerHTML = `<a href="${finalUrl}" class="category-link">👉 Vedi tutti i prodotti ${category.name}</a>`;
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
        <a href="${product.link}" class="product-link" target="_blank" rel="noopener noreferrer">👀 Se ti va, dai un'occhiata su Amazon</a>
    `;
    
    chatMessages.appendChild(productDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get personality-based response with variations
function getPersonalityResponse(categoryKey, personality, categoryName) {
    const personalityResponses = {
        'functional': [
            `Per ${categoryName} io mi affido a prodotti che durano davvero, non so tu ma odio doverli ricomprare subito. Questi che ti mostro li uso da un po' e mi trovo bene, se ti va dai un'occhiata:`,
            `Non so tu, ma per ${categoryName} cerco sempre qualità-prezzo. Questi mi hanno convinto, li uso e funzionano bene. Se ti interessano te li lascio qui:`,
            `Per ${categoryName} ho fatto un sacco di ricerche prima di trovare quelli giusti. Questi sono quelli che uso, se vuoi dacci un'occhiata:`
        ],
        'technical': [
            `Per ${categoryName} sono molto schizzinoso sulle specifiche. Questi prodotti li ho testati personalmente e funzionano alla grande. Se ti va te li passo:`,
            `Non so tu, ma per ${categoryName} voglio che tutto sia compatibile e funzioni bene. Questi li uso e mi trovo bene, se ti interessano:`,
            `Per ${categoryName} ho controllato ogni dettaglio tecnico. Questi sono quelli che uso quotidianamente, se vuoi dacci un'occhiata:`
        ],
        'motivational': [
            `Per ${categoryName} ti serve qualcosa che ti motivi davvero. Io uso questi prodotti e mi aiutano a dare il massimo. Se ti va te li lascio qui:`,
            `Non so tu, ma per ${categoryName} cerco prodotti che mi spingano a fare di più. Questi funzionano per me, se ti interessano:`,
            `Per la tua performance in ${categoryName} questi prodotti sono top. Li uso e fanno la differenza, se vuoi dacci un'occhiata:`
        ],
        'gaming': [
            `Ah, cerchi roba per il gaming? 🎮 Io uso questi prodotti da un sacco di tempo, latenza e FPS sono perfetti. Se ti va te li passo:`,
            `Per il tuo setup gaming in ${categoryName} non scendere a compromessi. Questi li uso e non mi hanno mai deluso, se ti interessano:`,
            `Per dominare in ${categoryName} ti serve l'attrezzatura giusta. Io uso questi e funzionano benissimo, se vuoi dacci un'occhiata:`
        ],
        'caring': [
            `Per il tuo amico a quattro zampe in ${categoryName} io uso solo prodotti sicuri. Questi li uso con il mio animale e mi trovo benissimo. Se ti va te li lascio:`,
            `Non so tu, ma per ${categoryName} voglio il massimo comfort per il mio animale. Questi prodotti sono perfetti, se ti interessano:`,
            `Per la cura del tuo animale con ${categoryName} questi prodotti sono affidabili. Li uso quotidianamente, se vuoi dacci un'occhiata:`
        ],
        'entertainment': [
            `Per il tuo intrattenimento in ${categoryName} io cerco prodotti con stile. Questi li uso e fanno la differenza. Se ti va te li passo:`,
            `Non so tu, ma per ${categoryName} voglio qualcosa di unico. Questi prodotti hanno un design pazzesco, se ti interessano:`,
            `Per il tuo setup entertainment in ${categoryName} questi prodotti sono iconici. Li uso e mi piace un sacco, se vuoi dacci un'occhiata:`
        ],
        'summer': [
            `Che bello, vai al mare! 🏖️ Per ${categoryName} io uso questi prodotti, sono perfetti per l'estate. Se ti va te li lascio:`,
            `Non so tu, ma per ${categoryName} voglio roba che resista al sole e alla sabbia. Questi li uso e funzionano benissimo, se ti interessano:`,
            `Per la tua estate perfetta con ${categoryName} questi prodotti sono essenziali. Li uso ogni anno, se vuoi dacci un'occhiata:`
        ],
        'adventure': [
            `Per le tue avventure in ${categoryName} ti serve attrezzatura che resiste. Io uso questi prodotti e non mi hanno mai deluso. Se ti va te li passo:`,
            `Non so tu, ma per ${categoryName} cerco roba robusta. Questi prodotti resistono a tutto, li uso nelle mie escursioni. Se ti interessano:`,
            `Per le tue escursioni con ${categoryName} questi prodotti sono top. Li uso e fanno la differenza, se vuoi dacci un'occhiata:`
        ],
        'fashion': [
            `Per il tuo stile in ${categoryName} io cerco capi con tessuti di qualità. Questi li uso e il look è perfetto. Se ti va te li lascio:`,
            `Non so tu, ma per ${categoryName} voglio qualcosa di distintivo. Questi capi hanno un design pazzesco, se ti interessano:`,
            `Per esprimere il tuo stile con ${categoryName} questi prodotti sono di tendenza. Li uso e mi piace un sacco, se vuoi dacci un'occhiata:`
        ],
        'aesthetic': [
            `Per arredare in ${categoryName} io cerco prodotti che abbiano stile. Questi li uso a casa mia e l'effetto è bellissimo. Se ti va te li passo:`,
            `Non so tu, ma per ${categoryName} voglio design minimalista. Questi prodotti sono perfetti, li uso e mi trovo benissimo. Se ti interessano:`,
            `Per la tua casa con ${categoryName} questi prodotti combinano bellezza e utilità. Li uso e funzionano alla grande, se vuoi dacci un'occhiata:`
        ],
        'wellness': [
            `Per la tua routine di bellezza in ${categoryName} io uso solo prodotti efficaci. Questi li uso quotidianamente e mi trovo benissimo. Se ti va te li lascio:`,
            `Non so tu, ma per ${categoryName} voglio prodotti naturali. Questi sono perfetti per il relax, se ti interessano:`,
            `Per prenderti cura di te con ${categoryName} questi prodotti sono top. Li uso e fanno la differenza, se vuoi dacci un'occhiata:`
        ],
        'intellectual': [
            `Per i tuoi momenti di lettura in ${categoryName} io cerco prodotti di qualità. Questi li uso e stimolano la mente. Se ti va te li passo:`,
            `Non so tu, ma per ${categoryName} voglio dispositivi che funzionino bene. Questi li uso per leggere e sono perfetti, se ti interessano:`,
            `Per i tuoi momenti di cultura con ${categoryName} questi prodotti sono ottimi. Li uso e mi piace un sacco, se vuoi dacci un'occhiata:`
        ],
        'elegant': [
            `Per il tuo stile in ${categoryName} io cerco profumi esclusivi. Questi li uso e ricevo sempre complimenti. Se ti va te li lascio:`,
            `Non so tu, ma per ${categoryName} voglio qualcosa di elegante. Questi profumi sono pazzeschi, se ti interessano:`,
            `Per esprimere la tua eleganza con ${categoryName} queste fragranze sono top. Le uso e mi piace un sacco, se vuoi dacci un'occhiata:`
        ],
        'eco': [
            `Per ridurre l'impatto ambientale in ${categoryName} io uso solo prodotti sostenibili. Questi li uso e sono perfetti. Se ti va te li passo:`,
            `Non so tu, ma per ${categoryName} voglio prodotti eco-friendly. Questi sono ottimi per l'ambiente, se ti interessano:`,
            `Per uno stile di vita sostenibile con ${categoryName} questi prodotti sono ideali. Li uso e funzionano benissimo, se vuoi dacci un'occhiata:`
        ],
        'professional': [
            `Per il tuo lavoro in ${categoryName} io cerco capi sicuri e comodi. Questi li uso e non mi hanno mai deluso. Se ti va te li lascio:`,
            `Non so tu, ma per ${categoryName} voglio roba professionale. Questi prodotti sono affidabili, se ti interessano:`,
            `Per il tuo ambiente di lavoro con ${categoryName} questi prodotti sono top. Li uso quotidianamente, se vuoi dacci un'occhiata:`
        ],
        'travel': [
            `Per i tuoi viaggi in ${categoryName} io cerco accessori pratici. Questi li uso e viaggiare è molto più facile. Se ti va te li passo:`,
            `Non so tu, ma per ${categoryName} voglio viaggiare senza pensieri. Questi accessori sono essenziali, se ti interessano:`,
            `Per le tue avventure di viaggio con ${categoryName} questi prodotti sono perfetti. Li uso e fanno la differenza, se vuoi dacci un'occhiata:`
        ],
        'creative': [
            `Per la tua fotografia in ${categoryName} io cerco accessori creativi. Questi li uso e migliorano un sacco le mie foto. Se ti va te li lascio:`,
            `Non so tu, ma per ${categoryName} voglio roba che stimoli la creatività. Questi accessori sono top, se ti interessano:`,
            `Per esprimere la tua arte con ${categoryName} questi prodotti sono perfetti. Li uso e mi piace un sacco, se vuoi dacci un'occhiata:`
        ]
    };
    
    const responses = personalityResponses[personality] || [`Ecco i prodotti ${categoryName}:`];
    
    // Select random variation
    return responses[Math.floor(Math.random() * responses.length)];
}

// Get professional follow-up questions to understand customer needs better
function getProfessionalFollowUp(categoryName) {
    const followUpQuestions = [
        `Per aiutarti meglio con ${categoryName}, mi potresti dire qual è il tuo budget? Così ti mostro le opzioni più adatte.`,
        `Lo usi per lavoro, per tempo libero o per un regalo? Questo mi aiuta a suggerirti il prodotto giusto per ${categoryName}.`,
        `Hai già qualcosa di simile o è la prima volta che acquisti questo tipo di prodotto?`,
        `Cosa ti importa di più in questo prodotto: qualità, prezzo, design o funzionalità specifiche?`
    ];
    return followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
}

// Get professional consultation message
function getProfessionalConsultation(categoryName, reason) {
    const consultations = [
        `In base a quello che mi hai detto, ti consiglio questo prodotto per ${categoryName} perché ${reason}. È una scelta affidabile per le tue esigenze.`,
        `Attenzione: questo prodotto per ${categoryName} ha una caratteristica particolare che potrebbe fare al caso tuo: ${reason}.`
    ];
    return consultations[Math.floor(Math.random() * consultations.length)];
}

// Get friendly closing message
function getFriendlyClosing() {
    const closings = [
        "Grazie per aver visitato! Torna presto per nuove offerte. 😊",
        "È stato un piacere aiutarti! Se hai bisogno di altro, sono a disposizione. A presto! 👋",
        "Grazie per la fiducia! Torna a trovarci quando vuoi. Ci vediamo! 🌟"
    ];
    return closings[Math.floor(Math.random() * closings.length)];
}

// Get special occasion message (seasonal only - no personal occasions)
function getSpecialOccasionMessage(occasion) {
    const occasions = {
        'christmas': "🎄 Buone feste! Ecco alcune idee regalo perfette per il Natale.",
        'valentine': "💕 San Valentino si avvicina! Ecco i prodotti perfetti per la persona che ami.",
        'halloween': "🎃 Halloween è arrivato! Ecco i prodotti perfetti per la festa più spaventosa dell'anno!",
        'easter': "🐣 Pasqua è in arrivo! Ecco i prodotti ideali per festeggiare la primavera.",
        'summer': "☀️ L'estate è arrivata! Ecco i prodotti più venduti per goderti al meglio la stagione.",
        'back_to_school': "📚 Torniamo a scuola! Ecco tutto ciò che ti serve per iniziare nel migliore dei modi.",
        'winter': "❄️ L'inverno è arrivato! Ecco i prodotti perfetti per affrontare il freddo con stile."
    };
    return occasions[occasion] || "Ecco i prodotti perfetti per questa occasione speciale!";
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
        
        // Track category selection in GA4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'bot_category_selected', {
                'category_name': category.name,
                'category_key': categoryKey,
                'event_category': 'bot_interaction',
                'event_label': 'category_selection'
            });
        }
        
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
                // Add professional follow-up question
                addMessage(getProfessionalFollowUp(category.name), 'bot');
                setTimeout(() => {
                    addCategoryLink(category);
                    
                    // Add professional consultation
                    const reason = nicheData && nicheData.valueProp ? nicheData.valueProp : "ha ottime recensioni e un ottimo rapporto qualità-prezzo";
                    setTimeout(() => {
                        addMessage(getProfessionalConsultation(category.name, reason), 'bot');
                    }, 500);
                
                    // Add follow-up with song reference
                    if (nicheData && nicheData.song && (nicheData.songLinkSpotify || nicheData.songLinkAmazon)) {
                        setTimeout(() => {
                            const songMessage = `
                                <div style="margin: 10px 0;">
                                    <p style="margin-bottom: 8px;">Per abbinare al meglio i prodotti di ${category.name}, ti consiglio questo sound iconico come sottofondo.</p>
                                    <p style="margin-bottom: 8px; font-weight: bold;">🎵 Ascolta subito:</p>
                                    ${nicheData.songLinkSpotify ? `
                                    <p style="margin-bottom: 8px;">
                                        <button onclick="showSpotifyPlayer('${nicheData.songLinkSpotify}', '${nicheData.song}')" 
                                                style="background: #1DB954; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px;">
                                            ▶ Play su Spotify
                                        </button>
                                    </p>` : ''}
                                    ${(categoryKey === 'libri-ereader' || categoryKey === 'manga-anime') && nicheData.kindleLink ? `
                                    <div class="premium-box" style="margin-top:12px; border:1px solid #007185; padding:10px; background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); border-radius: 8px; font-size: 0.9em; color: #007185; text-align: center;">
                                        📚 <strong>Vuoi un modo migliore per leggere?</strong> 
                                        <br><a href="${nicheData.kindleLink}" target="_blank" onclick="trackKindleClick()" style="color: #007185; font-weight: bold; text-decoration: underline;">Prova Kindle Unlimited con migliaia di libri</a>
                                    </div>` : ''}
                                    ${nicheData.songLinkAmazon ? `
                                    <div class="premium-box" style="margin-top:12px; border:1px solid gold; padding:10px; background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%); border-radius: 8px; font-size: 0.9em; color: #856404; text-align: center;">
                                        💎 <strong>Vuoi l'esperienza in alta qualità?</strong> 
                                        <br><a href="${nicheData.songLinkAmazon}" target="_blank" onclick="trackAmazonMusicClick()" style="color: #d4a017; font-weight: bold; text-decoration: underline;">Ascolta su Amazon Music Unlimited</a>
                                    </div>
                                    ` : ''}
                                </div>
                            `;
                            addMessage(songMessage, 'bot');
                            
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
    // Reset all timer flags on page load to prevent blocking
    proactiveBubbleShown = false;
    pageScrollTriggered = false;
    salesTimersStarted = false;
    comboTimerStarted = false;
    urgencyTimerStarted = false;
    
    // Apply theme on load
    applyThemeOnLoad();
    
    // Start page-level proactive message after 5-10 seconds
    setTimeout(() => {
        startPageProactiveMessage();
    }, 5000);
    
    // Start sales timeline timers (Step 1)
    setTimeout(() => {
        startSalesTimers();
    }, 1000);
    
    // Disable urgency timer - now triggered by scroll at 50%
    // setTimeout(() => {
    //     startUrgencyTimer();
    // }, 2000);
    
    // Disable scroll detection for combo messages
    window.addEventListener('scroll', detectScroll);
    // window.addEventListener('scroll', detectComboScroll);
    
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

// Track Amazon Killer button clicks in GA4
function trackAmazonKillerClick(categoryKey, buttonType) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'bot_amazon_killer_click', {
            'category_key': categoryKey,
            'button_type': buttonType,
            'event_category': 'bot_interaction',
            'event_label': 'amazon_killer_button'
        });
    }
}
