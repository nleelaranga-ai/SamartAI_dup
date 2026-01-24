// backend/server.js
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 1. Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 2. THE KNOWLEDGE BASE (Lives on the Server now)
const SCHOLARSHIP_DB = [
  { name: "Jagananna Vidya Deevena", details: "Full fee reimbursement for ITI, B.Tech, MBA. Income < 2.5L." },
  { name: "Jagananna Vasathi Deevena", details: "₹20,000/year for hostel/food. Income < 2.5L." },
  { name: "Ambedkar Overseas Vidya Nidhi", details: "₹15 Lakhs for SC/ST students studying abroad (Masters/PhD). Income < 6L." },
  { name: "Bharati Scheme", details: "₹20,000 for Brahmin students in B.Tech/Degree. Income < 3L." },
  { name: "Free Laptops Scheme", details: "Free laptop for Differently Abled professional students." },
  { name: "BOC Workers Scholarship", details: "₹20,000 for children of construction workers." }
];

app.get('/', (req, res) => res.send('SamartAI Brain Online 🧠'));

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log("📩 User asked:", message);

    // 3. The "Super Prompt" (Injects Data dynamically)
    const prompt = `
      SYSTEM: You are SamartAI, a helpful scholarship assistant.
      
      KNOWLEDGE BASE:
      ${JSON.stringify(SCHOLARSHIP_DB)}

      INSTRUCTIONS:
      - Answer based ONLY on the Knowledge Base.
      - If found, use emojis (🎓, 💰).
      - If the user greets you, be polite.
      - Keep it short.

      USER: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ reply: "My brain is tired. Please try again." });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
