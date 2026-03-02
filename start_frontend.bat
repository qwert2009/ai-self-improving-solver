@echo off
chcp 65001 >nul
echo ============================================
echo   Senior Project - Frontend Server
echo ============================================
echo.

cd /d "%~dp0frontend"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing npm dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install npm dependencies
        pause
        exit /b 1
    )
)

echo.
echo ============================================
echo   Frontend will start on: http://localhost:3000
echo   Make sure backend is running on port 8000
echo ============================================
echo.
echo Starting React development server...
echo.

REM Set environment variables for React
set BROWSER=none
set PORT=3000

call npm start

pause
