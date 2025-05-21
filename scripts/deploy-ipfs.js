const { create } = require('@web3-storage/w3up-client');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

// Function to recursively get all files from a directory
function getFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      getFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to create a File object from a path
function pathToFile(filePath, baseDir) {
  const content = fs.readFileSync(filePath);
  const relativePath = path.relative(baseDir, filePath);
  return new File([content], relativePath);
}

async function main() {
  try {
    console.log('Building the dApp for production...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('\nPreparing to upload to IPFS via Storacha (w3up)...');
    
    // Initialize w3up client
    const client = await create();
    
    // This is the interactive part where the user needs to authenticate
    console.log('\n⚠️ AUTHENTICATION REQUIRED ⚠️');
    console.log('To upload to IPFS using Storacha, you need to authenticate first.');
    console.log('Please run the following commands in a separate terminal:');
    console.log('\n1. Install w3cli globally: npm install -g @web3-storage/w3cli');
    console.log('2. Create a space: w3 create-space my-nft-app');
    console.log('3. Register email: w3 register EMAIL@EXAMPLE.COM');
    console.log('4. Check your email for verification link and follow the instructions');
    console.log('5. After verification, login: w3 login EMAIL@EXAMPLE.COM');
    console.log('6. Once authenticated, get your space DID: w3 space ls');
    
    // Pausing for user to authenticate
    console.log('\nPress Enter after you have completed the authentication steps...');
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });
    
    // Ask for space DID
    console.log('\nEnter your space DID (from w3 space ls):');
    const spaceDID = await new Promise(resolve => {
      process.stdin.once('data', data => resolve(data.toString().trim()));
    });
    
    if (!spaceDID.startsWith('did:')) {
      throw new Error('Invalid space DID format. Should start with "did:"');
    }
    
    console.log(`\nConnecting to space: ${spaceDID}`);
    
    // Authenticate with the space
    await client.setCurrentSpace(spaceDID);
    
    // Get dist directory files
    const distDir = path.join(__dirname, '../dist');
    const files = getFiles(distDir);
    
    // Convert paths to File objects
    const fileObjects = files.map(f => pathToFile(f, distDir));
    
    console.log(`\nUploading ${fileObjects.length} files to IPFS...`);
    
    // Upload files
    const dirCID = await client.uploadDirectory(fileObjects);
    
    console.log('\n✅ Upload completed successfully!');
    console.log('='.repeat(50));
    console.log(`Your dApp is now available at the following URLs:`);
    console.log(`IPFS Gateway: https://${dirCID}.ipfs.dweb.link/`);
    console.log(`IPFS Gateway (w3s): https://${dirCID}.ipfs.w3s.link/`);
    console.log(`Dweb URL: ipfs://${dirCID}/`);
    console.log('='.repeat(50));
    console.log('To access your dApp in Brave browser, use the ipfs:// URL');
    
    // Save deployment info
    const deployInfo = {
      timestamp: new Date().toISOString(),
      cid: dirCID.toString(),
      gatewayUrl: `https://${dirCID}.ipfs.dweb.link/`,
      w3sGatewayUrl: `https://${dirCID}.ipfs.w3s.link/`,
      dwebUrl: `ipfs://${dirCID}/`,
      contractAddress: process.env.CONTRACT_ADDRESS || '0x1B1495637384468F7ea903b68A60e51a0aEe8542'
    };
    
    fs.writeFileSync(
      path.join(__dirname, '../deploy-info.json'),
      JSON.stringify(deployInfo, null, 2)
    );
    
    console.log('\nDeployment information saved to deploy-info.json');
    
  } catch (error) {
    console.error('Error deploying to IPFS:', error);
    process.exit(1);
  }
}

main().catch(console.error);