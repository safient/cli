import { Types, Enums, Errors } from '@safient/core'

export enum Network {
  mainnet = Enums.NetworkType.mainnet,
  testnet = Enums.NetworkType.testnet,
  local = Enums.NetworkType.localhost,
  devnet = Enums.NetworkType.devnet,
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
}

export type TriggerParameters = {
  $user_id: string,
  $email: string
  safeId?: string | undefined,
  claimId?: string | undefined,
  firstName?: string,
  lastName?: string,
}

export type User = Types.User

export type Safe = Types.Safe

export type SafeMeta = Types.SafeMeta

export const DatabaseType = Enums.DatabaseType

export const SafeStage = Enums.SafeStages

export const claimStages = Enums.ClaimStages

export type SecretSafe = Types.SecretSafe

export type CryptoSafe = Types.CryptoSafe

export type SafeStore = Types.SafeStore

export const Error = Errors.Errors
