#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Build the React app
npm run build

# Build the Electron app for all platforms
npm run electron:build

echo "Standalone application packaging complete!"
echo "You can find the installers in the 'release' directory."