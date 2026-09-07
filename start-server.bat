@echo off
title Portfolio Local Web Server
echo ===================================================
echo   Responsive Portfolio Website - Local Server
echo ===================================================
echo.
echo Starting local web server at http://localhost:8080/ ...
echo Press Ctrl+C in this window to stop the server.
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
pause
