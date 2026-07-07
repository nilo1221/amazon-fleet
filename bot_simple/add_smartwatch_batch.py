#!/usr/bin/env python3
import sys
import os

# Aggiungi la directory del bot al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db import add_product

# Lista dei nuovi smartwatch da aggiungere
products = [
    {
        "asin": "B0F5BJ7NGL",
        "nome": "Blackview Smartwatch R1 Uomo Donna,Orologio Fitness Cardiofrequenzimetro 110+ Sportive/SpO2/Sonno/Contapassi, Notifiche Smart Watch Activity Tracker per iOS Android",
        "link": "https://www.amazon.it/dp/B0F5BJ7NGL?&linkCode=ll2&tag=l0c39-21&linkId=93a76c1d6c69f6e19942f6cb2c9928f6&ref_=as_li_ss_tl"
    },
    {
        "asin": "B0GQB6RPMW",
        "nome": "Smartwatch Orologio Bluetooth Contapassi Cardiofrequenzimetro Impermeabile IP68 per Android iOS",
        "link": "https://www.amazon.it/Smartwatch-Orologio-Bluetooth-Contapassi-Cardiofrequenzimetro/dp/B0GQB6RPMW?pd_rd_w=GGA8J&content-id=amzn1.sym.f96af5e8-edb1-4e92-a8cb-5aa09b1fe9d9&pf_rd_p=f96af5e8-edb1-4e92-a8cb-5aa09b1fe9d9&pf_rd_r=MTBX9K1JTNBSA1V4MR3P&pd_rd_wg=OteSt&pd_rd_r=38735571-1a00-438c-991c-7f6c85f786ec&pd_rd_i=B0GQB6RPMW&th=1&linkCode=ll2&tag=l0c39-21&linkId=e0bb12775c3af9596a1b8cdb80d3b30a&ref_=as_li_ss_tl"
    },
    {
        "asin": "B0F93CLKT5",
        "nome": "Smartwatch Fitness Tracker Uomo Donna Impermeabile IP68 Cardiofrequenzimetro Saturimetro Sonno",
        "link": "https://www.amazon.it/dp/B0F93CLKT5?pd_rd_i=B0F93CLKT5&pd_rd_w=UnvG5&content-id=amzn1.sym.1eb9f79a-a1f0-4047-9d3a-2c918f58aed5&pf_rd_p=1eb9f79a-a1f0-4047-9d3a-2c918f58aed5&pf_rd_r=5QHHE1679QNS4784DGK4&pd_rd_wg=6tJah&pd_rd_r=7950d824-50a0-4598-92eb-9cbd672ff170&aref=bpQgTpeLTH&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWw&th=1&linkCode=ll2&tag=l0c39-21&linkId=3639fd5cead065165040fe53a06bf598&ref_=as_li_ss_tl"
    },
    {
        "asin": "B0BL27BC6G",
        "nome": "RUIMEN Smartwatch Men Women Bluetooth Calls Pedometer Watch Android iOS Compatible Fitness Watch Sports Heart Rate Monitor Wrist Saturometer Waterproof IP68 Whatsapp Notifications",
        "link": "https://www.amazon.it/dp/B0BL27BC6G?th=1&linkCode=ll2&tag=l0c39-21&linkId=97041f1b28eaa3680b1b371e5df16966&ref_=as_li_ss_tl"
    }
]

print("🚀 Aggiunta batch di 4 smartwatch al database...\n")

added_count = 0
for product in products:
    try:
        if add_product(product['asin'], product['nome'], product['link']):
            added_count += 1
            print(f"✅ Aggiunto: {product['asin']}")
        else:
            print(f"⚠️ Già esistente: {product['asin']}")
    except Exception as e:
        print(f"❌ Errore {product['asin']}: {e}")

print(f"\n🎉 Totale prodotti aggiunti: {added_count}/{len(products)}")
