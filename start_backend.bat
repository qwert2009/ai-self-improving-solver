@echo off
chcp 65001 >nul
echo ============================================
echo   Senior Project - AI Self-Improving System
echo   Complete Startup Script
echo ============================================
echo.

cd /d "%~dp0"

REM Check if virtual environment exists
if not exist "venv\" (
    echo [1/4] Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        echo Make sure Python 3.10+ is installed
        pause
        exit /b 1
    )
) else (
    echo [1/4] Virtual environment found
)

REM Activate virtual environment
echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

REM Install/upgrade dependencies
echo [3/4] Installing dependencies...
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo WARNING: Some packages may have failed to install
)

REM Check .env file
if not exist ".env" (
    echo.
    echo ERROR: .env file not found!
    echo Copy .env.example to .env and fill in your API keys
    pause
    exit /b 1
)

echo [4/4] Starting backend server...
echo.
echo ============================================
echo   Backend will start on: http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo ============================================
echo.
echo Starting server...
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

pause
