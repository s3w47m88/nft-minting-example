#!/bin/bash

# prepare-for-fleek.sh
# Script to prepare dApp for manual upload to Fleek.io

# Set colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Preparing dApp for Fleek.io deployment...${NC}"

# Step 1: Build the dApp
echo -e "${BLUE}Building the dApp...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo "Error: Build failed. Please fix the build errors and try again."
  exit 1
fi

# Step 2: Check if dist directory exists
if [ ! -d "dist" ]; then
  echo "Error: dist directory not found after build. Check webpack configuration."
  exit 1
fi

# Step 3: Create a zip file of the dist directory
echo -e "${BLUE}Creating zip file of the dist directory...${NC}"
zip -r fleek-deploy.zip dist
if [ $? -ne 0 ]; then
  echo "Error: Failed to create zip file. Make sure 'zip' is installed."
  exit 1
fi

# Success message with instructions
echo -e "\n${GREEN}Successfully prepared dApp for Fleek.io!${NC}"
echo -e "${GREEN}Your deployment package is ready at:${NC} $(pwd)/fleek-deploy.zip"

echo -e "\n${BLUE}=== NEXT STEPS ===${NC}"
echo -e "1. Create a Fleek account at https://app.fleek.co if you don't have one already"
echo -e "2. In the Fleek dashboard, create a new site"
echo -e "3. Select 'Upload' as your deployment method"
echo -e "4. Extract the fleek-deploy.zip file and upload the contents (not the zip itself)"
echo -e "5. Configure the following deployment settings:"
echo -e "   - Build Command: leave blank (already built)"
echo -e "   - Publish Directory: ."
echo -e "   - Base Directory: ."
echo -e "6. Click 'Deploy site'"
echo -e "7. Once deployed, Fleek will provide you with an IPFS hash and gateway URL"

echo -e "\n${BLUE}Note:${NC} You can also configure custom domains in the Fleek settings once deployed."