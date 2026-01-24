# ESLint Configuration Guide

## Overview
This project uses a comprehensive ESLint configuration designed for production-level React TypeScript applications. The configuration includes type-aware linting, accessibility checks, import organization, and code formatting.

## Configuration Structure

### Core Plugins
- **@typescript-eslint**: Type-aware linting for TypeScript
- **eslint-plugin-react**: React-specific linting rules
- **eslint-plugin-react-hooks**: React Hooks linting
- **eslint-plugin-jsx-a11y**: Accessibility linting for JSX
- **eslint-plugin-import**: Import/export linting and organization
- **eslint-plugin-prettier**: Code formatting integration

### Key Features

#### Type-Aware Linting
The configuration uses `tseslint.configs.strictTypeChecked` which enables:
- Strict type checking in linting rules
- Detection of unsafe type operations
- Prevention of common TypeScript pitfalls
- Enhanced null/undefined checking

#### React Best Practices
- Automatic React version detection
- JSX accessibility checks
- React Hooks rules enforcement
- Component prop validation
- JSX formatting and organization

#### Import Organization
- Automatic import sorting and grouping
- Detection of circular dependencies
- Unused import detection
- Consistent import style enforcement

## Available Scripts

### Linting Scripts
```bash
# Check for linting errors (no fixes)
npm run lint

# Fix auto-fixable linting errors
npm run lint:fix

# Strict linting check (for CI/CD)
npm run lint:check
```

### Formatting Scripts
```bash
# Format code with Prettier
npm run format

# Check if code is properly formatted
npm run format:check
```

### Type Checking
```bash
# Run TypeScript type checking
npm run type-check
```

### Quality Assurance
```bash
# Run all quality checks (types + linting + formatting)
npm run check-quality

# Pre-commit validation
npm run pre-commit

# Complete validation
npm run validate
```

## Rule Categories

### TypeScript Rules
- **Strict Type Safety**: Prevents `any` usage and unsafe operations
- **Consistent Imports**: Enforces type-only imports where appropriate
- **Code Style**: Consistent array types, interface definitions
- **Performance**: Prefers nullish coalescing and optional chaining

### React Rules
- **Component Best Practices**: Self-closing tags, fragment usage
- **JSX Formatting**: Prop sorting, curly brace presence
- **Accessibility**: ARIA attributes, semantic HTML
- **Hooks**: Proper dependency arrays, rules of hooks

### Import Rules
- **Organization**: Automatic grouping and sorting
- **Dependency Management**: Circular dependency detection
- **Clean Imports**: No duplicate or unused imports

## File-Specific Configurations

### Test Files (`*.test.ts`, `*.spec.ts`)
- Relaxed `any` usage rules
- Console logging allowed
- Less strict type checking

### Configuration Files (`*.config.js`, `*.config.ts`)
- Default exports allowed
- Relaxed type checking for build tools

## IDE Integration

### VS Code Settings
The `.vscode/settings.json` file configures:
- Format on save with Prettier
- Auto-fix ESLint errors on save
- Organize imports automatically
- TypeScript import preferences

### Recommended Extensions
- ESLint
- Prettier - Code formatter
- TypeScript Importer
- Auto Rename Tag

## Troubleshooting

### Common Issues

#### "Cannot use JSX unless the '--jsx' flag is provided"
- Ensure `tsconfig.json` has `"jsx": "react-jsx"`
- Check file extensions are `.tsx` for JSX files

#### "Module was resolved but '--jsx' is not set"
- Update TypeScript configuration
- Restart TypeScript language server

#### Type-aware rules not working
- Verify `project` paths in `eslint.config.js`
- Ensure all `tsconfig.json` files are included

### Performance Tips
- Use `--cache` flag for faster subsequent runs
- Consider using `--max-warnings 0` in CI/CD
- Run type checking separately from linting for better performance

## Customization

### Adding New Rules
1. Install the plugin: `npm add eslint-plugin-name --save-dev`
2. Add to plugins in `eslint.config.js`
3. Configure rules in the appropriate section

### Disabling Rules
```javascript
// For specific files
{
  files: ['src/legacy/**'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off'
  }
}

// Inline comments
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = response.data;
```

### Project-Specific Overrides
Modify the rules object in `eslint.config.js` to adjust severity levels or add custom rules for your project's specific needs.

## CI/CD Integration

### Pre-commit Hooks
```bash
# Add to your pre-commit hook
npm run pre-commit
```

### GitHub Actions Example
```yaml
- name: Run Quality Checks
  run: npm run check-quality
```

This configuration ensures high code quality, consistency, and maintainability across your React TypeScript project.