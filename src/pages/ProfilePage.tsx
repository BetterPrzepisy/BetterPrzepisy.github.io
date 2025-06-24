import React from 'react';
import { User, Calendar, BookOpen, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import RecipeCard from '../components/RecipeCard';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { getUserRecipes, friends } = useApp();

  const userRecipes = getUserRecipes(user?.id || '');

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 bg-orange-200 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-orange-600" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
            <p className="text-gray-600 mb-4">{user.email}</p>
            {user.bio && (
              <p className="text-gray-700">{user.bio}</p>
            )}
            
            <div className="flex items-center text-sm text-gray-500 mt-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Dołączył {new Date(user.createdAt).toLocaleDateString('pl-PL')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{userRecipes.length}</p>
          <p className="text-gray-600">Przepisy</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{friends.length}</p>
          <p className="text-gray-600">Znajomi</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="p-3 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
          </p>
          <p className="text-gray-600">Dni z nami</p>
        </div>
      </div>

      {/* User's Recipes */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Moje przepisy</h2>
        
        {userRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRecipes.map((recipe) => (
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
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Brak przepisów
            </h3>
            <p className="text-gray-600 mb-6">
              Nie dodałeś jeszcze żadnego przepisu. Podziel się swoimi ulubionymi potrawami!
            </p>
            <button className="bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors">
              Dodaj pierwszy przepis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;