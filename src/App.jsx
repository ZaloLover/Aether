import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/layout/SideBar';
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


  const handleMouseEnter = () => {
    if (disableHoverSidebar) return; 


    if (sidebarTimerRef.current) {
      clearTimeout(sidebarTimerRef.current);
      sidebarTimerRef.current = null;
    }


    setSidebarOpen(true);
  };


  const handleMouseLeave = () => {
  
    sidebarTimerRef.current = setTimeout(() => {
      setSidebarOpen(false);
    }, 200);
  };


  useEffect(() => {

    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);

    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

 
    const savedHoverSetting = localStorage.getItem('disableHoverSidebar');
    if (savedHoverSetting) {
      setDisableHoverSidebar(savedHoverSetting === 'true');
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('disableHoverSidebar', disableHoverSidebar.toString());
  }, [disableHoverSidebar]);


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


  const [showFixedSettingsButton, setShowFixedSettingsButton] = useState(false);

 
  useEffect(() => {

    if (disableHoverSidebar && !sidebarOpen) {

      const timer = setTimeout(() => {
        setShowFixedSettingsButton(true);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setShowFixedSettingsButton(false);
    }
  }, [disableHoverSidebar, sidebarOpen]);


  {
    disableHoverSidebar && !sidebarOpen && showFixedSettingsButton && (
      <SettingsButton onClick={() => setShowSettings(true)} />
    )
  }

  return (
    <ChatProvider>
      <div className="app-container">
        {}
        {!disableHoverSidebar && (
          <div
            className="hover-zone"
            ref={hoverZoneRef}
            onMouseEnter={handleMouseEnter}
          ></div>
        )}

        {}
        <div
          className={`sidebar-container ${sidebarOpen ? 'sidebar-open' : ''}`}
          onMouseLeave={handleMouseLeave}
        >
          <Sidebar
            isOpen={true}
            disableHoverSidebar={disableHoverSidebar}
          />
        </div>

        {}
        <div className={`main-container ${sidebarOpen ? 'with-sidebar' : ''}`}>
          <MainContent />
        </div>

        {}
        {disableHoverSidebar && !sidebarOpen && (
          <SettingsButton onClick={() => setShowSettings(true)} />
        )}

        {}
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