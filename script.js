// Importar correctamente el módulo
import { GoogleGenAI } from './node_modules/@google/genai/index.js';

const ai = new GoogleGenAI({ 
    apiKey: "AIzaSyCUgLZXuMkAPbqt4pgnOjp8Qp-BIuUc1Cs" 
});

const chatMessages = document.getElementById('chatMessages');
const startButton = document.getElementById('startDebateBtn');

// ... el resto de tu código de funciones addMessage, showTyping, etc.


function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const senderName = sender === 'stephen' ? '🔬 Stephen Hawking' : '☸️ Dalai Lama';
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <div class="avatar">${sender === 'stephen' ? '🔬' : '☸️'}</div>
            <span>${senderName}</span>
        </div>
        <div class="message-content">${text}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping(sender) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = `typing-${sender}`;
    
    const senderName = sender === 'stephen' ? 'Stephen' : 'Dalai';
    
    typingDiv.innerHTML = `
        <span>${senderName} está escribiendo...</span>
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping(sender) {
    const typingElement = document.getElementById(`typing-${sender}`);
    if (typingElement) {
        typingElement.remove();
    }
}

async function simulateDebate() {
    startButton.innerHTML = '⏳ Debate en curso...';
    startButton.disabled = true;

    // Limpiar chat anterior
    chatMessages.innerHTML = '';

    try {
        // Mostrar mensaje inicial
        addMessage('system', '💬 El debate filosófico está comenzando...');

        // Simular typing para Stephen
        await new Promise(resolve => setTimeout(resolve, 1000));
        showTyping('stephen');
        await new Promise(resolve => setTimeout(resolve, 2000));
        hideTyping('stephen');

        // Obtener respuesta de Stephen
        const responseStephen = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{
                "role": "user",
                "parts": [{
                    "text": "Eres Stephen Hawking. Responde brevemente (máximo 100 caracteres): ¿Qué hay después de la muerte según tu visión científica?"
                }]
            }]
        });

        addMessage('stephen', responseStephen.text.substring(0, 100));

        // Simular typing para Dalai
        await new Promise(resolve => setTimeout(resolve, 1000));
        showTyping('dalai');
        await new Promise(resolve => setTimeout(resolve, 2000));
        hideTyping('dalai');

        // Obtener respuesta de Dalai
        const responseDalai = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{
                "role": "user",
                "parts": [{
                    "text": "Eres el Dalai Lama. Responde brevemente (máximo 100 caracteres): ¿Qué hay después de la muerte según tu visión espiritual?"
                }]
            }]
        });

        addMessage('dalai', responseDalai.text.substring(0, 100));

        // Réplica de Stephen
        await new Promise(resolve => setTimeout(resolve, 1000));
        showTyping('stephen');
        await new Promise(resolve => setTimeout(resolve, 2000));
        hideTyping('stephen');

        const replicaStephen = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{
                "role": "user",
                "parts": [{
                    "text": "Stephen Hawking, el Dalai Lama dice que hay vida después de la muerte. ¿Qué respondes desde tu perspectiva científica? (máximo 100 caracteres)"
                }]
            }]
        });

        addMessage('stephen', replicaStephen.text.substring(0, 100));

        // Réplica final de Dalai
        await new Promise(resolve => setTimeout(resolve, 1000));
        showTyping('dalai');
        await new Promise(resolve => setTimeout(resolve, 2000));
        hideTyping('dalai');

        const replicaDalai = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{
                "role": "user",
                "parts": [{
                    "text": "Dalai Lama, Stephen Hawking dice que no hay nada después de la muerte. ¿Cuál es tu reflexión final? (máximo 100 caracteres)"
                }]
            }]
        });

        addMessage('dalai', replicaDalai.text.substring(0, 100));
        addMessage('system', '🎯 Debate concluido. Haz clic en "Iniciar Debate" para otra conversación.');

    } catch (error) {
        addMessage('system', `❌ Error: ${error.message}`);
    } finally {
        startButton.innerHTML = '🎭 Iniciar Debate';
        startButton.disabled = false;
    }
}

startButton.addEventListener('click', simulateDebate);