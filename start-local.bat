@echo off
REM SmartStock AI - Local Development Startup Script (Windows)

echo.
echo Starting SmartStock AI...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: Python is not installed. Please install Python 3.11 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

REM Check if backend .env exists
if not exist "backend\.env" (
    echo WARNING: backend\.env not found!
    echo Creating from example...
    copy backend\.env.example backend\.env
    echo Created backend\.env - Please update with your credentials
    pause
    exit /b 1
)

REM Check if frontend .env exists
if not exist "frontend\.env" (
    echo WARNING: frontend\.env not found!
    echo Creating from example...
    copy frontend\.env.example frontend\.env
    echo Created frontend\.env
)

echo Installing dependencies...
echo.

REM Install backend dependencies
echo Installing Python packages...
cd backend
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate
pip install -q -r requirements.txt
echo Backend dependencies installed
cd ..

REM Install frontend dependencies
echo Installing Node packages...
cd frontend
if not exist "node_modules" (
    call yarn install --silent
)
echo Frontend dependencies installed
cd ..

echo.
echo Setup complete!
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   venv\Scripts\activate
echo   uvicorn server:app --reload --port 8001
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   yarn start
echo.
echo Then visit: http://localhost:3000
echo.
pause
