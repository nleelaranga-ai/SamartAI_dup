const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 10000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ---------------- HEALTH ----------------
app.get("/", (req, res) => {
  res.send("🧠 SamartAI Brain Online");
});

// ---------------- CHAT ----------------
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Error:", data);
      return res
        .status(500)
        .json({ reply: "⚠️ AI temporarily unavailable." });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response from AI.";

    res.json({ reply });

  } catch (err) {
    console.error("❌ Backend Error:", err);
    res.status(500).json({
      reply: "⚠️ My brain is restarting. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SamartAI Backend running on port ${PORT}`);
});
