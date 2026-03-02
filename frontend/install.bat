@echo off
cd /d "%~dp0"
echo Installing npm dependencies...
call npm install --legacy-peer-deps
echo Done!
pause
