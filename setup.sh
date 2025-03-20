#!/bin/bash

# Setup script for Lionel's Space Adventure

echo "Setting up Lionel's Space Adventure..."

# Initialize Git repository if not already initialized
if [ ! -d ".git" ]; then
  echo "Initializing Git repository..."
  git init
  echo "Git repository initialized!"
else
  echo "Git repository already initialized."
fi

# Install dependencies
echo "Installing dependencies..."
npm install
echo "Dependencies installed!"

# Build the project
echo "Building the project..."
npm run build
echo "Build complete!"

# Setup Git remote for Heroku
echo ""
echo "To deploy to Heroku, run the following commands:"
echo "1. heroku login"
echo "2. heroku create lionels-space-adventure"
echo "3. git add ."
echo "4. git commit -m 'Initial commit'"
echo "5. git push heroku main"
echo ""

echo "Setup complete! Run 'npm start' to start the server locally." 