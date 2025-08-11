#!/bin/bash

# RealBotArmy Setup Script
echo "🤖 Setting up RealBotArmy..."

# Check Node.js version
node_version=$(node --version 2>/dev/null)
if [[ $? -ne 0 ]]; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Extract major version number
node_major=$(echo $node_version | cut -d'.' -f1 | sed 's/v//')
if [[ $node_major -lt 18 ]]; then
    echo "❌ Node.js v18 or higher is required. Current version: $node_version"
    exit 1
fi

echo "✅ Node.js version: $node_version"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [[ $? -ne 0 ]]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Setup environment file
if [[ ! -f .env ]]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "✅ .env file already exists"
fi

# Setup Husky hooks
echo "🪝 Setting up git hooks..."
npm run prepare

# Create logs directory if it doesn't exist
mkdir -p logs

# Build the project
echo "🔨 Building project..."
npm run build

if [[ $? -ne 0 ]]; then
    echo "❌ Build failed"
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm test

if [[ $? -ne 0 ]]; then
    echo "⚠️ Some tests failed. Please check the output above."
    # Don't exit on test failure for initial setup
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with the appropriate configuration"
echo "2. Run 'npm run dev' to start development server"
echo "3. Run 'npm test' to run the test suite"
echo "4. See README.md for more information"
echo ""
echo "Happy coding! 🚀"
