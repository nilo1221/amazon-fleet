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

// Get personalized greeting based on visit history
function getPersonalizedGreeting() {
    const totalVisits = Object.values(userPreferences.visits || {}).reduce((a, b) => a + b, 0);
    
    if (totalVisits === 0) {
        return 'Ehi ciao! 👋 Stavo giusto guardando questi prodotti su Amazon, ci sono un sacco di cose interessanti. Dimmi, cosa ti serve oggi? Se mi dici cosa stai cercando, ti faccio vedere quello che secondo me vale la pena.';
    } else if (totalVisits < 3) {
        return 'Ehi bentornato! 👋 È bello rivederti. Vuoi continuare a guardare dove avevi lasciato o cerchi qualcosa di nuovo oggi?';
    } else {
        return 'Ehi bentornato! 👋 Ti conosco già fammi indovinare... vuoi vedere i prodotti che ti hanno interessato di più l\'altra volta?';
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
        songLink: "https://www.youtube.com/watch?v=JibQy5y4R8o",
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
        songLink: "https://www.youtube.com/watch?v=Erd49aFS55g",
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
        songLink: "https://www.youtube.com/watch?v=Z61s-fO3x7k",
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
        songLink: "https://www.youtube.com/watch?v=4NRXx6U8ABQ",
        songLinkSpotify: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "pet-care-intelligente": {
        name: "Pet Care Intelligente",
        tags: ["gatto", "cane", "animale", "lettiera", "autopulente", "cibo", "pet", "zampa", "crocchette", "mangiatore", "bevitore", "automatico", "spazzola", "pelo", "tagliaunghie", "trasportino", "cuccia", "casa", "cane", "giocattolo", "osso", "corda", "pallina", "collare", "guinzaglio", "pettorina", "museruola", "antiparassitario", "pulci", "zecke", "integratore", "vitamine"],
        url: "/pet-care-intelligente/index.html",
        personality: "caring",
        valueProp: "Ho selezionato i migliori prodotti per il benessere del tuo animale domestico.",
        song: "Who Let the Dogs Out - Baha Men",
        songLink: "https://www.youtube.com/watch?v=Qkuu0Lwb5EM",
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
    "cinema-tv": {
        name: "Cinema & TV",
        tags: ["tv", "televisione", "proiettore", "cinema", "film", "bluray", "dvd", "schermo", "monitor", "home", "theater", "surround", "soundbar", "altoparlante", "speaker", "sound", "audio", "hifi", "amplificatore", "ricevitore", "decoder", "satellite", "streaming", "netflix", "prime", "disney", "hbo", "apple", "tv", "chromecast", "fire", "stick", "roku", "kodi", "plex", "media", "player", "cavo", "hdmi", "4k", "8k", "oled", "qled", "led", "lcd"],
        url: "/cinema-tv/index.html",
        personality: "entertainment",
        valueProp: "Ho selezionato i migliori prodotti per il tuo stile. Tessuto, vestibilità e design iconico sono i criteri che ho considerato.",
        song: "Eye of the Tiger - Survivor",
        songLink: "https://www.youtube.com/watch?v=btPJPFnesV4",
        songLinkSpotify: "https://open.spotify.com/track/2KH16WveTQWT6KOG9Rg6e2",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "bibite-bevande": {
        name: "Bibite & Bevande",
        tags: ["bibita", "bevanda", "coca", "cola", "pepsi", "fanta", "sprite", "acqua", "gassata", "analcolica", "birra", "vino", "succo", "frizzante", "tonica", "ginger", "zenzero", "limonata", "aranciata", "drenante", "integratore", "energy", "drink", "red", "bull", "monster", "caffe", "tè", "the", "tisana", "infuso", "latte", "soda", "soft", "drink", "lattina", "bottiglia", "scorta", "multipack", "confezione", "famiglia"],
        url: "/bibite-bevande/index.html",
        personality: "refreshing",
        valueProp: "Ho selezionato le bibite e bevande migliori per rinfrescarti. Gusto, qualità e convenienza sono i fattori chiave.",
        song: "Sugar - Maroon 5",
        songLink: "https://www.youtube.com/watch?v=09R8_2nJtjg",
        songLinkSpotify: "https://open.spotify.com/track/6PQK5W1qJc7Qf9q5K8Y9X0",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref=_as_li_ss_tl",
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
        songLink: "https://www.youtube.com/watch?v=GQ95z6ywcBY",
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
        songLink: "https://www.youtube.com/watch?v=YJVmu6yttiw",
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
        songLink: "https://www.youtube.com/watch?v=Ke1Us_3qfkg",
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
        songLink: "https://www.youtube.com/watch?v=1vrEljMfXYo",
        songLinkSpotify: "https://open.spotify.com/track/1QbOvACeYanja5pbnJbAmk",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref=_as_li_ss_tl",
        topProducts: [
            {
                name: "Outsunny Tenda da Campeggio per 5 Persone",
                description: "Tenda famigliare a tunnel impermeabile con 2 stanze separate e veranda",
                icon: "fa-campground",
                link: "https://www.amazon.it/Outsunny-Campeggio-Famigliare-Impermeabile-Trasporto/dp/B0F29BC3LJ?dib=eyJ2IjoiMSJ9.ulozInvSluYgmjL7E4H17-nAjJHzYRjROTEnqlFpGL9rcTv1HvBYllPgdkIOoBc-SXEeDIUidIWqJE4AeJTHcZ5kpcfb-CbXWSuWBnlEGux0SYwJl5CN6KjwbGkcf5LYtfkWYLYhp-VRNrNS39zryi-GS8GUlm9wertELzYFRsAg71Q6fOgEh7TBpUI6u8QHOJUlu2meJDnywkKi1X5bXBNiXNAhAwJKJ9bqCG3l-8t4IkuYs_y0pQC-xviQ1KLrXxRPf2HuWEFd42TvQJZTycFqjyjdOxHq0ZCX6PoU80I.EZDBto_kC4Hujwih7D6p-5SlIOd0DLRboEy_uZX_9X0&dib_tag=se&keywords=tenda%2Btunnel%2Bcampeggio%2Bpremium&qid=1779588392&sr=8-7&ufe=app_do%3Aamzn1.fos.fca66a76-6518-40f2-959f-2dca30e9c5d1&th=1&linkCode=ll2&tag=l0c39-21&linkId=b50732e0036a8492066b30d1254d5733&ref=_as_li_ss_tl"
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
        songLink: "https://www.youtube.com/watch?v=GuJQSAiODqI",
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
        songLink: "https://www.youtube.com/watch?v=7gz1DIIxqGk",
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
        songLink: "https://www.youtube.com/watch?v=lb9UXwWV7zE",
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
        songLink: "https://www.youtube.com/watch?v=GA9P5H15_6A",
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
        songLink: "https://www.youtube.com/watch?v=eAfyFTzZDMM",
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
        songLink: "https://www.youtube.com/watch?v=0pL9Ie5j3-8",
        songLinkSpotify: "https://open.spotify.com/track/3CaetUu7dGAS5AM52ceK1E",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "libri-ereader": {
        name: "Libri & E-Reader",
        tags: ["libro", "kindle", "ebook", "lettore", "romanzo", "thriller", "giallo", "fantasy", "fantascienza", "horror", "romance", "erotico", "storico", "biografia", "autobiografia", "saggio", "manual", "guida", "studio", "scuola", "università", "bambini", "ragazzi", "young", "adult", "fumetto", "manga", "graphic", "novel", "comics", "audiolibro", "audible", "kobo", "nook", "boox", "pocketbook", "tolino", "sony", "reader", "paperwhite", "oasis", "scribe", "clara", "libra", "h2o", "glo", "aura", "one", "edition", "forma", "cover", "custodia", "light", "case"],
        url: "/libri-ereader/index.html",
        personality: "intellectual",
        valueProp: "Ho selezionato i migliori libri e e-reader per i tuoi momenti di lettura.",
        song: "Words - Bee Gees",
        songLink: "https://www.youtube.com/watch?v=jW9BA2-h1H0",
        songLinkSpotify: "https://open.spotify.com/track/07PIhdmyYIw8dMeDMsx9FU",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    },
    "profumi-bellezza": {
        name: "Profumi & Bellezza",
        tags: ["profumo", "bellezza", "makeup", "cosmetico", "eau", "de", "toilette", "parfum", "eau", "de", "parfum", "intense", "edp", "edt", "cologne", "after", "shave", "balsamo", "dopobarba"],
        url: "/profumi-bellezza/index.html",
        personality: "elegant",
        valueProp: "Ho selezionato i profumi più esclusivi per la tua personalità.",
        song: "Por Una Cabeza - Tango",
        songLink: "https://www.youtube.com/watch?v=B5ezPA7msyI",
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
        songLink: "https://www.youtube.com/watch?v=dX3k_QDnzHE",
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
        songLink: "https://www.youtube.com/watch?v=XAi3VTSdTxU",
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
        songLink: "https://www.youtube.com/watch?v=LrvPW0JHzRQ",
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
        songLink: "https://www.youtube.com/watch?v=dvdJ1OfJ33o",
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
    "fotografia-mobile": {
        name: "Fotografia Mobile",
        tags: ["fotografia", "mobile", "fotocamera", "camera", "smartphone", "foto", "video", "lente", "obiettivo", "treppiede", "selfie", "stick", "gimbal", "stabilizzatore", "microfono", "esterno", "light", "ring", "flash", "kit", "fotografia"],
        url: "/fotografia-mobile/index.html",
        personality: "creative",
        valueProp: "Ho selezionato i migliori prodotti per migliorare la tua fotografia mobile.",
        song: "Photograph - Ed Sheeran",
        songLink: "https://www.youtube.com/watch?v=nSDgHBxUbVQ",
        songLinkSpotify: "https://open.spotify.com/track/1HNkqx9Ahdgi1Ixy2xkKkL",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
        topProducts: [
            {
                name: "Obiettivo Macro Evil Eye Con Luce Di Riempimento",
                description: "Lente macro professionale con luce di riempimento integrata per smartphone",
                icon: "fa-camera",
                link: "https://www.amazon.it/Evil-Riempimento-Smartphone-Professionale-HB100U/dp/B0FGDCC3T6?dib=eyJ2IjoiMSJ9.tSOJNnarIf8aiWBIYE09tkBO-ZyfEhf3FwHomH1WQ94p1_klYId3eto_BTlh2AnA6DFkI_jb2UdbBcjTH5dIYwX9_ux85T3xoPf3mAMw59DbZIKr-rf-EkAJI-bWRTPPMHO3hPKYPBDWEZa5O66019nGSYko8bRXlAleIUM2VyYwuA7jTDZisaNeuC58HhY8k7FPKZMxRuOS3CwaaXzUXbI0pgy4OpokPnoiA0adSKZJFtFzXjrPFrFtWcgNiKot_Yw1Kd2R0YAYM0i2hLZqpxAWGemo-e1cwbtMY-kFe-w.JXTQM30lH9wi0aM5-6FmOrAxtZWn5ekOQuXjdinmEwY&dib_tag=se&keywords=lente+macro+smartphone&qid=1779588926&sr=8-3-spons&aref=ynynWAvq12&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1&linkCode=ll2&tag=l0c39-21&linkId=32b53ec2d46d82783e04960af02a2a11&ref=_as_li_ss_tl"
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
        songLink: "https://www.youtube.com/watch?v=Iwuy4hHO3YQ",
        songLinkSpotify: "https://open.spotify.com/track/6t1FIJlZWTQfIZhsGjaulM",
        songLinkAmazon: "https://www.amazon.it/music/unlimited?&linkCode=ll2&tag=l0c39-21&linkId=539024401ce086052ad4fdbce6c0004b&ref_=as_li_ss_tl",
    }
};

// ContextDatabase - Combos per il bot di urgenza
const ContextDatabase = {
    "mare": {
        name: "Mare & Spiaggia",
        triggerKeywords: ["mare", "spiaggia", "ombrellone", "telo", "sole", "acqua", "estivo", "estates"],
        combos: [
            {
                product1: {
                    name: "Joy Summer Ombrellone Spiaggia Cabina Ø 200 BLU",
                    link: "https://www.amazon.it/Joy-Summer-Ombrellone-Spiaggia-Cabina/dp/B00W1KAQWY?&linkCode=ll2&tag=l0c39-21&linkId=94666e812e9a7fa1ccb012eb0fd999cc&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Una giornata di sole fantastica, vero? 🌊 Per goderti il mare senza pensieri, ho unito l'ombrellone perfetto alla Coca-Cola Zero: è la combo ideale per restare idratato sotto il sole senza dover correre al bar. Comoda, pratica e pensata per il tuo relax."
            }
        ]
    },
    "pc": {
        name: "PC & Gaming",
        triggerKeywords: ["pc", "computer", "gaming", "lavoro", "studio", "ufficio", "monitor", "cuffie", "mouse", "tastiera"],
        combos: [
            {
                product1: {
                    name: "HyperX Cloud Cuffie Gaming",
                    link: "https://www.amazon.it/HyperX-Cloud-Cuffie-Gaming-Mobile/dp/B00SAYCVTQ?mcid=c659dba90f523f5ca09a82b25c56a3e6&hvadid=700813659493&hvpos=&hvnetw=g&hvrand=12981572348516290815&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9190900&hvtargid=pla-381707145357&hvocijid=12981572348516290815-B00SAYCXWG-&hvexpln=0&th=1&linkCode=ll2&tag=l0c39-21&linkId=4e8af65a5e14abb66fa2f74389a0d44c&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ehi, ma ti stai preparando per lavorare? 🔥 Non so tu, ma io odio fermarmi a cercare bar o macchinette quando sono in concentrazione. Per questo mi porto dietro le cuffie HyperX Cloud e la Coca-Cola Zero: con questa combo ho risolto il problema concentrazione e idratazione per tutta la sessione. Se ti va te la lascio qui, è una bella comodità."
            }
        ]
    },
    "outdoor": {
        name: "Outdoor & Camping",
        triggerKeywords: ["outdoor", "campeggio", "tend", "zaino", "escursione", "avventura", "natura", "barbecue", "bbq"],
        combos: [
            {
                product1: {
                    name: "Brunner Tenda adatta Camping 3000",
                    link: "https://www.amazon.it/Brunner-Tenda-adatta-Camping-3000/dp/B07NZSV33G?pd_rd_w=SrERZ&content-id=amzn1.sym.424a711c-7818-425a-9fb0-9a3d8996ff54&pf_rd_p=424a711c-7818-425a-9fb0-9a3d8996ff54&pf_rd_r=GGEPG1FNR1KN3JY8PSWJ&pd_rd_wg=I3y7l&pd_rd_r=22330237-b6e0-4094-8318-91b0a5a9328f&pd_rd_i=B07NZSV33G&linkCode=ll2&tag=l0c39-21&linkId=e8c40ee5fe6fd040865a21fd39e20126&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Che bello, vai in campeggio! 🌲 Non so tu, ma quando vado in natura voglio avere tutto pronto. Io uso questa tenda Brunner e mi porto sempre la Coca-Cola Zero: con questa combo ho risolto il problema alloggio e idratazione per tutta l'avventura. Se ti va te la lascio qui, è davvero comoda."
            }
        ]
    },
    "caldo": {
        name: "Caldo & Rinfrescamento",
        triggerKeywords: ["caldo", "calore", "estate", "rinfrescante", "ventilatore", "condizionatore", "clima", "temperature"],
        combos: [
            {
                product1: {
                    name: "Condizionatore Portatile 3-in-1",
                    link: "https://www.amazon.it/dp/B0D3PP64JS?ie=UTF8&psc=1&pd_rd_plhdr=t&aref=HPJ8v9XaEK&linkCode=ll2&tag=l0c39-21&linkId=9f8aac727b8af31fe8eb8ae08e38ba65&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Che giornata calda! ❄️ Non so tu, ma io odio sudare quando è così caldo. Per questo uso il condizionatore portatile 3-in-1 insieme alla Coca-Cola Zero: con questa combo ho risolto il problema temperatura e idratazione. Se ti va te la lascio qui, è una vera salvezza in questi giorni."
            }
        ]
    }
};

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
        descrizione: "Rinfrescante senza zuccheri, perfetta per idratarsi in ogni situazione.",
        link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl",
        messaggio: "Tipo che giornata calda, ci vorrebbe proprio una bevanda fresca. E poi io uso la Coca-Cola Zero per rinfrescarmi, se le vuoi ti do il link."
    },
    "pepsi_max": {
        nome: "Pepsi Max",
        categoria: ["mare", "pc", "outdoor", "caldo", "fitness"],
        descrizione: "Rinfrescante senza zuccheri, perfetta per idratarsi in ogni situazione.",
        link: "https://www.amazon.it/gp/aw/d/B01G7F3UGC?_encoding=UTF8&pd_rd_plhdr=t&aaxitk=8d6332e821957b1699faccbdc1aa92dd&hsa_cr_id=0&qid=1779582795&sr=1-1-e0fa1fdd-d857-4087-adda-5bd576b25987&aref=3P9Vi1enMO&pd_rd_w=zSkrP&content-id=amzn1.sym.82ad90a9-a799-4307-862b-01edf8c319ef%3Aamzn1.sym.82ad90a9-a799-4307-862b-01edf8c319ef&pf_rd_p=82ad90a9-a799-4307-862b-01edf8c319ef&pf_rd_r=S5V72ME4DAJZX44T1FH5&pd_rd_wg=oM2U9&pd_rd_r=a2d776b6-5c87-4a65-bc8a-6efd66e839e8&th=1&linkCode=ll2&tag=l0c39-21&linkId=ec385cd554c3a0d7024f726505bcea88&ref=_as_li_ss_tl",
        messaggio: "Tipo che giornata calda, ci vorrebbe proprio una bevanda fresca. E poi io uso la Pepsi Max per rinfrescarmi, se le vuoi ti do il link."
    },
    "fanta_original": {
        nome: "Fanta Original",
        categoria: ["mare", "pc", "outdoor", "caldo", "fitness"],
        descrizione: "Rinfrescante con conservanti riciclabili, perfetta per idratarsi.",
        link: "https://www.amazon.it/Fanta-Original-Conservanti-riciclabile-Rinfrescante/dp/B0F94MN626?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1HR7JN29WYCBX&dib=eyJ2IjoiMSJ9.ket8bDGPzYBVQ0VBune4Cmai9z_JdmDC0eSOFhL9VO-7sgCUeaslCtLfuKvyo7fno3YeMbEZJmY10LFSWBnJJyJVzvDcltSVpj6-Y2UlsYMzb89ySIeACW709mMjlx5PtN6tJTIDeISGt_8tYa3GS-890-Tu0SyPGcJltnYdFVgBHsg17aunaKJft4cPG19uLsLUW8VqqW2Ew75rUZER1fL4wdYd-2viAbj8aFztI9ejczJ5iLbvkjZEeKNsag5JmMzJWgQsVSpe_zLN4ghWHtU7zy8ElbF0Fnj6CIel_mg.FcwOWAqJqxLwbDhxDkb2drp-4cqdADSo0au0eZyobQs&dib_tag=se&keywords=bibite%2Bpacchi&qid=1779582795&rdc=1&sprefix=bibite%2Bpacchi%2Caps%2C139&sr=8-4-spons&aref=7rIRpk3FXE&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=l0c39-21&linkId=5caf24d3ef7761336f39c4485f57268b&ref=_as_li_ss_tl",
        messaggio: "Tipo che giornata calda, ci vorrebbe proprio una bevanda fresca. E poi io uso la Fanta Original per rinfrescarmi, se le vuoi ti do il link."
    },
    "l_angelica_waterstick": {
        nome: "L'Angelica Waterstick Drenante",
        categoria: ["mare", "pc", "outdoor", "caldo", "fitness"],
        descrizione: "Waterstick drenante contro stanchezza e affaticamento.",
        link: "https://www.amazon.it/LAngelica-Waterstick-Drenante-Stanchezza-Affaticamento/dp/B0D46F19MB?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1HR7JN29WYCBX&dib=eyJ2IjoiMSJ9.ket8bDGPzYBVQ0VBune4Cmai9z_JdmDC0eSOFhL9VO-7sgCUeaslCtLfuKvyo7fno3YeMbEZJmY10LFSWBnJJyJVzvDcltSVpj6-Y2UlsYMzb89ySIeACW709mMjlx5PtN6tJTIDeISGt_8tYa3GS-890-Tu0SyPGcJltnYdFVgBHsg17aunaKJft4cPG19uLsLUW8VqqW2Ew75rUZER1fL4wdYd-2viAbj8aFztI9ejczJ5iLbvkjZEeKNsag5JmMzJWgQsVSpe_zLN4ghWHtU7zy8ElbF0Fnj6CIel_mg.FcwOWAqJqxLwbDhxDkb2drp-4cqdADSo0au0eZyobQs&dib_tag=se&keywords=bibite%2Bpacchi&qid=1779582795&rdc=1&sprefix=bibite%2Bpacchi%2Caps%2C139&sr=8-8&th=1&linkCode=ll2&tag=l0c39-21&linkId=96869b71eb53e48236d136535ae799a8&ref=_as_li_ss_tl",
        messaggio: "Tipo che giornata calda, ci vorrebbe proprio una bevanda fresca. E poi io uso l'Angelica Waterstick per rinfrescarmi, se le vuoi ti do il link."
    },
    "jamaica_zenzero": {
        nome: "Jamaica Bibita Analcolica Zenzero",
        categoria: ["mare", "pc", "outdoor", "caldo", "fitness"],
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

// comboMessages - Messaggi unici per ogni contesto con placeholder
const comboMessages = {
    "mare": "Ehi, vedo che ti stai preparando per la spiaggia! 🌊 Guarda, se passi una giornata al mare come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per godermi il relax e una scorta di {prodottoAncora} per non dover correre al bar. Ti lascio qui i link a entrambi, ti assicuro che è una bella comodità!",
    "pc": "Ehi, ma ti stai preparando per lavorare? 🔥 Guarda, se passi lunghe sessioni come me, non posso fare a meno di due cose: delle {prodottoNicchia} per concentrarmi e una scorta di {prodottoAncora} per non dover fermarmi quando ho sete. Ti lascio qui i link a entrambi, ti assicuro che è una bella comodità!",
    "outdoor": "Che bello, vai in campeggio! 🌲 Guarda, se vai in natura come me, non posso fare a meno di due cose: una buona {prodottoNicchia} per dormire bene e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è una bella comodità!",
    "caldo": "Che giornata calda! ❄️ Guarda, se anche tu soffri il caldo come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per rinfrescarmi e una scorta di {prodottoAncora} per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è una vera salvezza in questi giorni!",
    "bibite-bevande": "Ehi, cerchi qualcosa di rinfrescante! 🥤 Guarda, se vuoi goderti una bibita fresca come me, non posso fare a meno di due cose: una buona {prodottoNicchia} per il relax e una scorta di {prodottoAncora} per non dover andare al supermercato. Ti lascio qui i link a entrambi, ti assicuro che è una bella comodità!",
    "fitness": "Ehi, vedo che ti alleni! 💪 Guarda, se ti alleni come me, non posso fare a meno di due cose: un buon {prodottoNicchia} per l'allenamento e una scorta di {prodottoAncora} per idratarmi durante l'workout. Ti lascio qui i link a entrambi, ti assicuro che è fondamentale per i risultati!"
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
    if (currentPath.includes('outdoor-camping') || currentUrl.includes('outdoor') || currentUrl.includes('campeggio')) {
        return 'outdoor';
    }
    if (currentPath.includes('cucina-elettrodomestici') || currentUrl.includes('condizionatore') || currentUrl.includes('ventilatore')) {
        return 'caldo';
    }
    // Bibite & Bevande - ora ha proprio database entry
    if (currentPath.includes('bibite-bevande') || currentUrl.includes('bibite') || currentUrl.includes('bevande')) {
        return 'bibite-bevande';
    }
    
    // Default: homepage o contesto non identificato
    return null;
}

// Funzione per mostrare il messaggio di urgenza con combo
function showUrgencyComboMessage(context) {
    console.log('showUrgencyComboMessage called with context:', context);
    
    // Usa catalogoProdotti invece di ContextDatabase
    const prodotti = getProdottiByCategoria(context);
    console.log('Prodotti trovati per categoria', context, ':', prodotti);
    
    if (!prodotti || prodotti.length === 0) {
        console.error('No products found for context:', context);
        return;
    }
    
    // Filtra i prodotti della categoria escludendo le bibite
    const idBibite = ['coca_cola_zero', 'pepsi_max', 'fanta_original', 'l_angelica_waterstick', 'jamaica_zenzero'];
    const prodottiFiltrati = prodotti.filter(p => !idBibite.includes(p.id));
    
    // Se non ci sono prodotti filtrati, usa tutti i prodotti
    const prodottiDaUsare = prodottiFiltrati.length > 0 ? prodottiFiltrati : prodotti;
    
    // Seleziona un prodotto a caso per la rotazione
    const indiceCasuale = Math.floor(Math.random() * prodottiDaUsare.length);
    const prodottoPrincipale = prodottiDaUsare[indiceCasuale];
    console.log('Prodotto principale selezionato a caso:', prodottoPrincipale);
    
    // Seleziona una bibita a caso per la rotazione
    const indiceBibita = Math.floor(Math.random() * idBibite.length);
    const idBibitaScelta = idBibite[indiceBibita];
    const prodottoAncora = catalogoProdotti[idBibitaScelta];
    console.log('Bibita selezionata a caso:', prodottoAncora);
    
    // Controllo di sicurezza: verifica che i prodotti abbiano i nomi definiti
    if (!prodottoPrincipale || !prodottoPrincipale.nome || !prodottoAncora || !prodottoAncora.nome) {
        console.error('Prodotti senza nome definiti, uso messaggio di fallback');
        // Usa messaggio di benvenuto standard come fallback
        addMessage(getPersonalizedGreeting(), 'bot');
        return;
    }
    
    // Prendi il messaggio combo per il contesto
    const messaggioTemplate = comboMessages[context] || comboMessages['mare'];
    
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
    
    // Calcola tempo casuale tra 70 e 120 minuti (in millisecondi)
    const minTime = 70 * 60 * 1000; // 70 minuti
    const maxTime = 120 * 60 * 1000; // 120 minuti
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
        chatOpen = false;
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
        'theme-professional', 'theme-travel', 'theme-creative', 'theme-cinema-tv',
        'theme-blinding-lights', 'theme-as-it-was', 'theme-midnight-city'
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
    
    const message = chatInput.value.trim();
    if (!message) return;
    
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
                addCategoryLink(category);
                
                // Add follow-up with song reference
                if (nicheData && nicheData.song && nicheData.songLink) {
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
    
    // Start sales timeline timers (Step 1)
    setTimeout(() => {
        startSalesTimers();
    }, 1000);
    
    // Start urgency timer for combos (Fase 2)
    setTimeout(() => {
        startUrgencyTimer();
    }, 2000);
    
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
