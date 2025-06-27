import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, User, Users, Plus, Search, LogOut, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow-lg">
          <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-orange-600">BetterPrzepisy</h1>
              <h2 className="text-xs font-bold text-green-500 ml-2">BETA</h2>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              <Link
                to="/"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/') 
                    ? 'bg-orange-100 text-orange-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Home className="mr-3 h-5 w-5" />
                Strona główna
              </Link>
              <Link
                to="/profile"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/profile') 
                    ? 'bg-orange-100 text-orange-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <User className="mr-3 h-5 w-5" />
                Profil
              </Link>
              <Link
                to="/friends"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/friends') 
                    ? 'bg-orange-100 text-orange-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Users className="mr-3 h-5 w-5" />
                Znajomi
              </Link>
              <Link
                to="/discover"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/discover') 
                    ? 'bg-orange-100 text-orange-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Search className="mr-3 h-5 w-5" />
                Odkrywaj
              </Link>
              <Link
                to="/create-recipe"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/create-recipe') 
                    ? 'bg-orange-100 text-orange-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Plus className="mr-3 h-5 w-5" />
                Dodaj przepis
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive('/admin') 
                      ? 'bg-red-100 text-red-900' 
                      : 'text-red-600 hover:bg-red-50 hover:text-red-900'
                  }`}
                >
                  <Shield className="mr-3 h-5 w-5" />
                  Panel Admina
                </Link>
              )}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  user.role === 'admin' ? 'bg-red-200' : 'bg-orange-200'
                }`}>
                  {user.role === 'admin' ? (
                    <Shield className="h-5 w-5 text-red-600" />
                  ) : (
                    <User className="h-5 w-5 text-orange-600" />
                  )}
                </div>
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-700">
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
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center mt-1"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Wyloguj
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <Link
            to="/"
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              isActive('/') ? 'text-orange-600 bg-orange-50' : 'text-gray-600'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Główna</span>
          </Link>
          <Link
            to="/discover"
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              isActive('/discover') ? 'text-orange-600 bg-orange-50' : 'text-gray-600'
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Odkrywaj</span>
          </Link>
          <Link
            to="/create-recipe"
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              isActive('/create-recipe') ? 'text-orange-600 bg-orange-50' : 'text-gray-600'
            }`}
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs mt-1">Dodaj</span>
          </Link>
          <Link
            to="/friends"
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              isActive('/friends') ? 'text-orange-600 bg-orange-50' : 'text-gray-600'
            }`}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Znajomi</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              isActive('/profile') ? 'text-orange-600 bg-orange-50' : 'text-gray-600'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profil</span>
          </Link>
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