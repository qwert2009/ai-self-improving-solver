#!/bin/bash
# GitHub Repository Setup Script
# Creates repository and pushes code securely

set -e

echo "=========================================="
echo "Senior Project - GitHub Repository Setup"
echo "=========================================="
echo ""

# Configuration
REPO_NAME="senior-project"
REPO_DESCRIPTION="Self-Improving AI System for Engineering Problem Solving"
REPO_VISIBILITY="private"  # Change to 'public' if you want public repository

echo "📋 Repository Configuration:"
echo "   Name: $REPO_NAME"
echo "   Description: $REPO_DESCRIPTION"
echo "   Visibility: $REPO_VISIBILITY"
echo ""

# Check if GitHub CLI is authenticated
echo "🔐 Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub"
    echo "Please run: gh auth login"
    echo ""
    gh auth login
fi

echo "✅ GitHub authentication confirmed"
echo ""

# Check if repository already exists
echo "🔍 Checking if repository exists..."
if gh repo view $REPO_NAME &> /dev/null; then
    echo "⚠️  Repository '$REPO_NAME' already exists!"
    echo ""
    read -p "Do you want to delete it and create a new one? (y/N): " confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        echo "🗑️  Deleting existing repository..."
        gh repo delete $REPO_NAME --confirm
        echo "✅ Repository deleted"
    else
        echo "❌ Setup cancelled"
        exit 1
    fi
fi

echo ""
echo "📦 Creating GitHub repository..."
gh repo create $REPO_NAME \
    --description "$REPO_DESCRIPTION" \
    --$REPO_VISIBILITY \
    --source=. \
    --remote=origin \
    --push

echo ""
echo "✅ Repository created successfully!"
echo ""

# Display repository information
echo "📊 Repository Information:"
echo "   URL: https://github.com/$(gh api user | jq -r .login)/$REPO_NAME"
echo "   Visibility: $REPO_VISIBILITY"
echo ""

# Setup instructions
echo "=========================================="
echo "🎉 Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Configure GitHub Secrets (for CI/CD):"
echo "   Go to: https://github.com/$(gh api user | jq -r .login)/$REPO_NAME/settings/secrets/actions"
echo "   Add these secrets:"
echo "   - DEEPSEEK_API_KEY"
echo "   - GEMINI_API_KEY"
echo "   - SECRET_KEY"
echo ""
echo "2. Enable GitHub Actions:"
echo "   Go to: https://github.com/$(gh api user | jq -r .login)/$REPO_NAME/actions"
echo "   Click 'Enable workflows'"
echo ""
echo "3. Deploy with Docker:"
echo "   docker-compose up -d"
echo ""
echo "4. View logs:"
echo "   docker-compose logs -f"
echo ""
echo "=========================================="
