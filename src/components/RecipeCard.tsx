import React from 'react';
import { Clock, Users, ChefHat, User, CheckCircle } from 'lucide-react';
import { Recipe } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const { getAllUsers } = useAuth();
  
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'łatwy': return 'text-green-600 bg-green-100';
      case 'średni': return 'text-yellow-600 bg-yellow-100';
      case 'trudny': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const author = getAllUsers().find(u => u.id === recipe.authorId);

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
      onClick={onClick}
    >
      {recipe.image && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 truncate flex-1 mr-2">
            {recipe.title}
          </h3>
          {recipe.difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-4">
          <User className="h-4 w-4 mr-1" />
          <span className="truncate flex items-center">
            {recipe.authorUsername}
            {author?.isVerified && (
              <CheckCircle className="h-3 w-3 text-blue-500 ml-1" />
            )}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {recipe.cookingTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{recipe.cookingTime} min</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{recipe.servings} os.</span>
              </div>
            )}
          </div>
          
          {recipe.category && (
            <div className="flex items-center">
              <ChefHat className="h-4 w-4 mr-1" />
              <span className="truncate">{recipe.category}</span>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p className="line-clamp-2">{recipe.instructions}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;