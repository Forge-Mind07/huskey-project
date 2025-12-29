// ---------- FETCH (Node < 18 support) ----------
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// ---------- CORE SETUP ----------
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

// ---------- ANALYTICS LAYER ----------

// Simple sentiment scoring
function simpleSentiment(text) {
  const negativeWords = [
    'sad', 'depressed', 'lonely', 'angry', 'hopeless',
    'tired', 'cry', 'anxious', 'stress'
  ];

  let score = 0;
  const lower = text.toLowerCase();

  negativeWords.forEach(word => {
    if (lower.includes(word)) score -= 1;
  });

  return score;
}

// Simple logistic regression (rule-based but structured)
function logisticRegression({ sentiment, length }) {
  const w0 = -0.5;
  const w1 = -1.2;
  const w2 = 0.01;

  const z = w0 + w1 * sentiment + w2 * length;
  const probability = 1 / (1 + Math.exp(-z));

  return {
    risk: probability > 0.6 ? 1 : 0,
    probability: Number(probability.toFixed(2))
  };
}

// ---------- CHAT API (MISTRAL via OLLAMA) ----------
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // ---- ANALYTICS ----
    const sentimentScore = simpleSentiment(message);

    const riskResult = logisticRegression({
      sentiment: sentimentScore,
      length: message.length
    });

    const systemPrompt =
      riskResult.risk === 1
        ? 'You are an empathetic emotional support assistant. Respond gently and supportively.'
        : 'You are a friendly and helpful assistant.';

    // ---- OLLAMA CALL ----
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt: `${systemPrompt}\n\nUser: ${message}\nAssistant:`,
        stream: false
      })
    });

    if (!ollamaRes.ok) {
      const errText = await ollamaRes.text();
      return res.status(500).json({
        error: 'Ollama error',
        details: errText
      });
    }

    const data = await ollamaRes.json();

    return res.json({
      reply: data.response,
      analytics: {
        sentiment: sentimentScore,
        risk: riskResult.risk,
        probability: riskResult.probability
      }
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({
      error: 'Server error',
      details: err.message
    });
  }
});

// ---------- STATIC FRONTEND (OPTIONAL) ----------
app.use(express.static(path.join(__dirname, 'public')));

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
