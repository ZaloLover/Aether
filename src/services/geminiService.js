import { GoogleGenerativeAI } from "@google/generative-ai";


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


if (!API_KEY || API_KEY === "AIzaSyA2Us1EPJPjcddveJLMs3uep0xkfFkSDN0") {
  console.error("⚠️ Gemini API key is missing. Please set your API key.");
}


const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * @param {Array} messages 
 * @returns {Object} 
 */
export const sendMessageToGemini = async (messages) => {
  try {
    console.log("Sending message to Gemini 1.5 Pro API...");
    
  
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
   
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    console.log("Formatted messages for API:", JSON.stringify(formattedMessages, null, 2));
    
 
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      }
    });
    
    let result;
  
    if (formattedMessages.length > 1) {

      const lastMessage = formattedMessages[formattedMessages.length - 1];
      
    
      for (let i = 0; i < formattedMessages.length - 1; i++) {
        const historyMsg = formattedMessages[i];
        await chat.sendMessage(historyMsg.parts[0].text);
      }
      
  
      result = await chat.sendMessage(lastMessage.parts[0].text);
    } else {

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
    

    return {
      role: 'assistant',
      content: `I'm sorry, but I encountered an error connecting to the Gemini 1.5 Pro API. Error details: ${error.message}`,
      timestamp: new Date()
    };
  }
};