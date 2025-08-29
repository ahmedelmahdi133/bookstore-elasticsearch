#!/bin/bash

# 🚀 Easy Vercel Deployment Script

echo "🚀 Starting Vercel Deployment for Bookstore App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found!${NC}"
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo -e "${RED}❌ vercel.json not found! Make sure you're in the project root directory.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"

# Install root dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
npm install

# Install frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd frontend && npm install && cd ..

# Build the project locally to test
echo -e "${BLUE}🔨 Building project locally for testing...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Local build successful!${NC}"
else
    echo -e "${RED}❌ Local build failed! Please fix the errors before deploying.${NC}"
    exit 1
fi

# Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo -e "${GREEN}Your bookstore is now live on Vercel!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Don't forget to:${NC}"
    echo "1. Set up environment variables in Vercel dashboard"
    echo "2. Update FRONTEND_URL to your Vercel domain"
    echo "3. Test all functionality in production"
else
    echo -e "${RED}❌ Deployment failed! Check the error messages above.${NC}"
    exit 1
fi

echo -e "${BLUE}📚 Need help? Check VERCEL_DEPLOYMENT_GUIDE.md${NC}"
