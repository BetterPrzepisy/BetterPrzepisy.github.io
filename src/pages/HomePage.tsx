import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import RecipeCard from '../components/RecipeCard';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { recipes, getFriendRecipes, getUserRecipes } = useApp();

  const userRecipes = getUserRecipes(user?.id || '');
  const friendRecipes = getFriendRecipes();
  const recentRecipes = [...userRecipes, ...friendRecipes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Witaj z powrotem, {user?.username}! 👋
              </h1>
              <p className="text-orange-100 text-lg">
                Gotowy na kolejne kulinarne przygody?
              </p>
            </div>
            <div className="hidden md:block">
              <Link
                to="/create-recipe"
                className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-orange-50 transition-colors flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Dodaj przepis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{userRecipes.length}</p>
              <p className="text-gray-600">Twoje przepisy</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Sparkles className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{friendRecipes.length}</p>
              <p className="text-gray-600">Od znajomych</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Plus className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{recipes.length}</p>
              <p className="text-gray-600">Wszystkie przepisy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Recipes */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Najnowsze przepisy</h2>
          <Link
            to="/discover"
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            Zobacz więcej →
          </Link>
        </div>

        {recentRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => {/* Navigate to recipe detail */}}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Brak przepisów
            </h3>
            <p className="text-gray-600 mb-6">
              Zacznij dodawać przepisy lub dodaj znajomych, aby zobaczyć ich przepisy tutaj.
            </p>
            <div className="space-x-4">
              <Link
                to="/create-recipe"
                className="bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors inline-flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Dodaj przepis
              </Link>
              <Link
                to="/friends"
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
              >
                Znajdź znajomych
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;