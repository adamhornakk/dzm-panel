#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# Replace with your repository URL
REPO_URL="https://github.com/your-username/your-repo.git"
# The directory to clone the repository into
PROJECT_DIR="dash"
# Your database name
DB_NAME="dash_db"
# Your database user
DB_USER="dash_user"
# A strong password for the database user
DB_PASSWORD="your_strong_password_here"


# --- Script Start ---
echo "Starting deployment script for Ubuntu 22.04..."

# 1. Update and install dependencies
echo "Updating package lists and installing dependencies..."
sudo apt-get update
sudo apt-get install -y nodejs npm mysql-server git

# 2. Secure MySQL and create database
echo "Configuring MySQL..."
# Note: mysql_secure_installation is interactive. You will be prompted to set a root password.
sudo mysql_secure_installation

echo "Creating database and user..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
sudo mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

echo "Database and user created successfully."

# 3. Clone repository
if [ -d "$PROJECT_DIR" ]; then
  echo "Project directory '$PROJECT_DIR' already exists. Pulling latest changes."
  cd $PROJECT_DIR
  git pull
else
  echo "Cloning repository..."
  git clone $REPO_URL $PROJECT_DIR
  cd $PROJECT_DIR
fi

# 4. Setup .env file
echo "Setting up .env file..."
if [ ! -f ".env.local" ]; then
  echo "DATABASE_URL=\"mysql://${DB_USER}:${DB_PASSWORD}@localhost:3306/${DB_NAME}\"" > .env.local
  # You should add other necessary environment variables here, like NEXTAUTH_SECRET
  echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local
  echo "NEXTAUTH_SECRET=$(openssl rand -hex 32)" >> .env.local
  echo ".env.local created. Please review and add any other required variables."
else
  echo ".env.local already exists. Skipping creation."
fi


# 5. Install dependencies and setup database
echo "Installing npm dependencies..."
npm install

echo "Running Prisma setup..."
npx prisma generate
npx prisma migrate deploy

# 6. Build the application
echo "Building Next.js application..."
npm run build

# 7. Install PM2 and start application
echo "Installing PM2 and starting the application..."
sudo npm install pm2 -g
pm2 start npm --name "$PROJECT_DIR" -- start

# Ensure PM2 restarts on server reboot
pm2 startup
# The previous command will output a command you need to run. Example:
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u <user> --hp /home/<user>
# You must run the command outputted by `pm2 startup` to complete the setup.

pm2 save

echo "Deployment finished!"
echo "Your application is running under PM2."
echo "You can check its status with 'pm2 status'."
echo "IMPORTANT: Run the command outputted by 'pm2 startup' to enable auto-restart on boot."