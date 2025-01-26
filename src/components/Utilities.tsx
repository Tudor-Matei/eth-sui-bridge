import { useCurrentAccount } from "@mysten/dapp-kit";
import { deploySolidityContract } from "../helpers/deployContract";
import { mintEthereumIBT, mintSuiIBT } from "../helpers/mint";
import { sendEth } from "../helpers/sendEth";

export default function Utilities() {
  const account = useCurrentAccount();

  return (
    <aside className="utilities">
      <h1>Utilities</h1>
      <hr />
      <h3>Ethereum</h3>
      <button onClick={sendEth}>Send Ethereum to wallet</button>
      <button onClick={() => mintEthereumIBT("1000")}>Mint 1000 IBT coins</button>
      <button onClick={deploySolidityContract}>Deploy Solidity contract</button>
      <hr />
      <h3>Sui</h3>
      <button onClick={() => mintSuiIBT("1000", account!.address)}>Mint 1000 IBT coins</button>
    </aside>
  );
}
