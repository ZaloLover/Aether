import React, { useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import ChatHistoryItem from './ChatHistoryItem';
import Button from '../ui/Button';
import './Sidebar.css';

const Sidebar = ({ isOpen, disableHoverSidebar = false }) => {
  const { 
    activeChat, 
    sidebarChats,
    createNewChat, 
    loadChat,
    deleteChat,
    renameChat
  } = useChat();
  
  if (!isOpen) return null;

  return (
    <div className="sidebar">
      {/* New chat button */}
      <div className="sidebar-header">
        <Button 
          onClick={createNewChat}
          variant="primary"
          icon={<Plus size={16} />}
          fullWidth
        >
          New Chat
        </Button>
      </div>
      
      {/* Chat history */}
      <div className="chat-history">
        <h2 className="history-title">Chat History</h2>
        {sidebarChats && sidebarChats.length > 0 ? (
          <ul className="chat-list">
            {sidebarChats.map(chat => (
              <ChatHistoryItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChat.id}
                onSelect={() => {
                  if (chat.id !== activeChat.id) {
                    loadChat(chat);
                  }
                }}
                onDelete={deleteChat}
                onRename={renameChat}
              />
            ))}
          </ul>
        ) : (
          <div className="empty-history">No chats yet</div>
        )}
      </div>
      
      {/* Settings button - only if hover sidebar is enabled */}
      {!disableHoverSidebar && (
        <div className="sidebar-footer">
          <button 
            className="settings-button" 
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-settings'))}
          >
            <Settings size={16} className="settings-icon" />
            <span>Settings</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;