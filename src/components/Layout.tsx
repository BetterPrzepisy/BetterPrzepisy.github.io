import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, User, Users, Plus, Search, LogOut, Shield, CheckCircle, ShoppingCart, TrendingUp, Settings, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Główna', shortLabel: 'Główna' },
    { path: '/discover', icon: Search, label: 'Odkrywaj', shortLabel: 'Odkrywaj' },
    { path: '/trending', icon: TrendingUp, label: 'Popularne', shortLabel: 'Popularne' },
    { path: '/create-recipe', icon: Plus, label: 'Dodaj przepis', shortLabel: 'Dodaj' },
    { path: '/shopping-list', icon: ShoppingCart, label: 'Lista zakupów', shortLabel: 'Lista' },
    { path: '/friends', icon: Users, label: 'Znajomi', shortLabel: 'Znajomi' },
    { path: '/profile', icon: User, label: 'Profil', shortLabel: 'Profil' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`flex min-h-0 flex-1 flex-col shadow-lg transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold theme-primary-text">
                BetterPrzepisy
              </h1>
              <h2 className="text-xs font-bold text-green-500 ml-2">BETA</h2>
            </div>
            
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive(path) 
                      ? 'theme-bg-light theme-text-light' 
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive(path) ? 'theme-icon' : ''}`} />
                  {label}
                </Link>
              ))}
              
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive('/admin') 
                      ? 'bg-red-100 text-red-900' 
                      : darkMode
                        ? 'text-red-400 hover:bg-red-900 hover:text-red-200'
                        : 'text-red-600 hover:bg-red-50 hover:text-red-900'
                  }`}
                >
                  <Shield className="mr-3 h-5 w-5" />
                  Panel Admina
                </Link>
              )}
            </nav>
          </div>
          
          <div className={`flex-shrink-0 flex border-t p-4 transition-colors duration-300 ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  user.role === 'admin' 
                    ? darkMode ? 'bg-red-800' : 'bg-red-200' 
                    : 'theme-bg-light'
                }`}>
                  {user.role === 'admin' ? (
                    <Shield className={`h-5 w-5 ${darkMode ? 'text-red-200' : 'text-red-600'}`} />
                  ) : (
                    <User className="h-5 w-5 theme-icon" />
                  )}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {user.displayName || user.username}
                  </p>
                  {user.isVerified && (
                    <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />
                  )}
                </div>
                {user.role === 'admin' && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
                <div className="flex items-center mt-1 space-x-2">
                  <button
                    onClick={toggleDarkMode}
                    className={`text-xs hover:text-gray-700 flex items-center transition-colors duration-200 ${
                      darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500'
                    }`}
                  >
                    {darkMode ? <Sun className="h-3 w-3 mr-1" /> : <Moon className="h-3 w-3 mr-1" />}
                    {darkMode ? 'Jasny' : 'Ciemny'}
                  </button>
                  <Link
                    to="/settings"
                    className={`text-xs hover:text-gray-700 flex items-center transition-colors duration-200 ${
                      darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500'
                    }`}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Ustawienia
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`text-xs hover:text-gray-700 flex items-center transition-colors duration-200 ${
                      darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500'
                    }`}
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Wyloguj
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile bottom navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t px-4 py-2 transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex justify-around">
          {navItems.slice(0, 5).map(({ path, icon: Icon, shortLabel }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive(path) 
                  ? 'theme-primary-text theme-bg-light' 
                  : darkMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{shortLabel}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;