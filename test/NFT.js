const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('NFT', () => {
  const NAME = 'Dapp Punks';
  const SYMBOL = 'DP';

  let nftContract;

  beforeEach(async () => {
    const NFT_factory = await ethers.getContractFactory('NFT');
    nftContract = await NFT_factory.deploy({
      _name: NAME,
      _symbol: SYMBOL
  });
  })

  describe('Deployment', () => {

    it('has correct name', async () => {
      expect(await nftContract.name()).to.equal(NAME)
    })
    it('has correct symbol', async () => {
      expect(await nftContract.symbol()).to.equal(SYMBOL)
    })
  })

})
