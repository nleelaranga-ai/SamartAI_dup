const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

// 1. GLOBAL MIDDLEWARE
// Allow all origins for the hackathon deployment
app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 2. AI CONFIGURATION
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using gemini-1.5-flash-001 for faster response times and stability
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

// 3. MEMORY STORAGE (Simple in-memory session tracking)
const chatSessions = {}; 

// 4. KNOWLEDGE BASE
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

// 5. ROUTES
app.get('/', (req, res) => res.send('🧠 SamartAI Brain Online - Connected to Gemini 1.5 Flash'));

app.post('/chat', async (req, res) => {
  try {
    const { message, userId = 'default' } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Please provide a message." });
    }

    // Initialize session if new
    if (!chatSessions[userId]) chatSessions[userId] = [];
    
    // Maintain a rolling history of 8 messages to prevent context overflow
    chatSessions[userId].push({ role: "user", content: message });
    if (chatSessions[userId].length > 8) chatSessions[userId].shift();

    const historyText = chatSessions[userId]
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    // Structured Prompt for the AI
    const prompt = `
      SYSTEM: You are SamartAI, a specialized scholarship counselor for the AI for Bharat initiative.
      
      MISSION: Provide clear, accessible information about government schemes to students.
      
      KNOWLEDGE BASE:
      ${JSON.stringify(SCHOLARSHIP_DB)}

      CHAT HISTORY:
      ${historyText}

      STRICT INSTRUCTIONS:
      1. Use HISTORY to track user caste/income if mentioned previously.
      2. If a query matches a scheme in the KNOWLEDGE BASE, provide the Name and specific Details.
      3. If no scheme matches, politely inform them and suggest general government resources.
      4. Use encouraging emojis and keep responses concise (max 4 sentences).
      
      USER: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const replyText = response.text();

    // Store AI response in history
    chatSessions[userId].push({ role: "ai", content: replyText });
    
    res.json({ reply: replyText });

  } catch (error) {
    console.error("❌ Backend AI Error:", error);
    res.status(500).json({ 
      reply: "⚠️ I'm processing heavy traffic. Please try again in a few seconds.",
      error: error.message 
    });
  }
});

// 6. SERVER START
// Port binding 0.0.0.0 is mandatory for Render/Cloud deployments
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SamartAI Backend running on port ${PORT}`);
});
