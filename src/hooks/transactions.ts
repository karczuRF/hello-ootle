import {
  AccountData,
  Amount,
  buildTransactionRequest,
  ComponentAddress,
  Network,
  submitAndWaitForTransaction,
  TariSigner,
  TariUniverseSigner,
  TransactionBuilder,
  TransactionResult,
  txResultCheck,
  WalletConnectTariSigner,
} from "@tari-project/tarijs-all";

export const FEE_AMOUNT = 10000;
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
  const builder = new TransactionBuilder(NETWORK);
  const fee = new Amount(FEE_AMOUNT);

  const tx = builder
    .callMethod(
      {
        componentAddress: componentAddress,
        methodName: "take_free_tokens",
      },
      [amount]
    )
    .saveVar("tokens")
    .callMethod({ methodName: "deposit", componentAddress: account.address }, [
      [{ Workspace: "tokens" }],
    ])
    .feeTransactionPayFromComponent(account.address, fee)
    .buildUnsignedTransaction();

  const req = buildTransactionRequest(tx, account.account_id);
  const { result } = await submitAndWaitForTransaction(signer, req);

  if (txResultCheck.isAccept(result)) {
    console.log("✅ [tapp] tx accepted result", result);
  } else {
    console.log("❌ [tapp] tx rejected result", result);
  }
  if (!result) throw new Error("Failed to create token: no response found");

  return result.result;
}

export async function createToken(
  provider: TariSigner,
  tokenTemplateAddress: string,
  initSupply = INIT_SUPPLY,
  token_symbol = "TOKEN"
): Promise<TransactionResult> {
  const account = await provider.getAccount();
  const builder = new TransactionBuilder(NETWORK);
  const fee = new Amount(FEE_AMOUNT);

  const tx = builder
    .feeTransactionPayFromComponent(account.address, fee)
    .callFunction(
      {
        functionName: "mint",
        templateAddress: tokenTemplateAddress,
      },
      [initSupply, token_symbol]
    )
    .buildUnsignedTransaction();

  const req = buildTransactionRequest(tx, account.account_id);
  const { result } = await submitAndWaitForTransaction(provider, req);

  if (txResultCheck.isAccept(result)) {
    console.log("✅ [tapp] tx accepted result", result);
  } else {
    console.log("❌ [tapp] tx rejected result", result);
  }
  if (!result) throw new Error("Failed to create token: no response found");

  return result.result;
}
