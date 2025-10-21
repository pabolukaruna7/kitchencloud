@echo off
title KitchenCloud Setup Assistant
color 0A

echo ========================================
echo    KitchenCloud Setup Assistant
echo ========================================
echo.
echo This script will help you set up KitchenCloud after cloning
echo.

:MENU
echo Please select an option:
echo.
echo 1. Complete Setup (Install all dependencies)
echo 2. Start Backend Server
echo 3. Start Frontend Server  
echo 4. Check if servers are running
echo 5. Kill all Node processes
echo 6. Open Application in Browser
echo 7. Exit
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto SETUP
if "%choice%"=="2" goto BACKEND
if "%choice%"=="3" goto FRONTEND
if "%choice%"=="4" goto CHECK
if "%choice%"=="5" goto KILL
if "%choice%"=="6" goto BROWSER
if "%choice%"=="7" goto EXIT

echo Invalid choice! Please try again.
goto MENU

:SETUP
echo.
echo Installing backend dependencies...
cd backend
call npm install
echo.
echo Installing frontend dependencies...
cd ../frontend
call npm install
cd ..
echo.
echo ✅ Setup complete! 
echo.
echo Next steps:
echo 1. Run option 2 (Start Backend Server)
echo 2. Run option 3 (Start Frontend Server)
echo 3. Run option 6 (Open Application)
echo.
pause
goto MENU

:BACKEND
echo.
echo Starting backend server...
echo Press Ctrl+C to stop the server
echo.
cd backend
npm run dev
pause
goto MENU

:FRONTEND
echo.
echo Starting frontend server...
echo Press Ctrl+C to stop the server
echo.
cd frontend  
npm start
pause
goto MENU

:CHECK
echo.
echo Checking if servers are running...
netstat -an | findstr ":3000.*LISTEN" >nul
if %errorlevel%==0 (
    echo ✅ Frontend server is running on port 3000
) else (
    echo ❌ Frontend server is NOT running
)

netstat -an | findstr ":5000.*LISTEN" >nul
if %errorlevel%==0 (
    echo ✅ Backend server is running on port 5000
) else (
    echo ❌ Backend server is NOT running
)
echo.
pause
goto MENU

:KILL
echo.
echo Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM nodemon.exe 2>nul
echo ✅ All Node processes stopped
echo.
pause
goto MENU

:BROWSER
echo.
echo Opening KitchenCloud application...
start http://localhost:3000
echo.
echo ✅ Application should open in your browser
echo If it doesn't load, make sure both servers are running!
echo.
pause
goto MENU

:EXIT
echo.
echo Thank you for using KitchenCloud Setup Assistant!
echo.
pause
exit