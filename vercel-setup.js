#!/usr/bin/env node

/**
 * 🚀 Vercel Setup Helper Script
 * This script helps you set up your project for easy Vercel deployment
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkRequirements() {
  log('🔍 Checking requirements...', 'blue');
  
  const checks = [
    { name: 'Node.js', command: 'node --version' },
    { name: 'npm', command: 'npm --version' },
    { name: 'git', command: 'git --version' }
  ];

  for (const check of checks) {
    try {
      const { stdout } = await execAsync(check.command);
      log(`✅ ${check.name}: ${stdout.trim()}`, 'green');
    } catch (error) {
      log(`❌ ${check.name} not found!`, 'red');
      return false;
    }
  }
  
  return true;
}

async function checkVercelCLI() {
  log('🔍 Checking Vercel CLI...', 'blue');
  
  try {
    const { stdout } = await execAsync('vercel --version');
    log(`✅ Vercel CLI: ${stdout.trim()}`, 'green');
    return true;
  } catch (error) {
    log('❌ Vercel CLI not found!', 'yellow');
    log('Installing Vercel CLI globally...', 'blue');
    
    try {
      await execAsync('npm install -g vercel');
      log('✅ Vercel CLI installed successfully!', 'green');
      return true;
    } catch (installError) {
      log('❌ Failed to install Vercel CLI!', 'red');
      log('Please install manually: npm install -g vercel', 'yellow');
      return false;
    }
  }
}

function checkFiles() {
  log('🔍 Checking project files...', 'blue');
  
  const requiredFiles = [
    'package.json',
    'vercel.json',
    'api/index.js',
    'src/app.js',
    'frontend/package.json',
    'frontend/src/App.jsx'
  ];

  let allFilesExist = true;

  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      log(`✅ ${file}`, 'green');
    } else {
      log(`❌ Missing: ${file}`, 'red');
      allFilesExist = false;
    }
  }

  return allFilesExist;
}

async function installDependencies() {
  log('📦 Installing dependencies...', 'blue');
  
  try {
    log('Installing backend dependencies...', 'yellow');
    await execAsync('npm install');
    
    log('Installing frontend dependencies...', 'yellow');
    await execAsync('cd frontend && npm install');
    
    log('✅ All dependencies installed!', 'green');
    return true;
  } catch (error) {
    log('❌ Failed to install dependencies!', 'red');
    log(error.message, 'red');
    return false;
  }
}

async function testBuild() {
  log('🔨 Testing build process...', 'blue');
  
  try {
    await execAsync('npm run build');
    log('✅ Build successful!', 'green');
    return true;
  } catch (error) {
    log('❌ Build failed!', 'red');
    log('Please fix build errors before deploying.', 'yellow');
    return false;
  }
}

function showEnvironmentVariables() {
  log('📋 Environment Variables Setup', 'blue');
  log('You need to set up these environment variables in Vercel:', 'yellow');
  
  const envVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'ELASTICSEARCH_NODE',
    'SENDGRID_API_KEY',
    'CLOUDINARY_CLOUD_NAME',
    'STRIPE_SECRET_KEY',
    'FRONTEND_URL',
    'VITE_API_URL'
  ];

  envVars.forEach(envVar => {
    log(`  • ${envVar}`, 'yellow');
  });
  
  log('📖 See environment-variables.txt for complete list and values', 'blue');
}

function showNextSteps() {
  log('🎯 Next Steps:', 'blue');
  log('1. Push your code to GitHub', 'yellow');
  log('2. Connect repository to Vercel', 'yellow');
  log('3. Add environment variables in Vercel dashboard', 'yellow');
  log('4. Deploy using: npm run deploy', 'yellow');
  log('', 'reset');
  log('📚 For detailed instructions, see: VERCEL_DEPLOYMENT_GUIDE.md', 'blue');
  log('🚀 Quick deploy: ./deploy.sh', 'green');
}

async function main() {
  log('🚀 Vercel Setup Helper', 'blue');
  log('====================', 'blue');
  
  const requirementsOk = await checkRequirements();
  if (!requirementsOk) {
    log('❌ Please install missing requirements and try again.', 'red');
    process.exit(1);
  }
  
  const vercelOk = await checkVercelCLI();
  if (!vercelOk) {
    log('❌ Vercel CLI setup failed.', 'red');
    process.exit(1);
  }
  
  const filesOk = checkFiles();
  if (!filesOk) {
    log('❌ Missing required files. Make sure you\'re in the project root.', 'red');
    process.exit(1);
  }
  
  const depsOk = await installDependencies();
  if (!depsOk) {
    log('❌ Failed to install dependencies.', 'red');
    process.exit(1);
  }
  
  const buildOk = await testBuild();
  if (!buildOk) {
    log('⚠️  Build failed, but setup can continue.', 'yellow');
  }
  
  log('', 'reset');
  log('✅ Setup completed successfully!', 'green');
  log('', 'reset');
  
  showEnvironmentVariables();
  log('', 'reset');
  showNextSteps();
}

main().catch(error => {
  log('❌ Setup failed:', 'red');
  log(error.message, 'red');
  process.exit(1);
});
