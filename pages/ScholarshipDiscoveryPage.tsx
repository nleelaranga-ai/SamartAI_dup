import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneButton } from '../components/MicrophoneButton';
import { ChatWindow } from '../components/ChatWindow';
import { useAppContext } from '../context/AppContext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sendMessageToAI } from '../services/geminiService';

// --- 1. CONFIGURATION ---
// ⚠️ IMPORTANT: Ensure your VITE_GEMINI_API_KEY is set in .env.local
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- 2. MASTER DATABASE (Inlined for reliability) ---
const SCHOLARSHIP_DB = [
  { name: "Jagananna Vidya Deevena", category: "All", details: "Full fee reimbursement for ITI, B.Tech, MBA. Income < 2.5L.", link: "https://jnanabhumi.ap.gov.in/" },
  { name: "Jagananna Vasathi Deevena", category: "All", details: "₹20,000/year for hostel & food. Income < 2.5L.", link: "https://jnanabhumi.ap.gov.in/" },
  { name: "Ambedkar Overseas Vidya Nidhi", category: "SC/ST", details: "₹15 Lakhs for SC/ST students studying abroad (Masters/PhD). Income < 6L.", link: "https://jnanabhumi.ap.gov.in/" },
  { name: "Bharati Scheme", category: "Brahmin", details: "₹20,000 for Brahmin students in B.Tech/Degree. Income < 3L.", link: "https://apadapter.ap.gov.in/" },
  { name: "Veda Vyasa Scheme", category: "Brahmin", details: "₹5,000/year for Vedic students.", link: "https://apadapter.ap.gov.in/" },
  { name: "Free Laptops Scheme", category: "Disabled", details: "Free laptop for Differently Abled professional students.", link: "https://apte.ap.gov.in/" },
  { name: "BOC Workers Scholarship", category: "Workers", details: "₹20,000 for children of construction workers.", link: "https://labour.ap.gov.in/" }
];

export const ScholarshipDiscoveryPage: React.FC = () => {
  const { messages, addMessage, isRecording, setIsRecording } = useAppContext();
  const [inputText, setInputText] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Initial Welcome
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        type: 'ai',
        text: `👋 **Namaste! I am SamartAI.**\n\nI can help you find scholarships.\n\nTry asking:\n✨ *"I am a Brahmin student"* \n✨ *"Scholarships for SC BTech"* \n✨ *"Free laptop scheme"*`
      });
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userQuery = inputText;
    
    setInputText('');
    addMessage({ type: 'user', text: userQuery });
    setIsLoadingAI(true);

    try {
      if (!API_KEY) throw new Error("API Key missing. Check .env.local");

      // --- 3. THE BRAIN LOGIC ---
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        SYSTEM: You are SamartAI, a helpful scholarship counselor.
        
        KNOWLEDGE BASE:
        ${JSON.stringify(SCHOLARSHIP_DB)}

        INSTRUCTIONS:
        1. Answer the user's question using ONLY the Knowledge Base above.
        2. If the user greets you, reply warmly.
        3. If you find a match, show the Name, Details, and Link.
        4. Use emojis (🎓, 💰, 🔗).
        5. Keep answers short (max 3 sentences).
        
        USER MESSAGE: "${userQuery}"
      `;

const reply = await sendMessageToAI(inputText);

addMessage({
  type: "ai",
  text: reply
});


      // Speak (Text-to-Speech)
      if (reply.length < 200) {
        const utterance = new SpeechSynthesisUtterance(reply.replace(/[*#]/g, ''));
        window.speechSynthesis.speak(utterance);
      }

    } catch (error: any) {
      console.error("AI Error:", error);
      let msg = "⚠️ Connection Error.";
      if (error.message.includes("404")) msg = "⚠️ Model Error. Please restart.";
      if (error.message.includes("429")) msg = "⚠️ Too many requests. Please wait.";
      addMessage({ type: 'ai', text: msg });
    } finally {
      setIsLoadingAI(false);
    }
  };

  // --- 4. VOICE LOGIC ---
  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Use Chrome for Voice.");

    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
        // handleSendMessage(); // Uncomment to auto-send
      };
      recognition.start();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-80px)] flex flex-col max-w-5xl">
      <div className="flex-grow overflow-hidden flex flex-col bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(79,70,229,0.15)] border border-white/10 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf]"></div>
        
        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
          <ChatWindow messages={messages} isLoadingAIResponse={isLoadingAI} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-gray-900/40 border-t border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3 bg-black/40 rounded-full p-2 border border-white/10 shadow-inner">
            <MicrophoneButton onToggleRecording={toggleRecording} isLoading={false} />
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-grow bg-transparent text-white px-3 py-2 focus:outline-none placeholder-gray-500 text-lg font-light tracking-wide"
            />
            
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoadingAI}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${(!inputText.trim() && !isLoadingAI) 
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:scale-110'
                }
              `}
            >
              {isLoadingAI ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <span className="text-xl">➤</span>}
            </button>
          </div>
          
           {/* Quick Chips */}
           <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar justify-center">
            {["💻 Free Laptop", "💰 BTech Fees", "🌍 Study Abroad", "📜 Caste Cert"].map((chip, idx) => (
              <button 
                key={idx}
                onClick={() => { setInputText(chip); }} 
                className="whitespace-nowrap px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-teal-300 transition-all hover:scale-105 backdrop-blur-sm"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
