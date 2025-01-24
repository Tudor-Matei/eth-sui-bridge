import { ethers, parseUnits } from "ethers";
import TokenArtifact from "../../out/Token.s.sol/Token.json"; // Adjust the path to your ABI file

export async function burnEthereumIBT() {
  // Connect to the local Anvil network
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Contract address and ABI
  const contractAddress = import.meta.env.VITE_ETH_IBT_CONTRACT;
  const contractABI = TokenArtifact.abi;

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  const tx = await contract.burn(parseUnits("1000", 18));
  console.log(tx);

  contract.on("BurnEvent", (from, amount) => {
    alert(`Burned from ${from} amount ${amount}`);
  });
}
