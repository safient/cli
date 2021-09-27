import { bold, yellow, blue } from 'chalk'

export const success = (text: string): string => bold.green('✔ ', text)
export const error = (text: string): string => bold.red('✖ ', text)
export const warning = (text: string): string => yellow('⚠ ', text)
export const info = (text: string): string => blue('ℹ', text)
