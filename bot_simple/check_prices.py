#!/usr/bin/env python3
import sys
import os

# Aggiungi la directory del bot al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from scraper import get_product_data

# Link dei prodotti da controllare
products = [
    {
        "name": "Blackview Smartwatch R1",
        "link": "https://www.amazon.it/dp/B0F5BJ7NGL?&linkCode=ll2&tag=l0c39-21&linkId=93a76c1d6c69f6e19942f6cb2c9928f6&ref_=as_li_ss_tl"
    },
    {
        "name": "Smartwatch Bluetooth",
        "link": "https://www.amazon.it/Smartwatch-Orologio-Bluetooth-Contapassi-Cardiofrequenzimetro/dp/B0GQB6RPMW?pd_rd_w=GGA8J&content-id=amzn1.sym.f96af5e8-edb1-4e92-a8cb-5aa09b1fe9d9&pf_rd_p=f96af5e8-edb1-4e92-a8cb-5aa09b1fe9d9&pf_rd_r=MTBX9K1JTNBSA1V4MR3P&pd_rd_wg=OteSt&pd_rd_r=38735571-1a00-438c-991c-7f6c85f786ec&pd_rd_i=B0GQB6RPMW&th=1&linkCode=ll2&tag=l0c39-21&linkId=e0bb12775c3af9596a1b8cdb80d3b30a&ref_=as_li_ss_tl"
    },
    {
        "name": "Smartwatch Fitness Tracker",
        "link": "https://www.amazon.it/dp/B0F93CLKT5?pd_rd_i=B0F93CLKT5&pd_rd_w=UnvG5&content-id=amzn1.sym.1eb9f79a-a1f0-4047-9d3a-2c918f58aed5&pf_rd_p=1eb9f79a-a1f0-4047-9d3a-2c918f58aed5&pf_rd_r=5QHHE1679QNS4784DGK4&pd_rd_wg=6tJah&pd_rd_r=7950d824-50a0-4598-92eb-9cbd672ff170&aref=bpQgTpeLTH&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWw&th=1&linkCode=ll2&tag=l0c39-21&linkId=3639fd5cead065165040fe53a06bf598&ref_=as_li_ss_tl"
    },
    {
        "name": "RUIMEN Smartwatch",
        "link": "https://www.amazon.it/dp/B0BL27BC6G?th=1&linkCode=ll2&tag=l0c39-21&linkId=97041f1b28eaa3680b1b371e5df16966&ref_=as_li_ss_tl"
    }
]

print("🔍 Controllo prezzi prodotti smartwatch...\n")

for product in products:
    print(f"📦 {product['name']}")
    price, img = get_product_data(product['link'])
    if price:
        status = "✅ SOTTO SOGLIA (€40)" if price <= 40 else "❌ SOPRA SOGLIA (€40)"
        print(f"   💰 Prezzo: €{price:.2f}")
        print(f"   {status}")
    else:
        print(f"   ❌ Prezzo non trovato")
    print()

print("✅ Controllo completato")
