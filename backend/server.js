import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 10000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ---------------- HEALTH ----------------
app.get("/", (req, res) => {
  res.send("🧠 SamartAI Gemini Backend Online");
});

// ---------------- CHAT ----------------
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "⚠️ Please ask a question." });
    }

    const prompt = `
You are SamartAI, an AI assistant helping Indian students find government scholarships.

RULES:
- Give clear, practical answers
- Prefer Indian government schemes
- Do NOT invent schemes
- Friendly tone, simple English

USER QUESTION:
${message}

ANSWER:
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("❌ Gemini API Error:", data.error);
      return res.json({
        reply: "⚠️ AI is temporarily unavailable. Please try again."
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response generated.";

    res.json({ reply });

  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.json({
      reply: "⚠️ Server error. Please try again."
    });
  }
});

// ---------------- START ----------------
app.listen(PORT, () => {
  console.log(`🚀 SamartAI Gemini backend running on port ${PORT}`);
});
