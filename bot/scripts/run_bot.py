#!/usr/bin/env python3
"""
Script principale per avviare il bot di monitoraggio prezzi Amazon.
"""
import sys
import os
import asyncio
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.monitor import PriceMonitor
from src.utils.logger import setup_logger

logger = setup_logger("run_bot")

async def main():
    """Funzione principale."""
    try:
        monitor = PriceMonitor()
        await monitor.start()
    except KeyboardInterrupt:
        logger.info("Bot interrotto dall'utente")
    except Exception as e:
        logger.error(f"Errore fatale: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
