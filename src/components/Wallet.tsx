import * as React from "react";
import * as TezosRPCTypes from "conseiljs/dist/types/tezos/TezosRPCResponseTypes";
import {TezosNodeReader} from "conseiljs";
import {useCallback, useContext, useEffect, useState} from "react";
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

    const fetchAccountInfo = useCallback( async() => {
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
        },
        [globalState, setWalletState, walletState]
    )

    useEffect(() => {
        fetchAccountInfo().then(r => r)
    }, [globalState, fetchAccountInfo]);

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