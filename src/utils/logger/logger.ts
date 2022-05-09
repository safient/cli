import { createLogger, format, transports } from 'winston'
const { combine, errors, json } = format
import path from 'path'
import { success, error, warning } from '../message'

const infoFile = path.join('Logs', 'info.log')
const errorFile = path.join('Logs', 'error.log')
const warnFile = path.join('Logs', 'warn.log')

export const infologger = createLogger({
  level: 'info',
  format: combine(errors({ stack: true }), json()),
  transports: [new transports.File({ filename: infoFile, level: 'info' })],
})

export const errorLogger = createLogger({
  level: 'error',
  format: combine(errors({ stack: true }), json()),
  transports: [new transports.File({ filename: errorFile })],
})

export const warnLogger = createLogger({
  level: 'warn',
  format: combine(errors({ stack: true }), json()),
  transports: [new transports.File({ filename: warnFile })],
})

export const infoLog = (consoleData: string, loggerData: string): void => {
  infologger.info(loggerData)
  console.log(success(consoleData))
}

export const errorLog = (consoleData: string, loggerData: string): void => {
  errorLogger.error(loggerData)
  console.log(error(consoleData))
}
