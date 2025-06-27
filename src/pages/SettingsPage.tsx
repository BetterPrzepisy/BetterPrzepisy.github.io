import React, { useState } from 'react';
import { Settings, Palette, Moon, Sun, Bell, Shield, User, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { darkMode, toggleDarkMode, currentTheme, setTheme, availableThemes } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    newFollowers: true,
    recipeComments: true,
    recipeLikes: false,
    weeklyDigest: true
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4">
          <Settings className={`h-8 w-8 mr-3 transition-colors duration-300 ${
            darkMode ? 'text-orange-400' : 'text-orange-600'
          }`} />
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ustawienia
          </h1>
        </div>
        <p className={`transition-colors duration-300 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Dostosuj aplikację do swoich preferencji
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center mb-6">
            <Palette className={`h-6 w-6 mr-3 transition-colors duration-300 ${
              darkMode ? 'text-orange-400' : 'text-orange-600'
            }`} />
            <h2 className={`text-xl font-semibold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Wygląd
            </h2>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              {darkMode ? (
                <Sun className={`h-5 w-5 mr-3 transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
              ) : (
                <Moon className={`h-5 w-5 mr-3 transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
              )}
              <div>
                <p className={`font-medium transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Tryb ciemny
                </p>
                <p className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Przełącz między jasnym a ciemnym motywem
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                darkMode ? 'bg-orange-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Theme Selection */}
          <div>
            <p className={`font-medium mb-4 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Motyw kolorystyczny
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    currentTheme.id === theme.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900'
                      : darkMode
                        ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                  </div>
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {theme.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center mb-6">
            <Bell className={`h-6 w-6 mr-3 transition-colors duration-300 ${
              darkMode ? 'text-orange-400' : 'text-orange-600'
            }`} />
            <h2 className={`text-xl font-semibold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Powiadomienia
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                key: 'newFollowers' as const,
                title: 'Nowi obserwujący',
                description: 'Powiadom mnie, gdy ktoś zacznie mnie obserwować'
              },
              {
                key: 'recipeComments' as const,
                title: 'Komentarze do przepisów',
                description: 'Powiadom mnie o nowych komentarzach do moich przepisów'
              },
              {
                key: 'recipeLikes' as const,
                title: 'Polubienia przepisów',
                description: 'Powiadom mnie, gdy ktoś polubi mój przepis'
              },
              {
                key: 'weeklyDigest' as const,
                title: 'Tygodniowe podsumowanie',
                description: 'Otrzymuj cotygodniowe podsumowanie aktywności'
              }
            ].map(({ key, title, description }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className={`font-medium transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {title}
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {description}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    notifications[key] ? 'bg-orange-600' : darkMode ? 'bg-gray-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      notifications[key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center mb-6">
            <User className={`h-6 w-6 mr-3 transition-colors duration-300 ${
              darkMode ? 'text-orange-400' : 'text-orange-600'
            }`} />
            <h2 className={`text-xl font-semibold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Konto
            </h2>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-lg transition-colors duration-300 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <p className={`font-medium transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user?.displayName || user?.username}
              </p>
              <p className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {user?.email}
              </p>
              {user?.role === 'admin' && (
                <div className="flex items-center mt-2">
                  <Shield className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-500 font-medium">Administrator</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center font-medium">
            <Save className="h-5 w-5 mr-2" />
            Zapisz ustawienia
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;