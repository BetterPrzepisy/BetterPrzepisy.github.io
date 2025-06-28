# 🍳 BetterPrzepisy

**Społecznościowa Platforma Kulinarna** - The Ultimate Polish Culinary Social Platform

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-blue.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-blue.svg)](https://vitejs.dev/)

> **🌟 Odkrywaj, dziel się i twórz przepisy kulinarne z przyjaciółmi!**

[🚀 **Live Demo**](https://betterprzepisy.netlify.app) | [📋 **Changelog**](CHANGELOG.md) | [🤝 **Contributing**](CONTRIBUTING.md)

---

## 🎯 **Overview**

BetterPrzepisy is a modern, feature-rich social platform designed specifically for Polish culinary enthusiasts. Built with cutting-edge web technologies, it offers a seamless experience for discovering, sharing, and managing recipes while connecting with fellow cooking enthusiasts.

### ✨ **Key Highlights**

- 🎨 **Beautiful Design** - Modern, responsive UI with dark/light themes
- 🚀 **Lightning Fast** - Built with Vite for optimal performance
- 📱 **Mobile First** - Perfect experience on all devices
- 🌍 **Polish Localized** - Complete Polish language support
- 🔒 **Secure** - Role-based authentication and data protection
- 🎭 **Animated** - Smooth animations and micro-interactions

---

## 🌟 **Features**

### 👥 **Social Features**
- **Friend System** - Connect with other cooking enthusiasts
- **User Profiles** - Rich profiles with bio and verification status
- **Social Feed** - Discover recipes from friends and trending content
- **User Search** - Find and connect with other users

### 📖 **Recipe Management**
- **Rich Recipe Editor** - Create detailed recipes with images
- **Smart Search** - Find recipes by ingredients, tags, or categories
- **Advanced Filtering** - Filter by difficulty, time, category
- **Recipe Analytics** - Track views, likes, and favorites

### 🛒 **Smart Shopping**
- **Auto Shopping Lists** - Generate lists from recipe ingredients
- **Progress Tracking** - Check off items as you shop
- **Recipe Grouping** - Organize ingredients by source recipe

### 🎨 **Customization**
- **Theme System** - 4 beautiful color themes
- **Dark/Light Mode** - Perfect contrast in any lighting
- **Responsive Design** - Optimized for all screen sizes

### 🛡️ **Admin Dashboard**
- **User Management** - Role assignment and verification
- **Content Moderation** - Recipe and user management
- **Analytics** - Comprehensive platform statistics
- **Data Export** - JSON exports for backup and analysis

---

## 🚀 **Quick Start**

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/betterprzepisy.git

# Navigate to project directory
cd betterprzepisy

# Install dependencies
npm install

# Start development server
npm run dev
```

### 🌐 **Access the Application**

- **Development**: `http://localhost:5173`
- **Production**: [https://betterprzepisy.netlify.app](https://betterprzepisy.netlify.app)

---

## 🏗️ **Tech Stack**

### **Frontend**
- ⚛️ **React 18** - Modern React with hooks and concurrent features
- 🔷 **TypeScript** - Full type safety and better developer experience
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🎭 **Framer Motion** - Smooth animations and transitions
- 🧭 **React Router** - Client-side routing
- 🎯 **Lucide React** - Beautiful, consistent icons

### **Build & Development**
- ⚡ **Vite** - Lightning-fast build tool and dev server
- 📦 **ESLint** - Code quality and consistency
- 🔧 **PostCSS** - CSS processing and optimization

### **State Management**
- 🏪 **React Context** - Centralized state management
- 🪝 **Custom Hooks** - Reusable logic extraction
- 💾 **Local Storage** - Persistent data storage

---

## 📁 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main application layout
│   └── RecipeCard.tsx  # Recipe display component
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── AppContext.tsx  # Application state
│   └── ThemeContext.tsx # Theme management
├── pages/              # Page components
│   ├── HomePage.tsx    # Dashboard/home page
│   ├── LoginPage.tsx   # Authentication
│   ├── ProfilePage.tsx # User profiles
│   └── AdminPage.tsx   # Admin dashboard
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces
└── main.tsx           # Application entry point
```

---

## 🎨 **Design System**

### **Color Themes**
- 🟠 **Orange** (Default) - Warm and inviting
- 🔵 **Blue** - Professional and trustworthy  
- 🟢 **Green** - Fresh and natural
- 🟣 **Purple** - Creative and modern

### **Typography**
- **Headings** - Bold, clear hierarchy
- **Body Text** - Optimized readability
- **UI Text** - Consistent sizing and spacing

### **Spacing**
- **8px Grid System** - Consistent spacing throughout
- **Responsive Breakpoints** - Mobile, tablet, desktop optimized

---

## 🔐 **Authentication**

### **User Roles**
- **👤 User** - Standard recipe creation and social features
- **🛡️ Admin** - Full platform management capabilities

### **Demo Accounts**
Create your own account through the registration process. The platform supports:
- Email/password authentication
- Profile customization
- Role-based permissions

---

## 📱 **Mobile Experience**

BetterPrzepisy is designed mobile-first with:
- **Touch-optimized** interactions
- **Bottom navigation** for easy thumb access
- **Responsive images** and layouts
- **Fast performance** on mobile devices

---

## 🌍 **Internationalization**

Currently supports:
- 🇵🇱 **Polish** - Complete localization
- 📅 **Polish date formats**
- 🔢 **Polish number formatting**
- 🍽️ **Polish culinary terminology**

---

## 🤝 **Contributing**

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test your changes thoroughly

---

## 📄 **License**

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

Special thanks to:
- **React Team** - For the amazing React framework
- **Tailwind Labs** - For the utility-first CSS framework
- **Framer** - For beautiful animation capabilities
- **Lucide** - For the comprehensive icon library
- **Vite Team** - For the lightning-fast build tool

---

## 📞 **Support**

- 🐛 **Bug Reports** - [GitHub Issues](https://github.com/yourusername/betterprzepisy/issues)
- 💡 **Feature Requests** - [GitHub Discussions](https://github.com/yourusername/betterprzepisy/discussions)
- 📧 **Contact** - [your-email@example.com](mailto:your-email@example.com)

---

## 🗺️ **Roadmap**

### **v2.1.0** - Q1 2025
- Real-time messaging
- Recipe collections
- Advanced analytics

### **v2.2.0** - Q2 2025
- Video recipe support
- Meal planning tools
- Nutrition tracking

### **v3.0.0** - Q3 2025
- Mobile applications
- AI-powered recommendations
- Marketplace integration

---

<div align="center">

**Made with ❤️ for the Polish culinary community**

[⭐ Star this project](https://github.com/yourusername/betterprzepisy) | [🍴 Fork it](https://github.com/yourusername/betterprzepisy/fork) | [📢 Share it](https://twitter.com/intent/tweet?text=Check%20out%20BetterPrzepisy%20-%20The%20Ultimate%20Polish%20Culinary%20Social%20Platform!&url=https://github.com/yourusername/betterprzepisy)

</div>