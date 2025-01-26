import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit"; // Adjust the import based on your actual hook
import { useEffect, useState } from "react";

export const useGetSuiBalance = () => {
  const [ibtBalance, setIbtBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const suiClient = useSuiClient();
  const suiAccount = useCurrentAccount();

  const getNewBalance = () => {
    setIbtBalance("0");
  };

  useEffect(() => {
    const getIBTBalanceOnSui = async () => {
      if (!suiAccount) return;

      try {
        const suiIBTContractAddress = import.meta.env.VITE_SUI_IBT_CONTRACT;
        const coins = await suiClient.getCoins({
          owner: suiAccount.address,
          coinType: `${suiIBTContractAddress}::ibt::IBT`,
        });
        console.log(coins);

        const tokenBalance = await suiClient.getBalance({
          owner: suiAccount.address,
          coinType: `${suiIBTContractAddress}::ibt::IBT`,
        });

        setIbtBalance(tokenBalance.totalBalance);
      } catch (error) {
        setError((error as Error).toString());
      }
    };

    getIBTBalanceOnSui();
  }, [ibtBalance, suiAccount, suiClient]);

  return { ibtBalance, getNewBalance, error };
};
