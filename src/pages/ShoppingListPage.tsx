import React from 'react';
import { ShoppingCart, Plus, Trash2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';

const ShoppingListPage: React.FC = () => {
  const { shoppingList, toggleShoppingItem, clearShoppingList } = useApp();
  const { darkMode } = useTheme();

  const checkedItems = shoppingList.filter(item => item.checked);
  const uncheckedItems = shoppingList.filter(item => !item.checked);

  const groupedByRecipe = shoppingList.reduce((acc, item) => {
    const key = item.recipeTitle || 'Inne';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof shoppingList>);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className={`h-8 w-8 mr-3 transition-colors duration-300 ${
              darkMode ? 'text-orange-400' : 'text-orange-600'
            }`} />
            <div>
              <h1 className={`text-3xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Lista zakupów
              </h1>
              <p className={`transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {shoppingList.length} przedmiot{shoppingList.length !== 1 ? 'ów' : ''} na liście
              </p>
            </div>
          </div>
          
          {shoppingList.length > 0 && (
            <button
              onClick={clearShoppingList}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                darkMode 
                  ? 'bg-red-900 text-red-200 hover:bg-red-800' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Wyczyść listę
            </button>
          )}
        </div>
      </motion.div>

      {/* Progress */}
      {shoppingList.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl p-6 mb-8 shadow-md transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Postęp zakupów
            </h2>
            <span className={`text-sm transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {checkedItems.length} z {shoppingList.length}
            </span>
          </div>
          
          <div className={`w-full rounded-full h-3 transition-colors duration-300 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(checkedItems.length / shoppingList.length) * 100}%` }}
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
            />
          </div>
        </motion.div>
      )}

      {/* Shopping List */}
      {shoppingList.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedByRecipe).map(([recipeTitle, items], groupIndex) => (
            <motion.div
              key={recipeTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (groupIndex + 2) }}
              className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {recipeTitle}
              </h3>
              
              <div className="space-y-3">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                      item.checked 
                        ? darkMode 
                          ? 'bg-green-900 bg-opacity-30' 
                          : 'bg-green-50'
                        : darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <button
                      onClick={() => toggleShoppingItem(item.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        item.checked
                          ? 'bg-green-500 border-green-500'
                          : darkMode
                            ? 'border-gray-500 hover:border-green-400'
                            : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {item.checked && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </button>
                    
                    <span className={`ml-3 flex-1 transition-all duration-200 ${
                      item.checked 
                        ? darkMode 
                          ? 'text-gray-400 line-through' 
                          : 'text-gray-500 line-through'
                        : darkMode 
                          ? 'text-gray-200' 
                          : 'text-gray-900'
                    }`}>
                      {item.ingredient}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <div className={`rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center transition-colors duration-300 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <ShoppingCart className={`h-8 w-8 transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Lista zakupów jest pusta
          </h3>
          <p className={`mb-6 transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Dodaj składniki z przepisów, aby utworzyć listę zakupów.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => window.history.back()}
              className="bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors"
            >
              Przeglądaj przepisy
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ShoppingListPage;