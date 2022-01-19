import { ServiceResponse } from '../core/service-response.'
import { Safe } from '../../types'

export interface SafeService {
  get(safeId: string): Promise<ServiceResponse<Safe>>

  create(
    beneficiary: string,
    data: string,
    onchain: boolean,
  ): Promise<ServiceResponse<string>>

  claim(safeId: string): Promise<ServiceResponse<number>>

  signal(safeId: string): Promise<ServiceResponse<boolean>>

  recover(safeId: string): Promise<ServiceResponse<string>>

  reconstruct(safeId: string): Promise<ServiceResponse<boolean>>
}
