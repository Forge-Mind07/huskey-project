// ---------- IMPORTS ----------
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

// node-fetch
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// ---------- APP INIT ----------
const app = express();
const PORT = process.env.PORT || 8090;

// ---------- MIDDLEWARE ----------
app.use(helmet());
app.use(cors());
app.use(express.json());

// ---------- STATIC FRONTEND ----------
app.use(express.static(path.join(__dirname, "public")));

// ---------- ANALYTICS ----------
function simpleSentiment(text) {
  const negativeWords = [
    "sad", "stress", "stressed", "tired",
    "lonely", "anxious", "depressed", "empty"
  ];
  return negativeWords.filter(word =>
    text.toLowerCase().includes(word)
  ).length;
}

function logisticRegression({ sentiment, length }) {
  const z = -1.5 + (0.8 * sentiment) + (0.002 * length);
  const probability = 1 / (1 + Math.exp(-z));
  return {
    risk: probability > 0.6 ? 1 : 0,
    probability
  };
}
app.get("/", (req, res) => {
  res.send("HUSKEY server is running");
});

// ---------- CHAT API ----------
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const sentiment = simpleSentiment(message);
    const riskResult = logisticRegression({
      sentiment,
      length: message.length
    });

    const systemPrompt =
      riskResult.risk === 1
        ? "You are an empathetic emotional support assistant. Be gentle, calm, and caring."
        : "You are a friendly and helpful assistant.";

    let reply = "Sorry, I'm having trouble responding right now.";

    try {
      const ollamaRes = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "mistral",
          prompt: `${systemPrompt}\n\nUser: ${message}\nAssistant:`,
          stream: false
        })
      });

      const data = await ollamaRes.json();
      reply = data.response || reply;

    } catch (ollamaErr) {
      console.error("⚠️ Ollama failed:", ollamaErr.message);
    }

    return res.json({ reply });

  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ---------- START SERVER ----------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
