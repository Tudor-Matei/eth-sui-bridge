import { ethers, parseEther, parseUnits } from "ethers";

export async function sendEth() {
  const provider = new ethers.BrowserProvider(window.ethereum);

  const senderPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const senderWallet = new ethers.Wallet(senderPrivateKey, provider);

  const recipientAddress = "0xA6861E1667045793BFB0a7251bD01DCaa5E57b97";

  const tx = {
    to: recipientAddress,
    value: parseEther("1000"),
    gasPrice: parseUnits("20", "gwei"),
  };

  const transactionResponse = await senderWallet.sendTransaction(tx);

  await transactionResponse.wait();

  alert(`Transaction successful with hash: ${transactionResponse.hash}`);
}
