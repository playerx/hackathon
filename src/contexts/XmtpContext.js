import { Client } from "@xmtp/xmtp-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { WalletContext } from "./WalletContext";

export const XmtpContext = createContext();

export const XmtpContextProvider = ({ children }) => {
  const { signer, walletAddress } = useContext(WalletContext);
  const [providerState, setProviderState] = useState({
    client: null,
    initClient: () => {},
    loadingConversations: true,
    conversations: new Map(),
    convoMessages: new Map(),
  });

  const initClient = async (wallet) => {
    if (wallet && !providerState.client) {
      try {
        const cachedKeys = localStorage.getItem("keys");

        const keys = cachedKeys
          ? new Uint8Array(Buffer.from(cachedKeys.split(",").map((x) => +x)))
          : await Client.getKeys(signer, { env: "dev" });

        if (!cachedKeys) {
          localStorage.setItem("keys", keys.toString());
        }

        const client = await Client.create(null, {
          env: "dev",
          privateKeyOverride: keys,
        });
        setProviderState({
          ...providerState,
          client,
        });
      } catch (e) {
        console.error(e);
        setProviderState({
          ...providerState,
          client: null,
        });
      }
    }
  };

  const disconnect = () => {
    setProviderState({
      ...providerState,
      client: null,
      conversations: new Map(),
      convoMessages: new Map(),
    });
  };

  useEffect(() => {
    signer ? setProviderState({ ...providerState, initClient }) : disconnect();
    // eslint-disable-next-line
  }, [signer]);

  useEffect(() => {
    if (!providerState.client) return;

    const listConversations = async () => {
      console.log("Listing conversations");
      setProviderState({ ...providerState, loadingConversations: true });
      const { client, convoMessages, conversations } = providerState;
      const convos = (await client.conversations.list()).filter(
        (conversation) => !conversation.context?.conversationId
      );
      Promise.all(
        convos.map(async (convo) => {
          if (convo.peerAddress !== walletAddress) {
            const messages = await convo.messages();
            convoMessages.set(convo.peerAddress, messages);
            conversations.set(convo.peerAddress, convo);
            setProviderState({
              ...providerState,
              convoMessages,
              conversations,
            });
          }
        })
      ).then(() => {
        setProviderState({ ...providerState, loadingConversations: false });
      });
    };

    listConversations();
    // eslint-disable-next-line
  }, [providerState.client]);

  return (
    <XmtpContext.Provider value={[providerState, setProviderState]}>
      {children}
    </XmtpContext.Provider>
  );
};
