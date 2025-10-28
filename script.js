const chatDiv = document.getElementById('chat');
const input = document.getElementById('input');
const sendBtn = document.getElementById('send');

const sessionId = '1'; // mund ta ruash në localStorage për multi-turn

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ' + sender;
    msgDiv.textContent = text;
    chatDiv.appendChild(msgDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';

    try {
        const res = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, user_message: text })
        });
        const data = await res.json();
        addMessage(data.reply, 'bot');
    } catch(err) {
        addMessage('Error: ' + err.message, 'bot');
    }
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });
