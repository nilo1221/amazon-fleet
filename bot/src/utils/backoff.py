import asyncio
import logging
from typing import Callable, TypeVar, Coroutine

T = TypeVar('T')

logger = logging.getLogger(__name__)

async def exponential_backoff(
    func: Callable[..., Coroutine[T, None, T]],
    max_retries: int = 5,
    initial_delay: float = 1.0,
    max_delay: float = 60.0,
    backoff_factor: float = 2.0
) -> T:
    """
    Implementa exponential backoff per le chiamate asincrone.
    
    Args:
        func: Funzione asincrona da eseguire
        max_retries: Numero massimo di tentativi
        initial_delay: Delay iniziale in secondi
        max_delay: Delay massimo in secondi
        backoff_factor: Fattore di moltiplicazione per il delay
        
    Returns:
        Il risultato della funzione se ha successo
        
    Raises:
        L'ultima eccezione se tutti i tentativi falliscono
    """
    delay = initial_delay
    last_exception = None
    
    for attempt in range(max_retries):
        try:
            return await func()
        except Exception as e:
            last_exception = e
            logger.warning(f"Tentativo {attempt + 1}/{max_retries} fallito: {e}")
            
            if attempt < max_retries - 1:
                delay = min(delay * backoff_factor, max_delay)
                logger.info(f"Attesa di {delay:.2f} secondi prima del prossimo tentativo")
                await asyncio.sleep(delay)
    
    logger.error(f"Tutti i {max_retries} tentativi falliti")
    if last_exception:
        raise last_exception
    raise Exception("All retries failed without exception")
