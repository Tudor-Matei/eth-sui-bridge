import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { convertFromEthereumToSuiTokens } from "./helpers/bridge";
import useConnectEthereum from "./helpers/connectEthereum";
import { deploySolidityContract } from "./helpers/deployContract";
import { mintEthereumIBT, mintSuiIBT } from "./helpers/mint";
import { sendEth } from "./helpers/sendEth";
import "./index.css";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any;
  }
}
const App = () => {
  const { account, ibtBalance, metamaskConnected, error, connect } = useConnectEthereum();

  const handleDeploySolidityContract = () => {
    deploySolidityContract().then((contractAddress) => {
      const previousContracts: string | null = localStorage.getItem("ETH_CONTRACTS");
      localStorage.setItem(
        "ETH_CONTRACTS",
        JSON.stringify(!previousContracts ? [contractAddress] : [...JSON.parse(previousContracts), contractAddress])
      );
    });
  };

  const suiAccount = useCurrentAccount();
  return (
    <div className="App">
      <div>
        <button style={{ padding: 10, margin: 10 }} onClick={connect}>
          Connect with MetaMask
        </button>

        <div>
          <button disabled onClick={handleDeploySolidityContract}>
            Deploy Solidity contract
          </button>
          <button disabled onClick={mintEthereumIBT}>
            Mint IBT
          </button>

          <button disabled onClick={sendEth}>
            Send ibt
          </button>
        </div>

        <button onClick={() => convertFromEthereumToSuiTokens(suiAccount!.address)}>
          Convert to IBT tokens on SUI
        </button>
      </div>

      <div>
        <ConnectButton connectText="Connect with Sui" />
        <button onClick={() => mintSuiIBT(suiAccount!.address)}>Mint IBT tokens on Sui</button>
        <button disabled>Burn IBT tokens on Sui</button>
      </div>

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
