// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";

struct NFTDeploymentArgs {
  string _name;
  string _symbol;
  uint256 _cost;
}

contract NFT is ERC721Enumerable {
    uint256 public cost;

    constructor(NFTDeploymentArgs memory args)
    ERC721(
        args._name,
        args._symbol
    ) {
        cost = args._cost;
    }
}

// @ 14:50 "extending out of the box"