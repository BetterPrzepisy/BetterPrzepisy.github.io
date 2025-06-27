import React, { useState } from 'react';
import { 
  ChefHat, 
  Menu, 
  X, 
  Puzzle, 
  User, 
  Search, 
  MessageCircle, 
  Shield, 
  Palette,
  LogIn,
  Link,
  ShoppingCart,
  Camera,
  Users,
  UserPlus,
  Filter,
  Tag,
  TrendingUp,
  Heart,
  MessageSquare,
  Award,
  Flag,
  Settings,
  Mail,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';

const CooklyUpdatePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const features = [
    {
      category: "Integration Features",
      icon: <Puzzle className="h-8 w-8" />,
      color: "from-blue-500 to-blue-600",
      items: [
        {
          icon: <LogIn className="h-6 w-6" />,
          title: "Social Login",
          description: "Sign in seamlessly with Google and Facebook for instant access"
        },
        {
          icon: <Link className="h-6 w-6" />,
          title: "Recipe URL Import",
          description: "Paste any recipe URL and we'll automatically import it to your collection"
        },
        {
          icon: <ShoppingCart className="h-6 w-6" />,
          title: "Shopping List Generator",
          description: "Convert any recipe into a smart shopping list with one click"
        }
      ]
    },
    {
      category: "Profile & Social Features",
      icon: <User className="h-8 w-8" />,
      color: "from-purple-500 to-purple-600",
      items: [
        {
          icon: <Camera className="h-6 w-6" />,
          title: "Profile Pictures",
          description: "Upload and customize your profile with beautiful photos"
        },
        {
          icon: <Users className="h-6 w-6" />,
          title: "Public Profiles",
          description: "Showcase your bio, display name, and recipe collection"
        },
        {
          icon: <UserPlus className="h-6 w-6" />,
          title: "Follow System",
          description: "Follow your favorite chefs and discover their latest creations"
        }
      ]
    },
    {
      category: "Discovery & Search",
      icon: <Search className="h-8 w-8" />,
      color: "from-green-500 to-green-600",
      items: [
        {
          icon: <Filter className="h-6 w-6" />,
          title: "Advanced Filters",
          description: "Find recipes by ingredients, cooking time, difficulty, and more"
        },
        {
          icon: <Tag className="h-6 w-6" />,
          title: "Tag-Based Search",
          description: "Explore recipes through intuitive tags and categories"
        },
        {
          icon: <TrendingUp className="h-6 w-6" />,
          title: "Trending Recipes",
          description: "Discover what's popular in the Cookly community right now"
        }
      ]
    },
    {
      category: "Interaction & Community",
      icon: <MessageCircle className="h-8 w-8" />,
      color: "from-orange-500 to-orange-600",
      items: [
        {
          icon: <Heart className="h-6 w-6" />,
          title: "Like & Favorite",
          description: "Show love for recipes and save your favorites for later"
        },
        {
          icon: <MessageSquare className="h-6 w-6" />,
          title: "Comment System",
          description: "Share tips, ask questions, and connect with other cooks"
        },
        {
          icon: <Award className="h-6 w-6" />,
          title: "Author Badges",
          description: "Recognition system for top contributors and expert chefs"
        }
      ]
    },
    {
      category: "Safety & Quality",
      icon: <Shield className="h-8 w-8" />,
      color: "from-red-500 to-red-600",
      items: [
        {
          icon: <Flag className="h-6 w-6" />,
          title: "Report System",
          description: "Keep the community safe with easy content reporting tools"
        },
        {
          icon: <Settings className="h-6 w-6" />,
          title: "Admin Tools",
          description: "Comprehensive moderation tools for reviewing flagged content"
        },
        {
          icon: <Mail className="h-6 w-6" />,
          title: "Email Verification",
          description: "Enhanced security with email verification for all new users"
        }
      ]
    },
    {
      category: "Design Features",
      icon: <Palette className="h-8 w-8" />,
      color: "from-pink-500 to-pink-600",
      items: [
        {
          icon: <Moon className="h-6 w-6" />,
          title: "Dark Mode",
          description: "Easy on the eyes with beautiful dark theme support"
        },
        {
          icon: <Sparkles className="h-6 w-6" />,
          title: "Theme Customization",
          description: "Choose from light, dark, and custom color accent themes"
        }
      ]
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Cookly
                </h1>
                <span className="text-xs text-orange-500 font-medium">v2.0 Update</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`font-medium transition-colors hover:text-orange-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Features
              </a>
              <a href="#community" className={`font-medium transition-colors hover:text-orange-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Community
              </a>
              <a href="#download" className={`font-medium transition-colors hover:text-orange-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Download
              </a>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className={`md:hidden border-t transition-colors ${
              isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
            }`}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#features" className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  Features
                </a>
                <a href="#community" className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  Community
                </a>
                <a href="#download" className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  Download
                </a>
                <button className="w-full mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-semibold">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full mb-8">
              <Sparkles className="h-5 w-5 text-orange-500 mr-2" />
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                Now Available
              </span>
            </div>
            
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-colors ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Cookly <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">v2.0</span>
            </h1>
            
            <h2 className={`text-2xl md:text-3xl font-semibold mb-8 transition-colors ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Community & Customization
            </h2>
            
            <p className={`text-xl max-w-3xl mx-auto mb-12 leading-relaxed transition-colors ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              The biggest update yet! Connect with fellow food lovers, customize your experience, 
              and discover amazing recipes with powerful new features designed for the modern cook.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Update Now
              </button>
              <button className={`px-8 py-4 rounded-full font-semibold text-lg border-2 transition-all duration-200 ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 transition-colors ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              What's New in v2.0
            </h2>
            <p className={`text-xl max-w-2xl mx-auto transition-colors ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Six major feature categories packed with improvements to enhance your cooking journey
            </p>
          </div>

          <div className="space-y-20">
            {features.map((section, sectionIndex) => (
              <div key={sectionIndex} className="relative">
                {/* Section Header */}
                <div className="flex items-center justify-center mb-12">
                  <div className={`flex items-center space-x-4 px-6 py-3 rounded-full bg-gradient-to-r ${section.color} text-white shadow-lg`}>
                    {section.icon}
                    <h3 className="text-xl font-bold">{section.category}</h3>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`group p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                        isDarkMode 
                          ? 'bg-gray-800 border border-gray-700 hover:border-gray-600' 
                          : 'bg-white border border-gray-100 hover:border-gray-200 shadow-lg'
                      }`}
                    >
                      <div className={`inline-flex p-3 rounded-xl mb-6 bg-gradient-to-r ${section.color} text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                        {item.icon}
                      </div>
                      <h4 className={`text-xl font-bold mb-3 transition-colors ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </h4>
                      <p className={`leading-relaxed transition-colors ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className={`py-20 transition-colors ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className={`text-4xl font-bold mb-6 transition-colors ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Join the Cookly Community
            </h2>
            <p className={`text-xl mb-12 max-w-2xl mx-auto transition-colors ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Connect with thousands of passionate cooks, share your creations, and discover new favorites every day.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className={`p-8 rounded-2xl transition-colors ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
              } shadow-lg`}>
                <div className="text-3xl font-bold text-orange-500 mb-2">50K+</div>
                <div className={`font-semibold transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Active Cooks</div>
              </div>
              <div className={`p-8 rounded-2xl transition-colors ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
              } shadow-lg`}>
                <div className="text-3xl font-bold text-red-500 mb-2">100K+</div>
                <div className={`font-semibold transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Recipes Shared</div>
              </div>
              <div className={`p-8 rounded-2xl transition-colors ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
              } shadow-lg`}>
                <div className="text-3xl font-bold text-pink-500 mb-2">1M+</div>
                <div className={`font-semibold transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Recipe Likes</div>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Join Community
            </button>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-4xl font-bold mb-6 transition-colors ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Cook?
          </h2>
          <p className={`text-xl mb-12 transition-colors ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Update to Cookly v2.0 today and experience the future of recipe sharing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Update Now - Free
            </button>
            <button className={`px-8 py-4 rounded-full font-semibold text-lg border-2 transition-all duration-200 ${
              isDarkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}>
              View Changelog
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t transition-colors ${
        isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-white" />
              </div>
              <span className={`font-bold text-lg transition-colors ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Cookly
              </span>
            </div>
            <div className={`text-sm transition-colors ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © 2024 Cookly. Made with ❤️ for food lovers everywhere.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CooklyUpdatePage;