const historyList = document.getElementById('historyList');
const chatBody = document.getElementById('chatBody');
const chatTitle = document.getElementById('chatTitle');
const chatSubtitle = document.getElementById('chatSubtitle');
const input = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
const newBtn = document.getElementById('newBtn');
const archiveAll = document.getElementById('archiveAll');
const clearAll = document.getElementById('clearAll');

let sessions = {}; 
let current = null;

function saveLocal() {
    localStorage.setItem('gc_sessions', JSON.stringify(sessions));
    localStorage.setItem('gc_current', current);
}

function loadLocal() {
    const s = localStorage.getItem('gc_sessions');
    sessions = s ? JSON.parse(s) : {};
    current = localStorage.getItem('gc_current') || createSession();
}

function createSession() {
    const id = Date.now().toString();
    sessions[id] = [];
    saveLocal();
    renderHistory();
    return id;
}

function renderHistory() {
    historyList.innerHTML = '';
    Object.keys(sessions).reverse().forEach(id => {
        const msgs = sessions[id];
        const title = msgs.length ? msgs[0].user.slice(0, 40) : 'New chat';
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
        <div class="h-main">
            <div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#06b6d4);display:flex;align-items:center;justify-content:center">💬</div>
            <div>
                <div class="h-title">${title}</div>
                <div class="h-sub">${msgs.length ? 'Messages: '+msgs.length : 'Empty'}</div>
            </div>
        </div>
        <div style="display:flex;gap:8px">
            <button class="btn" data-archive="${id}">📦</button>
            <button class="btn" data-delete="${id}">🗑️</button>
        </div>`;
        div.addEventListener('click', (e) => {
            if (e.target && (e.target.dataset.archive || e.target.dataset.delete)) return;
            openSession(id);
        });
        historyList.appendChild(div);
    });

    // attach handlers
    historyList.querySelectorAll('button[data-delete]').forEach(b => {
        b.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = b.dataset.delete;
            if (confirm('Fshi këtë bisedë?')) {
                delete sessions[id];
                if (current === id) current = Object.keys(sessions)[0] || createSession();
                saveLocal();
                renderHistory();
                renderChat();
            }
        });
    });

    historyList.querySelectorAll('button[data-archive]').forEach(b => {
        b.addEventListener('click', (e) => {
            e.stopPropagation();
            const el = e.target;
            el.textContent = '✅';
            el.disabled = true;
        });
    });
}

function openSession(id) {
    current = id;
    saveLocal();
    renderChat();
}

function renderChat() {
    chatBody.innerHTML = '';
    const msgs = sessions[current] || [];
    chatTitle.textContent = msgs.length ? (msgs[0].user.slice(0,30) || 'Chat') : 'New Chat';
    chatSubtitle.textContent = 'Gemini AI';
    msgs.forEach(m => {
        const div = document.createElement('div');
        div.className = 'msg ' + (m.role==='user'?'user':'bot');
        div.textContent = m.text;
        chatBody.appendChild(div);
    });
    chatBody.scrollTop = chatBody.scrollHeight;
}

async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    sessions[current].push({role:'user', text});
    renderChat();
    input.value='';

    const typing = document.createElement('div');
    typing.className='msg bot typing';
    typing.textContent = '...
