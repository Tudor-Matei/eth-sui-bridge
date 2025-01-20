import { ethers } from "ethers";

export default async function deployContract(artifactAbi: ethers.InterfaceAbi, artifactBytecode: ethers.BytesLike) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const MyContractFactory = new ethers.ContractFactory(artifactAbi, artifactBytecode, signer);

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
