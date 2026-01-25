import { GoogleGenerativeAI } from "@google/genai";

// Ensure you have your API key in a .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const geminiService = {
  sendMessage: async (message: string) => {
    try {
      const result = await model.generateContent(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
      return "Sorry, I'm having trouble connecting to the AI right now.";
    }
  }
};
```

**Example usage in `ScholarshipDiscoveryPage.tsx`:**

```typescript
import { geminiService } from '../services/geminiService';

// Inside your component logic
const handleSendMessage = async (text: string) => {
  // ... existing logic to add user message ...
  
  setIsLoadingAIResponse(true);
  const aiResponse = await geminiService.sendMessage(text);
  
  addMessage({
    type: 'ai',
    text: aiResponse,
    // ... other message properties
  });
  setIsLoadingAIResponse(false);
};
```

### 2. **Add a Text-to-Speech (TTS) API**

To make your platform more accessible, especially for users with visual impairments or those who prefer auditory feedback, you can integrate a TTS API. The Web Speech API is a free, built-in option, but for higher quality, you might consider a cloud service.

**Quick Win (Web Speech API):**

You can add a simple helper function to speak the bot's responses.

```typescript
export const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Text-to-speech not supported in this browser.");
  }
};
