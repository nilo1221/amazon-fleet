// Combo Database - Database modulare per le combo del bot
// Questo file contiene tutte le combo organizzate per categoria

const ComboDatabase = {
    "bibite-bevande": {
        name: "Pausa Ristoro 🥤",
        triggerKeywords: ["fame", "sete", "snack", "bere", "pausa", "bibita", "bevanda", "coca", "cola", "pepsi", "fanta", "sprite", "acqua", "gassata", "analcolica", "ristoro", "break"],
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
                message: "Ti stai godendo la navigazione? 😊 Ecco i prodotti preferiti dagli altri utenti per una pausa veloce mentre esplori le altre categorie. Powerade per l'energia e Alpro senza zuccheri per la leggerezza: la combo ideale per la tua sessione!"
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
                message: "La sessione si fa intensa? 🔥 Recupera le energie con i nostri must-have per la pausa! Pepsi Max e Fanta Orange: tutto per rinfrescarti senza interrompere la navigazione."
            },
            {
                product1: {
                    name: "KollyKolla Borraccia 500ml con Filtro e Indicatore del Tempo",
                    link: "https://www.amazon.it/dp/B0FBWT2V5D?m=a11il2pnwyju7h&ascsubtag=srctok-1ce1c3d05b4ffb5c&btn_ref=srctok-1ce1c3d05b4ffb5c&th=1&linkCode=ll2&tag=l0c39-21&linkId=0fe74787eea3960191433b519e53ad44&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Powerade Orange Sport Drink – 12 Bottiglie da 500 ml",
                    link: "https://www.amazon.it/dp/B00Y8D9P6K?&linkCode=ll2&tag=l0c39-21&linkId=e8af102093795fae01900556a8432f07&ref=_as_li_ss_tl"
                },
                message: "Vuoi idratarti in modo intelligente? 💧 Con la borraccia KollyKolla riutilizzabile e Powerade per l'energia, hai tutto per continuare la tua sessione. Ecco i link per la tua pausa perfetta!"
            }
        ]
    },
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
                    name: "Fit-Flip Telo Mare microfibra marino bianco",
                    link: "https://www.amazon.it/Fit-Flip-Telo-Mare-microfibra-marino-bianco/dp/B09KNMTKPS?th=1&linkCode=ll2&tag=l0c39-21&linkId=b2c56b41c9500ff261d9cde21e931b3f&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ti piace la spiaggia? 🏖️ Guarda, con questo telo microfibra e Coca-Cola Zero hai tutto per il relax. Ecco i link!"
            },
            {
                product1: {
                    name: "Cressi Scarpette Acquatici Bambini Transparente",
                    link: "https://www.amazon.it/Cressi-Scarpette-Acquatici-Bambini-Transparente/dp/B000O6AJNI?th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=c9803e478a795e32eb84c529bfd188c2&ref=_as_li_ss_tl"
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
                    name: "Razer DeathAdder Essential",
                    link: "https://www.amazon.it/Razer-DeathAdder-Essential-essenziale-sensore/dp/B092R5MCB3?mcid=b339f1fa54c632069402bc15331fe6e4&hvadid=700790378073&hvpos=&hvnetw=g&hvrand=17152808515394588193&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9190900&hvtargid=pla-1363770907123&hvocijid=17152808515394588193-B092R5MCB3-&hvexpln=0&th=1&linkCode=ll2&tag=l0c39-21&linkId=1b32d94d6fc3b1cc750a1b8b4d8f4ca1&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Sei un gamer? 🎮 Guarda, con questo mouse wireless e Coca-Cola Zero hai tutto per le sessioni. Ecco i link!"
            },
            {
                product1: {
                    name: "Razer BlackWidow Green Switch",
                    link: "https://www.amazon.it/Razer-BlackWidow-Green-Switch-interruttori/dp/B0C6MJGRSP?mcid=94713db3966d30d790c2523d57edca8f&hvadid=711050895070&hvpos=&hvnetw=g&hvrand=13769018999092458833&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9190900&hvtargid=pla-2270730354227&hvocijid=13769018999092458833-B0C6MJGRSP-&hvexpln=0&th=1&linkCode=ll2&tag=l0c39-21&linkId=dfe44a8eea673b7a91f20eafd80fdc60&ref=_as_li_ss_tl"
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
                    name: "TRIZAND spiaggia trasporto impermeabile",
                    link: "https://www.amazon.it/TRIZAND-spiaggia-trasporto-impermeabile-23492/dp/B0CTPTR99X?pd_rd_w=metuQ&content-id=amzn1.sym.3a84fb8b-d4d6-4483-8fd7-0000cb59ea5a&pf_rd_p=3a84fb8b-d4d6-4483-8fd7-0000cb59ea5a&pf_rd_r=GGEPG1FNR1KN3JY8PSWJ&pd_rd_wg=I3y7l&pd_rd_r=22330237-b6e0-4094-8318-91b0a5a9328f&pd_rd_i=B0CTPTR99X&linkCode=ll2&tag=l0c39-21&linkId=4940199de276b89a5b47db92baef10dd&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi fare escursioni? 🥾 Guarda, con questo zaino e Coca-Cola Zero hai tutto per le avventure. Ecco i link!"
            },
            {
                product1: {
                    name: "Thule Easyfold Xt Piattaforma Gancio Traino Portabici",
                    link: "https://www.amazon.it/dp/B01N1MNL1A?ascsubtag=srctok-5a6a88b301e9bd44&btn_ref=srctok-5a6a88b301e9bd44&th=1&linkCode=ll2&tag=l0c39-21&linkId=35f2475332cf43eef75e0370bd6f4a47&ref_=as_li_ss_tl"
                },
                product2: {
                    name: "Outsunny Tenda da Campeggio per 5 Persone",
                    link: "https://www.amazon.it/Outsunny-Campeggio-Famigliare-Impermeabile-Trasporto/dp/B0F29BC3LJ?dib=eyJ2IjoiMSJ9.ulozInvSluYgmjL7E4H17-nAjJHzYRjROTEnqlFpGL9rcTv1HvBYllPgdkIOoBc-SXEeDIUidIWqJE4AeJTHcZ5kpcfb-CbXWSuWBnlEGux0SYwJl5CN6KjwbGkcf5LYtfkWYLYhp-VRNrNS39zryi-GS8GUlm9wertELzYFRsAg71Q6fOgEh7TBpUI6u8QHOJUlu2meJDnywkKi1X5bXBNiXNAhAwJKJ9bqCG3l-8t4IkuYs_y0pQC-xviQ1KLrXxRPf2HuWEFd42TvQJZTycFqjyjdOxHq0ZCX6PoU80I.EZDBto_kC4Hujwih7D6p-5SlIOd0DLRboEy_uZX_9X0&dib_tag=se&keywords=tenda%2Btunnel%2Bcampeggio%2Bpremium&qid=1779588392&sr=8-7&ufe=app_do%3Aamzn1.fos.fca66a76-6518-40f2-959f-2dca30e9c5d1&th=1&linkCode=ll2&tag=l0c39-21&linkId=b50732e0036a8492066b30d1254d5733&ref=_as_li_ss_tl"
                },
                message: "Vuoi viaggiare con la bici? 🚴 Guarda, con il portabici Thule Easyfold Xt e la tenda Outsunny hai tutto per avventure indimenticabili. Ecco i link!"
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
                    name: "Ventilatore Silenzioso Ricaricabile Pieghevole Telecomando",
                    link: "https://www.amazon.it/Ventilatore-Silenzioso-Ricaricabile-Pieghevole-Telecomando/dp/B0DZ5ZB59N?th=1&linkCode=ll2&tag=l0c39-21&linkId=e5e746f4698bf8950b8c872ed5e18a5f&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Fa caldo? 🌡️ Guarda, con questo ventilatore a torre e Coca-Cola Zero hai tutto per rinfrescarti. Ecco i link!"
            },
            {
                product1: {
                    name: "Ventilator Silenzioso Ventilatori Ricaricabile Rotazione",
                    link: "https://www.amazon.it/Ventilator-Silenzioso-Ventilatori-Ricaricabile-Rotazione/dp/B0CP27G3V5?th=1&linkCode=ll2&tag=l0c39-21&linkId=d36fd176303a9&ref=_as_li_ss_tl"
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
        triggerKeywords: ["parrucchiere", "barbiere", "forbici", "rasoio", "taglio", "capelli", "barba", "salone", "professionale", "styling", "tagliacapelli"],
        combos: [
            {
                product1: {
                    name: "Tagliacapelli Professionale Regolabarba",
                    link: "https://www.amazon.it/dp/B074QPKFYQ?psc=1&aref=2EsuFIfF7d&sp_csd=d2lkZ2V0TmFtZT1zcF9ocXBfc2hhcmVk&linkCode=ll2&tag=l0c39-21&linkId=04d8b1b795bf1f526d3f2eddd0b7a866&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi mantenere il taglio fresco come dal barbiere? 💈 Ho selezionato il tagliacapelli professionale che ti fa risparmiare tempo e soldi a casa. Perfetto per il look preciso e veloce. Non sai quale macchinetta scegliere? Rispondi con 'Capelli' o 'Barba' e ti mostro il kit specifico per te!"
            }
        ]
    },
    "manga-anime": {
        name: "Manga & Anime",
        triggerKeywords: ["manga", "anime", "giapponese", "fumetto", "otaku", "japan", "comic", "naruto", "one piece", "dragon ball"],
        combos: [
            {
                product1: {
                    name: "One piece (Vol. 1)",
                    link: "https://www.amazon.it/One-piece-1-Eiichiro-Oda/dp/8864201793?&linkCode=ll2&tag=l0c39-21&linkId=e72c284460a4ab716a6c562758b2c330&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Sei un otaku? 🎌 Guarda, per la collezione perfetta servono due cose: il cofanetto One Piece e una Coca-Cola Zero per le maratone di lettura. Ecco i link, è imperdibile!"
            },
            {
                product1: {
                    name: "Dragon Ball 1 (Dragon Ball Evergreen Edition) eBook",
                    link: "https://www.amazon.it/Dragon-Ball-Evergreen-ebook/dp/B07M5HTBFL?&linkCode=ll2&tag=l0c39-21&linkId=b0f9292e84b16cf9298cb1026150d642&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ti piace Dragon Ball? 🐉 Guarda, per la collezione completa servono il box set e una bevanda rinfrescante. Ecco i link, è imperdibile!"
            },
            {
                product1: {
                    name: "Naruto 1 eBook",
                    link: "https://www.amazon.it/Naruto-1-Masashi-Kishimoto-ebook/dp/B0BWCVY8PS?&linkCode=ll2&tag=l0c39-21&linkId=469bd1c492b998b84a0a2ca7915d22dc&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi leggere Naruto? 🍥 Guarda, con il box set completo e Coca-Cola Zero hai tutto per le maratone. Ecco i link!"
            }
        ]
    },
    "fitness": {
        name: "Fitness & Sport",
        triggerKeywords: ["fitness", "sport", "palestra", "allenamento", "esercizio", "corsa", "gym", "workout", "muscoli"],
        combos: [
            {
                product1: {
                    name: "RE-manubri regolabili Chiusure collegamento",
                    link: "https://www.amazon.it/RE-manubri-regolabili-Chiusure-collegamento/dp/B09773F9BL?th=1&linkCode=ll2&tag=l0c39-21&linkId=a44d9f6049a02d0fe4b53915e085269f&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ehi, ti alleni! 💪 Guarda, per l'allenamento perfetto servono manubri regolabili e una bevanda rinfrescante. Ecco i link, è fondamentale!"
            },
            {
                product1: {
                    name: "Tappetino Spessore Antiscivolo KG Qualità",
                    link: "https://www.amazon.it/Tappetino-Spessore-Antiscivolo-KG-Qualit%C3%A0/dp/B01N67BRCF?th=1&linkCode=ll2&tag=l0c39-21&linkId=bb90c8bac4dbb7272f7d8192a73c4759&ref=_as_li_ss_tl"
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
                    name: "Amazon Basics intelligente singola confezione",
                    link: "https://www.amazon.it/Amazon-Basics-intelligente-singola-confezione/dp/B0CMXNWCVP?mcid=9e2aa91a1c8d3bcbaef8d22ed1555743&hvadid=705743448845&hvpos=&hvnetw=g&hvrand=3521815141531840554&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9190900&hvtargid=pla-2347766460617&hvocijid=3521815141531840554-B0CMXNWCVP-&hvexpln=0&th=1&linkCode=ll2&tag=l0c39-21&linkId=e9d8c1168729535c8e5f367cfbc39448&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ehi, rendi la tua casa intelligente! 🏠 Guarda, con Echo Dot e Coca-Cola Zero hai controllo smart e relax. Ecco i link, è fantastico!"
            },
            {
                product1: {
                    name: "TP-Link Intelligente Compatibile Controllo tramite",
                    link: "https://www.amazon.it/TP-Link-Intelligente-Compatibile-Controllo-tramite/dp/B07Z5JD3T4?pd_rd_w=e2dzD&content-id=amzn1.sym.1f3c1772-ccf5-4aa2-abc0-5bb5851fb447&pf_rd_p=1f3c1772-ccf5-4aa2-abc0-5bb5851fb447&pf_rd_r=F4ATCRT21RHMY22PYNGP&pd_rd_wg=zWCfO&pd_rd_r=6b4f6f0e-40f4-4bc2-ae48-0d834bc5e132&pd_rd_i=B07Z5JD3T4&th=1&linkCode=ll2&tag=l0c39-21&linkId=e4dd22dc612200b8b487d3965d6fb599&ref=_as_li_ss_tl"
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
                    name: "HaoAMZ Lettiera automatica dimensioni autopulente",
                    link: "https://www.amazon.it/HaoAMZ-Lettiera-automatica-dimensioni-autopulente/dp/B0CKYYTWY4?&linkCode=ll2&tag=l0c39-21&linkId=2fbb8edf22e292d8a30e649af6540b65&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ehi, ti prendi cura del tuo pet! 🐾 Guarda, con la lettiera autopulente e Coca-Cola Zero hai tutto sotto controllo. Ecco i link, è fondamentale!"
            },
            {
                product1: {
                    name: "Tiragraffi tiragraffi multilivello attività piattaforme",
                    link: "https://www.amazon.it/Tiragraffi-tiragraffi-multilivello-attivit%C3%A0-piattaforme/dp/B0BN9YL1KH?th=1&linkCode=ll2&tag=l0c39-21&linkId=e03fe2a5d31a3f3dcccfc3ecd1d7e9ec&ref=_as_li_ss_tl"
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
                    name: "Proiettore Videoproiettore TOPTRO Smartphone Correzione",
                    link: "https://www.amazon.it/Proiettore-Videoproiettore-TOPTRO-Smartphone-Correzione/dp/B0CKRPTF4L?&linkCode=ll2&tag=l0c39-21&linkId=f77e39ffd9666af65f40632c408f8e8f&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ehi, vuoi goderti un film a casa! 🎬 Guarda, con il proiettore 4K e Coca-Cola Zero hai l'esperienza cinema perfetta. Ecco i link, è fantastico!"
            },
            {
                product1: {
                    name: "proiettore portatile regolabile Projector ricaricabile",
                    link: "https://www.amazon.it/proiettore-portatile-regolabile-Projector-ricaricabile/dp/B0FG2432GJ?th=1&linkCode=ll2&tag=l0c39-21&linkId=5b9777d87a5e7a03b360884764158873&ref=_as_li_ss_tl"
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
        triggerKeywords: ["musica", "vinile", "vinili", "album", "box", "set", "collezione", "cd", "record", "giradischi", "analogica"],
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
                message: "Stai dando un'occhiata a questa perla in vinile? 🎵 Ottima scelta! Il vinile non è solo un disco, è un'esperienza sensoriale. Perfetto per le tue sessioni di ascolto con una bevanda rinfrescante."
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
                    name: "Prestige antiaderenti resistenti induzione impugnare",
                    link: "https://www.amazon.it/Prestige-antiaderenti-resistenti-induzione-impugnare/dp/B0C49TJKJ5?th=1&linkCode=ll2&tag=l0c39-21&linkId=1334e0ede6f625ea3ce52d4ef9a163fb&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Cucini spesso? 🍳 Guarda, con il set di pentole e Coca-Cola Zero hai tutto per cucinare e rilassarti. Ecco i link, è fantastico!"
            },
            {
                product1: {
                    name: "Bosch MC812M844 Cucina Multifunzione Alluminio",
                    link: "https://www.amazon.it/Bosch-MC812M844-Cucina-Multifunzione-Alluminio/dp/B07HPRQJL1?th=1&linkCode=ll2&tag=l0c39-21&linkId=2acaa6b678bac18747a2cdac25e75848&ref=_as_li_ss_tl"
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
                    name: "paillettes sneakers nightclub tendenza all-match",
                    link: "https://www.amazon.it/paillettes-sneakers-nightclub-tendenza-all-match/dp/B098BCRK41?th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=82723a79eb1a7c7ae378324a7b89c9f2&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi stile sportivo? 👟 Guarda, con le sneakers e Coca-Cola Zero hai look perfetto e relax. Ecco i link, è fantastico!"
            },
            {
                product1: {
                    name: "Tods Donna Mocassino Platform Mascherina",
                    link: "https://www.amazon.it/Tods-Donna-Mocassino-Platform-Mascherina/dp/B0C3VZRYSG?th=1&psc=1&linkCode=ll2&tag=l0c39-21&linkId=d51d2c599eb07e84ba1c51057afbfd9b&ref=_as_li_ss_tl"
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
                    name: "Daydreamer ali del sogno Aa Vv",
                    link: "https://www.amazon.it/Daydreamer-ali-del-sogno-Aa-Vv/dp/8804736178?crid=3TY5QGE8F68AR&dib=eyJ2IjoiMSJ9.cXKxgSe7W5q94BO5HgbZtidoyLEM8uNIWo3jVoXlhXbs9nPD9XofsxXLYUJl3UVP.Ak-bbQQ0ptrC57kwQWUouMCFpXxRoI_87EZGljBiaZI&dib_tag=se&keywords=libri+daydreamer+le+ali+del+sogno&qid=1778003739&sprefix=libri+le+ali++%2Caps%2C141&sr=8-1&linkCode=ll2&tag=l0c39-21&linkId=58bf6a65290c6dde0cda8cfa27d163e1&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ami leggere? 📚 Guarda, con Kindle Paperwhite e Coca-Cola Zero hai lettura perfetta e relax. Ecco i link, è fantastico!"
            },
            {
                product1: {
                    name: "Fuoco sangue George R Martin",
                    link: "https://www.amazon.it/Fuoco-sangue-George-R-Martin/dp/880475172X?&linkCode=ll2&tag=l0c39-21&linkId=12ee8a5a0273875275dd3073149c4fdc&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi un buon libro? 📖 Guarda, con il bestseller e Coca-Cola Zero hai storia emozionante e relax. Ecco i link, è fantastico!"
            }
        ]
    },
    "pesca": {
        name: "Pesca Sportiva",
        triggerKeywords: ["pesca", "canna", "mulinello", "esca", "fiume", "lago", "mare", "pescare"],
        song: "Sailing - Rod Stewart",
        songLink: "https://www.youtube.com/watch?v=kft2qW3F5QY",
        songLinkSpotify: "https://open.spotify.com/track/0T5x6p1p1p1p1p1p1p1p1",
        songLinkAmazon: "https://music.amazon.com/songs/B00XXXXXXX",
        combos: [
            {
                product1: {
                    name: "Kolpo Canna Pesca Bolognese Tripudio",
                    link: "https://www.amazon.it/Kolpo-Canna-pesca-Bolognese-Tripudio/dp/B0CTTKKMHX?&linkCode=ll2&tag=l0c39-21&linkId=9453c29e1b25860b012181eab40279d8&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "BNTTEAM Canna Telescopica Carbonio",
                    link: "https://www.amazon.it/dp/B0CTTKKMHX?&linkCode=ll2&tag=l0c39-21&linkId=9453c29e1b25860b012181eab40279d8&ref=_as_li_ss_tl"
                },
                message: "Le specifiche tecniche indicano che la canna bolognese Kolpo e la telescopica BNTTEAM offrono resistenza alla corrosione e bilanciamento ottimizzato per diverse condizioni di pesca. Ecco i link tecnici."
            }
        ]
    },
    "immersioni": {
        name: "Immersioni Subacquee",
        triggerKeywords: ["immersione", "sub", "snorkeling", "maschera", "boccaglio", "pinne", "acqua", "mare"],
        song: "Under the Sea - The Little Mermaid",
        songLink: "https://www.youtube.com/watch?v=VqqkE1QrD8g",
        songLinkSpotify: "https://open.spotify.com/track/0T5x6p1p1p1p1p1p1p1p1",
        songLinkAmazon: "https://music.amazon.com/songs/B00XXXXXXX",
        combos: [
            {
                product1: {
                    name: "Cressi Planet Occhialini Premium",
                    link: "https://www.amazon.it/Cressi-Occhialini-Premium-Triathlon-Acquatici/dp/B01BNOL5MI?th=1&linkCode=ll2&tag=l0c39-21&linkId=e2e1afab0b2551503359758131d2e5e4&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Cressi GALILEO Occhialini",
                    link: "https://www.amazon.it/Cressi-GALILEO-Occhialini-Temperato-Prodotti/dp/B000O2R8F4?th=1&linkCode=ll2&tag=l0c39-21&linkId=7c3e750bc199d63302e51bd70f272f25&ref=_as_li_ss_tl"
                },
                message: "Le caratteristiche tecniche degli occhialini Cressi Planet e GALILEO indicano ottimizzazione della visibilità subacquea e resistenza all'acqua salata per snorkeling e diving. Ecco i link tecnici."
            }
        ]
    },
    "tennis": {
        name: "Tennis",
        triggerKeywords: ["tennis", "racchetta", "campo", "pallina", "sport", "gioco"],
        song: "Tennis Court - Lorde",
        songLink: "https://www.youtube.com/watch?v=znLbgL2W2Wg",
        songLinkSpotify: "https://open.spotify.com/track/0T5x6p1p1p1p1p1p1p1p1",
        songLinkAmazon: "https://music.amazon.com/songs/B00XXXXXXX",
        combos: [
            {
                product1: {
                    name: "Racchetta Tennis",
                    link: "https://www.amazon.it/dp/B0B6JPRNMT?aref=2KVn4Fibde&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWxfcmlnaHRfc2hhcmVk&th=1&linkCode=ll2&tag=l0c39-21&linkId=f0150831c5a4d917d297b5e20040704b&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Get Grip Non-slip Overgrip",
                    link: "https://www.amazon.it/Get-Grip-personalizzato-anti-scivolo-prefabbricata/dp/B09ZMSWNF2?th=1&linkCode=ll2&tag=l0c39-21&linkId=a647ab72545f74c7d30b4078b444e62f&ref=_as_li_ss_tl"
                },
                message: "Le specifiche tecniche indicano che la racchetta e l'overgrip Get Grip offrono bilanciamento ottimizzato e controllo migliorato per il gioco competitivo. Ecco i link tecnici."
            }
        ]
    },
    "padel": {
        name: "Padel",
        triggerKeywords: ["padel", "racchetta", "pallina", "campo", "sport", "gioco"],
        song: "Viva la Vida - Coldplay",
        songLink: "https://www.youtube.com/watch?v=dvgZkm9x2PE",
        songLinkSpotify: "https://open.spotify.com/track/0T5x6p1p1p1p1p1p1p1p1",
        songLinkAmazon: "https://music.amazon.com/songs/B00XXXXXXX",
        combos: [
            {
                product1: {
                    name: "Joma Open Padel Racquet",
                    link: "https://www.amazon.it/Joma-RACCHETTA-PADEL-Multicolor-Taglia/dp/B09QH68YYN?&linkCode=ll2&tag=l0c39-21&linkId=f74bdcc7bdd696a71c20e61c1a2b6d7b&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "MAS Padel Rival 100",
                    link: "https://www.amazon.it/MAS-Padel-Racchetta-Arancione-Rivestimento/dp/B09DQ63K9W?&linkCode=ll2&tag=l0c39-21&linkId=bbdbe899557937cb36312cd7b6720ca9&ref=_as_li_ss_tl"
                },
                message: "Le caratteristiche tecniche indicano che le racchette Joma Open e MAS Rival 100 offrono controllo di palla e materiali compositi per il gioco dinamico. Ecco i link tecnici."
            }
        ]
    },
    "beach-volley": {
        name: "Beach Volley",
        triggerKeywords: ["beach", "volley", "pallavolo", "spiaggia", "sabbia", "rete", "palla"],
        song: "Waka Waka - Shakira",
        songLink: "https://www.youtube.com/watch?v=pRpeEdMmmQ0",
        songLinkSpotify: "https://open.spotify.com/track/0T5x6p1p1p1p1p1p1p1p1",
        songLinkAmazon: "https://music.amazon.com/songs/B00XXXXXXX",
        combos: [
            {
                product1: {
                    name: "Kit Linee di Campo Beach Volley",
                    link: "https://www.amazon.it/Volley-Allenamento-Segnalettica-Deliminatori-Beach-Volley/dp/B07NPMBKY5?th=1&linkCode=ll2&tag=l0c39-21&linkId=5b247fe1ecc04303f040f0982e8b2795&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Le specifiche tecniche indicano che il kit linee di campo offre resistenza alle condizioni estive e idratazione ottimale per il beach volley. Ecco i link tecnici."
            }
        ]
    },
    "arrampicata": {
        name: "Arrampicata & Climbing",
        triggerKeywords: ["arrampicata", "climbing", "parete", "corda", "imbracatura", "scalare", "montagna"],
        song: "The Climb - Miley Cyrus",
        songLink: "https://www.youtube.com/watch?v=NG2zyeVRcbs",
        songLinkSpotify: "https://open.spotify.com/track/0T5x6p1p1p1p1p1p1p1p1",
        songLinkAmazon: "https://music.amazon.com/songs/B00XXXXXXX",
        combos: [
            {
                product1: {
                    name: "SOB Imbracatura Arrampicata Anticaduta",
                    link: "https://www.amazon.it/SOB-Imbracatura-Arrampicata-Anticaduta-Speleologia/dp/B0CFL3Q766?&linkCode=ll2&tag=l0c39-21&linkId=77414f32cc7d1c4d2123bd1a71525d68&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Le certificazioni di sicurezza indicano che l'imbracatura SOB offre protezione certificata per climbing, con materiali ad alte prestazioni. Ecco i link tecnici."
            }
        ]
    }
};

// Macro-Categorie - Raggruppamento per Stile di Vita
const MacroCategories = {
    "passioni": {
        titolo: "Passioni & Hobby",
        descrizione: "Collezionabili, fandom e intrattenimento",
        categorie: ["manga-anime", "cinema", "musica-vinili", "giochi-da-tavolo"]
    },
    "lifestyle": {
        titolo: "Routine Perfetta",
        descrizione: "Casa, fitness, cura personale e benessere",
        categorie: ["cucina", "fitness", "smart-home", "pet-care", "parrucchiere-barbiere", "moda"]
    },
    "lavoro-studio": {
        titolo: "Produttività & Studio",
        descrizione: "Lavoro, tecnologia e apprendimento",
        categorie: ["pc", "libri"]
    },
    "tempo-libero": {
        titolo: "Tempo Libero",
        descrizione: "Outdoor, viaggi e stagionali",
        categorie: ["mare", "outdoor", "caldo"]
    },
    "ristoro": {
        titolo: "Pausa & Ristoro",
        descrizione: "Bevande e snack per ogni momento",
        categorie: ["bibite-bevande"]
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
