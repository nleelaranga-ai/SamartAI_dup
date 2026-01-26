import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 10000;
const HF_API_KEY = process.env.HF_API_KEY;

// ---------------- HEALTH ----------------
app.get("/", (req, res) => {
  res.send("🧠 SamartAI Brain Online");
});

// ---------------- CHAT ----------------
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/HuggingFaceH4/zephyr-7b-beta",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
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

    const data = await response.json();

    if (data.error) {
      console.error("❌ HF Error:", data);
      return res.json({
        reply: "⏳ AI is starting up. Please try again in a few seconds."
      });
    }

    const reply =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text.trim()
        : "⚠️ No response generated.";

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
