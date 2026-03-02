@echo off
chcp 65001 >nul
echo ============================================
echo   Senior Project - Setup Script
echo ============================================
echo.

cd /d "%~dp0"

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python 3.10 or higher from https://python.org
    pause
    exit /b 1
)

echo Python found!
python --version
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Please install Node.js 18 or higher from https://nodejs.org
    pause
    exit /b 1
)

echo Node.js found!
node --version
echo.

REM Create .env if not exists
if not exist ".env" (
    echo [1/5] Creating .env file from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit .env file and add your API keys!
    echo.
) else (
    echo [1/5] .env file exists
)

REM Create Python virtual environment
echo [2/5] Setting up Python virtual environment...
if exist "venv\" (
    echo Virtual environment exists, recreating...
    rmdir /s /q venv
)
python -m venv venv
call venv\Scripts\activate.bat
echo.

REM Install Python dependencies
echo [3/5] Installing Python dependencies...
pip install --upgrade pip --quiet
pip install -r requirements.txt
echo.

REM Install frontend dependencies
echo [4/5] Installing frontend dependencies...
cd frontend
if exist "node_modules\" (
    echo Removing old node_modules...
    rmdir /s /q node_modules
)
if exist "package-lock.json" (
    del package-lock.json
)
call npm install
cd ..
echo.

REM Initialize database
echo [5/5] Initializing database...
python -c "import asyncio; from backend.database import init_db; asyncio.run(init_db())" 2>nul
if errorlevel 1 (
    echo Database will be initialized on first run
)

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Edit .env file and add your API keys
echo 2. Run RUN.bat to start both servers
echo.
echo Or run separately:
echo   - start_backend.bat   (Backend on port 8000)
echo   - start_frontend.bat  (Frontend on port 3000)
echo.

pause
