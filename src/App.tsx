import "./App.css";
import {
  defaultPermissions,
  TariConnectButton as TCB,
} from "@tari-project/react-mui-connect-button";
import useTariSigner from "./store/signer";
import useAccount from "./store/account";
import tariLogo from "./assets/tari.svg";
import { Button, Paper, TextField } from "@mui/material";
import { createToken, takeFreeTestnetTokens } from "./hooks/transactions";
import { useCallback, useState } from "react";
import { TariConnectButton } from "./connect/TariConnectButton";
import { TariPermissions, permissions } from "@tari-project/tarijs-all";
const {
  TariPermissionKeyList,
  TariPermissionTransactionsGet,
  TariPermissionAccountInfo,
  TariPermissionSubstatesRead,
  TariPermissionTemplatesRead,
} = permissions;

function App() {
  const { signer } = useTariSigner();
  const { ootleAccount, setOotleAccount } = useAccount();
  const [tokenTemplateAddress, setTokenTemplateAddress] = useState("");

  const handleTokenTemplateAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTokenTemplateAddress(event.target.value);
  };

  const handleOnConnected = useCallback(async () => {
    console.log(
      "on connected: set the Ootle account with the signer: ",
      signer?.signerName
    );
    await setOotleAccount();
  }, [signer, setOotleAccount]);

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

  const WALLET_CONNECT_PROJECT_ID =
    import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || null;
  const wcParams = {
    projectId: WALLET_CONNECT_PROJECT_ID,
    requiredPermissions: defaultPermissions().getPermissions(),
  };
  // Minimal permissions for the example site
  // But each application will have different permission needs
  const walletTariPermissions = new TariPermissions();
  walletTariPermissions
    // Required for createFreeTestCoins
    .addPermission("Admin")
    .addPermission(new TariPermissionKeyList())
    .addPermission(new TariPermissionAccountInfo())
    .addPermission(new TariPermissionTransactionsGet())
    .addPermission(new TariPermissionSubstatesRead())
    .addPermission(new TariPermissionTemplatesRead());
  const walletOptionalPermissions = new TariPermissions();

  return (
    <>
      <div>
        <a href="https://www.tari.com/" target="_blank">
          <img src={tariLogo} className="logo tari" alt="Tari logo" />
        </a>
      </div>
      <h1>Hello Tari Ootle v1</h1>
      <TCB
        isConnected={signer?.isConnected() || false}
        onConnected={handleOnConnected}
        walletConnectParams={wcParams}
        tariUniverseParams={{
          permissions: walletTariPermissions,
          optionalPermissions: walletOptionalPermissions,
        }}
      />
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
              {`Get balance`}
            </Button>
            <Button onClick={onCreateToken} variant={"outlined"}>
              {`Create Token`}
            </Button>
            <Button onClick={onClaimFreeTestnetTokens} variant={"outlined"}>
              {`Claim free testnet tokens`}
            </Button>
            <Button onClick={onCreateToken} variant={"outlined"}>
              {`Send data`}
            </Button>
          </Paper>
        </div>
      )}
    </>
  );
}

export default App;
