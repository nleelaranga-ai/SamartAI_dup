import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 10000;
const HF_API_KEY = process.env.HF_API_KEY;

// ---------------- HEALTH ----------------
app.get("/", (req, res) => {
  res.send("🧠 SamartAI Backend is Online");
});

// ---------------- CHAT ----------------
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "⚠️ Please send a message." });
    }

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `
You are SamartAI, an AI assistant helping Indian students find government scholarships.
Be concise, friendly, and practical. Use emojis.

User: ${message}
Assistant:
`,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.3,
            return_full_text: false
          }
        })
      }
    );

    const rawText = await response.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return res.json({
        reply: "⚠️ AI is warming up. Please try again in a moment."
      });
    }

    if (data.error) {
      return res.json({
        reply: "⏳ AI is starting up. Please try again in a few seconds."
      });
    }

    const reply =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text.trim()
        : "⚠️ I couldn’t generate a response right now.";

    res.json({ reply });

  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.json({
      reply: "⚠️ My brain is restarting. Please try again."
    });
  }
});

// ---------------- START ----------------
app.listen(PORT, () => {
  console.log(`🚀 SamartAI Backend running on port ${PORT}`);
});
