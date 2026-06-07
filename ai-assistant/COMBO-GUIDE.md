# Guida alla Gestione delle Combo di Prodotti

## Struttura del File `product-combos.json`

Il file `product-combos.json` contiene tutte le combo di prodotti con link Amazon reali.

### Metadata
```json
"_metadata": {
  "version": "1.0",
  "lastUpdated": "2024-06-07",
  "description": "Combo di prodotti con link Amazon reali. I link devono includere il tag affiliate tag=l0c39-21",
  "affiliateTag": "tag=l0c39-21"
}
```

### Struttura di una Combo
```json
"combo-id": {
  "reason": "Spiegazione del perché questa combo ha senso",
  "mainProduct": "Nome del prodotto principale",
  "products": [
    {
      "name": "Nome prodotto 1",
      "category": "Categoria",
      "icon": "fa-icona",
      "link": "URL Amazon completo con tag affiliate"
    },
    {
      "name": "Nome prodotto 2",
      "category": "Categoria",
      "icon": "fa-icona",
      "link": "URL Amazon completo con tag affiliate"
    }
  ]
}
```

## Come Aggiungere Nuove Combo

### 1. Identificare il Prodotto Principale
Quando l'utente fornisce un nuovo prodotto con link Amazon, identifica:
- Il nome completo del prodotto
- La categoria di appartenenza
- L'icona Font Awesome appropriata

### 2. Creare l'ID della Combo
L'ID della combo deve essere unico e descrittivo:
- Formato: `nicchia-prodotto-principale`
- Esempio: `fitness-casa-elettrostimolatore-jenylu`

### 3. Aggiungere la Combo al File
Apri `ai-assistant/product-combos.json` e aggiungi la nuova combo nella sezione `combos`:

```json
"fitness-casa-nuovo-prodotto": {
  "reason": "Spiegazione del perché questa combo ha senso",
  "mainProduct": "Nome del nuovo prodotto",
  "products": [
    {
      "name": "Nome del nuovo prodotto",
      "category": "Fitness",
      "icon": "fa-dumbbell",
      "link": "https://www.amazon.it/...?tag=l0c39-21&..."
    },
    {
      "name": "Prodotto correlato 1",
      "category": "Fitness",
      "icon": "fa-running",
      "link": "https://www.amazon.it/...?tag=l0c39-21&..."
    },
    {
      "name": "Prodotto correlato 2",
      "category": "Fitness",
      "icon": "fa-tint",
      "link": "https://www.amazon.it/...?tag=l0c39-21&..."
    }
  ]
}
```

### 4. Aggiornare Metadata
Aggiorna la data in `_metadata.lastUpdated` quando aggiungi nuove combo.

## Regole Importanti

### Tag Affiliate
- **OBBLIGATORIO:** Tutti i link devono includere `tag=l0c39-21`
- Se un link non ha il tag, chiedi all'utente di aggiungerlo prima di inserirlo

### Link Placeholder
- I link con `#` sono placeholder e devono essere sostituiti con link Amazon reali
- Quando l'utente fornisce nuovi link, sostituisci i placeholder

### Categorie Supportate
- Fitness
- Tech
- Casa
- Benessere
- Lifestyle
- Moda
- Intrattenimento

### Icone Font Awesome
Usa le icone Font Awesome appropriate per ogni categoria:
- Fitness: `fa-dumbbell`, `fa-running`, `fa-bicycle`, `fa-heartbeat`, `fa-bolt`
- Tech: `fa-microchip`, `fa-mobile-alt`, `fa-headphones`, `fa-gamepad`
- Casa: `fa-couch`, `fa-utensils`, `fa-briefcase`, `fa-fan`
- Benessere: `fa-spa`, `fa-spray-can`
- Lifestyle: `fa-plane`, `fa-campground`, `fa-umbrella-beach`, `fa-paw`, `fa-leaf`
- Moda: `fa-briefcase`, `fa-gem`, `fa-female`, `fa-male`, `fa-film`
- Intrattenimento: `fa-compact-disc`, `fa-book`, `fa-dice-d20`

## Esempio Completo

### Scenario
L'utente fornisce un nuovo prodotto: "Smartwatch Fitness Tracker" con link Amazon completo.

### Passaggi
1. Identifica il prodotto principale: Smartwatch Fitness Tracker
2. Crea ID: `fitness-casa-smartwatch-fitness-tracker`
3. Trova prodotti correlati (es. cuffie, bottiglia acqua, tappetino yoga)
4. Aggiungi la combo al file

```json
"fitness-casa-smartwatch-fitness-tracker": {
  "reason": "Per monitorare completamente i tuoi allenamenti, abbina lo smartwatch con accessori essenziali",
  "mainProduct": "Smartwatch Fitness Tracker",
  "products": [
    {
      "name": "Smartwatch Fitness Tracker",
      "category": "Fitness",
      "icon": "fa-heartbeat",
      "link": "https://www.amazon.it/dp/XXXXX?tag=l0c39-21&..."
    },
    {
      "name": "Cuffie Bluetooth Sport",
      "category": "Tech",
      "icon": "fa-headphones",
      "link": "https://www.amazon.it/dp/YYYYY?tag=l0c39-21&..."
    },
    {
      "name": "Bottiglia Acqua Sport",
      "category": "Fitness",
      "icon": "fa-tint",
      "link": "https://www.amazon.it/dp/ZZZZZ?tag=l0c39-21&..."
    }
  ]
}
```

## Verifica
Dopo aver aggiunto una nuova combo:
1. Verifica che tutti i link includano `tag=l0c39-21`
2. Verifica che l'ID della combo sia unico
3. Aggiorna la data in `_metadata.lastUpdated`
4. Testa il bot per verificare che la combo appaia correttamente

## Snack & Bevande come Jolly
La categoria "Snack & Bevande" funge da jolly universale. Puoi aggiungere bevande/snack a qualsiasi combo:
- Fitness: Attrezzo + Bevanda (idratazione)
- Gaming: Periferica + Energy Drink
- Lifestyle: Prodotto + Snack (relax)

Esempio:
```json
"fitness-casa-tapis-roulant": {
  "reason": "Per un home gym completo, il tapis roulant si abbina perfettamente con bevande per idratazione",
  "mainProduct": "Tapis Roulant",
  "products": [
    {
      "name": "Tapis Roulant",
      "category": "Fitness",
      "icon": "fa-running",
      "link": "https://www.amazon.it/...?tag=l0c39-21&..."
    },
    {
      "name": "Energy Drink",
      "category": "Snack & Bevande",
      "icon": "fa-bolt",
      "link": "https://www.amazon.it/...?tag=l0c39-21&..."
    }
  ]
}
```
