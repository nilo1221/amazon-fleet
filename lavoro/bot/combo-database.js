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
            },
            {
                product1: {
                    name: "HEIMUNI Fodera Impermeabile Divano Esterno a Forma di L",
                    link: "https://www.amazon.it/HEIMUNI-Impermeabile-Antipolvere-Copridivano-300x300x100x90/dp/B0CGDHRWP2?pd_rd_w=sWfgZ&content-id=amzn1.sym.4dca35fa-dfa3-4fcb-9ffe-1a5b1a54acf3&pf_rd_p=4dca35fa-dfa3-4fcb-9ffe-1a5b1a54acf3&pf_rd_r=ASHVM5144K53AV3ZX6V8&pd_rd_wg=gIXvw&pd_rd_r=c6a59c9e-d95b-4e9a-afc9-8a11f5edc778&pd_rd_i=B0CGDHRWP2&th=1&linkCode=ll2&tag=l0c39-21&linkId=385b314c385cac4c4155952d2d21be7d&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi proteggere i mobili da giardino? 🌳 Ho trovato questa fodera impermeabile anti UV per il divano esterno. Con Coca-Cola Zero hai il giardino protetto e relax!"
            },
            {
                product1: {
                    name: "vidaXL Tavolino da Giardino 45x45x36 cm in Legno Massello di Acacia",
                    link: "https://www.amazon.it/dp/B09M699WPP?ie=UTF8&pf_rd_p=79495992-24b1-4ab4-b453-790923215720&pf_rd_r=6ABG84R14M3M1BH8PB04&pd_rd_wg=Pp5ab&pd_rd_w=qZT7C&pd_rd_r=6872a229-ddcc-4575-b2cd-0d22818ba1c5&aref=Em0oo0yggK&th=1&linkCode=ll2&tag=l0c39-21&linkId=1068cfb1fb47bbeac014a4efc7f4db6e&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi un tavolino elegante per il giardino? 🪑 Ho trovato questo tavolino in legno di acacia perfetto per il tuo outdoor. Con Coca-Cola Zero goditi il tuo giardino!"
            },
            {
                product1: {
                    name: "AXT SHADE Vela Ombreggiante Impermeabile Triangolo Rettangolo",
                    link: "https://www.amazon.it/AXT-SHADE-Impermeabile-Triangolare-Protezione/dp/B07YKCZBS5?pd_rd_w=ybAKY&content-id=amzn1.sym.4dca35fa-dfa3-4fcb-9ffe-1a5b1a54acf3&pf_rd_p=4dca35fa-dfa3-4fcb-9ffe-1a5b1a54acf3&pf_rd_r=9XS1VVR9NMPX09GM8JMD&pd_rd_wg=WUW9G&pd_rd_r=f2040e99-3c52-4dba-a214-217981d7db87&pd_rd_i=B07YKCZBS5&th=1&linkCode=ll2&tag=l0c39-21&linkId=4225dd1fcadb0eedc240817936f7a904&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi ombra elegante nel giardino? ☀️ Ho trovato questa vela ombreggiante impermeabile anti UV per terrazza e giardino. Con Coca-Cola Zero hai ombra fresca e relax!"
            },
            {
                product1: {
                    name: "GardenMate 3x 85L Sacchi per Rifiuti da Giardino Pop Up",
                    link: "https://www.amazon.it/GardenMate-85L-Sacchi-rifiuti-giardino/dp/B00K79T3OS?pf_rd_p=5cf7e89d-be4f-4a60-a94f-67425bc592ec&pf_rd_r=CZPD0FM6BCR2DGB6F11W&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&linkCode=ll2&tag=l0c39-21&linkId=78951b51fd462f7c2ba145032894eb13&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi raccogliere foglie e sterpaglie? 🍂 Ho trovato questi sacchi pop up resistenti per il giardinaggio. Con Coca-Cola Zero hai il giardino pulito e relax!"
            },
            {
                product1: {
                    name: "Sekey 100x220 cm Zanzariera Magnetica per Porta",
                    link: "https://www.amazon.it/Sekey-Zanzariera-Magnetica-alluminio-installare/dp/B07PK3MJLB?pd_rd_w=Lxqmo&content-id=amzn1.sym.4dca35fa-dfa3-4fcb-9ffe-1a5b1a54acf3&pf_rd_p=4dca35fa-dfa3-4fcb-9ffe-1a5b1a54acf3&pf_rd_r=QC3SARN5RVTVABZP9N5Y&pd_rd_wg=VFUIJ&pd_rd_r=051f868f-931c-4081-ad02-53be0742c187&pd_rd_i=B07PK3MJLB&th=1&linkCode=ll2&tag=l0c39-21&linkId=4186d3a8c03bcbe6a4e1161eeb2c0528&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi proteggere la casa dagli insetti? 🦟 Ho trovato questa zanzariera magnetica facile da installare senza fori. Con Coca-Cola Zero hai casa protetta e relax!"
            },
            {
                product1: {
                    name: "Apalus Zanzariera con Magneti per Porte",
                    link: "https://www.amazon.it/dp/B01GO5GX6O?ie=UTF8&pf_rd_p=79495992-24b1-4ab4-b453-790923215720&pf_rd_r=QP0F3SCK6BP2YE8PPQFH&pd_rd_wg=YVGvY&pd_rd_w=sXZFD&pd_rd_r=ff6bb0e7-c64c-49fa-a0f2-9520bb9bf167&aref=ePdtT6grqD&th=1&linkCode=ll2&tag=l0c39-21&linkId=8fd685fa6596fb541c39441f03e2a84a&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi una zanzariera di alta qualità? 🚪 Ho trovato questa zanzariera Apalus che si chiude da sola con rete fine. Con Coca-Cola Zero hai protezione totale e relax!"
            },
            {
                product1: {
                    name: "Oderra Torcia Frontale LED Ricaricabile",
                    link: "https://www.amazon.it/Oderra-Ricaricabile-Illuminazione-Indicatore-Impermeabile/dp/B0DMN26WY2?adgrpid=124708390037&dib=eyJ2IjoiMSJ9._FRLa5fl_JtxJtFWEBX5PM3p2YNOoSPWi0gCMOTQroRLcbwf_XThqWuo8paXXj31ChxYywvj7IbhckgnYAWlTSGjM628SHT157hJbX_GNI4rFBWT1z2gvpFzH0As0chETNT1n2K-tIEJuYekQ2MNccoWbr6iJmh-fGDdf72okPKLzIiVfwKwne7uZ7nfwxjT2UcxNmghx45W_oQMQ_fJ0UasE0rLKnvWt-hzmRSd5G7pG_nLaWydWG29s8QJ6IwLfjXS04iq2kfN6wlHmkPnHBldQXjVNePCn6hVlollFjE.JukTDI6UXtb3XZpC9WuweJ4PhGb2KZbjMYr2X9SILnY&dib_tag=se&hvadid=591166418377&hvdev=c&hvexpln=0&hvlocphy=9190900&hvnetw=g&hvocijid=2724230052571550670--&hvqmt=e&hvrand=2724230052571550670&hvtargid=kwd-359942218975&hydadcr=8194_2249375&keywords=pesca+amazon&mcid=38a4311fdc04398984b206b17df2d853&qid=1780088260&sr=8-1-spons&aref=Y9dt97cZ3d&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1&linkCode=ll2&tag=l0c39-21&linkId=0268721484ae290eb70f6cec002ddfe7&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi illuminare il campeggio? 🔦 Ho trovato questa torcia frontale ricaricabile con sensore di movimento e 8 modalità. Con Coca-Cola Zero hai luce e relax!"
            },
            {
                product1: {
                    name: "Eurhomewit 3 x 120 L Sacchi Giardinaggio con Coperchio e Maniglie",
                    link: "https://www.amazon.it/dp/B0CW2WT9HY?aref=YyzE14YW4k&sp_csd=d2lkZ2V0TmFtZT1zcF9ocXBfc2hhcmVk&th=1&linkCode=ll2&tag=l0c39-21&linkId=6cc581867f2306d9adc8118ab54eb5fc&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi sacchi grandi per il giardinaggio? 🌿 Ho trovato questi sacchi 120L con coperchio per foglie e erba. Con Coca-Cola Zero hai il giardino in ordine e relax!"
            },
            {
                product1: {
                    name: "LUDHEP Cucchiaini da Pesca Esche 16 Pezzi",
                    link: "https://www.amazon.it/LUDHEP-Cucchiaini-Pesca-Esche-Ciondoli/dp/B0GWJY8K96?adgrpid=124708390037&dib=eyJ2IjoiMSJ9._FRLa5fl_JtxJtFWEBX5PM3p2YNOoSPWi0gCMOTQroRLcbwf_XThqWuo8paXXj31ChxYywvj7IbhckgnYAWlTSGjM628SHT157hJbX_GNI4rFBWT1z2gvpFzH0As0chETNT1n2K-tIEJuYekQ2MNccoWbr6iJmh-fGDdf72okPKLzIiVfwKwne7uZ7nfwxjT2UcxNmghx45W_oQMQ_fJ0UasE0rLKnvWt-hzmRSd5G7pG_nLaWydWG29s8QJ6IwLfjXS04iq2kfN6wlHmkPnHBldQXjVNePCn6hVlollFjE.JukTDI6UXtb3XZpC9WuweJ4PhGb2KZbjMYr2X9SILnY&dib_tag=se&hvadid=591166418377&hvdev=c&hvexpln=0&hvlocphy=9190900&hvnetw=g&hvocijid=2724230052571550670--&hvqmt=e&hvrand=2724230052571550670&hvtargid=kwd-359942218975&hydadcr=8194_2249375&keywords=pesca+amazon&mcid=38a4311fdc04398984b206b17df2d853&qid=1780088260&sr=8-3-spons&aref=rqtXYv48n6&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1&linkCode=ll2&tag=l0c39-21&linkId=563dd46a99b4a4e93f38f0c59dda4fb3&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi pescare la trota? 🎣 Ho trovato questi cucchiaini da pesca con ciondoli da 2.5g e 5g. Con Coca-Cola Zero hai pesca e relax!"
            },
            {
                product1: {
                    name: "Vicloon Kit Accessori Pesca 191Pz",
                    link: "https://www.amazon.it/Vicloon-Accessori-Attrezzatura-Cuscinetto-Connettori/dp/B087M7B9XF?adgrpid=124708390037&dib=eyJ2IjoiMSJ9._FRLa5fl_JtxJtFWEBX5PM3p2YNOoSPWi0gCMOTQroRLcbwf_XThqWuo8paXXj31ChxYywvj7IbhckgnYAWlTSGjM628SHT157hJbX_GNI4rFBWT1z2gvpFzH0As0chETNT1n2K-tIEJuYekQ2MNccoWbr6iJmh-fGDdf72okPKLzIiVfwKwne7uZ7nfwxjT2UcxNmghx45W_oQMQ_fJ0UasE0rLKnvWt-hzmRSd5G7pG_nLaWydWG29s8QJ6IwLfjXS04iq2kfN6wlHmkPnHBldQXjVNePCn6hVlollFjE.JukTDI6UXtb3XZpC9WuweJ4PhGb2KZbjMYr2X9SILnY&dib_tag=se&hvadid=591166418377&hvdev=c&hvexpln=0&hvlocphy=9190900&hvnetw=g&hvocijid=2724230052571550670--&hvqmt=e&hvrand=2724230052571550670&hvtargid=kwd-359942218975&hydadcr=8194_2249375&keywords=pesca+amazon&mcid=38a4311fdc04398984b206b17df2d853&qid=1780088260&sr=8-6&linkCode=ll2&tag=l0c39-21&linkId=91af1844c7821d3c5c90c1cce2d7a146&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi un kit completo per la pesca? 🎯 Ho trovato questo kit 191 pezzi con girevoli, sinker e ganci. Con Coca-Cola Zero hai tutto l'occorrente e relax!"
            },
            {
                product1: {
                    name: "Vicloon Esche da Pesca 120 Pezzi",
                    link: "https://www.amazon.it/Vicloon-Pesca%EF%BC%8C101-Artificiali-Crankbaits-Stickbait/dp/B0716SR6RF?pd_rd_w=UKvso&content-id=amzn1.sym.f96af5e8-edb1-4e92-a8cb-5aa09b1fe9d9&pf_rd_p=f96af5e8-edb1-4e92-a8cb-5aa09b1fe9d9&pf_rd_r=FRZ8ARX5DZXZXF6495RW&pd_rd_wg=7vuln&pd_rd_r=ecfddc6e-e6c2-46ec-b35c-acac90e4638f&pd_rd_i=B0716SR6RF&th=1&linkCode=ll2&tag=l0c39-21&linkId=2ae24d7c6c727f2e3a08367096efcd1e&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi esche artificiali per ogni tipo di pesca? 🐟 Ho trovato questo set 120 pezzi con crankbaits, stickbait e vermi. Con Coca-Cola Zero hai esche infinite e relax!"
            },
            {
                product1: {
                    name: "HOTUT Pesca Accessori Set 204 Pezzi",
                    link: "https://www.amazon.it/HOTUT-Accessori-Scatola-Girevole-Spaziale/dp/B0FHJ3M5Y6?pd_rd_w=UKvso&content-id=amzn1.sym.f96af5e8-edb1-4e92-a8cb-5aa09b1fe9d9&pf_rd_p=f96af5e8-edb1-4e92-a8cb-5aa09b1fe9d9&pf_rd_r=FRZ8ARX5DZXZXF6495RW&pd_rd_wg=7vuln&pd_rd_r=ecfddc6e-e6c2-46ec-b35c-acac90e4638f&pd_rd_i=B0FHJ3M5Y6&psc=1&linkCode=ll2&tag=l0c39-21&linkId=3f7ab40c2ea1b9fdd7deb9a264f0afe9&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi un kit completo con scatola per la pesca in mare? 🌊 Ho trovato questo set 204 pezzi con ottone di rame pesante e scatola. Con Coca-Cola Zero hai il mare in tasca e relax!"
            },
            {
                product1: {
                    name: "THKFISH Kit di attrezzi da pesca con marsupio 85 pezzi",
                    link: "https://www.amazon.it/dp/B0DJVF3273?pd_rd_i=B0DJVF3273&pd_rd_w=rd3aw&content-id=amzn1.sym.1eb9f79a-a1f0-4047-9d3a-2c918f58aed5&pf_rd_p=1eb9f79a-a1f0-4047-9d3a-2c918f58aed5&pf_rd_r=TGZQMF6ZFYPT9ZCH17MY&pd_rd_wg=Q01fe&pd_rd_r=32a3f1e6-b491-4331-b8e2-93d71cd97ae8&aref=6jjo5ErOb2&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWw&th=1&linkCode=ll2&tag=l0c39-21&linkId=ea6cddb84be614ed4435d92f067bb973&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi un kit completo con marsupio per la pesca? 🎒 Ho trovato questo set 85 pezzi con marsupio impermeabile, pinze, esche e bilancia digitale. Con Coca-Cola Zero hai tutto l'occorrente e relax!"
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
            },
            {
                product1: {
                    name: "Guarnizione Finestra Condizionatore asciugatrice Mantenere",
                    link: "https://www.amazon.it/Guarnizione-Finestra-Condizionatore-asciugatrice-Mantenere/dp/B0GRTBGHPN?pd_rd_w=r4MYu&content-id=amzn1.sym.7df8515a-b6ea-489f-99c4-dc8ee9c9a18c&pf_rd_p=7df8515a-b6ea-489f-99c4-dc8ee9c9a18c&pf_rd_r=VY37SCFVV7VFWZQQ27JT&pd_rd_wg=T8Wcy&pd_rd_r=46e28d5b-5e6e-4c92-a7b1-51a3d6efb23a&pd_rd_i=B0GRTBGHPN&th=1&linkCode=ll2&tag=l0c39-21&linkId=ee250e1718f315ed10ab84367894aa1f&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi risparmiare energia? 💨 Ho trovato questa guarnizione per condizionatore che mantiene l'efficienza. Con Coca-Cola Zero hai casa fresca e relax!"
            },
            {
                product1: {
                    name: "Dyson Aspirapolvere Autonomia Tecnologia Anti-Groviglio",
                    link: "https://www.amazon.it/Dyson-aspirapolvere-autonomia-tecnologia-anti-groviglio/dp/B0DF5QXDYP?pf_rd_r=V74C22SBT7M0R00HP32J&pf_rd_p=2bd53ec2-6771-4725-ad77-aabca72d950d&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&th=1&linkCode=ll2&tag=l0c39-21&linkId=294ff0e9dc6037374118423780b4342c&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi pulizia perfetta? 🧹 Ho trovato questo Dyson aspirapolvere con tecnologia anti-groviglio. Con Coca-Cola Zero hai casa pulita e relax!"
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
            },
            {
                product1: {
                    name: "MasterChef Set Coltelli Universale con Portacoltelli",
                    link: "https://www.amazon.it/MasterChef-Set-Coltelli-Universale-Portacoltelli/dp/B0CL9T2P5R?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=3CCD80499GJT3&dib=eyJ2IjoiMSJ9.xdeQ6GZpxTD-63c-NXH7KxYz2qV_gXFPzUWLSpf_86XfKzE7tGvN_Ce--QlftWOTbCyPIE-5KQtQjls3jCg6BkgYZSXI5zRekyjt9PzNwH-UBnChywTZKSmdzE5YSCyHYR1R4mk955Xgh7CuLyf3hlPQcFVVRSha-attRbRa2J77edVtT4xJ0FKVG3wx-yUb-OmIK1xusnJV4VDnUKFikF_r6MjubVko1fvz14swUq5oE5tdC06bnusCHUAxQ4jCf48y_21IQt8Ya6bkSPT8GDVwKA6sKggYmxuNJRuRdys.K36GxuEtyMJ5VDr6R4XiAS-VGAWHK0EaL_peFGIoPf8&dib_tag=se&keywords=cucina&qid=1780085590&sprefix=cucina%2Caps%2C183&sr=8-5&ufe=app_do%3Aamzn1.fos.8a1562af-dabe-4f1d-8eb5-1ded1ace4ef7&th=1&linkCode=ll2&tag=l0c39-21&linkId=e72bbc639442ee46d5903a404d26a1c8&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Spontex Spugna Abrasiva Piatti Fibraplus",
                    link: "https://www.amazon.it/Spontex-Spugna-Abrasiva-Piatti-Fibraplus/dp/B0083FN358?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dib=eyJ2IjoiMSJ9.mCgL5q0Kyg8v-VS8-P8xECtYqA7gfJhkSU4Sr9zSgDjDuKQ8xdxoEArGacTBlTUjQxVrmdYxIW577YRKMgFYl52_FD3KGBli1ItgrJ7eOsjzWr0DAj7vC91px3hA1vmmBWNYz099WQsnG5XT67O7UKGe4KXihZVPEF6f25t3CNhegY_1sb0Binix0aoGBkPUbhsdMdUrPnb27P32HuFaKWrTXN6ib5680EpIFuWadrjl7c-gH_2zjGCQ7MpqojKJ0AjWVxgvqrgekdgfg97Q-v_V4seqcC0PKLUlYQAJLFY.d-Uhwfyp8KzP3Mi8pFflR3_jdBe4WZdx04Lt58vUH6I&dib_tag=se&keywords=cucina&qid=1780085651&sr=8-14&th=1&linkCode=ll2&tag=l0c39-21&linkId=a49480b4fca2e5e7f888f0eb5c2a7c0c&ref=_as_li_ss_tl"
                },
                message: "Vuoi il set completo per la cucina? 🔪 Ho trovato il set MasterChef di coltelli professionali e le spugne Spontex per la pulizia. Con questa combo hai preparazione e pulizia coperte!"
            },
            {
                product1: {
                    name: "Bilancia Digitale Elettronica Elegante Alimentare",
                    link: "https://www.amazon.it/Bilancia-Digitale-Elettronica-Elegante-Alimentare/dp/B0C7G2YBGR?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dib=eyJ2IjoiMSJ9.mCgL5q0Kyg8v-VS8-P8xECtYqA7gfJhkSU4Sr9zSgDjDuKQ8xdxoEArGacTBlTUjQxVrmdYxIW577YRKMgFYl52_FD3KGBli1ItgrJ7eOsjzWr0DAj7vC91px3hA1vmmBWNYz099WQsnG5XT67O7UKGe4KXihZVPEF6f25t3CNhegY_1sb0Binix0aoGBkPUbhsdMdUrPnb27P32HuFaKWrTXN6ib5680EpIFuWadrjl7c-gH_2zjGCQ7MpqojKJ0AjWVxgvqrgekdgfg97Q-v_V4seqcC0PKLUlYQAJLFY.d-Uhwfyp8KzP3Mi8pFflR3_jdBe4WZdx04Lt58vUH6I&dib_tag=se&keywords=cucina&qid=1780085651&sr=8-13&th=1&linkCode=ll2&tag=l0c39-21&linkId=37b77b3c5642900d0cb02deb39a69eab&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Cucini con precisione? ⚖️ Ho trovato questa bilancia digitale elegante per pesare gli ingredienti con accuratezza. Con Coca-Cola Zero hai precisione e relax!"
            },
            {
                product1: {
                    name: "ICEMAN Macchina ghiaccio doppiadimensione fabbricatoreghiaccio",
                    link: "https://www.amazon.it/ICEMAN-Macchina-ghiaccio-doppiadimensione-fabbricatoreghiaccio/dp/B0DFYRJLN3?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dib=eyJ2IjoiMSJ9.mCgL5q0Kyg8v-VS8-P8xECtYqA7gfJhkSU4Sr9zSgDjDuKQ8xdxoEArGacTBlTUjQxVrmdYxIW577YRKMgFYl52_FD3KGBli1ItgrJ7eOsjzWr0DAj7vC91px3hA1vmmBWNYz099WQsnG5XT67O7UKGe4KXihZVPEF6f25t3CNhegY_1sb0Binix0aoGBkPUbhsdMdUrPnb27P32HuFaKWrTXN6ib5680EpIFuWadrjl7c-gH_2zjGCQ7MpqojKJ0AjWVxgvqrgekdgfg97Q-v_V4seqcC0PKLUlYQAJLFY.d-Uhwfyp8KzP3Mi8pFflR3_jdBe4WZdx04Lt58vUH6I&dib_tag=se&keywords=cucina&qid=1780085651&sr=8-18-spons&aref=Yk6G8KLvUx&sp_csd=d2lkZ2V0TmFtZT1zcF9tdGY&psc=1&linkCode=ll2&tag=l0c39-21&linkId=88e523279884e385bbce93639fb8a586&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "SWEET VIEW Spruzzatore Spruzzino Friggitrice",
                    link: "https://www.amazon.it/SWEET-VIEW-Spruzzatore-Spruzzino-Friggitrice/dp/B0D25YFS8F?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dib=eyJ2IjoiMSJ9.mCgL5q0Kyg8v-VS8-P8xECtYqA7gfJhkSU4Sr9zSgDjDuKQ8xdxoEArGacTBlTUjQxVrmdYxIW577YRKMgFYl52_FD3KGBli1ItgrJ7eOsjzWr0DAj7vC91px3hA1vmmBWNYz099WQsnG5XT67O7UKGe4KXihZVPEF6f25t3CNhegY_1sb0Binix0aoGBkPUbhsdMdUrPnb27P32HuFaKWrTXN6ib5680EpIFuWadrjl7c-gH_2zjGCQ7MpqojKJ0AjWVxgvqrgekdgfg97Q-v_V4seqcC0PKLUlYQAJLFY.d-Uhwfyp8KzP3Mi8pFflR3_jdBe4WZdx04Lt58vUH6I&dib_tag=se&keywords=cucina&qid=1780085651&sr=8-21&th=1&linkCode=ll2&tag=l0c39-21&linkId=8a46719ea2ec087c034f42dbc149b811&ref=_as_li_ss_tl"
                },
                message: "Vuoi la cucina perfetta? ❄️ Ho trovato la macchina ghiaccio ICEMAN per bevande fresche e lo spruzzatore SWEET VIEW per cucinare con meno olio. Con questa combo hai freschezza e cottura sana!"
            },
            {
                product1: {
                    name: "MasterChef Bilancia con temperatura Spegnimento Automatico",
                    link: "https://www.amazon.it/MasterChef-Bilancia-temperato-Spegnimento-Automatico/dp/B09GFM52DK?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dib=eyJ2IjoiMSJ9.mCgL5q0Kyg8v-VS8-P8xECtYqA7gfJhkSU4Sr9zSgDjDuKQ8xdxoEArGacTBlTUjQxVrmdYxIW577YRKMgFYl52_FD3KGBli1ItgrJ7eOsjzWr0DAj7vC91px3hA1vmmBWNYz099WQsnG5XT67O7UKGe4KXihZVPEF6f25t3CNhegY_1sb0Binix0aoGBkPUbhsdMdUrPnb27P32HuFaKWrTXN6ib5680EpIFuWadrjl7c-gH_2zjGCQ7MpqojKJ0AjWVxgvqrgekdgfg97Q-v_V4seqcC0PKLUlYQAJLFY.d-Uhwfyp8KzP3Mi8pFflR3_jdBe4WZdx04Lt58vUH6I&dib_tag=se&keywords=cucina&qid=1780085651&sr=8-27&th=1&linkCode=ll2&tag=l0c39-21&linkId=ba62b8de749671cbd621e02e8ef4bbd2&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Cucini con precisione e sicurezza? 🌡️ Ho trovato questa bilancia MasterChef con sensore di temperatura e spegnimento automatico. Con Coca-Cola Zero hai cotture perfette e relax!"
            },
            {
                product1: {
                    name: "NESCAFÉ Dolce Gusto Macchina Espresso",
                    link: "https://www.amazon.it/NESCAFE%CC%81-DOLCE-GUSTO-Macchina-Espresso/dp/B08HSJY2JT?pd_rd_w=HGTYC&content-id=amzn1.sym.424a711c-7818-425a-9fb0-9a3d8996ff54&pf_rd_p=424a711c-7818-425a-9fb0-9a3d8996ff54&pf_rd_r=N8N8AZCTQG8DAVE9HFGY&pd_rd_wg=duv53&pd_rd_r=d2d3d7ed-69d0-42eb-b71d-d874bebd1228&pd_rd_i=B08HSJY2JT&linkCode=ll2&tag=l0c39-21&linkId=d1438fb0944c18bf072db77992c5b3dd&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ti piace il caffè? ☕ Ho trovato la macchina NESCAFÉ Dolce Gusto per espresso perfetto. Con Coca-Cola Zero hai caffè e bevande fresche!"
            },
            {
                product1: {
                    name: "Utilissimi EDITACASA - Set tris Barattoli",
                    link: "https://www.amazon.it/Utilissimi-EDITACASA-Barattoli-contenitori-portaspezie/dp/B0CKWHBYPJ?pd_rd_w=pTu3x&content-id=amzn1.sym.8e9cbc99-de35-4abc-8687-4abe6d4d44a0&pf_rd_p=8e9cbc99-de35-4abc-8687-4abe6d4d44a0&pf_rd_r=BRNGF5GN9Z6HW7G4J10R&pd_rd_wg=YVBpI&pd_rd_r=28b20346-f729-4a1f-b227-1d364182cbfe&pd_rd_i=B0CKWHBYPJ&psc=1&linkCode=ll2&tag=l0c39-21&linkId=44be6c43349d7fdcf73bb1841e2117c9&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi organizzare la cucina? 🫙 Ho trovato questo set tris di barattoli eleganti con decoro marmo per sale, zucchero e caffé. Con Coca-Cola Zero hai cucina ordinata e relax!"
            },
            {
                product1: {
                    name: "Macchina espresso portatile capsule macinato",
                    link: "https://www.amazon.it/Macchina-espresso-portatile-capsule-macinato/dp/B0GS51DD22?pd_rd_w=hGozp&content-id=amzn1.sym.7df8515a-b6ea-489f-99c4-dc8ee9c9a18c&pf_rd_p=7df8515a-b6ea-489f-99c4-dc8ee9c9a18c&pf_rd_r=N8N8AZCTQG8DAVE9HFGY&pd_rd_wg=duv53&pd_rd_r=d2d3d7ed-69d0-42eb-b71d-d874bebd1228&pd_rd_i=B0GS51DD22&linkCode=ll2&tag=l0c39-21&linkId=12fb29cbe0e5de619cfbbe842aaf3aea&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi il caffè ovunque? 🚀 Ho trovato questa macchina espresso portatile con capsule. Con Coca-Cola Zero hai caffè perfetto e bevande fresche ovunque tu sia!"
            },
            {
                product1: {
                    name: "Mutital ricambio completamente automatiche dellacqua",
                    link: "https://www.amazon.it/Mutital-ricambio-completamente-automatiche-dellacqua/dp/B0F8J1FJWB?keywords=Macchine%2Bda%2Bcaff%C3%A8&pf_rd_p=5cf7e89d-be4f-4a60-a94f-67425bc592ec&pf_rd_r=N8N8AZCTQG8DAVE9HFGY&aref=UFBmA4ADAV&sp_csd=d2lkZ2V0TmFtZT1zcF9hcGJfZGVza3RvcF9icm93c2VfaW5saW5lX2F0Zg&th=1&linkCode=ll2&tag=l0c39-21&linkId=8f1db1961f0b5770ccf8d2087996cdca&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi il caffè perfetto automatico? ⚙️ Ho trovato la macchina Mutital completamente automatica con ricambio acqua. Con Coca-Cola Zero hai caffè professionale e relax!"
            },
            {
                product1: {
                    name: "DeLonghi ECAM222-20-B Automatica Montalatte Preimpostate",
                    link: "https://www.amazon.it/DeLonghi-ECAM222-20-B-Automatica-Montalatte-Preimpostate/dp/B0BV3B7T33?keywords=Macchine%2Bda%2Bcaff%C3%A8&pf_rd_p=5cf7e89d-be4f-4a60-a94f-67425bc592ec&pf_rd_r=N8N8AZCTQG8DAVE9HFGY&ufe=app_do%3Aamzn1.fos.d9b6a10d-e3a2-448c-a21b-086faff5973f&aref=XQ9ob51mry&sp_csd=d2lkZ2V0TmFtZT1zcF9hcGJfZGVza3RvcF9icm93c2VfaW5saW5lX2J0Zg&th=1&linkCode=ll2&tag=l0c39-21&linkId=41cb6fa1358ffa485cadede6da71b75c&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi cappuccino perfetto? ☕ Ho trovato la DeLonghi ECAM222-20-B con montalatte e preimpostate. Con Coca-Cola Zero hai caffè da bar e relax!"
            },
            {
                product1: {
                    name: "Macchina Caffè B0CDCL53KW",
                    link: "https://www.amazon.it/dp/B0CDCL53KW?aref=RwQ61W3jVH&aaxitk=cbe5bc2f90eeec749338d8e5b8ca00c3&pf_rd_p=79495992-24b1-4ab4-b453-790923215720&pf_rd_r=7ZW7QBD7R4NC62JX7WMB&pd_rd_wg=Gf86x&pd_rd_w=QFQ4q&pd_rd_r=4cd43771-f539-4f46-9d75-a29b5f4b46f5&th=1&linkCode=ll2&tag=l0c39-21&linkId=72913be6c1b69ead9279bf7623bccdbb&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi caffè versatile e moderno? 🏠 Ho trovato questa macchina caffè B0CDCL53KW efficiente e moderna. Con Coca-Cola Zero hai bevande di qualità e relax!"
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
    },
    "abbigliamento-ciclismo": {
        name: "Abbigliamento Ciclismo",
        triggerKeywords: ["ciclismo", "bicicletta", "bici", "pedalare", "maglia ciclismo", "pantaloncini"],
        combos: [
            {
                product1: {
                    name: "Abbigliamento Ciclismo Professionale",
                    link: "https://www.amazon.it/dp/B08TBD3TDJ?&linkCode=ll2&tag=l0c39-21&linkId=auto&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ti piace pedalare? 🚴‍♂️ Ho trovato questo abbigliamento ciclismo che ti fa risparmiare tempo e soldi. Perfetto per le tue uscite in bici!"
            }
        ]
    },
    "abbigliamento-lavoro": {
        name: "Abbigliamento Lavoro",
        triggerKeywords: ["lavoro", "abbigliamento lavoro", "tuta lavoro", "scarpe sicurezza", "casco"],
        combos: [
            {
                product1: {
                    name: "Abbigliamento da Lavoro Professionale",
                    link: "https://www.amazon.it/dp/B0FQ69B1ZT?&linkCode=ll2&tag=l0c39-21&linkId=auto&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Lavori in sicurezza? 👷‍♂️ Questo abbigliamento da lavoro è perfetto per proteggerti. Con Coca-Cola Zero hai l'energia giusta!"
            }
        ]
    },
    "abbigliamento-serie-tv-film": {
        name: "Abbigliamento Serie TV & Film",
        triggerKeywords: ["serie tv", "film", "maglietta", "t-shirt", "merchandise", "fan"],
        combos: [
            {
                product1: {
                    name: "Merchandise Serie TV Popolare",
                    link: "https://www.amazon.it/dp/B0FSRZF8MJ?&linkCode=ll2&tag=l0c39-21&linkId=auto&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Sei un fan di serie TV? 📺 Ho trovato questa maglietta merchandise che è perfetta per te. Con Coca-Cola Zero guardi le tue serie preferite!"
            }
        ]
    },
    "arredamento-casa": {
        name: "Arredamento Casa",
        triggerKeywords: ["arredamento", "casa", "mobili", "divano", "sedia", "tavolo", "decorazione"],
        combos: [
            {
                product1: {
                    name: "Mobile Arredamento Moderno",
                    link: "https://www.amazon.it/dp/B0BG2XMTFC?&linkCode=ll2&tag=l0c39-21&linkId=auto&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi rinnovare la casa? 🏠 Questo mobile arredamento è perfetto per il tuo salotto. Con Coca-Cola Zero goditi il tuo nuovo spazio!"
            },
            {
                product1: {
                    name: "Granbest Copridivano Altamente Elasticizzato Moderno Jacquard",
                    link: "https://www.amazon.it/Granbest-copridivano-Elasticizzato-Elasticit%C3%A0-Protezione/dp/B08CD9CHQ6?pd_rd_w=zVPzd&content-id=amzn1.sym.4dca35fa-dfa3-4fcb-9ffe-1a5b1a54acf3&pf_rd_p=4dca35fa-dfa3-4fcb-9ffe-1a5b1a54acf3&pf_rd_r=TCQVCY99GWAMDGS5M2E7&pd_rd_wg=A4ktL&pd_rd_r=b489bd23-1890-4dc9-bd40-b77900e31ad6&pd_rd_i=B08CD9CHQ6&th=1&linkCode=ll2&tag=l0c39-21&linkId=3cb6925a36f120271b4a3991a895a0bc&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi proteggere il divano? 🛋️ Ho trovato questo copridivano elasticizzato che protegge da cani e animali. Con Coca-Cola Zero hai casa protetta e relax!"
            }
        ]
    },
    "benessere": {
        name: "Benessere & Cura Personale",
        triggerKeywords: ["benessere", "cura personale", "salute", "skincare", "cosmetici", "beauty"],
        combos: [
            {
                product1: {
                    name: "Prodotto Cura Personale Premium",
                    link: "https://www.amazon.it/dp/B0CWRZC81F?&linkCode=ll2&tag=l0c39-21&linkId=auto&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ti prendi cura di te? 💆‍♀️ Questo prodotto cura personale è perfetto per la tua routine. Con Coca-Cola Zero ti senti fresco tutto il giorno!"
            }
        ]
    },
    "veicoli": {
        name: "Veicoli & Mobilità",
        triggerKeywords: ["bicicletta", "bici", "mobilità", "e-bike", "monopattino", "trasporti", "motocicletta", "moto", "scooter", "veicolo"],
        combos: [
            {
                product1: {
                    name: "Bicicletta o Accessorio Mobilità",
                    link: "https://www.amazon.it/dp/B08TBD3TDJ?&linkCode=ll2&tag=l0c39-21&linkId=auto&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ti muovi in bici? 🚴 Ho trovato questo accessorio mobilità che ti facilita gli spostamenti. Con Coca-Cola Zero hai l'energia giusta!"
            },
            {
                product1: {
                    name: "Maizjok Impermeabile Poliestere Motocicletta 245x105x125",
                    link: "https://www.amazon.it/Maizjok-Impermeabile-Poliestere-Motocicletta-245x105x125/dp/B0CGDN6WCY?th=1&linkCode=ll2&tag=l0c39-21&linkId=194e40235cd56b682a453b8d4ba9e8ea&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi proteggere la tua moto? 🏍️ Ho trovato questa copertura impermeabile che protegge da pioggia e polvere. Con Coca-Cola Zero hai la moto al sicuro e relax!"
            }
        ]
    },
    "profumi": {
        name: "Profumi & Bellezza",
        triggerKeywords: ["profumo", "fragranza", "profumo uomo", "profumo donna", "essenza", "parfum"],
        combos: [
            {
                product1: {
                    name: "Profumo Premium",
                    link: "https://www.amazon.it/dp/B000GIJ1XS?&linkCode=ll2&tag=l0c39-21&linkId=auto&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi un profumo speciale? 🌹 Ho trovato questo profumo premium che lascia il segno. Con Coca-Cola Zero sei sempre fresco!"
            }
        ]
    },
    "smartphone": {
        name: "Smartphone & Tech",
        triggerKeywords: ["smartphone", "telefono", "cellulare", "tech", "tecnologia", "gadget"],
        combos: [
            {
                product1: {
                    name: "Smartphone o Gadget Tech",
                    link: "https://www.amazon.it/dp/B0BV396HKH?&linkCode=ll2&tag=l0c39-21&linkId=auto&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ti piace la tecnologia? 📱 Ho trovato questo smartphone che è perfetto per te. Con Coca-Cola Zero sei sempre connesso!"
            },
            {
                product1: {
                    name: "2 Pacco Cuffie In Ear con Filo",
                    link: "https://www.amazon.it/dp/B0FCY3DZPM?psc=1&aref=2C5hrob8lk&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWxfcmlnaHRfc2hhcmVk&linkCode=ll2&tag=l0c39-21&linkId=d89db8dea6c3bf7e2c415db1874bb82d&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi cuffie economiche e di qualità? 🎧 Ho trovato questo pacco di 2 cuffie con filo perfetto per avere sempre un paio di riserva. Con Coca-Cola Zero hai musica e relax!"
            },
            {
                product1: {
                    name: "XIAOMI REDMI Buds 8 Active",
                    link: "https://www.amazon.it/XIAOMI-REDMI-Buds-Active-Semi/dp/B08N5WP9NP?th=1&linkCode=ll2&tag=l0c39-21&linkId=d7221ef5e61f3b85daa67b7b7199e402&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Vuoi auricolari wireless con bassi potenti? 🎵 Ho trovato i Redmi Buds 8 Active con driver titanio e 37h di autonomia. Con Coca-Cola Zero hai musica senza interruzioni!"
            },
            {
                product1: {
                    name: "Belkin SoundForm Mini Cuffie per Bambini",
                    link: "https://www.amazon.it/Belkin-SoundForm-adattatore-Microfono-compatibili/dp/B0FKGTRKHT?th=1&linkCode=ll2&tag=l0c39-21&linkId=8f29b88a56afcee375e5b4e3a3b64701&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Cerchi cuffie sicure per i bambini? 👶 Ho trovato le Belkin SoundForm con limite volume 85dB per proteggere l'udito. Con Coca-Cola Zero hai sicurezza e relax!"
            }
        ]
    },
    "fotografia": {
        name: "Studio Fotografico",
        triggerKeywords: ["fotografia", "foto", "camera", "obiettivo", "lente", "fotocamera", "shooting"],
        combos: [
            {
                product1: {
                    name: "Attrezzatura Fotografica",
                    link: "https://www.amazon.it/dp/B08G1JJVJJ?&linkCode=ll2&tag=l0c39-21&linkId=auto&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ti piace fare foto? 📸 Ho trovato questa attrezzatura fotografica che è perfetta per i tuoi scatti. Con Coca-Cola Zero catturi ogni momento!"
            }
        ]
    },
    "ufficio": {
        name: "Ufficio Produttivo",
        triggerKeywords: ["ufficio", "lavoro", "scrivania", "sedia ufficio", "produttività", "organizzazione"],
        combos: [
            {
                product1: {
                    name: "Attrezzatura Ufficio",
                    link: "https://www.amazon.it/dp/B0D9KJNTTK?&linkCode=ll2&tag=l0c39-21&linkId=auto&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Lavori in ufficio? 💼 Ho trovato questa attrezzatura che ti aiuta a essere più produttivo. Con Coca-Cola Zero hai l'energia giusta!"
            }
        ]
    },
    "viaggi": {
        name: "Viaggi & Vacanze",
        triggerKeywords: ["viaggio", "vacanza", "turismo", "valigia", "zaino", "destinazione"],
        combos: [
            {
                product1: {
                    name: "Accessorio Viaggio",
                    link: "https://www.amazon.it/dp/B0CY1XT58Z?&linkCode=ll2&tag=l0c39-21&linkId=auto&ref=_as_li_ss_tl"
                },
                product2: {
                    name: "Coca-Cola Zero Sugars - 6 x 1.5 Litre Bottles",
                    link: "https://www.amazon.it/dp/B07169TL6S?&linkCode=ll2&tag=l0c39-21&linkId=fee7f8828d1c6533484601a142d62f49&ref=_as_li_ss_tl"
                },
                message: "Ti piace viaggiare? ✈️ Ho trovato questo accessorio viaggio che è perfetto per le tue avventure. Con Coca-Cola Zero goditi ogni destinazione!"
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
