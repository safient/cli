import { Command } from 'commander'

import { SafienWorker } from './lib/worker'
import { Safient } from './lib/safient'

const program = new Command()
const worker = new SafienWorker()

const safien = program.command('safien')
safien.description('Safien related tasks')

safien
  .command('worker')
  .requiredOption('--name <string>', 'Name of the Safien')
  .requiredOption('--email <email>', 'Email of the Safien')
  .option('--config <path>', 'Path to the Safien Worker config file')
  .option('--ipfs-api <url>', 'The ipfs http api to use')
  .option(
    '--ethereum-rpc <url>',
    'The Ethereum RPC URL used for communicating with Ethereum blockchain. Deprecated.',
  )
  .option('--port <int>', 'Gateway port. Default is 7000')
  .option('--hostname <string>', 'Workker host. Default is 0.0.0.0')
  .option('--debug', 'Enable debug logging level. Default is false')
  .option('--verbose', 'Enable verbose logging level. Default is false')
  .option(
    '--network <name>',
    'Name of the Safient network. One of: "mainnet", "testnet", "local", Default is local"',
  )
  .description('Start the Safien worker')
  .action(
    async ({
      name,
      email,
      config,
      ipfsApi,
      ethereumRpc,
      port,
      hostname,
      debug,
      verbose,
      network,
    }) => {
      worker.create({
        name,
        email,
        config,
        ipfsApi,
        ethereumRpc,
        port,
        hostname,
        debug,
        verbose,
        network,
      })
    },
  )

const user = program.command('user')
user.description('Safient users')

user
  .command('create')
  .description('Create an user')
  .requiredOption('--name <string>', 'Name of the Safien')
  .requiredOption('--email <email>', 'Email of the Safien')
  .option(
    '--network <string>',
    'Name of the Safient network. One of: "mainnet", "testnet", "local", Default is local"',
  )
  .action(async ({ name, email, network }) => {
    const safient = new Safient(network)
    await safient.createUser(name, email)
  })

const safe = program.command('safe')
safe.description('Safient safes')

safe
  .command('create')
  .description('Create a safe')
  .requiredOption('--beneficiary <string>', 'DID/ Email of the Beneficiary')
  .requiredOption('--data <string>', 'Safe data')
  .option(
    '--network <name>',
    'Name of the Safient network. One of: "mainnet", "testnet", "local", Default is local"',
  )
  .option(
    '--onchain',
    'If the safe creation should happen onchain"',
  )
  .action(async ({ data, beneficiary, network, onchain }) => {
    const safient = new Safient(network)
    await safient.connectUser()
    await safient.createSafe(beneficiary, data, onchain) 
  })

safe
  .command('update <safeId>')
  .description('Update the safe')
  .action(async safeId => {
    // await callsomething()
  })

safe
  .command('delete <safeId>')
  .description('Delete the safe')
  .action(async safeId => {
    // await callsomething()
  })

safe
  .command('show <safeId>')
  .description('Show the safe info')
  .option(
    '--network <string>',
    'Name of the Safient network. One of: "mainnet", "testnet", "local", Default is local"',
  )
  .action(async (safeId, { network }) => {
    const safient = new Safient(network)
    await safient.connectUser()
    await safient.showSafe(safeId)
  })

program.parse(process.argv)
