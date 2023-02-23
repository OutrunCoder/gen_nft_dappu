// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";

struct NFTDeploymentArgs {
  string _name;
  string _symbol;
}

contract NFT is ERC721Enumerable {

    constructor(NFTDeploymentArgs memory args) ERC721(args._name, args._symbol) {

    }
}
