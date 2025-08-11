#!/bin/bash

# RealBotArmy Production Deployment Script
echo "🚀 Deploying RealBotArmy to production..."

# Set production environment
export NODE_ENV=production

# Check if we're on the main branch
current_branch=$(git branch --show-current 2>/dev/null)
if [[ "$current_branch" != "main" ]]; then
    echo "⚠️ Warning: Not on main branch. Current branch: $current_branch"
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Check for uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ Uncommitted changes detected. Please commit all changes before deployment."
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install production dependencies
echo "📦 Installing production dependencies..."
npm ci --only=production

# Run security audit
echo "🔒 Running security audit..."
npm audit --audit-level=high

if [[ $? -ne 0 ]]; then
    echo "❌ Security audit failed. Please fix vulnerabilities before deployment."
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm test

if [[ $? -ne 0 ]]; then
    echo "❌ Tests failed. Deployment cancelled."
    exit 1
fi

# Build for production
echo "🔨 Building for production..."
npm run build

if [[ $? -ne 0 ]]; then
    echo "❌ Build failed. Deployment cancelled."
    exit 1
fi

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf realbotarmy-$(date +%Y%m%d-%H%M%S).tar.gz \
    dist/ \
    node_modules/ \
    package.json \
    package-lock.json \
    .env.example

# Backup current deployment (if exists)
if [[ -d /opt/realbotarmy ]]; then
    echo "💾 Backing up current deployment..."
    sudo mv /opt/realbotarmy /opt/realbotarmy-backup-$(date +%Y%m%d-%H%M%S)
fi

# Deploy new version
echo "📁 Deploying new version..."
sudo mkdir -p /opt/realbotarmy
sudo tar -xzf realbotarmy-*.tar.gz -C /opt/realbotarmy

# Set permissions
sudo chown -R realbotarmy:realbotarmy /opt/realbotarmy
sudo chmod +x /opt/realbotarmy/dist/index.js

# Restart service
echo "🔄 Restarting service..."
sudo systemctl restart realbotarmy

# Check service status
sleep 3
if sudo systemctl is-active --quiet realbotarmy; then
    echo "✅ Deployment successful! Service is running."
else
    echo "❌ Service failed to start. Check logs with: sudo journalctl -u realbotarmy"
    exit 1
fi

# Cleanup
echo "🧹 Cleaning up..."
rm realbotarmy-*.tar.gz

echo ""
echo "🎉 Deployment complete!"
echo "Service status: $(sudo systemctl is-active realbotarmy)"
echo "Check logs: sudo journalctl -u realbotarmy -f"
