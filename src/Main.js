import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { goerli, useAccount, useConnect, useSigner } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import messageStoreAbi from "./MessageStore.json";

// Change this variable with your contract address
const messageStoreContractAddress =
  "0xe15563a4D9E6bcE33f37FB10A81C90D45c96A90c";

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
        messageStoreContractAddress,
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
            messageStoreContractAddress,
            messageStoreAbi,
            signer
          );

          // Run the tx
          const tx = await messageStoreContract.updateData(text);
          // tx.wait() is a function to return the receipt of the tx above
          const receipt = await tx.wait();

          // receipt returns a variable called status
          // a status of 1 means that the transaction is successful
          // if the status is 0, it means it was reverted
          // the code below checks if the tx was successful
          // if it is equal to 1, update the data variable
          if (receipt.status === 1) {
            await updateData();
          }
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
