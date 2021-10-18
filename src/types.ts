export enum Network {
  mainnet,
  testnet,
  local,
}

export type WorkerOptions = {
  
  registed: boolean
  name: string
  email: string
  config: string
  ipfsApi: string
  ethereumRpc: string
  port: number
  hostname: string
  debug: boolean
  verbose: boolean
  network: Network
}

// export type Response<T> = {
//   result: T
//   status: number
// }
