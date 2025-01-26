import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import { convertFromEthereumToSuiTokens, convertfromSuiTokensToEthereum } from "../helpers/bridge";
import useConnectEthereum from "../hooks/useConnectEthereum";
import { useGetSuiBalance } from "../hooks/useGetSuiBalance";

export default function Transfer() {
  const {
    account,
    ibtBalance: ibtEthereumBalance,
    metamaskConnected,
    error: ethereumError,
    triggerConnect,
  } = useConnectEthereum();

  const { ibtBalance: ibtSuiBalance, getNewBalance, error: suiError } = useGetSuiBalance();

  const suiAccount = useCurrentAccount();

  const [ethereumAmount, setEthereumAmount] = useState<number>(0);
  const [suiAmount, setSuiAmount] = useState<number>(0);

  return (
    <section className="transfer">
      <div className="metamask-side">
        <img src="src/assets/metamask.png" width="300" height="150" />
        {!metamaskConnected && (
          <button className="connect-button" onClick={triggerConnect}>
            Connect with MetaMask
          </button>
        )}
        {metamaskConnected && account && (
          <div className="metamask-details">
            {ibtEthereumBalance && (
              <p>
                <strong>Balance: {ibtEthereumBalance} IBT</strong>
              </p>
            )}

            <label htmlFor="amount">Type in the amount to convert to Sui IBT tokens</label>
            <br />
            <input
              value={ethereumAmount}
              onChange={(event) => setEthereumAmount(Number(event.target.value) || 0)}
              id="amount"
              type="text"
              placeholder="Amount"
            />
            <br />
            <button
              onClick={() => {
                if (!suiAccount?.address) {
                  alert("Please connect with your Sui wallet first.");
                  return;
                }

                if (Number(ibtEthereumBalance) < Number(ethereumAmount)) {
                  alert("Insufficient funds.");
                  return;
                }

                convertFromEthereumToSuiTokens(ethereumAmount.toString(), suiAccount!.address);
              }}
            >
              Transfer {ethereumAmount || 0} IBT
            </button>
          </div>
        )}
      </div>

      <div className="sui-side">
        <div
          className="sui-button-area"
          style={{
            flexDirection: ibtSuiBalance === null ? "row" : "column",
            gap: ibtSuiBalance === null ? "4rem" : "2rem",
          }}
        >
          <img src="src/assets/sui.png" width="100" height="50" />
          <ConnectButton className="connect-button" onClick={getNewBalance} connectText="Connect with Sui" />
        </div>
        {ibtSuiBalance !== null && (
          <div className="sui-details">
            {ibtSuiBalance && (
              <p>
                <strong>Balance: {ibtSuiBalance} IBT</strong>
              </p>
            )}

            <label htmlFor="amount">Type in the amount to convert to Ethereum IBT tokens</label>
            <br />
            <input
              value={suiAmount}
              onChange={(event) => setSuiAmount(Number(event.target.value) || 0)}
              id="amount"
              type="text"
              placeholder="Amount"
            />
            <br />
            <button disabled onClick={() => convertfromSuiTokensToEthereum(suiAmount.toString(), "")}>
              Transfer {suiAmount || 0} IBT
            </button>
          </div>
        )}
      </div>

      <div className="error-panel">
        {ethereumError && <h3>{ethereumError}</h3>}
        {suiError && <h3>{suiError}</h3>}
      </div>
      {/* {ibtSuiBalance && <h3>Sui IBT balance: {ibtSuiBalance}</h3>} */}
      {/* {metamaskConnected && (
        <div>
          <h1>{account && `MetaMask account address: ${account}`}</h1>
          <h2>IBT balance: {ibtEthereumBalance?.toString() || "Unknown"}</h2>
        </div>
      )} */}
    </section>
  );
}
