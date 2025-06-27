import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, User, CheckCircle, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipeById } = useApp();
  const { getAllUsers } = useAuth();

  const recipe = id ? getRecipeById(id) : undefined;

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Przepis nie został znaleziony</h1>
          <p className="text-gray-600 mb-6">Przepis, którego szukasz, nie istnieje lub został usunięty.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Wróć do strony głównej
          </button>
        </div>
      </div>
    );
  }

  const author = getAllUsers().find(u => u.id === recipe.authorId);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'łatwy': return 'text-green-600 bg-green-100';
      case 'średni': return 'text-yellow-600 bg-yellow-100';
      case 'trudny': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Wróć
      </button>

      {/* Recipe Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        {recipe.image && (
          <div className="h-64 md:h-80 bg-gray-200 overflow-hidden">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 flex-1 mr-4">
              {recipe.title}
            </h1>
            {recipe.difficulty && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            )}
          </div>

          {/* Author Info */}
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-medium text-gray-900">{recipe.authorUsername}</span>
                {author?.isVerified && (
                  <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{new Date(recipe.createdAt).toLocaleDateString('pl-PL')}</span>
              </div>
            </div>
          </div>

          {/* Recipe Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {recipe.cookingTime && (
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Czas przygotowania</p>
                  <p className="font-semibold text-gray-900">{recipe.cookingTime} minut</p>
                </div>
              </div>
            )}
            
            {recipe.servings && (
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full mr-3">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Liczba porcji</p>
                  <p className="font-semibold text-gray-900">{recipe.servings} osób</p>
                </div>
              </div>
            )}
            
            {recipe.category && (
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-full mr-3">
                  <ChefHat className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kategoria</p>
                  <p className="font-semibold text-gray-900">{recipe.category}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Składniki</h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-2 w-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sposób przygotowania</h2>
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {recipe.instructions}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <Link
          to="/create-recipe"
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          Dodaj swój przepis
        </Link>
        <Link
          to="/discover"
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Odkrywaj więcej
        </Link>
      </div>
    </div>
  );
};

export default RecipeDetailPage;