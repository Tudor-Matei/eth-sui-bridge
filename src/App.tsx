import { ethers } from "ethers";
import { useState } from "react";

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

  return (
    <div className="App">
      <button style={{ padding: 10, margin: 10 }} onClick={connect}>
        Connect with MetaMask
      </button>
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
