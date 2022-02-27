import { Secp256k1HdWallet } from "@cosmjs/amino";
import { key, msg } from "./constants";

export const signWithWallet = async (): Promise<string> => {
  // Initialise signer.
  const signer = await Secp256k1HdWallet.fromMnemonic(key);
  const account = (await signer.getAccounts())[0];

  // Create the document for signing.
  const signDoc = {
    chain_id: "",
    account_number: "0",
    sequence: "0",
    fee: {
      gas: "0",
      amount: [],
    },
    msgs: [
      {
        type: "sign/MsgSignData",
        value: {
          signer: account.address,
          data: Buffer.from(msg).toString("base64"),
        },
      },
    ],
    memo: "",
  };

  // Sign message and return.
  const res = await signer.signAmino(account.address, signDoc);
  return res.signature.signature;
};
