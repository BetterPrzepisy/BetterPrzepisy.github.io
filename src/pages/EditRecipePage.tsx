import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Clock, Users, ChefHat, Upload, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const EditRecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipeById, updateRecipe } = useApp();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  
  const recipe = id ? getRecipeById(id) : undefined;
  
  const [formData, setFormData] = useState({
    title: '',
    ingredients: [''],
    instructions: '',
    cookingTime: '',
    servings: '',
    difficulty: 'łatwy' as const,
    category: '',
    tags: [] as string[],
    image: ''
  });
  
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title,
        ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [''],
        instructions: recipe.instructions,
        cookingTime: recipe.cookingTime?.toString() || '',
        servings: recipe.servings?.toString() || '',
        difficulty: recipe.difficulty || 'łatwy',
        category: recipe.category || '',
        tags: recipe.tags || [],
        image: recipe.image || ''
      });
    }
  }, [recipe]);

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Przepis nie został znaleziony
          </h1>
          <p className={`mb-6 transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Przepis, który chcesz edytować, nie istnieje lub został usunięty.
          </p>
          <button
            onClick={() => navigate('/')}
            className="theme-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Wróć do strony głównej
          </button>
        </div>
      </div>
    );
  }

  if (recipe.authorId !== user?.id && user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Brak uprawnień
          </h1>
          <p className={`mb-6 transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Nie masz uprawnień do edycji tego przepisu.
          </p>
          <button
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            className="theme-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Wróć do przepisu
          </button>
        </div>
      </div>
    );
  }

  const handleAddIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!formData.title || !formData.instructions || formData.ingredients.every(ing => !ing.trim())) {
      setError('Proszę wypełnić wszystkie wymagane pola');
      setIsLoading(false);
      return;
    }

    const filteredIngredients = formData.ingredients.filter(ing => ing.trim());
    
    try {
      updateRecipe(recipe.id, {
        title: formData.title,
        ingredients: filteredIngredients,
        instructions: formData.instructions,
        cookingTime: formData.cookingTime ? parseInt(formData.cookingTime) : undefined,
        servings: formData.servings ? parseInt(formData.servings) : undefined,
        difficulty: formData.difficulty,
        category: formData.category || undefined,
        tags: formData.tags,
        image: formData.image || undefined
      });

      navigate(`/recipe/${recipe.id}`);
    } catch (error) {
      setError('Wystąpił błąd podczas zapisywania przepisu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(`/recipe/${recipe.id}`)}
        className={`flex items-center mb-6 transition-colors duration-300 ${
          darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Wróć do przepisu
      </motion.button>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Edytuj przepis
        </h1>
        <p className={`transition-colors duration-300 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Zaktualizuj swój przepis
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Basic Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Podstawowe informacje
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Nazwa przepisu *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                placeholder="np. Pierogi z kapustą i grzybami"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="image" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Upload className="inline h-4 w-4 mr-1" />
                URL zdjęcia
              </label>
              <input
                type="url"
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label htmlFor="cookingTime" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Clock className="inline h-4 w-4 mr-1" />
                Czas przygotowania (minuty)
              </label>
              <input
                type="number"
                id="cookingTime"
                value={formData.cookingTime}
                onChange={(e) => setFormData(prev => ({ ...prev, cookingTime: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                placeholder="60"
              />
            </div>

            <div>
              <label htmlFor="servings" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Users className="inline h-4 w-4 mr-1" />
                Liczba porcji
              </label>
              <input
                type="number"
                id="servings"
                value={formData.servings}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                placeholder="4"
              />
            </div>

            <div>
              <label htmlFor="difficulty" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Poziom trudności
              </label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                <option value="łatwy">Łatwy</option>
                <option value="średni">Średni</option>
                <option value="trudny">Trudny</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <ChefHat className="inline h-4 w-4 mr-1" />
                Kategoria
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
                placeholder="np. Dania główne, Desery, Zupy"
              />
            </div>
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Tagi
          </h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm flex items-center transition-colors duration-300 ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Dodaj tag..."
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="theme-primary text-white px-4 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Ingredients */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Składniki *
          </h2>
          
          <div className="space-y-3">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder={`Składnik ${index + 1}`}
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={handleAddIngredient}
            className="mt-4 flex items-center theme-primary-text hover:opacity-80 font-medium transition-opacity"
          >
            <Plus className="h-5 w-5 mr-2" />
            Dodaj składnik
          </button>
        </motion.div>

        {/* Instructions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-xl shadow-md p-6 transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Sposób przygotowania *
          </h2>
          
          <textarea
            required
            value={formData.instructions}
            onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
            rows={8}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-vertical ${
              darkMode 
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
            }`}
            placeholder="Opisz krok po kroku, jak przygotować to danie..."
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end space-x-4"
        >
          <button
            type="button"
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="theme-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            Zapisz zmiany
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipePage;