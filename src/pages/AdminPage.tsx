import React, { useState } from 'react';
import { Shield, Users, BookOpen, Trash2, AlertTriangle, Search, CheckCircle, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Navigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { user, updateUserRole, getAllUsers } = useAuth();
  const { recipes, deleteUser, deleteRecipe } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'user' | 'recipe'>('user');
  const [showRoleModal, setShowRoleModal] = useState<string | null>(null);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const allUsers = getAllUsers().filter(u => u.role !== 'admin');
  const filteredUsers = allUsers.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.displayName && u.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Shield className="h-8 w-8 text-red-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Panel Administratora</h1>
        </div>
        <p className="text-gray-600">Zarządzaj użytkownikami i treściami w systemie</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{allUsers.length}</p>
              <p className="text-gray-600">Użytkownicy</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{recipes.length}</p>
              <p className="text-gray-600">Przepisy</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-gray-600">Administratorzy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Management */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Zarządzanie użytkownikami</h2>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="Wyszukaj użytkowników..."
            />
          </div>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Użytkownik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data rejestracji
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Przepisy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((u) => {
                  const userRecipes = recipes.filter(r => r.authorId === u.id);
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {u.displayName || u.username}
                              </div>
                              {u.isVerified && (
                                <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500">@{u.username}</div>
                            {u.bio && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">{u.bio}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {u.isVerified ? (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              Zweryfikowany
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {userRecipes.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowRoleModal(u.id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Zarządzaj
                          </button>
                          <button
                            onClick={() => confirmDelete(u.id, 'user')}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Usuń
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Brak użytkowników do wyświetlenia</p>
          </div>
        )}
      </div>

      {/* Recipes Management */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Zarządzanie przepisami</h2>
        
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 truncate">{recipe.title}</h3>
                <p className="text-sm text-gray-600 mb-2">Autor: {recipe.authorUsername}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(recipe.createdAt).toLocaleDateString('pl-PL')}
                </p>
                <button
                  onClick={() => confirmDelete(recipe.id, 'recipe')}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Usuń przepis
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Brak przepisów w systemie</p>
          </div>
        )}
      </div>

      {/* Role Management Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            {(() => {
              const targetUser = allUsers.find(u => u.id === showRoleModal);
              if (!targetUser) return null;
              
              return (
                <>
                  <div className="flex items-center mb-4">
                    <UserCheck className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Zarządzaj użytkownikiem</h3>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      Zarządzaj uprawnieniami dla: <strong>{targetUser.displayName || targetUser.username}</strong>
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleUpdateUserRole(targetUser.id, targetUser.role || 'user', !targetUser.isVerified)}
                        className={`w-full p-3 rounded-lg border-2 transition-colors ${
                          targetUser.isVerified 
                            ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' 
                            : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        {targetUser.isVerified ? 'Usuń weryfikację' : 'Zweryfikuj użytkownika'}
                      </button>
                      
                      <button
                        onClick={() => handleUpdateUserRole(targetUser.id, targetUser.role === 'admin' ? 'user' : 'admin', targetUser.isVerified || false)}
                        className={`w-full p-3 rounded-lg border-2 transition-colors ${
                          targetUser.role === 'admin'
                            ? 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                            : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        {targetUser.role === 'admin' ? 'Usuń uprawnienia admina' : 'Nadaj uprawnienia admina'}
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowRoleModal(null)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Anuluj
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Potwierdź usunięcie</h3>
            </div>
            <p className="text-gray-600 mb-6">
              {deleteType === 'user' 
                ? 'Czy na pewno chcesz usunąć tego użytkownika? Ta akcja spowoduje również usunięcie wszystkich jego przepisów i nie może zostać cofnięta.'
                : 'Czy na pewno chcesz usunąć ten przepis? Ta akcja nie może zostać cofnięta.'
              }
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
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
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;