import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { sendMessageToGeminiAlternate } from '../services/geminiServiceAlternate';

// Create the chat context
const ChatContext = createContext();

// Define the initial state
const initialState = {
  activeChat: {
    id: 'default',
    title: 'New Chat',
    messages: [],
    createdAt: new Date().toISOString()
  },
  // Store all chats in a single array, always maintaining their order
  chats: [],
  isLoading: false,
  error: null
};

// Load state from localStorage if available
const loadInitialState = () => {
  try {
    const savedState = localStorage.getItem('geminiChatState');
    const parsedState = savedState ? JSON.parse(savedState) : initialState;
    
    // Ensure we have the correct structure
    return {
      ...parsedState,
      // If chats doesn't exist yet, create it from chatHistory for backward compatibility
      chats: parsedState.chats || parsedState.chatHistory || []
    };
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return initialState;
  }
};

// Chat reducer function
function chatReducer(state, action) {
  let newState;
  
  switch (action.type) {
    case 'ADD_MESSAGE':
      newState = {
        ...state,
        activeChat: {
          ...state.activeChat,
          messages: [...state.activeChat.messages, action.payload],
          title: state.activeChat.messages.length === 0 && action.payload.role === 'user' 
            ? action.payload.content.substring(0, 30) + (action.payload.content.length > 30 ? '...' : '') 
            : state.activeChat.title
        },
        error: null
      };
      
      // Also update the chat in the chats array if it exists there
      if (state.chats.some(chat => chat.id === state.activeChat.id)) {
        newState.chats = state.chats.map(chat => 
          chat.id === state.activeChat.id 
            ? {...newState.activeChat} 
            : chat
        );
      }
      break;
    
    case 'SET_LOADING':
      newState = {
        ...state,
        isLoading: action.payload
      };
      break;
    
    case 'SET_ERROR':
      newState = {
        ...state,
        error: action.payload,
        isLoading: false
      };
      break;
    
    case 'CREATE_NEW_CHAT': {
      // If active chat has messages, add or update it in chats array
      let updatedChats = [...state.chats];
      
      if (state.activeChat.messages.length > 0) {
        // Update existing chat in the list if it exists
        if (updatedChats.some(chat => chat.id === state.activeChat.id)) {
          updatedChats = updatedChats.map(chat => 
            chat.id === state.activeChat.id ? { ...state.activeChat } : chat
          );
        } else {
          // Otherwise, add it to the beginning of chats array
          updatedChats = [{ ...state.activeChat }, ...updatedChats];
        }
      }
      
      newState = {
        ...state,
        activeChat: {
          id: Date.now().toString(),
          title: 'New Chat',
          messages: [],
          createdAt: new Date().toISOString()
        },
        chats: updatedChats,
        error: null
      };
      break;
    }
    
    case 'LOAD_CHAT': {
      // Update the current active chat in chats array if it has messages
      let updatedChats = [...state.chats];
      
      if (state.activeChat.messages.length > 0) {
        // Check if current active chat exists in the chats array
        if (updatedChats.some(chat => chat.id === state.activeChat.id)) {
          // Update it in place
          updatedChats = updatedChats.map(chat => 
            chat.id === state.activeChat.id ? { ...state.activeChat } : chat
          );
        } else {
          // Otherwise, add it to the beginning of chats array
          updatedChats = [{ ...state.activeChat }, ...updatedChats];
        }
      }
      
      // Find the chat we want to load
      const chatToLoad = updatedChats.find(chat => chat.id === action.payload.id);
      
      // Remove it from the chats array (we'll keep a copy as the active chat)
      updatedChats = updatedChats.filter(chat => chat.id !== action.payload.id);
      
      newState = {
        ...state,
        activeChat: chatToLoad || action.payload,
        chats: updatedChats,
        error: null
      };
      break;
    }
    
    case 'DELETE_CHAT':
      if (state.activeChat.id === action.payload) {
        // If deleting active chat, create a new empty chat
        newState = {
          ...state,
          activeChat: {
            id: Date.now().toString(),
            title: 'New Chat',
            messages: [],
            createdAt: new Date().toISOString()
          },
          chats: state.chats.filter(chat => chat.id !== action.payload),
          error: null
        };
      } else {
        // Just remove from chats array
        newState = {
          ...state,
          chats: state.chats.filter(chat => chat.id !== action.payload)
        };
      }
      break;
    
    case 'RENAME_CHAT':
      if (state.activeChat.id === action.payload.chatId) {
        // Rename active chat
        newState = {
          ...state,
          activeChat: {
            ...state.activeChat,
            title: action.payload.newTitle
          }
        };
        
        // Also update it in chats array if it exists there
        if (state.chats.some(chat => chat.id === action.payload.chatId)) {
          newState.chats = state.chats.map(chat => 
            chat.id === action.payload.chatId 
              ? { ...chat, title: action.payload.newTitle } 
              : chat
          );
        }
      } else {
        // Just rename in chats array
        newState = {
          ...state,
          chats: state.chats.map(chat => 
            chat.id === action.payload.chatId 
              ? { ...chat, title: action.payload.newTitle }
              : chat
          )
        };
      }
      break;
    
    default:
      return state;
  }
  
  // Save to localStorage
  localStorage.setItem('geminiChatState', JSON.stringify(newState));
  return newState;
}

// ChatProvider component
export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, loadInitialState());

  // Function to send a message to Gemini AI and get a response
  const respondToMessage = async (userMessage) => {
    // Create user message object
    const userMessageObj = { 
      role: 'user', 
      content: userMessage, 
      timestamp: new Date() 
    };
    
    // Add user message to state
    dispatch({ type: 'ADD_MESSAGE', payload: userMessageObj });
    
    // Set loading state
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Get all messages in the conversation for context
      const allMessages = [...state.activeChat.messages, userMessageObj];
      
      // Try primary implementation first
      try {
        const aiResponse = await sendMessageToGemini(allMessages);
        
        // Check if there was an error in the response
        if (aiResponse.content.includes("Error calling Gemini")) {
          console.log("Primary implementation failed, trying alternate...");
          const alternateResponse = await sendMessageToGeminiAlternate(allMessages);
          dispatch({ type: 'ADD_MESSAGE', payload: alternateResponse });
        } else {
          // Primary implementation worked
          dispatch({ type: 'ADD_MESSAGE', payload: aiResponse });
        }
      } catch (error) {
        // If primary implementation fails, try alternate
        console.error("Primary implementation failed with error:", error);
        console.log("Trying alternate implementation...");
        const alternateResponse = await sendMessageToGeminiAlternate(allMessages);
        dispatch({ type: 'ADD_MESSAGE', payload: alternateResponse });
      }
    } catch (error) {
      console.error('All Gemini API methods failed:', error);
      
      // Add error message as an assistant message
      dispatch({ 
        type: 'ADD_MESSAGE', 
        payload: {
          role: 'assistant',
          content: "I apologize, but I'm having trouble connecting to the Gemini 1.5 Pro API. Please verify your API key is correct and that you have access to the Gemini 1.5 Pro model.",
          timestamp: new Date()
        }
      });
      
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to get a response from Gemini 1.5 Pro. Please check your API key and model access.' 
      });
    } finally {
      // Set loading state back to false
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createNewChat = () => {
    dispatch({ type: 'CREATE_NEW_CHAT' });
  };

  const loadChat = (chat) => {
    dispatch({ type: 'LOAD_CHAT', payload: chat });
  };

  const deleteChat = (chatId) => {
    dispatch({ type: 'DELETE_CHAT', payload: chatId });
  };

  const renameChat = (chatId, newTitle) => {
    dispatch({ 
      type: 'RENAME_CHAT', 
      payload: { chatId, newTitle } 
    });
  };

  // Get all chats for the sidebar
  const getAllChats = () => {
    const result = [];
    
    // First add active chat if it has messages
    if (state.activeChat.messages.length > 0) {
      result.push(state.activeChat);
    }
    
    // Then add all other chats
    state.chats.forEach(chat => {
      if (chat.id !== state.activeChat.id) {
        result.push(chat);
      }
    });
    
    return result;
  };

  // Context value
  const contextValue = {
    ...state,
    sidebarChats: getAllChats(),
    respondToMessage,
    createNewChat,
    loadChat,
    deleteChat,
    renameChat
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook to use the chat context
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}