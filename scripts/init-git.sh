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

# Fetch remote information first
echo "🔍 Fetching remote repository information..."
git fetch origin 2>/dev/null || echo "Remote might be empty or unreachable"

# Create and switch to main branch
git checkout -b main 2>/dev/null || git checkout main

# Add all files
echo "📁 Adding all files..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "⚠️ No changes to commit"
    if git ls-remote --exit-code --heads origin main >/dev/null 2>&1; then
        echo "📥 Pulling latest changes from remote..."
        git pull origin main --allow-unrelated-histories
    fi
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

# Check if remote main branch exists
echo "🔍 Checking remote repository status..."
if git ls-remote --exit-code --heads origin main >/dev/null 2>&1; then
    echo "⚠️  Remote main branch exists. Attempting to merge..."
    
    # Try to pull and merge with allow-unrelated-histories
    if git pull origin main --allow-unrelated-histories --no-edit; then
        echo "✅ Successfully merged with remote main"
    else
        echo "❌ Merge conflict detected. Forcing push with --force-with-lease for safety..."
        echo "⚠️  This will overwrite remote content. Continue? (y/N)"
        read -r confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            git push --force-with-lease origin main
        else
            echo "❌ Aborted. Please resolve conflicts manually."
            exit 1
        fi
    fi
    
    # Push main branch
    echo "🚀 Pushing to main branch..."
    git push origin main
else
    echo "✨ Remote main branch doesn't exist, creating fresh setup..."
    
    # Push to main branch
    echo "🚀 Pushing to main branch..."
    git push -u origin main
fi

# Handle develop branch
echo "🌿 Setting up develop branch..."
if git ls-remote --exit-code --heads origin develop >/dev/null 2>&1; then
    echo "📥 Remote develop branch exists..."
    
    # Check if we have a local develop branch
    if git show-ref --verify --quiet refs/heads/develop; then
        # Switch to existing local develop
        git checkout develop
        
        # Try to pull remote develop
        if git pull origin develop --allow-unrelated-histories --no-edit; then
            echo "✅ Successfully synced with remote develop"
        else
            echo "❌ Conflict with remote develop. Forcing push..."
            echo "⚠️  This will overwrite remote develop. Continue? (y/N)"
            read -r confirm
            if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
                git push --force-with-lease origin develop
            else
                echo "❌ Skipping develop branch update."
            fi
        fi
    else
        # Create local develop from remote
        git checkout -b develop origin/develop
        
        # Merge main into develop
        git merge main --allow-unrelated-histories --no-edit
    fi
    
    # Push develop
    git push origin develop
else
    echo "✨ Creating new develop branch..."
    git checkout -b develop
    git push -u origin develop
fi

# Switch back to main
git checkout main

echo ""
echo "✅ Repository successfully synchronized with GitHub!"
echo ""
echo "🔗 Repository URL: https://github.com/Geniusboywonder/RealBotArmy"
echo ""
echo "📊 Current status:"
git branch -a
echo ""
echo "🎯 Next steps:"
echo "1. Go to GitHub and verify the repository content"
echo "2. Set up branch protection rules for main branch (if needed)"
echo "3. Configure any required secrets for GitHub Actions"
echo "4. Review and update README.md if needed"
echo ""
echo "Happy coding! 🤖"
