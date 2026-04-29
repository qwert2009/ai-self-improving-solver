# Self-Improving AI System for Engineering Problem Solving

<div align="center">

**[🇬🇧 English](#english) | [🇷🇺 Русский](#русский)**

</div>

---

<a name="english"></a>
## English

# Self-Improving AI System for Engineering Problem Solving

**A research-driven AI platform that solves engineering problems and improves its own solutions through self-evaluation and critic feedback.**

<p align="center">
  <strong><a href="#features">Features</a> • <a href="#tech-stack">Tech Stack</a> • <a href="#quick-start">Quick Start</a> • <a href="#architecture">Architecture</a> • <a href="#api-reference">API</a></strong>
</p>

### 🎯 Project Overview

This senior project investigates a fundamental question in AI research: **Can self-reflective AI systems improve problem-solving accuracy compared to single-pass approaches?**

The system implements a two-stage architecture where an AI solver generates initial solutions, and a separate critic agent validates and improves those solutions. This enables comparative analysis of baseline vs. self-improving methodologies across engineering disciplines.

### ✨ Key Features

- 🤖 **Dual Solver Modes**: Baseline single-pass and self-improving two-stage solving
- 🔬 **Experimental Framework**: Automated comparative analysis across multiple problems
- 📊 **Real-time Analytics**: Track accuracy, improvement metrics, and system performance
- 🎓 **32 Pre-loaded Problems**: Spanning 4 engineering domains
- 📈 **Progress Monitoring**: Dashboard with live statistics and charts
- 🔧 **Admin Tools**: Create custom problems, manage experiments
- 🌐 **RESTful API**: Full CRUD operations with comprehensive documentation
- 📱 **Responsive UI**: Modern React-based frontend with Bootstrap styling

### 📊 Supported Domains

| Domain | Problems | Topics |
|--------|----------|--------|
| **Mechanics** | 10 | Newton's laws, kinematics, energy, momentum |
| **Electrical Circuits** | 10 | Ohm's law, Kirchhoff's laws, RC circuits |
| **Calculus** | 6 | Derivatives, integrals, optimization |
| **Algebra** | 6 | Linear equations, quadratics, systems |

<a name="architecture"></a>
### 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   Frontend (React.js)                        │
│    Dashboard | Problems | Solver | Experiments | Analysis    │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                  Backend (FastAPI)                           │
│   REST API | Database ORM | Logging | Error Handling        │
└────────────────────────┬─────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
    ┌────────┐      ┌────────┐      ┌────────────┐
    │Baseline│      │ Critic │      │Experiment  │
    │ Solver │      │ Agent  │      │  Manager   │
    └────────┘      └────────┘      └────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         ▼
    ┌──────────────────────────────────────────┐
    │           LLM APIs                       │
    │  DeepSeek  │  Google Gemini  │  Custom   │
    └──────────────────────────────────────────┘
```

<a name="tech-stack"></a>
### 🛠️ Tech Stack

**Backend**: FastAPI • SQLAlchemy • SQLite • Pydantic • SymPy • httpx  
**Frontend**: React 18 • Bootstrap 5 • Chart.js • Axios  
**AI Integration**: DeepSeek API • Google Gemini API

### 📋 Requirements

- Python 3.9+
- Node.js 16+
- npm/yarn
- API Keys: DeepSeek and/or Google Gemini
- Windows/Linux/macOS

<a name="quick-start"></a>
### 🚀 Quick Start

#### Windows (Automated)
```bash
RUN.bat
```

#### Manual Setup

**Backend**
```bash
cd ai-self-improving-solver
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend** (new terminal)
```bash
cd frontend
npm install
npm start
```

#### Access Points
- **Web UI**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/health

<a name="api-reference"></a>
### 📡 API Endpoints

**Problems**: `GET /api/problems` | `GET /api/problems/{id}` | `POST /api/problems`  
**Solver**: `POST /api/solve/baseline` | `POST /api/solve/improving`  
**Experiments**: `POST /api/experiments` | `GET /api/experiments`  
**Analysis**: `GET /api/analysis/stats` | `GET /api/analysis/comparison`  
**Health**: `GET /api/health` | `GET /api/stats`

### 🔑 Environment Variables

```env
DEEPSEEK_API_KEY=your_api_key
GEMINI_API_KEY=your_api_key
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
DATABASE_URL=sqlite:///./solver.db
REACT_APP_API_URL=http://localhost:8000
```

### 📚 Documentation

- [Quick Start Guide](QUICK_START.md)
- [API Documentation](http://localhost:8000/docs)
- [Architecture Overview](docs/ARCHITECTURE.md)

### 📄 License

MIT License - See LICENSE file

### 👨‍💻 Author

**Developer**: Ambartsumov Vyacheslav  
**Project**: Senior Capstone Research Project  
**Year**: 2026

---

<a name="русский"></a>
## Русский

# Система самоулучшающегося ИИ для решения инженерных задач

**Исследовательская платформа на базе искусственного интеллекта, которая решает инженерные задачи и улучшает свои решения через самооценку и обратную связь от критика.**

<p align="center">
  <strong><a href="#возможности">Возможности</a> • <a href="#технический-стек">Стек</a> • <a href="#быстрый-старт">Старт</a> • <a href="#архитектура-1">Архитектура</a> • <a href="#api-1">API</a></strong>
</p>

### 🎯 Обзор проекта

Данный дипломный проект исследует фундаментальный вопрос в области ИИ: **Может ли система ИИ с самоотражением улучшить точность решения задач по сравнению с однопроходным подходом?**

Система реализует двухэтапную архитектуру, где решатель ИИ генерирует начальные решения, а агент-критик проверяет и улучшает их. Это позволяет проводить сравнительный анализ различных подходов в инженерных дисциплинах.

<a name="возможности"></a>
### ✨ Основные возможности

- 🤖 **Двойные режимы решателя**: Однопроходный базовый и двухэтапный самоулучшающийся
- 🔬 **Экспериментальная платформа**: Автоматизированный сравнительный анализ
- 📊 **Аналитика в реальном времени**: Отслеживание точности и производительности
- 🎓 **32 предзагруженные задачи**: Охватывающие 4 инженерные дисциплины
- 📈 **Мониторинг прогресса**: Информационная панель с живыми статистическими данными
- 🔧 **Инструменты администратора**: Создание задач и управление экспериментами
- 🌐 **REST API**: Полные CRUD операции с документацией
- 📱 **Современный интерфейс**: React с Bootstrap стилизацией

### 📊 Поддерживаемые дисциплины

| Дисциплина | Задачи | Темы |
|-----------|--------|------|
| **Механика** | 10 | Законы Ньютона, кинематика, энергия, импульс |
| **Электрические цепи** | 10 | Закон Ома, законы Кирхгофа, RC-цепи |
| **Высшая математика** | 6 | Производные, интегралы, оптимизация |
| **Алгебра** | 6 | Линейные уравнения, квадратные, системы |

<a name="архитектура-1"></a>
### 🏗️ Архитектура

```
┌──────────────────────────────────────────────────────────────┐
│                  Фронтенд (React.js)                         │
│ Панель | Задачи | Решатель | Эксперименты | Анализ          │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                  Бэкенд (FastAPI)                            │
│   REST API | ORM БД | Логирование | Обработка ошибок       │
└────────────────────────┬─────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
    ┌────────┐      ┌────────┐      ┌────────────┐
    │Базовый │      │Критик  │      │Менеджер    │
    │решатель│      │-агент  │      │экспериментов
    └────────┘      └────────┘      └────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         ▼
    ┌──────────────────────────────────────────┐
    │           API LLM                         │
    │  DeepSeek  │  Google Gemini  │  Кастом   │
    └──────────────────────────────────────────┘
```

<a name="технический-стек"></a>
### 🛠️ Технический стек

**Бэкенд**: FastAPI • SQLAlchemy • SQLite • Pydantic • SymPy • httpx  
**Фронтенд**: React 18 • Bootstrap 5 • Chart.js • Axios  
**ИИ Интеграция**: DeepSeek API • Google Gemini API

### 📋 Требования

- Python 3.9+
- Node.js 16+
- npm/yarn
- API-ключи: DeepSeek и/или Google Gemini
- ОС: Windows/Linux/macOS

<a name="быстрый-старт"></a>
### 🚀 Быстрый старт

#### Windows (Автоматическая установка)
```bash
RUN.bat
```

#### Ручная установка

**Бэкенд**
```bash
cd ai-self-improving-solver
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

**Фронтенд** (новый терминал)
```bash
cd frontend
npm install
npm start
```

#### Точки доступа
- **Веб-интерфейс**: http://localhost:3000
- **Документация API**: http://localhost:8000/docs
- **Проверка здоровья**: http://localhost:8000/health

<a name="api-1"></a>
### 📡 Endpoints API

**Задачи**: `GET /api/problems` | `GET /api/problems/{id}` | `POST /api/problems`  
**Решатель**: `POST /api/solve/baseline` | `POST /api/solve/improving`  
**Эксперименты**: `POST /api/experiments` | `GET /api/experiments`  
**Анализ**: `GET /api/analysis/stats` | `GET /api/analysis/comparison`  
**Здоровье**: `GET /api/health` | `GET /api/stats`

### 🔑 Переменные окружения

```env
DEEPSEEK_API_KEY=ваш_ключ
GEMINI_API_KEY=ваш_ключ
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
DATABASE_URL=sqlite:///./solver.db
REACT_APP_API_URL=http://localhost:8000
```

### 📚 Документация

- [Руководство быстрого старта](QUICK_START.md)
- [Документация API](http://localhost:8000/docs)
- [Обзор архитектуры](docs/ARCHITECTURE.md)

### 📄 Лицензия

MIT Лицензия - Смотрите файл LICENSE

### 👨‍💻 Автор

**Разработчик**: Амбарцумов Вячеслав  
**Проект**: Дипломная работа  
**Год**: 2026

