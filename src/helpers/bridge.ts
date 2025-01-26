import { burnEthereumIBT, burnSuiIBT } from "./burn";
import { mintEthereumIBT, mintSuiIBT } from "./mint";

export async function convertFromEthereumToSuiTokens(amount: string, suiWalletAddress: string) {
  burnEthereumIBT(amount, () => {
    alert("IBT coins from Ethereum successfully burned.");
    mintSuiIBT(amount, suiWalletAddress).then(alert).catch(alert);
  }).catch(alert);
}

export async function convertfromSuiTokensToEthereum(amount: string, coinObjectId: string) {
  burnSuiIBT(coinObjectId)
    .then((message) => {
      alert(message);
      mintEthereumIBT(amount).then(alert).catch(alert);
    })
    .catch(alert);
}
