import { ethers, parseUnits } from "ethers";
import TokenArtifact from "../../out/Token.s.sol/Token.json";

export async function burnEthereumIBT(callback: () => void) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contractAddress = import.meta.env.VITE_ETH_IBT_CONTRACT;
  const contractABI = TokenArtifact.abi;

  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  const tx = await contract.burn(parseUnits("1000", 18));
  console.log(tx);

  contract.on("BurnEvent", (from, amount) => {
    callback();
  });
}

export async function burnSuiIBT(walletAddress: string) {
  const packageId = import.meta.env.VITE_SUI_IBT_CONTRACT;
  const treasuryCapId = import.meta.env.VITE_SUI_IBT_TREASURY_CAP;

  try {
    const response = await fetch("http://localhost:5000/burn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        packageId,
        treasuryCapId,
        walletAddress,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const coinObject = await response.json();
    if (!coinObject?.coinObjectID) {
      alert("Error minting tokens. Invalid coin object id.");
      return null;
    }

    localStorage.setItem(
      "coinIDS",
      JSON.stringify([...JSON.parse(localStorage.getItem("coinIDS") || "[]"), coinObject.coinObjectID])
    );

    alert("Minted tokens successfully");
  } catch (error) {
    console.error("Error minting tokens:", error);
    alert("Error minting tokens");
    return null;
  }
}
