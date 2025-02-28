import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import EmptyState from './EmptyState';
import { useChat } from '../../context/ChatContext';
import { AlertCircle } from 'lucide-react';
import './ChatList.css';

const ChatList = () => {
  const { activeChat, isLoading, respondToMessage, error } = useChat();
  const messagesEndRef = useRef(null);
  const [newMessageId, setNewMessageId] = useState(null);
  const previousMessageCountRef = useRef(0);
  const previousActiveChatIdRef = useRef('');
  
  // Handler for suggestion clicks
  const handleSuggestionClick = (suggestion) => {
    respondToMessage(suggestion);
  };
  
  // Check for new messages and chat switches
  useEffect(() => {
    // If we switched to a different chat, no typing animation
    if (previousActiveChatIdRef.current !== activeChat.id) {
      setNewMessageId(null);
      previousActiveChatIdRef.current = activeChat.id;
      previousMessageCountRef.current = activeChat.messages.length;
      return;
    }
    
    // If we have more messages now than before, mark the last one as new
    if (activeChat.messages.length > previousMessageCountRef.current) {
      // Only animate if the last message is from the assistant
      const lastMessage = activeChat.messages[activeChat.messages.length - 1];
      if (lastMessage.role === 'assistant') {
        setNewMessageId(activeChat.messages.length - 1);
      }
    } else {
      // If the count hasn't increased, no animation
      setNewMessageId(null);
    }
    
    // Update the reference for next comparison
    previousMessageCountRef.current = activeChat.messages.length;
    previousActiveChatIdRef.current = activeChat.id;
  }, [activeChat.id, activeChat.messages.length]);
  
  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat.messages]);

  return (
    <div className="chat-list-container">
      {activeChat.messages.length === 0 ? (
        <div className="empty-state-container">
          <EmptyState onSuggestionClick={handleSuggestionClick} />
        </div>
      ) : (
        <div className="messages">
          {activeChat.messages.map((message, index) => (
            <ChatMessage 
              key={`${activeChat.id}-${index}`}
              message={message} 
              isUser={message.role === 'user'} 
              isTyping={index === newMessageId}
            />
          ))}
          
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          {isLoading && (
            <div className="loader">
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatList;