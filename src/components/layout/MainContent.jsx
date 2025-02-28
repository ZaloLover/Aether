import React from 'react';
import ChatList from '../chat/ChatList';
import ChatInput from '../chat/ChatInput';
import { useChat } from '../../context/ChatContext';
import './MainContent.css';

const MainContent = () => {
  const { respondToMessage, isLoading, createNewChat } = useChat();

  const handleSendMessage = (message) => {
    respondToMessage(message);
  };
  
  const handleTitleClick = () => {
    createNewChat();
  };

  return (
    <div className="main-content">
      {/* Header */}
      <header className="main-header">
        <h1 
          className="app-title" 
          onClick={handleTitleClick}
          role="button"
          tabIndex={0}
          aria-label="Start a new chat"
          title="Start a new chat"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleTitleClick();
            }
          }}
        >
          Aether
        </h1>
      </header>
      
      {/* Chat area */}
      <div className="chat-area">
        <ChatList />
      </div>
      
      {/* Input area */}
      <div className="input-area">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default MainContent;