import { ethers, parseUnits } from "ethers";
import TokenArtifact from "../../out/Token.s.sol/Token.json";

export async function mintEthereumIBT() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contractAddress = import.meta.env.VITE_ETH_IBT_CONTRACT;
  const contractABI = TokenArtifact.abi;

  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  await contract.mint(parseUnits("1000", 18));

  contract.on("MintEvent", (to, amount) => {
    alert(`Minted to ${to} amount ${amount}`);
  });
}

export async function mintSuiIBT(walletAddress: string) {
  const packageId = import.meta.env.VITE_SUI_IBT_CONTRACT;
  const treasuryCapId = import.meta.env.VITE_SUI_IBT_TREASURY_CAP;

  try {
    const response = await fetch("http://localhost:5000/mint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        packageId,
        amount: 1000,
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
    return true;
  } catch (error) {
    console.error("Error minting tokens:", error);
    alert("Error minting tokens");
    return null;
  }
}
