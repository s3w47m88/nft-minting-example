const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleNFT", function () {
  let SimpleNFT;
  let simpleNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    SimpleNFT = await ethers.getContractFactory("SimpleNFT");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy SimpleNFT contract
    simpleNFT = await SimpleNFT.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      // The first signer should be the owner
      expect(await simpleNFT.owner()).to.equal(owner.address);
    });

    it("Should have the correct name and symbol", async function () {
      expect(await simpleNFT.name()).to.equal("SimpleNFT");
      expect(await simpleNFT.symbol()).to.equal("SNFT");
    });
  });

  describe("Minting", function () {
    it("Should mint a new token", async function () {
      const tokenURI = "https://example.com/token/1";
      
      // Mint a new token
      await simpleNFT.mintNFT(addr1.address, tokenURI);
      
      // The token ID should be 1
      expect(await simpleNFT.ownerOf(1)).to.equal(addr1.address);
      
      // The token URI should be set correctly
      expect(await simpleNFT.tokenURI(1)).to.equal(tokenURI);
    });

    it("Should increment token IDs correctly", async function () {
      // Mint multiple tokens
      await simpleNFT.mintNFT(addr1.address, "https://example.com/token/1");
      await simpleNFT.mintNFT(addr2.address, "https://example.com/token/2");
      await simpleNFT.mintNFT(owner.address, "https://example.com/token/3");
      
      // Check ownership of each token
      expect(await simpleNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await simpleNFT.ownerOf(2)).to.equal(addr2.address);
      expect(await simpleNFT.ownerOf(3)).to.equal(owner.address);
    });

    it("Should not allow non-owners to mint", async function () {
      // Try to mint as addr1 (not the owner)
      await expect(
        simpleNFT.connect(addr1).mintNFT(addr1.address, "https://example.com/token/1")
      ).to.be.revertedWithCustomError(simpleNFT, "OwnableUnauthorizedAccount");
    });
  });
});