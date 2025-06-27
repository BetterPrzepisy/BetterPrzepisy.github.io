import React, { useState } from 'react';
import { TrendingUp, Filter, Clock, Users, Eye, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import RecipeCard from '../components/RecipeCard';

const TrendingPage: React.FC = () => {
  const { getTrendingRecipes, recipes } = useApp();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | 'all'>('week');

  const trendingRecipes = getTrendingRecipes();

  const getFilteredTrendingRecipes = () => {
    const now = new Date();
    let cutoffDate: Date;

    switch (timeFilter) {
      case 'day':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return trendingRecipes;
    }

    return trendingRecipes.filter(recipe => 
      new Date(recipe.createdAt) >= cutoffDate
    );
  };

  const filteredRecipes = getFilteredTrendingRecipes();

  const getTotalStats = () => {
    return recipes.reduce((acc, recipe) => ({
      totalLikes: acc.totalLikes + (recipe.likes?.length || 0),
      totalViews: acc.totalViews + (recipe.viewCount || 0),
      totalComments: acc.totalComments + (recipe.comments?.length || 0)
    }), { totalLikes: 0, totalViews: 0, totalComments: 0 });
  };

  const stats = getTotalStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4">
          <TrendingUp className={`h-8 w-8 mr-3 transition-colors duration-300 ${
            darkMode ? 'text-orange-400' : 'text-orange-600'
          }`} />
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Popularne przepisy
          </h1>
        </div>
        <p className={`transition-colors duration-300 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Odkryj najgorętsze trendy kulinarne w społeczności
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.totalLikes}
              </p>
              <p className={`transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Polubienia
              </p>
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.totalViews}
              </p>
              <p className={`transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Wyświetlenia
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.totalComments}
              </p>
              <p className={`transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Komentarze
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Time Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-xl shadow-md p-6 mb-8 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Filter className={`h-5 w-5 mr-2 transition-colors duration-300 ${
              darkMode ? 'text-orange-400' : 'text-orange-600'
            }`} />
            <span className={`font-medium transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Okres czasu
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { key: 'day', label: 'Ostatni dzień' },
            { key: 'week', label: 'Ostatni tydzień' },
            { key: 'month', label: 'Ostatni miesiąc' },
            { key: 'all', label: 'Cały czas' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeFilter(key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeFilter === key
                  ? 'bg-orange-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Trending Recipes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Najgorętsze przepisy
          </h2>
          <p className={`transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Znaleziono {filteredRecipes.length} przepis{filteredRecipes.length !== 1 ? 'ów' : ''}
          </p>
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative"
              >
                {index < 3 && (
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                )}
                <RecipeCard
                  recipe={recipe}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className={`rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center transition-colors duration-300 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <TrendingUp className={`h-8 w-8 transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Brak popularnych przepisów
            </h3>
            <p className={`mb-6 transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              W wybranym okresie nie ma jeszcze popularnych przepisów.
            </p>
            <button
              onClick={() => setTimeFilter('all')}
              className="bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors"
            >
              Zobacz wszystkie przepisy
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TrendingPage;