import { addAsync, Router } from '@awaitjs/express'
import express from 'express'
import cors from 'cors'
import type { Server } from 'http'
import { accountService, safeService } from '../../services'

export const createApp = async (): Promise<express.Express> => {
  const app = addAsync(express())

  const baseRouter = Router()
  app.set('trust proxy', true)
  app.use(express.json({ limit: '1mb' }))

  // Log requests to the logger stream
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use(cors())

  app.use('/', baseRouter)

  // Endpoint for health checks
  app.getAsync('/health', (_, res) => {
    res.json({ message: 'Ready to roll!' })
  })

  // Endpoint to get current user info
  app.getAsync('/me', (_, resp) => {
    resp.json(accountService.user)
  })

  // Endpoint to get safe info
  app.getAsync('/safe', async (req, resp) => {
    const safeId: string = req.query.id ? req.query.id.toString() : ''
    resp.json(await safeService.get(safeId))
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

export const closeServer = (): void => {
  // Close the express server, gracefully
}
