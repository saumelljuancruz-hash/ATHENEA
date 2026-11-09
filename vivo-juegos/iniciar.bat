@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul || (echo Falta instalar Node.js: entra a https://nodejs.org y baja la version LTS. & pause & exit /b)
if not exist node_modules (
  echo Instalando lo necesario, solo la primera vez...
  call npm install
)
if exist clave-euler.txt set /p EULER_API_KEY=<clave-euler.txt
node servidor.mjs %*
pause
