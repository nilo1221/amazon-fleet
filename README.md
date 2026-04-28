# Amazon Fleet - Landing Page Shield Fleet

## 🚀 Progetto Completo
50 Landing page generate automaticamente per il programma Affiliato Amazon.

## 📁 Struttura
- `data/` - Template HTML e dati dei prodotti (JSON)
- `scripts/` - Script Python per generare le pagine
- `output/` - Le 50 landing page generate + Hub principale

## 🔄 Come Aggiornare
1. Modifica `data/sites.json` con nuovi prodotti/link
2. Lancia: `python3 scripts/generate.py && python3 scripts/generate_hub.py`
3. Commit e push su GitHub

## 🌐 Deployment
Il progetto è configurato per Vercel. Collega questo repo a Vercel.com per il deploy automatico.

## 📌 Amazon
Inserisci nel portale Affiliati Amazon solo l'URL del Hub (il dominio principale).
Tutte le sottocartelle sono coperte da un singolo sito web.

## 🔑 Tag Affiliato
Tutti i link usano il tag: `l0c39-21`
