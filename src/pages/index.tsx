import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useEffect, useState } from "react";
import { msg } from "../constants";
import { signWithWallet } from "../utils";

declare global {
  interface Window extends KeplrWindow {}
}

const Home = () => {
  let res: any;

  const [addy, setAddy] = useState("");
  const [keplrSig, setKeplrSig] = useState("");
  const [normalSig, setNormalSig] = useState("");

  // We have to run all Keplr logic in useEffect,
  // so we can ensure it has been injected.
  useEffect(() => {
    (async () => {
      // First check if Keplr exists.
      if (window.keplr) {
        // Connect to Cosmos Hub.
        await window.keplr.enable("cosmoshub");
        const signer = window.keplr.getOfflineSigner("cosmoshub");
        const account = (await signer.getAccounts())[0];
        setAddy(account.address);

        // Sign message using Keplr.
        res = await window.keplr.signArbitrary(
          "cosmoshub",
          account.address,
          msg
        );
        setKeplrSig(res.signature);

        // Sign message using wallet.
        setNormalSig(await signWithWallet());
      }
    })();
  }, []);

  return (
    <>
      <p>{addy}</p>
      <p>{keplrSig}</p>
      <p>{normalSig}</p>
    </>
  );
};

export default Home;
