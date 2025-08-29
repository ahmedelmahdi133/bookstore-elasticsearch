@echo off
REM 🚀 Easy Vercel Deployment Script for Windows

echo 🚀 Starting Vercel Deployment for Bookstore App...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found!
    echo Installing Vercel CLI...
    npm install -g vercel
)

REM Check if we're in the right directory
if not exist "vercel.json" (
    echo ❌ vercel.json not found! Make sure you're in the project root directory.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...

REM Install root dependencies
echo Installing backend dependencies...
call npm install

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Build the project locally to test
echo 🔨 Building project locally for testing...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Local build failed! Please fix the errors before deploying.
    pause
    exit /b 1
)

echo ✅ Local build successful!

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
call vercel --prod

if %errorlevel% equ 0 (
    echo 🎉 Deployment successful!
    echo Your bookstore is now live on Vercel!
    echo.
    echo 📋 Don't forget to:
    echo 1. Set up environment variables in Vercel dashboard
    echo 2. Update FRONTEND_URL to your Vercel domain
    echo 3. Test all functionality in production
) else (
    echo ❌ Deployment failed! Check the error messages above.
    pause
    exit /b 1
)

echo 📚 Need help? Check VERCEL_DEPLOYMENT_GUIDE.md
pause
