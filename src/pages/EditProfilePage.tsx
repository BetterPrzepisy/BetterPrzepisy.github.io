import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Save, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EditProfilePage: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || user?.username || '',
    bio: user?.bio || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.displayName.trim()) {
      setError('Nazwa wyświetlana nie może być pusta');
      return;
    }

    const success = await updateProfile({
      displayName: formData.displayName.trim(),
      bio: formData.bio.trim()
    });

    if (success) {
      setSuccess('Profil został zaktualizowany pomyślnie!');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } else {
      setError('Wystąpił błąd podczas aktualizacji profilu');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Wróć do profilu
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edytuj profil</h1>
        <p className="text-gray-600">Zaktualizuj swoje informacje osobiste</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Profile Picture Placeholder */}
          <div className="flex items-center space-x-6">
            <div className="h-20 w-20 bg-orange-200 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Zdjęcie profilowe</h3>
              <p className="text-sm text-gray-500">Funkcja dodawania zdjęć będzie dostępna wkrótce</p>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
              Nazwa wyświetlana *
            </label>
            <input
              type="text"
              id="displayName"
              required
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Jak chcesz być wyświetlany innym użytkownikom"
            />
            <p className="text-sm text-gray-500 mt-1">
              To jest nazwa, którą będą widzieć inni użytkownicy
            </p>
          </div>

          {/* Username (read-only) */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Nazwa użytkownika
            </label>
            <input
              type="text"
              id="username"
              value={user.username}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Nazwa użytkownika nie może być zmieniona
            </p>
          </div>

          {/* Email (read-only) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adres email
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Adres email nie może być zmieniony
            </p>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              O mnie
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-vertical"
              placeholder="Opowiedz coś o sobie, swoich zainteresowaniach kulinarnych..."
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.bio.length}/500 znaków
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default EditProfilePage;