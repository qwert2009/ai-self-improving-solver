@echo off
cd /d "%~dp0frontend"
echo Starting frontend server on http://localhost:3000
echo.
python -m http.server 3000
pause
