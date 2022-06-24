import * as React from "react";
import {useContext, useState} from "react";
import { Action, ActionTypes } from "../context/AppReducer";
import {GlobalContext} from "../context/GlobalState";

export function Settings() {
    const {globalState, dispatch } = useContext(GlobalContext);
    const [tezosServer, setTezosServer] = useState(globalState.tezosServer);
    const [apiKey, setApiKey] = useState(globalState.apiKey);
    const [network, setNetwork] = useState(globalState.network);
    const [derivationPath, setDerivationPath] = useState(globalState.network);
    const [address] = useState(globalState.address);
    
    const handleSettingsUpdateClick = () => {
        const action: Action = {
            type: ActionTypes.UpdateSettings,
            newTezosServer: tezosServer,
            newApiKey: apiKey,
            newNetwork: network,
            newAddress: address,
            newDerivationPath: derivationPath
        }
        dispatch(action);
    }
        
    return (
        <div id={"settings"}>
            <h1>Settings</h1>
            <p>Tezos Node</p>

            <input 
            id={"settings_tezosNode"} 
            defaultValue={globalState.tezosServer}
            onChange={(e: React.FormEvent<HTMLInputElement>) => { setTezosServer(e.currentTarget.value)}}
             />

            <p>Nautilus API Key</p>
            <input 
            id={"settings_apikey"} 
            defaultValue={globalState.apiKey}
            onChange={(e: React.FormEvent<HTMLInputElement>) => { setApiKey(e.currentTarget.value)}}
            />
            <p>Network</p>
            <input 
            id={"settings_network"} 
            defaultValue={globalState.network}
            onChange={(e: React.FormEvent<HTMLInputElement>) => { setNetwork(e.currentTarget.value)}}
            />
            <p>Derivation Path</p>
            <input 
            id={"settings_derivationPath"} 
            defaultValue={globalState.derivationPath}
            onChange={(e: React.FormEvent<HTMLInputElement>) => { setDerivationPath(e.currentTarget.value)}}
            />
            <p>
            <button onClick={() => handleSettingsUpdateClick()}>
                    Update
            </button>
            </p>
        </div>
    );
}