# Contributing to Self-Improving AI System

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on code quality and research integrity

## How to Contribute

### 1. Fork and Clone
```bash
git clone https://github.com/qwert2009/senior_project.git
cd senior_project
```

### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Follow PEP 8 style guide for Python
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed

### 4. Test Your Changes
```bash
# Backend tests
pytest backend/

# Frontend tests (if applicable)
cd frontend && npm test
```

### 5. Submit Pull Request
- Describe what your PR does
- Reference any related issues
- Include tests and documentation updates

## Development Setup

```bash
# Backend development
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
pip install pytest pytest-asyncio black flake8

# Frontend development
cd frontend
npm install
npm run build
```

## Coding Standards

### Python
- Follow PEP 8
- Use type hints where possible
- Write docstrings for functions

### JavaScript/React
- Use ES6+ syntax
- Use functional components
- Follow airbnb style guide

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage

## Documentation

- Update README if adding features
- Add docstrings to functions
- Include examples for complex features

## Issues and Discussions

- Check existing issues before creating new ones
- Provide detailed information and reproduction steps
- Be respectful in discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Questions? Open an issue or contact the maintainer.

Thank you for contributing! 🚀
