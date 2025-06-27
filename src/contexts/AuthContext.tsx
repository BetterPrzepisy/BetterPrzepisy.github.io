import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'polskie-przepisy-auth';
const USERS_STORAGE_KEY = 'polskie-przepisy-users';

// Admin account - in production this would come from a backend
const adminUser: (User & { password: string }) = {
  id: 'admin-001',
  username: 'p7poland',
  displayName: 'P7 Poland Admin',
  email: 'p7poland@gmail.com',
  password: 'qwertyasd1672#ffds@1',
  createdAt: '2024-01-01T00:00:00Z',
  bio: 'Administrator systemu BetterPrzepisy',
  role: 'admin',
  isVerified: true
};

// Initialize with admin user only
let mockUsers: (User & { password: string })[] = [adminUser];

// Load users from localStorage on initialization
const loadUsers = () => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (storedUsers) {
    try {
      const parsedUsers = JSON.parse(storedUsers);
      // Ensure admin user is always present
      const hasAdmin = parsedUsers.some((u: any) => u.id === adminUser.id);
      if (!hasAdmin) {
        parsedUsers.unshift(adminUser);
      }
      mockUsers = parsedUsers;
    } catch (error) {
      mockUsers = [adminUser];
    }
  }
};

const saveUsers = () => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers));
};

// Load users on module initialization
loadUsers();

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        // Find the current user data (in case it was updated)
        const currentUser = mockUsers.find(u => u.id === authData.user.id);
        if (currentUser) {
          const { password: _, ...userWithoutPassword } = currentUser;
          setUser(userWithoutPassword);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userWithoutPassword }));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists by email (one account per email)
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Check if username is taken
    const existingUsername = mockUsers.find(u => u.username === username);
    if (existingUsername) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      username,
      displayName: username, // Default display name to username
      email,
      password,
      createdAt: new Date().toISOString(),
      role: 'user',
      isVerified: false
    };
    
    mockUsers.push(newUser);
    saveUsers();
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userWithoutPassword }));
    
    setIsLoading(false);
    return true;
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update user in mockUsers array
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      saveUsers();
      
      const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
      setUser(userWithoutPassword);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userWithoutPassword }));
    }
    
    setIsLoading(false);
    return true;
  };

  const updateUserRole = async (userId: string, role: 'user' | 'admin', isVerified: boolean): Promise<boolean> => {
    if (!user || user.role !== 'admin') return false;
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], role, isVerified };
      saveUsers();
      return true;
    }
    
    return false;
  };

  const getAllUsers = (): User[] => {
    return mockUsers.map(({ password, ...user }) => user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      updateUserRole,
      getAllUsers,
      isLoading
    }}>
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