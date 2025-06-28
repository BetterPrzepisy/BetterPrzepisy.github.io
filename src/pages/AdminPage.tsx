import React, { useState } from 'react';
import { Shield, Users, BookOpen, Trash2, AlertTriangle, Search, CheckCircle, UserCheck, TrendingUp, Activity, BarChart3, Eye, MessageCircle, Heart, Calendar, Download, Filter, RefreshCw, Bell, Settings, Database, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Navigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { user, updateUserRole, getAllUsers } = useAuth();
  const { recipes, deleteUser, deleteRecipe, reports, notifications } = useApp();
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'user' | 'recipe'>('user');
  const [showRoleModal, setShowRoleModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'recipes' | 'analytics' | 'reports' | 'system'>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const allUsers = getAllUsers().filter(u => u.role !== 'admin');
  const filteredUsers = allUsers.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.displayName && u.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Analytics calculations
  const totalLikes = recipes.reduce((sum, recipe) => sum + (recipe.likes?.length || 0), 0);
  const totalViews = recipes.reduce((sum, recipe) => sum + (recipe.viewCount || 0), 0);
  const totalComments = recipes.reduce((sum, recipe) => sum + (recipe.comments?.length || 0), 0);
  const verifiedUsers = allUsers.filter(u => u.isVerified).length;
  const activeUsers = allUsers.filter(u => {
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(u.createdAt) > lastWeek;
  }).length;

  // Growth calculations
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const newUsersThisMonth = allUsers.filter(u => new Date(u.createdAt) > lastMonth).length;
  const newRecipesThisMonth = recipes.filter(r => new Date(r.createdAt) > lastMonth).length;

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

  const exportData = (type: 'users' | 'recipes' | 'analytics') => {
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'users':
        data = allUsers.map(u => ({
          username: u.username,
          email: u.email,
          displayName: u.displayName,
          isVerified: u.isVerified,
          createdAt: u.createdAt,
          recipesCount: recipes.filter(r => r.authorId === u.id).length
        }));
        filename = 'users-export.json';
        break;
      case 'recipes':
        data = recipes.map(r => ({
          title: r.title,
          author: r.authorUsername,
          category: r.category,
          difficulty: r.difficulty,
          likes: r.likes?.length || 0,
          views: r.viewCount || 0,
          createdAt: r.createdAt
        }));
        filename = 'recipes-export.json';
        break;
      case 'analytics':
        data = {
          totalUsers: allUsers.length,
          totalRecipes: recipes.length,
          totalLikes,
          totalViews,
          totalComments,
          verifiedUsers,
          newUsersThisMonth,
          newRecipesThisMonth,
          generatedAt: new Date().toISOString()
        };
        filename = 'analytics-export.json';
        break;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  const tabs = [
    { id: 'overview', label: 'Przegląd', icon: BarChart3 },
    { id: 'users', label: 'Użytkownicy', icon: Users },
    { id: 'recipes', label: 'Przepisy', icon: BookOpen },
    { id: 'analytics', label: 'Analityka', icon: TrendingUp },
    { id: 'reports', label: 'Zgłoszenia', icon: AlertTriangle },
    { id: 'system', label: 'System', icon: Settings }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Shield className="h-8 w-8 text-red-600 mr-3" />
            </motion.div>
            <div>
              <h1 className={`text-3xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Panel Administratora
              </h1>
              <p className={`transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Zaawansowane zarządzanie systemem
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="Odśwież dane"
            >
              <RefreshCw className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-colors relative ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="Powiadomienia"
            >
              <Bell className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm'
                  : darkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div variants={containerVariants} className="space-y-8">
          {/* Main Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                value: allUsers.length,
                label: 'Użytkownicy',
                change: `+${newUsersThisMonth}`,
                changeLabel: 'w tym miesiącu',
                color: 'blue'
              },
              {
                icon: BookOpen,
                value: recipes.length,
                label: 'Przepisy',
                change: `+${newRecipesThisMonth}`,
                changeLabel: 'w tym miesiącu',
                color: 'green'
              },
              {
                icon: Eye,
                value: totalViews,
                label: 'Wyświetlenia',
                change: '+12%',
                changeLabel: 'vs poprzedni miesiąc',
                color: 'purple'
              },
              {
                icon: Heart,
                value: totalLikes,
                label: 'Polubienia',
                change: '+8%',
                changeLabel: 'vs poprzedni miesiąc',
                color: 'red'
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
                  <div>
                    <motion.p 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                      className={`text-2xl font-bold transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {stat.value.toLocaleString()}
                    </motion.p>
                    <p className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {stat.label}
                    </p>
                    <div className="flex items-center mt-2 text-xs">
                      <span className="text-green-500 font-medium">{stat.change}</span>
                      <span className={`ml-1 transition-colors duration-300 ${
                        darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {stat.changeLabel}
                      </span>
                    </div>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-full`}
                  >
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            variants={itemVariants}
            className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Szybkie akcje
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => exportData('users')}
                className="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <Download className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                <div className="text-left">
                  <p className={`font-medium transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Eksportuj użytkowników
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Pobierz dane w formacie JSON
                  </p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => exportData('recipes')}
                className="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 transition-colors"
              >
                <Download className="h-5 w-5 mr-3 text-green-600 dark:text-green-400" />
                <div className="text-left">
                  <p className={`font-medium transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Eksportuj przepisy
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Pobierz dane w formacie JSON
                  </p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => exportData('analytics')}
                className="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
              >
                <Download className="h-5 w-5 mr-3 text-purple-600 dark:text-purple-400" />
                <div className="text-left">
                  <p className={`font-medium transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Eksportuj analitykę
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Pobierz raport w formacie JSON
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            variants={itemVariants}
            className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Ostatnia aktywność
            </h3>
            <div className="space-y-4">
              {recipes.slice(0, 5).map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-300 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3">
                    <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Nowy przepis: {recipe.title}
                    </p>
                    <p className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Autor: {recipe.authorUsername} • {new Date(recipe.createdAt).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className={`flex items-center transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <Heart className="h-3 w-3 mr-1" />
                      {recipe.likes?.length || 0}
                    </span>
                    <span className={`flex items-center transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <Eye className="h-3 w-3 mr-1" />
                      {recipe.viewCount || 0}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div 
          variants={itemVariants}
          className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Zarządzanie użytkownikami
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Wyszukaj użytkowników..."
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => exportData('users')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Eksportuj
              </motion.button>
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
      )}

      {/* Recipes Tab */}
      {activeTab === 'recipes' && (
        <motion.div 
          variants={itemVariants}
          className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Zarządzanie przepisami
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exportData('recipes')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Eksportuj
            </motion.button>
          </div>
          
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
                  {recipe.image && (
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
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
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className={`flex items-center transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <Heart className="h-3 w-3 mr-1" />
                      {recipe.likes?.length || 0}
                    </span>
                    <span className={`flex items-center transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <Eye className="h-3 w-3 mr-1" />
                      {recipe.viewCount || 0}
                    </span>
                    <span className={`flex items-center transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {recipe.comments?.length || 0}
                    </span>
                  </div>
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
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div variants={containerVariants} className="space-y-8">
          {/* Date Range Filter */}
          <motion.div 
            variants={itemVariants}
            className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Analityka i statystyki
              </h3>
              <div className="flex items-center space-x-2">
                <Filter className={`h-4 w-4 transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="7d">Ostatnie 7 dni</option>
                  <option value="30d">Ostatnie 30 dni</option>
                  <option value="90d">Ostatnie 90 dni</option>
                  <option value="all">Cały czas</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: 'Średnia ocena',
                  value: '4.8',
                  icon: TrendingUp,
                  color: 'yellow'
                },
                {
                  label: 'Aktywni użytkownicy',
                  value: activeUsers,
                  icon: Activity,
                  color: 'green'
                },
                {
                  label: 'Zweryfikowani',
                  value: `${Math.round((verifiedUsers / allUsers.length) * 100)}%`,
                  icon: CheckCircle,
                  color: 'blue'
                },
                {
                  label: 'Współczynnik zaangażowania',
                  value: `${Math.round((totalLikes / totalViews) * 100)}%`,
                  icon: Heart,
                  color: 'red'
                }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className={`p-4 rounded-lg border transition-colors duration-300 ${
                    darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-2xl font-bold transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {metric.value}
                      </p>
                      <p className={`text-sm transition-colors duration-300 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {metric.label}
                      </p>
                    </div>
                    <metric.icon className={`h-8 w-8 text-${metric.color}-500`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Recipes */}
          <motion.div 
            variants={itemVariants}
            className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Najpopularniejsze przepisy
            </h3>
            <div className="space-y-4">
              {recipes
                .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
                .slice(0, 5)
                .map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-300 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className={`font-medium transition-colors duration-300 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {recipe.title}
                        </p>
                        <p className={`text-sm transition-colors duration-300 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {recipe.authorUsername}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`flex items-center transition-colors duration-300 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <Heart className="h-3 w-3 mr-1" />
                        {recipe.likes?.length || 0}
                      </span>
                      <span className={`flex items-center transition-colors duration-300 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <Eye className="h-3 w-3 mr-1" />
                        {recipe.viewCount || 0}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <motion.div 
          variants={itemVariants}
          className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Zgłoszenia i moderacja
          </h2>
          
          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border rounded-lg transition-colors duration-300 ${
                    darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      <span className={`font-medium transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Zgłoszenie {report.targetType}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Powód: {report.reason}
                  </p>
                  {report.description && (
                    <p className={`text-sm mb-2 transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Opis: {report.description}
                    </p>
                  )}
                  <p className={`text-xs transition-colors duration-300 ${
                    darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Zgłoszono: {new Date(report.createdAt).toLocaleDateString('pl-PL')}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className={`h-12 w-12 mx-auto mb-4 transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <p className={`transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Brak zgłoszeń do przeglądu
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <motion.div variants={containerVariants} className="space-y-8">
          {/* System Info */}
          <motion.div 
            variants={itemVariants}
            className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Informacje o systemie
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Wersja aplikacji:
                  </span>
                  <span className={`font-medium transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    v1.0.0 BETA
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Baza danych:
                  </span>
                  <span className="flex items-center">
                    <Database className="h-4 w-4 text-green-500 mr-1" />
                    <span className={`font-medium transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Połączono
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Status serwera:
                  </span>
                  <span className="flex items-center">
                    <Globe className="h-4 w-4 text-green-500 mr-1" />
                    <span className={`font-medium transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Online
                    </span>
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Ostatnia aktualizacja:
                  </span>
                  <span className={`font-medium transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {new Date().toLocaleDateString('pl-PL')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Czas działania:
                  </span>
                  <span className={`font-medium transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    99.9%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Środowisko:
                  </span>
                  <span className={`font-medium transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Production
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* System Actions */}
          <motion.div 
            variants={itemVariants}
            className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Akcje systemowe
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <RefreshCw className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                <div className="text-left">
                  <p className={`font-medium transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Odśwież cache
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Wyczyść pamięć podręczną systemu
                  </p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => exportData('analytics')}
                className="flex items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 transition-colors"
              >
                <Download className="h-5 w-5 mr-3 text-green-600 dark:text-green-400" />
                <div className="text-left">
                  <p className={`font-medium transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Backup danych
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Utwórz kopię zapasową
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

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