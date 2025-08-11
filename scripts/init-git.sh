#!/bin/bash

# Git initialization and push script for RealBotArmy
echo "🔧 Initializing Git repository and pushing to GitHub..."

# Make sure we're in the right directory
cd "$(dirname "$0")/.."
echo "📍 Current directory: $(pwd)"

# Initialize git if not already initialized
if [[ ! -d .git ]]; then
    echo "📝 Initializing git repository..."
    git init
fi

# Remove any existing remote origin to avoid conflicts
echo "🧨 Cleaning up existing remotes..."
git remote remove origin 2>/dev/null || true

# Add correct remote origin for RealBotArmy
echo "🔗 Adding remote origin for RealBotArmy..."
git remote add origin https://github.com/Geniusboywonder/RealBotArmy.git

# Verify remote
echo "✅ Remote configured as:"
git remote -v

# Create and switch to main branch
git checkout -b main 2>/dev/null || git checkout main

# Add all files
echo "📁 Adding all files..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "⚠️ No changes to commit"
    exit 0
fi

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "feat: initial project setup with complete infrastructure

- Add TypeScript configuration with strict typing
- Add ESLint and Prettier for code quality
- Add Jest testing framework with coverage
- Add GitHub Actions CI/CD pipeline
- Add comprehensive agent architecture
- Add WorkerAgent implementation
- Add AgentManager for orchestration
- Add configuration management
- Add logging utilities
- Add examples and documentation
- Add security scanning and dependency review
- Add branch protection workflows
- Add issue and PR templates
- Setup development environment with Husky hooks"

# Push to main branch
echo "🚀 Pushing to main branch..."
git push -u origin main

# Create and push develop branch
echo "🌿 Creating develop branch..."
git checkout -b develop
git push -u origin develop

# Switch back to main
git checkout main

echo ""
echo "✅ Repository successfully initialized and pushed to GitHub!"
echo ""
echo "🔗 Repository URL: https://github.com/Geniusboywonder/RealBotArmy"
echo ""
echo "Next steps:"
echo "1. Go to GitHub and verify the repository was created correctly"
echo "2. Set up branch protection rules for main branch (if not done already)"
echo "3. Configure any required secrets for GitHub Actions"
echo "4. Review and update README.md if needed"
echo ""
echo "Happy coding! 🤖"
