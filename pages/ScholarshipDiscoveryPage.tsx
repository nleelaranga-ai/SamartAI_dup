import React, { useEffect, useState } from 'react';
import { MicrophoneButton } from '../components/MicrophoneButton';
import { ChatWindow } from '../components/ChatWindow';
import { useAppContext } from '../context/AppContext';
import { scholarshipService } from '../services/scholarshipService';
import { USER_MESSAGES } from '../constants';

export const ScholarshipDiscoveryPage: React.FC = () => {
  const {
    selectedLanguage,
    messages,
    addMessage,
    isRecording,
    setIsRecording,
  } = useAppContext();
  
  const messagesText = USER_MESSAGES[selectedLanguage];
  const [inputText, setInputText] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Initial Welcome
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        type: 'ai',
        text: `👋 ${messagesText.chatPlaceholder}\n(Try: "I am a Brahmin student", "Scholarship for BTech", or "SC overseas")`
      });
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userQuery = inputText;
    setInputText(''); 
    
    // 1. Show User Input
    addMessage({ type: 'user', text: userQuery });
    setIsLoadingAI(true);

    try {
      // 2. Call Local Brain
      const results = await scholarshipService.searchScholarships(userQuery);
      
      // 3. Format Response
      if (results.length > 0) {
        // Create a summary message
        const resultText = results.map(s => 
          `🎓 **${s.name}**\n` +
          `💰 ${s.amount}\n` +
          `📂 ${s.category}\n` +
          `📝 ${s.description}\n` +
          `🔗 [Apply Here](${s.applicationLink})`
        ).join('\n\n────────────────\n\n');

        addMessage({
          type: 'ai',
          text: `I found ${results.length} schemes for you:\n\n${resultText}`
        });
      } else {
        addMessage({
          type: 'ai',
          text: messagesText.noScholarshipsFound
        });
      }
    } catch (error) {
      addMessage({ type: 'ai', text: messagesText.errorOccurred });
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
      recognition.onerror = () => setIsRecording(false);
      recognition.start();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-grow overflow-hidden flex flex-col bg-gray-900 rounded-2xl shadow-2xl border border-gray-700">
        <div className="flex-grow overflow-y-auto p-4">
          <ChatWindow messages={messages} isLoadingAIResponse={isLoadingAI} />
        </div>
        <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center gap-3">
          <MicrophoneButton onToggleRecording={toggleRecording} isLoading={false} />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={messagesText.chatPlaceholder}
            className="flex-grow bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-teal-500 focus:outline-none"
          />
          <button onClick={handleSendMessage} className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white shadow-lg">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};
