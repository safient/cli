import { addAsync, Router } from '@awaitjs/express'
import express from 'express'
import cors from 'cors'
import type { Server } from 'http'
import { accountService, safeService } from '../../services'
import {
  sendClaimNofitication,
  sendCreateSafeNofitication,
  sendRecoveryNotification,
} from '../notification/notification'
import bodyParser from 'body-parser'

export const createApp = async (): Promise<express.Express> => {
  const app = addAsync(express())

  const baseRouter = Router()
  app.set('trust proxy', true)
  app.use(express.json({ limit: '1mb' }))
  app.use(bodyParser.urlencoded({ extended: false }))

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

  app.postAsync('/notify/claim', async (req, resp) => {
    const emailId: string = req.body.emailId ? req.body.emailId.toString() : ''
    const phone: string = req.body.phone ? req.body.phone.toString() : ''
    const claimId: string = req.body.claimId ? req.body.claimId.toString() : ''
    const safeId: string = req.body.safeId ? req.body.safeId.toString() : ''
    const res = await sendClaimNofitication(emailId, phone, safeId, claimId)
    resp.json({ status: res })
  })

  app.postAsync('/notify/create', async (req, resp) => {
    const emailId: string = req.body.emailId ? req.body.emailId.toString() : ''
    const phone: string = req.body.phone ? req.body.phone.toString() : ''
    const safeId: string = req.body.safeId ? req.body.safeId.toString() : ''
    const res = await sendCreateSafeNofitication(emailId, phone, safeId, '')
    resp.json({ status: res })
  })

  app.postAsync('/notify/recovery', async (req, resp) => {
    const emailId: string = req.body.emailId ? req.body.emailId.toString() : ''
    const phone: string = req.body.phone ? req.body.phone.toString() : ''
    const safeId: string = req.body.safeId ? req.body.safeId.toString() : ''
    const res = await sendRecoveryNotification(emailId, phone, safeId, '')
    resp.json({ status: res })
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
