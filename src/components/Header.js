import React, { useContext, useEffect } from "react";
import xmtpLogo from "../assets/xmtp-logo.png";
import { WalletContext } from "../contexts/WalletContext";
import { XmtpContext } from "../contexts/XmtpContext";
import { shortAddress } from "../utils/utils";

const Header = () => {
  const { connectWallet, walletAddress, signer } = useContext(WalletContext);
  const [providerState] = useContext(XmtpContext);

  useEffect(() => {
    const hasKeys = !!localStorage.getItem("keys");
    if (hasKeys) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    const hasKeys = !!localStorage.getItem("keys");

    if (hasKeys && signer) {
      providerState.initClient(signer);
    }
  }, [signer, providerState.initClient]);

  return (
    <div className="header flex align-center justify-between">
      <img className="logo" alt="XMTP Logo" src={xmtpLogo} />
      {walletAddress ? (
        <div className="flex align-center header-mobile">
          <h3>{shortAddress(walletAddress)}</h3>
          {!providerState.client && (
            <button
              className="btn"
              onClick={() => providerState.initClient(signer)}
            >
              Connect to XMTP
            </button>
          )}
        </div>
      ) : (
        <button className="btn" onClick={connectWallet}>
          {!window.ethereum || !window.ethereum.isMetaMask
            ? "Install MetaMask"
            : "Connect wallet"}
        </button>
      )}
    </div>
  );
};

export default Header;
