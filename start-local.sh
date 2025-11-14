#!/bin/bash

# SmartStock AI - Local Development Startup Script

echo "🚀 Starting SmartStock AI..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "${YELLOW}⚠️  Python 3 is not installed. Please install Python 3.11 or higher.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "${YELLOW}⚠️  Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo "${YELLOW}⚠️  backend/.env not found!${NC}"
    echo "Creating from example..."
    cp backend/.env.example backend/.env
    echo "${GREEN}✓${NC} Created backend/.env - Please update with your credentials"
    exit 1
fi

# Check if frontend .env exists
if [ ! -f "frontend/.env" ]; then
    echo "${YELLOW}⚠️  frontend/.env not found!${NC}"
    echo "Creating from example..."
    cp frontend/.env.example frontend/.env
    echo "${GREEN}✓${NC} Created frontend/.env"
fi

echo "📦 Installing dependencies..."
echo ""

# Install backend dependencies
echo "Installing Python packages..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt
echo "${GREEN}✓${NC} Backend dependencies installed"
cd ..

# Install frontend dependencies
echo "Installing Node packages..."
cd frontend
if [ ! -d "node_modules" ]; then
    yarn install --silent
fi
echo "${GREEN}✓${NC} Frontend dependencies installed"
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "${GREEN}To start the application:${NC}"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn server:app --reload --port 8001"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  yarn start"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
