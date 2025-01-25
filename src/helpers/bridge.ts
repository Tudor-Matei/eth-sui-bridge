import { burnEthereumIBT } from "./burn";
import { mintSuiIBT } from "./mint";

export async function convertFromEthereumToSuiTokens(suiWalletAddress: string) {
  burnEthereumIBT(() => {
    alert("Burned Ethereum IBT tokens successfully");
    mintSuiIBT(suiWalletAddress).then((result: boolean | null) => {
      if (!result) return;

      alert("Minted Sui IBT tokens successfully");
    });
  });
}
