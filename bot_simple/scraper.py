import requests
from bs4 import BeautifulSoup
import time
import re
from config import ANTI_BAN_DELAY, MAX_RETRIES

def clean_affiliate_params(url):
    """Rimuove parametri affiliati dall'URL per evitare click falsi."""
    # Parametri da rimuovere
    params_to_remove = ['tag=', 'linkId=', 'linkCode=', 'ref_=as_li_ss_tl', 'ref=', 'th=1']
    
    for param in params_to_remove:
        url = re.sub(r'[&?]' + param + r'[^&]*', '', url)
    
    # Rimuovi caratteri strani rimasti
    url = re.sub(r'[&?]+$', '', url)
    url = re.sub(r'[&?]+', '&', url)
    
    return url

def get_product_data(url):
    """
    Recupera prezzo e immagine da una pagina Amazon (senza generare click falsi).
    
    Args:
        url: URL del prodotto Amazon (con o senza tag affiliato)
        
    Returns:
        tuple: (prezzo, url_immagine) o (None, None) se errore
    """
    # Pulisci URL rimuovendo parametri affiliati
    clean_url = clean_affiliate_params(url)
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
    }
    
    # Retry mechanism con backoff esponenziale
    for attempt in range(MAX_RETRIES):
        try:
            # Anti-ban delay
            time.sleep(ANTI_BAN_DELAY)
            
            response = requests.get(clean_url, headers=headers, timeout=10)
            if response.status_code != 200:
                if attempt < MAX_RETRIES - 1:
                    print(f"⚠️ Retry {attempt + 1}/{MAX_RETRIES}: HTTP {response.status_code}")
                    time.sleep(2 ** attempt)
                    continue
                else:
                    print(f"❌ Errore HTTP {response.status_code}")
                    return None, None
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Recupero prezzo
            price = None
            price_selectors = [
                'span.a-price span.a-offscreen',
                'span.a-price-whole',
                '#priceblock_ourprice',
                '#priceblock_dealprice',
            ]
            
            for selector in price_selectors:
                price_tag = soup.select_one(selector)
                if price_tag:
                    price_text = price_tag.get_text(strip=True)
                    price = parse_price(price_text)
                    if price:
                        break
            
            # Recupero immagine
            img_url = None
            img_selectors = [
                '#landingImage',
                '#imgBlkFront',
                '#main-image',
                '.a-dynamic-image',
            ]
            
            for selector in img_selectors:
                img_tag = soup.select_one(selector)
                if img_tag and img_tag.get('src'):
                    img_url = img_tag['src']
                    break
            
            return price, img_url
            
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
            if attempt < MAX_RETRIES - 1:
                print(f"⚠️ Retry {attempt + 1}/{MAX_RETRIES}: Errore connessione")
                time.sleep(2 ** attempt)
                continue
            else:
                print(f"❌ Errore scraping: {e}")
                return None, None
        except Exception as e:
            print(f"❌ Errore scraping: {e}")
            return None, None
    
    return None, None

def parse_price(price_text):
    """Converte testo prezzo in float."""
    try:
        cleaned = re.sub(r'[€\s]', '', price_text)
        cleaned = cleaned.replace(',', '.')
        cleaned = re.sub(r'\.(?=\d{3})', '', cleaned)
        return float(cleaned)
    except (ValueError, AttributeError):
        return None
