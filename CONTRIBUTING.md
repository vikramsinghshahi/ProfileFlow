# Contributing to OpenBento

First off, thank you for considering contributing to OpenBento! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/yoanbernabeu/openbento/issues) to avoid duplicates.

When creating a bug report, please include:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots if applicable
- Your browser and OS information

### Suggesting Features

Feature suggestions are welcome! Please open an issue with:
- A clear and descriptive title
- Detailed description of the proposed feature
- Any relevant mockups or examples

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** and ensure the code works
4. **Test your changes** locally with `npm run dev`
5. **Verify linting and formatting** before committing (see below)
6. **Commit your changes** with a clear commit message
7. **Push to your fork** and submit a pull request

### Before Submitting

Make sure your code passes all checks:

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Check code formatting
npm run format:check

# Format code automatically
npm run format

# Check TypeScript types
npm run type-check

# Run all checks at once (recommended)
npm run ci
```

> ⚠️ **Important**: Pull requests that fail linting or formatting checks will not be merged.

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yoanbernabeu/openbento.git
cd openbento

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Code Style

- Use TypeScript for all new code
- Follow existing code conventions
- Keep components small and focused
- Write meaningful commit messages

## Commit Message Guidelines

We follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: add new social media block type`

## Questions?

Feel free to open an issue or reach out to [@yoanbernabeu](https://github.com/yoanbernabeu).

Thank you for your contributions! 🚀
