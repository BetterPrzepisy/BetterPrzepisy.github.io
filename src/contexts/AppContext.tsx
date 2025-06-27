import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recipe, User, FriendRequest, Friendship, AppContextType } from '../types';
import { useAuth } from './AuthContext';

const AppContext = createContext<AppContextType | undefined>(undefined);

const RECIPES_STORAGE_KEY = 'polskie-przepisy-recipes';
const FRIENDS_STORAGE_KEY = 'polskie-przepisy-friends';
const FRIEND_REQUESTS_STORAGE_KEY = 'polskie-przepisy-friend-requests';

// Start with empty data - no demo recipes or users
const initialRecipes: Recipe[] = [];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, getAllUsers } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedRecipes = localStorage.getItem(RECIPES_STORAGE_KEY);
    const storedFriends = localStorage.getItem(FRIENDS_STORAGE_KEY);
    const storedFriendRequests = localStorage.getItem(FRIEND_REQUESTS_STORAGE_KEY);

    setRecipes(storedRecipes ? JSON.parse(storedRecipes) : initialRecipes);
    setFriends(storedFriends ? JSON.parse(storedFriends) : []);
    setFriendRequests(storedFriendRequests ? JSON.parse(storedFriendRequests) : []);
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addRecipe = (recipeData: Omit<Recipe, 'id' | 'authorId' | 'authorUsername' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const newRecipe: Recipe = {
      ...recipeData,
      id: Date.now().toString(),
      authorId: user.id,
      authorUsername: user.displayName || user.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedRecipes = [...recipes, newRecipe];
    setRecipes(updatedRecipes);
    saveToStorage(RECIPES_STORAGE_KEY, updatedRecipes);
  };

  const updateRecipe = (id: string, updateData: Partial<Recipe>) => {
    const updatedRecipes = recipes.map(recipe =>
      recipe.id === id ? { ...recipe, ...updateData, updatedAt: new Date().toISOString() } : recipe
    );
    setRecipes(updatedRecipes);
    saveToStorage(RECIPES_STORAGE_KEY, updatedRecipes);
  };

  const deleteRecipe = (id: string) => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
    setRecipes(updatedRecipes);
    saveToStorage(RECIPES_STORAGE_KEY, updatedRecipes);
  };

  const deleteUser = (userId: string) => {
    if (!user || user.role !== 'admin') return;

    // Remove user's recipes
    const updatedRecipes = recipes.filter(recipe => recipe.authorId !== userId);
    setRecipes(updatedRecipes);
    saveToStorage(RECIPES_STORAGE_KEY, updatedRecipes);

    // Remove user from friends lists
    const updatedFriends = friends.filter(friend => friend.id !== userId);
    setFriends(updatedFriends);
    saveToStorage(FRIENDS_STORAGE_KEY, updatedFriends);

    // Remove friend requests involving this user
    const updatedFriendRequests = friendRequests.filter(
      req => req.fromUserId !== userId && req.toUserId !== userId
    );
    setFriendRequests(updatedFriendRequests);
    saveToStorage(FRIEND_REQUESTS_STORAGE_KEY, updatedFriendRequests);
  };

  const sendFriendRequest = (toUserId: string) => {
    if (!user) return;

    const toUser = getAllUsers().find(u => u.id === toUserId);
    if (!toUser) return;

    const newRequest: FriendRequest = {
      id: Date.now().toString(),
      fromUserId: user.id,
      fromUsername: user.displayName || user.username,
      toUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const updatedRequests = [...friendRequests, newRequest];
    setFriendRequests(updatedRequests);
    saveToStorage(FRIEND_REQUESTS_STORAGE_KEY, updatedRequests);
  };

  const acceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(req => req.id === requestId);
    if (!request || !user) return;

    // Update request status
    const updatedRequests = friendRequests.map(req =>
      req.id === requestId ? { ...req, status: 'accepted' as const } : req
    );
    setFriendRequests(updatedRequests);
    saveToStorage(FRIEND_REQUESTS_STORAGE_KEY, updatedRequests);

    // Add to friends
    const allUsers = getAllUsers();
    const newFriend = allUsers.find(u => u.id === request.fromUserId);
    if (newFriend) {
      const updatedFriends = [...friends, newFriend];
      setFriends(updatedFriends);
      saveToStorage(FRIENDS_STORAGE_KEY, updatedFriends);
    }
  };

  const rejectFriendRequest = (requestId: string) => {
    const updatedRequests = friendRequests.map(req =>
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    );
    setFriendRequests(updatedRequests);
    saveToStorage(FRIEND_REQUESTS_STORAGE_KEY, updatedRequests);
  };

  const searchUsers = (query: string): User[] => {
    if (!query.trim()) return [];
    const allUsers = getAllUsers();
    return allUsers.filter(u => 
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      (u.displayName && u.displayName.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getFriendRecipes = (): Recipe[] => {
    const friendIds = friends.map(f => f.id);
    return recipes.filter(recipe => friendIds.includes(recipe.authorId));
  };

  const getUserRecipes = (userId: string): Recipe[] => {
    return recipes.filter(recipe => recipe.authorId === userId);
  };

  const getRecipeById = (id: string): Recipe | undefined => {
    return recipes.find(recipe => recipe.id === id);
  };

  return (
    <AppContext.Provider value={{
      recipes,
      friends,
      friendRequests,
      allUsers: getAllUsers(),
      addRecipe,
      updateRecipe,
      deleteRecipe,
      sendFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      searchUsers,
      getFriendRecipes,
      getUserRecipes,
      getRecipeById,
      deleteUser,
      getAllUsers,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};