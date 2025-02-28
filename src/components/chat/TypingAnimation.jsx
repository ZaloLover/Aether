import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const TypingAnimation = ({ text, typingSpeed = 10, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setIsComplete(false);
    
    if (!text) return;
    
    let currentIndex = 0;
    const totalLength = text.length;
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start typing
    intervalRef.current = setInterval(() => {
      if (currentIndex < totalLength) {
        // Add the next character
        setDisplayedText(prevText => prevText + text[currentIndex]);
        currentIndex++;
      } else {
        // Typing complete
        clearInterval(intervalRef.current);
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    }, typingSpeed);
    
    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, typingSpeed, onComplete]);
  
  return (
    <div className="typing-content">
      <ReactMarkdown>{displayedText}</ReactMarkdown>
      {!isComplete && <span className="cursor"></span>}
    </div>
  );
};

export default TypingAnimation;