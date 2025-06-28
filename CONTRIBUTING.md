# 🤝 Contributing to BetterPrzepisy

Thank you for your interest in contributing to BetterPrzepisy! We welcome contributions from developers of all skill levels. This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Git**
- A code editor (we recommend **VS Code**)

### Fork and Clone

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/betterprzepisy.git
   cd betterprzepisy
   ```

3. **Add the upstream remote:**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/betterprzepisy.git
   ```

## 🛠️ Development Setup

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Open your browser to http://localhost:5173
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically

# Type Checking
npm run type-check   # Run TypeScript compiler check
```

### Project Structure

```
src/
├── components/      # Reusable UI components
├── contexts/        # React Context providers
├── pages/          # Page components
├── types/          # TypeScript type definitions
├── hooks/          # Custom React hooks
└── utils/          # Utility functions
```

## 📝 Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

1. **🐛 Bug Fixes** - Fix existing issues
2. **✨ New Features** - Add new functionality
3. **📚 Documentation** - Improve docs and examples
4. **🎨 UI/UX Improvements** - Enhance user experience
5. **⚡ Performance** - Optimize code and performance
6. **🧪 Tests** - Add or improve test coverage

### Before You Start

1. **Check existing issues** to see if your idea is already being worked on
2. **Create an issue** to discuss major changes before implementing
3. **Keep changes focused** - one feature/fix per pull request
4. **Follow our coding standards** (see below)

### Branch Naming Convention

Use descriptive branch names with prefixes:

```bash
feature/user-profile-editing
bugfix/recipe-card-layout
docs/contributing-guidelines
refactor/auth-context-cleanup
```

## 🔄 Pull Request Process

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write clean, readable code
- Follow our coding standards
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Check types
npm run type-check

# Test the build
npm run build
```

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add user profile editing functionality"
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Screenshots** for UI changes
- **Reference to related issues** (e.g., "Fixes #123")

### 6. Code Review Process

- Maintainers will review your PR
- Address any feedback or requested changes
- Once approved, your PR will be merged

## 📏 Coding Standards

### TypeScript

- Use **TypeScript** for all new code
- Define proper **interfaces** and **types**
- Avoid `any` type - use specific types
- Use **optional chaining** and **nullish coalescing** where appropriate

```typescript
// Good
interface User {
  id: string;
  name: string;
  email?: string;
}

// Bad
const user: any = { ... };
```

### React Components

- Use **functional components** with hooks
- Use **TypeScript interfaces** for props
- Keep components **small and focused**
- Use **meaningful component names**

```typescript
// Good
interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  showActions?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, showActions = true }) => {
  // Component implementation
};
```

### Styling

- Use **Tailwind CSS** classes
- Follow **mobile-first** responsive design
- Use **consistent spacing** (8px grid system)
- Support **dark mode** with proper contrast

```tsx
// Good
<div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
    Recipe Title
  </h2>
</div>
```

### File Organization

- Keep files **under 300 lines**
- Use **descriptive file names**
- Group related functionality
- Export components from **index files**

### Performance

- Use **React.memo** for expensive components
- Implement **lazy loading** for routes
- Optimize **images** and assets
- Minimize **bundle size**

## 🐛 Issue Guidelines

### Reporting Bugs

When reporting bugs, please include:

1. **Clear title** describing the issue
2. **Steps to reproduce** the bug
3. **Expected behavior** vs **actual behavior**
4. **Screenshots** or **videos** if applicable
5. **Browser/device information**
6. **Console errors** if any

### Feature Requests

For feature requests, please include:

1. **Clear description** of the feature
2. **Use case** - why is this needed?
3. **Proposed solution** or implementation ideas
4. **Alternatives considered**
5. **Mockups** or **wireframes** if applicable

### Issue Labels

We use labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - Critical issues
- `priority: low` - Nice to have

## 🌟 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

## 💬 Community

### Getting Help

- **GitHub Discussions** - For questions and general discussion
- **GitHub Issues** - For bug reports and feature requests
- **Code Reviews** - Learn from feedback on your PRs

### Communication Guidelines

- Be **respectful** and **constructive**
- **Ask questions** if you're unsure
- **Help others** when you can
- **Share knowledge** and **best practices**

## 📚 Resources

### Learning Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion)

### Development Tools

- **VS Code Extensions:**
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint

## 🙏 Thank You

Thank you for contributing to BetterPrzepisy! Your contributions help make this platform better for the entire Polish culinary community.

---

**Questions?** Feel free to reach out by creating an issue or starting a discussion on GitHub.

**Happy Coding!** 🚀