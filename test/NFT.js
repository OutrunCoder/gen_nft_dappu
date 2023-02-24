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
    beforeEach(async () => {
      const NFT_factory = await ethers.getContractFactory('NFT');
      nftContract = await NFT_factory.deploy({
          _name: NAME,
          _symbol: SYMBOL,
          _cost: COST,
          _maxSupply: MAX_SUPPLY,
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
  })

})
