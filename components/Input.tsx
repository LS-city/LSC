
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">
        {label}
      </label>
      <input
        id={id}
        className="w-full bg-secondary border border-accent rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent placeholder-text-secondary/50"
        {...props}
      />
    </div>
  );
};

export default Input;
