// Chatbot Popup JavaScript
class ChatbotPopup {
    constructor() {
       
        this.API_KEYS = [
            'AIzaSyD4blWuAcs'
        ];
        this.API_URLS = [
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
        ];
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

    buildAvatarDataUrl(backgroundColor, label) {
        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>
  <circle cx='32' cy='32' r='32' fill='${backgroundColor}'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI, Tahoma, Geneva, Verdana, sans-serif' font-size='28' fill='white'>${label}</text>
  </svg>`;
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    getAvatarSrc(sender) {
        return sender === 'user'
            ? this.buildAvatarDataUrl('#667eea', 'U')
            : this.buildAvatarDataUrl('#764ba2', 'B');
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div class="chatbot-popup">
                <button class="chatbot-toggle" id="chatbot-toggle">
                    <i class="fas fa-comments"></i>
                </button>

                <div class="chatbot-container" id="chatbot-container">
                    <div class="chatbot-header">
                        <h3>🤖 CodeVerse AI Assistant</h3>
                        <div class="chatbot-header-buttons">
                            <button class="chatbot-new-chat" id="chatbot-new-chat" title="New Chat">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="chatbot-fullscreen" id="chatbot-fullscreen" title="Toggle Full Screen">
                                <i class="fas fa-expand"></i>
                            </button>
                            <button class="chatbot-close" id="chatbot-close">×</button>
                        </div>
                    </div>

                    <div class="chatbot-messages" id="chatbot-messages"></div>

                    <div class="chatbot-input-container">
                        <input type="text" class="chatbot-input" id="chatbot-input" placeholder="Ask me anything about coding...">
                        <button class="chatbot-send" id="chatbot-send">
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
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const fullscreen = document.getElementById('chatbot-fullscreen');
        const newChat = document.getElementById('chatbot-new-chat');
        const input = document.getElementById('chatbot-input');
        const send = document.getElementById('chatbot-send');
        const container = document.getElementById('chatbot-container');

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

        // Close on outside click (only when not in fullscreen)
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && !toggle.contains(e.target) && this.isOpen && !this.isFullscreen) {
                this.closeChatbot();
            }
        });

        // Handle escape key to exit fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFullscreen) {
                this.toggleFullscreen();
            }
        });
    }

    toggleChatbot() {
        const container = document.getElementById('chatbot-container');
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        const container = document.getElementById('chatbot-container');
        container.classList.add('active');
        this.isOpen = true;
        document.getElementById('chatbot-input').focus();
    }

    closeChatbot() {
        const container = document.getElementById('chatbot-container');
        container.classList.remove('active');
        this.isOpen = false;

        // Exit fullscreen when closing
        if (this.isFullscreen) {
            this.toggleFullscreen();
        }
    }

    toggleFullscreen() {
        const container = document.getElementById('chatbot-container');
        const fullscreenBtn = document.getElementById('chatbot-fullscreen');
        const icon = fullscreenBtn.querySelector('i');

        if (this.isFullscreen) {
            // Exit fullscreen
            container.classList.remove('fullscreen');
            icon.className = 'fas fa-expand';
            fullscreenBtn.title = 'Toggle Full Screen';
            this.isFullscreen = false;
        } else {
            // Enter fullscreen
            container.classList.add('fullscreen');
            icon.className = 'fas fa-compress';
            fullscreenBtn.title = 'Exit Full Screen';
            this.isFullscreen = true;
        }
    }

    startNewChat() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const input = document.getElementById('chatbot-input');
        
        // Clear all messages
        messagesContainer.innerHTML = '';
        
        // Clear input field
        input.value = '';
        
        // Add welcome message for new chat
        this.addWelcomeMessage();
        
        // Show notification
        this.showNotification('New chat started!');
    }

    addWelcomeMessage() {
        const welcomeMessage = `👋 Hello! I'm your CodeVerse AI Assistant. I can help you with:

• **Code explanations** and debugging
• **Programming concepts** and best practices
• **Code examples** in multiple languages
• **Algorithm explanations** and optimization
• **Web development** tips and tricks

Just ask me anything about coding! 🚀`;

        this.addMessage(welcomeMessage, 'bot');
    }

    async handleSend() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            const response = await this.generateResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error:', error);
            this.hideTypingIndicator();
            
            // Provide a fallback response based on the user's message
            const fallbackResponse = this.getFallbackResponse(message);
            this.addMessage(fallbackResponse, 'bot');
        }
    }

    async generateResponse(prompt) {
        console.log('🤖 Generating response for:', prompt);
        
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: `You are a helpful coding assistant. When providing code examples, always format them properly with syntax highlighting. Be concise but thorough. Here's the user's question: ${prompt}`
                        }
                    ]
                }
            ]
        };

        // Try each API key and endpoint combination
        for (let keyIndex = 0; keyIndex < this.API_KEYS.length; keyIndex++) {
            const apiKey = this.API_KEYS[keyIndex];
            console.log(`🔑 Trying API Key ${keyIndex + 1}/${this.API_KEYS.length}:`, apiKey.substring(0, 10) + '...');
            
            for (let urlIndex = 0; urlIndex < this.API_URLS.length; urlIndex++) {
                const apiUrl = this.API_URLS[urlIndex];
                console.log(`🌐 Trying API URL ${urlIndex + 1}/${this.API_URLS.length}:`, apiUrl);
                
                try {
                    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody)
                    });

                    console.log('📡 Response Status:', response.status);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error(`❌ API Error with ${apiUrl}:`, response.status, response.statusText);
                        console.error('❌ Error Details:', errorText);
                        
                        // If this is the last combination, throw the error
                        if (keyIndex === this.API_KEYS.length - 1 && urlIndex === this.API_URLS.length - 1) {
                            throw new Error(`All API combinations failed. Last error: ${response.status} - ${errorText}`);
                        }
                        continue; // Try next combination
                    }

                    const data = await response.json();
                    console.log('✅ API Response received:', data);
                    
                    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                        const responseText = data.candidates[0].content.parts[0].text;
                        console.log('🤖 AI Response:', responseText);
                        return this.formatResponse(responseText);
                    } else {
                        console.error('❌ Unexpected response format:', data);
                        if (keyIndex === this.API_KEYS.length - 1 && urlIndex === this.API_URLS.length - 1) {
                            throw new Error('Unexpected response format from API');
                        }
                        continue; // Try next combination
                    }
                } catch (error) {
                    console.error(`❌ Network Error with ${apiUrl}:`, error.message);
                    if (keyIndex === this.API_KEYS.length - 1 && urlIndex === this.API_URLS.length - 1) {
                        throw error;
                    }
                    continue; // Try next combination
                }
            }
        }
    }

    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Coding-specific responses
        if (lowerMessage.includes('python') || lowerMessage.includes('javascript') || lowerMessage.includes('java') || lowerMessage.includes('c++') || lowerMessage.includes('html') || lowerMessage.includes('css')) {
            return `I'd love to help with ${lowerMessage.match(/python|javascript|java|c\+\+|html|css/)?.[0] || 'programming'}! 🚀 While my AI service is temporarily unavailable, here are some general tips:

• **Check syntax** - Make sure all brackets, parentheses, and quotes are properly closed
• **Read error messages** - They often point to the exact line with the issue
• **Use console.log()** or **print()** to debug variable values
• **Break down complex problems** into smaller, manageable parts

What specific issue are you facing? I can provide more targeted help!`;
        }
        
        if (lowerMessage.includes('function') || lowerMessage.includes('method') || lowerMessage.includes('class')) {
            return `Great question about ${lowerMessage.match(/function|method|class/)?.[0] || 'programming concepts'}! 💡 Here's a general approach:

**For Functions:**
• Define clear parameters
• Use descriptive names
• Keep functions focused on one task
• Return meaningful values

**For Methods:**
• They belong to objects/classes
• Can access object properties
• Often modify object state

**For Classes:**
• Blueprint for creating objects
• Encapsulate data and behavior
• Use inheritance for code reuse

What specific language are you working with? I can provide more detailed examples!`;
        }
        
        if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('problem') || lowerMessage.includes('not working')) {
            return `I understand you're facing an issue! 🔧 Here's a systematic debugging approach:

1. **Read the error message** - It often tells you exactly what's wrong
2. **Check the line number** - Most errors point to specific lines
3. **Verify syntax** - Missing semicolons, brackets, or quotes
4. **Check variable names** - Typos in variable/function names
5. **Use debugging tools** - console.log(), debugger, or print statements

**Common issues:**
• Undefined variables
• Type mismatches
• Missing imports/modules
• Incorrect function calls

Can you share the specific error message or describe what's not working?`;
        }
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return 'Hello! 👋 I\'m your coding assistant! While my AI service is having connectivity issues, I\'m still here to help with:\n\n• **Code debugging** and problem-solving\n• **Programming concepts** and best practices\n• **Language-specific** help (Python, JavaScript, Java, C++, etc.)\n• **Web development** (HTML, CSS, JavaScript)\n• **Algorithm explanations** and optimization\n\nWhat coding challenge can I help you with today?';
        }
        
        if (lowerMessage.includes('code') || lowerMessage.includes('programming') || lowerMessage.includes('coding') || lowerMessage.includes('develop')) {
            return 'I\'d love to help with coding! 🚀 Here are some areas I can assist with:\n\n**Programming Languages:**\n• Python, JavaScript, Java, C++, HTML, CSS\n\n**Common Topics:**\n• Functions and methods\n• Data structures (arrays, objects, lists)\n• Control flow (loops, conditionals)\n• Object-oriented programming\n• Web development concepts\n\n**Problem-Solving:**\n• Debugging techniques\n• Code optimization\n• Best practices\n• Algorithm design\n\nWhat specific programming topic or problem would you like help with?';
        }
        
        return 'I\'m experiencing connectivity issues with my AI service, but I\'m still here to help! 💡\n\nI can assist with:\n• **Code debugging** and problem-solving\n• **Programming concepts** and explanations\n• **Language-specific** help and examples\n• **Web development** guidance\n• **Algorithm** and data structure questions\n\nWhat coding topic or problem can I help you with today?';
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
        const messagesContainer = document.getElementById('chatbot-messages');
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

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        this.isTyping = true;
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot';
        typingDiv.id = 'typing-indicator';

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
        const typingIndicator = document.getElementById('typing-indicator');
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

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatbotPopup();
}); 
