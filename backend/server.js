const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 10000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.send("🧠 SamartAI Brain Online");
});

// ---------------- CHAT ENDPOINT ----------------
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are SamartAI, an AI assistant that helps Indian students find government scholarships. Be concise, friendly, and practical. Use emojis when helpful."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.3
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenAI API Error:", data);
      return res.status(500).json({
        reply: "⚠️ My brain is temporarily unavailable. Please try again."
      });
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "⚠️ I could not generate a response.";

    res.json({ reply });

  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.status(500).json({
      reply: "⚠️ My brain is restarting. Please try again."
    });
  }
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`🚀 SamartAI Backend running on port ${PORT}`);
});
