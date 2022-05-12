import * as React from "react";
import * as TezosRPCTypes from "conseiljs/dist/types/tezos/TezosRPCResponseTypes";
import {TezosNodeReader} from "conseiljs";

export function Wallet() {
    return (
        <div id={"wallet"}>
            <div id={"accountInfo"}>
                <p>Public Key</p>
                <input id="publicKey" type={"text"} />
                <p>XTZ Balance</p>
                <input id={"balance"} type={"text"} />
                <p>USDtz Balance</p>
                <input id={"balance_usdtz"} type={"text"} />
            </div>
            <div id={"settings"}>
                <p>Tezos Node</p>
                <input id={"settings_tezosNode"}>https://tezos-ithaca.cryptonomic-infra.tech:443</input>
                <p>Nautilus API Key</p>
                <input id={"settings_apikey"}>ab682065-864a-4f11-bc77-0ef4e9493fa1</input>
            </div>
        </div>
    );
}

async function fetchAccountInfo(address: string, tezosNode: string) {
    const account: TezosRPCTypes.Contract = await TezosNodeReader.getAccountForBlock(tezosNode, "head", address);

}