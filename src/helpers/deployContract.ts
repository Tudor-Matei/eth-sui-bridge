import { ethers } from "ethers";
import TokenArtifact from "../../out/Token.s.sol/Token.json";

export async function deploySolidityContract(): Promise<string> {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const MyContractFactory = new ethers.ContractFactory(TokenArtifact.abi, TokenArtifact.bytecode, signer);

    console.log(new Date().toISOString(), "Deploying contract...");
    const contract = await MyContractFactory.deploy();
    await contract.waitForDeployment();
    console.log(new Date().toISOString(), "Contract deployed.");
    alert("Contract deployed.");

    return contract.getAddress() as Promise<string>;
  } catch (error) {
    return (error as Error).message;
  }
}
