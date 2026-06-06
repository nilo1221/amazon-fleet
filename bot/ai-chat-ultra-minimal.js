// Ultra Minimal Chat Bot - Just toggle and basic message
let chatOpen = false;

function toggleChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    const chatButton = document.getElementById('ai-chat-button');
    
    if (!chatWindow || !chatButton) return;
    
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        chatWindow.style.display = 'flex';
        chatButton.classList.add('active');
    } else {
        chatWindow.style.display = 'none';
        chatButton.classList.remove('active');
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    
    if (!input || !messages) return;
    
    const text = input.value.trim();
    if (!text) return;
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = text;
    messages.appendChild(userMsg);
    
    input.value = '';
    
    // Simple bot response
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot';
        botMsg.textContent = 'Grazie per il messaggio! Ti aiuterò a trovare i prodotti migliori.';
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
    }, 500);
    
    messages.scrollTop = messages.scrollHeight;
}

// Handle Enter key
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.id === 'chat-input') {
        sendMessage();
    }
});
