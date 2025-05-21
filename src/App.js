import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SimpleNFT from './artifacts/contracts/SimpleNFT.sol/SimpleNFT.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [tokenURI, setTokenURI] = useState('');
  const [status, setStatus] = useState({ message: '', isError: false });
  const [mintingInProgress, setMintingInProgress] = useState(false);
  const [nftId, setNftId] = useState(null);
  const [contractAddress, setContractAddress] = useState('0x1B1495637384468F7ea903b68A60e51a0aEe8542'); // Default to our deployed contract

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Update contract instance when contract address changes
  useEffect(() => {
    if (contractAddress && signer) {
      const nftContract = new ethers.Contract(contractAddress, SimpleNFT.abi, signer);
      setContract(nftContract);
      setStatus({
        message: 'Contract connected at: ' + contractAddress.substring(0, 6) + '...' + contractAddress.substring(38),
        isError: false
      });
    }
  }, [contractAddress, signer]);

  async function checkIfWalletIsConnected() {
    try {
      if (window.ethereum) {
        // Get provider from Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        
        // Set signer
        const signer = provider.getSigner();
        setSigner(signer);

        // Check if already connected
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          setStatus({
            message: 'Wallet already connected: ' + accounts[0].substring(0, 6) + '...' + accounts[0].substring(38),
            isError: false
          });
        }
      } else {
        setStatus({
          message: 'Please install MetaMask or use a Web3 browser like Brave',
          isError: true
        });
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      setStatus({
        message: 'Error connecting to wallet: ' + error.message,
        isError: true
      });
    }
  }

  async function connectWallet() {
    try {
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAccount(account);
        setIsConnected(true);
        setStatus({
          message: 'Wallet connected: ' + account.substring(0, 6) + '...' + account.substring(38),
          isError: false
        });
      } else {
        setStatus({
          message: 'Please install MetaMask or use a Web3 browser like Brave',
          isError: true
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setStatus({
        message: 'Error connecting wallet: ' + error.message,
        isError: true
      });
    }
  }

  async function mintNFT() {
    if (!isConnected) {
      setStatus({
        message: 'Please connect your wallet first!',
        isError: true
      });
      return;
    }

    if (!tokenURI) {
      setStatus({
        message: 'Please enter a token URI',
        isError: true
      });
      return;
    }

    if (!contract) {
      setStatus({
        message: 'Contract not initialized. Please enter a contract address first.',
        isError: true
      });
      return;
    }

    try {
      setMintingInProgress(true);
      setStatus({
        message: 'Minting NFT...',
        isError: false
      });

      // Call the mintNFT function from the contract
      const transaction = await contract.mintNFT(account, tokenURI);
      
      // Wait for the transaction to be mined
      const receipt = await transaction.wait();
      
      // Get the token ID from the event logs
      const event = receipt.events.find(event => event.event === 'Transfer');
      const tokenId = event.args.tokenId.toString();
      
      setNftId(tokenId);
      setStatus({
        message: `Success! NFT minted with ID: ${tokenId}`,
        isError: false
      });
    } catch (error) {
      console.error("Error minting NFT:", error);
      setStatus({
        message: 'Error minting NFT: ' + error.message,
        isError: true
      });
    } finally {
      setMintingInProgress(false);
    }
  }

  return (
    <div className="container">
      <h1>Simple NFT Minter</h1>
      <p>This dApp allows you to mint NFTs on the Ethereum blockchain.</p>
      
      {!isConnected ? (
        <button 
          className="button" 
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p>Connected Account: {account.substring(0, 6)}...{account.substring(38)}</p>
          
          <div>
            <h2>Contract Setup</h2>
            <input
              type="text"
              placeholder="Enter deployed contract address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
          </div>
          
          {contract && (
            <div>
              <h2>Mint New NFT</h2>
              <p>Enter the metadata URI for your NFT:</p>
              <input
                type="text"
                placeholder="e.g., https://gateway.pinata.cloud/ipfs/..."
                value={tokenURI}
                onChange={(e) => setTokenURI(e.target.value)}
              />
              <p><small>This should point to a JSON file with metadata about your NFT (image URL, name, description).</small></p>
              
              <button 
                className="button" 
                onClick={mintNFT}
                disabled={mintingInProgress || !tokenURI}
              >
                {mintingInProgress ? 'Minting...' : 'Mint NFT'}
              </button>
            </div>
          )}
        </>
      )}
      
      {status.message && (
        <div className={`status ${status.isError ? 'error' : 'success'}`}>
          {status.message}
        </div>
      )}
      
      {nftId && (
        <div className="status success">
          <h3>NFT Minted!</h3>
          <p>NFT ID: {nftId}</p>
          <p>Token URI: {tokenURI}</p>
        </div>
      )}

      <footer className="footer">
        <p>Deployed on IPFS - Truly Decentralized</p>
        <p>Contract: <a href={`https://sepolia.etherscan.io/address/${contractAddress}`} target="_blank" rel="noopener noreferrer">{contractAddress.substring(0, 6)}...{contractAddress.substring(38)}</a></p>
      </footer>
    </div>
  );
}

export default App;