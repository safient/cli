import { generateMnemonic, mnemonicToSeed } from 'bip39'
import { providers, utils, Wallet as EthersWallet } from 'ethers'
import { hdkey } from 'ethereumjs-wallet'
import { privateToAddress } from 'ethereumjs-util'
import { readFileSync, writeFileSync } from 'fs'
// import { generate } from 'qrcode-terminal'

import { info, success } from '../utils/message'
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

    console.log(success('New account created'))
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
    const wallet = hdwallet.derivePath(fullPath).getWallet()
    const privateKey = '0x' + wallet.getPrivateKey().toString('hex')

    const address = '0x' + privateToAddress(wallet.getPrivateKey()).toString('hex')

    return { address, privateKey }
  }

  async account(network: Network, secret?: string): Promise<EthersWallet> {
    let mnemonic
    if (!secret) {
      try {
        mnemonic = readFileSync('./mnemonic.txt').toString().trim()
      } catch (e) {
        mnemonic = await this.create()
      }
    } else {
      mnemonic = secret
    }

    const account: Account = await this._retrievAccount(mnemonic)
    const signableAccount = new EthersWallet(account.privateKey)

    // generate(account.address, { small: true });

    console.log(info('Retriving account information'))
    console.log(info('‍📬 Your wallet address '), account.address)

    let provider
    if (network == Network.local || network == Network.devnet) {
      provider = new providers.JsonRpcProvider(networks.localhost.url)
    } else if (network == Network.testnet) {
      provider = new providers.JsonRpcProvider(networks.kovan.url)
    } else {
      provider = new providers.JsonRpcProvider(networks.mainnet.url)
    }

    const balance = await provider.getBalance(account.address)

    console.log(' -- ' + Network[network] + ' --  -- -- 📡 ')
    console.log('   balance: ' + utils.formatEther(balance))
    console.log('   nonce: ' + (await provider.getTransactionCount(account.address)))

    this.walletProvider = signableAccount.connect(provider)
    return this.walletProvider
  }

  async send(to: string, value: string): Promise<void> {
    const tx = {
      to: to,
      value: utils.parseEther(value),
    }

    const txResponse = await this.walletProvider?.sendTransaction(tx)
    console.log(txResponse)
  }
}
