import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  active: boolean;
  churchId: number | null;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredData = async () => {
      const storedUser = authService.getUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    loadStoredData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await authService.login({ email, password });
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer login. Por favor, verifique suas credenciais.');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 