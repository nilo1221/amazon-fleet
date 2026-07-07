import aiohttp
import logging
from typing import Optional, Dict
from datetime import datetime
import hashlib
import hmac
import urllib.parse

logger = logging.getLogger(__name__)

class AmazonAPI:
    """Client per l'Amazon Product Advertising API (PA API)."""
    
    def __init__(
        self,
        access_key: str,
        secret_key: str,
        partner_tag: str,
        marketplace: str = "A1PA6795UKMFR9"  # Italia
    ):
        self.access_key = access_key
        self.secret_key = secret_key
        self.partner_tag = partner_tag
        self.marketplace = marketplace
        self.base_url = "https://webservices.amazon.com/paapi5/searchitems"
    
    async def get_product_price(self, asin: str) -> Optional[float]:
        """
        Recupera il prezzo attuale di un prodotto dato l'ASIN.
        
        Args:
            asin: Amazon Standard Identification Number
            
        Returns:
            Prezzo del prodotto o None se errore
        """
        try:
            async with aiohttp.ClientSession() as session:
                # Costruisci la richiesta PA API
                payload = {
                    "ItemIds": [asin],
                    "ItemIdType": "ASIN",
                    "Condition": "New",
                    "Resources": [
                        "Offers.Listings.Price"
                    ],
                    "PartnerTag": self.partner_tag,
                    "PartnerType": "Associates",
                    "Marketplace": self.marketplace
                }
                
                headers = {
                    "Content-Type": "application/json; charset=UTF-8",
                    "Host": "webservices.amazon.com",
                    "X-Amz-Date": datetime.utcnow().strftime('%Y%m%dT%H%M%SZ'),
                    "X-Amz-Target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems"
                }
                
                # Firma AWS Signature V4
                # Nota: Questa è una semplificazione. Per PA API v5 serve una firma completa
                # Per ora usiamo un approccio più semplice con requests standard
                
                async with session.post(
                    self.base_url,
                    json=payload,
                    headers=headers
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._extract_price(data)
                    else:
                        logger.error(f"Amazon API error: {response.status}")
                        return None
                        
        except Exception as e:
            logger.error(f"Errore nella chiamata Amazon API: {e}")
            return None
    
    def _extract_price(self, data: Dict) -> Optional[float]:
        """
        Estrae il prezzo dalla risposta dell'API.
        
        Args:
            data: Dati JSON dalla risposta API
            
        Returns:
            Prezzo o None
        """
        try:
            if "ItemsResult" in data and "Items" in data["ItemsResult"]:
                items = data["ItemsResult"]["Items"]
                if items and len(items) > 0:
                    item = items[0]
                    if "Offers" in item and "Listings" in item["Offers"]:
                        listings = item["Offers"]["Listings"]
                        if listings and len(listings) > 0:
                            listing = listings[0]
                            if "Price" in listing and "Amount" in listing["Price"]:
                                return float(listing["Price"]["Amount"])
            return None
        except Exception as e:
            logger.error(f"Errore nell'estrazione del prezzo: {e}")
            return None
    
    async def get_product_info(self, asin: str) -> Optional[Dict]:
        """
        Recupera informazioni complete su un prodotto.
        
        Args:
            asin: Amazon Standard Identification Number
            
        Returns:
            Dizionario con info prodotto o None
        """
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "ItemIds": [asin],
                    "ItemIdType": "ASIN",
                    "Condition": "New",
                    "Resources": [
                        "Images.Primary.Medium",
                        "ItemInfo.Title",
                        "Offers.Listings.Price"
                    ],
                    "PartnerTag": self.partner_tag,
                    "PartnerType": "Associates",
                    "Marketplace": self.marketplace
                }
                
                headers = {
                    "Content-Type": "application/json; charset=UTF-8",
                    "Host": "webservices.amazon.com",
                    "X-Amz-Date": datetime.utcnow().strftime('%Y%m%dT%H%M%SZ'),
                    "X-Amz-Target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems"
                }
                
                async with session.post(
                    self.base_url,
                    json=payload,
                    headers=headers
                ) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        logger.error(f"Amazon API error: {response.status}")
                        return None
                        
        except Exception as e:
            logger.error(f"Errore nella chiamata Amazon API: {e}")
            return None
