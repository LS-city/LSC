import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useUsers } from '../hooks/useUsers';
import { User } from '../types';

interface AuthResult {
  success: boolean;
  message: string;
}

interface AuthContextType {
  user: User | null;
  // FIX: Reordered parameters to place required `role` before optional `password`.
  login: (username: string, role: 'user' | 'staff', password?: string, staffCode?: string) => Promise<AuthResult>;
  logout: () => void;
  // FIX: Reordered parameters to place required `role` before optional `password`.
  register: (username: string, role: 'user' | 'staff', password?: string, staffCode?: string) => Promise<AuthResult>;
  refreshUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const usersApi = useUsers();

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem('lsc-coin-user');
    if (loggedInUser) {
      const foundUser = usersApi.getUser(loggedInUser);
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, [usersApi]);

  // FIX: Reordered parameters to place required `role` before optional `password`.
  const login = async (username: string, role: 'user' | 'staff', password?: string, staffCode?: string): Promise<AuthResult> => {
    const result = await usersApi.login(username, role, password, staffCode);
    if (result.success) {
      const loggedInUser = usersApi.getUser(username);
      setUser(loggedInUser!);
      sessionStorage.setItem('lsc-coin-user', username);
    }
    return result;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('lsc-coin-user');
  };

  // FIX: Reordered parameters to place required `role` before optional `password`.
  const register = async (username: string, role: 'user' | 'staff', password?: string, staffCode?: string): Promise<AuthResult> => {
    const result = await usersApi.register(username, role, password, staffCode);
    if (result.success) {
      await login(username, role, password, staffCode);
    }
    return result;
  };

  const refreshUser = useCallback(() => {
    if (user) {
      const updatedUser = usersApi.getUser(user.username);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  }, [user, usersApi]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
