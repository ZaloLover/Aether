import React from 'react';
import './IconButton.css';

const IconButton = ({ 
  icon,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  title,
  className = '',
  ...props
}) => {
  const baseClass = 'icon-button';
  const variantClass = `${baseClass}--${variant}`;
  const sizeClass = `${baseClass}--${size}`;
  
  return (
    <button
      type="button"
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      title={title}
      aria-label={title}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;