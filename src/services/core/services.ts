import { AccountServiceImpl } from '../account/account.service.impl'
import { SafeServiceImpl } from '../safe/safe.service.impl'

export const accountService = new AccountServiceImpl()
export const safeService = new SafeServiceImpl()
