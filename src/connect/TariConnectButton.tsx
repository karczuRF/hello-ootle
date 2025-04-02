import * as React from "react";

import Button from "@mui/material/Button";
import TariLogoWhite from "./content/tari-logo-white.svg";
import { TariWalletSelectionDialog } from "./TariWalletSelectionDialog";
import useTariSigner from "../store/signer.ts";
import { TariSigner } from "@tari-project/tarijs-all";

interface Props {
  onConnected?: (Signer: TariSigner) => void;
}

export function TariConnectButton(props: Props) {
  const { signer, setSigner } = useTariSigner();
  const { onConnected } = props;
  const [walletSelectionOpen, setWalletSelectionOpen] = React.useState(false);

  const handleConnectClick = () => {
    setWalletSelectionOpen(true);
  };

  const onWalletSelectionClose = () => {
    setWalletSelectionOpen(false);
  };

  const handleOnConnected = (Signer: TariSigner) => {
    setSigner(Signer);
    onConnected?.(Signer);
  };

  return (
    <>
      <Button variant="contained" onClick={handleConnectClick}>
        <img width="30px" height="30px" src={TariLogoWhite} />
        <div style={{ paddingLeft: "10px" }}>
          {signer?.isConnected() ? "Connected" : "Connect"}
        </div>
      </Button>
      <TariWalletSelectionDialog
        open={walletSelectionOpen}
        onClose={onWalletSelectionClose}
        onConnected={handleOnConnected}
      />
    </>
  );
}
