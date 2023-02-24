// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";

struct NFTDeploymentArgs {
  string _name;
  string _symbol;
  uint256 _cost;
  uint256 _maxSupply;
}

contract NFT is ERC721Enumerable {
    uint256 public cost;
    uint256 public maxSupply;

    constructor(NFTDeploymentArgs memory args)
    ERC721(
        args._name,
        args._symbol
    ) {
        cost = args._cost;
        maxSupply = args._maxSupply;
    }
}
