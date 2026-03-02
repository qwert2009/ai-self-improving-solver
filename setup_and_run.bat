@echo off
echo ============================================
echo   Senior Project - AI Self-Improving System
echo   Complete Setup and Launch
echo ============================================
echo.

cd /d "%~dp0"

echo [1/4] Setting up Python backend...
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing Python dependencies...
pip install -r requirements.txt --quiet

echo.
echo [2/4] Setting up React frontend...
cd frontend
if not exist "node_modules\" (
    echo Installing npm dependencies... This may take a few minutes...
    call npm install
)
cd ..

echo.
echo [3/4] Starting backend server...
start "Backend Server" cmd /c "call venv\Scripts\activate && python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start (10 seconds)...
timeout /t 10 /nobreak >nul

echo.
echo [4/4] Starting frontend server...
cd frontend
start "Frontend Server" cmd /c "call npm start"
cd ..

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Backend API:  http://localhost:8000
echo API Docs:     http://localhost:8000/docs
echo Frontend:     http://localhost:3000
echo.
echo Two browser windows should open automatically.
echo If not, please open the URLs manually.
echo.
pause
