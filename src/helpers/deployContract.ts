import { ethers } from "ethers";
import CounterArtifact from "../../out/Counter.sol/Counter.json";

export async function deploySolidityContract() {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const MyContractFactory = new ethers.ContractFactory(CounterArtifact.abi, CounterArtifact.bytecode, signer);

    const network = await provider.getNetwork();
    console.log(network.chainId);

    console.log(new Date().toISOString(), "Deploying contract...");
    const contract = await MyContractFactory.deploy();
    await contract.waitForDeployment();
    console.log(new Date().toISOString(), "Contract deployed.");

    return contract.getAddress();
  } catch (error) {
    return error;
  }
}
