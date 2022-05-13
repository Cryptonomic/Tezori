import * as React from "react";
import * as TezosRPCTypes from "conseiljs/dist/types/tezos/TezosRPCResponseTypes";
import {TezosNodeReader} from "conseiljs";
import {useContext, useState} from "react";
import {GlobalContext} from "../context/GlobalState";

type WalletState = {
    publicKey: string,
    balance: string,
    delegate: string | undefined,
    balance_usdtz: string
}

const initialState: WalletState = {
    publicKey: "",
    balance: "",
    delegate: "",
    balance_usdtz: ""
}

export function Wallet() {
    const {state } = useContext(GlobalContext);
    const [walletState, setWalletState] = useState(initialState);

    async function fetchAccountInfo(address: string, tezosNode: string) {
        const account: TezosRPCTypes.Contract = await TezosNodeReader.getAccountForBlock(tezosNode, "head", address);
        setWalletState(
            {
                ...walletState,
                balance: account.balance,
                delegate: account.delegate
            }
        )
    }

    return (
            <div onLoad={() => fetchAccountInfo(state.address, state.tezosServer)}>
                <h1>Wallet</h1>
                <p>Delegate: {walletState.delegate}</p>
                <p>XTZ Balance: {walletState.balance}</p>
                <p>USDtz Balance: N/A</p>
                <button onClick={() => fetchAccountInfo(state.address, state.tezosServer)}>Update</button>
            </div>
    );
}