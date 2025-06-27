import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recipe, User, FriendRequest, AppContextType, Comment, Report, ShoppingListItem, RecipeFilters, Theme } from '../types';
import { useAuth } from './AuthContext';

const AppContext = createContext<AppContextType | undefined>(undefined);

const RECIPES_STORAGE_KEY = 'polskie-przepisy-recipes';
const FRIENDS_STORAGE_KEY = 'polskie-przepisy-friends';
const FRIEND_REQUESTS_STORAGE_KEY = 'polskie-przepisy-friend-requests';
const SHOPPING_LIST_STORAGE_KEY = 'polskie-przepisy-shopping-list';
const REPORTS_STORAGE_KEY = 'polskie-przepisy-reports';
const THEME_STORAGE_KEY = 'polskie-przepisy-theme';

const defaultTheme: Theme = {
  id: 'orange',
  name: 'Pomarańczowy',
  colors: {
    primary: '#ea580c',
    secondary: '#fb923c',
    accent: '#fed7aa',
    background: '#fef3f2',
    surface: '#ffffff',
    text: '#1f2937'
  }
};

const initialRecipes: Recipe[] = [];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, getAllUsers } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    // Load data from localStorage
    const storedRecipes = localStorage.getItem(RECIPES_STORAGE_KEY);
    const storedFriends = localStorage.getItem(FRIENDS_STORAGE_KEY);
    const storedFriendRequests = localStorage.getItem(FRIEND_REQUESTS_STORAGE_KEY);
    const storedShoppingList = localStorage.getItem(SHOPPING_LIST_STORAGE_KEY);
    const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    setRecipes(storedRecipes ? JSON.parse(storedRecipes) : initialRecipes);
    setFriends(storedFriends ? JSON.parse(storedFriends) : []);
    setFriendRequests(storedFriendRequests ? JSON.parse(storedFriendRequests) : []);
    setShoppingList(storedShoppingList ? JSON.parse(storedShoppingList) : []);
    setReports(storedReports ? JSON.parse(storedReports) : []);
    setDarkMode(storedDarkMode);
    setCurrentTheme(storedTheme ? JSON.parse(storedTheme) : defaultTheme);
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
      likes: [],
      favorites: [],
      comments: [],
      reports: [],
      viewCount: 0
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

  const likeRecipe = (recipeId: string) => {
    if (!user) return;

    const updatedRecipes = recipes.map(recipe => {
      if (recipe.id === recipeId) {
        const likes = recipe.likes || [];
        const isLiked = likes.includes(user.id);
        
        return {
          ...recipe,
          likes: isLiked 
            ? likes.filter(id => id !== user.id)
            : [...likes, user.id]
        };
      }
      return recipe;
    });

    setRecipes(updatedRecipes);
    saveToStorage(RECIPES_STORAGE_KEY, updatedRecipes);
  };

  const favoriteRecipe = (recipeId: string) => {
    if (!user) return;

    const updatedRecipes = recipes.map(recipe => {
      if (recipe.id === recipeId) {
        const favorites = recipe.favorites || [];
        const isFavorited = favorites.includes(user.id);
        
        return {
          ...recipe,
          favorites: isFavorited 
            ? favorites.filter(id => id !== user.id)
            : [...favorites, user.id]
        };
      }
      return recipe;
    });

    setRecipes(updatedRecipes);
    saveToStorage(RECIPES_STORAGE_KEY, updatedRecipes);
  };

  const addComment = (recipeId: string, content: string) => {
    if (!user) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      recipeId,
      authorId: user.id,
      authorUsername: user.displayName || user.username,
      content,
      createdAt: new Date().toISOString(),
      likes: [],
      reports: []
    };

    const updatedRecipes = recipes.map(recipe => {
      if (recipe.id === recipeId) {
        return {
          ...recipe,
          comments: [...(recipe.comments || []), newComment]
        };
      }
      return recipe;
    });

    setRecipes(updatedRecipes);
    saveToStorage(RECIPES_STORAGE_KEY, updatedRecipes);
  };

  const deleteComment = (commentId: string) => {
    const updatedRecipes = recipes.map(recipe => ({
      ...recipe,
      comments: (recipe.comments || []).filter(comment => comment.id !== commentId)
    }));

    setRecipes(updatedRecipes);
    saveToStorage(RECIPES_STORAGE_KEY, updatedRecipes);
  };

  const reportContent = (targetType: 'recipe' | 'comment' | 'user', targetId: string, reason: string, description?: string) => {
    if (!user) return;

    const newReport: Report = {
      id: Date.now().toString(),
      reporterId: user.id,
      targetType,
      targetId,
      reason,
      description,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    saveToStorage(REPORTS_STORAGE_KEY, updatedReports);
  };

  const importRecipeFromUrl = async (url: string): Promise<boolean> => {
    // Simulate recipe import - in production, use a recipe scraping service
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock imported recipe
    const importedRecipe = {
      title: 'Importowany przepis',
      ingredients: ['Składnik 1', 'Składnik 2', 'Składnik 3'],
      instructions: 'Instrukcje przygotowania importowanego przepisu...',
      cookingTime: 30,
      servings: 4,
      difficulty: 'średni' as const,
      category: 'Dania główne',
      tags: ['importowany', 'szybki']
    };

    addRecipe(importedRecipe);
    return true;
  };

  const addToShoppingList = (ingredients: string[], recipeId?: string, recipeTitle?: string) => {
    const newItems: ShoppingListItem[] = ingredients.map(ingredient => ({
      id: `${Date.now()}-${Math.random()}`,
      ingredient,
      checked: false,
      recipeId,
      recipeTitle
    }));

    const updatedShoppingList = [...shoppingList, ...newItems];
    setShoppingList(updatedShoppingList);
    saveToStorage(SHOPPING_LIST_STORAGE_KEY, updatedShoppingList);
  };

  const toggleShoppingItem = (itemId: string) => {
    const updatedShoppingList = shoppingList.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    setShoppingList(updatedShoppingList);
    saveToStorage(SHOPPING_LIST_STORAGE_KEY, updatedShoppingList);
  };

  const clearShoppingList = () => {
    setShoppingList([]);
    saveToStorage(SHOPPING_LIST_STORAGE_KEY, []);
  };

  const searchRecipes = (query: string, filters?: RecipeFilters): Recipe[] => {
    let filteredRecipes = recipes;

    // Text search
    if (query.trim()) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(query.toLowerCase())) ||
        (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) ||
        recipe.instructions.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply filters
    if (filters) {
      if (filters.category) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.category === filters.category);
      }
      if (filters.difficulty) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.difficulty === filters.difficulty);
      }
      if (filters.maxTime) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.cookingTime && recipe.cookingTime <= filters.maxTime!
        );
      }
      if (filters.tags && filters.tags.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.tags && filters.tags!.some(tag => recipe.tags!.includes(tag))
        );
      }
      if (filters.ingredients && filters.ingredients.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          filters.ingredients!.some(ingredient =>
            recipe.ingredients.some(recipeIng =>
              recipeIng.toLowerCase().includes(ingredient.toLowerCase())
            )
          )
        );
      }
    }

    return filteredRecipes;
  };

  const getTrendingRecipes = (): Recipe[] => {
    return recipes
      .map(recipe => ({
        ...recipe,
        score: (recipe.likes?.length || 0) * 2 + 
               (recipe.favorites?.length || 0) * 3 + 
               (recipe.comments?.length || 0) * 1 +
               (recipe.viewCount || 0) * 0.1
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    saveToStorage(THEME_STORAGE_KEY, theme);
  };

  const deleteUser = (userId: string) => {
    if (!user || user.role !== 'admin') return;

    const updatedRecipes = recipes.filter(recipe => recipe.authorId !== userId);
    setRecipes(updatedRecipes);
    saveToStorage(RECIPES_STORAGE_KEY, updatedRecipes);

    const updatedFriends = friends.filter(friend => friend.id !== userId);
    setFriends(updatedFriends);
    saveToStorage(FRIENDS_STORAGE_KEY, updatedFriends);

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

    const updatedRequests = friendRequests.map(req =>
      req.id === requestId ? { ...req, status: 'accepted' as const } : req
    );
    setFriendRequests(updatedRequests);
    saveToStorage(FRIEND_REQUESTS_STORAGE_KEY, updatedRequests);

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
    const recipe = recipes.find(recipe => recipe.id === id);
    if (recipe) {
      // Increment view count
      updateRecipe(id, { viewCount: (recipe.viewCount || 0) + 1 });
    }
    return recipe;
  };

  return (
    <AppContext.Provider value={{
      recipes,
      friends,
      friendRequests,
      allUsers: getAllUsers(),
      shoppingList,
      reports,
      darkMode,
      currentTheme,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      likeRecipe,
      favoriteRecipe,
      addComment,
      deleteComment,
      reportContent,
      importRecipeFromUrl,
      addToShoppingList,
      toggleShoppingItem,
      clearShoppingList,
      sendFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      searchUsers,
      searchRecipes,
      getFriendRecipes,
      getUserRecipes,
      getRecipeById,
      getTrendingRecipes,
      deleteUser,
      getAllUsers,
      toggleDarkMode,
      setTheme
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