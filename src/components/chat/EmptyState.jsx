import React from 'react';
import { Sparkles, Code, BookOpen, Brain, PenSquare } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ onSuggestionClick }) => {
  const suggestions = [
    {
      title: "Explain a Concept",
      description: "Get clear explanations on any topic",
      icon: <BookOpen size={24} />,
      example: "Explain quantum computing in simple terms"
    },
    {
      title: "Creative Writing",
      description: "Generate stories, scripts, or content",
      icon: <PenSquare size={24} />,
      example: "Write a short story about a robot discovering emotions"
    },
    {
      title: "Coding Help",
      description: "Get assistance with programming",
      icon: <Code size={24} />,
      example: "How do I implement a binary search tree in JavaScript?"
    },
    {
      title: "Brainstorming",
      description: "Generate ideas and solutions",
      icon: <Brain size={24} />,
      example: "Suggest 5 innovative features for a chat application"
    }
  ];

  return (
    <div className="empty-state">
      <div className="empty-state__header">
        <Sparkles className="empty-state__icon" size={28} />
        <h2 className="empty-state__title">How can I help you today?</h2>
        <p className="empty-state__description">
          I'm Aether, an AI assistant powered by advanced language models. I can help with a wide range of tasks.
        </p>
      </div>
      
      <div className="suggestion-cards">
        {suggestions.map((suggestion, index) => (
          <button 
            key={index}
            className="suggestion-card"
            onClick={() => onSuggestionClick(suggestion.example)}
          >
            <div className="suggestion-card__icon">
              {suggestion.icon}
            </div>
            <h3 className="suggestion-card__title">{suggestion.title}</h3>
            <p className="suggestion-card__description">{suggestion.description}</p>
            <div className="suggestion-card__example">{suggestion.example}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;