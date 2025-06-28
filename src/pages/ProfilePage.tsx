import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, BookOpen, Users, Edit, CheckCircle, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import RecipeCard from '../components/RecipeCard';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { getUserRecipes, friends } = useApp();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const userRecipes = getUserRecipes(user?.id || '');

  if (!user) return null;

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
      {/* Profile Header */}
      <motion.div 
        variants={itemVariants}
        className={`rounded-xl shadow-md p-8 mb-8 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-24 w-24 theme-bg-light rounded-full flex items-center justify-center shadow-lg"
            >
              <User className="h-12 w-12 theme-icon" />
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-3xl font-bold mr-2 transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {user.displayName || user.username}
                </motion.h1>
                {user.isVerified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <CheckCircle className="h-6 w-6 text-blue-500" />
                  </motion.div>
                )}
                {user.role === 'admin' && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full"
                  >
                    Admin
                  </motion.span>
                )}
              </div>
              <p className={`mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                @{user.username}
              </p>
              <p className={`mb-4 transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {user.email}
              </p>
              {user.bio && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`mb-4 transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {user.bio}
                </motion.p>
              )}
              
              <div className={`flex items-center text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                <Calendar className="h-4 w-4 mr-2" />
                <span>Dołączył {new Date(user.createdAt).toLocaleDateString('pl-PL')}</span>
              </div>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/profile/edit"
              className="theme-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center shadow-lg"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edytuj profil
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {[
          {
            icon: BookOpen,
            value: userRecipes.length,
            label: 'Przepisy',
            color: 'blue'
          },
          {
            icon: Users,
            value: friends.length,
            label: 'Znajomi',
            color: 'green'
          },
          {
            icon: Award,
            value: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
            label: 'Dni z nami',
            color: 'purple'
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
            className={`rounded-xl p-6 shadow-md text-center transition-all duration-300 cursor-pointer ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}
            >
              <stat.icon className={`h-8 w-8 text-${stat.color}-600 dark:text-${stat.color}-400`} />
            </motion.div>
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
              className={`text-2xl font-bold mb-1 transition-colors duration-300 ${
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
          </motion.div>
        ))}
      </motion.div>

      {/* User's Recipes */}
      <motion.div variants={itemVariants}>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Moje przepisy
        </motion.h2>
        
        {userRecipes.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {userRecipes.map((recipe, index) => (
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
              <BookOpen className={`h-8 w-8 transition-colors duration-300 ${
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
              Nie dodałeś jeszcze żadnego przepisu. Podziel się swoimi ulubionymi potrawami!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/create-recipe"
                className="theme-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                <Star className="h-5 w-5 mr-2 inline" />
                Dodaj pierwszy przepis
              </Link>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;