import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import StaffLogin from './components/StaffLogin';
import StaffRegister from './components/StaffRegister';

export type AuthView = 'login' | 'register' | 'staffLogin' | 'staffRegister';

const App: React.FC = () => {
  const { user } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');

  const renderAuthView = () => {
    switch(authView) {
      case 'login':
        return <Login setAuthView={setAuthView} />;
      case 'register':
        return <Register setAuthView={setAuthView} />;
      case 'staffLogin':
        return <StaffLogin setAuthView={setAuthView} />;
      case 'staffRegister':
        return <StaffRegister setAuthView={setAuthView} />;
      default:
        return <Login setAuthView={setAuthView} />;
    }
  }

  return (
    <div className="min-h-screen bg-primary font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {user ? (
          <Dashboard />
        ) : (
          <div className="max-w-md mx-auto mt-10">
            {renderAuthView()}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;