import {createLogger, format, transports }from 'winston';
const { combine, errors, json } = format;
import path from 'path'
import { success, error, warning } from '../message';


export const logger = createLogger({
    format: combine(
      errors({ stack: true }),
      json()
    ),
    transports: [
      new transports.File({filename: 'info.log', level: 'info'}),
      new transports.File({filename: 'warn.log', level: 'warn'})
    ]
  });

  export const errorLogger = createLogger({
    level: 'error',
    format: combine(
      errors({ stack: true }),
      json()
    ),
    transports: [
      new transports.File({filename: 'error.log'}),
    ]
  });

export const infoLog = (consoleData: string, loggerData: string ): void => {
  logger.info(loggerData);
  console.log(success(consoleData));
}

export const errorLog = (consoleData: string, loggerData: string ): void => {
  errorLogger.error(loggerData);
  console.log(error(consoleData));
}