import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 10000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ---------- INIT GEMINI ----------
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-pro"
});

// ---------- VERIFIED SCHOLARSHIP DATA ----------
const SCHOLARSHIPS = `
1. Jagananna Vidya Deevena (RTF)
   - Full tuition fee reimbursement
   - Courses: ITI, Polytechnic, Degree, BTech, MBA, MCA
   - Eligible: SC, ST, BC, EBC, Minority students

2. Jagananna Vasathi Deevena (MTF)
   - Hostel and food allowance
   - Eligible students in ITI, Polytechnic, Degree, Engineering

3. Ambedkar Overseas Vidya Nidhi
   - Financial assistance for Masters / PhD abroad
   - Eligible: SC / ST students only

4. Bharati Scheme
   - Financial aid for Brahmin students
   - Degree and Professional courses

5. Jagananna Vidya Kanuka
   - Free laptop or tablet
   - Eligible students in higher education
`;

// ---------- HEALTH ----------
app.get("/", (req, res) => {
  res.send("🧠 SamartAI Gemini Backend Online");
});

// ---------- CHAT ----------
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "⚠️ Please ask a question." });
    }

    const prompt = `
You are SamartAI, an AI assistant for Indian government scholarships.

STRICT RULES:
- Use ONLY the scholarship data below
- Do NOT invent schemes
- If none apply, explain clearly why
- Simple language, friendly tone
- Emojis allowed but minimal

SCHOLARSHIP DATA:
${SCHOLARSHIPS}

USER QUESTION:
${message}

FINAL ANSWER:
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini Error:", error);
    res.json({
      reply: "⚠️ AI is temporarily unavailable. Please try again."
    });
  }
});

// ---------- START ----------
app.listen(PORT, () => {
  console.log(`🚀 SamartAI Gemini backend running on port ${PORT}`);
});
