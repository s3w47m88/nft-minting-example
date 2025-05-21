# Simple NFT Minter dApp

A simple Web3 dApp that allows users to mint NFTs on the Ethereum blockchain. This project runs in a Web3 browser like Brave.

## Features

- Connect to MetaMask or other Web3 wallets
- Deploy and interact with NFT smart contracts on Ethereum testnets
- Mint NFTs with custom token URIs
- View your minted NFTs

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Brave Browser](https://brave.com/) or any browser with MetaMask installed
- MetaMask or similar Web3 wallet extension
- Sepolia testnet ETH (available from [Sepolia faucet](https://sepoliafaucet.com/))
- Alchemy or Infura API key for Sepolia access

## Getting Started

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your MetaMask private key (from a testing account)
   - Add your Alchemy/Infura API URL for Sepolia
   - Optionally add Etherscan API key for contract verification

```
# .env file
PRIVATE_KEY=your_metamask_private_key_here
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/your_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

4. Compile the smart contracts:

```bash
npm run compile
```

5. Deploy the contract to Sepolia testnet:

```bash
npm run deploy:sepolia
```

The deployment script will output the contract address. Copy this address.

6. Start the frontend application:

```bash
npm start
```

7. Open your browser and navigate to `http://localhost:8080`

## Usage

1. Connect your MetaMask wallet (make sure it's on Sepolia testnet)
2. Enter the deployed contract address in the "Contract Setup" field
3. Enter a token URI for your NFT (this should be a URL pointing to JSON metadata)
4. Click "Mint NFT" to mint your NFT
5. Once minted, you'll see the NFT ID and token URI

## Configuration

### Changing the Port

The default port is 8080. To change it, modify the `port` value in the `devServer` section of `webpack.config.js`:

```js
// webpack.config.js
devServer: {
  static: {
    directory: path.join(__dirname, 'dist'),
  },
  compress: true,
  port: 8080, // Change this value to your desired port
  hot: true,
},
```

### Using a Local Network

To use a local network instead of Sepolia, you can:

1. Start a local Ethereum node:
```bash
npm run node
```

2. In a new terminal, deploy to the local network:
```bash
npm run deploy
```

## Smart Contract

The SimpleNFT contract is based on OpenZeppelin's ERC721URIStorage and Ownable contracts. It provides basic NFT minting functionality.

## License

MIT