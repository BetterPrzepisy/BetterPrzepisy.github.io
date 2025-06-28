import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, User, CheckCircle, Calendar, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipeById, incrementRecipeViewCount, deleteRecipe } = useApp();
  const { getAllUsers, user } = useAuth();
  const { darkMode } = useTheme();

  const recipe = id ? getRecipeById(id) : undefined;

  useEffect(() => {
    if (id && recipe) {
      incrementRecipeViewCount(id);
    }
  }, [id, recipe?.id, incrementRecipeViewCount]);

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Przepis nie został znaleziony
          </h1>
          <p className={`mb-6 transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Przepis, którego szukasz, nie istnieje lub został usunięty.
          </p>
          <button
            onClick={() => navigate('/')}
            className="theme-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Wróć do strony głównej
          </button>
        </div>
      </div>
    );
  }

  const author = getAllUsers().find(u => u.id === recipe.authorId);
  const canEdit = recipe.authorId === user?.id || user?.role === 'admin';

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'łatwy': return darkMode ? 'text-green-400 bg-green-900' : 'text-green-600 bg-green-100';
      case 'średni': return darkMode ? 'text-yellow-400 bg-yellow-900' : 'text-yellow-600 bg-yellow-100';
      case 'trudny': return darkMode ? 'text-red-400 bg-red-900' : 'text-red-600 bg-red-100';
      default: return darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-600 bg-gray-100';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Czy na pewno chcesz usunąć ten przepis? Ta akcja nie może zostać cofnięta.')) {
      deleteRecipe(recipe.id);
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className={`flex items-center mb-6 transition-colors duration-300 ${
          darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Wróć
      </motion.button>

      {/* Recipe Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl shadow-md overflow-hidden mb-8 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {recipe.image && (
          <div className="h-64 md:h-80 bg-gray-200 overflow-hidden">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className={`text-3xl font-bold flex-1 mr-4 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {recipe.title}
            </h1>
            <div className="flex items-center space-x-2">
              {recipe.difficulty && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </span>
              )}
              {canEdit && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/recipe/${recipe.id}/edit`)}
                    className="theme-primary text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
                    title="Edytuj przepis"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                    title="Usuń przepis"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center mb-6">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 transition-colors duration-300 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <User className={`h-5 w-5 transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <div className="flex items-center">
                <span className={`font-medium transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {recipe.authorUsername}
                </span>
                {author?.isVerified && (
                  <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />
                )}
              </div>
              <div className={`flex items-center text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Calendar className="h-3 w-3 mr-1" />
                <span>{new Date(recipe.createdAt).toLocaleDateString('pl-PL')}</span>
              </div>
            </div>
          </div>

          {/* Recipe Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {recipe.cookingTime && (
              <div className={`flex items-center p-4 rounded-lg transition-colors duration-300 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Czas przygotowania
                  </p>
                  <p className={`font-semibold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {recipe.cookingTime} minut
                  </p>
                </div>
              </div>
            )}
            
            {recipe.servings && (
              <div className={`flex items-center p-4 rounded-lg transition-colors duration-300 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Liczba porcji
                  </p>
                  <p className={`font-semibold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {recipe.servings} osób
                  </p>
                </div>
              </div>
            )}
            
            {recipe.category && (
              <div className={`flex items-center p-4 rounded-lg transition-colors duration-300 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full mr-3">
                  <ChefHat className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Kategoria
                  </p>
                  <p className={`font-semibold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {recipe.category}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Tagi
              </h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-sm rounded-full transition-colors duration-300 ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Recipe Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ingredients */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className={`rounded-xl shadow-md p-6 sticky top-8 transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Składniki
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-2 w-2 theme-secondary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {ingredient}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Sposób przygotowania
            </h2>
            <div className="prose max-w-none">
              <div className={`leading-relaxed whitespace-pre-wrap transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {recipe.instructions}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex justify-center space-x-4"
      >
        <Link
          to="/create-recipe"
          className="theme-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Dodaj swój przepis
        </Link>
        <Link
          to="/discover"
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            darkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Odkrywaj więcej
        </Link>
      </motion.div>
    </div>
  );
};

export default RecipeDetailPage;