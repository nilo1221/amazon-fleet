#!/usr/bin/env python3
import sys
import os

# Aggiungi la directory del bot al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db import add_product

# Aggiungi lo smartwatch RUIMEN al database
asin = "B0CQK8TZCF"
nome = "RUIMEN Smartwatch Uomo Donna Chiamate e Whatsapp Smart Watch Contapassi Cardiofrequenzimetro da polso Saturimetro Orologio Smart Fitness Sportivo Impermeabile per Android iOS Galassia"
link = "https://www.amazon.it/dp/B0CQK8TZCF?pd_rd_i=B0CQK8TZCF&pd_rd_w=MRPwB&content-id=amzn1.sym.1eb9f79a-a1f0-4047-9d3a-2c918f58aed5&pf_rd_p=1eb9f79a-a1f0-4047-9d3a-2c918f58aed5&pf_rd_r=SVVD98CF6JJ5Q8X6MHW2&pd_rd_wg=Vge4K&pd_rd_r=7c1e9420-54fe-4abc-b4bb-f1e3f145fc49&aref=O26XJbQXpk&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWw&th=1&linkCode=ll2&tag=l0c39-21&linkId=5dd7a984194d7851be49fc716daa38dd&ref=_as_li_ss_tl"

try:
    add_product(asin, nome, link)
    print(f"✅ Prodotto aggiunto con successo: {nome}")
    print(f"ASIN: {asin}")
except Exception as e:
    print(f"❌ Errore nell'aggiunta del prodotto: {e}")
