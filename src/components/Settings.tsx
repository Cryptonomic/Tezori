import * as React from "react";
import {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";

export function Settings() {
    const {globalState } = useContext(GlobalContext);
    return (
        <div id={"settings"}>
            <h1>Settings</h1>
            <p>Tezos Node</p>
            <input id={"settings_tezosNode"} defaultValue={globalState.tezosServer} />
            <p>Nautilus API Key</p>
            <input id={"settings_apikey"} defaultValue={globalState.apiKey} />
            <p>Network</p>
            <input id={"settings_apikey"} defaultValue={globalState.network} />
        </div>
    );
}