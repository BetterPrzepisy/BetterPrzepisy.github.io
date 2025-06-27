export interface User {
  id: string;
  username: string;
  displayName?: string;
  email: string;
  createdAt: string;
  bio?: string;
  avatar?: string;
  role?: 'user' | 'admin';
  isVerified?: boolean;
  followers?: string[];
  following?: string[];
  favoriteRecipes?: string[];
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  authorId: string;
  authorUsername: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
  cookingTime?: number;
  servings?: number;
  difficulty?: 'łatwy' | 'średni' | 'trudny';
  category?: string;
  tags?: string[];
  likes?: string[];
  favorites?: string[];
  comments?: Comment[];
  reports?: Report[];
  viewCount?: number;
}

export interface Comment {
  id: string;
  recipeId: string;
  authorId: string;
  authorUsername: string;
  content: string;
  createdAt: string;
  likes?: string[];
  reports?: Report[];
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: 'recipe' | 'comment' | 'user';
  targetId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Friendship {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: string;
}

export interface ShoppingListItem {
  id: string;
  ingredient: string;
  checked: boolean;
  recipeId?: string;
  recipeTitle?: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithFacebook: () => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  updateUserRole: (userId: string, role: 'user' | 'admin', isVerified: boolean) => Promise<boolean>;
  followUser: (userId: string) => Promise<boolean>;
  unfollowUser: (userId: string) => Promise<boolean>;
  getAllUsers: () => User[];
  isLoading: boolean;
}

export interface AppContextType {
  recipes: Recipe[];
  friends: User[];
  friendRequests: FriendRequest[];
  allUsers: User[];
  shoppingList: ShoppingListItem[];
  reports: Report[];
  darkMode: boolean;
  currentTheme: Theme;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'authorId' | 'authorUsername' | 'createdAt' | 'updatedAt'>) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  likeRecipe: (recipeId: string) => void;
  favoriteRecipe: (recipeId: string) => void;
  addComment: (recipeId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  reportContent: (targetType: 'recipe' | 'comment' | 'user', targetId: string, reason: string, description?: string) => void;
  importRecipeFromUrl: (url: string) => Promise<boolean>;
  addToShoppingList: (ingredients: string[], recipeId?: string, recipeTitle?: string) => void;
  toggleShoppingItem: (itemId: string) => void;
  clearShoppingList: () => void;
  sendFriendRequest: (toUserId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  searchUsers: (query: string) => User[];
  searchRecipes: (query: string, filters?: RecipeFilters) => Recipe[];
  getFriendRecipes: () => Recipe[];
  getUserRecipes: (userId: string) => Recipe[];
  getRecipeById: (id: string) => Recipe | undefined;
  getTrendingRecipes: () => Recipe[];
  deleteUser: (userId: string) => void;
  getAllUsers: () => User[];
  toggleDarkMode: () => void;
  setTheme: (theme: Theme) => void;
}

export interface RecipeFilters {
  category?: string;
  difficulty?: string;
  maxTime?: number;
  tags?: string[];
  ingredients?: string[];
}