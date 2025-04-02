import {
  AccountData,
  buildTransactionRequest,
  ComponentAddress,
  fromWorkspace,
  Network,
  submitAndWaitForTransaction,
  TariSigner,
  TariUniverseSigner,
  Transaction,
  TransactionBuilder,
  TransactionResult,
  WalletConnectTariSigner,
} from "@tari-project/tarijs-all";

export const FEE_AMOUNT = "10000";
export const AMOUNT: number = 1223;
export const INIT_SUPPLY: number = 1000000;
export const NETWORK = Network.Igor;
export const XTR_ADDRESS =
  "component_0102030000000000000000000000000000000000000000000000000000000000";

export async function takeFreeTestnetTokens(
  signer: TariSigner
): Promise<AccountData> {
  const resp = await (
    signer as WalletConnectTariSigner | TariUniverseSigner
  ).createFreeTestCoins();

  return resp;
}

export async function takeFreeTokens(
  signer: TariSigner,
  componentAddress: ComponentAddress,
  amount = AMOUNT
): Promise<TransactionResult> {
  const account = await signer.getAccount();
  const builder = new TransactionBuilder();

  const required_substates = [{ substate_id: account.address }];

  const tx: Transaction = builder
    .callMethod(
      {
        componentAddress: componentAddress,
        methodName: "take_free_tokens",
      },
      [amount]
    )
    .saveVar("tokens")
    .callMethod({ methodName: "deposit", componentAddress: account.address }, [
      fromWorkspace("tokens"),
    ])
    .feeTransactionPayFromComponent(account.address, FEE_AMOUNT)
    .build();

  const req = buildTransactionRequest(
    tx,
    account.account_id,
    required_substates,
    [],
    false,
    NETWORK
  );
  const { response, result } = await submitAndWaitForTransaction(signer, req);

  if (result.status === 3) {
    console.log("✅ [tapp] tx accepted result", result);
  } else {
    console.log("❌ [tapp] tx rejected result", result);
  }
  if (!response) throw new Error("Failed to create token: no response found");

  return result;
}

export async function createToken(
  provider: TariSigner,
  tokenTemplateAddress: string,
  initSupply = INIT_SUPPLY,
  token_symbol = "TOKEN"
): Promise<TransactionResult> {
  const account = await provider.getAccount();
  const builder = new TransactionBuilder();

  const tx: Transaction = builder
    .feeTransactionPayFromComponent(account.address, FEE_AMOUNT)
    .callFunction(
      {
        functionName: "mint",
        templateAddress: tokenTemplateAddress,
      },
      [initSupply, token_symbol]
    )
    .build();

  const required_substates = [{ substate_id: account.address }];
  const req = buildTransactionRequest(
    tx,
    account.account_id,
    required_substates,
    [],
    false,
    NETWORK
  );
  const submitTxResult = await submitAndWaitForTransaction(provider, req);

  const { result } = submitTxResult;

  if (result.status === 3) {
    console.log("✅ [tapp] tx accepted result", result);
  } else {
    console.log("❌ [tapp] tx rejected result", result);
  }

  return result;
}
