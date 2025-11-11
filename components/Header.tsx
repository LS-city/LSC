
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-secondary p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-highlight"
          >
            <path
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.125 13.563a.75.75 0 0 0-1.06 1.06l3.25 3.25a.75.75 0 0 0 1.06-1.06l-3.25-3.25ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0-3.75a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-1.5 0V5.25a.75.75 0 0 1 .75-.75Z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-text-primary">LSC Coin Wallet</h1>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-text-secondary hidden sm:block">Welcome, {user.username}</span>
            <Button onClick={logout} variant="secondary">Logout</Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
