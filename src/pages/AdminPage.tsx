import React, { useState } from 'react';
import { Shield, Users, BookOpen, Trash2, AlertTriangle, Search, CheckCircle, UserCheck, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Navigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { user, updateUserRole, getAllUsers } = useAuth();
  const { recipes, deleteUser, deleteRecipe } = useApp();
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'user' | 'recipe'>('user');
  const [showRoleModal, setShowRoleModal] = useState<string | null>(null);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const allUsers = getAllUsers().filter(u => u.role !== 'admin');
  const filteredUsers = allUsers.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.displayName && u.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    setShowDeleteConfirm(null);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    deleteRecipe(recipeId);
    setShowDeleteConfirm(null);
  };

  const confirmDelete = (id: string, type: 'user' | 'recipe') => {
    setShowDeleteConfirm(id);
    setDeleteType(type);
  };

  const handleUpdateUserRole = async (userId: string, role: 'user' | 'admin', isVerified: boolean) => {
    await updateUserRole(userId, role, isVerified);
    setShowRoleModal(null);
  };

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
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center mb-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Shield className="h-8 w-8 text-red-600 mr-3" />
          </motion.div>
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Panel Administratora
          </h1>
        </div>
        <p className={`transition-colors duration-300 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Zarządzaj użytkownikami i treściami w systemie
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            icon: Users,
            value: allUsers.length,
            label: 'Użytkownicy',
            color: 'blue',
            trend: '+12%'
          },
          {
            icon: BookOpen,
            value: recipes.length,
            label: 'Przepisy',
            color: 'green',
            trend: '+8%'
          },
          {
            icon: Shield,
            value: 1,
            label: 'Administratorzy',
            color: 'purple',
            trend: '0%'
          },
          {
            icon: Activity,
            value: allUsers.filter(u => u.isVerified).length,
            label: 'Zweryfikowani',
            color: 'yellow',
            trend: '+5%'
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
            className={`rounded-xl p-6 shadow-md transition-all duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
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
              <div className="flex items-center text-green-500 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                {stat.trend}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Users Management */}
      <motion.div 
        variants={itemVariants}
        className={`rounded-xl shadow-md p-6 mb-8 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h2 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Zarządzanie użytkownikami
        </h2>
        
        <div className="mb-6">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Wyszukaj użytkowników..."
            />
          </div>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`transition-colors duration-300 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Użytkownik
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Email
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Data rejestracji
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Przepisy
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
              }`}>
                {filteredUsers.map((u, index) => {
                  const userRecipes = recipes.filter(r => r.authorId === u.id);
                  return (
                    <motion.tr 
                      key={u.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`transition-colors duration-300 ${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <Users className={`h-5 w-5 transition-colors duration-300 ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <div className={`text-sm font-medium transition-colors duration-300 ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {u.displayName || u.username}
                              </div>
                              {u.isVerified && (
                                <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />
                              )}
                            </div>
                            <div className={`text-sm transition-colors duration-300 ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              @{u.username}
                            </div>
                            {u.bio && (
                              <div className={`text-sm truncate max-w-xs transition-colors duration-300 ${
                                darkMode ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                {u.bio}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {u.isVerified ? (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              Zweryfikowany
                            </span>
                          ) : (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                            }`}>
                              Niezweryfikowany
                            </span>
                          )}
                          {u.role === 'admin' && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {new Date(u.createdAt).toLocaleDateString('pl-PL')}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {userRecipes.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowRoleModal(u.id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Zarządzaj
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => confirmDelete(u.id, 'user')}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Usuń
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className={`h-12 w-12 mx-auto mb-4 transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <p className={`transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Brak użytkowników do wyświetlenia
            </p>
          </div>
        )}
      </motion.div>

      {/* Recipes Management */}
      <motion.div 
        variants={itemVariants}
        className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h2 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Zarządzanie przepisami
        </h2>
        
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <motion.div 
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className={`border rounded-lg p-4 transition-all duration-300 ${
                  darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                }`}
              >
                <h3 className={`font-semibold mb-2 truncate transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {recipe.title}
                </h3>
                <p className={`text-sm mb-2 transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Autor: {recipe.authorUsername}
                </p>
                <p className={`text-sm mb-4 transition-colors duration-300 ${
                  darkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {new Date(recipe.createdAt).toLocaleDateString('pl-PL')}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => confirmDelete(recipe.id, 'recipe')}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Usuń przepis
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className={`h-12 w-12 mx-auto mb-4 transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <p className={`transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Brak przepisów w systemie
            </p>
          </div>
        )}
      </motion.div>

      {/* Role Management Modal */}
      {showRoleModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-xl p-6 max-w-md w-full mx-4 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            {(() => {
              const targetUser = allUsers.find(u => u.id === showRoleModal);
              if (!targetUser) return null;
              
              return (
                <>
                  <div className="flex items-center mb-4">
                    <UserCheck className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Zarządzaj użytkownikiem
                    </h3>
                  </div>
                  <div className="mb-6">
                    <p className={`mb-4 transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Zarządzaj uprawnieniami dla: <strong>{targetUser.displayName || targetUser.username}</strong>
                    </p>
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUpdateUserRole(targetUser.id, targetUser.role || 'user', !targetUser.isVerified)}
                        className={`w-full p-3 rounded-lg border-2 transition-colors ${
                          targetUser.isVerified 
                            ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' 
                            : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        {targetUser.isVerified ? 'Usuń weryfikację' : 'Zweryfikuj użytkownika'}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUpdateUserRole(targetUser.id, targetUser.role === 'admin' ? 'user' : 'admin', targetUser.isVerified || false)}
                        className={`w-full p-3 rounded-lg border-2 transition-colors ${
                          targetUser.role === 'admin'
                            ? darkMode 
                              ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                            : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        {targetUser.role === 'admin' ? 'Usuń uprawnienia admina' : 'Nadaj uprawnienia admina'}
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowRoleModal(null)}
                      className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                        darkMode 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Anuluj
                    </motion.button>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-xl p-6 max-w-md w-full mx-4 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Potwierdź usunięcie
              </h3>
            </div>
            <p className={`mb-6 transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {deleteType === 'user' 
                ? 'Czy na pewno chcesz usunąć tego użytkownika? Ta akcja spowoduje również usunięcie wszystkich jego przepisów i nie może zostać cofnięta.'
                : 'Czy na pewno chcesz usunąć ten przepis? Ta akcja nie może zostać cofnięta.'
              }
            </p>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteConfirm(null)}
                className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Anuluj
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (deleteType === 'user') {
                    handleDeleteUser(showDeleteConfirm);
                  } else {
                    handleDeleteRecipe(showDeleteConfirm);
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Usuń
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminPage;