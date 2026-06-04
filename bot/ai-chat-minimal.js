// Minimal AI Chat - Simple and Stable

let chatOpen = false;

function toggleChat() {
    chatOpen = !chatOpen;
    const chatWindow = document.getElementById('ai-chat-window');
    const chatButton = document.getElementById('ai-chat-button');
    
    if (chatOpen) {
        chatWindow.classList.add('active');
        chatButton.classList.add('active');
        showWelcomeMessage();
    } else {
        chatWindow.classList.remove('active');
        chatButton.classList.remove('active');
    }
}

function showWelcomeMessage() {
    const messagesDiv = document.getElementById('chat-messages');
    messagesDiv.innerHTML = '';
    
    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'bot-message';
    welcomeMsg.innerHTML = '👋 Ciao! Sono l\'assistente Smart. Come posso aiutarti oggi?';
    messagesDiv.appendChild(welcomeMsg);
    
    const helpMsg = document.createElement('div');
    helpMsg.className = 'bot-message';
    helpMsg.innerHTML = 'Dimmi cosa cerchi e ti aiuterò a trovare i prodotti migliori per te.';
    messagesDiv.appendChild(helpMsg);
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    const messagesDiv = document.getElementById('chat-messages');
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'user-message';
    userMsg.textContent = message;
    messagesDiv.appendChild(userMsg);
    
    input.value = '';
    
    // Simple response based on keywords
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'bot-message';
        botMsg.innerHTML = getResponse(message);
        messagesDiv.appendChild(botMsg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 500);
    
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function getResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword matching
    if (lowerMessage.includes('ciao') || lowerMessage.includes('salve')) {
        return 'Ciao! Come posso aiutarti a trovare i prodotti giusti per te?';
    }
    
    if (lowerMessage.includes('grazie')) {
        return 'Prego! Sono qui per aiutarti. Hai bisogno di altro?';
    }
    
    if (lowerMessage.includes('prezzo') || lowerMessage.includes('costo')) {
        return 'I prezzi sono aggiornati su Amazon. Clicca sui prodotti per vedere il prezzo attuale.';
    }
    
    if (lowerMessage.includes('aiuto') || lowerMessage.includes('consiglio')) {
        return 'Naviga tra le categorie del sito o dimmi cosa cerchi, ti suggerirò i prodotti più adatti.';
    }
    
    if (lowerMessage.includes('offerta') || lowerMessage.includes('sconto')) {
        return 'Tutte le offerte sono visibili su Amazon. Controlla i link dei prodotti per vedere le promozioni attive.';
    }
    
    // Default response
    return 'Grazie per il messaggio! Esplora le categorie del sito per trovare prodotti di qualità. Se hai domande specifiche, sono qui per aiutarti.';
}

// Allow Enter key to send message
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
