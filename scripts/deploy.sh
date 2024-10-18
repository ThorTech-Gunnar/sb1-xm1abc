#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Load environment variables
source .env

# Build the application
echo "Building the application..."
npm run build

# Run database migrations (if applicable)
echo "Running database migrations..."
npm run migrate

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete!"