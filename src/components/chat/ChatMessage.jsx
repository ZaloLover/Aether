import React from 'react';
import { User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import TypingAnimation from './TypingAnimation';
import CopyButton from '../ui/CopyButton';
import './ChatMessage.css';

const ChatMessage = ({ message, isUser, isTyping = false }) => {
  return (
    <div className="message-container">
      {!isUser && (
        <div className="avatar aether-avatar">
          <span>A</span>
        </div>
      )}
      
      <div className={`message-content ${isUser ? 'user-message' : 'aether-message'}`}>
        <div className="message-header">
          <div className="message-sender">
            {isUser ? 'You' : 'Aether'}
          </div>
          
          {!isUser && (
            <CopyButton textToCopy={message.content} />
          )}
        </div>
        
        <div className="message-text">
          {isTyping ? (
            <TypingAnimation 
              text={message.content} 
              typingSpeed={10}
            />
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="avatar user-avatar">
          <User size={16} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;