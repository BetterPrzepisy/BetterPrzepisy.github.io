import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'polskie-przepisy-auth';
const USERS_STORAGE_KEY = 'polskie-przepisy-users';

// Admin account
const adminUser: (User & { password: string }) = {
  id: 'admin-001',
  username: 'p7poland',
  displayName: 'P7 Poland Admin',
  email: 'p7poland@gmail.com',
  password: 'qwertyasd1672#ffds@1',
  createdAt: '2024-01-01T00:00:00Z',
  bio: 'Administrator systemu BetterPrzepisy',
  role: 'admin',
  isVerified: true,
  followers: [],
  following: [],
  favoriteRecipes: []
};

let mockUsers: (User & { password: string })[] = [adminUser];

const loadUsers = () => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (storedUsers) {
    try {
      const parsedUsers = JSON.parse(storedUsers);
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

loadUsers();

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    const existingUsername = mockUsers.find(u => u.username === username);
    if (existingUsername) {
      setIsLoading(false);
      return false;
    }
    
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      username,
      displayName: username,
      email,
      password,
      createdAt: new Date().toISOString(),
      role: 'user',
      isVerified: false, // New users are NOT verified by default
      followers: [],
      following: [],
      favoriteRecipes: []
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
    await new Promise(resolve => setTimeout(resolve, 500));
    
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

  const followUser = async (userId: string): Promise<boolean> => {
    if (!user) return false;
    
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    const targetIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1 && targetIndex !== -1) {
      // Add to following list
      if (!mockUsers[userIndex].following) mockUsers[userIndex].following = [];
      if (!mockUsers[userIndex].following!.includes(userId)) {
        mockUsers[userIndex].following!.push(userId);
      }
      
      // Add to followers list
      if (!mockUsers[targetIndex].followers) mockUsers[targetIndex].followers = [];
      if (!mockUsers[targetIndex].followers!.includes(user.id)) {
        mockUsers[targetIndex].followers!.push(user.id);
      }
      
      saveUsers();
      
      const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
      setUser(userWithoutPassword);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userWithoutPassword }));
      
      return true;
    }
    
    return false;
  };

  const unfollowUser = async (userId: string): Promise<boolean> => {
    if (!user) return false;
    
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    const targetIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1 && targetIndex !== -1) {
      // Remove from following list
      if (mockUsers[userIndex].following) {
        mockUsers[userIndex].following = mockUsers[userIndex].following!.filter(id => id !== userId);
      }
      
      // Remove from followers list
      if (mockUsers[targetIndex].followers) {
        mockUsers[targetIndex].followers = mockUsers[targetIndex].followers!.filter(id => id !== user.id);
      }
      
      saveUsers();
      
      const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
      setUser(userWithoutPassword);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userWithoutPassword }));
      
      return true;
    }
    
    return false;
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
      followUser,
      unfollowUser,
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