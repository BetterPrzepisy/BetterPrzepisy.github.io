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

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  updateUserRole: (userId: string, role: 'user' | 'admin', isVerified: boolean) => Promise<boolean>;
  getAllUsers: () => User[];
  isLoading: boolean;
}

export interface AppContextType {
  recipes: Recipe[];
  friends: User[];
  friendRequests: FriendRequest[];
  allUsers: User[];
  addRecipe: (recipe: Omit<Recipe, 'id' | 'authorId' | 'authorUsername' | 'createdAt' | 'updatedAt'>) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  sendFriendRequest: (toUserId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  searchUsers: (query: string) => User[];
  getFriendRecipes: () => Recipe[];
  getUserRecipes: (userId: string) => Recipe[];
  getRecipeById: (id: string) => Recipe | undefined;
  deleteUser: (userId: string) => void;
  getAllUsers: () => User[];
}