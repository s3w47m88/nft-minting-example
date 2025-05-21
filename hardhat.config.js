// Using individual plugins instead of hardhat-toolbox to ensure ethers v5 compatibility
require("@nomiclabs/hardhat-waffle"); // Uses ethers v5
require("@nomiclabs/hardhat-ethers"); // Uses ethers v5
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

// Get environment variables, if they don't exist, use fallback values
const SEPOLIA_URL = process.env.SEPOLIA_URL || "https://eth-sepolia.g.alchemy.com/v2/your_api_key";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      gasMultiplier: 1.2
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};