import dotenv from 'dotenv'
dotenv.config()

export default {
  localhost: {
    url: 'http://localhost:8545',
  },
  mainnet: {
    url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    blockExplorer: 'https://etherscan.io',
  },
  kovan: {
    url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    blockExplorer: 'https://kovan.etherscan.io',
  },
  polygontestnet: {
    url: 'https://matic-mumbai.chainstacklabs.com',
    blockExplorer: 'https://mumbai.polygonscan.com',
  },
}
