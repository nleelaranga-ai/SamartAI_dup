from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ---------------- CONFIG ----------------
genai.configure(api_key="YOUR_GEMINI_API_KEY")

# ---------------- SCHOLARSHIP DB ----------------
SCHOLARSHIPS_DB = [
    {
        "name": "Jagananna Vidya Deevena",
        "category": "All",
        "amount": "Full Fee",
        "tags": ["btech", "degree", "engineering"]
    },
    {
        "name": "Ambedkar Overseas",
        "category": "SC ST",
        "amount": "15 Lakhs",
        "tags": ["abroad", "masters"]
    }
]

def search_scholarships(query):
    results = []
    q = query.lower()
    for s in SCHOLARSHIPS_DB:
        if any(tag in q for tag in s["tags"]):
            results.append(s)
    return results

model = genai.GenerativeModel(
    model_name="gemini-pro",
    tools=[search_scholarships]
)

CHAT_SESSIONS = {}

# ---------------- HEALTH CHECK ----------------
@app.route("/", methods=["GET"])
def health():
    return "SamartAI backend running", 200

# ---------------- CHAT API ----------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message", "")
    user_id = data.get("user_id", "default")

    if user_id not in CHAT_SESSIONS:
        CHAT_SESSIONS[user_id] = model.start_chat(
            enable_automatic_function_calling=True
        )

    chat_session = CHAT_SESSIONS[user_id]

    try:
        response = chat_session.send_message(message)
        return jsonify({"reply": response.text})
    except Exception as e:
        return jsonify({"reply": "Error occurred"}), 500


if __name__ == "__main__":
    app.run(port=5000)
