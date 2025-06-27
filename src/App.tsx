import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import DiscoverPage from './pages/DiscoverPage';
import CreateRecipePage from './pages/CreateRecipePage';
import AdminPage from './pages/AdminPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import EditProfilePage from './pages/EditProfilePage';
import ShoppingListPage from './pages/ShoppingListPage';
import SettingsPage from './pages/SettingsPage';
import TrendingPage from './pages/TrendingPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="profile/edit" element={<EditProfilePage />} />
                <Route path="friends" element={<FriendsPage />} />
                <Route path="discover" element={<DiscoverPage />} />
                <Route path="trending" element={<TrendingPage />} />
                <Route path="create-recipe" element={<CreateRecipePage />} />
                <Route path="recipe/:id" element={<RecipeDetailPage />} />
                <Route path="shopping-list" element={<ShoppingListPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="admin" element={<AdminPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;