const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('NFT', () => {
  let nftContract;

  beforeEach(async () => {
    const NFT_factory = await ethers.getContractFactory('NFT');
    nftContract = await NFT_factory.deploy('Dapp University', 'DAPP');
  })

  describe('Deployment', () => {
    const name = 'Dapp University'
    const symbol = 'DAPP'

    it('has correct name', async () => {
      expect(await nftContract.name()).to.equal(name)
    })
    it('has correct symbol', async () => {
      expect(await nftContract.symbol()).to.equal(symbol)
    })
  })

})
