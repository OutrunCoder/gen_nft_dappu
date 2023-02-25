// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "./Ownable.sol";
import "./Strings.sol";

struct NFTDeploymentArgs {
  string _name;
  string _symbol;
  uint256 _cost;
  uint256 _maxSupply;
  uint256 _publicMintOpenOn;
  string _baseURI;
}

contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public cost;
    uint256 public maxSupply;
    uint256 public publicMintOpenOn;
    string public baseURI;

    constructor(NFTDeploymentArgs memory args)
    ERC721(
        args._name,
        args._symbol
    ) {
        cost = args._cost;
        maxSupply = args._maxSupply;
        publicMintOpenOn = args._publicMintOpenOn;
        baseURI = args._baseURI;
    }

    event Mint(uint256 quantity, address minter);

    function mint(uint256 _mintQty) public payable {
        // Require that publicMintOpenOn date has passed
        require(block.timestamp >= publicMintOpenOn, "Minting cannot happen before open to public date");
        
        // 1 mint minimum requirement
        require(_mintQty > 0);

        // TODO - ADD A MAX MINT REQUIREMENT BY MSG.SENDER MAPPING
        
        // Require enough payment for mint
        require(msg.value >= cost * _mintQty, 'Not enough payment to fulfill the requested mint quantity!');

        uint256 supply = totalSupply();
        // Cap mint to max supply
        require(supply + _mintQty <= maxSupply, 'MINT max supply met! cannot mint any new NFTs. sorry!');

        // Create tokens
        // ? is index maintained ??? <<<
        // ? how does the contract keep track of all tokens minted here ??? 
        for (uint256 i = 1; i <= _mintQty; i++) {
            // NOTE - comes from enumerable and will increment here
            // TODO - RESEARCH - _safemint usage and procedure
            _safeMint(msg.sender, supply + i);
        }

        emit Mint(_mintQty, msg.sender);
    }

    // Return metadata IPFS url
    // EG: 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/1.json'
    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns(string memory)
    {
        require(_exists(_tokenId), 'Token ID is not supported or minted.');

        // ! from poc
        // requires "using Strings for uint256;" at top of contract
        return (string (abi.encodePacked(baseURI, '/', _tokenId.toString(), '.json')));
        // DOCS - resolved by: https://ethereum.stackexchange.com/questions/119294/typeerror-member-tostring-not-found-or-not-visible-after-argument-dependent-l
        // return(string(abi.encodePacked(baseURI, '/', Strings.toString(_tokenId), '.json')));
    }

    function walletOfOwner(address _owner) public view returns(uint256[] memory) {
        // ? garbage collection ? with memory modifier
        // ? life cycle / state management / scope
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);

        for(uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i); // << from libs
        }

        return tokenIds;
    }

    function withdraw()public onlyOwner {
        uint256 balance = address(this).balance;

        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, 'Balance transer was stopped');
    }
}
