// public/script.js
async function sendMessage(message) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    console.log("Bot reply:", data.reply);
    return data.reply;
  } catch (err) {
    console.error("Error:", err);
  }
}

// Shembull përdorimi
document.querySelector("#sendBtn").addEventListener("click", async () => {
  const message = document.querySelector("#messageInput").value;
  const reply = await sendMessage(message);
  document.querySelector("#chatBox").innerText += `\nBot: ${reply}`;
});
