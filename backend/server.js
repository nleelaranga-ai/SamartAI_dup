const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

// 1. ALLOW ALL ORIGINS (Fixes CORS blocking)
app.use(cors({ origin: '*' })); 
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 2. LOGGING (So we can see requests in Render logs)
app.use((req, res, next) => {
  console.log(`📡 Incoming: ${req.method} ${req.url}`);
  next();
});

// 3. GEMINI SETUP (With error handling)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use 'gemini-1.5-flash' - it is the fastest and cheapest
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SCHOLARSHIP_DB = [
  { name: "Jagananna Vidya Deevena", details: "Full fee reimbursement for ITI, B.Tech, MBA. Income < 2.5L." },
  { name: "Jagananna Vasathi Deevena", details: "₹20,000/year for hostel/food. Income < 2.5L." },
  { name: "Ambedkar Overseas Vidya Nidhi", details: "₹15 Lakhs for SC/ST students studying abroad (Masters/PhD). Income < 6L." },
  { name: "Bharati Scheme", details: "₹20,000 for Brahmin students in B.Tech/Degree. Income < 3L." },
  { name: "Free Laptops Scheme", details: "Free laptop for Differently Abled professional students." },
  { name: "BOC Workers Scholarship", details: "₹20,000 for children of construction workers." }
];

// Health Check Route
app.get('/', (req, res) => {
  res.send('✅ SamartAI Brain is Online!');
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log("📩 User asked:", message);

    const prompt = `
      SYSTEM: You are SamartAI, a scholarship assistant.
      DATA: ${JSON.stringify(SCHOLARSHIP_DB)}
      USER: "${message}"
      INSTRUCTION: Answer based ONLY on the DATA. Be short and friendly. Use emojis.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("🤖 Reply generated successfully");
    res.json({ reply: text });

  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error);
    // Send the actual error to the frontend so we can see it
    res.status(500).json({ reply: `Error: ${error.message}` });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
