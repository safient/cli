// const { Client, PrivateKey, ThreadID, Where } = require('@textile/hub');
const { randomBytes } = require('crypto');
// const { getThreadId } = require('../dist/utils/threadDb');
const chai = require('chai');
const { writeFile } = require('fs').promises
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// import { Wallet as EthersWallet } from 'ethers'
const { Types, SafientCore } = require('@safient/core')

const { Network, Safe } = require('../dist/types')
const { Wallet } = require('../dist/utils/wallet')

const { JsonRpcProvider } = require('@ethersproject/providers');

describe('Scenario 1 - Creating safe offChain', async () => {
  
  let creator;
  let beneficiary;
  let safeId;
  let provider, chainId;
  let creatorSigner, beneficiarySigner;
  let disputeId
  let admin
  let creatorSc, beneficiarySc

  const apiKey = process.env.USER_API_KEY
  const secret = process.env.USER_API_SECRET

  const ClaimType = {
    SignalBased: 0,
    ArbitrationBased: 1
  }

  before(async() => {

    provider = new JsonRpcProvider('http://localhost:8545');
    const wallet = new Wallet()
    creatorSigner = await wallet.account(Network.local, 'glory pull screen buddy warrior candy mind common open they bachelor license')
    beneficiarySigner = await wallet.account(Network.local, 'lens afford example gas slogan until relief actual grass hair taste behave')
    chainId = await creatorSigner.getChainId()
    
  })
  //Step 1: Register safe creator
  it('Should register a Creator', async () => {
    creatorSc = new SafientCore(creatorSigner, chainId, 'threadDB');
    creator = await creatorSc.loginUser(apiKey, secret);
    const userAddress = await creatorSigner.getAddress()
    if(creator.status === false){
      const res = await creatorSc.createUser('User1', 'user1@safient.io', 0, userAddress);
    }
    else if(creator.status === true){
      expect(creator.data.email).to.equal('user1@safient.io')
    }

    const result = await creatorSc.createUser('User1', 'user1@safient.io', 0, userAddress);
    expect(result.error.message).to.equal(`user1@safient.io already registered.`)

    const loginUser = await creatorSc.getUser({did: creator.idx.id});
    expect(loginUser.name).to.equal('User1');
    expect(loginUser.email).to.equal('user1@safient.io');

});

//Step 2: Register safe beneficiary
it('Should register a beneficiary', async () => {
  
    beneficiarySc = new SafientCore(beneficiarySigner, chainId, 'threadDB');
    beneficiary = await beneficiarySc.loginUser(apiKey, secret);
    // SUCCESS : create user A

    const userAddress = await beneficiarySigner.getAddress()
    if(beneficiary.status ===  false){
      await beneficiarySc.createUser('User2', 'user2@safient.io', 0, userAddress);
    }else if(beneficiary.status === true){
      expect(beneficiary.data.email).to.equal('user2@safient.io')
    }

    const result = await beneficiarySc.createUser('User2', 'user2@safient.io', 0, userAddress);
    expect(result.error.message).to.equal(`user2@safient.io already registered.`)

    // SUCCESS : get all users (check if the user A was created)
    const loginUser = await beneficiarySc.getUser({did: beneficiary.idx.id});
    expect(loginUser.name).to.equal('User2');
    expect(loginUser.email).to.equal('user2@safient.io');
});


  //Step 3: Create a Signal based safe 
  it('Should create safe with "Testing Safe data" as data offchain', async () => {
   
     
      safeId = await creatorSc.createSafe(creator.idx.id, beneficiary.idx.id, "Testing safe Data", false, ClaimType.SignalBased, 4)
      const safeData = await creatorSc.getSafe(safeId);
      expect(safeData.creator).to.equal(creator.idx.id);
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
    expect(disputeId).to.be.a('number');
  });

  it('Should update the stage on threadDB', async () => {
      const result = await beneficiarySc.syncStage(safeId)
      expect(result).to.equal(true);
  });

 
  //Step 5: Recover the safe
  it('Should recover data for the beneficiary', async () => {

    let safeData = {}
    // Wait until the safe is reconstructed by the guardians
    for(;safeData.stage!=3;) {
    safeData = await beneficiarySc.getSafe(safeId)
    }
    const data = await beneficiarySc.recoverSafeByBeneficiary(safeId, beneficiary.idx.id)
      expect(data.data).to.equal('Testing safe Data');
  });


});
