const { randomBytes } = require('crypto');
const chai = require('chai');
const { JsonRpcProvider } = require('@ethersproject/providers');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// import { Wallet as EthersWallet } from 'ethers'
const { Errors, Types, SafientCore } = require('@safient/core')

const { DatabaseType, Network } = require('../dist/types')
const { Wallet } = require('../dist/utils/wallet')


describe('Scenario 1 - Auto safe reconstruction', async () => {
  
  let creator;
  let beneficiary;
  let safeId;
  let provider, chainId;
  let creatorSigner, beneficiarySigner; 
  let disputeId
  let creatorSc, beneficiarySc

  const apiKey = process.env.USER_API_KEY
  const secret = process.env.USER_API_SECRET

  const ClaimType = {
    SignalBased: 0,
    ArbitrationBased: 1
  }

  before(async() => {

    provider = new JsonRpcProvider('http://localhost:8545');
    creatorSigner = await provider.getSigner(1);
    beneficiarySigner = await provider.getSigner(2);
    chainId = await creatorSigner.getChainId()
    
  })
  
  //Step 1: Register safe creator
  it('Should register a Creator', async () => {
    creatorSc = new SafientCore(creatorSigner, Network.devnet, DatabaseType.threadDB, apiKey, secret);
    const userAddress = await creatorSigner.getAddress();
    try{
      creator = await creatorSc.loginUser();
    }catch(err){
      if(err.error.code === Errors.Errors.UserNotFound.code){
        creator = await creatorSc.createUser('User 1', 'user1@safient.com', 0, userAddress);
      }
    }
    
    try{
      const result = await creatorSc.createUser('User 1', 'user1@safient.com', 0, userAddress);
    }catch(err){
      expect(err.error.code).to.equal(11);
    }

    const loginUser = await creatorSc.getUser({ did: creator.data.did });
    expect(loginUser.data.name).to.equal('User 1');
    expect(loginUser.data.email).to.equal('user1@safient.com');

});

//Step 2: Register safe beneficiary
it('Should register a beneficiary', async () => {
  
  beneficiarySc = new SafientCore(beneficiarySigner, Network.devnet, DatabaseType.threadDB, apiKey, secret);
  const userAddress = await beneficiarySigner.getAddress();
  try{
    beneficiary = await beneficiarySc.loginUser();
  }catch(err){
    if(err.error.code === Errors.Errors.UserNotFound.code){
      beneficiary = await beneficiarySc.createUser('User 2', 'user2@safient.com', 0, userAddress);
    }
  }
  
  try{
    const result = await beneficiarySc.createUser('User 2', 'user2@safient.com', 0, userAddress);
  }catch(err){
    expect(err.error.code).to.equal(11);
  }

  const loginUser = await beneficiarySc.getUser({ did: beneficiary.data.did });
  expect(loginUser.data.name).to.equal('User 2');
  expect(loginUser.data.email).to.equal('user2@safient.com');
});


  //Step 3: Create a Signal based safe 
  it('Should create a seed phrase based safe', async () => {
   
    
    const secretSafe = {
      seedPhrase: 'index negative film salon crumble wish rebuild seed betray meadow next ability',
      privateKey: null,
      keyStore: null,
    };
    const cryptoSafe = {
      data: secretSafe,
    };
    const safeData = {
      data: cryptoSafe,
    };
    const safe = await creatorSc.createSafe(
      creator.data.did,
      beneficiary.data.did,
      safeData,
      true,
      ClaimType.SignalBased,
      4,
      0
    );
    safeId = safe.data;
    const safeResult = await creatorSc.getSafe(safeId);
    expect(safeResult.data.creator).to.equal(creator.data.did);
  });


  
  //Step 4: Create a safe claim
  it('Should create a claim', async () => {
    const file = {
        name: "signature.jpg"
    }

    
    disputeId = await beneficiarySc.createClaim(safeId, file, "Testing Evidence", "Lorsem Text")
    const mineNewBlock = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(provider.send('evm_mine'));
        }, 7000);
      });
      const result = await mineNewBlock;
    expect(disputeId.data).to.be.a('number');
  });

  // it('Should update the stage on threadDB', async () => {
  //     const result = await beneficiarySc.syncStage(safeId)
  //     expect(result.data).to.equal(true);
  // });

 
  //Step 5: Recover the safe
  it('Should recover data for the beneficiary', async () => {

    let safeData = await beneficiarySc.getSafe(safeId)
    // Wait until the safe is reconstructed by the guardians
    // beneficiarySc = new SafientCore(creatorSigner, Network.devnet, DatabaseType.threadDB, apiKey, secret);
    for(;safeData.data.stage!=3;) {
    safeData = await beneficiarySc.getSafe(safeId)
    }
    const data = await beneficiarySc.recoverSafeByBeneficiary(safeId, beneficiary.data.did)
    expect(data.data.data.data.seedPhrase).to.equal(
      'index negative film salon crumble wish rebuild seed betray meadow next ability'
    );
  });


});
