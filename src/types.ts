import { Types } from '@safient/core'

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
  port: number
  hostname: string
  debug: boolean
  verbose: boolean
  network: Network
}

export type GatewayOptions = {
  registed: boolean
  name: string
  email: string
  config: string
  ipfsApi: string
  port: number
  hostname: string
  debug: boolean
  verbose: boolean
  network: Network
}

export type Safe = Types.Safe

export type SafeData = Types.SafeData

// export type Response<T> = {
//   result: T
//   status: number
// }

export const safeStages = {
  ACTIVE: 0,
  CLAIMING: 1,
  RECOVERING: 2,
  RECOVERED: 3,
  CLAIMED: 4,
}

export const claimStages = {
  ACTIVE: 0,
  PASSED: 1,
  FAILED: 2,
  REJECTED: 3,
}
