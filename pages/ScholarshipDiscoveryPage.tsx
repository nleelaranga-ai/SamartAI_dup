import React, { useEffect, useState, useRef } from 'react';
import { MicrophoneButton } from '../components/MicrophoneButton';
import { ChatWindow } from '../components/ChatWindow';
import { useAppContext } from '../context/AppContext';
import { USER_MESSAGES } from '../constants';

// 👇 YOUR RENDER URL (Make sure this is correct!)
const BACKEND_URL = "https://samartai-backend.onrender.com"; 

export const ScholarshipDiscoveryPage: React.FC = () => {
  const { messages, addMessage, isRecording, setIsRecording, selectedLanguage } = useAppContext();
  const messagesText = USER_MESSAGES[selectedLanguage];
  const [inputText, setInputText] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Initial Welcome
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        type: 'ai',
        text: `👋 **Namaste!**\n\nI am connected to the Scholarship Database.\nTry asking:\n\n✨ *"I need a laptop scheme"* \n✨ *"Scholarships for BTech"*`
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
      // 📡 TALK TO RENDER BACKEND
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userQuery })
      });

      if (!response.ok) throw new Error("Server Error");

      const data = await response.json();
      addMessage({ type: 'ai', text: data.reply });

    } catch (error) {
      console.error("Error:", error);
      addMessage({ type: 'ai', text: "⚠️ Server is sleeping. Please wake it up on Render!" });
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
      <div className="flex-grow overflow-hidden flex flex-col bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 relative">
        
        {/* Neon Glow Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
          <ChatWindow messages={messages} isLoadingAIResponse={isLoadingAI} />
        </div>

        {/* 🚀 FUTURISTIC INPUT BAR */}
        <div className="p-4 bg-gray-800/40 border-t border-gray-700/30 backdrop-blur-md">
          <div className="flex items-center gap-3 bg-gray-900/60 rounded-2xl p-2 border border-gray-600/50 shadow-inner">
            
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
                p-3 rounded-xl transition-all duration-300 shadow-lg
                ${(!inputText.trim() && !isLoadingAI) 
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:scale-105 hover:shadow-indigo-500/40'
                }
              `}
            >
              {isLoadingAI ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-6 h-6 transform rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Quick Chips */}
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar justify-center">
            {["💻 Free Laptop", "💰 BTech Fees", "🌍 Study Abroad", "📜 Caste Cert"].map((chip, idx) => (
              <button 
                key={idx}
                onClick={() => { setInputText(chip); handleSendMessage(); }} 
                className="whitespace-nowrap px-4 py-1.5 bg-gray-800/80 hover:bg-gray-700 border border-gray-700 rounded-full text-xs text-teal-400 transition-all hover:scale-105"
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
