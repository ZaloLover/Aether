import React, { useState, useEffect, useRef } from 'react';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({ 
  isOpen, 
  title, 
  message, 
  confirmLabel = "Yes", 
  cancelLabel = "No", 
  showCheckbox = false,
  checkboxLabel = "Don't ask this again",
  onConfirm, 
  onCancel 
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    // Focus on dialog when opened for accessibility
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
    
    // Add ESC key handler
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(isChecked);
  };

  const handleCancel = () => {
    onCancel(isChecked);
  };

  return (
    <div className="dialog-overlay" onClick={handleCancel}>
      <div 
        className="dialog"
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="dialog-title">{title}</h3>}
        {message && <p className="dialog-message">{message}</p>}
        
        {showCheckbox && (
          <div className="dialog-checkbox">
            <label>
              <input 
                type="checkbox" 
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <span>{checkboxLabel}</span>
            </label>
          </div>
        )}
        
        <div className="dialog-buttons">
          <button 
            className="dialog-button dialog-button--cancel"
            onClick={handleCancel}
          >
            {cancelLabel}
          </button>
          <button 
            className="dialog-button dialog-button--confirm"
            onClick={handleConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;