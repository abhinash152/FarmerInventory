@echo off
echo ===================================================
echo   Starting FarmerInventory Full-Stack Application
echo ===================================================
echo.

:: Start Backend Server
start "FarmerInventory Backend (Port 5000)" cmd /k "cd /d d:\Hackathon\server && npm start"

:: Start Frontend Vite Server
start "FarmerInventory Frontend (Port 5173)" cmd /k "cd /d d:\Hackathon\client && npm run dev"

:: Wait 3 seconds and launch browser
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo Application started!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
pause
