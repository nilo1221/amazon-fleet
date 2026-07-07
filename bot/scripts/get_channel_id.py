#!/usr/bin/env python3
"""
Script per ottenere il Channel ID di un canale Telegram.
"""
import aiohttp
import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

async def get_channel_id(bot_token: str):
    """
    Ottiene la lista degli aggiornamenti per trovare il channel ID.
    
    Args:
        bot_token: Token del bot Telegram
    """
    url = f"https://api.telegram.org/bot{bot_token}/getUpdates"
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.json()
            
            if data.get("ok"):
                updates = data.get("result", [])
                
                if not updates:
                    print("Nessun aggiornamento trovato.")
                    print("1. Aggiungi il bot al canale come amministratore")
                    print("2. Invia un messaggio al canale")
                    print("3. Riesegua questo script")
                    return
                
                print("Aggiornamenti trovati:")
                for update in updates:
                    if "message" in update:
                        chat = update["message"]["chat"]
                        chat_id = chat["id"]
                        chat_type = chat.get("type", "unknown")
                        chat_title = chat.get("title", "N/A")
                        
                        print(f"\nChat ID: {chat_id}")
                        print(f"Tipo: {chat_type}")
                        print(f"Nome: {chat_title}")
                        
                        if chat_type in ["channel", "supergroup"]:
                            print(f"\n✅ Usa questo Channel ID: {chat_id}")
            else:
                print(f"Errore: {data.get('description')}")

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv("config/.env")
    
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        print("Errore: TELEGRAM_BOT_TOKEN non trovato in config/.env")
        sys.exit(1)
    
    asyncio.run(get_channel_id(token))
