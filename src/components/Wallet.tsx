import * as React from "react";
import * as TezosRPCTypes from "conseiljs/dist/types/tezos/TezosRPCResponseTypes";
import {TezosNodeReader} from "conseiljs";
import {useContext, useEffect, useState} from "react";
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
    const {globalState } = useContext(GlobalContext);
    const [walletState, setWalletState] = useState(initialState);

    useEffect(() => {
        fetchAccountInfo().then(r => r)
    }, [globalState]);

    async function fetchAccountInfo() {
        const account: TezosRPCTypes.Contract = await TezosNodeReader.getAccountForBlock(
            globalState.tezosServer,
            "head",
            globalState.address);
        setWalletState(
            {
                ...walletState,
                balance: account.balance,
                delegate: account.delegate
            }
        )
    }

    return (
            <div>
                <h1>Wallet</h1>
                <p>Delegate: {walletState.delegate}</p>
                <p>XTZ Balance: {walletState.balance}</p>
                <p>USDtz Balance: N/A</p>
                <button onClick={() => fetchAccountInfo()}>Update</button>
            </div>
    );
}