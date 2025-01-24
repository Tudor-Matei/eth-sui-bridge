import { ConnectButton, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { Transaction } from "@mysten/sui/transactions";
import { burnEthereumIBT } from "./helpers/burn";
import useConnectEthereum from "./helpers/connectEthereum";
import { mintEthereumIBT } from "./helpers/mint";
import { sendEth } from "./helpers/sendEth";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any;
  }
}
const App = () => {
  const { account, ibtBalance, metamaskConnected, error, connect } = useConnectEthereum();

  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  // const accounts = useAccounts();

  const create = async () => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [],
      target: `${import.meta.env.VITE_DEPLOYED_SUI_CONTRACT}::counter::create`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await suiClient.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });

          console.log(effects);
        },
      }
    );
  };

  // const handleDeploySolidityContract = () => {
  //   deploySolidityContract().then((contractAddress) => {
  //     const previousContracts: string | null = localStorage.getItem("ETH_CONTRACTS");
  //     localStorage.setItem(
  //       "ETH_CONTRACTS",
  //       JSON.stringify(!previousContracts ? [contractAddress] : [...JSON.parse(previousContracts), contractAddress])
  //     );
  //   });
  // };

  return (
    <div className="App">
      <h3>Previous solidity contract addresses:</h3>
      <ul>
        {localStorage.getItem("ETH_CONTRACTS") &&
          JSON.parse(localStorage.getItem("ETH_CONTRACTS") as string).map((contract: string, index: number) => (
            <li key={index}>{contract}</li>
          ))}
      </ul>
      <div>
        <button style={{ padding: 10, margin: 10 }} onClick={connect}>
          Connect with MetaMask
        </button>
        <button onClick={sendEth}>Send ibt</button>
        {/* <button onClick={handleDeploySolidityContract}>Deploy Solidity contract</button> */}
        <button onClick={mintEthereumIBT}>Mint IBT tokens on Ethereum</button>
        <button onClick={burnEthereumIBT}>Burn IBT tokens on Ethereum</button>
      </div>

      <div>
        <ConnectButton connectText="Connect with Sui" />
        <button onClick={mintEthereumIBT}>Mint IBT tokens on Sui</button>
        <button onClick={burnEthereumIBT}>Burn IBT tokens on Sui</button>
      </div>

      {/* <button onClick={create}>Call Sui contract</button> */}
      {error && <h3 style={{ color: "red" }}>{error}</h3>}
      {metamaskConnected && (
        <div>
          <h1>{account && `MetaMask account address: ${account}`}</h1>
          <h2>IBT balance: {ibtBalance?.toString() || "Unknown"}</h2>
        </div>
      )}
    </div>
  );
};

export default App;
