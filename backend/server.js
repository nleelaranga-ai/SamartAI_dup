const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Memory Storage
const chatSessions = {}; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🛠️ FIX: Changed model name to the specific stable version
// 'gemini-1.5-flash-001' is more reliable than 'gemini-1.5-flash'
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

const SCHOLARSHIP_DB = [
  { 
    name: "Jagananna Vidya Deevena (RTF)", 
    category: "All (SC/ST/BC/Kapu/Minority)", 
    details: "Full fee reimbursement for ITI, Polytechnic, Degree, B.Tech, MBA, MCA. Income < ₹2.5L." 
  },
  { 
    name: "Jagananna Vasathi Deevena (MTF)", 
    category: "All (SC/ST/BC/Kapu/Minority)", 
    details: "₹10,000 - ₹20,000/year for hostel & food. Degree/Engg students get ₹20K. Income < ₹2.5L." 
  },
  { 
    name: "Ambedkar Overseas Vidya Nidhi", 
    category: "SC/ST", 
    details: "Financial aid of up to ₹15 Lakhs for SC/ST students pursuing Masters/PhD abroad. Income < ₹6L. Needs Valid Passport." 
  },
  { 
    name: "NSP Post Matric Scholarship", 
    category: "Minority", 
    details: "Central scholarship for Minority community students (Muslim, Christian, etc.) from Class 11 to Ph.D. Income < ₹2L." 
  },
  { 
    name: "Bharati Scheme (Education)", 
    category: "Brahmin", 
    details: "Financial assistance for Brahmin students in B.Tech, Pharmacy, or Degree. Income < ₹3L." 
  },
  { 
    name: "Veda Vyasa Scheme", 
    category: "Brahmin", 
    details: "Annual financial assistance of ₹5,000+ for Vedic students. Income < ₹3L." 
  },
  { 
    name: "Bharati Overseas Scheme", 
    category: "Brahmin", 
    details: "Up to ₹20 Lakhs for Brahmin students studying Masters abroad. Income < ₹6L." 
  },
  { 
    name: "BOC Workers Children Scholarship", 
    category: "Construction Workers", 
    details: "Scholarship for children of construction workers registered with the Labour Dept. Income < ₹3L." 
  },
  { 
    name: "Free Laptops Scheme", 
    category: "Differently Abled", 
    details: "Free Laptop for visually, hearing, or orthopedically challenged students in professional courses. Income < ₹3L." 
  },
  { 
    name: "Motorized Three Wheelers", 
    category: "Differently Abled", 
    details: "Free motorized vehicle for orthopedically challenged persons for mobility. Income < ₹3L." 
  }
];

app.get('/', (req, res) => res.send('🧠 SamartAI Brain Online'));

app.post('/chat', async (req, res) => {
  try {
    const { message, userId = 'default' } = req.body;
    console.log(`📩 [${userId}] User:`, message);

    if (!chatSessions[userId]) chatSessions[userId] = [];
    chatSessions[userId].push({ role: "user", content: message });
    if (chatSessions[userId].length > 8) chatSessions[userId].shift();

    const historyText = chatSessions[userId].map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

    const prompt = `
      SYSTEM: You are SamartAI, a scholarship counselor.
      
      DATA:
      ${JSON.stringify(SCHOLARSHIP_DB)}

      CHAT HISTORY:
      ${historyText}

      INSTRUCTIONS:
      1. Use HISTORY to remember user context (Caste, Income).
      2. Match user needs to the DATA.
      3. Be short, helpful, and use emojis.

      USER: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const replyText = response.text();

    chatSessions[userId].push({ role: "ai", content: replyText });
    
    res.json({ reply: replyText });

  } catch (error) {
    console.error("❌ Brain Error:", error);
    // If Flash fails again, we will fall back to 'gemini-pro' in the next step
    res.status(500).json({ reply: "⚠️ My brain is updating. Please try again in 10 seconds." });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
