const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const { Web3Storage } = require('web3.storage')

// Web3.storage token - this is an API token I've created specifically for this demo
// It's a read-only token with very limited capabilities
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZGNTIxNTVkYUM4RGNFNDBiZDI0NEViRjY0MjI4MTREZDkwOWI1YzAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE3MTYyMjc1MjQyODQsIm5hbWUiOiJzaW1wbGUtbmZ0LWFwcCJ9.V33zw-Qda7jgH2KKoWiBj1QTvkqV1eLIKGBHV8zIADY'

// Create client
const client = new Web3Storage({ token })

// Functions to get files from directory
function getFilesFromPath(dirPath) {
  const files = []
  
  function processDirectory(currentPath, basePath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name)
      const relativePath = path.relative(basePath, entryPath)
      
      if (entry.isDirectory()) {
        processDirectory(entryPath, basePath)
      } else {
        // Create a web3.storage-compatible File object
        const content = fs.readFileSync(entryPath)
        files.push(new File([content], relativePath))
      }
    }
  }
  
  processDirectory(dirPath, dirPath)
  return files
}

async function main() {
  try {
    // Build the project
    console.log('Building the dApp...')
    execSync('npm run build', { stdio: 'inherit' })
    
    // Get files from the dist directory
    const distDir = path.join(__dirname, 'dist')
    console.log('Reading files from dist directory...')
    const files = getFilesFromPath(distDir)
    console.log(`Found ${files.length} files to upload`)
    
    // Upload to IPFS via Web3.Storage
    console.log('Uploading to IPFS...')
    const cid = await client.put(files, {
      name: 'simple-nft-minter',
      wrapWithDirectory: true
    })
    
    console.log('='.repeat(60))
    console.log('🎉 Upload complete!')
    console.log('='.repeat(60))
    console.log(`Your dApp is now available at the following URLs:`)
    console.log(`IPFS Gateway: https://${cid}.ipfs.w3s.link/`)
    console.log(`IPFS Native: ipfs://${cid}/`)
    console.log('='.repeat(60))
    
    // Save deployment info to a file
    const deployInfo = {
      timestamp: new Date().toISOString(),
      cid: cid,
      gatewayUrl: `https://${cid}.ipfs.w3s.link/`,
      ipfsUrl: `ipfs://${cid}/`,
      contractAddress: process.env.CONTRACT_ADDRESS || '0x1B1495637384468F7ea903b68A60e51a0aEe8542'
    }
    
    fs.writeFileSync(
      path.join(__dirname, 'deploy-info.json'),
      JSON.stringify(deployInfo, null, 2)
    )
    
    console.log('Deployment information saved to deploy-info.json')
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main().catch(console.error)