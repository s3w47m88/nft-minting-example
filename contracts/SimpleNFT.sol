// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleNFT is ERC721URIStorage, Ownable {
    // Replace Counters with a simple uint256
    uint256 private _nextTokenId = 1; // Start at 1 to match tests expectations
    
    constructor() ERC721("SimpleNFT", "SNFT") Ownable(msg.sender) {}
    
    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newItemId = _nextTokenId;
        _nextTokenId += 1;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        return newItemId;
    }
}