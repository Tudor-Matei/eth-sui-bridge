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
9. Run `npm install` then `npm run dev`.
