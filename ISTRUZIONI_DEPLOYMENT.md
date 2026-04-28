# 🚀 Istruzioni Finali - Deployment e Amazon

## 📋 PASSO 1: Deploy su Vercel

1. **Vai su [vercel.com](https://vercel.com)** e accedi con il tuo account GitHub
2. **Clicca su "Add New" → "Project"**
3. **Seleziona il repository `amazon-fleet`** dal tuo GitHub (nilo1221)
4. **Configura le impostazioni:**
   - Framework Preset: "Other"
   - Root Directory: `./`
   - Output Directory: `output` (già configurato in vercel.json)
5. **Clicca "Deploy"**

Vercel rileverà automaticamente il file `vercel.json` e configurerà tutto correttamente.

**Dopo il deploy:**
- Riceverai un URL tipo: `https://amazon-fleet.vercel.app`
- Questo è il tuo dominio principale da registrare su Amazon

---

## 📌 PASSO 2: Registrazione su Amazon Associates

1. **Vai su [affiliate-program.amazon.com](https://affiliate-program.amazon.com)**
2. **Accedi o registrati** con il tuo account Amazon
3. **Durante la registrazione:**
   - Inserisci il tuo sito web: `https://amazon-fleet.vercel.app` (o il tuo dominio personalizzato)
   - Seleziona "Content/Niche Site" come tipo di sito
   - Descrivi il sito come: "Guide all'acquisto per prodotti tech e lifestyle"

**IMPORTANTE:** Registra SOLO l'URL principale (l'Hub). Tutte le 50 landing page in `/site_1/`, `/site_2/`, ecc. sono coperte automaticamente.

---

## ⚠️ REGOLE AMAZON - DA RICORDARE

### 1. Periodo di Prova (6 Mesi / 3 Vendite)
- Hai **6 mesi di tempo** per generare **3 vendite qualificate**
- Se non riesci, il tuo account verrà chiuso
- Le vendite devono provenire da link affiliati con il tuo tag `l0c39-21`

### 2. Traffico da "Persone Strane"
- Amazon **NON accetta** acquisti da:
  - Familiari (parenti, coniugi, figli)
  - Amici stretti
  - Colleghi di lavoro
  - Persone che vivono nella stessa casa
- Il traffico deve essere organico da persone che non ti conoscono
- Amazon monitora gli IP e può rilevare acquisti sospetti

### 3. Limite di 50 URL
- Amazon permette fino a **50 URL per sito**
- Il nostro Hub con 50 sottopagine è perfetto perché conta come 1 sito
- Non registrare ogni landing page separatamente!

### 4. Comportamenti Vietati
- Non cliccare sui tuoi stessi link
- Non incentivare gli acquisti con offerte personali
- Non usare popup o ads aggressivi
- Non nascondere che sei un affiliato (è nella disclosure)

---

## 🔄 COME AGGIORNARE IL PROGETTO

### Per aggiungere nuovi prodotti o modificare link:

1. **Modifica il file `data/sites.json`**
   ```bash
   nano data/sites.json
   ```

2. **Rigenera le pagine:**
   ```bash
   python3 scripts/generate.py
   python3 scripts/generate_hub.py
   ```

3. **Push su GitHub:**
   ```bash
   git add .
   git commit -m "Aggiornamento prodotti"
   git push
   ```

4. **Vercel deploy automaticamente** le modifiche!

---

## 📊 ANALYTICS (Opzionale)

Per monitorare il traffico:

1. **Crea un account su [umami.is](https://umami.is)** (gratuito)
2. **Crea un nuovo website** e ottieni il "Website ID"
3. **Modifica `data/template.html`** alla riga 9:
   ```html
   <script async src="https://analytics.umami.is/script.js" data-website-id="IL_TUO_ID"></script>
   ```
4. **Rigenera e pusha** come sopra

---

## 🎯 STRATEGIE PER GENERARE VENDITE

1. **Condividi i link sui social** (Facebook, Instagram, TikTok)
2. **Crea contenuti video** che mostrano i prodotti
3. **Usa gruppi Facebook** di nicchia (es. gruppi di fitness, gaming, etc.)
4. **Partecipa a forum** (Reddit, Quora) lasciando link utili
5. **SEO**: Ottimizza i titoli e descrizioni per Google

**Ricorda:** Il traffico deve essere organico e da persone che non ti conoscono!

---

## ✅ CHECKLIST FINALE

- [ ] Deploy completato su Vercel
- [ ] URL principale registrato su Amazon Associates
- [ ] Tag affiliato `l0c39-21` presente in tutti i link
- [ ] Hub page accessibile e funzionante
- [ ] Tutte le 50 landing page testate
- [ ] Analytics configurato (opzionale)

---

## 🆘 SUPPORTO

Se hai problemi:
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Amazon Associates**: [affiliate-program.amazon.com/help](https://affiliate-program.amazon.com/help)

---

Buona fortuna con le vendite! 🚀
