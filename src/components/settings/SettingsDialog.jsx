import React from 'react';
import { X, Moon, Sun } from 'lucide-react';
import './SettingsDialog.css';

const SettingsDialog = ({ 
  isOpen, 
  onClose, 
  darkMode, 
  onToggleDarkMode,
  disableHoverSidebar,
  onToggleHoverSidebar
}) => {
  if (!isOpen) return null;

  // Stop propagation to prevent clicks inside the dialog from closing it
  const handleDialogClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-dialog" onClick={handleDialogClick}>
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button className="settings-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="settings-content">
          <div className="settings-section">
            <h3 className="settings-section-title">Appearance</h3>
            
            <div className="settings-option">
              <div className="settings-option-info">
                <span className="settings-option-label">Dark Mode</span>
                <span className="settings-option-description">Toggle dark and light theme</span>
              </div>
              
              <button 
                className={`theme-toggle ${darkMode ? 'theme-toggle--dark' : 'theme-toggle--light'}`} 
                onClick={onToggleDarkMode}
              >
                <span className="theme-toggle__icon theme-toggle__icon--sun">
                  <Sun size={16} />
                </span>
                <span className="theme-toggle__icon theme-toggle__icon--moon">
                  <Moon size={16} />
                </span>
                <span className="theme-toggle__slider"></span>
              </button>
            </div>
          </div>
          
          <div className="settings-section">
            <h3 className="settings-section-title">Interface</h3>
            
            <div className="settings-option">
              <div className="settings-option-info">
                <span className="settings-option-label">Disable Hover Sidebar</span>
                <span className="settings-option-description">Prevent sidebar from appearing when hovering</span>
              </div>
              
              <button 
                className={`theme-toggle ${disableHoverSidebar ? 'theme-toggle--dark' : 'theme-toggle--light'}`} 
                onClick={onToggleHoverSidebar}
                aria-label={disableHoverSidebar ? "Enable hover sidebar" : "Disable hover sidebar"}
              >
                <span className="theme-toggle__slider"></span>
              </button>
            </div>
          </div>
          
          <div className="settings-section">
            <h3 className="settings-section-title">About</h3>
            <p className="settings-about">
              Aether Chat v1.0.0<br />
              Minimalist AI assistant powered by advanced language models
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;