import "./App.css";
import { TariConnectButton } from "./connect/TariConnectButton";
import useTariProvider from "./store/provider";
import useAccount from "./store/account";
import tariLogo from "./assets/tari.svg";

function App() {
  const { provider } = useTariProvider();
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
        {`Provider: ${
          provider?.isConnected() ? provider.providerName : "not connected"
        }`}
      </div>
      <div style={{ paddingLeft: "10px" }}>
        {`Account: ${ootleAccount ? ootleAccount?.address : "not found"}`}
      </div>
    </>
  );
}

export default App;
