import { ServiceResponse } from '../core/service-response.'
import { Network, User } from '../../types'

export interface AccountService {
  connect(network: Network): Promise<ServiceResponse<User>>

  login(): Promise<ServiceResponse<User>>

  create(name: string, email: string): Promise<ServiceResponse<User>>

  get(did: string): Promise<ServiceResponse<User>>
}
