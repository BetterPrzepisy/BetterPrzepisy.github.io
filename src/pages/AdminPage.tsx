import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Users, 
  BookOpen, 
  TrendingUp, 
  AlertTriangle, 
  Settings,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  UserCheck,
  UserX,
  Crown,
  Star,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Navigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { user, getAllUsers, updateUserRole } = useAuth();
  const { 
    recipes, 
    reports, 
    notifications, 
    deleteUser, 
    deleteRecipe,
    clearAllNotifications 
  } = useApp();
  const { darkMode } = useTheme();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'admin' | 'user' | 'verified'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'recipes' | 'role'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const allUsers = getAllUsers();

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalUsers = allUsers.length;
    const totalRecipes = recipes.length;
    const totalReports = reports.length;
    const pendingReports = reports.filter(r => r.status === 'pending').length;
    
    const usersByRole = allUsers.reduce((acc, user) => {
      acc[user.role || 'user'] = (acc[user.role || 'user'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const verifiedUsers = allUsers.filter(u => u.isVerified).length;
    
    const recipesByCategory = recipes.reduce((acc, recipe) => {
      const category = recipe.category || 'Inne';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalLikes = recipes.reduce((sum, recipe) => sum + (recipe.likes?.length || 0), 0);
    const totalViews = recipes.reduce((sum, recipe) => sum + (recipe.viewCount || 0), 0);
    const totalComments = recipes.reduce((sum, recipe) => sum + (recipe.comments?.length || 0), 0);

    // User activity in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = allUsers.filter(u => new Date(u.createdAt) >= thirtyDaysAgo).length;
    const recentRecipes = recipes.filter(r => new Date(r.createdAt) >= thirtyDaysAgo).length;

    // Top users by recipes
    const userRecipeCounts = allUsers.map(user => ({
      ...user,
      recipeCount: recipes.filter(r => r.authorId === user.id).length,
      totalLikes: recipes
        .filter(r => r.authorId === user.id)
        .reduce((sum, r) => sum + (r.likes?.length || 0), 0)
    })).sort((a, b) => b.recipeCount - a.recipeCount);

    return {
      totalUsers,
      totalRecipes,
      totalReports,
      pendingReports,
      usersByRole,
      verifiedUsers,
      recipesByCategory,
      totalLikes,
      totalViews,
      totalComments,
      recentUsers,
      recentRecipes,
      topUsers: userRecipeCounts.slice(0, 10),
      averageRecipesPerUser: totalUsers > 0 ? (totalRecipes / totalUsers).toFixed(1) : '0'
    };
  }, [allUsers, recipes, reports]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = allUsers.filter(u => {
      const matchesSearch = !searchQuery || 
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.displayName && u.displayName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = userFilter === 'all' || 
        (userFilter === 'admin' && u.role === 'admin') ||
        (userFilter === 'user' && u.role !== 'admin') ||
        (userFilter === 'verified' && u.isVerified);
      
      return matchesSearch && matchesFilter;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.username.toLowerCase();
          bValue = b.username.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'recipes':
          aValue = recipes.filter(r => r.authorId === a.id).length;
          bValue = recipes.filter(r => r.authorId === b.id).length;
          break;
        case 'role':
          aValue = a.role === 'admin' ? 1 : 0;
          bValue = b.role === 'admin' ? 1 : 0;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [allUsers, searchQuery, userFilter, sortBy, sortOrder, recipes]);

  const handleDeleteUser = async (userId: string) => {
    const userToDelete = allUsers.find(u => u.id === userId);
    if (!userToDelete) return;

    if (userToDelete.role === 'admin') {
      alert('Nie można usunąć konta administratora');
      return;
    }

    if (window.confirm(`Czy na pewno chcesz usunąć użytkownika ${userToDelete.username}? Ta akcja nie może zostać cofnięta.`)) {
      deleteUser(userId);
    }
  };

  const handleBulkDelete = () => {
    const adminUsers = selectedUsers.filter(id => {
      const user = allUsers.find(u => u.id === id);
      return user?.role === 'admin';
    });

    if (adminUsers.length > 0) {
      alert('Nie można usunąć kont administratorów');
      return;
    }

    if (window.confirm(`Czy na pewno chcesz usunąć ${selectedUsers.length} użytkowników? Ta akcja nie może zostać cofnięta.`)) {
      selectedUsers.forEach(userId => deleteUser(userId));
      setSelectedUsers([]);
    }
  };

  const handleToggleUserRole = async (userId: string) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return;

    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const success = await updateUserRole(userId, newRole, targetUser.isVerified || false);
    
    if (success) {
      // Refresh will happen automatically through context
    }
  };

  const handleToggleVerification = async (userId: string) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return;

    const success = await updateUserRole(userId, targetUser.role || 'user', !targetUser.isVerified);
    
    if (success) {
      // Refresh will happen automatically through context
    }
  };

  const exportData = (type: 'users' | 'recipes' | 'analytics') => {
    let data: any;
    let filename: string;

    switch (type) {
      case 'users':
        data = allUsers.map(({ ...user }) => ({
          ...user,
          recipeCount: recipes.filter(r => r.authorId === user.id).length
        }));
        filename = 'users_export.json';
        break;
      case 'recipes':
        data = recipes;
        filename = 'recipes_export.json';
        break;
      case 'analytics':
        data = analytics;
        filename = 'analytics_export.json';
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

  const tabs = [
    { id: 'overview', label: 'Przegląd', icon: BarChart3 },
    { id: 'users', label: 'Użytkownicy', icon: Users },
    { id: 'recipes', label: 'Przepisy', icon: BookOpen },
    { id: 'analytics', label: 'Analityka', icon: TrendingUp },
    { id: 'reports', label: 'Zgłoszenia', icon: AlertTriangle },
    { id: 'system', label: 'System', icon: Settings }
  ];

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
            className="p-3 bg-red-100 dark:bg-red-900 rounded-full mr-4"
          >
            <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
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
              Zarządzaj platformą BetterPrzepisy
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className={`border-b transition-colors duration-300 ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : darkMode
                      ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
                {tab.id === 'reports' && analytics.pendingReports > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {analytics.pendingReports}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Użytkownicy',
                    value: analytics.totalUsers,
                    change: `+${analytics.recentUsers} w tym miesiącu`,
                    icon: Users,
                    color: 'blue'
                  },
                  {
                    title: 'Przepisy',
                    value: analytics.totalRecipes,
                    change: `+${analytics.recentRecipes} w tym miesiącu`,
                    icon: BookOpen,
                    color: 'green'
                  },
                  {
                    title: 'Zgłoszenia',
                    value: analytics.totalReports,
                    change: `${analytics.pendingReports} oczekujących`,
                    icon: AlertTriangle,
                    color: 'red'
                  },
                  {
                    title: 'Wyświetlenia',
                    value: analytics.totalViews,
                    change: `${analytics.totalLikes} polubień`,
                    icon: Eye,
                    color: 'purple'
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`rounded-xl p-6 shadow-md transition-all duration-300 ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-full`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                      </div>
                      <div className="ml-4">
                        <p className={`text-2xl font-bold transition-colors duration-300 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {stat.value.toLocaleString()}
                        </p>
                        <p className={`text-sm transition-colors duration-300 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {stat.title}
                        </p>
                        <p className={`text-xs mt-1 transition-colors duration-300 ${
                          darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {stat.change}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts and Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Roles Distribution */}
                <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Podział użytkowników
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(analytics.usersByRole).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <div className="flex items-center">
                          {role === 'admin' ? (
                            <Crown className="h-4 w-4 text-red-500 mr-2" />
                          ) : (
                            <Users className="h-4 w-4 text-blue-500 mr-2" />
                          )}
                          <span className={`transition-colors duration-300 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {role === 'admin' ? 'Administratorzy' : 'Użytkownicy'}
                          </span>
                        </div>
                        <span className={`font-semibold transition-colors duration-300 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {count}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className={`transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Zweryfikowani
                        </span>
                      </div>
                      <span className={`font-semibold transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {analytics.verifiedUsers}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recipe Categories */}
                <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Kategorie przepisów
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(analytics.recipesByCategory)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className={`transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {category}
                        </span>
                        <div className="flex items-center">
                          <div className={`w-20 h-2 rounded-full mr-3 transition-colors duration-300 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <div 
                              className="h-2 bg-blue-500 rounded-full"
                              style={{ 
                                width: `${(count / Math.max(...Object.values(analytics.recipesByCategory))) * 100}%` 
                              }}
                            />
                          </div>
                          <span className={`font-semibold transition-colors duration-300 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Users */}
              <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Najbardziej aktywni użytkownicy
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b transition-colors duration-300 ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <th className={`text-left py-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Użytkownik
                        </th>
                        <th className={`text-left py-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Przepisy
                        </th>
                        <th className={`text-left py-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Polubienia
                        </th>
                        <th className={`text-left py-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topUsers.slice(0, 5).map((user, index) => (
                        <tr key={user.id} className={`border-b transition-colors duration-300 ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors duration-300 ${
                                user.role === 'admin' 
                                  ? 'bg-red-100 dark:bg-red-900' 
                                  : 'bg-blue-100 dark:bg-blue-900'
                              }`}>
                                {user.role === 'admin' ? (
                                  <Crown className="h-4 w-4 text-red-600 dark:text-red-400" />
                                ) : (
                                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <span className={`font-medium transition-colors duration-300 ${
                                    darkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {user.username}
                                  </span>
                                  {user.isVerified && (
                                    <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />
                                  )}
                                </div>
                                <span className={`text-sm transition-colors duration-300 ${
                                  darkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className={`py-3 font-semibold transition-colors duration-300 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {user.recipeCount}
                          </td>
                          <td className={`py-3 font-semibold transition-colors duration-300 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {user.totalLikes}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              {user.role === 'admin' ? 'Admin' : 'Użytkownik'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* User Management Controls */}
              <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
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
                    
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value as any)}
                      className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white' 
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                    >
                      <option value="all">Wszyscy użytkownicy</option>
                      <option value="admin">Administratorzy</option>
                      <option value="user">Zwykli użytkownicy</option>
                      <option value="verified">Zweryfikowani</option>
                    </select>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                          darkMode 
                            ? 'border-gray-600 bg-gray-700 text-white' 
                            : 'border-gray-300 bg-white text-gray-900'
                        }`}
                      >
                        <option value="name">Sortuj po nazwie</option>
                        <option value="date">Sortuj po dacie</option>
                        <option value="recipes">Sortuj po przepisach</option>
                        <option value="role">Sortuj po roli</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {selectedUsers.length > 0 && (
                      <button
                        onClick={handleBulkDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Usuń zaznaczonych ({selectedUsers.length})
                      </button>
                    )}
                    <button
                      onClick={() => exportData('users')}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Eksportuj
                    </button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b transition-colors duration-300 ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <th className="text-left py-3 px-2">
                          <input
                            type="checkbox"
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(filteredUsers.map(u => u.id));
                              } else {
                                setSelectedUsers([]);
                              }
                            }}
                            className="rounded"
                          />
                        </th>
                        <th className={`text-left py-3 px-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Użytkownik
                        </th>
                        <th className={`text-left py-3 px-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Email
                        </th>
                        <th className={`text-left py-3 px-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Rola
                        </th>
                        <th className={`text-left py-3 px-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Przepisy
                        </th>
                        <th className={`text-left py-3 px-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Data dołączenia
                        </th>
                        <th className={`text-left py-3 px-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Akcje
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const userRecipeCount = recipes.filter(r => r.authorId === user.id).length;
                        return (
                          <motion.tr 
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`border-b transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                              darkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}
                          >
                            <td className="py-3 px-2">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUsers([...selectedUsers, user.id]);
                                  } else {
                                    setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                  }
                                }}
                                className="rounded"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors duration-300 ${
                                  user.role === 'admin' 
                                    ? 'bg-red-100 dark:bg-red-900' 
                                    : 'bg-blue-100 dark:bg-blue-900'
                                }`}>
                                  {user.role === 'admin' ? (
                                    <Crown className="h-4 w-4 text-red-600 dark:text-red-400" />
                                  ) : (
                                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center">
                                    <span className={`font-medium transition-colors duration-300 ${
                                      darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                      {user.displayName || user.username}
                                    </span>
                                    {user.isVerified && (
                                      <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />
                                    )}
                                  </div>
                                  <span className={`text-sm transition-colors duration-300 ${
                                    darkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    @{user.username}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className={`py-3 px-2 transition-colors duration-300 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {user.email}
                            </td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                {user.role === 'admin' ? 'Admin' : 'Użytkownik'}
                              </span>
                            </td>
                            <td className={`py-3 px-2 font-semibold transition-colors duration-300 ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {userRecipeCount}
                            </td>
                            <td className={`py-3 px-2 transition-colors duration-300 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleToggleVerification(user.id)}
                                  className={`p-1 rounded transition-colors ${
                                    user.isVerified
                                      ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
                                      : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                  }`}
                                  title={user.isVerified ? 'Usuń weryfikację' : 'Zweryfikuj użytkownika'}
                                >
                                  {user.isVerified ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                                </button>
                                <button
                                  onClick={() => handleToggleUserRole(user.id)}
                                  className={`p-1 rounded transition-colors ${
                                    user.role === 'admin'
                                      ? 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900'
                                      : 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900'
                                  }`}
                                  title={user.role === 'admin' ? 'Usuń uprawnienia admina' : 'Nadaj uprawnienia admina'}
                                >
                                  {user.role === 'admin' ? <Crown className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                                </button>
                                {user.role !== 'admin' && (
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="p-1 rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                    title="Usuń użytkownika"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className={`h-12 w-12 mx-auto mb-4 transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                    <p className={`transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Nie znaleziono użytkowników spełniających kryteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recipes Tab */}
          {activeTab === 'recipes' && (
            <div className="space-y-6">
              <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Zarządzanie przepisami ({recipes.length})
                  </h3>
                  <button
                    onClick={() => exportData('recipes')}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Eksportuj przepisy
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b transition-colors duration-300 ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <th className={`text-left py-3 px-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Przepis
                        </th>
                        <th className={`text-left py-3 px-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Autor
                        </th>
                        <th className={`text-left py-3 px-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Kategoria
                        </th>
                        <th className={`text-left py-3 px-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Statystyki
                        </th>
                        <th className={`text-left py-3 px-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Data
                        </th>
                        <th className={`text-left py-3 px-2 transition-colors duration-300 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Akcje
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipes.slice(0, 20).map((recipe) => {
                        const author = allUsers.find(u => u.id === recipe.authorId);
                        return (
                          <motion.tr 
                            key={recipe.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`border-b transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                              darkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}
                          >
                            <td className="py-3 px-2">
                              <div className="flex items-center">
                                {recipe.image && (
                                  <img 
                                    src={recipe.image} 
                                    alt={recipe.title}
                                    className="w-10 h-10 rounded-lg object-cover mr-3"
                                  />
                                )}
                                <div>
                                  <span className={`font-medium transition-colors duration-300 ${
                                    darkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {recipe.title}
                                  </span>
                                  {recipe.difficulty && (
                                    <div className="flex items-center mt-1">
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        recipe.difficulty === 'łatwy' 
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                          : recipe.difficulty === 'średni'
                                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                      }`}>
                                        {recipe.difficulty}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center">
                                <span className={`transition-colors duration-300 ${
                                  darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {recipe.authorUsername}
                                </span>
                                {author?.isVerified && (
                                  <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />
                                )}
                              </div>
                            </td>
                            <td className={`py-3 px-2 transition-colors duration-300 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {recipe.category || 'Brak'}
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center space-x-3 text-sm">
                                <div className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1 text-blue-500" />
                                  <span className={`transition-colors duration-300 ${
                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                  }`}>
                                    {recipe.viewCount || 0}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Heart className="h-3 w-3 mr-1 text-red-500" />
                                  <span className={`transition-colors duration-300 ${
                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                  }`}>
                                    {recipe.likes?.length || 0}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <MessageCircle className="h-3 w-3 mr-1 text-green-500" />
                                  <span className={`transition-colors duration-300 ${
                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                  }`}>
                                    {recipe.comments?.length || 0}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className={`py-3 px-2 transition-colors duration-300 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {new Date(recipe.createdAt).toLocaleDateString('pl-PL')}
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => window.open(`/recipe/${recipe.id}`, '_blank')}
                                  className="p-1 rounded text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                                  title="Zobacz przepis"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Czy na pewno chcesz usunąć przepis "${recipe.title}"?`)) {
                                      deleteRecipe(recipe.id);
                                    }
                                  }}
                                  className="p-1 rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                  title="Usuń przepis"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Platform Statistics */}
                <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Statystyki platformy
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={`transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Średnia przepisów na użytkownika
                      </span>
                      <span className={`font-bold transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {analytics.averageRecipesPerUser}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Łączne polubienia
                      </span>
                      <span className={`font-bold transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {analytics.totalLikes.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Łączne wyświetlenia
                      </span>
                      <span className={`font-bold transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {analytics.totalViews.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Łączne komentarze
                      </span>
                      <span className={`font-bold transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {analytics.totalComments.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Growth Metrics */}
                <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Wzrost w ostatnim miesiącu
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={`transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Nowi użytkownicy
                      </span>
                      <span className="font-bold text-green-600">
                        +{analytics.recentUsers}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Nowe przepisy
                      </span>
                      <span className="font-bold text-green-600">
                        +{analytics.recentRecipes}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Wskaźnik weryfikacji
                      </span>
                      <span className={`font-bold transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {((analytics.verifiedUsers / analytics.totalUsers) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => exportData('analytics')}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Eksportuj analitykę
                </button>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Zgłoszenia ({reports.length})
                </h3>
                
                {reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className={`p-4 border rounded-lg transition-colors duration-300 ${
                        darkMode ? 'border-gray-600' : 'border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              report.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : report.status === 'reviewed'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {report.status === 'pending' ? 'Oczekujące' : 
                               report.status === 'reviewed' ? 'Sprawdzone' : 'Rozwiązane'}
                            </span>
                            <span className={`text-sm transition-colors duration-300 ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {report.targetType === 'recipe' ? 'Przepis' : 
                               report.targetType === 'comment' ? 'Komentarz' : 'Użytkownik'}
                            </span>
                          </div>
                          <span className={`text-sm transition-colors duration-300 ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {new Date(report.createdAt).toLocaleDateString('pl-PL')}
                          </span>
                        </div>
                        <p className={`font-medium transition-colors duration-300 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Powód: {report.reason}
                        </p>
                        {report.description && (
                          <p className={`text-sm mt-1 transition-colors duration-300 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {report.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className={`h-12 w-12 mx-auto mb-4 transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                    <p className={`transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Brak zgłoszeń
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Ustawienia systemowe
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Wyczyść wszystkie powiadomienia
                      </p>
                      <p className={`text-sm transition-colors duration-300 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Usuń wszystkie powiadomienia z systemu
                      </p>
                    </div>
                    <button
                      onClick={clearAllNotifications}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Wyczyść
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Status systemu
                      </p>
                      <p className={`text-sm transition-colors duration-300 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Wszystkie usługi działają prawidłowo
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-green-600 font-medium">Online</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Wersja aplikacji
                      </p>
                      <p className={`text-sm transition-colors duration-300 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        BetterPrzepisy v2.0.0
                      </p>
                    </div>
                    <span className={`font-medium transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Najnowsza
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminPage;