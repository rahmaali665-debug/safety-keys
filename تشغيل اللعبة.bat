@echo off
rem Double-click to play the game on a lab PC (nothing to install). The black window opens minimised; keep it open while pupils play.
if not "%~1"=="min" (
  start "" /min "%~f0" min
  exit /b
)
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
