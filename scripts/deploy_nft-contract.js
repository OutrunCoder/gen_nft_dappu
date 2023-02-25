// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const NAME = 'Dapp Punks'
  const SYMBOL = 'DP'
  const MAX_SUPPLY = 25
  //
  const COST_ETH_PER_MINT = ethers.utils.parseUnits('2', 'ether');
  const PUBLIC_MINT_OPENS = (Date.now() + 60000).toString().slice(0, 10) // NOW
  const BASE_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg'

  // Deploy Token
  const NFT_factory = await hre.ethers.getContractFactory('NFT');
  let nftContract = await NFT_factory.deploy({
    _name: NAME,
        _symbol: SYMBOL,
        _cost: COST_ETH_PER_MINT,
        _maxSupply: MAX_SUPPLY,
        _publicMintOpenOn: PUBLIC_MINT_OPENS,
        _baseURI: BASE_URI
  })

  await nftContract.deployed()
  console.log(`NFT contract deployed to: ${nftContract.address}\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
