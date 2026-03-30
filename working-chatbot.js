// Working Chatbot Implementation
class WorkingChatbot {
    constructor() {
        this.API_KEY = 'AIzaSyD4blWY';
        this.API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        this.isOpen = false;
        this.isTyping = false;
        this.isFullscreen = false;

        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div class="chatbot-popup">
                <button class="chatbot-toggle" id="working-chatbot-toggle">
                    <i class="fas fa-comments"></i>
                </button>

                <div class="chatbot-container" id="working-chatbot-container">
                    <div class="chatbot-header">
                        <h3>🤖 Working AI Assistant</h3>
                        <div class="chatbot-header-buttons">
                            <button class="chatbot-new-chat" id="working-chatbot-new-chat" title="New Chat">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="chatbot-fullscreen" id="working-chatbot-fullscreen" title="Toggle Full Screen">
                                <i class="fas fa-expand"></i>
                            </button>
                            <button class="chatbot-close" id="working-chatbot-close">×</button>
                        </div>
                    </div>

                    <div class="chatbot-messages" id="working-chatbot-messages"></div>

                    <div class="chatbot-input-container">
                        <input type="text" class="chatbot-input" id="working-chatbot-input" placeholder="Ask me anything about coding...">
                        <button class="chatbot-send" id="working-chatbot-send">
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
        const toggle = document.getElementById('working-chatbot-toggle');
        const close = document.getElementById('working-chatbot-close');
        const fullscreen = document.getElementById('working-chatbot-fullscreen');
        const newChat = document.getElementById('working-chatbot-new-chat');
        const input = document.getElementById('working-chatbot-input');
        const send = document.getElementById('working-chatbot-send');
        const container = document.getElementById('working-chatbot-container');

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
        const container = document.getElementById('working-chatbot-container');
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        const container = document.getElementById('working-chatbot-container');
        container.classList.add('active');
        this.isOpen = true;
        document.getElementById('working-chatbot-input').focus();
    }

    closeChatbot() {
        const container = document.getElementById('working-chatbot-container');
        container.classList.remove('active');
        this.isOpen = false;

        if (this.isFullscreen) {
            this.toggleFullscreen();
        }
    }

    toggleFullscreen() {
        const container = document.getElementById('working-chatbot-container');
        const fullscreenBtn = document.getElementById('working-chatbot-fullscreen');
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
        const messagesContainer = document.getElementById('working-chatbot-messages');
        const input = document.getElementById('working-chatbot-input');
        
        messagesContainer.innerHTML = '';
        input.value = '';
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
        const input = document.getElementById('working-chatbot-input');
        const message = input.value.trim();

        if (!message || this.isTyping) return;

        this.addMessage(message, 'user');
        input.value = '';

        this.showTypingIndicator();

        try {
            const response = await this.generateResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }

    async generateResponse(prompt) {
        console.log('🤖 Generating response for:', prompt);
        
        try {
            const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a helpful coding assistant. When providing code examples, always format them properly with syntax highlighting. Be concise but thorough. Here's the user's question: ${prompt}`
                        }]
                    }]
                })
            });

            console.log('📡 Response Status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API Error:', response.status, response.statusText);
                console.error('❌ Error Details:', errorText);
                throw new Error(`API Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ API Response received:', data);
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const responseText = data.candidates[0].content.parts[0].text;
                console.log('🤖 AI Response:', responseText);
                return this.formatResponse(responseText);
            } else {
                console.error('❌ Unexpected response format:', data);
                throw new Error('Unexpected response format from API');
            }
        } catch (error) {
            console.error('❌ Chatbot Error:', error);
            throw error;
        }
    }

    formatResponse(text) {
        // Convert markdown code blocks to HTML
        text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'text';
            return `<pre><code class="language-${language}">${this.escapeHtml(code.trim())}</code></pre>`;
        });

        // Convert inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Convert bold text
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Convert italic text
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Convert line breaks
        text = text.replace(/\n/g, '<br>');

        return text;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('working-chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;

        const avatar = document.createElement('img');
        avatar.className = 'chatbot-avatar';
        avatar.src = this.getAvatarSrc(sender);
        avatar.alt = sender === 'user' ? 'User' : 'Bot';

        const messageContent = document.createElement('div');
        messageContent.className = 'chatbot-message-content';
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
        const messagesContainer = document.getElementById('working-chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot';
        typingDiv.id = 'working-typing-indicator';

        const avatar = document.createElement('img');
        avatar.className = 'chatbot-avatar';
        avatar.src = this.getAvatarSrc('bot');
        avatar.alt = 'Bot';

        const typingContent = document.createElement('div');
        typingContent.className = 'chatbot-typing';
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
        const typingIndicator = document.getElementById('working-typing-indicator');
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

// Initialize working chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WorkingChatbot();
});
