import { GoogleGenerativeAI } from "@google/generative-ai";

// In src/services/geminiService.js
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Validate API key presence
if (!API_KEY || API_KEY === "AIzaSyA2Us1EPJPjcddveJLMs3uep0xkfFkSDN0") {
  console.error("⚠️ Gemini API key is missing. Please set your API key.");
}

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Send messages to Gemini API and get a response
 * @param {Array} messages - Array of message objects with role and content
 * @returns {Object} - Gemini's response
 */
export const sendMessageToGemini = async (messages) => {
  try {
    console.log("Sending message to Gemini 1.5 Pro API...");
    
    // Use gemini-1.5-pro model specifically
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Format the conversation history for Gemini
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    console.log("Formatted messages for API:", JSON.stringify(formattedMessages, null, 2));
    
    // Use the chat API for Gemini 1.5 Pro
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      }
    });
    
    let result;
    // If there's conversation history, send it first
    if (formattedMessages.length > 1) {
      // Get the last message (current user query)
      const lastMessage = formattedMessages[formattedMessages.length - 1];
      
      // Send all previous messages as history
      for (let i = 0; i < formattedMessages.length - 1; i++) {
        const historyMsg = formattedMessages[i];
        await chat.sendMessage(historyMsg.parts[0].text);
      }
      
      // Send the final user message and get response
      result = await chat.sendMessage(lastMessage.parts[0].text);
    } else {
      // If there's only one message, just send it directly
      const singleMessage = formattedMessages[0];
      result = await chat.sendMessage(singleMessage.parts[0].text);
    }
    
    const responseText = result.response.text();
    console.log("Response received from Gemini 1.5 Pro");
    
    return {
      role: 'assistant',
      content: responseText,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error calling Gemini 1.5 Pro API:', error);
    
    // Return a more descriptive error message
    return {
      role: 'assistant',
      content: `I'm sorry, but I encountered an error connecting to the Gemini 1.5 Pro API. Error details: ${error.message}`,
      timestamp: new Date()
    };
  }
};