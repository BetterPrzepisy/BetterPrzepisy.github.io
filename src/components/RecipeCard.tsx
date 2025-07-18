import React from 'react';
import { Clock, Users, ChefHat, User, CheckCircle, Heart, Bookmark, MessageCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Recipe } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  showActions?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, showActions = true }) => {
  const { getAllUsers, user } = useAuth();
  const { likeRecipe, favoriteRecipe } = useApp();
  const { darkMode } = useTheme();
  
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'łatwy': return darkMode ? 'text-green-400 bg-green-900' : 'text-green-600 bg-green-100';
      case 'średni': return darkMode ? 'text-yellow-400 bg-yellow-900' : 'text-yellow-600 bg-yellow-100';
      case 'trudny': return darkMode ? 'text-red-400 bg-red-900' : 'text-red-600 bg-red-100';
      default: return darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-600 bg-gray-100';
    }
  };

  const author = getAllUsers().find(u => u.id === recipe.authorId);
  const isLiked = recipe.likes?.includes(user?.id || '') || false;
  const isFavorited = recipe.favorites?.includes(user?.id || '') || false;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeRecipe(recipe.id);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    favoriteRecipe(recipe.id);
  };

  return (
    <motion.div 
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: darkMode 
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
          : "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
      onClick={onClick}
    >
      {recipe.image && (
        <div className="h-48 bg-gray-200 overflow-hidden relative">
          <motion.img 
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          {recipe.difficulty && (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-3 right-3"
            >
              <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            </motion.div>
          )}
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-semibold truncate flex-1 mr-2 recipe-title transition-colors duration-300"
          >
            {recipe.title}
          </motion.h3>
          {!recipe.image && recipe.difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`flex items-center text-sm mb-4 transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <User className="h-4 w-4 mr-1 theme-icon" />
          <span className="truncate flex items-center">
            {recipe.authorUsername}
            {author?.isVerified && (
              <CheckCircle className="h-3 w-3 text-blue-500 ml-1" />
            )}
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`flex items-center justify-between text-sm mb-4 transition-colors duration-300 ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}
        >
          <div className="flex items-center space-x-4">
            {recipe.cookingTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 theme-icon" />
                <span>{recipe.cookingTime} min</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 theme-icon" />
                <span>{recipe.servings} os.</span>
              </div>
            )}
          </div>
          
          {recipe.category && (
            <div className="flex items-center">
              <ChefHat className="h-4 w-4 mr-1 theme-icon" />
              <span className="truncate">{recipe.category}</span>
            </div>
          )}
        </motion.div>

        {recipe.tags && recipe.tags.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-1 mb-4"
          >
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`px-2 py-1 text-xs rounded-full transition-colors duration-300 ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'theme-bg-light theme-text-light'
                }`}
              >
                #{tag}
              </motion.span>
            ))}
            {recipe.tags.length > 3 && (
              <span className={`px-2 py-1 text-xs rounded-full transition-colors duration-300 ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'theme-bg-light theme-text-light'
              }`}>
                +{recipe.tags.length - 3}
              </span>
            )}
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-sm mb-4 transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <p className="line-clamp-2">{recipe.instructions}</p>
        </motion.div>

        {showActions && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`flex items-center justify-between pt-4 border-t transition-colors duration-300 ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`flex items-center space-x-1 transition-colors duration-200 ${
                  isLiked 
                    ? 'text-red-500' 
                    : darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{recipe.likes?.length || 0}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavorite}
                className={`flex items-center space-x-1 transition-colors duration-200 ${
                  isFavorited 
                    ? 'text-yellow-500' 
                    : darkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-500 hover:text-yellow-500'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                <span className="text-sm">{recipe.favorites?.length || 0}</span>
              </motion.button>

              <div className={`flex items-center space-x-1 transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{recipe.comments?.length || 0}</span>
              </div>
            </div>

            <div className={`flex items-center space-x-1 text-xs transition-colors duration-300 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <Eye className="h-3 w-3" />
              <span>{recipe.viewCount || 0}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RecipeCard;