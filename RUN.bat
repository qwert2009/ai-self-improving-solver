@echo off
chcp 65001 >nul
title Senior Project - AI Self-Improving System

echo ============================================
echo   Senior Project - AI Self-Improving System
echo   Complete Startup
echo ============================================
echo.

cd /d "%~dp0"

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found! Install Python 3.10+
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found! Install Node.js 18+
    pause
    exit /b 1
)

echo Starting backend server...
echo.
start "Backend Server" cmd.exe /c "%~dp0start_backend.bat"

REM Wait for backend to start
echo Waiting for backend to initialize (10 seconds)...
timeout /t 10 /nobreak >nul

echo.
echo Starting frontend server...
echo.
start "Frontend Server" cmd.exe /c "%~dp0start_frontend.bat"

echo.
echo ============================================
echo   Both servers are starting...
echo.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo.
echo   Close the server windows to stop them
echo ============================================
