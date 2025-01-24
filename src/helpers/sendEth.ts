import { ethers, parseEther, parseUnits } from "ethers";

export async function sendEth() {
  // Connect to the local Anvil network
  const provider = new ethers.BrowserProvider(window.ethereum);

  // Replace with the private key of the sender account from Anvil
  const senderPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const senderWallet = new ethers.Wallet(senderPrivateKey, provider);

  // Replace with the recipient address
  const recipientAddress = "0xA6861E1667045793BFB0a7251bD01DCaa5E57b97";

  // Define the transaction
  const tx = {
    to: recipientAddress,
    value: parseEther("1000"),
    gasPrice: parseUnits("20", "gwei"),
  };

  // Send the transaction
  const transactionResponse = await senderWallet.sendTransaction(tx);

  // Wait for the transaction to be mined
  await transactionResponse.wait();

  console.log(`Transaction successful with hash: ${transactionResponse.hash}`);
}
