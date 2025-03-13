
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface Admin {
  id: string;
  username: string;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin credentials (in a real app, this would be in a database)
const DEFAULT_ADMIN = {
  id: '1',
  username: 'admin',
  password: 'admin123' // In a real app, this would be hashed
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const storedAdmin = localStorage.getItem('manga_admin');
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdmin(parsedAdmin);
      } catch (error) {
        console.error('Failed to parse stored admin data', error);
        localStorage.removeItem('manga_admin');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      const adminData = { id: DEFAULT_ADMIN.id, username: DEFAULT_ADMIN.username };
      setAdmin(adminData);
      localStorage.setItem('manga_admin', JSON.stringify(adminData));
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      setIsLoading(false);
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('manga_admin');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated: !!admin, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
