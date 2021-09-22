import { addAsync } from '@awaitjs/express'
import express from 'express'
import cors from 'cors'
import type { Server } from 'http'

export const createApp = async (): Promise<express.Express> => {
  const app = addAsync(express())
  app.set('trust proxy', true)
  app.use(express.json({ limit: '1mb' }))

  // Log requests to the logger stream
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use(cors())

  // Endpoint for health checks
  app.get('/', (_, res) => {
    res.status(200).send('Ready to roll!')
  })

  // Endpoint for version
  app.use('/version', (_, res) => {
    res.status(200).send({ version: '0.1.0' })
  })

  return app
}

export const createServer = async (port: number, hostname: string): Promise<Server> => {
  const app = await createApp()

  return app.listen(port, hostname, () => {
    console.log(`Listening on port ${port}`)
  })
}

export const closeServer = () => {
  // Close the express server, gracefully
}
