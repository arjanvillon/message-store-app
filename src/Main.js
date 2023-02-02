import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  goerli,
  useAccount,
  useConnect,
  useDisconnect,
  useSigner,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import messageStoreAbi from "./MessageStore.json";

const Main = () => {
  const [text, setText] = useState("");
  const [data, setData] = useState("");
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector({ chains: [goerli] }),
  });
  const { data: signer } = useSigner();

  const updateData = async () => {
    if (signer) {
      const messageStoreContract = new ethers.Contract(
        "0xe15563a4D9E6bcE33f37FB10A81C90D45c96A90c",
        messageStoreAbi,
        signer
      );
      const viewedData = await messageStoreContract.viewData();
      setData(viewedData);
    }
  };

  useEffect(() => {
    // useEffect runs at the beginning of the page load
    updateData();
  }, [signer]);

  return (
    <div>
      {isConnected && <p>{address}</p>}
      <button onClick={() => connect()}>Connect</button>

      <form
        onSubmit={async (evt) => {
          evt.preventDefault();
          const messageStoreContract = new ethers.Contract(
            "0xe15563a4D9E6bcE33f37FB10A81C90D45c96A90c",
            messageStoreAbi,
            signer
          );
          await messageStoreContract.updateData(text);
          await updateData();
        }}
      >
        <input
          type="text"
          onChange={(evt) => {
            setText(evt.target.value);
          }}
        />
        <button type="submit">Submit</button>
        <p>Current Data: {data} </p>
      </form>
    </div>
  );
};

export default Main;
