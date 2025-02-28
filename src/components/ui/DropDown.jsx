import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './Dropdown.css';

const Dropdown = ({ 
  trigger, 
  items, 
  position = 'bottom-right',
  onSelect,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item) => {
    if (onSelect) onSelect(item);
    setIsOpen(false);
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Position classes
  const positionClass = `dropdown__menu--${position}`;

  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      <div className="dropdown__trigger" onClick={toggleDropdown}>
        {trigger || (
          <button className="dropdown__default-trigger">
            Options <ChevronDown size={16} />
          </button>
        )}
      </div>
      
      {isOpen && (
        <ul className={`dropdown__menu ${positionClass}`}>
          {items.map((item, index) => (
            <li key={index} className="dropdown__item">
              <button 
                className="dropdown__item-button" 
                onClick={() => handleSelect(item)}
                disabled={item.disabled}
              >
                {item.icon && <span className="dropdown__item-icon">{item.icon}</span>}
                <span className="dropdown__item-text">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;