
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-secondary p-6 md:p-8 rounded-xl shadow-2xl border border-accent/50 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
