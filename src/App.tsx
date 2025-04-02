import "./App.css";
import { TariConnectButton } from "./connect/TariConnectButton";
import useTariSigner from "./store/signer";
import useAccount from "./store/account";
import tariLogo from "./assets/tari.svg";
import { Button, Paper, TextField } from "@mui/material";
import { createToken, takeFreeTestnetTokens } from "./hooks/transactions";
import { useState } from "react";

function App() {
  const { signer } = useTariSigner();
  const { ootleAccount, setOotleAccount } = useAccount();
  const [tokenTemplateAddress, setTokenTemplateAddress] = useState("");

  const handleTokenTemplateAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTokenTemplateAddress(event.target.value);
  };

  const handleOnConnected = async () => {
    await setOotleAccount();
  };

  const onCreateToken = async () => {
    if (!signer) return;
    const resp = await createToken(signer, tokenTemplateAddress);
    console.log("create tokens", resp);
  };

  const onClaimFreeTestnetTokens = async () => {
    if (!signer) return;
    const resp = await takeFreeTestnetTokens(signer);
    console.log("create tokens", resp);
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
        {`signer: ${
          signer?.isConnected() ? signer.signerName : "not connected"
        }`}
      </div>
      <div style={{ paddingLeft: "10px" }}>
        {ootleAccount?.address &&
          `Account: ${
            ootleAccount ? ootleAccount?.address : "address not found"
          }`}
      </div>
      {signer?.isConnected() && (
        <div style={{ padding: "20px" }}>
          <h2>Tokens</h2>
          <Paper
            style={{
              backgroundColor: "#213547",
              display: "grid",
              gridRowGap: "20px",
              padding: "20px",
              width: "100%",
              height: "100%",
            }}
          >
            <TextField
              label="Token template address"
              value={tokenTemplateAddress}
              onChange={handleTokenTemplateAddressChange}
            />
            <Button onClick={onCreateToken} variant={"outlined"}>
              {`Create Token`}
            </Button>
            <Button onClick={onClaimFreeTestnetTokens} variant={"outlined"}>
              {`Claim free testnet tokens`}
            </Button>
          </Paper>
        </div>
      )}
    </>
  );
}

export default App;
