# IBT - final project

## Setup

1. Install foundry (only using anvil and forge)
2. Run `anvil` in terminal - this is the Ethereum-based local testnet.
3. Compile the Solidity contract with the following command: `forge build`
4. Create a MetaMask account and add their browser extension.
5. Create a new MetaMask project, and put the API key in the .env file.
6. Link MetaMask with the local testnet, by creating a custom network.
7. Within the MetaMask extension, fill out the needed fields. The RPC url is whatever Anvil is listening on, and the chain ID should by default be `31337`.
8. MetaMask might suggest to use a token symbol and network name due to security
   concerns: follow the suggestion.
9. Write `sui start --with-faucet` to start the Sui local blockchain
10. Install the Sui Wallet extension (only available in Chrome)
11. Make it use the localnet
12. To build a Sui contract you run `sui move build --dump-bytecode-as-base64 > Token.json --skip-fetch-latest-git-deps` while navigating inside script/sui/Token
13. To deploy the Sui contract on the blockchain you run `sui client publish .`. Make sure you are in the same directory as the auto-generated `Move.toml` file.
14. Run `npm install` then `npm run dev`.

## Possible errors

In the case you get a weird error related to the signing of transactions with Sui when publishing a contract, follow these steps:

- Delete Move.lock from the existing sui package
- Run `sui genesis --force`
- Run `sui start --with-faucet`
- Run `sui client faucet`
