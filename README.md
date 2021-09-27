# Safient CLI
CLI tool to run a Safien worker and interact with the safes on Safient protocol.


## Getting Started

```bash
    npm i @safient/cli -g
```

### Running the Safien worker on a testnet

```
  safient safien worker --name Safient --email hello@safient.io --network testnet

```

### Interacting with the Safient protocol

Create a safe:

```
  ssafient safe create --beneficiary did:key:z6MknvaZuK44SWdsK8m6t3mq7AWQ2Hj1zGhVTPywcPGS7qFf --data 'Test safe' --network testnet

```

Show a safe:

```
  safient safe show 01fgbz287dvds1ft1e4tdbjqkp --network testnet

```

## Building locally

Create an `.env` with `INFURA_API_KEY`, `USER_API_KEY`, `USER_API_SECRET` and `DB_FILE_NAME='./thread.config'`

```bash
  npm install
  npm run build
```

## Technologies used:
* [Ceramic IDX](https://idx.xyz/)
* [Textile ThreadDb](https://docs.textile.io/threads/)


## Contributing

You are welcome to submit issues and enhancement requests and work on any of the existing issues. Follow this simple guide to contribute to the repository.

 1. **Create** or pick an existing issue to work on
 2. **Fork** the repo on GitHub
 3. **Clone** the forked project to your own machine
 4. **Commit** changes to your own branch
 5. **Push** your work back up to your forked repo
 6. Submit a **Pull request** from the forked repo to our repo so that we can review your changes


 ## Resources:

* [Website](https://safient.io)
* [Web App](https://app.safient.io)
* [Twitter](https://twitter.con/safientio)
* [Discord](https://discord.safient.io)