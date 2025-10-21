@echo off
echo ================================
echo KitchenCloud Project Copy Script
echo ================================
echo.
echo This script will copy your project excluding node_modules folders
echo.
set /p destination="Enter destination path (e.g., D:\KitchenCloud): "
echo.
echo Creating destination folder...
mkdir "%destination%" 2>nul

echo Copying root files...
xcopy "*.md" "%destination%\" /Y >nul
xcopy "*.json" "%destination%\" /Y >nul
xcopy "*.toml" "%destination%\" /Y >nul
xcopy ".gitignore" "%destination%\" /Y >nul

echo Copying .github folder...
xcopy ".github\*" "%destination%\.github\" /E /Y >nul

echo Copying backend (excluding node_modules)...
mkdir "%destination%\backend" 2>nul
xcopy "backend\*" "%destination%\backend\" /E /Y /EXCLUDE:exclude_list.txt >nul

echo Copying frontend (excluding node_modules)...
mkdir "%destination%\frontend" 2>nul
xcopy "frontend\*" "%destination%\frontend\" /E /Y /EXCLUDE:exclude_list.txt >nul

echo.
echo ================================
echo Copy Complete!
echo ================================
echo.
echo Files copied to: %destination%
echo.
echo Next steps on your new laptop:
echo 1. Install Node.js from nodejs.org
echo 2. Open terminal in project folder
echo 3. Run: cd backend ^&^& npm install
echo 4. Run: cd ../frontend ^&^& npm install
echo 5. Start backend: cd backend ^&^& npm run dev
echo 6. Start frontend: cd frontend ^&^& npm start
echo.
pause