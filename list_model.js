// list_models.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

(async ()=>{
  try {
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = await client.listModels(); // SDK provides a listModels helper
    console.log("AVAILABLE MODELS (trimmed):");
    models.forEach(m => {
      console.log('-', m.model || m.name || JSON.stringify(m).slice(0,80));
    });
  } catch (e) {
    console.error('ERROR listing models:', e);
  }
})();
