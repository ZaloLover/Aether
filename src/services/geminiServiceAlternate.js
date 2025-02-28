import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment variable or use direct value for testing
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";

// Initialize the API
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Alternative implementation for Gemini 1.5 Pro
 * This uses the simpler generateContent approach
 */
export const sendMessageToGeminiAlternate = async (messages) => {
  try {
    // Create the model with specific version
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      }
    });
    
    // Convert messages array to Gemini content format
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    console.log("Using alternate method with generateContent");
    
    // Generate content with all messages
    const result = await model.generateContent({
      contents,
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });
    
    const response = result.response;
    const responseText = response.text();
    
    return {
      role: 'assistant',
      content: responseText,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error in alternate Gemini implementation:', error);
    
    return {
      role: 'assistant',
      content: `I'm sorry, but I encountered an error with the AI service. Technical details: ${error.message}`,
      timestamp: new Date()
    };
  }
};