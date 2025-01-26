import { ethers, parseUnits } from "ethers";
import TokenArtifact from "../../out/Token.s.sol/Token.json";

export async function burnEthereumIBT(amount: string, callback: (from: string, amount: string) => void) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contractAddress = import.meta.env.VITE_ETH_IBT_CONTRACT;
    const contractABI = TokenArtifact.abi;

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const tx = await contract.burn(parseUnits(amount, 18));
    console.log(tx);

    contract.on("BurnEvent", (from, amount) => {
      callback(from, amount);
    });
  } catch (error) {
    console.error(error);
    throw new Error("There's been an error burning Ethereum IBT coins.");
  }
}

export async function burnSuiIBT(coinObjectId: string) {
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
        coinObjectId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const serverResponse: { error?: string; message?: string } = await response.json();
    if (!serverResponse?.message) {
      console.error(serverResponse.error || serverResponse);
      throw new Error("There's been an error burning Sui IBT tokens.");
    }

    return serverResponse.message;
  } catch (error) {
    console.error("Error burning Sui tokens:", error);
    throw new Error("There's been an error burning Sui IBT tokens.");
  }
}
