const hre = require("hardhat");

async function main() {
  // Get the contract owner
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  try {
    // Deploy the SimpleNFT contract - ethers v5 compatible version
    const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");
    const simpleNFT = await SimpleNFT.deploy();
    await simpleNFT.deployed(); // ethers v5 uses deployed() instead of waitForDeployment()
    
    // ethers v5 has address as a property, not a method
    console.log("SimpleNFT deployed to:", simpleNFT.address);
    
    // Wait for block confirmations
    console.log("Waiting for block confirmations...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds
    console.log("Contract deployment confirmed!");
    
    console.log("Deployment completed!");
    console.log("----------------------------------------------------");
    console.log("Contract Address:", simpleNFT.address);
    console.log("Network:", hre.network.name);
    console.log("Deployer Address:", deployer.address);
    console.log("----------------------------------------------------");
    console.log("You can now update your frontend with the new contract address.");
    
  } catch (error) {
    console.error("Error deploying contract:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });