//  Copyright 2022. The Tari Project
//
//  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
//  following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
//  disclaimer.
//
//  2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
//  following disclaimer in the documentation and/or other materials provided with the distribution.
//
//  3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote
//  products derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
//  INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
//  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
//  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
//  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
//  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
//  USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import { create } from "zustand";
import useTariSigner from "./signer.ts";
import {
  AccountData,
  substateIdToString,
  WalletConnectTariSigner,
} from "@tari-project/tarijs-all";

interface State {
  ootleAccount?: AccountData;
}

interface Actions {
  setOotleAccount: () => Promise<void>;
}

type OotleWalletStoreState = State & Actions;

const initialState: State = {
  ootleAccount: undefined,
};

export const useAccount = create<OotleWalletStoreState>()((set) => ({
  ...initialState,
  setOotleAccount: async () => {
    console.warn("Try to set the Ootle acc");
    const signer = useTariSigner.getState().signer;
    console.warn("Try to set the Ootle signer", signer);
    try {
      if (!signer) {
        return;
      }
      const account = await signer.getAccount();
      console.warn("Try to set the Ootle account: ", account);
      const wcsigner = signer as WalletConnectTariSigner;
      console.warn("🛜🛜 GET NFTS WALLETCONNECT PROVIDER: ", signer);
      const nft = await wcsigner.getNftsList({
        account: { ComponentAddress: substateIdToString(account.address) },
        limit: 20,
        offset: 0,
      });
      console.warn("🛜🛜 GET NFTS WALLETCONNECT: ", nft);
      set({
        ootleAccount: {
          account_id: account.account_id,
          address: account.address,
          public_key: account.public_key,
          resources: [],
        },
      });
    } catch (error) {
      console.error("Could not set the Ootle account: ", error);
    }
  },
}));

export default useAccount;
