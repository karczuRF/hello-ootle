import "./App.css";
import { TariConnectButton } from "./connect/TariConnectButton";
import useTariSigner from "./store/signer";
import useAccount from "./store/account";
import tariLogo from "./assets/tari.svg";

function App() {
  const { Signer } = useTariSigner();
  const { ootleAccount, setOotleAccount } = useAccount();
  const handleOnConnected = async () => {
    await setOotleAccount();
  };

  return (
    <>
      <div>
        <a href="https://www.tari.com/" target="_blank">
          <img src={tariLogo} className="logo tari" alt="Tari logo" />
        </a>
      </div>
      <h1>Hello Tari Ootle</h1>
      <TariConnectButton onConnected={handleOnConnected} />
      <div style={{ paddingLeft: "10px" }}>
        {`Signer: ${
          Signer?.isConnected() ? Signer.signerName : "not connected"
        }`}
      </div>
      <div style={{ paddingLeft: "10px" }}>
        {ootleAccount?.address &&
          `Account: ${
            ootleAccount ? ootleAccount?.address : "address not found"
          }`}
      </div>
    </>
  );
}

export default App;
