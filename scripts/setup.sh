#!/bin/bash

echo "🚀 Setting up Community Dash..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Database - Update with your remote MySQL server details
DATABASE_URL="mysql://username:password@your-server-host:3306/community_dash"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"

# App Configuration
NEXT_PUBLIC_APP_NAME="Community Dash"
NEXT_PUBLIC_APP_DESCRIPTION="Connect with your community members"
EOF
    echo "⚠️  Please update .env.local with your remote database credentials and secret key"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your remote MySQL server credentials:"
echo "   - Replace 'username' with your MySQL username"
echo "   - Replace 'password' with your MySQL password"
echo "   - Replace 'your-server-host' with your server IP/hostname"
echo "   - Update the secret key for security"
echo "2. Create the database 'community_dash' on your MySQL server"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Open http://localhost:3000 in your browser"
echo "5. Create your first admin account"
echo ""
echo "For PWA testing:"
echo "- Open the site on your mobile device"
echo "- Look for 'Add to Home Screen' option"
echo "- Install the app like a native app"
