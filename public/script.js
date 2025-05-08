// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
let isTyping = false;

// Add message to chat
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        ${text}
        <div class="message-time">${time}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Send message handler
async function sendMessage() {
    const message = userInput.value.trim();
    
    if (message && !isTyping) {
        // Add user message to chat
        addMessage('user', message);
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        isTyping = true;
        sendButton.disabled = true; // Disable the button while processing
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            removeTypingIndicator();
            
            if (data.response) {
                addMessage('ai', data.response);
            } else {
                throw new Error('No response from AI');
            }
        } catch (error) {
            removeTypingIndicator();
            addMessage('ai', `Sorry, I encountered an error: ${error.message}`);
            console.error('API Error:', error);
        } finally {
            isTyping = false;
            sendButton.disabled = false; // Re-enable the button after processing
        }
    }
}
// Event listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
