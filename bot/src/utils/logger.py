import logging
import sys
from pathlib import Path

def setup_logger(name: str = "amazon_bot", level: int = logging.INFO) -> logging.Logger:
    """
    Configura il logger per il bot.
    
    Args:
        name: Nome del logger
        level: Livello di logging
        
    Returns:
        Logger configurato
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Evita duplicazione di handler
    if logger.handlers:
        return logger
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    
    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(formatter)
    
    logger.addHandler(console_handler)
    
    return logger
