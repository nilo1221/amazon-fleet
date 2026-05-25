// Combo Database - Database modulare per le combo del bot
// Questo file contiene tutte le combo organizzate per categoria

const ComboDatabase = {
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
            },
            {
                product1: {
                    name: "Telo Mare Microfibra Sand Proof",
                    link: "https://www.amazon.it/Telo-Mare-Microfibra-Sand-Proof/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=abc123&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ti piace la spiaggia? 🏖️ Guarda, con questo telo microfibra e Coca-Cola Zero hai tutto per il relax. Ecco i link!"
            },
            {
                product1: {
                    name: "Maschera Snorkeling Professionale",
                    link: "https://www.amazon.it/Maschera-Snorkeling-Professionale/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=def456&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi esplorare il mare? 🤿 Guarda, con questa maschera snorkeling e Coca-Cola Zero hai tutto per le avventure. Ecco i link!"
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
            },
            {
                product1: {
                    name: "Mouse Gaming Wireless RGB",
                    link: "https://www.amazon.it/Mouse-Gaming-Wireless-RGB/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=abc123&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Sei un gamer? 🎮 Guarda, con questo mouse wireless e Coca-Cola Zero hai tutto per le sessioni. Ecco i link!"
            },
            {
                product1: {
                    name: "Tastiera Meccanica RGB",
                    link: "https://www.amazon.it/Tastiera-Meccanica-RGB/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=def456&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi scrivere velocemente? ⌨️ Guarda, con questa tastiera meccanica e Coca-Cola Zero hai tutto per lavorare. Ecco i link!"
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
            },
            {
                product1: {
                    name: "Zaino da Trekking 50L",
                    link: "https://www.amazon.it/Zaino-Trekking-50L/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=abc123&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi fare escursioni? 🥾 Guarda, con questo zaino e Coca-Cola Zero hai tutto per le avventure. Ecco i link!"
            },
            {
                product1: {
                    name: "Barbecue Portatile Gas",
                    link: "https://www.amazon.it/Barbecue-Portatile-Gas/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=def456&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi grigliare all'aperto? 🍖 Guarda, con questo barbecue e Coca-Cola Zero hai tutto per le grigliate. Ecco i link!"
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
            },
            {
                product1: {
                    name: "Ventilatore a Torre Silenzioso",
                    link: "https://www.amazon.it/Ventilatore-Torre-Silenzioso/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=abc123&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Fa caldo? 🌡️ Guarda, con questo ventilatore a torre e Coca-Cola Zero hai tutto per rinfrescarti. Ecco i link!"
            },
            {
                product1: {
                    name: "Ventilatore da Tavolo USB",
                    link: "https://www.amazon.it/Ventilatore-Tavolo-USB/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=def456&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi fresco sul tavolo? 💨 Guarda, con questo ventilatore USB e Coca-Cola Zero hai tutto per lavorare. Ecco i link!"
            }
        ]
    },
    "parrucchiere-barbiere": {
        name: "Parrucchiere & Barbiere",
        triggerKeywords: ["parrucchiere", "barbiere", "forbici", "rasoio", "taglio", "capelli", "barba", "salone", "professionale"],
        combos: [
            {
                product1: {
                    name: "SCHWERTKRONE Rasoio a Mano Libera con Manico Prezioso",
                    link: "https://www.amazon.it/SCHWERTKRONE-Rasoio-Libera-Manico-Prezioso/dp/B09C5X7R3Z?&linkCode=ll2&tag=l0c39-21&linkId=6d9d9d9d9d9d9d9d9d9d9d9d9d9d9d9d&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ehi, vuoi attrezzature professionali! 💇 Guarda, se hai un salone come me, non posso fare a meno di due cose: un buon rasoio SCHWERTKRONE per il taglio perfetto e una scorta di Coca-Cola Zero per idratarmi. Ti lascio qui i link a entrambi, ti assicuro che è fondamentale!"
            },
            {
                product1: {
                    name: "Forbici Professionali Parrucchiere 6 Pollici",
                    link: "https://www.amazon.it/Forbici-Professionali-Parrucchieri-Acciaio-Inossidabile/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=abc123&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Sei un parrucchiere? ✂️ Guarda, per il tuo salone servono forbici professionali e una bevanda rinfrescante. Ecco i link, è essenziale!"
            },
            {
                product1: {
                    name: "Tagliacapelli Professionale Regolabarba",
                    link: "https://www.amazon.it/Tagliacapelli-Professionale-Regolabarba-Batteria/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=def456&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi strumenti professionali? 💈 Guarda, io uso questo tagliacapelli e Coca-Cola Zero. Ti lascio i link!"
            }
        ]
    },
    "manga-anime": {
        name: "Manga & Anime",
        triggerKeywords: ["manga", "anime", "giapponese", "fumetto", "otaku", "japan", "comic", "naruto", "one piece", "dragon ball"],
        combos: [
            {
                product1: {
                    name: "One Piece - Volume 1-100 Complete Collection",
                    link: "https://www.amazon.it/One-Piece-Volume-1-100-Collection/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=abc123def456&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Sei un otaku? 🎌 Guarda, per la collezione perfetta servono due cose: il cofanetto One Piece e una Coca-Cola Zero per le maratone di lettura. Ecco i link, è imperdibile!"
            },
            {
                product1: {
                    name: "Dragon Ball Super - Complete Series Box Set",
                    link: "https://www.amazon.it/Dragon-Ball-Super-Complete-Box/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=def456&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ti piace Dragon Ball? 🐉 Guarda, per la collezione completa servono il box set e una bevanda rinfrescante. Ecco i link, è imperdibile!"
            },
            {
                product1: {
                    name: "Naruto Shippuden - Complete Box Set",
                    link: "https://www.amazon.it/Naruto-Shippuden-Complete-Box-Set/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=ghi789&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi leggere Naruto? 🍥 Guarda, con il box set completo e Coca-Cola Zero hai tutto per le maratone. Ecco i link!"
            }
        ]
    },
    "bibite-bevande": {
        name: "Bibite & Bevande",
        triggerKeywords: ["bibita", "bevanda", "coca", "cola", "pepsi", "fanta", "sprite", "acqua", "gassata", "analcolica"],
        combos: [
            {
                product1: {
                    name: "Powerade Orange Sport Drink – 12 Bottiglie da 500 ml",
                    link: "https://www.amazon.it/dp/B00Y8D9P6K?&linkCode=ll2&tag=l0c39-21&linkId=e8af102093795fae01900556a8432f07&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "ALPRO SENZA ZUCCHERI, Bevanda alla MANDORLA",
                    link: "https://www.amazon.it/ZUCCHERI-MANDORLA-vegetale-vitamine-confezioni/dp/B0DTYZX9NJ?&linkCode=ll2&tag=l0c39-21&linkId=06cd1283271cb70c174cc9964578baa7&ref=_as_li_ss_tl"
                },
                message: "Vuoi rinfrescarti? 🥤 Guarda, per la scorta perfetta servono Powerade per l'energia e Alpro senza zuccheri per la leggerezza. Ecco i link, è la combo ideale!"
            },
            {
                product1: {
                    name: "Pepsi Max - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Fanta Orange - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi una scorta di bibite? 🍊 Guarda, con Pepsi Max e Fanta Orange hai tutto per rinfrescarti. Ecco i link!"
            },
            {
                product1: {
                    name: "Sprite Zero - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi bibite senza zucchero? 🥤 Guarda, con Sprite Zero e Coca-Cola Zero hai tutto per rinfrescarti senza calorie. Ecco i link!"
            }
        ]
    },
    "fitness": {
        name: "Fitness & Sport",
        triggerKeywords: ["fitness", "sport", "palestra", "allenamento", "esercizio", "corsa", "gym", "workout", "muscoli"],
        combos: [
            {
                product1: {
                    name: "Manubri Regolabili 20kg",
                    link: "https://www.amazon.it/Manubri-Regolabili-Palestra-Esercizio-Casa/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=jkl012&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ehi, ti alleni! 💪 Guarda, per l'allenamento perfetto servono manubri regolabili e una bevanda rinfrescante. Ecco i link, è fondamentale!"
            },
            {
                product1: {
                    name: "Tappetino Yoga Antiscivolo",
                    link: "https://www.amazon.it/Tappetino-Yoga-Antiscivolo-Spessore-10mm/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=mno345&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Powerade Orange Sport Drink – 12 Bottiglie da 500 ml",
                    link: "https://www.amazon.it/dp/B00Y8D9P6K?&linkCode=ll2&tag=l0c39-21&linkId=e8af102093795fae01900556a8432f07&ref=_as_li_ss_tl"
                },
                message: "Fai yoga? 🧘 Guarda, per la pratica perfetta servono un tappetino antiscivolo e Powerade per idratarti. Ecco i link, è essenziale!"
            }
        ]
    },
    "smart-home": {
        name: "Smart Home & Domotica",
        triggerKeywords: ["smart", "home", "domotica", "casa", "intelligente", "automazione", "alexa", "google", "wifi"],
        combos: [
            {
                product1: {
                    name: "Amazon Echo Dot 5th Generation",
                    link: "https://www.amazon.it/Amazon-Echo-5th-Generation/dp/B09B8V1Z3P?&linkCode=ll2&tag=l0c39-21&linkId=pqr678&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ehi, rendi la tua casa intelligente! 🏠 Guarda, con Echo Dot e Coca-Cola Zero hai controllo smart e relax. Ecco i link, è fantastico!"
            },
            {
                product1: {
                    name: "Smart Light Bulb WiFi RGB",
                    link: "https://www.amazon.it/Smart-Light-Bulb-WiFi-RGB/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=stu901&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi illuminazione smart? 💡 Guarda, con le luci WiFi e Coca-Cola Zero hai atmosfera perfetta. Ecco i link, è fantastico!"
            }
        ]
    },
    "pet-care": {
        name: "Pet Care & Animali",
        triggerKeywords: ["pet", "cane", "gatto", "animale", "zampa", "crocchette", "cuccia", "giocattolo"],
        combos: [
            {
                product1: {
                    name: "Lettiera Autopulente per Gatti",
                    link: "https://www.amazon.it/Lettiera-Autopulente-Gatto-Senza-Sacchetto/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=vwx234&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ehi, ti prendi cura del tuo pet! 🐾 Guarda, con la lettiera autopulente e Coca-Cola Zero hai tutto sotto controllo. Ecco i link, è fondamentale!"
            },
            {
                product1: {
                    name: "Cuccia Ortopedica per Cane",
                    link: "https://www.amazon.it/Cuccia-Ortopedica-Cane-Memory-Foam/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=yza567&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Hai un cane? 🐕 Guarda, con la cuccia ortopedica e Coca-Cola Zero il tuo pet è felice e tu rilassato. Ecco i link, è fondamentale!"
            }
        ]
    },
    "cinema": {
        name: "Cinema & TV",
        triggerKeywords: ["cinema", "tv", "film", "serie", "netflix", "disney", "prime", "proiettore", "soundbar"],
        combos: [
            {
                product1: {
                    name: "Proiettore 4K Home Cinema",
                    link: "https://www.amazon.it/Proiettore-4K-Home-Cinema/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=bcd890&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ehi, vuoi goderti un film a casa! 🎬 Guarda, con il proiettore 4K e Coca-Cola Zero hai l'esperienza cinema perfetta. Ecco i link, è fantastico!"
            },
            {
                product1: {
                    name: "Soundbar Wireless Dolby Atmos",
                    link: "https://www.amazon.it/Soundbar-Wireless-Dolby-Atmos/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=efg123&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ami i film? 🎥 Guarda, con la soundbar Dolby Atmos e Coca-Cola Zero hai audio perfetto e relax. Ecco i link, è fantastico!"
            }
        ]
    },
    "musica-vinili": {
        name: "Musica & Vinili",
        triggerKeywords: ["musica", "vinile", "vinili", "album", "box", "set", "collezione", "cd", "record"],
        combos: [
            {
                product1: {
                    name: "Oasis - Complete Studio Album Collection (Gold Vinyl Box Set)",
                    link: "https://www.amazon.it/Complete-Studio-Collection-Amazon-Exclusive/dp/B0F99ZJ52F?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1K93EB4BTG8WC&dib=eyJ2IjoiMSJ9.C9GVKYRm83lJx9uzztSc3ygtd1JzfEuDNhxkR3_u1vuD-t3kdzfqHOj3ZokReYGfRfOEIO6dv0bSfYt_DPYk-dBk2ikg_tziCHOWDX-hgRFFp7OkGPIYmyzSDaeISgd1UFThXQNZuR3YB1t5VXjW5gxOQn6yL9_5FoKgnGsJILUguAVDWDpKUcSuzzfrVB6CPZGc9cXY9H2d6nYE09rvJFaS4UxOWtoniZN3l4t8mwy-wVYI0lYex3qLLbzyqr-D9vjLjx79uEgcSRydaMWZBxpgEscqj703IPmMtUen6GU.X5ujq0h5Kax9Af7hBNutpxroTLJMJ0R0eqHYbr_nVwc&dib_tag=se&keywords=set+vinili&qid=1779683180&sprefix=set+vinili%2Caps%2C131&sr=8-4&ufe=app_do%3Aamzn1.fos.fca66a76-6518-40f2-959f-2dca30e9c5d1&linkCode=ll2&tag=l0c39-21&linkId=14945c94044fd23f187315fd3cd6ad00&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ehi, ami la musica analogica! 🎵 Guarda, con il box set Oasis e Coca-Cola Zero hai collezione da urlo e relax. Ecco i link, è un'esperienza unica!"
            },
            {
                product1: {
                    name: "Metallica - The Black Album (30Th Anniversary Ltd)",
                    link: "https://www.amazon.it/Black-Album-30Th-Anniversary-Libro/dp/B097NP5HXH?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1K93EB4BTG8WC&dib=eyJ2IjoiMSJ9.C9GVKYRm83lJx9uzztSc3ygtd1JzfEuDNhxkR3_u1vuD-t3kdzfqHOj3ZokReYGfRfOEIO6dv0bSfYt_DPYk-dBk2ikg_tziCHOWDX-hgRFFp7OkGPIYmyzSDaeISgd1UFThXQNZuR3YB1t5VXjW5gxOQn6yL9_5FoKgnGsJILUguAVDWDpKUcSuzzfrVB6CPZGc9cXY9H2d6nYE09rvJFaS4UxOWtoniZN3l4t8mwy-wVYI0lYex3qLLbzyqr-D9vjLjx79uEgcSRydaMWZBxpgEscqj703IPmMtUen6GU.X5ujq0h5Kax9Af7hBNutpxroTLJMJ0R0eqHYbr_nVwc&dib_tag=se&keywords=set+vinili&qid=1779683227&sprefix=set+vinili%2Caps%2C131&sr=8-9&ufe=app_do%3Aamzn1.fos.fca66a76-6518-40f2-959f-2dca30e9c5d1&linkCode=ll2&tag=l0c39-21&linkId=a091a665e57f1afbdd3aa256f99c69a3&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ami i Metallica? 🎸 Guarda, con l'edizione 30° anniversario e Coca-Cola Zero hai metallo puro e relax. Ecco i link, è pura magia!"
            }
        ]
    },
    "giochi-da-tavolo": {
        name: "Giochi da Tavolo",
        triggerKeywords: ["gioco", "tavolo", "board", "game", "dnd", "dungeons", "dragons", "dadi", "monopoly", "risk"],
        combos: [
            {
                product1: {
                    name: "2024 Player's Handbook (Dungeons & Dragons Core Rulebook)",
                    link: "https://www.amazon.it/Players-Handbook-Dungeons-Rulebook-Versione/dp/0786969512?&linkCode=ll2&tag=l0c39-21&linkId=a8d3cd623c05cc0d58f98cff434b4032&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Giocate a D&D? 🎲 Guarda, con il Player's Handbook 2024 e Coca-Cola Zero avete tutto per sessioni epiche. Ecco i link, è imperdibile!"
            },
            {
                product1: {
                    name: "Bescon Polyhedral Dice Metallic Playing",
                    link: "https://www.amazon.it/Bescon-Polyhedral-Dice-Metallic-Playing/dp/B07333T4B5?&linkCode=ll2&tag=l0c39-21&linkId=9d6106bf3ba96bcdb187d8cb3532aeff&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Volete dadi premium? 💎 Guarda, con i dadi metallici Bescon e Coca-Cola Zero avete stile e relax. Ecco i link, è imperdibile!"
            }
        ]
    },
    "cucina": {
        name: "Cucina & Elettrodomestici",
        triggerKeywords: ["cucina", "elettrodomestico", "forno", "frigo", "lavatrice", "pentola", "padella", "cucinare"],
        combos: [
            {
                product1: {
                    name: "Set di Pentole Antiaderenti 10 Pezzi",
                    link: "https://www.amazon.it/Set-Pentole-Antiaderenti-Pezzi-Induzione/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=ghi456&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Cucini spesso? 🍳 Guarda, con il set di pentole e Coca-Cola Zero hai tutto per cucinare e rilassarti. Ecco i link, è fantastico!"
            },
            {
                product1: {
                    name: "Robot da Cucina Multifunzione",
                    link: "https://www.amazon.it/Robot-Cucina-Multifunzione-1000W/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=jkl789&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi facilità in cucina? 🥣 Guarda, con il robot multifunzione e Coca-Cola Zero hai preparazione rapida e relax. Ecco i link, è fantastico!"
            }
        ]
    },
    "moda": {
        name: "Moda & Abbigliamento",
        triggerKeywords: ["moda", "abbigliamento", "vestiti", "scarpe", "borsa", "accessori", "style", "fashion"],
        combos: [
            {
                product1: {
                    name: "Sneakers Sportive Uomo",
                    link: "https://www.amazon.it/Sneakers-Sportive-Uomo-Running/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=mno012&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi stile sportivo? 👟 Guarda, con le sneakers e Coca-Cola Zero hai look perfetto e relax. Ecco i link, è fantastico!"
            },
            {
                product1: {
                    name: "Borsa in Pelle Donna",
                    link: "https://www.amazon.it/Borsa-Pelle-Donna-Luxury/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=pqr345&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Cerchi eleganza? 👜 Guarda, con la borsa in pelle e Coca-Cola Zero hai stile e relax. Ecco i link, è fantastico!"
            }
        ]
    },
    "libri": {
        name: "Libri & Lettura",
        triggerKeywords: ["libro", "lettura", "romanzo", "saggio", "kindle", "ereader", "book", "narrativa"],
        combos: [
            {
                product1: {
                    name: "Kindle Paperwhite 11th Generation",
                    link: "https://www.amazon.it/Kindle-Paperwhite-11th-Generation/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=stu678&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ami leggere? 📚 Guarda, con Kindle Paperwhite e Coca-Cola Zero hai lettura perfetta e relax. Ecco i link, è fantastico!"
            },
            {
                product1: {
                    name: "Bestseller Italiano - Romanzo",
                    link: "https://www.amazon.it/Bestseller-Italiano-Romanzo/dp/B08X7R3Z6P?&linkCode=ll2&tag=l0c39-21&linkId=vwx901&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi un buon libro? 📖 Guarda, con il bestseller e Coca-Cola Zero hai storia emozionante e relax. Ecco i link, è fantastico!"
            }
        ]
    }
};

// Funzione per ottenere una combo random da una categoria
function getRandomCombo(category) {
    const categoryData = ComboDatabase[category];
    if (!categoryData || !categoryData.combos || categoryData.combos.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * categoryData.combos.length);
    return categoryData.combos[randomIndex];
}

// Funzione per ottenere tutte le combo di una categoria
function getAllCombos(category) {
    const categoryData = ComboDatabase[category];
    if (!categoryData || !categoryData.combos) {
        return [];
    }
    return categoryData.combos;
}

// Funzione per ottenere tutte le categorie disponibili
function getAllComboCategories() {
    return Object.keys(ComboDatabase);
}

// Funzione per ottenere informazioni su una categoria
function getCategoryInfo(category) {
    const categoryData = ComboDatabase[category];
    if (!categoryData) {
        return null;
    }
    return {
        name: categoryData.name,
        triggerKeywords: categoryData.triggerKeywords,
        comboCount: categoryData.combos ? categoryData.combos.length : 0
    };
}
