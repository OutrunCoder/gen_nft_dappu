const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokensToWei = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}

const etherToWei = tokensToWei;

describe('NFT', () => {
  const NAME = 'Dapp Punks';
  const SYMBOL = 'DP';
  const ETH_PER_MINT = 10;
  const ONE_MINT_COST = etherToWei(ETH_PER_MINT);
  const MAX_SUPPLY = 25;
  const BASE_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'

  let nftContract, deployer, minter;

  beforeEach(async () => {
    let accounts = await ethers.getSigners();
    [
      deployer,
      minter
    ] = accounts;
  });

  describe('Deployment', () => {
    // RESOURCE - https://www.epochconverter.com/
    // const PUBLIC_MINT_OPENS = '1703466000' // Date and time (GMT): Monday, December 25, 2023 1:00:00 AM
    const PUBLIC_MINT_OPENS = (Date.now() + 120000).toString().slice(0, 10) // 2 minutes from now

    beforeEach(async () => {
      const NFT_factory = await ethers.getContractFactory('NFT');
      nftContract = await NFT_factory.deploy({
          _name: NAME,
          _symbol: SYMBOL,
          _cost: ONE_MINT_COST,
          _maxSupply: MAX_SUPPLY,
          _publicMintOpenOn: PUBLIC_MINT_OPENS,
          _baseURI: BASE_URI
      });
    });

    it('has correct name', async () => {
      expect(await nftContract.name()).to.equal(NAME);
    });
    it('has correct symbol', async () => {
      expect(await nftContract.symbol()).to.equal(SYMBOL);
    });
    it('returns the cost to mint', async () => {
      expect(await nftContract.cost()).to.equal(ONE_MINT_COST);
    });
    it('returns the maximum total supply', async () => {
      expect(await nftContract.maxSupply()).to.equal(MAX_SUPPLY);
    });
    it('returns the open to public minting time', async () => {
      expect(await nftContract.publicMintOpenOn()).to.equal(PUBLIC_MINT_OPENS);
    });
    it('returns the IPFS base URI', async () => {
      expect(await nftContract.baseURI()).to.equal(BASE_URI);
    });
    it('returns the owner', async () => {
      expect(await nftContract.owner()).to.equal(deployer.address);
    });
  })

  describe('Minting', () => {
    let trx, result;
    const PUBLIC_MINT_OPENS = (Date.now()).toString().slice(0, 10) // now
    const MINT_QTY = 45;
    const mintAmountInEth = MINT_QTY * ETH_PER_MINT;
    const combinedMintCost = etherToWei(mintAmountInEth);

    console.table({
      mintAmountInEth
    })
    console.log('>> COMBINED_MINT_COST:', combinedMintCost);

    beforeEach(async () => {
      // ! DEPLOY FOR ALL MINTING !
      const NFT_factory = await ethers.getContractFactory('NFT');
      nftContract = await NFT_factory.deploy({
        _name: NAME,
        _symbol: SYMBOL,
        _cost: ONE_MINT_COST,
        _maxSupply: MAX_SUPPLY,
        _publicMintOpenOn: PUBLIC_MINT_OPENS,
        _baseURI: BASE_URI
      });
    });

    describe('Success', () => {
      beforeEach(async() => {
        // ! MINT - SUCCESS
        trx = await nftContract.connect(minter).mint(MINT_QTY, { value: combinedMintCost });
        result = await trx.wait();
      });

      it('updates the total supply', async() => { 
        const totalSupplyMinted = await nftContract.totalSupply();
        console.log('>> TOTAL SUPPLY MINTED:', totalSupplyMinted, MINT_QTY);
        expect(totalSupplyMinted).to.equal(MINT_QTY);
      });

      it('updates the contract ether balance', async() => {
        expect(await ethers.provider.getBalance(nftContract.address)).to.equal(combinedMintCost);
      });
    });

    describe('Failure', () => {

      it('rejects insufficient mint payment', async() => {
        const underFundedMint = nftContract.connect(minter).mint(MINT_QTY, { value: etherToWei(5) }); // SHOULD BE 10 PER MINT
        await expect(underFundedMint).to.be.reverted;
      });
      
      it('rejects null mint quantity', async() => {
        const nullMint = nftContract.connect(minter).mint(0, { value: combinedMintCost }); // SHOULD BE 10 PER MINT
        await expect(nullMint).to.be.reverted;
      });
    });
    
    // it('', async() => {});
  });

  describe('Minting - pre launch', () => {
    const futureDate = 'May 26, 2030 18:00:00';
    const PUBLIC_MINT_OPENS = new Date(futureDate).getTime().toString().slice(0, 10) // ! IN THE FUTURE...
    const MINT_QTY = 2;
    const mintAmountInEth = MINT_QTY * ETH_PER_MINT;
    const combinedMintCost = etherToWei(mintAmountInEth);

    console.table({
      futureDate,
      PUBLIC_MINT_OPENS,
      MINT_QTY,
      mintAmountInEth
    })
    console.log('>> COMBINED_MINT_COST:', combinedMintCost);

    beforeEach(async () => {
      // ! DEPLOY FOR ALL MINTING !
      const NFT_factory = await ethers.getContractFactory('NFT');
      nftContract = await NFT_factory.deploy({
        _name: NAME,
        _symbol: SYMBOL,
        _cost: ONE_MINT_COST,
        _maxSupply: MAX_SUPPLY,
        _publicMintOpenOn: PUBLIC_MINT_OPENS,
        _baseURI: BASE_URI
      });
    });

    describe('Failure', () => {
      it('rejects minting before launch', async() => {
        const validButEarly = nftContract.connect(minter).mint(MINT_QTY, { value: combinedMintCost });
        await expect(validButEarly).to.be.reverted;
      });
    });
  });

  // X - TEMPLATE
  // describe('TEMP', () => {
  //   let trx, result;

  //   describe('Success', () => {});

    // describe('Failure', () => {});

    // it('', async() => {});
  // });
})
