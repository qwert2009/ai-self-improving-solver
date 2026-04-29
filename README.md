# Self-Improving AI System for Engineering Problem Solving

<div align="center">

**[🇬🇧 English](#english) | [🇷🇺 Русский](#русский) | [🇨🇳 中文](#中文)**

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

---

<a name="中文"></a>
## 中文

# 工程问题自改进AI系统

**一个基于人工智能的研究平台，通过自我评估和批评反馈来解决工程问题并改进其解决方案。**

<p align="center">
  <strong><a href="#功能">功能</a> • <a href="#技术栈">技术栈</a> • <a href="#快速入门">入门</a> • <a href="#架构">架构</a> • <a href="#api参考">API</a></strong>
</p>

### 🎯 项目概述

本毕业设计项目研究了AI领域的一个基本问题：**具有自反思能力的AI系统是否能比单次处理方法改进问题解决的准确性？**

该系统实现了一个两阶段架构，其中AI求解器生成初始解决方案，独立的批评者代理验证并改进这些方案。这支持跨工程学科的方法比较分析。

<a name="功能"></a>
### ✨ 主要功能

- 🤖 **双重求解模式**: 单次基线和两阶段自改进
- 🔬 **实验框架**: 跨多问题的自动化比较分析
- 📊 **实时分析**: 追踪准确性和系统性能
- 🎓 **32个预装问题**: 涵盖4个工程学科
- 📈 **进度监控**: 含实时统计的仪表板
- 🔧 **管理工具**: 创建问题和管理实验
- 🌐 **REST API**: 完整CRUD操作和文档
- 📱 **现代界面**: React + Bootstrap

### 📊 支持的学科

| 学科 | 问题数 | 主题 |
|------|--------|------|
| **力学** | 10 | 牛顿定律、运动学、能量、动量 |
| **电路** | 10 | 欧姆定律、基尔霍夫定律、RC电路 |
| **微积分** | 6 | 导数、积分、优化 |
| **代数** | 6 | 线性方程、二次方程、方程组 |

<a name="架构"></a>
### 🏗️ 架构

```
┌──────────────────────────────────────────────────────────────┐
│                   前端 (React.js)                            │
│    仪表板 | 问题 | 求解器 | 实验 | 分析                      │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                   后端 (FastAPI)                             │
│   REST API | 数据库ORM | 日志 | 错误处理                    │
└────────────────────────┬─────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
    ┌────────┐      ┌────────┐      ┌──────────┐
    │基线求 │      │批评者  │      │实验管理器│
    │ 解器  │      │ 代理   │      │          │
    └────────┘      └────────┘      └──────────┘
        │                │                │
        └────────────────┼────────────────┘
                         ▼
    ┌──────────────────────────────────────────┐
    │           LLM API                        │
    │  DeepSeek  │  Google Gemini  │  自定义  │
    └──────────────────────────────────────────┘
```

### 🛠️ 技术栈

**后端**: FastAPI • SQLAlchemy • SQLite • Pydantic • SymPy • httpx  
**前端**: React 18 • Bootstrap 5 • Chart.js • Axios  
**AI集成**: DeepSeek API • Google Gemini API

### 📋 要求

- Python 3.9+
- Node.js 16+
- npm/yarn
- API密钥：DeepSeek和/或Google Gemini
- 操作系统：Windows/Linux/macOS

<a name="快速入门"></a>
### 🚀 快速入门

#### Windows（自动设置）
```bash
RUN.bat
```

#### 手动设置

**后端**
```bash
cd ai-self-improving-solver
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

**前端**（新终端）
```bash
cd frontend
npm install
npm start
```

#### 访问点
- **Web界面**: http://localhost:3000
- **API文档**: http://localhost:8000/docs
- **API健康检查**: http://localhost:8000/health

<a name="api参考"></a>
### 📡 API端点

**问题**: `GET /api/problems` | `GET /api/problems/{id}` | `POST /api/problems`  
**求解器**: `POST /api/solve/baseline` | `POST /api/solve/improving`  
**实验**: `POST /api/experiments` | `GET /api/experiments`  
**分析**: `GET /api/analysis/stats` | `GET /api/analysis/comparison`  
**健康**: `GET /api/health` | `GET /api/stats`

### 🔑 环境变量

```env
DEEPSEEK_API_KEY=你的api密钥
GEMINI_API_KEY=你的api密钥
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
DATABASE_URL=sqlite:///./solver.db
REACT_APP_API_URL=http://localhost:8000
```

### 📚 文档

- [快速入门指南](QUICK_START.md)
- [API文档](http://localhost:8000/docs)
- [架构概述](docs/ARCHITECTURE.md)

### 📄 许可证

MIT许可证 - 查看LICENSE文件

### 👨‍💻 作者

**开发者**: Ambartsumov Vyacheslav  
**项目**: 毕业设计  
**年份**: 2026

---

<div align="center">

**Made with ❤️ by Ambartsumov Vyacheslav**

[⬆ Back to top](#self-improving-ai-system-for-engineering-problem-solving)

</div>
