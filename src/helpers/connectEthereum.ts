import { ethers, formatUnits } from "ethers";
import { useEffect, useState } from "react";
import TokenArtifact from "../../out/Token.s.sol/Token.json"; // Adjust the path to your ABI file

export default function useConnectEthereum() {
  const [account, setAccount] = useState<string | null>(null);
  const [ibtBalance, setIbtBalance] = useState<string | null>(null);
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldConnect, triggerConnect] = useState<boolean | null>(null);

  const connect = () => {
    triggerConnect(!shouldConnect);
  };

  useEffect(() => {
    if (shouldConnect === null) return;

    async function connect() {
      const contractAddress = import.meta.env.VITE_ETH_IBT_CONTRACT;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, TokenArtifact.abi, signer);

        const walletAddress = await signer.getAddress();
        const balance = await contract.balanceOf(walletAddress);
        setIbtBalance(formatUnits(balance, 18));
        setMetamaskConnected(true);
        setAccount(walletAddress);
      } catch (error) {
        setError((error as Error).toString());
      }
    }

    connect();
  }, [shouldConnect]);

  return { ibtBalance, account, metamaskConnected, error, connect };
}
