const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

// 1. Allow any website to talk to this brain (CORS Fix)
app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 2. Initialize the AI Model
// We use 'gemini-1.5-flash' because it is fast and cheap
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 3. The Knowledge Base (The AI's "Memory")
const SCHOLARSHIP_DB = [
  { name: "Jagananna Vidya Deevena", details: "Full fee reimbursement for ITI, B.Tech, MBA, MCA. Income limit: < ₹2.5 Lakhs." },
  { name: "Jagananna Vasathi Deevena", details: "₹20,000/year for hostel & food expenses. Income limit: < ₹2.5 Lakhs." },
  { name: "Ambedkar Overseas Vidya Nidhi", details: "Financial aid of ₹15 Lakhs for SC/ST students studying Masters/PhD abroad. Income limit: < ₹6 Lakhs." },
  { name: "Bharati Scheme", details: "₹20,000 financial aid for Brahmin students in B.Tech, Degree, or Pharmacy. Income limit: < ₹3 Lakhs." },
  { name: "Free Laptops Scheme", details: "Free laptop for Differently Abled students in professional courses." },
  { name: "BOC Workers Scholarship", details: "₹20,000 scholarship for children of construction workers." }
];

// Health Check
app.get('/', (req, res) => {
  res.send('🧠 SamartAI Neural Core Online');
});

// 4. The Smart Chat Endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log("📩 User Input:", message);

    // This "System Prompt" tells the AI how to behave
    const prompt = `
      ROLE: You are SamartAI, a futuristic and empathetic scholarship assistant for Indian students.
      
      KNOWLEDGE BASE:
      ${JSON.stringify(SCHOLARSHIP_DB)}

      INSTRUCTIONS:
      1. Answer the user's question using ONLY the Knowledge Base above.
      2. If the user says "Hi" or "Hello", reply warmly (e.g., "Namaste! I am SamartAI. How can I help your education today?").
      3. If the user asks for a specific course (e.g., "BTech"), find matching schemes.
      4. Use emojis (🎓, 💰, 🚀) to make it look modern.
      5. Keep answers short (max 3 sentences).
      
      USER MESSAGE: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("❌ Brain Error:", error);
    res.status(500).json({ reply: "⚠️ My neural link is unstable. Please try again." });
  }
});

app.listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));
