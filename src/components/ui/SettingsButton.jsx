import React from 'react';
import { Settings } from 'lucide-react';
import './SettingsButton.css';

const SettingsButton = ({ onClick }) => {
  return (
    <button className="settings-button-fixed" onClick={onClick} aria-label="Settings">
      <Settings size={20} />
    </button>
  );
};

export default SettingsButton;