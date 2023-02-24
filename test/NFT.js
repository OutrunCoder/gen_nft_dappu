const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokensToWei = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}

const etherToWei = tokensToWei;

describe('NFT', () => {
  const NAME = 'Dapp Punks';
  const SYMBOL = 'DP';
  const COST = etherToWei(10);
  const MAX_SUPPLY = 25;

  let nftContract;

  
  describe('Deployment', () => {
    // RESOURCE - https://www.epochconverter.com/
    // const PUBLIC_MINT_OPENS = '1703466000' // Date and time (GMT): Monday, December 25, 2023 1:00:00 AM
    const PUBLIC_MINT_OPENS = (Date.now() + 120000).toString().slice(0, 10) // 2 minutes from now

    beforeEach(async () => {
      const NFT_factory = await ethers.getContractFactory('NFT');
      nftContract = await NFT_factory.deploy({
          _name: NAME,
          _symbol: SYMBOL,
          _cost: COST,
          _maxSupply: MAX_SUPPLY,
          _publicMintOpenOn: PUBLIC_MINT_OPENS
      });
    })

    it('has correct name', async () => {
      expect(await nftContract.name()).to.equal(NAME);
    });
    it('has correct symbol', async () => {
      expect(await nftContract.symbol()).to.equal(SYMBOL);
    });
    it('returns the cost to mint', async () => {
      expect(await nftContract.cost()).to.equal(COST);
    });
    it('returns the maximum total supply', async () => {
      expect(await nftContract.maxSupply()).to.equal(MAX_SUPPLY);
    });
    it('returns the open to public minting time', async () => {
      expect(await nftContract.publicMintOpenOn()).to.equal(PUBLIC_MINT_OPENS);
    });
  })

})
