import { ConnectButton, useAccounts, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { Transaction } from "@mysten/sui/transactions";
import { ethers } from "ethers";
import { useState } from "react";
import CounterArtifactSui from "../script/Counter/Counter.json";
import { deploySolidityContract } from "./helpers/deployContract";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any;
  }
}
const App = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [ethereumBalance, setEthereumBalance] = useState<bigint | null>(null);
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [chainId, setChainId] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    if (account) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const walletAddress = await signer.getAddress();
      const balance = await provider.getBalance(walletAddress);

      setEthereumBalance(balance);
      setChainId(network.chainId);
      setMetamaskConnected(true);
      setAccount(walletAddress);
    } catch (err) {
      setError((err as Error).toString());
    }
  };

  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const accounts = useAccounts();

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

  const deploySuiContract = async () => {
    const tx = new Transaction();

    const cap = tx.publish({
      modules: CounterArtifactSui.modules,
      dependencies: CounterArtifactSui.dependencies,
    });

    tx.setGasBudget(100000000);
    tx.transferObjects([cap], tx.pure.address(accounts[0].address));

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const response = await suiClient.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
              showObjectChanges: true,
            },
          });

          console.log(response);
        },
      }
    );
  };

  return (
    <div className="App">
      <ConnectButton connectText="Connect with Sui" />
      <button style={{ padding: 10, margin: 10 }} onClick={connect}>
        Connect with MetaMask
      </button>
      <button onClick={deploySolidityContract}>Deploy Solidity contract</button>
      <button onClick={deploySuiContract}>Deploy Sui contract</button>
      <button onClick={create}>Call Sui contract</button>
      {error && <h3 style={{ color: "red" }}>{error}</h3>}
      {metamaskConnected && (
        <div>
          <h1>{account && `MetaMask account address: ${account}`}</h1>
          <h6>Ethereum balance: {ethereumBalance?.toString() || "Unknown"}</h6>
          <p>{chainId?.toString() && `Ethereum testnet chain ID: ${chainId.toString()}`}</p>
        </div>
      )}
    </div>
  );
};

export default App;
