import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import SettingsDialog from './components/settings/SettingsDialog';
import SettingsButton from './components/ui/SettingsButton';
import { ChatProvider } from './context/ChatContext';
import './index.css';
import './styles/theme.css';
import './components/layout/HoverSidebar.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [disableHoverSidebar, setDisableHoverSidebar] = useState(false);
  const sidebarTimerRef = useRef(null);
  const hoverZoneRef = useRef(null);

  // Handle mouse entering hover zone
  const handleMouseEnter = () => {
    if (disableHoverSidebar) return; // Don't open if disabled

    // Clear any existing timer
    if (sidebarTimerRef.current) {
      clearTimeout(sidebarTimerRef.current);
      sidebarTimerRef.current = null;
    }

    // Open sidebar immediately
    setSidebarOpen(true);
  };

  // Handle mouse leaving the sidebar area
  const handleMouseLeave = () => {
    // Set a timer to close the sidebar after delay - reduced to 200ms
    sidebarTimerRef.current = setTimeout(() => {
      setSidebarOpen(false);
    }, 200);
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    // Load dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);

    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Load hover sidebar preference
    const savedHoverSetting = localStorage.getItem('disableHoverSidebar');
    if (savedHoverSetting) {
      setDisableHoverSidebar(savedHoverSetting === 'true');
    }
  }, []);

  // Save hover sidebar setting when changed
  useEffect(() => {
    localStorage.setItem('disableHoverSidebar', disableHoverSidebar.toString());
  }, [disableHoverSidebar]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());

    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Listen for settings toggle event
  useEffect(() => {
    const handleToggleSettings = () => {
      setShowSettings(prev => !prev);
    };

    window.addEventListener('toggle-settings', handleToggleSettings);

    return () => {
      window.removeEventListener('toggle-settings', handleToggleSettings);
      if (sidebarTimerRef.current) {
        clearTimeout(sidebarTimerRef.current);
      }
    };
  }, []);

  // Add this state below your other state variables
  const [showFixedSettingsButton, setShowFixedSettingsButton] = useState(false);

  // Add this effect after your other effects
  useEffect(() => {
    // When hover sidebar is disabled and sidebar is closed, 
    // show the fixed settings button with a slight delay
    if (disableHoverSidebar && !sidebarOpen) {
      // Small delay for smoother transition
      const timer = setTimeout(() => {
        setShowFixedSettingsButton(true);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setShowFixedSettingsButton(false);
    }
  }, [disableHoverSidebar, sidebarOpen]);

  // Then in the return statement, update the SettingsButton part:
  {
    disableHoverSidebar && !sidebarOpen && showFixedSettingsButton && (
      <SettingsButton onClick={() => setShowSettings(true)} />
    )
  }

  return (
    <ChatProvider>
      <div className="app-container">
        {/* Hover detection zone - only if not disabled */}
        {!disableHoverSidebar && (
          <div
            className="hover-zone"
            ref={hoverZoneRef}
            onMouseEnter={handleMouseEnter}
          ></div>
        )}

        {/* Sidebar with mouse leave detection */}
        <div
          className={`sidebar-container ${sidebarOpen ? 'sidebar-open' : ''}`}
          onMouseLeave={handleMouseLeave}
        >
          <Sidebar
            isOpen={true}
            disableHoverSidebar={disableHoverSidebar}
          />
        </div>

        {/* Main content */}
        <div className={`main-container ${sidebarOpen ? 'with-sidebar' : ''}`}>
          <MainContent />
        </div>

        {/* Fixed settings button - only visible when hover sidebar is disabled */}
        {disableHoverSidebar && !sidebarOpen && (
          <SettingsButton onClick={() => setShowSettings(true)} />
        )}

        {/* Settings dialog */}
        <SettingsDialog
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          disableHoverSidebar={disableHoverSidebar}
          onToggleHoverSidebar={() => setDisableHoverSidebar(!disableHoverSidebar)}
        />
      </div>
    </ChatProvider>
  );
}

export default App;