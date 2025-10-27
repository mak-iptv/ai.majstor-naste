// server.js
import express from "express";
import fetch from "node-fetch"; // Node.js 20+ може и global fetch

const app = express();
app.use(express.json());

// Вземаме ключа от environment (GitHub Secrets или локално .env)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY не е зададен!");
  process.exit(1);
}

app.post("/api/gemini", async (req, res) => {
  try {
    const userPrompt = req.body.prompt;

    const response = await fetch("https://api.ai.google/v1/gemini:generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gemini-2.5",
        prompt: userPrompt
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Gemini proxy error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process
