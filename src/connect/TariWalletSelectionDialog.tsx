import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TariLogo from "./content/tari-logo.svg";
import WalletConnectLogo from "./content/walletconnect-logo.svg";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  permissions,
  TariSigner,
  TariUniverseSigner,
  TariUniverseSignerParameters,
} from "@tari-project/tarijs-all";
import {
  WalletDaemonFetchParameters,
  WalletDaemonTariSigner,
} from "@tari-project/wallet-daemon-signer";
import { WalletConnectTariSigner } from "@tari-project/wallet-connect-signer";

const {
  TariPermissionAccountInfo,
  TariPermissionKeyList,
  TariPermissions,
  TariPermissionSubstatesRead,
  TariPermissionTemplatesRead,
  TariPermissionTransactionsGet,
} = permissions;

const WALLET_CONNECT_PROJECT_ID =
  import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || null;
const WALLET_DAEMON_ENABLED =
  import.meta.env.VITE_WALLET_DAEMON_ENABLED || false;
const TARI_UNIVERSE_ENABLED =
  import.meta.env.VITE_TARI_UNIVERSE_ENABLED || false;
const WALLET_DAEMON_JRPC =
  import.meta.env.VITE_WALLET_DAEMON_JRPC || "http://127.0.0.1:12009/json_rpc";

// Minimal permissions for the example site
// But each application will have different permission needs
const walletDaemonPermissions = new TariPermissions();
walletDaemonPermissions
  // Required for createFreeTestCoins
  .addPermission("Admin")
  .addPermission(new TariPermissionKeyList())
  .addPermission(new TariPermissionAccountInfo())
  .addPermission(new TariPermissionTransactionsGet())
  .addPermission(new TariPermissionSubstatesRead())
  .addPermission(new TariPermissionTemplatesRead());
const walletDaemonOptionalPermissions = new TariPermissions();

export interface WalletSelectionProps {
  open: boolean;
  onConnected: (Signer: TariSigner) => void;
  onClose: () => void;
}

export function TariWalletSelectionDialog(props: WalletSelectionProps) {
  const { onClose, open, onConnected } = props;

  const handleClose = () => {
    onClose();
  };

  const onWalletDaemonClick = async () => {
    const params: WalletDaemonFetchParameters = {
      permissions: walletDaemonPermissions,
      optionalPermissions: walletDaemonOptionalPermissions,
      serverUrl: WALLET_DAEMON_JRPC,
    };
    const walletDaemonSigner = await WalletDaemonTariSigner.buildFetchSigner(
      params
    );
    onConnected(walletDaemonSigner);
    handleClose();
  };

  const onWalletConnectClick = async () => {
    const projectId = WALLET_CONNECT_PROJECT_ID;
    const walletConnectSigner = new WalletConnectTariSigner(projectId);
    handleClose();
    await walletConnectSigner.connect();
    onConnected(walletConnectSigner);
  };

  const onTariUniverseClick = async () => {
    const params: TariUniverseSignerParameters = {
      permissions: walletDaemonPermissions,
      optionalPermissions: walletDaemonOptionalPermissions,
    };
    const Signer = new TariUniverseSigner(params);
    onConnected(Signer);
    handleClose();
  };

  return (
    <Dialog fullWidth={true} onClose={handleClose} open={open}>
      <Box sx={{ padding: 4, borderRadius: 4 }}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Typography style={{ fontSize: 24 }}>Connect a wallet</Typography>
          <IconButton aria-label="copy" onClick={handleClose}>
            <CloseIcon style={{ fontSize: 24 }} />
          </IconButton>
        </Stack>
        <Divider sx={{ mt: 3, mb: 3 }} variant="middle" />
        <Grid container spacing={2} justifyContent="center">
          <Grid container rowSpacing={1} columnSpacing={{ xs: 4 }}>
            <WalletConnectionMethodCard
              img={WalletConnectLogo}
              text="WalletConnect"
              callback={onWalletConnectClick}
            ></WalletConnectionMethodCard>
          </Grid>
          {WALLET_DAEMON_ENABLED && (
            <Grid container rowSpacing={1} columnSpacing={{ xs: 4 }}>
              <WalletConnectionMethodCard
                img={TariLogo}
                text="Tari Wallet Daemon"
                callback={onWalletDaemonClick}
              ></WalletConnectionMethodCard>
            </Grid>
          )}
          {TARI_UNIVERSE_ENABLED && (
            <Grid container rowSpacing={1} columnSpacing={{ xs: 4 }}>
              <WalletConnectionMethodCard
                img={TariLogo}
                text="Tari Universe"
                callback={onTariUniverseClick}
              ></WalletConnectionMethodCard>
            </Grid>
          )}
        </Grid>
      </Box>
    </Dialog>
  );
}

function WalletConnectionMethodCard({
  img,
  text,
  callback,
}: {
  img: string;
  text: string;
  callback: () => void;
}) {
  return (
    <Card
      variant="outlined"
      elevation={0}
      sx={{
        mty: 4,
        padding: 4,
        borderRadius: 4,
        width: "175px",
        height: "175px",
        cursor: "pointer",
      }}
    >
      <CardContent
        onClick={async () => {
          await callback();
        }}
      >
        <Stack direction="column" spacing={2} alignItems="center">
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <img
              style={{ borderRadius: 8, width: "50px", height: "50px" }}
              src={img}
            />
          </Box>
          <Typography textAlign="center">{text}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
