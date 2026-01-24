const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' })); // Allow all connections
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- DEBUGGING: PRINT KEY STATUS ---
// This tells us if the server sees the key or not
if (!process.env.GEMINI_API_KEY) {
  console.log("⚠️ WARNING: GEMINI_API_KEY is missing from Environment Variables!");
} else {
  console.log("✅ GEMINI_API_KEY is present.");
}

// --- CONFIGURATION ---
// 👇 TEMPORARY FIX: Paste your key directly here to bypass the error
const API_KEY = process.env.GEMINI_API_KEY || "PASTE_YOUR_REAL_KEY_HERE"; 

const genAI = new GoogleGenerativeAI(API_KEY);
// We use the stable model version
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

// --- KNOWLEDGE BASE ---
const SCHOLARSHIP_DB = [
  { name: "Jagananna Vidya Deevena", details: "Full fee reimbursement for ITI, B.Tech, MBA. Income < 2.5L." },
  { name: "Jagananna Vasathi Deevena", details: "₹20,000/year for hostel & food. Income < 2.5L." },
  { name: "Ambedkar Overseas Vidya Nidhi", details: "₹15 Lakhs for SC/ST students studying abroad. Income < 6L." },
  { name: "NSP Post Matric", details: "Central scholarship for Minority students. Income < 2L." },
  { name: "Bharati Scheme", details: "₹20,000 for Brahmin students in B.Tech/Degree. Income < 3L." },
  { name: "Free Laptops Scheme", details: "Free laptop for Differently Abled students." }
];

// Memory Storage
const chatSessions = {}; 

app.get('/', (req, res) => res.send('✅ SamartAI Brain is Online & Key is Configured!'));

app.post('/chat', async (req, res) => {
  try {
    const { message, userId = 'default' } = req.body;
    console.log(`📩 User: ${message}`);

    // Memory Logic
    if (!chatSessions[userId]) chatSessions[userId] = [];
    chatSessions[userId].push({ role: "user", content: message });
    if (chatSessions[userId].length > 8) chatSessions[userId].shift();
    const history = chatSessions[userId].map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

    const prompt = `
      SYSTEM: You are SamartAI, a helpful scholarship assistant.
      DATA: ${JSON.stringify(SCHOLARSHIP_DB)}
      HISTORY: ${history}
      USER: "${message}"
      INSTRUCTION: Answer using the DATA. Be short and friendly.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    chatSessions[userId].push({ role: "ai", content: text });
    console.log("🤖 Reply sent.");
    res.json({ reply: text });

  } catch (error) {
    console.error("❌ Google API Error:", error);
    // Send the error details back so we can see them
    res.status(500).json({ reply: `Error: ${error.message}` });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
