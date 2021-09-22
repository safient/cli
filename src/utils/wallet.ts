import { generateMnemonic, mnemonicToSeed } from 'bip39'
import { providers, utils, Wallet as EthersWallet } from 'ethers'
import { hdkey } from 'ethereumjs-wallet'
import { privateToAddress } from 'ethereumjs-util'
import { readFileSync, writeFileSync } from 'fs'
// import { generate } from 'qrcode-terminal'

import networks from './networks'
import { Network } from '../types'

type Account = {
  address: string
  privateKey: string
}

export class Wallet {
  private walletProvider?: EthersWallet

  async create(): Promise<string> {
    const mnemonic = generateMnemonic()
    console.log('mnemonic', mnemonic)

    const account: Account = await this._retrievAccount(mnemonic)

    console.log(
      '🔐 Account Generated as ' +
        account.address +
        ' and set as mnemonic in root directory',
    )

    writeFileSync('./mnemonic.txt', mnemonic.toString())

    return mnemonic
  }

  async _retrievAccount(mnemonic: string): Promise<Account> {
    const seed = await mnemonicToSeed(mnemonic)
    const hdwallet = hdkey.fromMasterSeed(seed)
    const wallet_hdpath = "m/44'/60'/0'/0/"
    const account_index = 0
    const fullPath = wallet_hdpath + account_index
    console.log('fullPath', fullPath)
    const wallet = hdwallet.derivePath(fullPath).getWallet()
    const privateKey = '0x' + wallet.getPrivateKey().toString('hex')
    console.log('privateKey', privateKey)

    const address = '0x' + privateToAddress(wallet.getPrivateKey()).toString('hex')

    return { address, privateKey }
  }

  async account(network: Network): Promise<EthersWallet> {
    let mnemonic
    try {
      mnemonic = readFileSync('./mnemonic.txt').toString().trim()
    } catch (e) {
      mnemonic = await this.create()
    }

    const account: Account = await this._retrievAccount(mnemonic)
    const signableAccount = new EthersWallet(account.privateKey)

    // generate(account.address, { small: true });

    console.log(
      '‍📬 Your address ' + account.address + (await signableAccount.getAddress()),
    )

    let provider
    console.log(Network[network].toString(), Network.local.toString())
    if (Network[network] == Network.local.toString()) {
      provider = new providers.JsonRpcProvider(networks.localhost.url)
    } else if (Network[network].toString() == Network.testnet.toString()) {
      provider = new providers.JsonRpcProvider(networks.kovan.url)
    } else {
      provider = new providers.JsonRpcProvider(networks.mainnet.url)
    }

    const balance = await provider.getBalance(account.address)

    console.log(' -- ' + network + ' --  -- -- 📡 ')
    console.log('   balance: ' + utils.formatEther(balance))
    console.log('   nonce: ' + (await provider.getTransactionCount(account.address)))

    this.walletProvider = signableAccount.connect(provider)
    return this.walletProvider
  }

  async send() {
    const tx = {
      to: '0x958543756A4c7AC6fB361f0efBfeCD98E4D297Db',
      value: utils.parseEther('0.01'),
    }

    const txResponse = await this.walletProvider?.sendTransaction(tx)
    console.log(txResponse)
  }
}
