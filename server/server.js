// server/script.js
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // npm install node-fetch@3

const app = express();
app.use(bodyParser.json());

// Merr API key nga environment (GitHub Secrets ose .env)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ Mungon GEMINI_API_KEY! Shtoje si environment variable.");
  process.exit(1);
}

// Endpoint për të dërguar pyetje në Gemini API
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    // Thirrja te Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    // Përgjigjja e modelit
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "(No response)";
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error while contacting Gemini API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Nis serverin
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
