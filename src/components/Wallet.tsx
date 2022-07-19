import * as React from "react";
import * as TezosRPCTypes from "conseiljs/dist/types/tezos/TezosRPCResponseTypes";
import {TezosNodeReader} from "conseiljs";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../context/GlobalState";
import {useSearchParams} from "react-router-dom";

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
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {

        const fetchAccountInfo = async () => {
            const account: TezosRPCTypes.Contract = await TezosNodeReader.getAccountForBlock(
                globalState.tezosServer,
                "head",
                globalState.address);
            setWalletState( (w) => (
                {
                    ...w,
                    balance: account.balance,
                    delegate: account.delegate
                }
                )
            )
        }

        fetchAccountInfo().then(r => r);
    }, [globalState]);

    useEffect( () => {
        if(!searchParams.has("a"))
            setSearchParams({a: globalState.address});
        else if(searchParams.has("a") && searchParams.get("a") !== globalState.address)
        {
            setSearchParams({a: globalState.address});
        }
    }, [globalState, setSearchParams, searchParams])

    return (
            <div>
                <h1>Wallet</h1>
                <p>Address: {globalState.address}</p>
                <p>Delegate: {walletState.delegate}</p>
                <p>XTZ Balance: {walletState.balance}</p>
            </div>
    );
}
