// Fixed Chatbot Implementation - Uses Backend API
class FixedChatbot {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.isFullscreen = false;
        this.messageHistory = [];

        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div class="fixed-chatbot-popup">
                <button class="fixed-chatbot-toggle" id="fixed-chatbot-toggle">
                    <i class="fas fa-comments"></i>
                </button>

                <div class="fixed-chatbot-container" id="fixed-chatbot-container">
                    <div class="fixed-chatbot-header">
                        <h3>🤖 AI Coding Assistant</h3>
                        <div class="fixed-chatbot-header-buttons">
                            <button class="fixed-chatbot-new-chat" id="fixed-chatbot-new-chat" title="New Chat">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="fixed-chatbot-fullscreen" id="fixed-chatbot-fullscreen" title="Toggle Full Screen">
                                <i class="fas fa-expand"></i>
                            </button>
                            <button class="fixed-chatbot-close" id="fixed-chatbot-close">×</button>
                        </div>
                    </div>

                    <div class="fixed-chatbot-messages" id="fixed-chatbot-messages"></div>

                    <div class="fixed-chatbot-input-container">
                        <input type="text" class="fixed-chatbot-input" id="fixed-chatbot-input" placeholder="Ask me anything about coding...">
                        <button class="fixed-chatbot-send" id="fixed-chatbot-send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);

        // Add Font Awesome for icons
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(fontAwesome);
        }
    }

    bindEvents() {
        const toggle = document.getElementById('fixed-chatbot-toggle');
        const close = document.getElementById('fixed-chatbot-close');
        const fullscreen = document.getElementById('fixed-chatbot-fullscreen');
        const newChat = document.getElementById('fixed-chatbot-new-chat');
        const input = document.getElementById('fixed-chatbot-input');
        const send = document.getElementById('fixed-chatbot-send');
        const container = document.getElementById('fixed-chatbot-container');

        toggle.addEventListener('click', () => this.toggleChatbot());
        close.addEventListener('click', () => this.closeChatbot());
        fullscreen.addEventListener('click', () => this.toggleFullscreen());
        newChat.addEventListener('click', () => this.startNewChat());
        send.addEventListener('click', () => this.handleSend());

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && !toggle.contains(e.target) && this.isOpen && !this.isFullscreen) {
                this.closeChatbot();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFullscreen) {
                this.toggleFullscreen();
            }
        });
    }

    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        const container = document.getElementById('fixed-chatbot-container');
        container.classList.add('active');
        this.isOpen = true;
        document.getElementById('fixed-chatbot-input').focus();
    }

    closeChatbot() {
        const container = document.getElementById('fixed-chatbot-container');
        container.classList.remove('active');
        this.isOpen = false;

        if (this.isFullscreen) {
            this.toggleFullscreen();
        }
    }

    toggleFullscreen() {
        const container = document.getElementById('fixed-chatbot-container');
        const fullscreenBtn = document.getElementById('fixed-chatbot-fullscreen');
        const icon = fullscreenBtn.querySelector('i');

        if (this.isFullscreen) {
            container.classList.remove('fullscreen');
            icon.className = 'fas fa-expand';
            fullscreenBtn.title = 'Toggle Full Screen';
            this.isFullscreen = false;
        } else {
            container.classList.add('fullscreen');
            icon.className = 'fas fa-compress';
            fullscreenBtn.title = 'Exit Full Screen';
            this.isFullscreen = true;
        }
    }

    startNewChat() {
        const messagesContainer = document.getElementById('fixed-chatbot-messages');
        const input = document.getElementById('fixed-chatbot-input');
        
        messagesContainer.innerHTML = '';
        input.value = '';
        this.messageHistory = [];
        this.addWelcomeMessage();
        this.showNotification('New chat started!');
    }

    addWelcomeMessage() {
        const welcomeMessage = `👋 Hello! I'm your AI coding assistant. I can help you with:

• **Code explanations** and debugging
• **Programming concepts** and best practices
• **Code examples** in multiple languages
• **Algorithm explanations** and optimization
• **Web development** tips and tricks

Just ask me anything about coding! 🚀`;

        this.addMessage(welcomeMessage, 'bot');
    }

    async handleSend() {
        const input = document.getElementById('fixed-chatbot-input');
        const message = input.value.trim();

        if (!message || this.isTyping) return;

        this.addMessage(message, 'user');
        this.messageHistory.push({ role: 'user', content: message });
        input.value = '';

        this.showTypingIndicator();

        try {
            const response = await this.callBackendAPI(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
            this.messageHistory.push({ role: 'bot', content: response });
        } catch (error) {
            console.error('Chatbot Error:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }

    async callBackendAPI(message) {
        console.log('🤖 Sending message to backend:', message);
        
        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            console.log('📡 Backend response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Backend Error ${response.status}: ${errorData.error || 'Unknown error'}`);
            }

            const data = await response.json();
            console.log('✅ Backend response received:', data);
            
            if (data.success && data.data && data.data.message) {
                return data.data.message;
            } else {
                throw new Error('Invalid response format from backend');
            }
        } catch (error) {
            console.error('❌ Backend API call failed:', error);
            throw error;
        }
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('fixed-chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `fixed-chatbot-message ${sender}`;

        const avatar = document.createElement('img');
        avatar.className = 'fixed-chatbot-avatar';
        avatar.src = this.getAvatarSrc(sender);
        avatar.alt = sender === 'user' ? 'User' : 'Bot';

        const messageContent = document.createElement('div');
        messageContent.className = 'fixed-chatbot-message-content';
        messageContent.innerHTML = content;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    getAvatarSrc(sender) {
        return sender === 'user'
            ? this.buildAvatarDataUrl('#667eea', 'U')
            : this.buildAvatarDataUrl('#764ba2', 'B');
    }

    buildAvatarDataUrl(backgroundColor, label) {
        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>
  <circle cx='32' cy='32' r='32' fill='${backgroundColor}'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI, Tahoma, Geneva, Verdana, sans-serif' font-size='28' fill='white'>${label}</text>
  </svg>`;
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    showTypingIndicator() {
        this.isTyping = true;
        const messagesContainer = document.getElementById('fixed-chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'fixed-chatbot-message bot';
        typingDiv.id = 'fixed-typing-indicator';

        const avatar = document.createElement('img');
        avatar.className = 'fixed-chatbot-avatar';
        avatar.src = this.getAvatarSrc('bot');
        avatar.alt = 'Bot';

        const typingContent = document.createElement('div');
        typingContent.className = 'fixed-chatbot-typing';
        typingContent.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

        typingDiv.appendChild(avatar);
        typingDiv.appendChild(typingContent);
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('fixed-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

// Initialize fixed chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FixedChatbot();
});
