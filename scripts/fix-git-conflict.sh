#!/bin/bash

# Quick fix for the current git conflict situation
echo "🔧 Fixing current git conflict with remote repository..."

# Make sure we're in the right directory
cd "$(dirname "$0")/.."
echo "📍 Current directory: $(pwd)"

# Get current status
echo "📊 Current git status:"
git status --short

echo ""
echo "🔍 Current branches:"
git branch -a

echo ""
echo "🔗 Current remotes:"
git remote -v

# Fetch latest from remote
echo ""
echo "📥 Fetching latest from remote..."
git fetch origin

# Check what's on remote that we don't have
echo ""
echo "📋 Comparing local and remote branches..."
git log --oneline --graph --all --decorate -10

echo ""
echo "🎯 Choose your preferred resolution method:"
echo "1. Merge remote changes with your local changes (recommended)"
echo "2. Overwrite remote with your local changes (destructive)"
echo "3. Reset to remote and lose local changes (destructive)"
echo "4. Cancel and fix manually"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo "🔄 Merging with remote changes..."
        
        # Pull and merge main
        if git pull origin main --allow-unrelated-histories --no-edit; then
            echo "✅ Successfully merged main branch"
            
            # Push the merged result
            git push origin main
            echo "🚀 Successfully pushed merged main branch"
        else
            echo "❌ Merge conflicts detected in main branch"
            echo "Please resolve conflicts manually and run:"
            echo "  git add ."
            echo "  git commit"
            echo "  git push origin main"
            exit 1
        fi
        
        # Handle develop branch
        if git ls-remote --exit-code --heads origin develop >/dev/null 2>&1; then
            echo ""
            echo "🌿 Handling develop branch..."
            git checkout develop 2>/dev/null || git checkout -b develop
            
            if git pull origin develop --allow-unrelated-histories --no-edit; then
                echo "✅ Successfully merged develop branch"
                
                # Merge main into develop
                git merge main --no-edit
                git push origin develop
                echo "🚀 Successfully pushed merged develop branch"
            else
                echo "❌ Merge conflicts detected in develop branch"
                echo "Please resolve conflicts manually"
            fi
        fi
        ;;
        
    2)
        echo "⚠️  WARNING: This will overwrite remote repository content!"
        read -p "Are you absolutely sure? Type 'YES' to continue: " confirm
        
        if [[ $confirm == "YES" ]]; then
            echo "🚀 Force pushing local changes..."
            git push --force-with-lease origin main
            
            if git show-ref --verify --quiet refs/heads/develop; then
                git checkout develop
                git push --force-with-lease origin develop
                git checkout main
            fi
            
            echo "✅ Successfully overwrote remote repository"
        else
            echo "❌ Cancelled"
            exit 1
        fi
        ;;
        
    3)
        echo "⚠️  WARNING: This will delete your local changes!"
        read -p "Are you absolutely sure? Type 'YES' to continue: " confirm
        
        if [[ $confirm == "YES" ]]; then
            echo "🔄 Resetting to remote state..."
            git reset --hard origin/main
            git clean -fd
            
            if git ls-remote --exit-code --heads origin develop >/dev/null 2>&1; then
                git checkout -b develop origin/develop
                git checkout main
            fi
            
            echo "✅ Successfully reset to remote state"
        else
            echo "❌ Cancelled"
            exit 1
        fi
        ;;
        
    4)
        echo "📝 Manual fix instructions:"
        echo ""
        echo "To see what's different:"
        echo "  git log --oneline main..origin/main"
        echo "  git log --oneline origin/main..main"
        echo ""
        echo "To merge remote changes:"
        echo "  git pull origin main --allow-unrelated-histories"
        echo "  git push origin main"
        echo ""
        echo "To force push your changes:"
        echo "  git push --force-with-lease origin main"
        exit 0
        ;;
        
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

# Switch back to main
git checkout main

echo ""
echo "✅ Git conflict resolution completed!"
echo ""
echo "📊 Final status:"
git status
echo ""
git branch -a
echo ""
echo "🎉 Repository should now be synchronized with GitHub!"
