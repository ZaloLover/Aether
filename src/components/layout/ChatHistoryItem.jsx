import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, MoreVertical, Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import Dropdown from '../ui/DropDown';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import './ChatHistoryItem.css';

// Get delete confirmation preference from localStorage
const getDeleteConfirmationPreference = () => {
  try {
    return localStorage.getItem('skipDeleteConfirmation') === 'true';
  } catch (e) {
    return false;
  }
};

// Set delete confirmation preference to localStorage
const setDeleteConfirmationPreference = (skip) => {
  try {
    localStorage.setItem('skipDeleteConfirmation', skip ? 'true' : 'false');
  } catch (e) {
    console.error('Error saving delete confirmation preference:', e);
  }
};

const ChatHistoryItem = ({ chat, isActive, onSelect, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const inputRef = useRef(null);
  
  const lastMessage = chat.messages[chat.messages.length - 1] || {};
  
  useEffect(() => {
    // Update local title when chat title changes
    setTitle(chat.title);
  }, [chat.title]);
  
  useEffect(() => {
    // Focus the input when editing starts
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRenameClick = () => {
    setIsEditing(true);
  };

  const handleRenameSubmit = (e) => {
    e?.preventDefault();
    if (title.trim() && title !== chat.title) {
      onRename(chat.id, title);
    } else {
      // Reset to original title if empty or unchanged
      setTitle(chat.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setTitle(chat.title);
      setIsEditing(false);
    }
  };
  
  const handleDeleteClick = () => {
    // Check if we should skip confirmation
    const skipConfirmation = getDeleteConfirmationPreference();
    
    if (skipConfirmation) {
      // Delete without confirmation
      onDelete(chat.id);
    } else {
      // Show confirmation dialog
      setShowDeleteConfirm(true);
    }
  };
  
  const handleDeleteConfirm = (dontAskAgain) => {
    // Delete the chat
    onDelete(chat.id);
    
    // Save preference if "don't ask again" was checked
    if (dontAskAgain) {
      setDeleteConfirmationPreference(true);
    }
    
    setShowDeleteConfirm(false);
  };
  
  const handleDeleteCancel = (dontAskAgain) => {
    // If user selected "don't ask again" but clicked "No",
    // we don't save this preference
    setShowDeleteConfirm(false);
  };

  const menuItems = [
    { 
      icon: <Edit size={16} />, 
      label: 'Rename', 
      onClick: handleRenameClick
    },
    { 
      icon: <Trash size={16} />, 
      label: 'Delete', 
      onClick: handleDeleteClick
    }
  ];

  return (
    <>
      <li className="chat-history-item">
        {isEditing ? (
          <form onSubmit={handleRenameSubmit} className="chat-rename-form">
            <input
              ref={inputRef}
              type="text"
              className="chat-rename-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              maxLength={30}
            />
          </form>
        ) : (
          <div className={`chat-item-button ${isActive ? 'active' : ''}`}>
            <button 
              className="chat-select-area"
              onClick={() => onSelect(chat)}
            >
              <MessageSquare size={16} className="chat-icon" />
              <div className="chat-info">
                <span className="chat-title">{chat.title}</span>
                <span className="chat-date">
                  {lastMessage.timestamp ? format(new Date(lastMessage.timestamp), 'MMM d') : ''}
                </span>
              </div>
            </button>
            
            <div className="chat-actions">
              <button 
                className="chat-action-button" 
                onClick={handleRenameClick}
                aria-label="Rename chat"
                title="Rename"
              >
                <Edit size={14} />
              </button>
              <button 
                className="chat-action-button chat-action-button--delete" 
                onClick={handleDeleteClick}
                aria-label="Delete chat"
                title="Delete"
              >
                <Trash size={14} />
              </button>
            </div>
          </div>
        )}
      </li>
      
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        title="Delete Chat"
        message="Are you sure you want to delete this?"
        confirmLabel="Yes"
        cancelLabel="No"
        showCheckbox={true}
        checkboxLabel="Don't ask this again"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
};

export default ChatHistoryItem;