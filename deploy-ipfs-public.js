const { CarReader } = require('@ipld/car')
const { Readable } = require('stream')
const { Web3Storage } = require('web3.storage')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Get your token from https://web3.storage/account/#apikeys
// This is the older web3.storage API which is easier to use for public deployments
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZGNTIxNTVkYUM4RGNFNDBiZDI0NEViRjY0MjI4MTREZDkwOWI1YzAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE3MTYyMjc1MjQyODQsIm5hbWUiOiJzaW1wbGUtbmZ0LWFwcCJ9.V33zw-Qda7jgH2KKoWiBj1QTvkqV1eLIKGBHV8zIADY'

async function main() {
  try {
    // Build the project
    console.log('Building the dApp...')
    execSync('npm run build', { stdio: 'inherit' })

    // Create client
    const client = new Web3Storage({ token })

    // Get files from dist directory
    const distPath = path.join(__dirname, 'dist')
    const files = getFilesFromDirectory(distPath)
    console.log(`Found ${files.length} files in the dist directory`)

    // Upload files
    console.log('Uploading files to IPFS...')
    const cid = await client.put(files, {
      name: 'simple-nft-minter',
      wrapWithDirectory: true,
    })

    console.log('='.repeat(50))
    console.log('Upload complete!')
    console.log('='.repeat(50))
    console.log('Your dApp is now available at the following URLs:')
    console.log(`IPFS Gateway: https://${cid}.ipfs.w3s.link/`)
    console.log(`IPFS Native: ipfs://${cid}/`)
    console.log('='.repeat(50))
    console.log('To access your dApp in Brave browser, go to the IPFS Native URL')
    console.log('='.repeat(50))

    // Save deployment info
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
    console.error('Error deploying to IPFS:', error)
    process.exit(1)
  }
}

// Get files from a directory recursively
function getFilesFromDirectory(dir) {
  const files = []

  function processDirectory(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name)
      
      if (entry.isDirectory()) {
        processDirectory(fullPath)
      } else {
        // Create File object with path relative to dist directory
        const relativePath = path.relative(path.join(__dirname, 'dist'), fullPath)
        const fileData = fs.readFileSync(fullPath)
        const file = new File([fileData], relativePath)
        files.push(file)
      }
    }
  }

  processDirectory(dir)
  return files
}

// Run main function
main().catch(console.error)