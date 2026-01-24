import React, { useEffect, useState, useRef } from 'react';
import { MicrophoneButton } from '../components/MicrophoneButton';
import { ChatWindow } from '../components/ChatWindow';
import { useAppContext } from '../context/AppContext';
import { USER_MESSAGES } from '../constants';
import { v4 as uuidv4 } from 'uuid';

// 👇 YOUR LIVE RENDER BACKEND URL
const BACKEND_URL = "https://samartai-dup.onrender.com"; 

export const ScholarshipDiscoveryPage: React.FC = () => {
  const { messages, addMessage, isRecording, setIsRecording, selectedLanguage } = useAppContext();
  const messagesText = USER_MESSAGES[selectedLanguage];
  const [inputText, setInputText] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  // 🔑 Generate a unique ID so the bot remembers THIS user
  const userId = useRef(uuidv4());

  // Initial Welcome
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        type: 'ai',
        text: `👋 **Namaste!**\n\nI am your Personal Scholarship Counselor.\n\nTell me about yourself:\n*"I am an SC student doing BTech with 1 Lakh income."*`
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
      console.log("📡 Connecting to Brain:", BACKEND_URL);

      // 🛑 OLD WAY (Local Filter) - DELETED
      // const results = await scholarshipService.searchScholarships(userQuery);

      // ✅ NEW WAY (Smart AI Backend)
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userQuery,
          userId: userId.current // Send ID for memory
        })
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);

      const data = await response.json();
      addMessage({ type: 'ai', text: data.reply });

    } catch (error) {
      console.error("Connection Error:", error);
      addMessage({ type: 'ai', text: "⚠️ Server is waking up (Cold Start). Please try again in 30s!" });
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Voice Logic
  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Use Chrome for Voice."); return; }

    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage === 'en' ? 'en-US' : (selectedLanguage === 'te' ? 'te-IN' : 'hi-IN');
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
      };
      recognition.start();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-80px)] flex flex-col max-w-5xl">
      
      {/* 🌟 GLASSMORPHISM CONTAINER */}
      <div className="flex-grow overflow-hidden flex flex-col bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(79,70,229,0.15)] border border-white/10 relative">
        
        {/* Neon Glow Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf]"></div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar space-y-4">
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
              placeholder={messagesText.chatPlaceholder}
              className="flex-grow bg-transparent text-white px-3 py-2 focus:outline-none placeholder-gray-500 text-lg font-light tracking-wide"
            />
            
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoadingAI}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${(!inputText.trim() && !isLoadingAI) 
                  ? 'bg-gray-800 text-gray-600' 
                  : 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:scale-110'
                }
              `}
            >
              {isLoadingAI ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
