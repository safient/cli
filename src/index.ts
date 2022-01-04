import { Command } from 'commander'
import inquirer from 'inquirer'

import { Network } from './types'
import { Gateway } from './utils/safient/gateway'
import { Worker } from './utils/safient/worker'
import { Safient } from './utils/safient'

export async function cli(): Promise<void> {
  const program = new Command()

  const safien = program.command('safien')
  safien.description('Safien related tasks')

  safien
    .command('worker')
    .option('--name <string>', 'Name of the Safien')
    .option('--email <email>', 'Email of the Safien')
    .option('--config <path>', 'Path to the Safien Worker config file')
    .option('--ipfs-api <url>', 'The ipfs http api to use')
    .option('--port <int>', 'Gateway port. Default is 7000')
    .option('--hostname <string>', 'Workker host. Default is 0.0.0.0')
    .option('--debug', 'Enable debug logging level. Default is false')
    .option('--verbose', 'Enable verbose logging level. Default is false')
    .option(
      '--network <name>',
      'Name of the Safient network. One of: "mainnet", "testnet", "local", Default is testnet"',
    )
    .description('Start the Safient HTTP gateway')
    .action(
      async ({
        name,
        email,
        config,
        ipfsApi,
        port,
        hostname,
        debug,
        verbose,
        network,
      }) => {
        const questions = [
          {
            type: 'email',
            name: 'email',
            message: 'Enter the email of Safient worker',
          },
          {
            type: 'name',
            name: 'name',
            message: 'Enter a name for Safient worker',
          },
        ]

        const safient = new Safient(parseInt(Network[network]))
        const registed = await safient.connect()

        if (!registed && (!email || !name)) {
          const answers = await inquirer.prompt(questions)
          email = answers.email
          name = answers.name
        }

        const worker = new Worker(parseInt(Network[network]))
        worker.create({
          registed,
          name,
          email,
          config,
          ipfsApi,
          port,
          hostname,
          debug,
          verbose,
        })
      },
    )

  safien
    .command('gateway')
    .option('--name <string>', 'Name of the Safien')
    .option('--email <email>', 'Email of the Safien')
    .option('--config <path>', 'Path to the Safien Worker config file')
    .option('--ipfs-api <url>', 'The ipfs http api to use')
    .option('--port <int>', 'Gateway port. Default is 7000')
    .option('--hostname <string>', 'Workker host. Default is 0.0.0.0')
    .option('--debug', 'Enable debug logging level. Default is false')
    .option('--verbose', 'Enable verbose logging level. Default is false')
    .option(
      '--network <name>',
      'Name of the Safient network. One of: "mainnet", "testnet", "local", Default is local"',
    )
    .description('Start the Safient HTTP gateway')
    .action(
      async ({
        name,
        email,
        config,
        ipfsApi,
        port,
        hostname,
        debug,
        verbose,
        network,
      }) => {
        const questions = [
          {
            type: 'email',
            name: 'email',
            message: 'Enter the email of Safient worker',
          },
          {
            type: 'name',
            name: 'name',
            message: 'Enter a name for Safient worker',
          },
        ]

        const safient = new Safient(parseInt(Network[network]))
        const registed = await safient.connect()

        if (!registed && (!email || !name)) {
          const answers = await inquirer.prompt(questions)
          email = answers.email
          name = answers.name
        }

        const gateway = new Gateway(parseInt(Network[network]))
        gateway.create({
          registed,
          name,
          email,
          config,
          ipfsApi,
          port,
          hostname,
          debug,
          verbose,
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
      const safient = new Safient(parseInt(Network[network]))
      await safient.connect()
      await safient.createUser(name, email)
    })

  user
    .command('info')
    .description('Display user info')
    .option(
      '--network <string>',
      'Name of the Safient network. One of: "mainnet", "testnet", "local", Default is local"',
    )
    .action(async ({ network }) => {
      const safient = new Safient(parseInt(Network[network]))
      await safient.connect()
      await safient.myInfo()
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
    .option('--onchain', 'If the safe creation should happen onchain"')
    .action(async ({ data, beneficiary, network, onchain }) => {
      const safient = new Safient(parseInt(Network[network]))
      await safient.connect()
      await safient.createSafe(beneficiary, data, onchain)
    })

  safe
    .command('update <safeId>')
    .description('Update the safe')
    .action(async safeId => {
      return safeId
    })

  safe
    .command('delete <safeId>')
    .description('Delete the safe')
    .action(async safeId => {
      return safeId
    })

  safe
    .command('show <safeId>')
    .description('Show the safe info')
    .option(
      '--network <string>',
      'Name of the Safient network. One of: "mainnet", "testnet", "local", Default is local"',
    )
    .action(async (safeId, { network }) => {
      const safient = new Safient(parseInt(Network[network]))
      await safient.connect()
      await safient.showSafe(safeId)
    })

  program.parse(process.argv)
}
