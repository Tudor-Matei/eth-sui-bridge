import { ethers } from "ethers";
import { useState } from "react";
import CounterArtifact from "../out/Counter.sol/Counter.json";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any;
  }
}
const App = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [counterValue, setCounterValue] = useState<number | null>(null);

  const connect = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // const MyContractFactory = new ethers.ContractFactory(CounterArtifact.abi, CounterArtifact.bytecode, signer);
      // alert("Deploying contract. Please wait...");

      // const network = await provider.getNetwork();
      // setChainId(Number(network.chainId));
      // console.log(network.chainId);

      // const myContract = await MyContractFactory.deploy();
      // await myContract.waitForDeployment();
      // const myContractDeployedAddress = await myContract.getAddress();
      // alert(`Contract deployed at address: ${myContractDeployedAddress}`);

      setConnected(true);

      // test contract address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
      const counterContract = new ethers.Contract(
        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        CounterArtifact.abi,
        signer
      );

      const value = await counterContract.number();
      await counterContract.increment();
      setCounterValue(value);
    } catch (err) {
      console.warn("Failed to connect:", err);
    }
  };

  const incrementCounter = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const counterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const counterContract = new ethers.Contract(counterAddress, CounterArtifact.abi, signer);

    const tx = await counterContract.increment();
    await tx.wait();

    const value = await counterContract.number();
    setCounterValue(value);
  };

  return (
    <div className="App">
      <button style={{ padding: 10, margin: 10 }} onClick={connect}>
        Connect
      </button>
      <button style={{ padding: 10, margin: 10 }} onClick={incrementCounter}>
        Increment counter
      </button>
      {connected && (
        <div>
          <>
            {chainId && `Connected chain: ${chainId}`}
            <p></p>
            {account && `Connected account: ${account}`}
            <p></p>
            {counterValue !== null && `Counter value: ${counterValue}`}
          </>
        </div>
      )}
    </div>
  );
};

export default App;
