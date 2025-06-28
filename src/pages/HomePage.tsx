import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Heart, Sparkles, TrendingUp, Users, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import RecipeCard from '../components/RecipeCard';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { recipes, getFriendRecipes, getUserRecipes } = useApp();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const userRecipes = getUserRecipes(user?.id || '');
  const friendRecipes = getFriendRecipes();
  const recentRecipes = [...userRecipes, ...friendRecipes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-2"
              >
                Witaj z powrotem, {user?.displayName || user?.username}! 👋
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-orange-100 text-lg"
              >
                Gotowy na kolejne kulinarne przygody?
              </motion.p>
            </div>
            <div className="hidden md:block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/create-recipe"
                  className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-orange-50 transition-colors flex items-center shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Dodaj przepis
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            icon: Heart,
            value: userRecipes.length,
            label: 'Twoje przepisy',
            color: 'blue',
            bgColor: darkMode ? 'bg-gray-800' : 'bg-white'
          },
          {
            icon: Sparkles,
            value: friendRecipes.length,
            label: 'Od znajomych',
            color: 'green',
            bgColor: darkMode ? 'bg-gray-800' : 'bg-white'
          },
          {
            icon: BookOpen,
            value: recipes.length,
            label: 'Wszystkie przepisy',
            color: 'purple',
            bgColor: darkMode ? 'bg-gray-800' : 'bg-white'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: darkMode 
                ? "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            className={`${stat.bgColor} rounded-xl p-6 shadow-md transition-all duration-300 cursor-pointer`}
          >
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-full`}
              >
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </motion.div>
              <div className="ml-4">
                <motion.p 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                  className={`text-2xl font-bold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {stat.value}
                </motion.p>
                <p className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Recipes */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-2xl font-bold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Najnowsze przepisy
          </motion.h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/discover"
              className="theme-primary-text hover:opacity-80 font-medium transition-opacity flex items-center"
            >
              Zobacz więcej 
              <TrendingUp className="h-4 w-4 ml-1" />
            </Link>
          </motion.div>
        </div>

        {recentRecipes.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recentRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <RecipeCard
                  recipe={recipe}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center transition-colors duration-300 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <Heart className={`h-8 w-8 transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
            </motion.div>
            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Brak przepisów
            </h3>
            <p className={`mb-6 transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Zacznij dodawać przepisy lub dodaj znajomych, aby zobaczyć ich przepisy tutaj.
            </p>
            <div className="space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  to="/create-recipe"
                  className="theme-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity inline-flex items-center shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Dodaj przepis
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  to="/friends"
                  className={`px-6 py-3 rounded-full font-semibold transition-colors shadow-lg ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="h-5 w-5 mr-2 inline" />
                  Znajdź znajomych
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HomePage;